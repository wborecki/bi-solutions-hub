import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const statusLabels: Record<string, string> = {
  aberto: "Aberto",
  em_andamento: "Em Andamento",
  resolvido: "Resolvido",
  fechado: "Fechado",
};

const statusColors: Record<string, string> = {
  aberto: "bg-blue-100 text-blue-800",
  em_andamento: "bg-yellow-100 text-yellow-800",
  resolvido: "bg-green-100 text-green-800",
  fechado: "bg-gray-100 text-gray-800",
};

export default function ChamadoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ticket, setTicket] = useState<Tables<"tickets"> | null>(null);
  const [messages, setMessages] = useState<(Tables<"ticket_messages"> & { author_name?: string })[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchTicket = async () => {
    if (!id) return;
    const { data } = await supabase.from("tickets").select("*").eq("id", id).single();
    setTicket(data);
    setLoading(false);
  };

  const fetchMessages = async () => {
    if (!id) return;
    const { data } = await supabase
      .from("ticket_messages")
      .select("*")
      .eq("ticket_id", id)
      .order("created_at", { ascending: true });

    // Fetch author names
    if (data && data.length > 0) {
      const authorIds = [...new Set(data.map((m) => m.author_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", authorIds);
      const nameMap = new Map(profiles?.map((p) => [p.id, p.full_name]) ?? []);
      setMessages(data.map((m) => ({ ...m, author_name: nameMap.get(m.author_id) || "Usuário" })));
    } else {
      setMessages([]);
    }
  };

  useEffect(() => {
    fetchTicket();
    fetchMessages();
  }, [id]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !id) return;
    setSending(true);
    const { error } = await supabase.from("ticket_messages").insert({
      ticket_id: id,
      author_id: user.id,
      content: newMessage.trim(),
    });
    setSending(false);
    if (error) {
      toast({ title: "Erro", description: "Não foi possível enviar a mensagem.", variant: "destructive" });
    } else {
      setNewMessage("");
      fetchMessages();
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!id) return;
    const { error } = await supabase
      .from("tickets")
      .update({ status: status as Tables<"tickets">["status"] })
      .eq("id", id);
    if (error) {
      toast({ title: "Erro", description: "Não foi possível atualizar o status.", variant: "destructive" });
    } else {
      fetchTicket();
    }
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

  if (!ticket) {
    return (
      <PortalLayout>
        <p className="text-muted-foreground">Chamado não encontrado.</p>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-6 max-w-3xl">
        <Button variant="ghost" size="sm" onClick={() => navigate("/portal/chamados")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-xl">{ticket.title}</CardTitle>
                <p className="text-xs text-muted-foreground mt-1">
                  Criado em {new Date(ticket.created_at).toLocaleDateString("pt-BR")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isAdmin ? (
                  <Select value={ticket.status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="em_andamento">Em Andamento</SelectItem>
                      <SelectItem value="resolvido">Resolvido</SelectItem>
                      <SelectItem value="fechado">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge className={statusColors[ticket.status]}>{statusLabels[ticket.status]}</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-foreground whitespace-pre-wrap">{ticket.description}</p>
          </CardContent>
        </Card>

        {/* Messages */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Mensagens</h3>
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">Nenhuma mensagem ainda.</p>
          )}
          {messages.map((m) => (
            <Card key={m.id} className={m.author_id === user?.id ? "border-primary/30" : ""}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">{m.author_name}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(m.created_at).toLocaleString("pt-BR")}
                  </span>
                </div>
                <p className="text-sm text-foreground whitespace-pre-wrap">{m.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reply */}
        {ticket.status !== "fechado" && (
          <form onSubmit={handleSend} className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Escreva uma mensagem..."
              className="flex-1"
              rows={2}
              maxLength={2000}
            />
            <Button type="submit" disabled={sending || !newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        )}
      </div>
    </PortalLayout>
  );
}
