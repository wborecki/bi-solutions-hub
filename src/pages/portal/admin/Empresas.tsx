import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Settings, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

export default function Empresas() {
  const { toast } = useToast();
  const [companies, setCompanies] = useState<Tables<"companies">[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const fetchCompanies = async () => {
    const { data } = await supabase.from("companies").select("*").order("name");
    setCompanies(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from("companies").insert({
      name: name.trim(),
      slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Empresa criada!" });
      setName("");
      setSlug("");
      setShowForm(false);
      fetchCompanies();
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("companies").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Empresa excluída" });
      fetchCompanies();
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Empresas</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Empresa
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader><CardTitle>Nova Empresa</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome</Label>
                  <Input value={name} onChange={(e) => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-")); }} required maxLength={200} />
                </div>
                <div className="space-y-2">
                  <Label>Slug (identificador único)</Label>
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} required maxLength={100} />
                </div>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Criando..." : "Criar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : companies.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">Nenhuma empresa cadastrada.</CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {companies.map((c) => (
              <Card key={c.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.slug}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" title="Serviços" onClick={() => navigate(`/portal/admin/empresas/${c.id}/servicos`)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" title="Regras de RLS" onClick={() => navigate(`/portal/admin/empresas/${c.id}/rls-rules`)}>
                      <ShieldCheck className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(c.id)}>
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
