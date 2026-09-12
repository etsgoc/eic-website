import { getSupabaseAdminClient, isSupabaseConfigured } from "./supabaseClient";
import { readLocalJson, writeLocalJson } from "./localStore";
import type { EventRegistration, SessionUser } from "./types";

const FILE = "event-registrations.json";
const TABLE = "event_registrations";

// These reads and writes always go through the Supabase service role
// client, never the anon client. That is safe here because the API routes
// that call these functions already check the caller's own session cookie
// before doing anything, so the authorization check has happened by the
// time we get here. Falling back to the local JSON file keeps this working
// before Supabase is connected at all.

export async function listAllRegistrations(): Promise<EventRegistration[]> {
  const admin = getSupabaseAdminClient();
  if (admin) {
    try {
      const { data, error } = await admin.from(TABLE).select("*");
      if (!error && data) return data as EventRegistration[];
    } catch {
      // fall through to local file
    }
  }
  return readLocalJson<EventRegistration>(FILE);
}

export async function getRegistrationCounts(): Promise<Record<string, number>> {
  const all = await listAllRegistrations();
  const counts: Record<string, number> = {};
  for (const registration of all) {
    counts[registration.event_id] = (counts[registration.event_id] ?? 0) + 1;
  }
  return counts;
}

export async function getRegisteredEventIdsForMember(
  memberId: string
): Promise<string[]> {
  const all = await listAllRegistrations();
  return all
    .filter((registration) => registration.member_id === memberId)
    .map((registration) => registration.event_id);
}

export async function registerForEvent(
  eventId: string,
  user: SessionUser,
  capacity: number | null
): Promise<{ ok: boolean; error?: string }> {
  const all = await listAllRegistrations();
  const alreadyRegistered = all.some(
    (registration) =>
      registration.event_id === eventId && registration.member_id === user.id
  );
  if (alreadyRegistered) return { ok: true };

  const currentCount = all.filter((r) => r.event_id === eventId).length;
  if (capacity !== null && currentCount >= capacity) {
    return { ok: false, error: "This event is full." };
  }

  const record: EventRegistration = {
    id: crypto.randomUUID(),
    event_id: eventId,
    member_id: user.id,
    full_name: user.full_name,
    email: user.email,
    created_at: new Date().toISOString()
  };

  if (isSupabaseConfigured()) {
    const admin = getSupabaseAdminClient();
    if (admin) {
      try {
        const { error } = await admin.from(TABLE).insert(record);
        if (!error) return { ok: true };
      } catch {
        // fall through to local file
      }
    }
  }

  writeLocalJson(FILE, [...all, record]);
  return { ok: true };
}

export async function unregisterFromEvent(
  eventId: string,
  memberId: string
): Promise<{ ok: boolean }> {
  if (isSupabaseConfigured()) {
    const admin = getSupabaseAdminClient();
    if (admin) {
      try {
        const { error } = await admin
          .from(TABLE)
          .delete()
          .eq("event_id", eventId)
          .eq("member_id", memberId);
        if (!error) return { ok: true };
      } catch {
        // fall through to local file
      }
    }
  }

  const all = await listAllRegistrations();
  const filtered = all.filter(
    (registration) =>
      !(registration.event_id === eventId && registration.member_id === memberId)
  );
  writeLocalJson(FILE, filtered);
  return { ok: true };
}
