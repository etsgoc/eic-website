import { getSupabaseAdminClient, isSupabaseConfigured } from "./supabaseClient";
import { readLocalJson, writeLocalJson } from "./localStore";
import type { SessionUser, VenturePost } from "./types";

const FILE = "ventures.json";
const TABLE = "ventures";

export async function listVentures(): Promise<VenturePost[]> {
  const admin = getSupabaseAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin
        .from(TABLE)
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as VenturePost[];
    } catch {
      // fall through to local file
    }
  }
  const local = readLocalJson<VenturePost>(FILE);
  return [...local].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function createVenture(
  user: SessionUser,
  input: { title: string; one_liner: string; stage: string; looking_for: string }
): Promise<VenturePost> {
  const record: VenturePost = {
    id: crypto.randomUUID(),
    member_id: user.id,
    member_name: user.full_name,
    contact_email: user.email,
    title: input.title,
    one_liner: input.one_liner,
    stage: input.stage,
    looking_for: input.looking_for,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const admin = getSupabaseAdminClient();
    if (admin) {
      try {
        const { error } = await admin.from(TABLE).insert(record);
        if (!error) return record;
      } catch {
        // fall through to local file
      }
    }
  }

  const local = readLocalJson<VenturePost>(FILE);
  writeLocalJson(FILE, [...local, record]);
  return record;
}

export async function deleteVenture(
  id: string,
  memberId: string,
  isAdmin: boolean
): Promise<{ ok: boolean; error?: string }> {
  const all = await listVentures();
  const target = all.find((venture) => venture.id === id);
  if (!target) return { ok: false, error: "Not found." };
  if (target.member_id !== memberId && !isAdmin) {
    return { ok: false, error: "You can only remove your own venture post." };
  }

  if (isSupabaseConfigured()) {
    const admin = getSupabaseAdminClient();
    if (admin) {
      try {
        const { error } = await admin.from(TABLE).delete().eq("id", id);
        if (!error) return { ok: true };
      } catch {
        // fall through to local file
      }
    }
  }

  const local = readLocalJson<VenturePost>(FILE);
  writeLocalJson(
    FILE,
    local.filter((venture) => venture.id !== id)
  );
  return { ok: true };
}
