import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type CSData = {
  id: string;
  embed_url: string;
  services: { name: string; type: string };
};

export default function ServicoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CSData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    supabase
      .from("company_services")
      .select("id, embed_url, services(name, type)")
      .eq("id", id)
      .single()
      .then(({ data }) => {
        setData(data as unknown as CSData);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <PortalLayout>
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </PortalLayout>
    );
  }

  if (!data || !data.embed_url) {
    return (
      <PortalLayout>
        <div className="text-center py-12 text-muted-foreground">Serviço não encontrado ou sem URL configurada.</div>
      </PortalLayout>
    );
  }

  return (
    <PortalLayout>
      <div className="space-y-4 h-full flex flex-col">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/portal/servicos")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-display text-xl font-bold text-foreground">{data.services.name}</h1>
        </div>
        <div className="flex-1 min-h-[70vh] rounded-lg overflow-hidden border bg-background">
          <iframe
            src={data.embed_url}
            className="w-full h-full min-h-[70vh]"
            frameBorder="0"
            allowFullScreen
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    </PortalLayout>
  );
}
