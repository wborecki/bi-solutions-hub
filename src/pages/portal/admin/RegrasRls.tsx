import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Plus, Pencil, Trash2, Users, ShieldCheck } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type RlsRule = Tables<"rls_rules">;
type ProfileRow = Tables<"profiles">;
type CompanyService = { id: string; name: string; service_type: string };

export default function RegrasRls() {
  const { id: companyId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [companyName, setCompanyName] = useState("");
  const [rules, setRules] = useState<RlsRule[]>([]);
  const [companyServices, setCompanyServices] = useState<CompanyService[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editRule, setEditRule] = useState<RlsRule | null>(null);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formReportType, setFormReportType] = useState<"powerbi" | "looker">("powerbi");
  const [formServiceId, setFormServiceId] = useState("__all__");
  const [formPbiRole, setFormPbiRole] = useState("");
  const [formPbiCustomData, setFormPbiCustomData] = useState("");
  const [formPbiUsername, setFormPbiUsername] = useState("");
  const [formLookerFilters, setFormLookerFilters] = useState("");
  const [saving, setSaving] = useState(false);

  // Delete
  const [deleteRule, setDeleteRule] = useState<RlsRule | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Assign users dialog
  const [assignRule, setAssignRule] = useState<RlsRule | null>(null);
  const [companyUsers, setCompanyUsers] = useState<ProfileRow[]>([]);
  const [assignedUserIds, setAssignedUserIds] = useState<Set<string>>(new Set());
  const [assignSaving, setAssignSaving] = useState(false);

  const fetchData = async () => {
    if (!companyId) return;
    const [{ data: company }, { data: rulesData }, { data: servicesData }] = await Promise.all([
      supabase.from("companies").select("name").eq("id", companyId).single(),
      supabase.from("rls_rules").select("*").eq("company_id", companyId).order("name"),
      supabase
        .from("company_services")
        .select("id, name, services(type)")
        .eq("company_id", companyId)
        .eq("is_active", true)
        .order("name"),
    ]);
    setCompanyName(company?.name ?? "");
    setRules(rulesData ?? []);
    setCompanyServices(
      (servicesData ?? []).map((s: any) => ({
        id: s.id,
        name: s.name,
        service_type: s.services?.type ?? "",
      }))
    );
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [companyId]);

  const resetForm = () => {
    setFormName(""); setFormDesc(""); setFormReportType("powerbi"); setFormServiceId("__all__");
    setFormPbiRole(""); setFormPbiCustomData(""); setFormPbiUsername(""); setFormLookerFilters("");
    setEditRule(null); setShowForm(false);
  };

  const openEdit = (rule: RlsRule) => {
    setEditRule(rule);
    setFormName(rule.name);
    setFormDesc(rule.description ?? "");
    setFormReportType((rule.report_type as "powerbi" | "looker") ?? "powerbi");
    setFormServiceId(rule.company_service_id ?? "__all__");
    setFormPbiRole(rule.pbi_role ?? "");
    setFormPbiCustomData(rule.pbi_custom_data ?? "");
    setFormPbiUsername(rule.pbi_username ?? "");
    const lf = rule.looker_filters;
    setFormLookerFilters(lf ? JSON.stringify(lf, null, 2) : "");
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId) return;
    setSaving(true);

    let parsedFilters = null;
    if (formReportType === "looker" && formLookerFilters.trim()) {
      try {
        parsedFilters = JSON.parse(formLookerFilters.trim());
      } catch {
        toast({ title: "JSON inválido", description: "Os filtros Looker devem ser um JSON válido.", variant: "destructive" });
        setSaving(false);
        return;
      }
    }

    const payload = {
      company_id: companyId,
      name: formName.trim(),
      description: formDesc.trim(),
      report_type: formReportType,
      company_service_id: formServiceId === "__all__" ? null : (formServiceId || null),
      pbi_role: formReportType === "powerbi" ? (formPbiRole.trim() || null) : null,
      pbi_custom_data: formReportType === "powerbi" ? (formPbiCustomData.trim() || null) : null,
      pbi_username: formReportType === "powerbi" ? (formPbiUsername.trim() || null) : null,
      looker_filters: formReportType === "looker" ? parsedFilters : null,
    };

    if (editRule) {
      const { error } = await supabase.from("rls_rules").update(payload).eq("id", editRule.id);
      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      toast({ title: "Regra atualizada!" });
    } else {
      const { error } = await supabase.from("rls_rules").insert(payload);
      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
        setSaving(false);
        return;
      }
      toast({ title: "Regra criada!" });
    }

    setSaving(false);
    resetForm();
    fetchData();
  };

  const handleDelete = async () => {
    if (!deleteRule) return;
    setDeleting(true);
    const { error } = await supabase.from("rls_rules").delete().eq("id", deleteRule.id);
    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Regra removida!" });
    }
    setDeleting(false);
    setDeleteRule(null);
    fetchData();
  };

  // Open user assignment dialog
  const openAssign = async (rule: RlsRule) => {
    if (!companyId) return;
    setAssignRule(rule);

    const [{ data: users }, { data: assignments }] = await Promise.all([
      supabase.from("profiles").select("*").eq("company_id", companyId).order("full_name"),
      supabase.from("user_rls_rules").select("user_id").eq("rls_rule_id", rule.id),
    ]);

    setCompanyUsers(users ?? []);
    setAssignedUserIds(new Set((assignments ?? []).map((a) => a.user_id)));
  };

  const toggleUser = (userId: string) => {
    setAssignedUserIds((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const handleSaveAssignments = async () => {
    if (!assignRule) return;
    setAssignSaving(true);

    // Delete all current assignments and re-insert
    await supabase.from("user_rls_rules").delete().eq("rls_rule_id", assignRule.id);

    if (assignedUserIds.size > 0) {
      const rows = Array.from(assignedUserIds).map((uid) => ({
        user_id: uid,
        rls_rule_id: assignRule.id,
      }));
      const { error } = await supabase.from("user_rls_rules").insert(rows);
      if (error) {
        toast({ title: "Erro", description: error.message, variant: "destructive" });
        setAssignSaving(false);
        return;
      }
    }

    toast({ title: "Usuários atualizados!" });
    setAssignSaving(false);
    setAssignRule(null);
  };

  // Filter services by the selected report type
  const filteredServices = companyServices.filter((s) =>
    formReportType === "powerbi" ? s.service_type === "bi_embed" : s.service_type === "looker_embed"
  );

  // Helper to get service name by id
  const getServiceName = (id: string | null) => {
    if (!id) return null;
    return companyServices.find((s) => s.id === id)?.name ?? null;
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/portal/admin/empresas`)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Regras de RLS</h1>
            <p className="text-sm text-muted-foreground">{companyName}</p>
          </div>
          <div className="ml-auto">
            <Button onClick={() => { resetForm(); setShowForm(true); }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Regra
            </Button>
          </div>
        </div>

        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle>{editRule ? "Editar Regra" : "Nova Regra de RLS"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Nome da Regra</Label>
                    <Input
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ex: Região Sul, Vendedor A"
                      required
                      maxLength={200}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Descrição opcional"
                      maxLength={500}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Relatório</Label>
                    <Select value={formReportType} onValueChange={(v) => setFormReportType(v as "powerbi" | "looker")}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="powerbi">Power BI</SelectItem>
                        <SelectItem value="looker">Looker</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Relatório (serviço)</Label>
                    <Select value={formServiceId} onValueChange={setFormServiceId}>
                      <SelectTrigger><SelectValue placeholder="Todos do tipo" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__all__">Todos os relatórios do tipo</SelectItem>
                        {filteredServices.map((s) => (
                          <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Vincular a um relatório específico ou aplicar a todos do tipo selecionado.
                    </p>
                  </div>

                  {formReportType === "powerbi" && (
                    <>
                      <div className="space-y-2">
                        <Label>Power BI - Nome do Role</Label>
                        <Input
                          value={formPbiRole}
                          onChange={(e) => setFormPbiRole(e.target.value)}
                          placeholder="Ex: RegionFilter, Reader"
                        />
                        <p className="text-xs text-muted-foreground">
                          Nome do role RLS configurado no Power BI Desktop.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label>Power BI - Username</Label>
                        <Input
                          value={formPbiUsername}
                          onChange={(e) => setFormPbiUsername(e.target.value)}
                          placeholder="{email} ou valor fixo. Vazio = email do usuário"
                        />
                        <p className="text-xs text-muted-foreground">
                          Use <code className="bg-muted px-1 rounded">{'{email}'}</code> para email do usuário, <code className="bg-muted px-1 rounded">{'{custom_data}'}</code> para o Custom Data do perfil do usuário, ou um valor fixo. Acessível via <code className="bg-muted px-1 rounded">USERNAME()</code> no DAX.
                        </p>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label>Power BI - Custom Data</Label>
                        <Input
                          value={formPbiCustomData}
                          onChange={(e) => setFormPbiCustomData(e.target.value)}
                          placeholder="Ex: Sul, {custom_data}, Filial-SP"
                        />
                        <p className="text-xs text-muted-foreground">
                          Valor passado ao PBI. Use <code className="bg-muted px-1 rounded">{'{custom_data}'}</code> para puxar do campo Custom Data do perfil do usuário, <code className="bg-muted px-1 rounded">{'{email}'}</code> para o email, ou um valor fixo. Acessível via <code className="bg-muted px-1 rounded">CUSTOMDATA()</code> no DAX.
                        </p>
                      </div>
                    </>
                  )}

                  {formReportType === "looker" && (
                    <div className="space-y-2 md:col-span-2">
                      <Label>Looker - Filtros (JSON)</Label>
                      <Input
                        value={formLookerFilters}
                        onChange={(e) => setFormLookerFilters(e.target.value)}
                        placeholder='Ex: {"region": "Sul"}'
                      />
                      <p className="text-xs text-muted-foreground">
                        JSON com filtros Looker. Use placeholders: <code className="bg-muted px-1 rounded">{'{email}'}</code>, <code className="bg-muted px-1 rounded">{'{custom_data}'}</code> (do perfil do usuário).<br/>
                        Ex: <code className="bg-muted px-1 rounded">{'{"email": "{email}", "cidade": "{custom_data}"}'}</code>
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : editRule ? "Salvar" : "Criar Regra"}
                  </Button>
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
        ) : rules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <ShieldCheck className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>Nenhuma regra de RLS configurada para esta empresa.</p>
              <p className="text-xs mt-1">Crie regras para controlar o acesso aos relatórios.</p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Relatório</TableHead>
                    <TableHead>Configuração</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{rule.name}</p>
                          {rule.description && (
                            <p className="text-muted-foreground text-xs max-w-[200px] truncate">{rule.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.report_type === "powerbi" ? "default" : "secondary"} className="text-xs">
                          {rule.report_type === "powerbi" ? "Power BI" : rule.report_type === "looker" ? "Looker" : "—"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {getServiceName(rule.company_service_id) ?? <span className="italic">Todos</span>}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          {rule.report_type === "powerbi" && (
                            <>
                              {rule.pbi_role && <Badge variant="secondary" className="text-[10px]">role: {rule.pbi_role}</Badge>}
                              {rule.pbi_username && <Badge variant="outline" className="text-[10px]">user: {rule.pbi_username}</Badge>}
                              {rule.pbi_custom_data && <Badge variant="outline" className="text-[10px]">data: {rule.pbi_custom_data}</Badge>}
                            </>
                          )}
                          {rule.report_type === "looker" && rule.looker_filters && (
                            <Badge variant="outline" className="text-xs font-mono">
                              {JSON.stringify(rule.looker_filters).substring(0, 40)}
                            </Badge>
                          )}
                          {!rule.pbi_role && !rule.pbi_username && !rule.pbi_custom_data && !rule.looker_filters && "—"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            title="Atribuir usuários"
                            onClick={() => openAssign(rule)}
                          >
                            <Users className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(rule)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => setDeleteRule(rule)}
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

      {/* Delete dialog */}
      <Dialog open={!!deleteRule} onOpenChange={(open) => !open && setDeleteRule(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remover Regra</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Remover a regra <strong>{deleteRule?.name}</strong>? Isso também removerá as atribuições de usuários.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteRule(null)}>Cancelar</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign users dialog */}
      <Dialog open={!!assignRule} onOpenChange={(open) => !open && setAssignRule(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Atribuir Usuários — {assignRule?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {companyUsers.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Nenhum usuário nesta empresa.
              </p>
            ) : (
              companyUsers.map((u) => (
                <label key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted cursor-pointer">
                  <Checkbox
                    checked={assignedUserIds.has(u.id)}
                    onCheckedChange={() => toggleUser(u.id)}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{u.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                  </div>
                </label>
              ))
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignRule(null)}>Cancelar</Button>
            <Button onClick={handleSaveAssignments} disabled={assignSaving}>
              {assignSaving ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PortalLayout>
  );
}
