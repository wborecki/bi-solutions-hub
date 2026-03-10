import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Search, ShieldCheck, Users, Pencil } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type ProfileRow = Tables<"profiles"> & { role?: string };
type RlsRule = Tables<"rls_rules">;

export default function EmpresaUsuarios() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const companyId = profile?.company_id;

  const [users, setUsers] = useState<ProfileRow[]>([]);
  const [rules, setRules] = useState<RlsRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Create user form
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Delete
  const [deleteUser, setDeleteUser] = useState<ProfileRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  // RLS assignment
  const [rlsUser, setRlsUser] = useState<ProfileRow | null>(null);
  const [userRuleIds, setUserRuleIds] = useState<Set<string>>(new Set());
  const [rlsSaving, setRlsSaving] = useState(false);

  // Edit custom_data
  const [editUser, setEditUser] = useState<ProfileRow | null>(null);
  const [editCustomData, setEditCustomData] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  const fetchData = async () => {
    if (!companyId) return;

    const [{ data: profilesData }, { data: rolesData }, { data: rulesData }] = await Promise.all([
      supabase.from("profiles").select("*").eq("company_id", companyId).order("full_name"),
      supabase.from("user_roles").select("*"),
      supabase.from("rls_rules").select("*").eq("company_id", companyId).order("name"),
    ]);

    const roleMap = new Map(rolesData?.map((r) => [r.user_id, r.role]) ?? []);
    setUsers((profilesData ?? []).map((p) => ({ ...p, role: roleMap.get(p.id) ?? "client" })));
    setRules(rulesData ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [companyId]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return users.filter(
      (u) => !q || u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
    );
  }, [users, search]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;
    setSubmitting(true);

    const { data, error } = await supabase.functions.invoke("create-user", {
      body: {
        email: email.trim(),
        password,
        full_name: fullName.trim(),
        company_id: companyId,
        role: "client",
      },
    });

    if (error || data?.error) {
      toast({
        title: "Erro",
        description: data?.error || error?.message || "Não foi possível criar o usuário.",
        variant: "destructive",
      });
      setSubmitting(false);
      return;
    }

    toast({ title: "Usuário criado!", description: `${email.trim()} foi adicionado.` });
    setEmail(""); setFullName(""); setPassword("");
    setShowForm(false);
    setSubmitting(false);
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteUser) return;
    // Don't let client_admin delete themselves
    if (deleteUser.id === profile?.id) {
      toast({ title: "Erro", description: "Você não pode remover a si mesmo.", variant: "destructive" });
      setDeleteUser(null);
      return;
    }
    setDeleting(true);

    const { error } = await supabase.functions.invoke("create-user", {
      body: { action: "delete", user_id: deleteUser.id },
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Usuário removido!" });
    }
    setDeleting(false);
    setDeleteUser(null);
    fetchData();
  };

  // Open RLS assignment
  const openRls = async (user: ProfileRow) => {
    setRlsUser(user);
    const { data } = await supabase
      .from("user_rls_rules")
      .select("rls_rule_id")
      .eq("user_id", user.id);
    setUserRuleIds(new Set((data ?? []).map((r) => r.rls_rule_id)));
  };

  const toggleRule = (ruleId: string) => {
    setUserRuleIds((prev) => {
      const next = new Set(prev);
      if (next.has(ruleId)) next.delete(ruleId);
      else next.add(ruleId);
      return next;
    });
  };

  const handleSaveRls = async () => {
    if (!rlsUser) return;
    setRlsSaving(true);

    // Remove all existing, re-insert selected
    await supabase.from("user_rls_rules").delete().eq("user_id", rlsUser.id);

    if (userRuleIds.size > 0) {
      const rows = Array.from(userRuleIds).map((rid) => ({
        user_id: rlsUser.id,
        rls_rule_id: rid,
      }));
      const { error } = await supabase.from("user_rls_rules").insert(rows);
      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
        setRlsSaving(false);
        return;
      }
    }

    toast({ title: "Regras de RLS atualizadas!" });
    setRlsSaving(false);
    setRlsUser(null);
  };

  const openEdit = (user: ProfileRow) => {
    setEditUser(user);
    setEditCustomData(user.custom_data ?? "");
  };

  const handleSaveEdit = async () => {
    if (!editUser) return;
    setEditSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ custom_data: editCustomData.trim() || null })
      .eq("id", editUser.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Usuário atualizado!" });
    }
    setEditSaving(false);
    setEditUser(null);
    fetchData();
  };

  if (!companyId) {
    return (
      <>
        <div className="text-center py-12 text-muted-foreground">
          Sua conta não está vinculada a nenhuma empresa.
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Usuários da Empresa</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader><CardTitle>Adicionar Usuário</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
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
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Criando..." : "Criar Usuário"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-40" />
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
                    <TableHead>Custom Data</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">{u.full_name || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{u.email}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {u.custom_data || <span className="italic text-xs">—</span>}
                      </TableCell>
                      <TableCell>
                        <Badge variant={u.role === "client_admin" ? "default" : "secondary"}>
                          {u.role === "client_admin" ? "Admin Empresa" : "Cliente"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Editar Custom Data"
                            onClick={() => openEdit(u)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          {rules.length > 0 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              title="Regras de RLS"
                              onClick={() => openRls(u)}
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                            </Button>
                          )}
                          {u.id !== profile?.id && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:bg-destructive/10"
                              onClick={() => setDeleteUser(u)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          )}
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

      {/* Delete dialog */}
      <Dialog open={!!deleteUser} onOpenChange={(open) => !open && setDeleteUser(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Remover Usuário</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            Remover <strong>{deleteUser?.full_name}</strong> ({deleteUser?.email})?
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteUser(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit custom_data dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário — {editUser?.full_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Custom Data</Label>
              <Input
                value={editCustomData}
                onChange={(e) => setEditCustomData(e.target.value)}
                placeholder="Dado customizado do usuário"
              />
              <p className="text-xs text-muted-foreground">
                Valor individual do usuário. Usado como placeholder <code className="bg-muted px-1 rounded">{'{custom_data}'}</code> nas regras de RLS (Power BI e Looker).
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUser(null)}>Cancelar</Button>
            <Button onClick={handleSaveEdit} disabled={editSaving}>
              {editSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RLS assignment dialog */}
      <Dialog open={!!rlsUser} onOpenChange={(open) => !open && setRlsUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Regras de RLS — {rlsUser?.full_name}</DialogTitle>
          </DialogHeader>
          <p className="text-xs text-muted-foreground">
            Selecione as regras que se aplicam a este usuário. Se nenhuma regra for selecionada, o RLS não será aplicado.
          </p>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {rules.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Nenhuma regra de RLS configurada.
              </p>
            ) : (
              rules.map((r) => (
                <label key={r.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                  <Checkbox
                    checked={userRuleIds.has(r.id)}
                    onCheckedChange={() => toggleRule(r.id)}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{r.name}</p>
                    {r.description && <p className="text-xs text-muted-foreground">{r.description}</p>}
                    <div className="flex gap-2 mt-0.5">
                      <Badge variant={r.report_type === "powerbi" ? "default" : "secondary"} className="text-[10px]">
                        {r.report_type === "powerbi" ? "Power BI" : r.report_type === "looker" ? "Looker" : "—"}
                      </Badge>
                      {r.pbi_role && <Badge variant="outline" className="text-[10px]">role: {r.pbi_role}</Badge>}
                      {r.pbi_custom_data && <Badge variant="outline" className="text-[10px]">data: {r.pbi_custom_data}</Badge>}
                      {r.looker_filters && <Badge variant="outline" className="text-[10px]">Looker</Badge>}
                    </div>
                  </div>
                </label>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRlsUser(null)}>Cancelar</Button>
            <Button onClick={handleSaveRls} disabled={rlsSaving}>
              {rlsSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
