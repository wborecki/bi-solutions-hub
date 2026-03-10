import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { PortalLayout } from "@/components/portal/PortalLayout";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Loader2, ShieldCheck, ShieldAlert, Table2, RefreshCw, Maximize2, Minimize2 } from "lucide-react";
import { DataTableView } from "@/components/portal/DataTableView";
import type { ColumnDef } from "@/components/portal/DataTableView";

type CSData = {
  id: string;
  name: string;
  embed_url: string;
  config: Record<string, unknown>;
  services: { name: string; type: string };
};

type PbiEmbed = {
  embedUrl: string;
  accessToken: string;
  reportId: string;
  rlsFilters?: Record<string, string[]>;
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
  const [userCustomData, setUserCustomData] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [userRlsRules, setUserRlsRules] = useState<{ pbi_role: string | null; pbi_custom_data: string | null; pbi_username: string | null; looker_filters: Record<string, string> | null; report_type: string | null }[]>([]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const [csRes, userRes] = await Promise.all([
        supabase
          .from("company_services")
          .select("id, name, embed_url, config, services(name, type)")
          .eq("id", id)
          .single(),
        supabase.auth.getUser(),
      ]);

      const csData = csRes.data as unknown as CSData;
      setData(csData);
      const email = userRes.data?.user?.email ?? "";
      setUserEmail(email);
      const userId = userRes.data?.user?.id;

      // Fetch user profile custom_data
      if (userId) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("custom_data")
          .eq("id", userId)
          .single();
        setUserCustomData(profileData?.custom_data ?? "");
      }

      // Fetch user's RLS rules for this specific service
      if (userId && csData) {
        const { data: rlsData } = await supabase.rpc("get_user_rls_for_service", {
          _user_id: userId,
          _company_service_id: csData.id,
        });
        setUserRlsRules((rlsData as typeof userRlsRules) ?? []);
      }

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

  const handleRefreshPbi = async () => {
    if (!data) return;
    setRefreshing(true);
    try {
      const { data: tokenData, error } = await supabase.functions.invoke(
        "generate-pbi-token",
        { body: { company_service_id: data.id } }
      );
      if (error) throw error;
      if (tokenData?.error) throw new Error(tokenData.error);
      setPbiEmbed(tokenData as PbiEmbed);
      if (iframeRef.current) {
        iframeRef.current.src = tokenData.embedUrl;
      }
    } catch (err: any) {
      setPbiError(err.message || "Erro ao atualizar");
    } finally {
      setRefreshing(false);
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
      return `${pbiEmbed.embedUrl}&autoAuth=true&ctid=`;
    }

    if (serviceType === "looker_embed" && data.embed_url) {
      let url = data.embed_url;
      // Merge user's RLS rule filters
      const rlsLookerFilters = userRlsRules
        .filter((r) => r.looker_filters)
        .reduce<Record<string, string>>((acc, r) => ({ ...acc, ...(r.looker_filters as Record<string, string>) }), {});

      // Use RLS rule filters if available, otherwise fall back to config-level filters
      const filterParams = Object.keys(rlsLookerFilters).length > 0
        ? rlsLookerFilters
        : (config?.looker_filters as Record<string, string> | undefined);

      // Collect custom_data from user's profile for placeholder resolution
      const profileCustomData = userCustomData;

      if (filterParams) {
        const params: Record<string, string> = {};
        for (const [paramName, paramValue] of Object.entries(filterParams)) {
          // Resolve {placeholders} in values
          params[paramName] = paramValue
            .replace(/\{email\}/gi, userEmail)
            .replace(/\{custom_data\}/gi, profileCustomData)
            .replace(/\{user_email\}/gi, userEmail);
        }

        if (Object.keys(params).length > 0) {
          const separator = url.includes("?") ? "&" : "?";
          url += separator + "params=" + encodeURIComponent(JSON.stringify(params));
        }
      }
      return url;
    }

    if (data.embed_url) return data.embed_url;
    return null;
  };

  const iframeUrl = getIframeUrl();
  const isSecureRls = serviceType === "bi_embed" && hasPbiConfig;
  const hasUserRlsRules = userRlsRules.length > 0;

  const isReport = serviceType === "bi_embed" || serviceType === "looker_embed";

  return (
    <PortalLayout>
      {/* Fullscreen overlay */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
            <div className="flex items-center gap-2 min-w-0">
              <button
                onClick={() => setFullscreen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="font-medium text-sm text-foreground truncate">
                {data.name || data.services.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {serviceType === "bi_embed" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefreshPbi}
                  disabled={refreshing || pbiLoading}
                >
                  <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
                  Atualizar
                </Button>
              )}
              <Button variant="ghost" size="icon" onClick={() => setFullscreen(false)}>
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-1">
            {isSecureRls && pbiEmbed && (
              <iframe
                ref={iframeRef}
                src={pbiEmbed.embedUrl}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
                onLoad={(e) => {
                  const iframe = e.target as HTMLIFrameElement;
                  const msg = {
                    action: "loadReport",
                    accessToken: pbiEmbed.accessToken,
                    tokenType: 1,
                    embedUrl: pbiEmbed.embedUrl,
                    reportId: pbiEmbed.reportId,
                  };
                  iframe.contentWindow?.postMessage(JSON.stringify(msg), "*");
                }}
              />
            )}
            {!isSecureRls && iframeUrl && (
              <iframe
                src={iframeUrl}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
              />
            )}
          </div>
        </div>
      )}

      <div className="space-y-3 h-full flex flex-col">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => navigate("/portal/servicos")}
              className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h1 className="font-display text-lg font-semibold text-foreground truncate">
              {data.name || data.services.name}
            </h1>
            {isSecureRls && (
              <span className="hidden sm:flex items-center gap-1 text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                <ShieldCheck className="h-3 w-3" /> RLS
              </span>
            )}
            {hasUserRlsRules && serviceType === "looker_embed" && (
              <span className="hidden sm:flex items-center gap-1 text-[10px] bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                <ShieldCheck className="h-3 w-3" /> RLS
              </span>
            )}
            {serviceType === "looker_embed" && !hasUserRlsRules && config?.looker_filters && (
              <span className="hidden sm:flex items-center gap-1 text-[10px] bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                <ShieldAlert className="h-3 w-3" /> Filtros
              </span>
            )}
            {serviceType === "data_table" && (
              <span className="hidden sm:flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded-full whitespace-nowrap">
                <Table2 className="h-3 w-3" /> Tabela
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {serviceType === "bi_embed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefreshPbi}
                disabled={refreshing || pbiLoading}
              >
                <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Atualizando..." : "Atualizar"}
              </Button>
            )}
            {isReport && (iframeUrl || pbiEmbed) && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => setFullscreen(true)}
                title="Expandir"
                className="h-8 w-8"
              >
                <Maximize2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
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
              ref={iframeRef}
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

        {!iframeUrl && !pbiEmbed && !pbiLoading && serviceType !== "data_table" && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhuma URL de embed configurada para este serviço.
          </div>
        )}

        {/* Data Table view */}
        {serviceType === "data_table" && (
          <DataTableView
            companyServiceId={data.id}
            config={{
              columns: Array.isArray(config?.columns) ? (config.columns as ColumnDef[]) : [],
              row_limit: typeof config?.row_limit === "number" ? config.row_limit : 5000,
              page_size: typeof config?.page_size === "number" ? config.page_size : 25,
              allow_export: !!config?.allow_export,
              source: config?.source === "external_db" ? "external_db" : "manual",
              cache_ttl_minutes: typeof config?.cache_ttl_minutes === "number" ? config.cache_ttl_minutes : 15,
            }}
          />
        )}
      </div>
    </PortalLayout>
  );
}
