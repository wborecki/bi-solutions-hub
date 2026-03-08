import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, ArrowLeft } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const statusColors: Record<string, string> = {
  aberto: "bg-blue-100 text-blue-800",
  em_andamento: "bg-yellow-100 text-yellow-800",
  resolvido: "bg-green-100 text-green-800",
  fechado: "bg-gray-100 text-gray-800",
};

const statusLabels: Record<string, string> = {
  aberto: "Aberto",
  em_andamento: "Em Andamento",
  resolvido: "Resolvido",
  fechado: "Fechado",
};

const priorityLabels: Record<string, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  urgente: "Urgente",
};

type TicketWithCompany = Tables<"tickets"> & { companies?: { name: string } | null };

export default function Chamados() {
  const { user, profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [tickets, setTickets] = useState<TicketWithCompany[]>([]);
  const [companies, setCompanies] = useState<Tables<"companies">[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(searchParams.get("new") === "true");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("media");
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCompany, setFilterCompany] = useState<string>("all");

  const fetchTickets = async () => {
    const [ticketsRes, companiesRes] = await Promise.all([
      supabase.from("tickets").select("*, companies(name)").order("created_at", { ascending: false }),
      isAdmin ? supabase.from("companies").select("*").order("name") : Promise.resolve({ data: [] }),
    ]);

    setTickets((ticketsRes.data ?? []) as TicketWithCompany[]);
    if (isAdmin) {
      setCompanies((companiesRes.data ?? []) as Tables<"companies">[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const matchStatus = filterStatus === "all" || t.status === filterStatus;
      const matchCompany = filterCompany === "all" || t.company_id === filterCompany;
      return matchStatus && matchCompany;
    });
  }, [tickets, filterStatus, filterCompany]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile?.company_id) {
      toast({ title: "Erro", description: "Sua conta não está vinculada a uma empresa.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("tickets").insert({
      title: title.trim(),
      description: description.trim(),
      priority: priority as Tables<"tickets">["priority"],
      company_id: profile.company_id,
      created_by: user.id,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Erro", description: "Não foi possível criar o chamado.", variant: "destructive" });
    } else {
      toast({ title: "Chamado criado!" });
      setTitle("");
      setDescription("");
      setPriority("media");
      setShowForm(false);
      setSearchParams({});
      fetchTickets();
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-foreground">Chamados</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? <ArrowLeft className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            {showForm ? "Voltar" : "Novo Chamado"}
          </Button>
        </div>

        {showForm ? (
          <Card>
            <CardHeader>
              <CardTitle>Novo Chamado</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-2">
                  <Label>Título</Label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={200} placeholder="Descreva brevemente o problema" />
                </div>
                <div className="space-y-2">
                  <Label>Descrição</Label>
                  <Textarea value={description} onChange={(e) => setDescription(e.target.value)} required maxLength={2000} rows={5} placeholder="Detalhe o problema ou solicitação..." />
                </div>
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={submitting}>
                  {submitting ? "Criando..." : "Criar Chamado"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-2 flex-wrap">
                {["all", "aberto", "em_andamento", "resolvido", "fechado"].map((s) => (
                  <Button
                    key={s}
                    variant={filterStatus === s ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterStatus(s)}
                  >
                    {s === "all" ? "Todos" : statusLabels[s]}
                  </Button>
                ))}
              </div>
              {isAdmin && companies.length > 0 && (
                <Select value={filterCompany} onValueChange={setFilterCompany}>
                  <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Todas as empresas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as empresas</SelectItem>
                    {companies.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Nenhum chamado encontrado.
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {filtered.map((t) => (
                  <Card
                    key={t.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => navigate(`/portal/chamados/${t.id}`)}
                  >
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{t.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(t.created_at).toLocaleDateString("pt-BR")} · {priorityLabels[t.priority]}
                          {isAdmin && t.companies?.name && ` · ${t.companies.name}`}
                        </p>
                      </div>
                      <Badge className={statusColors[t.status]}>{statusLabels[t.status]}</Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </PortalLayout>
  );
}
