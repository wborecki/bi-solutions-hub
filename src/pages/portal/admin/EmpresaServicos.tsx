import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Json } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, ShieldCheck, ShieldAlert } from "lucide-react";

type Service = { id: string; name: string; slug: string; type: string };
type CompanyService = {
  id: string;
  service_id: string;
  embed_url: string;
  is_active: boolean;
  config: Record<string, unknown>;
};

type FormEntry = {
  embed_url: string;
  is_active: boolean;
  workspace_id: string;
  report_id: string;
  dataset_id: string;
  rls_role: string;
  looker_filters: string; // JSON string
};

const emptyForm = (): FormEntry => ({
  embed_url: "",
  is_active: false,
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
  const [linked, setLinked] = useState<Map<string, CompanyService>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formState, setFormState] = useState<Map<string, FormEntry>>(new Map());

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

      const map = new Map<string, CompanyService>();
      const formMap = new Map<string, FormEntry>();
      for (const cs of (linkedRes.data ?? []) as CompanyService[]) {
        map.set(cs.service_id, cs);
        const cfg = cs.config as Record<string, unknown>;
        formMap.set(cs.service_id, {
          embed_url: cs.embed_url,
          is_active: cs.is_active,
          workspace_id: (cfg?.workspace_id as string) || "",
          report_id: (cfg?.report_id as string) || "",
          dataset_id: (cfg?.dataset_id as string) || "",
          rls_role: (cfg?.rls_role as string) || "Reader",
          looker_filters: cfg?.looker_filters ? JSON.stringify(cfg.looker_filters, null, 2) : "",
        });
      }
      for (const s of svcList) {
        if (!formMap.has(s.id)) formMap.set(s.id, emptyForm());
      }
      setLinked(map);
      setFormState(formMap);
      setLoading(false);
    };
    fetchData();
  }, [companyId]);

  const updateField = (serviceId: string, field: keyof FormEntry, value: string | boolean) => {
    setFormState((prev) => {
      const next = new Map(prev);
      const cur = next.get(serviceId) ?? emptyForm();
      next.set(serviceId, { ...cur, [field]: value });
      return next;
    });
  };

  const handleSave = async () => {
    if (!companyId) return;
    setSaving(true);
    for (const [serviceId, state] of formState.entries()) {
      const existing = linked.get(serviceId);
      const svc = services.find((s) => s.id === serviceId);

      // Build config JSONB
      const config: Record<string, string> = {};
      if (svc?.type === "bi_embed") {
        if (state.workspace_id) config.workspace_id = state.workspace_id;
        if (state.report_id) config.report_id = state.report_id;
        if (state.dataset_id) config.dataset_id = state.dataset_id;
        if (state.rls_role) config.rls_role = state.rls_role;
      }
      if (svc?.type === "looker_embed" && state.looker_filters) {
        try {
          config.looker_filters = JSON.parse(state.looker_filters);
        } catch {
          /* ignore invalid JSON */
        }
      }

      if (state.is_active) {
        if (existing) {
          await supabase.from("company_services").update({
            embed_url: state.embed_url,
            is_active: true,
            config,
          }).eq("id", existing.id);
        } else {
          await supabase.from("company_services").insert({
            company_id: companyId,
            service_id: serviceId,
            embed_url: state.embed_url,
            is_active: true,
            config,
          });
        }
      } else if (existing) {
        await supabase.from("company_services").update({ is_active: false }).eq("id", existing.id);
      }
    }
    setSaving(false);
    toast({ title: "Serviços da empresa atualizados!" });
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
            <p className="text-sm text-muted-foreground">Ative os serviços e configure URLs de embed e RLS</p>
          </div>
        </div>

        {services.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Cadastre serviços no catálogo primeiro.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {services.map((s) => {
              const state = formState.get(s.id) ?? emptyForm();
              const isPbi = s.type === "bi_embed";
              const isLooker = s.type === "looker_embed";
              const showEmbed = isPbi || isLooker;
              const hasPbiRls = isPbi && state.workspace_id && state.report_id && state.dataset_id;

              return (
                <Card key={s.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div>
                          <p className="font-medium text-foreground">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.type}</p>
                        </div>
                        {state.is_active && hasPbiRls && (
                          <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
                            <ShieldCheck className="h-3 w-3" /> RLS
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">
                          {state.is_active ? "Ativo" : "Inativo"}
                        </Label>
                        <Switch
                          checked={state.is_active}
                          onCheckedChange={(v) => updateField(s.id, "is_active", v)}
                        />
                      </div>
                    </div>

                    {state.is_active && showEmbed && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <Label className="text-xs">URL de Embed (pública / fallback)</Label>
                          <Input
                            placeholder="https://app.powerbi.com/view?r=... ou https://lookerstudio.google.com/embed/..."
                            value={state.embed_url}
                            onChange={(e) => updateField(s.id, "embed_url", e.target.value)}
                          />
                        </div>

                        {/* Power BI RLS Config */}
                        {isPbi && (
                          <div className="border rounded-lg p-3 space-y-2 bg-muted/30">
                            <p className="text-xs font-medium flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" /> Configuração Power BI Embedded (RLS)
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Preencha para ativar RLS seguro. Deixe vazio para usar a URL pública.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                              <div className="space-y-1">
                                <Label className="text-xs">Workspace ID</Label>
                                <Input
                                  placeholder="xxxxxxxx-xxxx-..."
                                  value={state.workspace_id}
                                  onChange={(e) => updateField(s.id, "workspace_id", e.target.value)}
                                  className="text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Report ID</Label>
                                <Input
                                  placeholder="xxxxxxxx-xxxx-..."
                                  value={state.report_id}
                                  onChange={(e) => updateField(s.id, "report_id", e.target.value)}
                                  className="text-xs"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">Dataset ID</Label>
                                <Input
                                  placeholder="xxxxxxxx-xxxx-..."
                                  value={state.dataset_id}
                                  onChange={(e) => updateField(s.id, "dataset_id", e.target.value)}
                                  className="text-xs"
                                />
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Nome da Role RLS (padrão: Reader)</Label>
                              <Input
                                placeholder="Reader"
                                value={state.rls_role}
                                onChange={(e) => updateField(s.id, "rls_role", e.target.value)}
                                className="text-xs"
                              />
                            </div>
                          </div>
                        )}

                        {/* Looker Filters Config */}
                        {isLooker && (
                          <div className="border rounded-lg p-3 space-y-2 bg-muted/30">
                            <p className="text-xs font-medium flex items-center gap-1">
                              <ShieldAlert className="h-3 w-3" /> Filtros por URL (Looker Studio)
                            </p>
                            <p className="text-xs text-muted-foreground">
                              JSON com mapeamento de parâmetros. Use "user_email" para injetar o email do usuário.
                              Ex: {`{"ds0.email": "user_email"}`}
                            </p>
                            <Input
                              placeholder='{"ds0.email": "user_email"}'
                              value={state.looker_filters}
                              onChange={(e) => updateField(s.id, "looker_filters", e.target.value)}
                              className="text-xs font-mono"
                            />
                          </div>
                        )}
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
