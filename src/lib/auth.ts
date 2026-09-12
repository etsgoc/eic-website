import bcrypt from "bcryptjs";
import { getSupabaseClient } from "./supabaseClient";
import type { SessionUser } from "./types";
import demoCredentials from "@/data/demo-credentials.json";

export { SESSION_COOKIE, createSessionToken, verifySessionToken } from "./session";

interface DemoCredential {
  id: string;
  email: string;
  full_name: string;
  role_title: string;
  is_admin: boolean;
  password_hash: string;
}

// Demo mode note: until the club's Supabase project is connected, this
// checks the email and password against src/data/demo-credentials.json,
// where the password is stored as a bcrypt hash rather than plain text.
// See README.md for the demo login and for how to add more demo accounts
// with `npm run hash-demo-password`. Once Supabase is configured, this
// function tries real Supabase Auth first and only falls back to the demo
// file if Supabase is not reachable, so nothing needs to change in the UI.
//
// This file uses bcryptjs, which needs the Node.js runtime, so it is only
// ever imported from API routes and server components, never from
// middleware.ts. Session token creation and verification, which do need to
// run in middleware, live in session.ts instead.
export async function verifyLogin(
  email: string,
  password: string
): Promise<SessionUser | null> {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (!error && data.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", data.user.id)
          .single();
        return {
          id: data.user.id,
          full_name: profile?.full_name ?? data.user.email ?? "Member",
          email: data.user.email ?? email,
          role_title: profile?.role_title ?? "Member",
          is_admin: profile?.is_admin ?? false
        };
      }
    } catch {
      // fall through to demo credentials below
    }
  }

  const demoUsers = demoCredentials as DemoCredential[];
  const match = demoUsers.find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );
  if (!match) return null;

  const isValid = await bcrypt.compare(password, match.password_hash);
  if (!isValid) return null;

  return {
    id: match.id,
    full_name: match.full_name,
    email: match.email,
    role_title: match.role_title,
    is_admin: match.is_admin
  };
}
