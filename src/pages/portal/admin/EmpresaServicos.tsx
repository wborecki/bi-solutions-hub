import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, ShieldCheck, ShieldAlert, Plus, Trash2 } from "lucide-react";

type Service = { id: string; name: string; slug: string; type: string };

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

    for (const [serviceId, instances] of instancesMap.entries()) {
      const svc = services.find((s) => s.id === serviceId);

      for (const inst of instances) {
        // Build config
        const config: Record<string, Json> = {};
        if (svc?.type === "bi_embed") {
          if (inst.workspace_id) config.workspace_id = inst.workspace_id;
          if (inst.report_id) config.report_id = inst.report_id;
          if (inst.dataset_id) config.dataset_id = inst.dataset_id;
          if (inst.rls_role) config.rls_role = inst.rls_role;
        }
        if (svc?.type === "looker_embed" && inst.looker_filters) {
          try { config.looker_filters = JSON.parse(inst.looker_filters) as Json; } catch { /* ignore */ }
        }

        if (inst._deleted && inst.dbId) {
          await supabase.from("company_services").delete().eq("id", inst.dbId);
        } else if (inst.dbId) {
          await supabase.from("company_services").update({
            name: inst.name,
            embed_url: inst.embed_url,
            is_active: inst.is_active,
            config: config as unknown as Json,
          }).eq("id", inst.dbId);
        } else if (!inst._deleted) {
          await supabase.from("company_services").insert({
            company_id: companyId,
            service_id: serviceId,
            name: inst.name,
            embed_url: inst.embed_url,
            is_active: inst.is_active,
            config: config as unknown as Json,
          });
        }
      }
    }

    setSaving(false);
    toast({ title: "Serviços da empresa atualizados!" });
    // Refresh
    window.location.reload();
  };

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/portal/admin/empresas")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Serviços — {companyName}</h1>
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
              const showEmbed = isPbi || isLooker;

              return (
                <Card key={s.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.type} · {instances.length} relatório(s)</p>
                      </div>
                      {showEmbed && (
                        <Button variant="outline" size="sm" onClick={() => addInstance(s.id)}>
                          <Plus className="h-3.5 w-3.5 mr-1" /> Adicionar relatório
                        </Button>
                      )}
                    </div>

                    {instances.length > 0 && (
                      <div className="space-y-3 ml-2 border-l-2 border-muted pl-4">
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
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </PortalLayout>
  );
}
