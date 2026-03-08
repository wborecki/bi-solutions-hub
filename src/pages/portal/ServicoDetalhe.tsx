import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, ShieldCheck, ShieldAlert } from "lucide-react";

type CSData = {
  id: string;
  embed_url: string;
  config: Record<string, unknown>;
  services: { name: string; type: string };
};

type PbiEmbed = {
  embedUrl: string;
  accessToken: string;
  reportId: string;
};

export default function ServicoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<CSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [pbiEmbed, setPbiEmbed] = useState<PbiEmbed | null>(null);
  const [pbiLoading, setPbiLoading] = useState(false);
  const [pbiError, setPbiError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const [csRes, userRes] = await Promise.all([
        supabase
          .from("company_services")
          .select("id, embed_url, config, services(name, type)")
          .eq("id", id)
          .single(),
        supabase.auth.getUser(),
      ]);

      const csData = csRes.data as unknown as CSData;
      setData(csData);
      setUserEmail(userRes.data?.user?.email ?? "");
      setLoading(false);

      // If Power BI with config, fetch embed token
      if (csData?.services?.type === "bi_embed") {
        const config = csData.config as Record<string, unknown>;
        if (config?.workspace_id && config?.report_id && config?.dataset_id) {
          setPbiLoading(true);
          try {
            const { data: tokenData, error } = await supabase.functions.invoke(
              "generate-pbi-token",
              { body: { company_service_id: csData.id } }
            );
            if (error) throw error;
            if (tokenData?.error) throw new Error(tokenData.error);
            setPbiEmbed(tokenData as PbiEmbed);
          } catch (err: any) {
            console.error("PBI token error:", err);
            setPbiError(err.message || "Erro ao gerar token Power BI");
          } finally {
            setPbiLoading(false);
          }
        }
      }
    };

    fetchData();
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

  if (!data) {
    return (
      <PortalLayout>
        <div className="text-center py-12 text-muted-foreground">
          Serviço não encontrado.
        </div>
      </PortalLayout>
    );
  }

  const serviceType = data.services.type;
  const config = data.config as Record<string, unknown>;
  const hasPbiConfig = config?.workspace_id && config?.report_id && config?.dataset_id;

  // Build iframe URL based on type
  const getIframeUrl = (): string | null => {
    if (serviceType === "bi_embed" && hasPbiConfig && pbiEmbed) {
      // Power BI with RLS token
      return `${pbiEmbed.embedUrl}&autoAuth=true&ctid=`;
    }

    if (serviceType === "looker_embed" && data.embed_url) {
      // Looker: inject filter params
      const filterParams = config?.looker_filters as Record<string, string> | undefined;
      let url = data.embed_url;
      if (filterParams && userEmail) {
        const params: Record<string, string> = {};
        for (const [paramName, paramSource] of Object.entries(filterParams)) {
          if (paramSource === "user_email") params[paramName] = userEmail;
          else if (paramSource === "company_id") {
            // We could get company_id from profile, for now use email
            params[paramName] = userEmail;
          } else {
            params[paramName] = paramSource;
          }
        }
        const separator = url.includes("?") ? "&" : "?";
        url += separator + "params=" + encodeURIComponent(JSON.stringify(params));
      }
      return url;
    }

    // Fallback: simple embed_url
    if (data.embed_url) return data.embed_url;
    return null;
  };

  const iframeUrl = getIframeUrl();
  const isSecureRls = serviceType === "bi_embed" && hasPbiConfig;

  return (
    <PortalLayout>
      <div className="space-y-4 h-full flex flex-col">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/portal/servicos")}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="font-display text-xl font-bold text-foreground">
            {data.services.name}
          </h1>
          {isSecureRls && (
            <span className="flex items-center gap-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full">
              <ShieldCheck className="h-3 w-3" /> RLS Ativo
            </span>
          )}
          {serviceType === "looker_embed" && config?.looker_filters && (
            <span className="flex items-center gap-1 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded-full">
              <ShieldAlert className="h-3 w-3" /> Filtros URL
            </span>
          )}
        </div>

        {pbiLoading && (
          <div className="flex items-center gap-2 text-muted-foreground py-8 justify-center">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Gerando token seguro...</span>
          </div>
        )}

        {pbiError && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-sm">
            <p className="font-medium">Erro na integração Power BI</p>
            <p>{pbiError}</p>
            {!hasPbiConfig && data.embed_url && (
              <p className="mt-2 text-muted-foreground">
                Exibindo relatório sem RLS (URL pública).
              </p>
            )}
          </div>
        )}

        {/* Power BI with RLS — use iframe with token in post message */}
        {isSecureRls && pbiEmbed && !pbiLoading && (
          <div className="flex-1 min-h-[70vh] rounded-lg overflow-hidden border bg-background">
            <iframe
              src={`${pbiEmbed.embedUrl}`}
              className="w-full h-full min-h-[70vh]"
              frameBorder="0"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              onLoad={(e) => {
                // Post the access token to the Power BI iframe
                const iframe = e.target as HTMLIFrameElement;
                const msg = {
                  action: "loadReport",
                  accessToken: pbiEmbed.accessToken,
                  tokenType: 1, // Embed token
                  embedUrl: pbiEmbed.embedUrl,
                  reportId: pbiEmbed.reportId,
                };
                iframe.contentWindow?.postMessage(JSON.stringify(msg), "*");
              }}
            />
          </div>
        )}

        {/* Non-RLS iframe (simple embed or Looker with filters) */}
        {!isSecureRls && iframeUrl && !pbiLoading && (
          <div className="flex-1 min-h-[70vh] rounded-lg overflow-hidden border bg-background">
            <iframe
              src={iframeUrl}
              className="w-full h-full min-h-[70vh]"
              frameBorder="0"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        )}

        {/* Fallback for PBI error — show public URL if available */}
        {isSecureRls && pbiError && data.embed_url && (
          <div className="flex-1 min-h-[70vh] rounded-lg overflow-hidden border bg-background">
            <iframe
              src={data.embed_url}
              className="w-full h-full min-h-[70vh]"
              frameBorder="0"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </div>
        )}

        {!iframeUrl && !pbiEmbed && !pbiLoading && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma URL de embed configurada para este serviço.
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
