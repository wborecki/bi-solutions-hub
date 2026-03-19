import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, ShieldCheck, ShieldAlert, Plus, Trash2, Table2, ExternalLink, DatabaseZap, ChevronDown, MessageSquare } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

type Service = { id: string; name: string; slug: string; type: string };

type ColumnDef = {
  key: string;
  label: string;
  type: "text" | "number" | "date" | "boolean" | "link";
  filterable?: boolean;
  sortable?: boolean;
  hidden?: boolean;
};

type InstanceEntry = {
  dbId?: string; // existing company_services row id
  name: string;
  embed_url: string;
  is_active: boolean;
  workspace_id: string;
  report_id: string;
  dataset_id: string;
  rls_role: string;
  looker_filters: string;
  // data_table fields
  dt_columns: ColumnDef[];
  dt_row_limit: number;
  dt_page_size: number;
  dt_allow_export: boolean;
  dt_default_sort_key: string;
  dt_default_sort_dir: "asc" | "desc";
  // external_db fields
  dt_source: "manual" | "external_db";
  dt_db_host: string;
  dt_db_port: number;
  dt_db_name: string;
  dt_db_user: string;
  dt_db_password: string;
  dt_db_query: string;
  dt_db_ssl: boolean;
  dt_cache_ttl_minutes: number;
  // observations fields
  dt_allow_observations: boolean;
  dt_observations_target: "local" | "external_db";
  dt_observations_table: string;
  dt_observations_column: string;
  dt_primary_key: string;
  admin_only: boolean;
  _deleted?: boolean;
};

const emptyInstance = (serviceName: string, index: number): InstanceEntry => ({
  name: index === 0 ? serviceName : `${serviceName} ${index + 1}`,
  embed_url: "",
  is_active: true,
  workspace_id: "",
  report_id: "",
  dataset_id: "",
  rls_role: "Reader",
  looker_filters: "",
  dt_columns: [],
  dt_row_limit: 5000,
  dt_page_size: 25,
  dt_allow_export: false,
  dt_default_sort_key: "",
  dt_default_sort_dir: "desc",
  dt_source: "external_db",
  dt_db_host: "",
  dt_db_port: 5432,
  dt_db_name: "",
  dt_db_user: "",
  dt_db_password: "",
  dt_db_query: "",
  dt_db_ssl: true,
  dt_cache_ttl_minutes: 15,
  dt_allow_observations: false,
  dt_observations_target: "local",
  dt_observations_table: "",
  dt_observations_column: "",
  dt_primary_key: "",
  admin_only: false,
});

export default function EmpresaServicos() {
  const { id: companyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  // Map<serviceId, InstanceEntry[]>
  const [instancesMap, setInstancesMap] = useState<Map<string, InstanceEntry[]>>(new Map());

  useEffect(() => {
    if (!companyId) return;
    const fetchData = async () => {
      const [companyRes, servicesRes, linkedRes] = await Promise.all([
        supabase.from("companies").select("name").eq("id", companyId).single(),
        supabase.from("services").select("*").order("name"),
        supabase.from("company_services").select("*").eq("company_id", companyId),
      ]);
      setCompanyName(companyRes.data?.name ?? "");
      const svcList = (servicesRes.data ?? []) as Service[];
      setServices(svcList);

      const map = new Map<string, InstanceEntry[]>();
      // Group existing company_services by service_id
      for (const cs of (linkedRes.data ?? [])) {
        const cfg = (cs.config ?? {}) as Record<string, unknown>;
        const entry: InstanceEntry = {
          dbId: cs.id,
          name: (cs as any).name || "",
          embed_url: cs.embed_url,
          is_active: cs.is_active,
          workspace_id: (cfg?.workspace_id as string) || "",
          report_id: (cfg?.report_id as string) || "",
          dataset_id: (cfg?.dataset_id as string) || "",
          rls_role: (cfg?.rls_role as string) || "Reader",
          looker_filters: cfg?.looker_filters ? JSON.stringify(cfg.looker_filters, null, 2) : "",
          dt_columns: Array.isArray(cfg?.columns) ? (cfg.columns as ColumnDef[]) : [],
          dt_row_limit: typeof cfg?.row_limit === "number" ? cfg.row_limit : 5000,
          dt_page_size: typeof cfg?.page_size === "number" ? cfg.page_size : 25,
          dt_allow_export: !!cfg?.allow_export,
          dt_default_sort_key: (cfg?.default_sort_key as string) || "",
          dt_default_sort_dir: (cfg?.default_sort_dir as string) === "asc" ? "asc" : "desc",
          dt_source: (cfg?.source as string) === "external_db" ? "external_db" : "manual",
          dt_db_host: (cfg?.db_host as string) || "",
          dt_db_port: typeof cfg?.db_port === "number" ? cfg.db_port : 5432,
          dt_db_name: (cfg?.db_name as string) || "",
          dt_db_user: (cfg?.db_user as string) || "",
          dt_db_password: (cfg?.db_password as string) || "",
          dt_db_query: (cfg?.db_query as string) || "",
          dt_db_ssl: cfg?.db_ssl !== false,
          dt_cache_ttl_minutes: typeof cfg?.cache_ttl_minutes === "number" ? cfg.cache_ttl_minutes : 15,
          dt_allow_observations: !!cfg?.allow_observations,
          dt_observations_target: (cfg?.observations_target as string) === "external_db" ? "external_db" : "local",
          dt_observations_table: (cfg?.observations_table as string) || "",
          dt_observations_column: (cfg?.observations_column as string) || "",
          dt_primary_key: (cfg?.primary_key as string) || "",
          admin_only: !!cfg?.admin_only,
        };
        const arr = map.get(cs.service_id) ?? [];
        arr.push(entry);
        map.set(cs.service_id, arr);
      }
      // Services without any instances get empty array
      for (const s of svcList) {
        if (!map.has(s.id)) map.set(s.id, []);
      }
      setInstancesMap(map);
      setLoading(false);
    };
    fetchData();
  }, [companyId]);

  const addInstance = (serviceId: string) => {
    setInstancesMap((prev) => {
      const next = new Map(prev);
      const arr = [...(next.get(serviceId) ?? [])];
      const svc = services.find((s) => s.id === serviceId);
      arr.push(emptyInstance(svc?.name ?? "Relatório", arr.length));
      next.set(serviceId, arr);
      return next;
    });
  };

  const removeInstance = (serviceId: string, index: number) => {
    setInstancesMap((prev) => {
      const next = new Map(prev);
      const arr = [...(next.get(serviceId) ?? [])];
      if (arr[index]?.dbId) {
        arr[index] = { ...arr[index], _deleted: true };
      } else {
        arr.splice(index, 1);
      }
      next.set(serviceId, arr);
      return next;
    });
  };

  const updateField = (serviceId: string, index: number, field: keyof InstanceEntry, value: string | boolean) => {
    setInstancesMap((prev) => {
      const next = new Map(prev);
      const arr = [...(next.get(serviceId) ?? [])];
      arr[index] = { ...arr[index], [field]: value };
      next.set(serviceId, arr);
      return next;
    });
  };

  const handleSave = async () => {
    if (!companyId) return;
    setSaving(true);

    let hasError = false;

    for (const [serviceId, instances] of instancesMap.entries()) {
      const svc = services.find((s) => s.id === serviceId);

      for (const inst of instances) {
        // Build config
        const config: Record<string, Json> = {};
        if (inst.admin_only) config.admin_only = true;
        if (svc?.type === "bi_embed") {
          if (inst.workspace_id) config.workspace_id = inst.workspace_id;
          if (inst.report_id) config.report_id = inst.report_id;
          if (inst.dataset_id) config.dataset_id = inst.dataset_id;
          if (inst.rls_role) config.rls_role = inst.rls_role;
        }
        if (svc?.type === "looker_embed" && inst.looker_filters) {
          try { config.looker_filters = JSON.parse(inst.looker_filters) as Json; } catch { /* ignore */ }
        }
        if (svc?.type === "data_table") {
          config.columns = inst.dt_columns as unknown as Json;
          config.row_limit = inst.dt_row_limit;
          config.page_size = inst.dt_page_size;
          config.allow_export = inst.dt_allow_export;
          if (inst.dt_default_sort_key) {
            config.default_sort_key = inst.dt_default_sort_key;
            config.default_sort_dir = inst.dt_default_sort_dir;
          }
          config.source = inst.dt_source;
          if (inst.dt_source === "external_db") {
            config.db_host = inst.dt_db_host;
            config.db_port = inst.dt_db_port;
            config.db_name = inst.dt_db_name;
            config.db_user = inst.dt_db_user;
            config.db_password = inst.dt_db_password;
            config.db_query = inst.dt_db_query;
            config.db_ssl = inst.dt_db_ssl;
            config.cache_ttl_minutes = inst.dt_cache_ttl_minutes;
          }
          config.allow_observations = inst.dt_allow_observations;
          if (inst.dt_allow_observations) {
            config.observations_target = inst.dt_observations_target;
            if (inst.dt_observations_target === "external_db") {
              config.observations_table = inst.dt_observations_table;
              config.observations_column = inst.dt_observations_column;
              config.primary_key = inst.dt_primary_key;
            }
          }
        }

        if (inst._deleted && inst.dbId) {
          const { error } = await supabase.from("company_services").delete().eq("id", inst.dbId);
          if (error) { console.error("Delete error:", error); hasError = true; toast({ title: "Erro ao excluir", description: error.message, variant: "destructive" }); }
        } else if (inst.dbId) {
          const { error } = await supabase.from("company_services").update({
            name: inst.name,
            embed_url: inst.embed_url,
            is_active: inst.is_active,
            config: config as unknown as Json,
          }).eq("id", inst.dbId);
          if (error) { console.error("Update error:", error); hasError = true; toast({ title: "Erro ao atualizar", description: error.message, variant: "destructive" }); }
        } else if (!inst._deleted) {
          const { error } = await supabase.from("company_services").insert({
            company_id: companyId,
            service_id: serviceId,
            name: inst.name,
            embed_url: inst.embed_url,
            is_active: inst.is_active,
            config: config as unknown as Json,
          });
          if (error) { console.error("Insert error:", error); hasError = true; toast({ title: "Erro ao criar serviço", description: error.message, variant: "destructive" }); }
        }
      }
    }

    setSaving(false);
    if (!hasError) {
      toast({ title: "Serviços da empresa atualizados!" });
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <>
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/portal/admin/empresas")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Serviços - {companyName}</h1>
            <p className="text-sm text-muted-foreground">Configure múltiplos relatórios por tipo de serviço</p>
          </div>
        </div>

        {services.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Cadastre serviços no catálogo primeiro.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {services.map((s) => {
              const instances = (instancesMap.get(s.id) ?? []).filter((i) => !i._deleted);
              const isPbi = s.type === "bi_embed";
              const isLooker = s.type === "looker_embed";
              const isDataTable = s.type === "data_table";
              const showEmbed = isPbi || isLooker;

              return (
                <Collapsible key={s.id} defaultOpen={instances.length <= 2}>
                  <Card>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <CollapsibleTrigger asChild>
                          <button type="button" className="flex items-center gap-2 text-left group">
                            <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-data-[state=open]:rotate-0 group-data-[state=closed]:-rotate-90" />
                            <div>
                              <p className="font-medium text-foreground">{s.name}</p>
                              <p className="text-xs text-muted-foreground">{s.type} · {instances.length} instância(s)</p>
                            </div>
                          </button>
                        </CollapsibleTrigger>
                        {(showEmbed || isDataTable) && (
                          <Button variant="outline" size="sm" onClick={() => addInstance(s.id)}>
                            <Plus className="h-3.5 w-3.5 mr-1" /> {isDataTable ? "Adicionar tabela" : "Adicionar relatório"}
                          </Button>
                        )}
                      </div>

                      <CollapsibleContent>
                      {instances.length > 0 && (
                        <div className="space-y-3 ml-2 border-l-2 border-muted pl-4 pt-2">
                        {instances.map((inst, idx) => {
                          const hasPbiRls = isPbi && inst.workspace_id && inst.report_id && inst.dataset_id;
                          // Find the real index in the full array (including deleted)
                          const allInstances = instancesMap.get(s.id) ?? [];
                          const realIdx = allInstances.indexOf(inst) !== -1
                            ? allInstances.filter((i) => !i._deleted).indexOf(inst)
                            : idx;
                          // We need the actual index in the original array for updateField
                          const actualIdx = allInstances.findIndex((i) => i === inst);

                          return (
                            <div key={`${s.id}-${idx}`} className="space-y-2 bg-muted/20 rounded-lg p-3">
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 flex-1">
                                  <Input
                                    placeholder="Nome do relatório"
                                    value={inst.name}
                                    onChange={(e) => updateField(s.id, actualIdx, "name", e.target.value)}
                                    className="text-sm font-medium max-w-xs"
                                  />
                                  {hasPbiRls && (
                                    <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full whitespace-nowrap">
                                      <ShieldCheck className="h-3 w-3" /> RLS
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Label className="text-xs text-muted-foreground whitespace-nowrap">
                                    {inst.is_active ? "Ativo" : "Inativo"}
                                  </Label>
                                  <input
                                    type="checkbox"
                                    checked={inst.is_active}
                                    onChange={(e) => updateField(s.id, actualIdx, "is_active", e.target.checked)}
                                    className="accent-primary"
                                  />
                                  <label className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap border-l pl-2 ml-1">
                                    <input
                                      type="checkbox"
                                      checked={inst.admin_only}
                                      onChange={(e) => updateField(s.id, actualIdx, "admin_only", e.target.checked)}
                                      className="accent-amber-500"
                                    />
                                    Só Admin
                                  </label>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                    onClick={() => removeInstance(s.id, actualIdx)}
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>

                              {showEmbed && (
                                <div className="space-y-2">
                                  <div className="space-y-1">
                                    <Label className="text-xs">URL de Embed</Label>
                                    <Input
                                      placeholder="https://app.powerbi.com/view?r=..."
                                      value={inst.embed_url}
                                      onChange={(e) => updateField(s.id, actualIdx, "embed_url", e.target.value)}
                                      className="text-xs"
                                    />
                                  </div>

                                  {isPbi && (
                                    <div className="border rounded-lg p-3 space-y-2 bg-background/50">
                                      <p className="text-xs font-medium flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3" /> Config Power BI (RLS)
                                      </p>
                                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                        <div className="space-y-1">
                                          <Label className="text-xs">Workspace ID</Label>
                                          <Input
                                            placeholder="xxxxxxxx-xxxx-..."
                                            value={inst.workspace_id}
                                            onChange={(e) => updateField(s.id, actualIdx, "workspace_id", e.target.value)}
                                            className="text-xs"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-xs">Report ID</Label>
                                          <Input
                                            placeholder="xxxxxxxx-xxxx-..."
                                            value={inst.report_id}
                                            onChange={(e) => updateField(s.id, actualIdx, "report_id", e.target.value)}
                                            className="text-xs"
                                          />
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-xs">Dataset ID</Label>
                                          <Input
                                            placeholder="xxxxxxxx-xxxx-..."
                                            value={inst.dataset_id}
                                            onChange={(e) => updateField(s.id, actualIdx, "dataset_id", e.target.value)}
                                            className="text-xs"
                                          />
                                        </div>
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs">Role RLS</Label>
                                        <Input
                                          placeholder="Reader"
                                          value={inst.rls_role}
                                          onChange={(e) => updateField(s.id, actualIdx, "rls_role", e.target.value)}
                                          className="text-xs"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {isLooker && (
                                    <div className="border rounded-lg p-3 space-y-2 bg-background/50">
                                      <p className="text-xs font-medium flex items-center gap-1">
                                        <ShieldAlert className="h-3 w-3" /> Filtros Looker
                                      </p>
                                      <Input
                                        placeholder='{"ds0.email": "user_email"}'
                                        value={inst.looker_filters}
                                        onChange={(e) => updateField(s.id, actualIdx, "looker_filters", e.target.value)}
                                        className="text-xs font-mono"
                                      />
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* Data Table config */}
                              {isDataTable && (
                                <div className="space-y-3">
                                  <div className="border rounded-lg p-3 space-y-3 bg-background/50">
                                    <p className="text-xs font-medium flex items-center gap-1">
                                      <Table2 className="h-3 w-3" /> Configuração da Tabela de Dados
                                    </p>

                                    {/* Source selector */}
                                    <div className="space-y-1">
                                      <Label className="text-xs">Fonte dos dados</Label>
                                      <Select
                                        value={inst.dt_source}
                                        onValueChange={(v) => {
                                          const allInst = instancesMap.get(s.id) ?? [];
                                          const newArr = [...allInst];
                                          newArr[actualIdx] = { ...newArr[actualIdx], dt_source: v as "manual" | "external_db" };
                                          setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                        }}
                                      >
                                        <SelectTrigger className="text-xs w-[280px] h-8">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="manual">Manual (CSV / entrada manual)</SelectItem>
                                          <SelectItem value="external_db">PostgreSQL externo (banco do cliente)</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>

                                    {/* External DB config */}
                                    {inst.dt_source === "external_db" && (
                                      <div className="border rounded-lg p-3 space-y-2 bg-blue-50/50 dark:bg-blue-950/20">
                                        <p className="text-xs font-medium flex items-center gap-1">
                                          <DatabaseZap className="h-3 w-3" /> Conexão PostgreSQL
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                          <div className="space-y-1 md:col-span-2">
                                            <Label className="text-xs">Host</Label>
                                            <Input
                                              placeholder="db.cliente.com.br"
                                              value={inst.dt_db_host}
                                              onChange={(e) => {
                                                const allInst = instancesMap.get(s.id) ?? [];
                                                const newArr = [...allInst];
                                                newArr[actualIdx] = { ...newArr[actualIdx], dt_db_host: e.target.value };
                                                setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                              }}
                                              className="text-xs"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-xs">Porta</Label>
                                            <Input
                                              type="number"
                                              value={inst.dt_db_port}
                                              onChange={(e) => {
                                                const allInst = instancesMap.get(s.id) ?? [];
                                                const newArr = [...allInst];
                                                newArr[actualIdx] = { ...newArr[actualIdx], dt_db_port: Number(e.target.value) || 5432 };
                                                setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                              }}
                                              className="text-xs"
                                            />
                                          </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                          <div className="space-y-1">
                                            <Label className="text-xs">Database</Label>
                                            <Input
                                              placeholder="nome_do_banco"
                                              value={inst.dt_db_name}
                                              onChange={(e) => {
                                                const allInst = instancesMap.get(s.id) ?? [];
                                                const newArr = [...allInst];
                                                newArr[actualIdx] = { ...newArr[actualIdx], dt_db_name: e.target.value };
                                                setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                              }}
                                              className="text-xs"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-xs">Usuário</Label>
                                            <Input
                                              placeholder="readonly_user"
                                              value={inst.dt_db_user}
                                              onChange={(e) => {
                                                const allInst = instancesMap.get(s.id) ?? [];
                                                const newArr = [...allInst];
                                                newArr[actualIdx] = { ...newArr[actualIdx], dt_db_user: e.target.value };
                                                setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                              }}
                                              className="text-xs"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <Label className="text-xs">Senha</Label>
                                            <Input
                                              type="password"
                                              placeholder="••••••••"
                                              value={inst.dt_db_password}
                                              onChange={(e) => {
                                                const allInst = instancesMap.get(s.id) ?? [];
                                                const newArr = [...allInst];
                                                newArr[actualIdx] = { ...newArr[actualIdx], dt_db_password: e.target.value };
                                                setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                              }}
                                              className="text-xs"
                                            />
                                          </div>
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-xs">Query SQL</Label>
                                          <textarea
                                            placeholder={"SELECT *\nFROM advogados_ativos\nWHERE status = 'ativo'\nLIMIT 1000"}
                                            value={inst.dt_db_query}
                                            onChange={(e) => {
                                              const allInst = instancesMap.get(s.id) ?? [];
                                              const newArr = [...allInst];
                                              newArr[actualIdx] = { ...newArr[actualIdx], dt_db_query: e.target.value };
                                              setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                            }}
                                            rows={6}
                                            className="w-full rounded-md border border-input bg-zinc-950 text-green-400 px-3 py-2 text-xs font-mono ring-offset-background placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-y"
                                            spellCheck={false}
                                          />
                                        </div>
                                        <div className="flex items-center gap-4">
                                          <div className="space-y-1">
                                            <Label className="text-xs">Cache (minutos)</Label>
                                            <Input
                                              type="number"
                                              value={inst.dt_cache_ttl_minutes}
                                              onChange={(e) => {
                                                const allInst = instancesMap.get(s.id) ?? [];
                                                const newArr = [...allInst];
                                                newArr[actualIdx] = { ...newArr[actualIdx], dt_cache_ttl_minutes: Number(e.target.value) || 15 };
                                                setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                              }}
                                              className="text-xs w-[100px]"
                                            />
                                          </div>
                                          <label className="flex items-center gap-2 text-xs mt-5">
                                            <input
                                              type="checkbox"
                                              checked={inst.dt_db_ssl}
                                              onChange={(e) => {
                                                const allInst = instancesMap.get(s.id) ?? [];
                                                const newArr = [...allInst];
                                                newArr[actualIdx] = { ...newArr[actualIdx], dt_db_ssl: e.target.checked };
                                                setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                              }}
                                              className="accent-primary"
                                            />
                                            SSL
                                          </label>
                                        </div>
                                      </div>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                      <div className="space-y-1">
                                        <Label className="text-xs">Limite de linhas</Label>
                                        <Input
                                          type="number"
                                          value={inst.dt_row_limit}
                                          onChange={(e) => {
                                            const allInst = instancesMap.get(s.id) ?? [];
                                            const newArr = [...allInst];
                                            newArr[actualIdx] = { ...newArr[actualIdx], dt_row_limit: Number(e.target.value) || 1000 };
                                            setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                          }}
                                          className="text-xs"
                                        />
                                      </div>
                                      <div className="space-y-1">
                                        <Label className="text-xs">Itens por página</Label>
                                        <Input
                                          type="number"
                                          value={inst.dt_page_size}
                                          onChange={(e) => {
                                            const allInst = instancesMap.get(s.id) ?? [];
                                            const newArr = [...allInst];
                                            newArr[actualIdx] = { ...newArr[actualIdx], dt_page_size: Number(e.target.value) || 25 };
                                            setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                          }}
                                          className="text-xs"
                                        />
                                      </div>
                                      <div className="space-y-1 flex items-end gap-2">
                                        <label className="flex items-center gap-2 text-xs">
                                          <input
                                            type="checkbox"
                                            checked={inst.dt_allow_export}
                                            onChange={(e) => {
                                              const allInst = instancesMap.get(s.id) ?? [];
                                              const newArr = [...allInst];
                                              newArr[actualIdx] = { ...newArr[actualIdx], dt_allow_export: e.target.checked };
                                              setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                            }}
                                            className="accent-primary"
                                          />
                                          Permitir exportação CSV
                                        </label>
                                      </div>
                                    </div>

                                    {/* Default sort */}
                                    {inst.dt_columns.length > 0 && (
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                        <div className="space-y-1">
                                          <Label className="text-xs">Ordenação padrão (coluna)</Label>
                                          <Select
                                            value={inst.dt_default_sort_key || "_none"}
                                            onValueChange={(v) => {
                                              const allInst = instancesMap.get(s.id) ?? [];
                                              const newArr = [...allInst];
                                              newArr[actualIdx] = { ...newArr[actualIdx], dt_default_sort_key: v === "_none" ? "" : v };
                                              setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                            }}
                                          >
                                            <SelectTrigger className="text-xs h-8">
                                              <SelectValue placeholder="Sem ordenação padrão" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="_none">Sem ordenação padrão</SelectItem>
                                              {inst.dt_columns.filter(c => c.sortable !== false).map(c => (
                                                <SelectItem key={c.key} value={c.key}>{c.label || c.key}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <div className="space-y-1">
                                          <Label className="text-xs">Direção</Label>
                                          <Select
                                            value={inst.dt_default_sort_dir}
                                            onValueChange={(v) => {
                                              const allInst = instancesMap.get(s.id) ?? [];
                                              const newArr = [...allInst];
                                              newArr[actualIdx] = { ...newArr[actualIdx], dt_default_sort_dir: v as "asc" | "desc" };
                                              setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                            }}
                                          >
                                            <SelectTrigger className="text-xs h-8">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="asc">Crescente (A→Z, 1→9)</SelectItem>
                                              <SelectItem value="desc">Decrescente (Z→A, 9→1)</SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    )}

                                    {/* Columns editor */}
                                    <div className="space-y-2">
                                      <div className="flex items-center justify-between">
                                        <Label className="text-xs font-medium">Colunas</Label>
                                        <Button
                                          type="button"
                                          variant="outline"
                                          size="sm"
                                          className="h-6 text-xs"
                                          onClick={() => {
                                            const allInst = instancesMap.get(s.id) ?? [];
                                            const newArr = [...allInst];
                                            const cols = [...(newArr[actualIdx].dt_columns || [])];
                                            cols.push({ key: `col_${cols.length + 1}`, label: `Coluna ${cols.length + 1}`, type: "text", filterable: false, sortable: true });
                                            newArr[actualIdx] = { ...newArr[actualIdx], dt_columns: cols };
                                            setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                          }}
                                        >
                                          <Plus className="h-3 w-3 mr-1" /> Coluna
                                        </Button>
                                      </div>

                                      {(inst.dt_columns || []).map((col, colIdx) => (
                                        <div key={colIdx} className="flex items-center gap-2 bg-muted/30 rounded p-2">
                                          <Input
                                            placeholder="Chave (key)"
                                            value={col.key}
                                            onChange={(e) => {
                                              const allInst = instancesMap.get(s.id) ?? [];
                                              const newArr = [...allInst];
                                              const cols = [...newArr[actualIdx].dt_columns];
                                              cols[colIdx] = { ...cols[colIdx], key: e.target.value };
                                              newArr[actualIdx] = { ...newArr[actualIdx], dt_columns: cols };
                                              setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                            }}
                                            className="text-xs w-[120px]"
                                          />
                                          <Input
                                            placeholder="Label"
                                            value={col.label}
                                            onChange={(e) => {
                                              const allInst = instancesMap.get(s.id) ?? [];
                                              const newArr = [...allInst];
                                              const cols = [...newArr[actualIdx].dt_columns];
                                              cols[colIdx] = { ...cols[colIdx], label: e.target.value };
                                              newArr[actualIdx] = { ...newArr[actualIdx], dt_columns: cols };
                                              setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                            }}
                                            className="text-xs w-[120px]"
                                          />
                                          <Select
                                            value={col.type}
                                            onValueChange={(v) => {
                                              const allInst = instancesMap.get(s.id) ?? [];
                                              const newArr = [...allInst];
                                              const cols = [...newArr[actualIdx].dt_columns];
                                              cols[colIdx] = { ...cols[colIdx], type: v as ColumnDef["type"] };
                                              newArr[actualIdx] = { ...newArr[actualIdx], dt_columns: cols };
                                              setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                            }}
                                          >
                                            <SelectTrigger className="text-xs w-[100px] h-8">
                                              <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="text">Texto</SelectItem>
                                              <SelectItem value="number">Número</SelectItem>
                                              <SelectItem value="date">Data</SelectItem>
                                              <SelectItem value="boolean">Boolean</SelectItem>
                                              <SelectItem value="link">Link</SelectItem>
                                            </SelectContent>
                                          </Select>
                                          <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                                            <input
                                              type="checkbox"
                                              checked={col.filterable ?? false}
                                              onChange={(e) => {
                                                const allInst = instancesMap.get(s.id) ?? [];
                                                const newArr = [...allInst];
                                                const cols = [...newArr[actualIdx].dt_columns];
                                                cols[colIdx] = { ...cols[colIdx], filterable: e.target.checked };
                                                newArr[actualIdx] = { ...newArr[actualIdx], dt_columns: cols };
                                                setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                              }}
                                              className="accent-primary"
                                            />
                                            Filtro
                                          </label>
                                          <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                                            <input
                                              type="checkbox"
                                              checked={col.hidden ?? false}
                                              onChange={(e) => {
                                                const allInst = instancesMap.get(s.id) ?? [];
                                                const newArr = [...allInst];
                                                const cols = [...newArr[actualIdx].dt_columns];
                                                cols[colIdx] = { ...cols[colIdx], hidden: e.target.checked };
                                                newArr[actualIdx] = { ...newArr[actualIdx], dt_columns: cols };
                                                setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                              }}
                                              className="accent-amber-500"
                                            />
                                            Oculto
                                          </label>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive shrink-0"
                                            onClick={() => {
                                              const allInst = instancesMap.get(s.id) ?? [];
                                              const newArr = [...allInst];
                                              const cols = [...newArr[actualIdx].dt_columns];
                                              cols.splice(colIdx, 1);
                                              newArr[actualIdx] = { ...newArr[actualIdx], dt_columns: cols };
                                              setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                            }}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Observations config */}
                                    <div className="border rounded-lg p-3 space-y-2 bg-amber-50/50 dark:bg-amber-950/20">
                                      <div className="flex items-center justify-between">
                                        <p className="text-xs font-medium flex items-center gap-1">
                                          <MessageSquare className="h-3 w-3" /> Observações
                                        </p>
                                        <label className="flex items-center gap-2 text-xs">
                                          <input
                                            type="checkbox"
                                            checked={inst.dt_allow_observations}
                                            onChange={(e) => {
                                              const allInst = instancesMap.get(s.id) ?? [];
                                              const newArr = [...allInst];
                                              newArr[actualIdx] = { ...newArr[actualIdx], dt_allow_observations: e.target.checked };
                                              setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                            }}
                                            className="accent-primary"
                                          />
                                          Permitir observações
                                        </label>
                                      </div>

                                      {inst.dt_allow_observations && (
                                        <div className="space-y-2 pt-1">
                                          <div className="space-y-1">
                                            <Label className="text-xs">Destino das observações</Label>
                                            <Select
                                              value={inst.dt_observations_target}
                                              onValueChange={(v) => {
                                                const allInst = instancesMap.get(s.id) ?? [];
                                                const newArr = [...allInst];
                                                newArr[actualIdx] = { ...newArr[actualIdx], dt_observations_target: v as "local" | "external_db" };
                                                setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                              }}
                                            >
                                              <SelectTrigger className="text-xs w-[320px] h-8">
                                                <SelectValue />
                                              </SelectTrigger>
                                              <SelectContent>
                                                <SelectItem value="local">Local (salvo no Supabase)</SelectItem>
                                                <SelectItem value="external_db">Banco externo do cliente (PostgreSQL)</SelectItem>
                                              </SelectContent>
                                            </Select>
                                          </div>

                                          {inst.dt_observations_target === "external_db" && (
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 border rounded p-2 bg-background/50">
                                              <div className="space-y-1">
                                                <Label className="text-xs">Tabela destino</Label>
                                                <Input
                                                  placeholder="nome_da_tabela"
                                                  value={inst.dt_observations_table}
                                                  onChange={(e) => {
                                                    const allInst = instancesMap.get(s.id) ?? [];
                                                    const newArr = [...allInst];
                                                    newArr[actualIdx] = { ...newArr[actualIdx], dt_observations_table: e.target.value };
                                                    setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                                  }}
                                                  className="text-xs"
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <Label className="text-xs">Coluna de observação</Label>
                                                <Input
                                                  placeholder="observacao"
                                                  value={inst.dt_observations_column}
                                                  onChange={(e) => {
                                                    const allInst = instancesMap.get(s.id) ?? [];
                                                    const newArr = [...allInst];
                                                    newArr[actualIdx] = { ...newArr[actualIdx], dt_observations_column: e.target.value };
                                                    setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                                  }}
                                                  className="text-xs"
                                                />
                                              </div>
                                              <div className="space-y-1">
                                                <Label className="text-xs">Chave primária</Label>
                                                <Input
                                                  placeholder="id"
                                                  value={inst.dt_primary_key}
                                                  onChange={(e) => {
                                                    const allInst = instancesMap.get(s.id) ?? [];
                                                    const newArr = [...allInst];
                                                    newArr[actualIdx] = { ...newArr[actualIdx], dt_primary_key: e.target.value };
                                                    setInstancesMap((prev) => { const n = new Map(prev); n.set(s.id, newArr); return n; });
                                                  }}
                                                  className="text-xs"
                                                />
                                              </div>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>

                                    {/* Link to data management */}
                                    {inst.dbId && inst.dt_source === "manual" && (
                                      <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="text-xs"
                                        onClick={() => navigate(`/portal/admin/data-tables/${inst.dbId}`)}
                                      >
                                        <ExternalLink className="h-3 w-3 mr-1" /> Gerenciar Dados
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        </div>
                      )}
                      </CollapsibleContent>
                    </CardContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>
        )}

        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </>
  );
}
