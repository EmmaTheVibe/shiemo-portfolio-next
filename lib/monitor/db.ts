import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// No generated schema types yet, so tables are loosely typed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let client: SupabaseClient<any, "public", any> | undefined;

export function db() {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error("SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set");
    client = createClient(url, key, { auth: { persistSession: false } });
  }
  return client;
}
