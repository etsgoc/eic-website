-- EIC (Entrepreneurship & Innovation Club) database schema for Supabase.
--
-- This file is not run automatically. It is here so that when the club is
-- ready to move off the placeholder JSON files in src/data, running this
-- script in the Supabase SQL editor creates tables with the same shape as
-- that JSON, column for column. Once NEXT_PUBLIC_SUPABASE_URL and
-- NEXT_PUBLIC_SUPABASE_ANON_KEY are set, the website starts reading from
-- these tables automatically, with the JSON files kept only as a fallback.
--
-- Run this whole file once, top to bottom, in a fresh Supabase project.

-- A note on event_registrations and ventures specifically: the website's
-- own API routes write to these two tables using the Supabase service role
-- key, after checking the member's own login session themselves, so those
-- writes bypass the policies below entirely. The policies still matter if
-- anything else, now or later, talks to these tables using a normal user
-- key instead.

create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------------------
-- profiles: one row per member, linked to Supabase Auth's own user table.
-- A row here is created automatically whenever someone signs up, by the
-- trigger defined near the bottom of this file.
-- ---------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  album_number text,
  field_of_study text,
  role_title text not null default 'Member',
  bio text,
  avatar_url text,
  is_admin boolean not null default false,
  joined_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by anyone signed in"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Members can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ---------------------------------------------------------------------
-- site_config: a single row of general club information, shown across
-- the site (name, tagline, mission, contact details).
-- ---------------------------------------------------------------------
create table if not exists public.site_config (
  id int primary key default 1,
  club_name_en text not null,
  club_name_pl text not null,
  short_name text not null,
  tagline text not null,
  mission text not null,
  founding_status text not null,
  location text not null,
  contact_email text not null,
  social_instagram text,
  social_linkedin text,
  constraint site_config_single_row check (id = 1)
);

alter table public.site_config enable row level security;

create policy "Site config is public"
  on public.site_config for select
  using (true);

-- ---------------------------------------------------------------------
-- announcements
-- ---------------------------------------------------------------------
create table if not exists public.announcements (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  body text not null,
  is_pinned boolean not null default false,
  published_at timestamptz not null default now(),
  cover_image_url text
);

alter table public.announcements enable row level security;

create policy "Announcements are public"
  on public.announcements for select
  using (true);

create policy "Admins manage announcements"
  on public.announcements for all
  using (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

-- ---------------------------------------------------------------------
-- events and event_registrations
-- ---------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  location text not null,
  start_time timestamptz not null,
  end_time timestamptz,
  cover_image_url text,
  registration_url text,
  capacity int,
  is_featured boolean not null default false
);

alter table public.events enable row level security;

create policy "Events are public"
  on public.events for select
  using (true);

create policy "Admins manage events"
  on public.events for all
  using (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

create table if not exists public.event_registrations (
  id uuid primary key default uuid_generate_v4(),
  event_id uuid not null references public.events (id) on delete cascade,
  member_id uuid references public.profiles (id) on delete set null,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.event_registrations enable row level security;

create policy "Members can register themselves for events"
  on public.event_registrations for insert
  with check (true);

create policy "Admins view event registrations"
  on public.event_registrations for select
  using (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

-- ---------------------------------------------------------------------
-- team_positions: every role in the club, filled or open, matching the
-- EIC Roles and Responsibilities document.
-- ---------------------------------------------------------------------
create table if not exists public.team_positions (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  category text not null check (category in ('founder', 'patron', 'leadership', 'team_lead')),
  description text not null,
  member_name text,
  member_bio text,
  member_avatar_url text,
  display_order int not null default 0,
  is_filled boolean not null default false
);

alter table public.team_positions enable row level security;

create policy "Team positions are public"
  on public.team_positions for select
  using (true);

create policy "Admins manage team positions"
  on public.team_positions for all
  using (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

-- ---------------------------------------------------------------------
-- partners
-- ---------------------------------------------------------------------
create table if not exists public.partners (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  logo_url text,
  website_url text,
  partnership_level text not null check (
    partnership_level in ('founding', 'strategic', 'community', 'upcoming')
  ),
  description text not null
);

alter table public.partners enable row level security;

create policy "Partners are public"
  on public.partners for select
  using (true);

create policy "Admins manage partners"
  on public.partners for all
  using (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

-- ---------------------------------------------------------------------
-- programs: the eight stage discover to launch journey
-- ---------------------------------------------------------------------
create table if not exists public.programs (
  id text primary key,
  title text not null,
  stage_order int not null,
  description text not null,
  icon text
);

alter table public.programs enable row level security;

create policy "Programs are public"
  on public.programs for select
  using (true);

create policy "Admins manage programs"
  on public.programs for all
  using (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

-- ---------------------------------------------------------------------
-- ventures: the member facing venture and cofounder board, where members
-- post what they are building and what kind of teammate they are looking
-- for. This is the practical, working version of the club's own Team
-- stage.
-- ---------------------------------------------------------------------
create table if not exists public.ventures (
  id uuid primary key default uuid_generate_v4(),
  member_id uuid not null references public.profiles (id) on delete cascade,
  member_name text not null,
  contact_email text not null,
  title text not null,
  one_liner text not null,
  stage text not null default 'idea',
  looking_for text not null,
  created_at timestamptz not null default now()
);

alter table public.ventures enable row level security;

create policy "Ventures are public"
  on public.ventures for select
  using (true);

create policy "Members can post their own venture"
  on public.ventures for insert
  with check (auth.uid() = member_id);

create policy "Members can remove their own venture, admins can remove any"
  on public.ventures for delete
  using (
    auth.uid() = member_id
    or exists (
      select 1 from public.profiles where id = auth.uid() and is_admin = true
    )
  );

-- ---------------------------------------------------------------------
-- membership_applications: submissions from the Join page
-- ---------------------------------------------------------------------
create table if not exists public.membership_applications (
  id uuid primary key default uuid_generate_v4(),
  full_name text not null,
  email text not null,
  album_number text,
  field_of_study text,
  year_of_study text,
  interest_area text,
  motivation text not null,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz not null default now()
);

alter table public.membership_applications enable row level security;

create policy "Anyone can submit a membership application"
  on public.membership_applications for insert
  with check (true);

create policy "Admins view membership applications"
  on public.membership_applications for select
  using (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

-- ---------------------------------------------------------------------
-- contact_messages: submissions from the Contact page
-- ---------------------------------------------------------------------
create table if not exists public.contact_messages (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.contact_messages enable row level security;

create policy "Anyone can send a contact message"
  on public.contact_messages for insert
  with check (true);

create policy "Admins view contact messages"
  on public.contact_messages for select
  using (exists (
    select 1 from public.profiles where id = auth.uid() and is_admin = true
  ));

-- ---------------------------------------------------------------------
-- Automatically create a profile row whenever someone signs up through
-- Supabase Auth, so every authenticated member has a matching profile.
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ---------------------------------------------------------------------
-- Seed data, matching src/data so the live site looks the same the moment
-- it switches over from the JSON fallback. Safe to edit or remove.
-- ---------------------------------------------------------------------
insert into public.site_config (
  id, club_name_en, club_name_pl, short_name, tagline, mission,
  founding_status, location, contact_email, social_instagram, social_linkedin
) values (
  1,
  'Entrepreneurship & Innovation Club',
  'Klub Przedsiębiorczości i Innowacji',
  'EIC',
  'From idea to company.',
  'EIC helps WSEI students take an idea, build it into something real, and connect with the mentors, founders and investors who can help it grow.',
  'Founding proposal submitted to the WSEI Dean''s office',
  'WSEI University, Warsaw',
  'eic@wsei.edu.pl',
  'https://instagram.com/eic.wsei',
  'https://linkedin.com/company/eic-wsei'
)
on conflict (id) do nothing;

insert into public.programs (id, title, stage_order, description, icon) values
  ('discover', 'Discover', 1, 'Talks, founder stories and industry visits that help you find a problem worth solving.', 'compass'),
  ('idea', 'Idea', 2, 'Shape a real problem, a real customer and a first possible solution.', 'bulb'),
  ('team', 'Team', 3, 'Find a cofounder, developer, designer or teammate from inside the club.', 'people'),
  ('validate', 'Validate', 4, 'Test the idea against real customers, competitors and pricing before you build.', 'check'),
  ('build', 'Build', 5, 'Put together a first working version or prototype with support from mentors.', 'hammer'),
  ('business', 'Business', 6, 'Work out the model, the legal structure, the finances and how you will sell.', 'briefcase'),
  ('fund', 'Fund', 7, 'Get warm introductions to competitions, grants, angels and funds through EIC.', 'coin'),
  ('launch', 'Launch', 8, 'Register the company, win the first customers and start hiring.', 'rocket')
on conflict (id) do nothing;
