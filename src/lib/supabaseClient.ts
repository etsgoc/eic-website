import { createClient, SupabaseClient } from "@supabase/supabase-js";

// This project is set up so the UI never talks to Supabase directly. Every
// read goes through the helpers in dataSource.ts, which try Supabase first
// and fall back to the JSON files in src/data when no project is configured
// or when a query does not return anything. That means going live later is
// a matter of setting the two environment variables below, nothing more.

let cachedClient: SupabaseClient | null | undefined;

export function getSupabaseClient(): SupabaseClient | null {
  if (cachedClient !== undefined) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    cachedClient = null;
    return cachedClient;
  }

  cachedClient = createClient(url, anonKey, {
    auth: { persistSession: false }
  });
  return cachedClient;
}

// A second client using the service role key, used only from server side API
// routes that need to write data (membership applications, contact
// messages). Never import this from a client component.
export function getSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) return null;

  return createClient(url, serviceKey, {
    auth: { persistSession: false }
  });
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseClient() !== null;
}
