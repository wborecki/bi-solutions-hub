import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download, ChevronLeft, ChevronRight, RefreshCw, Clock, ExternalLink, CalendarIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Json } from "@/integrations/supabase/types";

export type ColumnDef = {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "boolean" | "link";
  filterable?: boolean;
  sortable?: boolean;
};

type DataTableConfig = {
  columns: ColumnDef[];
  row_limit?: number;
  page_size?: number;
  allow_export?: boolean;
  source?: "manual" | "external_db";
  cache_ttl_minutes?: number;
};

type DataRow = {
  id: string;
  data: Record<string, unknown>;
  created_at: string;
};

type CacheInfo = {
  cached_at: string | null;
  row_count: number;
  error: string | null;
  refreshing: boolean;
};

type SortDir = "asc" | "desc" | null;

interface DataTableViewProps {
  companyServiceId: string;
  config: DataTableConfig;
}

export function DataTableView({ companyServiceId, config }: DataTableViewProps) {
  const [rows, setRows] = useState<DataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Cache state (for external_db mode)
  const [cacheInfo, setCacheInfo] = useState<CacheInfo | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  // Pagination
  const pageSize = config.page_size || 25;
  const [page, setPage] = useState(0);

  // Sorting
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  // Filters
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [dateFilters, setDateFilters] = useState<Record<string, { from?: Date; to?: Date }>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const columns = config.columns || [];
  const rowLimit = config.row_limit || 10000;
  const isExternalDb = config.source === "external_db";

  const fetchRows = useCallback(async () => {
    setLoading(true);
    const from = page * pageSize;
    const to = Math.min(from + pageSize - 1, rowLimit - 1);

    const { data, count, error } = await supabase
      .from("data_table_rows")
      .select("id, data, created_at", { count: "exact" })
      .eq("company_service_id", companyServiceId)
      .range(from, to)
      .order("created_at", { ascending: false });

    if (!error) {
      setRows((data ?? []) as unknown as DataRow[]);
      setTotalCount(Math.min(count ?? 0, rowLimit));
    }
    setLoading(false);
  }, [companyServiceId, page, pageSize, rowLimit]);

  // Check cache and trigger refresh if needed (external_db mode)
  const checkAndRefresh = useCallback(async (force = false) => {
    if (!isExternalDb) return;

    // Fetch cache info
    const { data: cache } = await supabase
      .from("data_table_cache")
      .select("cached_at, row_count, error, refreshing")
      .eq("company_service_id", companyServiceId)
      .maybeSingle();

    if (cache) {
      setCacheInfo(cache as unknown as CacheInfo);
    }

    // Check if stale
    const ttlMs = (config.cache_ttl_minutes || 15) * 60 * 1000;
    const cachedAt = cache?.cached_at ? new Date(cache.cached_at).getTime() : 0;
    const isStale = Date.now() - cachedAt >= ttlMs;

    // If force (user clicked), ignore cache.refreshing flag (may be stuck)
    if ((isStale || force) && (force || !cache?.refreshing)) {
      setRefreshing(true);
      setRefreshError(null);

      try {
        const { data: result, error: fnError } = await supabase.functions.invoke(
          "query-client-db",
          { body: { company_service_id: companyServiceId, force } }
        );

        if (fnError) {
          setRefreshError(fnError.message || "Erro ao atualizar dados");
        } else if (result?.status === "error") {
          setRefreshError(result.error || "Erro na conexão com banco externo");
        } else if (result?.status === "refreshed") {
          setCacheInfo({
            cached_at: result.cached_at,
            row_count: result.row_count,
            error: null,
            refreshing: false,
          });
          fetchRows();
          setRefreshing(false);
          return;
        }
      } catch (err: unknown) {
        setRefreshError(err instanceof Error ? err.message : "Erro inesperado ao atualizar");
      }
      setRefreshing(false);
    }
  }, [companyServiceId, config.cache_ttl_minutes, isExternalDb, fetchRows]);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  // For external_db, check cache after initial load
  useEffect(() => {
    if (isExternalDb) {
      checkAndRefresh();
    }
  }, [companyServiceId]); // only on mount / service change

  // Apply client-side filters and sorting to fetched rows
  const processedRows = useMemo(() => {
    let result = [...rows];

    // Global search
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter((row) =>
        columns.some((col) => {
          const val = row.data[col.key];
          return val != null && String(val).toLowerCase().includes(term);
        })
      );
    }

    // Column filters (exact match from picklist)
    for (const [key, value] of Object.entries(filters)) {
      if (!value) continue;
      result = result.filter((row) => {
        const val = row.data[key];
        if (val == null) return false;
        return String(val) === value;
      });
    }

    // Date range filters
    for (const [key, range] of Object.entries(dateFilters)) {
      if (!range.from && !range.to) continue;
      result = result.filter((row) => {
        const val = row.data[key];
        if (val == null) return false;
        const d = new Date(String(val));
        if (isNaN(d.getTime())) return false;
        if (range.from) {
          const fromStart = new Date(range.from);
          fromStart.setHours(0, 0, 0, 0);
          if (d < fromStart) return false;
        }
        if (range.to) {
          const toEnd = new Date(range.to);
          toEnd.setHours(23, 59, 59, 999);
          if (d > toEnd) return false;
        }
        return true;
      });
    }

    // Sorting
    if (sortKey && sortDir) {
      const col = columns.find((c) => c.key === sortKey);
      result.sort((a, b) => {
        const aVal = a.data[sortKey];
        const bVal = b.data[sortKey];
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        let cmp: number;
        if (col?.type === "number") {
          cmp = Number(aVal) - Number(bVal);
        } else if (col?.type === "date") {
          cmp = new Date(String(aVal)).getTime() - new Date(String(bVal)).getTime();
        } else {
          cmp = String(aVal).localeCompare(String(bVal), "pt-BR");
        }
        return sortDir === "desc" ? -cmp : cmp;
      });
    }

    return result;
  }, [rows, searchTerm, filters, dateFilters, sortKey, sortDir, columns]);

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortKey(null); setSortDir(null); }
      else setSortDir("asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const formatValue = (value: unknown, type: string) => {
    if (value == null) return "—";
    if (type === "boolean") return value ? "Sim" : "Não";
    if (type === "link") {
      const url = String(value).trim();
      if (!url) return "—";
      try {
        const parsed = new URL(url);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "—";
        return (
          <a
            href={parsed.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            Link
          </a>
        );
      } catch {
        return String(value);
      }
    }
    if (type === "date") {
      const raw = String(value).trim();
      if (!raw) return "—";
      let d = new Date(raw);
      // Handle dd/mm/yyyy or dd-mm-yyyy (common in BR/PT databases)
      if (isNaN(d.getTime())) {
        const parts = raw.split(/[\/\-\.]/);
        if (parts.length === 3) {
          const [a, b, c] = parts.map(Number);
          // dd/mm/yyyy
          if (a <= 31 && b <= 12 && c >= 100) {
            d = new Date(c, b - 1, a);
          // yyyy/mm/dd
          } else if (a >= 100 && b <= 12 && c <= 31) {
            d = new Date(a, b - 1, c);
          }
        }
      }
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("pt-BR");
      }
      return raw;
    }
    if (type === "number") {
      const num = Number(value);
      if (isNaN(num)) return String(value);
      return num.toLocaleString("pt-BR");
    }
    return String(value);
  };

  const exportCsv = () => {
    if (!config.allow_export) return;
    const header = columns.map((c) => c.label).join(",");
    const csvRows = processedRows.map((row) =>
      columns
        .map((col) => {
          const val = row.data[col.key];
          const str = val == null ? "" : String(val);
          // Escape CSV special characters
          if (str.includes(",") || str.includes('"') || str.includes("\n")) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        })
        .join(",")
    );
    const csv = [header, ...csvRows].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dados-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.ceil(totalCount / pageSize);
  const filterableCols = columns.filter((c) => c.filterable);

  // Compute unique values for each filterable column (from loaded rows)
  const filterOptions = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const col of filterableCols) {
      const unique = new Set<string>();
      for (const row of rows) {
        const val = row.data[col.key];
        if (val != null && String(val).trim() !== "") unique.add(String(val));
      }
      map[col.key] = Array.from(unique).sort((a, b) => a.localeCompare(b, "pt-BR"));
    }
    return map;
  }, [rows, filterableCols]);

  return (
    <div className="space-y-4">
      {/* Cache info bar (external_db) */}
      {isExternalDb && (
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {cacheInfo?.cached_at && !refreshing && (
            <span className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded">
              <Clock className="h-3 w-3" />
              Atualizado {formatTimeAgo(cacheInfo.cached_at)}
            </span>
          )}
          {refreshError && (
            <span className="text-destructive bg-destructive/10 px-2 py-1 rounded">
              Erro: {refreshError}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs"
            disabled={refreshing}
            onClick={() => checkAndRefresh(true)}
          >
            <RefreshCw className={`h-3 w-3 mr-1 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Sincronizando..." : "Atualizar agora"}
          </Button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground">&nbsp;</span>
          <div className="relative min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar em todos os campos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {filterableCols.map((col) =>
          col.type === "date" ? (
            <div key={col.key} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{col.label}</span>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[220px] justify-start text-left text-sm font-normal h-9",
                      !dateFilters[col.key]?.from && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilters[col.key]?.from
                      ? dateFilters[col.key]?.to
                        ? `${dateFilters[col.key].from!.toLocaleDateString("pt-BR")} - ${dateFilters[col.key].to!.toLocaleDateString("pt-BR")}`
                        : dateFilters[col.key].from!.toLocaleDateString("pt-BR")
                      : `Selecionar...`}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-2 flex items-center justify-between border-b">
                    <span className="text-xs font-medium">{col.label}</span>
                    {(dateFilters[col.key]?.from || dateFilters[col.key]?.to) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => setDateFilters((prev) => { const n = { ...prev }; delete n[col.key]; return n; })}
                      >
                        <X className="h-3 w-3 mr-1" /> Limpar
                      </Button>
                    )}
                  </div>
                  <Calendar
                    mode="range"
                    selected={
                      dateFilters[col.key]?.from
                        ? { from: dateFilters[col.key].from!, to: dateFilters[col.key].to }
                        : undefined
                    }
                    onSelect={(range) => {
                      if (!range) {
                        setDateFilters((prev) => { const n = { ...prev }; delete n[col.key]; return n; });
                      } else {
                        setDateFilters((prev) => ({ ...prev, [col.key]: { from: range.from, to: range.to } }));
                      }
                    }}
                    locale={undefined}
                    numberOfMonths={1}
                  />
                </PopoverContent>
              </Popover>
            </div>
          ) : (
            <div key={col.key} className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">{col.label}</span>
              <Select
                value={filters[col.key] || "__all__"}
                onValueChange={(v) => setFilters((prev) => ({ ...prev, [col.key]: v === "__all__" ? "" : v }))}
              >
                <SelectTrigger className="w-[180px] text-sm">
                  <SelectValue placeholder="Selecionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__all__">Todos</SelectItem>
                  {(filterOptions[col.key] ?? []).map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {col.type === "boolean"
                        ? opt === "true" || opt === "1" || opt.toLowerCase() === "sim" ? "Sim" : "Não"
                        : opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )
        )}

        {config.allow_export && (
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-muted-foreground">&nbsp;</span>
            <Button variant="outline" size="sm" onClick={exportCsv} className="h-9">
              <Download className="h-4 w-4 mr-2" />
              Exportar CSV
            </Button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {processedRows.length} de {totalCount} registro(s)
          {totalCount >= rowLimit && ` (limite: ${rowLimit.toLocaleString("pt-BR")})`}
        </span>
        {totalPages > 1 && (
          <span>
            Página {page + 1} de {totalPages}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-background overflow-x-auto">
        <Table className="min-w-[800px]">
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key}>
                  {col.sortable !== false ? (
                    <button
                      className="flex items-center gap-1 hover:text-foreground transition-colors"
                      onClick={() => toggleSort(col.key)}
                    >
                      {col.label}
                      {sortKey === col.key && sortDir === "asc" ? (
                        <ArrowUp className="h-3.5 w-3.5" />
                      ) : sortKey === col.key && sortDir === "desc" ? (
                        <ArrowDown className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <span className="text-muted-foreground">Carregando...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : processedRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              processedRows.map((row) => (
                <TableRow key={row.id}>
                  {columns.map((col) => (
                    <TableCell key={col.key}>
                      {formatValue(row.data[col.key], col.type)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Anterior
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
              let pageNum: number;
              if (totalPages <= 7) {
                pageNum = i;
              } else if (page < 3) {
                pageNum = i;
              } else if (page > totalPages - 4) {
                pageNum = totalPages - 7 + i;
              } else {
                pageNum = page - 3 + i;
              }
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  className="w-9 h-9 p-0"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum + 1}
                </Button>
              );
            })}
          </div>

          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          >
            Próximo
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "agora mesmo";
  if (mins < 60) return `há ${mins} min`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}
