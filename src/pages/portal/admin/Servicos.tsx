import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Pencil, BarChart3, PieChart, LineChart, Activity, TrendingUp, Database, FileText, Bot, Scale, Briefcase } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3, PieChart, LineChart, Activity, TrendingUp, Database, FileText, Bot, Scale, Briefcase,
};

type Service = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  type: "bi_embed" | "looker_embed" | "document" | "custom";
  created_at: string;
};

const SERVICE_TYPES = [
  { value: "bi_embed", label: "Power BI (Embed)" },
  { value: "looker_embed", label: "Looker Studio (Embed)" },
  { value: "document", label: "Documento" },
  { value: "custom", label: "Personalizado" },
];

const ICON_OPTIONS = [
  "BarChart3", "PieChart", "LineChart", "Activity", "TrendingUp",
  "Database", "FileText", "Bot", "Scale", "Briefcase",
];

export default function Servicos() {
  const { toast } = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", icon: "BarChart3", type: "bi_embed" as string });
  const [submitting, setSubmitting] = useState(false);

  const fetchServices = async () => {
    const { data } = await supabase.from("services").select("*").order("name");
    setServices((data as Service[]) ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchServices(); }, []);

  const resetForm = () => {
    setForm({ name: "", slug: "", description: "", icon: "BarChart3", type: "bi_embed" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim().toLowerCase().replace(/\s+/g, "-"),
      description: form.description.trim(),
      icon: form.icon,
      type: form.type as Service["type"],
    };

    if (editingId) {
      const { error } = await supabase.from("services").update(payload).eq("id", editingId);
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else toast({ title: "Serviço atualizado!" });
    } else {
      const { error } = await supabase.from("services").insert(payload);
      if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
      else toast({ title: "Serviço criado!" });
    }
    setSubmitting(false);
    resetForm();
    fetchServices();
  };

  const handleEdit = (s: Service) => {
    setForm({ name: s.name, slug: s.slug, description: s.description, icon: s.icon, type: s.type });
    setEditingId(s.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) toast({ title: "Erro", description: error.message, variant: "destructive" });
    else { toast({ title: "Serviço excluído" }); fetchServices(); }
  };

  const typeLabel = (t: string) => SERVICE_TYPES.find((s) => s.value === t)?.label ?? t;

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Catálogo de Serviços</h1>
          <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader><CardTitle>{editingId ? "Editar Serviço" : "Novo Serviço"}</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome</Label>
                    <Input value={form.name} onChange={(e) => { setForm({ ...form, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") }); }} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {SERVICE_TYPES.map((t) => (
                          <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Ícone</Label>
                    <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
                      <SelectTrigger>
                        <span className="flex items-center gap-2">
                          {ICON_MAP[form.icon] && (() => { const I = ICON_MAP[form.icon]; return <I className="h-4 w-4" />; })()}
                          <SelectValue />
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((i) => {
                          const IconComp = ICON_MAP[i];
                          return (
                            <SelectItem key={i} value={i}>
                              <span className="flex items-center gap-2">
                                {IconComp && <IconComp className="h-4 w-4" />}
                                {i}
                              </span>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>{submitting ? "Salvando..." : editingId ? "Salvar" : "Criar"}</Button>
                  <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : services.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum serviço cadastrado.</CardContent></Card>
        ) : (
          <div className="space-y-2">
            {services.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{typeLabel(s.type)} · {s.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => handleEdit(s)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(s.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
