import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

export default function Usuarios() {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<(Tables<"profiles"> & { role?: string; company_name?: string })[]>([]);
  const [companies, setCompanies] = useState<Tables<"companies">[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [role, setRole] = useState("client");
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    const [{ data: profilesData }, { data: rolesData }, { data: companiesData }] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("user_roles").select("*"),
      supabase.from("companies").select("*").order("name"),
    ]);

    setCompanies(companiesData ?? []);

    const roleMap = new Map(rolesData?.map((r) => [r.user_id, r.role]) ?? []);
    const companyMap = new Map(companiesData?.map((c) => [c.id, c.name]) ?? []);

    setProfiles(
      (profilesData ?? []).map((p) => ({
        ...p,
        role: roleMap.get(p.id) ?? "sem role",
        company_name: p.company_id ? companyMap.get(p.company_id) ?? "—" : "—",
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Use Supabase admin invite (via edge function would be ideal, but for now use signUp)
    // Note: In production, this should use an edge function with service_role key
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: { full_name: fullName.trim() },
      },
    });

    if (error || !data.user) {
      toast({ title: "Erro", description: error?.message ?? "Não foi possível criar o usuário.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    // Update profile with company
    if (companyId) {
      await supabase.from("profiles").update({ company_id: companyId }).eq("id", data.user.id);
    }

    // Assign role
    await supabase.from("user_roles").insert({
      user_id: data.user.id,
      role: role as "admin" | "client",
    });

    setSubmitting(false);
    toast({ title: "Usuário criado!", description: `${email.trim()} foi adicionado.` });
    setEmail("");
    setFullName("");
    setPassword("");
    setCompanyId("");
    setRole("client");
    setShowForm(false);
    fetchData();
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Usuários</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader><CardTitle>Criar Usuário</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome completo</Label>
                    <Input value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={200} />
                  </div>
                  <div className="space-y-2">
                    <Label>E-mail</Label>
                    <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label>Senha</Label>
                    <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  </div>
                  <div className="space-y-2">
                    <Label>Empresa</Label>
                    <Select value={companyId} onValueChange={setCompanyId}>
                      <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                      <SelectContent>
                        {companies.map((c) => (
                          <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Função</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Cliente</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Criando..." : "Criar Usuário"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-2">
            {profiles.map((p) => (
              <Card key={p.id}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{p.full_name || p.email}</p>
                    <p className="text-xs text-muted-foreground">{p.email} · {p.company_name}</p>
                  </div>
                  <Badge variant={p.role === "admin" ? "default" : "secondary"}>
                    {p.role === "admin" ? "Admin" : "Cliente"}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
