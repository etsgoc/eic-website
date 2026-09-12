// These types mirror the tables defined in supabase/schema.sql. Keeping the
// two in sync means the JSON fallback data and a real Supabase table can be
// swapped for each other without touching any component.

export interface SiteConfig {
  club_name_en: string;
  club_name_pl: string;
  short_name: string;
  tagline: string;
  mission: string;
  founding_status: string;
  location: string;
  contact_email: string;
  social_instagram: string;
  social_linkedin: string;
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  is_pinned: boolean;
  published_at: string;
  cover_image_url: string | null;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  start_time: string;
  end_time: string | null;
  cover_image_url: string | null;
  registration_url: string | null;
  capacity: number | null;
  is_featured: boolean;
}

export interface TeamPosition {
  id: string;
  title: string;
  category: "founder" | "leadership" | "team_lead" | "patron";
  description: string;
  member_name: string | null;
  member_bio: string | null;
  member_avatar_url: string | null;
  display_order: number;
  is_filled: boolean;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  partnership_level: "founding" | "strategic" | "community" | "upcoming";
  description: string;
}

export interface ProgramStage {
  id: string;
  title: string;
  stage_order: number;
  description: string;
  icon: string;
}

export interface MembershipApplication {
  full_name: string;
  email: string;
  album_number: string;
  field_of_study: string;
  year_of_study: string;
  interest_area: string;
  motivation: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface SessionUser {
  id: string;
  full_name: string;
  email: string;
  role_title: string;
  is_admin: boolean;
}
