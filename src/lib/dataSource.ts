import { getSupabaseClient } from "./supabaseClient";
import type {
  Announcement,
  EventItem,
  Partner,
  ProgramStage,
  SiteConfig,
  TeamPosition
} from "./types";

import announcementsJson from "@/data/announcements.json";
import eventsJson from "@/data/events.json";
import partnersJson from "@/data/partners.json";
import programsJson from "@/data/programs.json";
import siteConfigJson from "@/data/site-config.json";
import teamJson from "@/data/team.json";

// Every getter below follows the same rule: try Supabase if it is
// configured, and if that call fails, errors, or simply comes back empty,
// quietly fall back to the bundled JSON file so the site still has real
// looking content. This means the UI components never need to know whether
// they are reading from a live database or from the placeholder data.

async function fromSupabaseOrJson<T>(
  table: string,
  orderColumn: string | null,
  jsonFallback: T[]
): Promise<T[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return jsonFallback;

  try {
    let query = supabase.from(table).select("*");
    if (orderColumn) query = query.order(orderColumn, { ascending: true });
    const { data, error } = await query;
    if (error || !data || data.length === 0) return jsonFallback;
    return data as T[];
  } catch {
    return jsonFallback;
  }
}

export async function getSiteConfig(): Promise<SiteConfig> {
  const supabase = getSupabaseClient();
  if (!supabase) return siteConfigJson as SiteConfig;

  try {
    const { data, error } = await supabase
      .from("site_config")
      .select("*")
      .limit(1)
      .single();
    if (error || !data) return siteConfigJson as SiteConfig;
    return data as SiteConfig;
  } catch {
    return siteConfigJson as SiteConfig;
  }
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const items = await fromSupabaseOrJson<Announcement>(
    "announcements",
    "published_at",
    announcementsJson as Announcement[]
  );
  return [...items].sort((a, b) => {
    if (a.is_pinned !== b.is_pinned) return a.is_pinned ? -1 : 1;
    return new Date(b.published_at).getTime() - new Date(a.published_at).getTime();
  });
}

export async function getEvents(): Promise<EventItem[]> {
  const items = await fromSupabaseOrJson<EventItem>(
    "events",
    "start_time",
    eventsJson as EventItem[]
  );
  return [...items].sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
  );
}

export async function getUpcomingEvents(): Promise<EventItem[]> {
  const items = await getEvents();
  const now = Date.now();
  return items.filter((event) => new Date(event.start_time).getTime() >= now);
}

export async function getTeamPositions(): Promise<TeamPosition[]> {
  return fromSupabaseOrJson<TeamPosition>(
    "team_positions",
    "display_order",
    teamJson as TeamPosition[]
  );
}

export async function getPartners(): Promise<Partner[]> {
  return fromSupabaseOrJson<Partner>(
    "partners",
    "name",
    partnersJson as Partner[]
  );
}

export async function getPrograms(): Promise<ProgramStage[]> {
  return fromSupabaseOrJson<ProgramStage>(
    "programs",
    "stage_order",
    programsJson as ProgramStage[]
  );
}
