import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { BarChart3, PieChart, LineChart, Activity, TrendingUp, Database, FileText, Bot, Scale, Briefcase } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  BarChart3, PieChart, LineChart, Activity, TrendingUp, Database, FileText, Bot, Scale, Briefcase,
};

type ClientService = {
  id: string;
  service_id: string;
  embed_url: string;
  is_active: boolean;
  services: { id: string; name: string; slug: string; description: string; icon: string; type: string };
};

export default function PortalServicos() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<ClientService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile?.company_id) { setLoading(false); return; }
    supabase
      .from("company_services")
      .select("id, service_id, embed_url, is_active, services(id, name, slug, description, icon, type)")
      .eq("company_id", profile.company_id)
      .eq("is_active", true)
      .then(({ data }) => {
        setItems((data as unknown as ClientService[]) ?? []);
        setLoading(false);
      });
  }, [profile?.company_id]);

  return (
    <PortalLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Serviços</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum serviço ativo para sua empresa.</CardContent></Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((cs) => {
              const svc = cs.services;
              const Icon = ICON_MAP[svc.icon] ?? BarChart3;
              const hasEmbed = (svc.type === "bi_embed" || svc.type === "looker_embed") && cs.embed_url;
              return (
                <Card
                  key={cs.id}
                  className={`transition-colors ${hasEmbed ? "cursor-pointer hover:border-primary/50" : ""}`}
                  onClick={() => hasEmbed && navigate(`/portal/servicos/${cs.id}`)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium text-foreground">{svc.name}</p>
                    {svc.description && <p className="text-xs text-muted-foreground line-clamp-2">{svc.description}</p>}
                    {hasEmbed && <span className="text-xs text-primary font-medium">Abrir relatório →</span>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
