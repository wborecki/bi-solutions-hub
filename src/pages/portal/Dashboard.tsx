import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Ticket, FolderOpen, Plus, Clock, BarChart3 } from "lucide-react";

export default function Dashboard() {
  const { profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [ticketCount, setTicketCount] = useState(0);
  const [openTickets, setOpenTickets] = useState(0);
  const [docCount, setDocCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      const { count: total } = await supabase
        .from("tickets")
        .select("*", { count: "exact", head: true });
      setTicketCount(total ?? 0);

      const { count: open } = await supabase
        .from("tickets")
        .select("*", { count: "exact", head: true })
        .in("status", ["aberto", "em_andamento"]);
      setOpenTickets(open ?? 0);

      const { count: docs } = await supabase
        .from("documents")
        .select("*", { count: "exact", head: true });
      setDocCount(docs ?? 0);

      const { count: svcs } = await supabase
        .from("company_services")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);
      setServiceCount(svcs ?? 0);
    };
    fetchStats();
  }, []);

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">
            Olá, {profile?.full_name || "Usuário"} 👋
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {isAdmin ? "Visão geral de todas as empresas" : "Resumo do seu portal"}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Chamados</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{ticketCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Chamados Abertos</CardTitle>
              <Clock className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">{openTickets}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Documentos</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{docCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Serviços Ativos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{serviceCount}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          <Button onClick={() => navigate("/portal/chamados?new=true")}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Chamado
          </Button>
          <Button variant="outline" onClick={() => navigate("/portal/documentos")}>
            <FolderOpen className="h-4 w-4 mr-2" />
            Ver Documentos
          </Button>
        </div>
      </div>
    </>
  );
}
