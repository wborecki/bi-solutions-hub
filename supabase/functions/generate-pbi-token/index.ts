import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userEmail = claimsData.claims.email as string;
    const userId = claimsData.claims.sub as string;

    // Get request body
    const { company_service_id } = await req.json();
    if (!company_service_id) {
      return new Response(JSON.stringify({ error: "company_service_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch the company_service config (uses RLS — user must have access)
    const { data: cs, error: csError } = await supabase
      .from("company_services")
      .select("id, embed_url, config, services(name, type)")
      .eq("id", company_service_id)
      .single();

    if (csError || !cs) {
      return new Response(JSON.stringify({ error: "Service not found or access denied" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const config = cs.config as Record<string, unknown>;
    const workspaceId = config?.workspace_id as string;
    const reportId = config?.report_id as string;
    const datasetId = config?.dataset_id as string;
    const rlsRole = (config?.rls_role as string) || "Reader";

    if (!workspaceId || !reportId || !datasetId) {
      return new Response(
        JSON.stringify({ error: "Power BI config incomplete (workspace_id, report_id, dataset_id required)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get Azure AD token
    const tenantId = Deno.env.get("PBI_TENANT_ID")!;
    const clientId = Deno.env.get("PBI_CLIENT_ID")!;
    const clientSecret = Deno.env.get("PBI_CLIENT_SECRET")!;

    const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
    const tokenBody = new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "https://analysis.windows.net/powerbi/api/.default",
    });

    const azureRes = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: tokenBody.toString(),
    });
    const azureData = await azureRes.json();

    if (!azureData.access_token) {
      console.error("Azure AD token error:", azureData);
      return new Response(JSON.stringify({ error: "Failed to get Azure AD token" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const azureToken = azureData.access_token;

    // Generate Power BI embed token with RLS identity
    const embedUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`;
    const embedBody = {
      accessLevel: "View",
      identities: [
        {
          username: userEmail,
          roles: [rlsRole],
          datasets: [datasetId],
        },
      ],
    };

    const embedRes = await fetch(embedUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${azureToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(embedBody),
    });
    const embedData = await embedRes.json();

    if (!embedData.token) {
      console.error("Power BI embed token error:", embedData);
      return new Response(JSON.stringify({ error: "Failed to generate embed token", details: embedData }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get the embed URL for the report
    const reportInfoRes = await fetch(
      `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}`,
      { headers: { Authorization: `Bearer ${azureToken}` } }
    );
    const reportInfo = await reportInfoRes.json();

    return new Response(
      JSON.stringify({
        embedUrl: reportInfo.embedUrl,
        accessToken: embedData.token,
        tokenExpiry: embedData.expiration,
        reportId,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
