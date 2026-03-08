import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type ProfileRow = Tables<"profiles"> & { role?: string; company_name?: string };

export default function Usuarios() {
  const { toast } = useToast();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [companies, setCompanies] = useState<Tables<"companies">[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [filterCompany, setFilterCompany] = useState("all");

  // Form state
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [role, setRole] = useState("client");
  const [submitting, setSubmitting] = useState(false);

  // Edit state
  const [editUser, setEditUser] = useState<ProfileRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  // Delete state
  const [deleteUser, setDeleteUser] = useState<ProfileRow | null>(null);
  const [deleting, setDeleting] = useState(false);

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
        company_name: p.company_id ? companyMap.get(p.company_id) ?? "-" : "-",
      }))
    );
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      const matchCompany = filterCompany === "all" || p.company_id === filterCompany;
      const q = search.toLowerCase();
      const matchSearch = !q || p.full_name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
      return matchCompany && matchSearch;
    });
  }, [profiles, filterCompany, search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const { data, error } = await supabase.functions.invoke("create-user", {
      body: { email: email.trim(), password, full_name: fullName.trim(), company_id: companyId || null, role },
    });

    if (error || data?.error) {
      toast({ title: "Erro", description: data?.error || error?.message || "Não foi possível criar o usuário.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    setSubmitting(false);
    toast({ title: "Usuário criado!", description: `${email.trim()} foi adicionado.` });
    setEmail(""); setFullName(""); setPassword(""); setCompanyId(""); setRole("client");
    setShowForm(false);
    fetchData();
  };

  const openEdit = (p: ProfileRow) => {
    setEditUser(p);
    setEditName(p.full_name);
    setEditCompany(p.company_id ?? "");
    setEditRole(p.role ?? "client");
  };

  const handleEdit = async () => {
    if (!editUser) return;
    setEditSaving(true);

    await Promise.all([
      supabase.from("profiles").update({ full_name: editName, company_id: editCompany || null }).eq("id", editUser.id),
      supabase.from("user_roles").update({ role: editRole as "admin" | "client" }).eq("user_id", editUser.id),
    ]);

    setEditSaving(false);
    setEditUser(null);
    toast({ title: "Usuário atualizado!" });
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    setDeleting(true);

    // Delete via edge function (needs service role to delete auth user)
    const { error } = await supabase.functions.invoke("create-user", {
      body: { action: "delete", user_id: deleteUser.id },
    });

    if (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Usuário removido!" });
    }

    setDeleting(false);
    setDeleteUser(null);
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

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger className="w-full sm:w-[220px]">
              <SelectValue placeholder="Todas as empresas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as empresas</SelectItem>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum usuário encontrado.
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>E-mail</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.full_name || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{p.email}</TableCell>
                      <TableCell>{p.company_name}</TableCell>
                      <TableCell>
                        <Badge variant={p.role === "admin" ? "default" : "secondary"}>
                          {p.role === "admin" ? "Admin" : "Cliente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(p)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteUser(p)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nome completo</Label>
              <Input value={editName} onChange={(e) => setEditName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Empresa</Label>
              <Select value={editCompany} onValueChange={setEditCompany}>
                <SelectTrigger><SelectValue placeholder="Sem empresa" /></SelectTrigger>
                <SelectContent>
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Função</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="client">Cliente</SelectItem>
                  <SelectItem value="admin">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancelar</Button>
            <Button onClick={handleEdit} disabled={editSaving}>
              {editSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Usuário</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Tem certeza que deseja remover <strong>{deleteUser?.full_name || deleteUser?.email}</strong>? Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
