-- Storage buckets for EIC. Run this after schema.sql, in the Supabase SQL
-- editor. Buckets can also be created by hand in the Storage tab, but doing
-- it here keeps everything the club needs in one place under source control.

insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('event-covers', 'event-covers', true),
  ('announcement-covers', 'announcement-covers', true),
  ('partner-logos', 'partner-logos', true),
  ('site-assets', 'site-assets', true)
on conflict (id) do nothing;

-- All five buckets are public for reading, since logos, avatars and cover
-- images are shown on public pages. Only signed in members may upload, and
-- only admins may remove files.

create policy "Public can view files in public buckets"
  on storage.objects for select
  using (bucket_id in (
    'avatars', 'event-covers', 'announcement-covers', 'partner-logos', 'site-assets'
  ));

create policy "Signed in members can upload their own avatar"
  on storage.objects for insert
  with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
  );

create policy "Admins manage event, announcement, partner and site images"
  on storage.objects for all
  using (
    bucket_id in ('event-covers', 'announcement-covers', 'partner-logos', 'site-assets')
    and exists (
      select 1 from public.profiles where id = auth.uid() and is_admin = true
    )
  );
