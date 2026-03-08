import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, LineChart, Activity, TrendingUp, Database, FileText, Bot, Scale, Briefcase } from "lucide-react";

type IconComp = React.ComponentType<{ className?: string }>;

const ICON_MAP: Record<string, IconComp> = {
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  TrendingUp,
  Database,
  FileText,
  Bot,
  Scale,
  Briefcase,
};

type ClientService = {
  id: string;
  name: string;
  service_id: string;
  embed_url: string;
  is_active: boolean;
  company_id: string;
  companies?: { name: string } | null;
  services: { id: string; name: string; slug: string; description: string; icon: string; type: string };
};

export default function PortalServicos() {
  const { profile, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<ClientService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);

      if (!profile?.company_id && !isAdmin) {
        setItems([]);
        setLoading(false);
        return;
      }

      let query = supabase
        .from("company_services")
        .select("id, name, service_id, embed_url, is_active, company_id, companies(name), services(id, name, slug, description, icon, type)")
        .eq("is_active", true);

      if (!isAdmin) {
        query = query.eq("company_id", profile!.company_id);
      }

      const { data } = await query;
      setItems((data as unknown as ClientService[]) ?? []);
      setLoading(false);
    };

    fetchItems();
  }, [profile?.company_id, isAdmin]);

  return (
    <PortalLayout>
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold text-foreground">Serviços</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Nenhum serviço ativo para sua empresa.
            </CardContent>
          </Card>
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
                    <p className="font-medium text-foreground">{cs.name || svc.name}</p>
                    {isAdmin && cs.companies?.name && <Badge variant="outline">{cs.companies.name}</Badge>}
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
