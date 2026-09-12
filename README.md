# EIC Website

The website for EIC, the Entrepreneurship & Innovation Club (Klub
Przedsiębiorczości i Innowacji) at WSEI University. Built with Next.js,
TypeScript and Tailwind CSS.

## How the data works right now

There is no live database connected yet. Every page reads from the JSON
files in `src/data`, which stand in for the real tables described in
`supabase/schema.sql`. The shape of the JSON matches those tables column
for column, so when the club is ready to connect Supabase, nothing in the
pages or components needs to change.

The rule, used everywhere in `src/lib/dataSource.ts`, is simple:

1. If `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are not
   set, read straight from the JSON files.
2. If they are set, try Supabase first. If the query fails, or the table is
   empty, fall back to the JSON files instead of showing an empty page.

Membership applications and contact messages work the same way in reverse.
If `SUPABASE_SERVICE_ROLE_KEY` is set, submissions are saved as real rows.
If not, they are logged on the server so nothing is lost silently, but
nothing is written anywhere permanent yet.

## Login

The login flow is real and working, but until Supabase Auth is connected it
checks against a small demo account stored in
`src/data/demo-credentials.json`, with the password saved as a bcrypt hash
rather than plain text.

Demo login:
```
Email:    demo@eic.wsei.edu.pl
Password: EICDemo123!
```

To add or change a demo account, generate a new hash with:
```
npm run hash-demo-password -- "yourNewPassword"
```
and paste the result into `password_hash` in `demo-credentials.json`.

Once `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set,
the login form automatically tries real Supabase Auth first and only falls
back to the demo account if Supabase is unreachable, so this can be left in
place safely during the transition.

## Moving to Supabase later

1. Create a Supabase project.
2. In the SQL editor, run `supabase/schema.sql`, then
   `supabase/storage_buckets.sql`.
3. Copy `.env.example` to `.env.local` and fill in the three Supabase
   values from Project Settings, API.
4. Create real member accounts through Supabase Auth (or the sign up flow,
   once one is added), and set `is_admin` to true on the `profiles` row for
   anyone who should manage content.
5. Redeploy. The site will start reading and writing real data
   automatically. The JSON files and the demo account stay in place as a
   safety net and do not need to be deleted.

## Running locally

```
npm install
npm run dev
```

The site runs at http://localhost:3000 with no environment variables
required.

## Project structure

```
src/
  app/                Pages and API routes (Next.js App Router)
  components/          Reusable UI pieces
  data/                 JSON files standing in for the database
  lib/                    Data access, auth, and Supabase client helpers
supabase/
  schema.sql              Table definitions, matching src/data
  storage_buckets.sql   Storage buckets for images and avatars
```

## Pages

Home, About, Programs, Events, Announcements, Team, Partners, Join,
Contact, Login, and a member Dashboard (protected, requires login).

## Design

The visual identity uses a deep ink navy, an amber accent for calls to
action, and a green accent for growth related content, with Space Grotesk
for headings and Inter for body text. The stepped path used in the hero and
on the Programs page reflects the club's own eight stage journey from
Discover to Launch. The logo in `public/logo.svg` and
`src/components/Logo.tsx` is a placeholder built around the same idea, and
is meant to be replaced with a designed logo later, in both places.
