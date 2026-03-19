import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Client as PgClient } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Auth ────────────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return json({ error: "Unauthorized" }, 401);
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Verify user
    const {
      data: { user: authUser },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !authUser) {
      return json({ error: "Unauthorized" }, 401);
    }

    // ── Request body ────────────────────────────────────────
    const body = await req.json();
    const companyServiceId: string = body.company_service_id;
    const rowId: string = body.row_id;
    const observation: string | null =
      typeof body.observation === "string" ? body.observation : null;

    if (!companyServiceId || !rowId) {
      return json({ error: "company_service_id and row_id required" }, 400);
    }

    // ── Fetch service config (uses RLS – user must have access) ──
    const { data: cs, error: csError } = await userClient
      .from("company_services")
      .select("id, config")
      .eq("id", companyServiceId)
      .single();

    if (csError || !cs) {
      return json({ error: "Service not found or access denied" }, 404);
    }

    const config = cs.config as Record<string, unknown>;

    // Validate observations config
    const obsTable = config.observations_table as string | undefined;
    const obsColumn = config.observations_column as string | undefined;
    const pkColumn = config.primary_key as string | undefined;

    if (!obsTable || !obsColumn || !pkColumn) {
      return json(
        {
          error:
            "Service not configured for external observations (observations_table, observations_column, primary_key required)",
        },
        400
      );
    }

    // ── Fetch the row to get the primary key value ──────────
    const { data: row, error: rowError } = await userClient
      .from("data_table_rows")
      .select("id, data")
      .eq("id", rowId)
      .eq("company_service_id", companyServiceId)
      .single();

    if (rowError || !row) {
      return json({ error: "Row not found or access denied" }, 404);
    }

    const rowData = row.data as Record<string, unknown>;

    // Look up PK value — try exact match first, then case-insensitive
    let pkValue = rowData[pkColumn];
    if (pkValue == null) {
      const lowerPk = pkColumn.toLowerCase();
      for (const [k, v] of Object.entries(rowData)) {
        if (k.toLowerCase() === lowerPk) {
          pkValue = v;
          break;
        }
      }
    }

    if (pkValue == null) {
      const availableKeys = Object.keys(rowData);
      console.error(`PK "${pkColumn}" not in row data. Available keys:`, availableKeys);
      return json(
        {
          error: `Primary key "${pkColumn}" not found in row data`,
          available_keys: availableKeys,
          hint: "Force refresh the data table to re-sync columns.",
        },
        400
      );
    }

    // ── Connect to external DB and update ───────────────────
    const dbHost = config.db_host as string;
    const dbPort = Number(config.db_port) || 5432;
    const dbName = config.db_name as string;
    const dbUser = config.db_user as string;
    const dbPassword = config.db_password as string;
    const dbSsl = config.db_ssl !== false;

    if (!dbHost || !dbName || !dbUser) {
      return json({ error: "Incomplete DB connection config" }, 400);
    }

    // Validate identifiers (table, column names) — only allow safe chars
    const safeIdentifier = /^[a-zA-Z_][a-zA-Z0-9_.]*$/;
    if (!safeIdentifier.test(obsTable) || !safeIdentifier.test(obsColumn) || !safeIdentifier.test(pkColumn)) {
      return json({ error: "Invalid identifier in config" }, 400);
    }

    let pgClient: PgClient | null = null;
    try {
      pgClient = new PgClient({
        hostname: dbHost,
        port: dbPort,
        database: dbName,
        user: dbUser,
        password: dbPassword,
        tls: { enabled: dbSsl, enforce: false },
        connection: { attempts: 1 },
      });
      await pgClient.connect();

      // Use quoted identifiers for safety + parameterized value
      const sql = `UPDATE "${obsTable}" SET "${obsColumn}" = $1 WHERE "${pkColumn}" = $2`;
      await pgClient.queryObject(sql, [observation ?? "", pkValue]);

      await pgClient.end();
      pgClient = null;

      // Also update local cache row so UI reflects change immediately
      const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const adminClient = createClient(supabaseUrl, supabaseServiceKey);
      
      // Update the observation in the local data column too
      const updatedData = { ...rowData, [obsColumn]: observation ?? "" };
      await adminClient
        .from("data_table_rows")
        .update({ data: updatedData, observations: observation })
        .eq("id", rowId);

      return json({ status: "ok" });
    } catch (dbErr: unknown) {
      if (pgClient) {
        try {
          await pgClient.end();
        } catch {
          /* ignore */
        }
      }
      const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      console.error("External DB update error:", msg);
      return json({ status: "error", error: msg }, 500);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Edge function error:", msg);
    return json({ error: "Internal server error" }, 500);
  }
});
