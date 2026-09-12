import { getSupabaseAdminClient, isSupabaseConfigured } from "./supabaseClient";
import { readLocalJson, writeLocalJson } from "./localStore";

// Writes work the same way reads do: try Supabase, and if it is not
// configured, fall back to writing straight into the matching JSON file in
// src/data, so submissions are not just logged and lost. Once Supabase is
// connected, this starts writing real rows automatically, with no change
// needed anywhere else in the app. See localStore.ts for the limits of the
// local JSON fallback.
export async function saveRecord(
  table: string,
  jsonFile: string,
  record: Record<string, unknown>
): Promise<{ saved: boolean; mode: "supabase" | "local" }> {
  if (isSupabaseConfigured()) {
    const admin = getSupabaseAdminClient();
    if (admin) {
      try {
        const { error } = await admin.from(table).insert(record);
        if (!error) return { saved: true, mode: "supabase" };
      } catch {
        // fall through to local file below
      }
    }
  }

  const existing = readLocalJson<Record<string, unknown>>(jsonFile);
  writeLocalJson(jsonFile, [...existing, record]);
  return { saved: true, mode: "local" };
}
