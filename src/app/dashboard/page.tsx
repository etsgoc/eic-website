import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const user = token ? await verifySessionToken(token) : null;

  return (
    <div className="container-content py-16 md:py-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-ink-500">Member area</p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink-900">
            Welcome{user ? `, ${user.full_name}` : ""}
          </h1>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="border border-ink-100 bg-white p-6">
          <p className="text-sm font-medium text-ink-900">Your role</p>
          <p className="mt-2 text-[15px] text-ink-500">{user?.role_title}</p>
        </div>
        <div className="border border-ink-100 bg-white p-6">
          <p className="text-sm font-medium text-ink-900">Account email</p>
          <p className="mt-2 text-[15px] text-ink-500">{user?.email}</p>
        </div>
      </div>

      <div className="mt-6 border border-dashed border-ink-200 p-8">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          This member area is a placeholder
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-500">
          Once EIC is running and Supabase is connected, this is where
          members will see their venture updates, event registrations, and
          the internal cofounder and jobs board described in the club's
          documentation.
        </p>
      </div>
    </div>
  );
}
