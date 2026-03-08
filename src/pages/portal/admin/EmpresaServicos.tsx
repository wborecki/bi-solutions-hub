import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";

type Service = { id: string; name: string; slug: string; type: string };
type CompanyService = {
  id: string;
  service_id: string;
  embed_url: string;
  is_active: boolean;
  config: Record<string, unknown>;
};

export default function EmpresaServicos() {
  const { id: companyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState("");
  const [services, setServices] = useState<Service[]>([]);
  const [linked, setLinked] = useState<Map<string, CompanyService>>(new Map());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Local form state: serviceId -> { embed_url, is_active }
  const [formState, setFormState] = useState<Map<string, { embed_url: string; is_active: boolean }>>(new Map());

  useEffect(() => {
    if (!companyId) return;
    const fetch = async () => {
      const [companyRes, servicesRes, linkedRes] = await Promise.all([
        supabase.from("companies").select("name").eq("id", companyId).single(),
        supabase.from("services").select("*").order("name"),
        supabase.from("company_services").select("*").eq("company_id", companyId),
      ]);
      setCompanyName(companyRes.data?.name ?? "");
      const svcList = (servicesRes.data ?? []) as Service[];
      setServices(svcList);

      const map = new Map<string, CompanyService>();
      const formMap = new Map<string, { embed_url: string; is_active: boolean }>();
      for (const cs of (linkedRes.data ?? []) as CompanyService[]) {
        map.set(cs.service_id, cs);
        formMap.set(cs.service_id, { embed_url: cs.embed_url, is_active: cs.is_active });
      }
      // Init unlinked services
      for (const s of svcList) {
        if (!formMap.has(s.id)) {
          formMap.set(s.id, { embed_url: "", is_active: false });
        }
      }
      setLinked(map);
      setFormState(formMap);
      setLoading(false);
    };
    fetch();
  }, [companyId]);

  const updateField = (serviceId: string, field: "embed_url" | "is_active", value: string | boolean) => {
    setFormState((prev) => {
      const next = new Map(prev);
      const cur = next.get(serviceId) ?? { embed_url: "", is_active: false };
      next.set(serviceId, { ...cur, [field]: value });
      return next;
    });
  };

  const handleSave = async () => {
    if (!companyId) return;
    setSaving(true);
    // Upsert active ones, delete inactive without existing record
    for (const [serviceId, state] of formState.entries()) {
      const existing = linked.get(serviceId);
      if (state.is_active) {
        if (existing) {
          await supabase.from("company_services").update({
            embed_url: state.embed_url,
            is_active: true,
          }).eq("id", existing.id);
        } else {
          await supabase.from("company_services").insert({
            company_id: companyId,
            service_id: serviceId,
            embed_url: state.embed_url,
            is_active: true,
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
            <p className="text-sm text-muted-foreground">Ative os serviços e configure as URLs de embed para esta empresa</p>
          </div>
        </div>

        {services.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Cadastre serviços no catálogo primeiro.</CardContent></Card>
        ) : (
          <div className="space-y-3">
            {services.map((s) => {
              const state = formState.get(s.id) ?? { embed_url: "", is_active: false };
              const showEmbed = s.type === "bi_embed" || s.type === "looker_embed";
              return (
                <Card key={s.id}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.type}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Label className="text-sm text-muted-foreground">{state.is_active ? "Ativo" : "Inativo"}</Label>
                        <Switch checked={state.is_active} onCheckedChange={(v) => updateField(s.id, "is_active", v)} />
                      </div>
                    </div>
                    {state.is_active && showEmbed && (
                      <div className="space-y-1">
                        <Label className="text-xs">URL de Embed</Label>
                        <Input
                          placeholder="https://app.powerbi.com/view?r=... ou https://lookerstudio.google.com/embed/..."
                          value={state.embed_url}
                          onChange={(e) => updateField(s.id, "embed_url", e.target.value)}
                        />
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
