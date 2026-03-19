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
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // User-scoped client (respects RLS)
    const userClient = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    // Service-role client (bypasses RLS for writing cache)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Verify user
    const { data: { user: authUser }, error: userError } =
      await userClient.auth.getUser();
    if (userError || !authUser) {
      return json({ error: "Unauthorized" }, 401);
    }

    // ── Request body ────────────────────────────────────────
    const body = await req.json();
    const companyServiceId: string = body.company_service_id;
    const forceRefresh: boolean = body.force === true;

    if (!companyServiceId) {
      return json({ error: "company_service_id required" }, 400);
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
    if (config?.source !== "external_db") {
      return json({ error: "Service is not configured for external DB" }, 400);
    }

    const dbHost = config.db_host as string;
    const dbPort = Number(config.db_port) || 5432;
    const dbName = config.db_name as string;
    const dbUser = config.db_user as string;
    const dbPassword = config.db_password as string;
    const dbQuery = config.db_query as string;
    const dbSsl = config.db_ssl !== false;
    const cacheTtlMinutes = Number(config.cache_ttl_minutes) || 15;
    const rowLimit = Number(config.row_limit) || 5000;

    if (!dbHost || !dbName || !dbUser || !dbQuery) {
      return json(
        { error: "Incomplete DB config (db_host, db_name, db_user, db_query)" },
        400
      );
    }

    // ── Check cache ─────────────────────────────────────────
    const { data: cache } = await userClient
      .from("data_table_cache")
      .select("cached_at, row_count, error, refreshing")
      .eq("company_service_id", companyServiceId)
      .maybeSingle();

    const now = Date.now();
    const cachedAt = cache?.cached_at
      ? new Date(cache.cached_at).getTime()
      : 0;
    const cacheAge = now - cachedAt;
    const ttlMs = cacheTtlMinutes * 60 * 1000;
    const isStale = cacheAge >= ttlMs;

    // If cache is fresh and not forced, return early
    if (!isStale && !forceRefresh) {
      return json({
        status: "cached",
        cached_at: cache!.cached_at,
        row_count: cache!.row_count,
        cache_ttl_minutes: cacheTtlMinutes,
      });
    }

    // If someone else is already refreshing, don't pile on
    if (cache?.refreshing && !forceRefresh) {
      return json({
        status: "refreshing",
        cached_at: cache.cached_at,
        row_count: cache.row_count,
      });
    }

    // ── Mark as refreshing ──────────────────────────────────
    await adminClient.from("data_table_cache").upsert({
      company_service_id: companyServiceId,
      refreshing: true,
      cached_at: cache?.cached_at ?? new Date(0).toISOString(),
      row_count: cache?.row_count ?? 0,
    });

    // ── Connect to client PostgreSQL ────────────────────────
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

      // Run the configured query wrapped with LIMIT for safety
      const safeSql = `SELECT * FROM (${dbQuery}) AS _q LIMIT ${rowLimit}`;
      const result = await pgClient.queryObject(safeSql);
      const rows = result.rows as Record<string, unknown>[];

      await pgClient.end();
      pgClient = null;

      // ── Sync to data_table_rows ────────────────────────────
      // Get column definitions from config
      const columns = (config.columns as { key: string }[]) ?? [];
      const colKeys = columns.map((c) => c.key);
      const obsColumn = config.observations_column as string | undefined;
      const obsFromExternalDb = config.observations_target === "external_db" && obsColumn;
      const pkColumn = config.primary_key as string | undefined;

      // Build insert payloads — only extract configured columns
      const insertRows = rows.map((row) => {
        const data: Record<string, unknown> = {};
        for (const key of colKeys) {
          data[key] = row[key] ?? null;
        }
        // Always include primary key in data even if not in visible columns
        if (pkColumn && !(pkColumn in data)) {
          data[pkColumn] = row[pkColumn] ?? null;
        }
        // If observations come from external DB, also include that column in data
        if (obsFromExternalDb) {
          data[obsColumn] = row[obsColumn] ?? null;
        }
        return {
          company_service_id: companyServiceId,
          data,
          // Extract observations from external DB column into dedicated field
          observations: obsFromExternalDb
            ? (row[obsColumn] != null ? String(row[obsColumn]) : null)
            : null,
        };
      });

      // ── Preserve observations during sync ──────────────────────────
      // For external_db mode: try to read from query results, but also
      // keep existing observations from local cache as fallback (in case
      // the user's SQL query doesn't include the observations column).
      // For local mode: preserve observations matched by data content.

      // Always fetch existing observations keyed by PK value (for external_db)
      // or by data JSON (for local mode)
      const obsMapByPk = new Map<string, string>();
      const obsMapByData = new Map<string, string>();

      const { data: oldRowsWithNotes } = await adminClient
        .from("data_table_rows")
        .select("data, observations")
        .eq("company_service_id", companyServiceId)
        .not("observations", "is", null)
        .neq("observations", "");

      if (oldRowsWithNotes?.length) {
        for (const r of oldRowsWithNotes) {
          if (r.observations) {
            // Key by PK value (for external_db mode)
            if (pkColumn) {
              const rd = r.data as Record<string, unknown>;
              const pk = rd[pkColumn];
              if (pk != null) obsMapByPk.set(String(pk), r.observations);
            }
            // Key by full data JSON (for local mode)
            obsMapByData.set(JSON.stringify(r.data), r.observations);
          }
        }
      }

      // Atomic-ish swap: insert new, then delete old
      // 1. Insert new rows
      const batchSize = 500;
      const insertedAt = new Date().toISOString();

      for (let i = 0; i < insertRows.length; i += batchSize) {
        const batch = insertRows.slice(i, i + batchSize);
        const { error: insertErr } = await adminClient
          .from("data_table_rows")
          .insert(batch);
        if (insertErr) {
          throw new Error(`Insert batch error: ${insertErr.message}`);
        }
      }

      // 2. Delete old rows (created before this refresh cycle)
      await adminClient
        .from("data_table_rows")
        .delete()
        .eq("company_service_id", companyServiceId)
        .lt("created_at", insertedAt);

      // 3. Restore observations on matching new rows
      if (obsMapByPk.size > 0 || obsMapByData.size > 0) {
        const { data: newRows } = await adminClient
          .from("data_table_rows")
          .select("id, data, observations")
          .eq("company_service_id", companyServiceId)
          .gte("created_at", insertedAt);

        if (newRows?.length) {
          for (const nr of newRows) {
            // If observations already came from external DB query, skip
            if (nr.observations) continue;

            let obs: string | undefined;
            // Try PK-based match first (more reliable for external_db)
            if (pkColumn) {
              const rd = nr.data as Record<string, unknown>;
              const pk = rd[pkColumn];
              if (pk != null) obs = obsMapByPk.get(String(pk));
            }
            // Fallback: data JSON match (for local mode)
            if (!obs) {
              obs = obsMapByData.get(JSON.stringify(nr.data));
            }

            if (obs) {
              await adminClient
                .from("data_table_rows")
                .update({ observations: obs })
                .eq("id", nr.id);
            }
          }
        }
      }

      // ── Update cache metadata ──────────────────────────────
      await adminClient.from("data_table_cache").upsert({
        company_service_id: companyServiceId,
        cached_at: insertedAt,
        row_count: insertRows.length,
        error: null,
        refreshing: false,
      });

      return json({
        status: "refreshed",
        cached_at: insertedAt,
        row_count: insertRows.length,
        cache_ttl_minutes: cacheTtlMinutes,
      });
    } catch (dbErr: unknown) {
      if (pgClient) {
        try { await pgClient.end(); } catch { /* ignore */ }
      }

      const msg = dbErr instanceof Error ? dbErr.message : String(dbErr);
      console.error("Client DB error:", msg);

      // Record error but don't clear existing cached data
      await adminClient.from("data_table_cache").upsert({
        company_service_id: companyServiceId,
        cached_at: cache?.cached_at ?? new Date(0).toISOString(),
        row_count: cache?.row_count ?? 0,
        error: msg,
        refreshing: false,
      });

      return json({ status: "error", error: msg }, 500);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Edge function error:", msg);
    return json({ error: "Internal server error" }, 500);
  }
});
