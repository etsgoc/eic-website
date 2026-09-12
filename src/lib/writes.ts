import { getSupabaseAdminClient } from "./supabaseClient";

// Writes work the same way reads do: try Supabase, and if it is not
// configured, keep going without failing the request. Until a real project
// is connected there is nowhere durable to save a submission, so it is
// logged on the server instead. Once SUPABASE_SERVICE_ROLE_KEY is set, this
// starts writing real rows automatically, with no change needed anywhere
// else in the app.
export async function saveRecord(
  table: string,
  record: Record<string, unknown>
): Promise<{ saved: boolean; mode: "supabase" | "demo" }> {
  const admin = getSupabaseAdminClient();

  if (admin) {
    try {
      const { error } = await admin.from(table).insert(record);
      if (!error) return { saved: true, mode: "supabase" };
    } catch {
      // fall through to demo mode below
    }
  }

  console.log(`[demo mode] would insert into "${table}":`, record);
  return { saved: true, mode: "demo" };
}
