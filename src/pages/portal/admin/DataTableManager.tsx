import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Trash2, Upload, Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

type ColumnDef = {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "boolean";
};

type DataRow = {
  id: string;
  data: Record<string, unknown>;
  created_at: string;
};

export default function DataTableManager() {
  const { id: companyServiceId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [serviceName, setServiceName] = useState("");
  const [columns, setColumns] = useState<ColumnDef[]>([]);
  const [rows, setRows] = useState<DataRow[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  // Row editing
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingRow, setEditingRow] = useState<DataRow | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // CSV upload
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!companyServiceId) return;
    fetchServiceInfo();
  }, [companyServiceId]);

  useEffect(() => {
    if (!companyServiceId || columns.length === 0) return;
    fetchRows();
  }, [companyServiceId, page, columns]);

  const fetchServiceInfo = async () => {
    const { data } = await supabase
      .from("company_services")
      .select("name, config, services(name)")
      .eq("id", companyServiceId!)
      .single();

    if (data) {
      const svc = data.services as unknown as { name: string } | null;
      setServiceName((data as any).name || svc?.name || "Tabela de Dados");
      const cfg = (data.config ?? {}) as Record<string, unknown>;
      const cols = (cfg.columns as ColumnDef[]) ?? [];
      setColumns(cols);
    }
    setLoading(false);
  };

  const fetchRows = async () => {
    const from = page * pageSize;
    const to = from + pageSize - 1;

    const { data, count } = await supabase
      .from("data_table_rows")
      .select("id, data, created_at", { count: "exact" })
      .eq("company_service_id", companyServiceId!)
      .order("created_at", { ascending: false })
      .range(from, to);

    setRows((data ?? []) as unknown as DataRow[]);
    setTotalCount(count ?? 0);
  };

  const openAddDialog = () => {
    const empty: Record<string, string> = {};
    columns.forEach((c) => { empty[c.key] = ""; });
    setFormData(empty);
    setEditingRow(null);
    setEditDialogOpen(true);
  };

  const openEditDialog = (row: DataRow) => {
    const fd: Record<string, string> = {};
    columns.forEach((c) => { fd[c.key] = row.data[c.key] != null ? String(row.data[c.key]) : ""; });
    setFormData(fd);
    setEditingRow(row);
    setEditDialogOpen(true);
  };

  const handleSaveRow = async () => {
    if (!companyServiceId) return;
    setSaving(true);

    // Convert form values to proper types
    const rowData: Record<string, unknown> = {};
    for (const col of columns) {
      const raw = formData[col.key] ?? "";
      if (col.type === "number") {
        rowData[col.key] = raw === "" ? null : Number(raw.replace(",", "."));
      } else if (col.type === "boolean") {
        rowData[col.key] = raw.toLowerCase() === "true" || raw === "1" || raw.toLowerCase() === "sim";
      } else {
        rowData[col.key] = raw || null;
      }
    }

    if (editingRow) {
      const { error } = await supabase
        .from("data_table_rows")
        .update({ data: rowData as unknown as Json })
        .eq("id", editingRow.id);
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else toast({ title: "Registro atualizado!" });
    } else {
      const { error } = await supabase
        .from("data_table_rows")
        .insert({ company_service_id: companyServiceId, data: rowData as unknown as Json });
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else toast({ title: "Registro adicionado!" });
    }

    setSaving(false);
    setEditDialogOpen(false);
    fetchRows();
  };

  const handleDeleteRow = async (id: string) => {
    const { error } = await supabase.from("data_table_rows").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Registro excluído" }); fetchRows(); }
  };

  const handleDeleteAll = async () => {
    if (!companyServiceId) return;
    const { error } = await supabase
      .from("data_table_rows")
      .delete()
      .eq("company_service_id", companyServiceId);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Todos os registros excluídos" }); setPage(0); fetchRows(); }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !companyServiceId) return;

    setUploading(true);
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter((l) => l.trim());

    if (lines.length < 2) {
      toast({ title: "CSV vazio", description: "O arquivo precisa ter cabeçalho e pelo menos 1 linha de dados.", variant: "destructive" });
      setUploading(false);
      return;
    }

    const headerLine = lines[0];
    const csvHeaders = parseCsvLine(headerLine);

    // Map CSV headers to column keys (by label or key match)
    const headerMap: (string | null)[] = csvHeaders.map((h) => {
      const trimmed = h.trim().toLowerCase();
      const match = columns.find(
        (c) => c.key.toLowerCase() === trimmed || c.label.toLowerCase() === trimmed
      );
      return match?.key ?? null;
    });

    const insertRows: { company_service_id: string; data: Json }[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCsvLine(lines[i]);
      const rowData: Record<string, unknown> = {};

      headerMap.forEach((colKey, idx) => {
        if (!colKey) return;
        const raw = (values[idx] ?? "").trim();
        const col = columns.find((c) => c.key === colKey);

        if (col?.type === "number") {
          rowData[colKey] = raw === "" ? null : Number(raw.replace(",", "."));
        } else if (col?.type === "boolean") {
          rowData[colKey] = raw.toLowerCase() === "true" || raw === "1" || raw.toLowerCase() === "sim";
        } else {
          rowData[colKey] = raw || null;
        }
      });

      insertRows.push({
        company_service_id: companyServiceId,
        data: rowData as unknown as Json,
      });
    }

    // Insert in batches of 500
    let inserted = 0;
    for (let i = 0; i < insertRows.length; i += 500) {
      const batch = insertRows.slice(i, i + 500);
      const { error } = await supabase.from("data_table_rows").insert(batch);
      if (error) {
        toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
        break;
      }
      inserted += batch.length;
    }

    toast({ title: `${inserted} registro(s) importados com sucesso!` });
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    setPage(0);
    fetchRows();
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PortalLayout>
    );
  }

  if (columns.length === 0) {
    return (
      <PortalLayout>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="font-display text-2xl font-bold text-foreground">{serviceName}</h1>
          </div>
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Configure as colunas primeiro na tela de serviços da empresa.
            </CardContent>
          </Card>
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-foreground">
              Dados - {serviceName}
            </h1>
            <p className="text-sm text-muted-foreground">{totalCount} registro(s)</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={openAddDialog}>
            <Plus className="h-4 w-4 mr-2" /> Adicionar Registro
          </Button>
          <div className="relative">
            <input
              ref={fileRef}
              type="file"
              accept=".csv"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleCsvUpload}
              disabled={uploading}
            />
            <Button variant="outline" disabled={uploading}>
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Importando..." : "Importar CSV"}
            </Button>
          </div>
          {totalCount > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                if (window.confirm(`Excluir todos os ${totalCount} registros?`)) handleDeleteAll();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" /> Limpar Dados
            </Button>
          )}
        </div>

        {/* Data Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={col.key}>{col.label}</TableHead>
                  ))}
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={columns.length + 1} className="text-center py-8 text-muted-foreground">
                      Nenhum registro. Adicione manualmente ou importe um CSV.
                    </TableCell>
                  </TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id}>
                      {columns.map((col) => (
                        <TableCell key={col.key} className="max-w-[300px] truncate">
                          {row.data[col.key] != null ? String(row.data[col.key]) : "—"}
                        </TableCell>
                      ))}
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEditDialog(row)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteRow(row.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
            </Button>
            <span className="text-sm text-muted-foreground">
              Página {page + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Próximo <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRow ? "Editar Registro" : "Novo Registro"}</DialogTitle>
            <DialogDescription>Preencha os campos abaixo.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {columns.map((col) => (
              <div key={col.key} className="space-y-1">
                <Label className="text-sm">{col.label}</Label>
                <Input
                  type={col.type === "number" ? "number" : col.type === "date" ? "date" : "text"}
                  value={formData[col.key] ?? ""}
                  onChange={(e) => setFormData((prev) => ({ ...prev, [col.key]: e.target.value }))}
                  placeholder={col.type === "boolean" ? "true/false" : ""}
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveRow} disabled={saving}>
              {saving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}

/** Minimal CSV line parser (handles quoted fields) */
function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === "," || ch === ";") {
        result.push(current);
        current = "";
      } else {
        current += ch;
      }
    }
  }
  result.push(current);
  return result;
}
