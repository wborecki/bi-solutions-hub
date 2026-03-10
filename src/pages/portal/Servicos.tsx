import { useEffect, useState, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, LineChart, Activity, TrendingUp, Database, FileText, Bot, Scale, Briefcase } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type IconComp = React.ComponentType<{ className?: string }>;

const ICON_MAP: Record<string, IconComp> = {
  BarChart3, PieChart, LineChart, Activity, TrendingUp, Database, FileText, Bot, Scale, Briefcase,
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
  const [companies, setCompanies] = useState<Tables<"companies">[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCompany, setFilterCompany] = useState("all");

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);

      if (!profile?.company_id && !isAdmin) {
        setItems([]);
        setLoading(false);
        return;
      }

      const csPromise = supabase
          .from("company_services")
          .select("id, name, service_id, embed_url, is_active, company_id, companies(name), services(id, name, slug, description, icon, type)")
          .eq("is_active", true);

      const [csRes, companiesRes] = await Promise.all([
        csPromise,
        isAdmin ? supabase.from("companies").select("*").order("name") : Promise.resolve({ data: [] }),
      ]);

      let data = (csRes.data ?? []) as unknown as ClientService[];

      if (!isAdmin) {
        data = data.filter(d => d.company_id === profile!.company_id);
      }

      setItems(data);

      if (isAdmin) {
        setCompanies((companiesRes.data ?? []) as Tables<"companies">[]);
      }

      setLoading(false);
    };

    fetchItems();
  }, [profile?.company_id, isAdmin]);

  const filtered = useMemo(() => {
    if (filterCompany === "all") return items;
    return items.filter(i => i.company_id === filterCompany);
  }, [items, filterCompany]);

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="font-display text-2xl font-bold text-foreground">Serviços</h1>
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
              Nenhum serviço ativo {filterCompany !== "all" ? "para esta empresa" : "para sua empresa"}.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cs) => {
              const svc = cs.services;
              const Icon = ICON_MAP[svc.icon] ?? BarChart3;
              const hasEmbed = (svc.type === "bi_embed" || svc.type === "looker_embed") && cs.embed_url;
              const isDataTable = svc.type === "data_table";
              const isClickable = hasEmbed || isDataTable;

              return (
                <Card
                  key={cs.id}
                  className={`transition-colors ${isClickable ? "cursor-pointer hover:border-primary/50" : ""}`}
                  onClick={() => isClickable && navigate(`/portal/servicos/${cs.id}`)}
                >
                  <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <p className="font-medium text-foreground">{cs.name || svc.name}</p>
                    {isAdmin && cs.companies?.name && <Badge variant="outline">{cs.companies.name}</Badge>}
                    {svc.description && <p className="text-xs text-muted-foreground line-clamp-2">{svc.description}</p>}
                    {hasEmbed && <span className="text-xs text-primary font-medium">Abrir relatório →</span>}
                    {isDataTable && <span className="text-xs text-primary font-medium">Abrir tabela →</span>}
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
