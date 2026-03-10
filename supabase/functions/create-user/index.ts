import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify the caller is authorized (admin or client_admin)
    const authHeader = req.headers.get("Authorization");
    const body = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get caller info for authorization check
    let callerId: string | null = null;
    if (authHeader?.startsWith("Bearer ")) {
      const supabaseAuth = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_ANON_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user: callerUser } } = await supabaseAuth.auth.getUser();
      callerId = callerUser?.id ?? null;
    }

    // Check caller's role
    let callerRole = "";
    let callerCompanyId: string | null = null;
    if (callerId) {
      const { data: roleData } = await supabaseAdmin
        .from("user_roles")
        .select("role")
        .eq("user_id", callerId)
        .single();
      callerRole = roleData?.role ?? "";

      const { data: profileData } = await supabaseAdmin
        .from("profiles")
        .select("company_id")
        .eq("id", callerId)
        .single();
      callerCompanyId = profileData?.company_id ?? null;
    }

    const isAdmin = callerRole === "admin";
    const isClientAdmin = callerRole === "client_admin";

    if (!isAdmin && !isClientAdmin) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE action
    if (body.action === "delete" && body.user_id) {
      // Client admins can only delete users from their own company
      if (isClientAdmin && !isAdmin) {
        const { data: targetProfile } = await supabaseAdmin
          .from("profiles")
          .select("company_id")
          .eq("id", body.user_id)
          .single();
        if (targetProfile?.company_id !== callerCompanyId) {
          return new Response(JSON.stringify({ error: "Você só pode remover usuários da sua empresa." }), {
            status: 403,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
      // Delete profile, roles, then auth user
      await supabaseAdmin.from("user_rls_rules").delete().eq("user_id", body.user_id);
      await supabaseAdmin.from("user_roles").delete().eq("user_id", body.user_id);
      await supabaseAdmin.from("profiles").delete().eq("id", body.user_id);
      const { error } = await supabaseAdmin.auth.admin.deleteUser(body.user_id);
      if (error) throw error;
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // CREATE action
    const { email, password, full_name, company_id, role } = body;

    // Client admins can only create users in their own company, with 'client' role
    if (isClientAdmin && !isAdmin) {
      if (company_id !== callerCompanyId) {
        return new Response(JSON.stringify({ error: "Você só pode criar usuários na sua empresa." }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (role && role !== "client") {
        return new Response(JSON.stringify({ error: "Você só pode criar usuários com função 'cliente'." }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name },
    });

    if (createError) throw createError;

    const userId = userData.user.id;

    if (company_id) {
      await supabaseAdmin.from("profiles").update({ company_id }).eq("id", userId);
    }

    if (role) {
      await supabaseAdmin.from("user_roles").insert({ user_id: userId, role });
    }

    return new Response(JSON.stringify({ success: true, user_id: userId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return new Response(JSON.stringify({ error: msg }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
