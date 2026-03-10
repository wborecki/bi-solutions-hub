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

    const { data: { user: authUser }, error: userError } = await supabase.auth.getUser();
    if (userError || !authUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userEmail = authUser.email as string;
    const userId = authUser.id;

    const { company_service_id } = await req.json();
    if (!company_service_id) {
      return new Response(JSON.stringify({ error: "company_service_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Fetch company_service config
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

    if (!workspaceId || !reportId || !datasetId) {
      return new Response(
        JSON.stringify({ error: "Power BI config incomplete (workspace_id, report_id, dataset_id required)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check if user has RLS rules assigned for this company
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get company_id from the service
    const { data: csInfo } = await supabaseAdmin
      .from("company_services")
      .select("company_id")
      .eq("id", company_service_id)
      .single();

    // Fetch user's profile custom_data
    const { data: profileData } = await supabaseAdmin
      .from("profiles")
      .select("custom_data")
      .eq("id", userId)
      .single();
    const userProfileCustomData = profileData?.custom_data ?? "";

    let userRlsRoles: string[] = [];
    let userCustomData: string | null = null;
    let userPbiUsername: string | null = null;

    // Use get_user_rls_for_service to get rules for this specific service
    const { data: rlsData } = await supabaseAdmin.rpc("get_user_rls_for_service", {
      _user_id: userId,
      _company_service_id: company_service_id,
    });
    if (rlsData && rlsData.length > 0) {
      userRlsRoles = rlsData
        .filter((r: { pbi_role: string | null }) => r.pbi_role)
        .map((r: { pbi_role: string }) => r.pbi_role);
      // Get first custom data and username found
      const firstWithCustom = rlsData.find((r: { pbi_custom_data: string | null }) => r.pbi_custom_data);
      if (firstWithCustom) {
        let cd = firstWithCustom.pbi_custom_data as string;
        cd = cd.replace(/\{custom_data\}/gi, userProfileCustomData);
        cd = cd.replace(/\{email\}/gi, userEmail);
        userCustomData = cd;
      }
      const firstWithUsername = rlsData.find((r: { pbi_username: string | null }) => r.pbi_username);
      if (firstWithUsername) {
        let uname = firstWithUsername.pbi_username as string;
        uname = uname.replace(/\{email\}/gi, userEmail);
        uname = uname.replace(/\{custom_data\}/gi, userProfileCustomData);
        userPbiUsername = uname;
      }
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

    // Generate Power BI embed token — with or without RLS identity
    const embedUrl = `https://api.powerbi.com/v1.0/myorg/groups/${workspaceId}/reports/${reportId}/GenerateToken`;
    const embedBody: Record<string, unknown> = { accessLevel: "View" };

    // Only apply RLS identities if user has rules assigned
    if (userRlsRoles.length > 0) {
      const identity: Record<string, unknown> = {
        username: userPbiUsername || userEmail,
        roles: userRlsRoles,
        datasets: [datasetId],
      };
      if (userCustomData) {
        identity.customData = userCustomData;
      }
      embedBody.identities = [identity];
    }

    console.log("RLS identity:", JSON.stringify(embedBody));

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
