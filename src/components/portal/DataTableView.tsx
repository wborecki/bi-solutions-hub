import { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown, Search, Download, ChevronLeft, ChevronRight, RefreshCw, Clock } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

export type ColumnDef = {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "boolean";
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

    if ((isStale || force) && !cache?.refreshing) {
      setRefreshing(true);
      setRefreshError(null);

      const { data: result, error: fnError } = await supabase.functions.invoke(
        "query-client-db",
        { body: { company_service_id: companyServiceId, force } }
      );

      setRefreshing(false);

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
        // Re-fetch rows with fresh data
        fetchRows();
        return; // Skip the fetchRows below
      }
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

    // Column filters
    for (const [key, value] of Object.entries(filters)) {
      if (!value) continue;
      const col = columns.find((c) => c.key === key);
      if (!col) continue;
      const term = value.toLowerCase();
      result = result.filter((row) => {
        const val = row.data[key];
        if (val == null) return false;
        return String(val).toLowerCase().includes(term);
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
  }, [rows, searchTerm, filters, sortKey, sortDir, columns]);

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
    if (type === "date") {
      try {
        return new Date(String(value)).toLocaleDateString("pt-BR");
      } catch {
        return String(value);
      }
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

  return (
    <div className="space-y-4">
      {/* Cache info bar (external_db) */}
      {isExternalDb && (
        <div className="flex flex-wrap items-center gap-3 text-xs">
          {cacheInfo?.cached_at && (
            <span className="flex items-center gap-1 text-muted-foreground bg-muted px-2 py-1 rounded">
              <Clock className="h-3 w-3" />
              Atualizado {formatTimeAgo(cacheInfo.cached_at)}
            </span>
          )}
          {refreshing && (
            <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
              <RefreshCw className="h-3 w-3 animate-spin" />
              Sincronizando com banco externo...
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
            Atualizar agora
          </Button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar em todos os campos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {filterableCols.map((col) => (
          <Input
            key={col.key}
            placeholder={`Filtrar ${col.label}...`}
            value={filters[col.key] || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, [col.key]: e.target.value }))}
            className="w-[180px]"
          />
        ))}

        {config.allow_export && (
          <Button variant="outline" size="sm" onClick={exportCsv}>
            <Download className="h-4 w-4 mr-2" />
            Exportar CSV
          </Button>
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
      <div className="rounded-lg border bg-background">
        <Table>
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
