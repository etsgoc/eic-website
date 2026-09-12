import Link from "next/link";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { getEvents } from "@/lib/dataSource";
import { getRegisteredEventIdsForMember } from "@/lib/eventRegistrations";
import { listVentures } from "@/lib/ventures";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const user = token ? await verifySessionToken(token) : null;

  const [allEvents, registeredEventIds, allVentures] = await Promise.all([
    getEvents(),
    user ? getRegisteredEventIdsForMember(user.id) : Promise.resolve([]),
    listVentures()
  ]);

  const myEvents = allEvents.filter((event) => registeredEventIds.includes(event.id));
  const myVentures = allVentures.filter((venture) => venture.member_id === user?.id);

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

      <div className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            Your registered events
          </h2>
          <Link href="/events" className="text-sm font-medium text-ink-800 hover:text-ink-600">
            Browse all events
          </Link>
        </div>

        {myEvents.length > 0 ? (
          <ul className="mt-4 flex flex-col divide-y divide-ink-100 border-t border-ink-100">
            {myEvents.map((event) => (
              <li key={event.id} className="py-4">
                <p className="text-[15px] font-medium text-ink-900">{event.title}</p>
                <p className="mt-1 text-sm text-ink-500">
                  {new Date(event.start_time).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}{" "}
                  &middot; {event.location}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 border border-dashed border-ink-200 p-6 text-[15px] text-ink-500">
            You have not registered for any events yet.
          </p>
        )}
      </div>

      <div className="mt-14">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-display text-xl font-semibold text-ink-900">
            Your venture posts
          </h2>
          <Link href="/ventures" className="text-sm font-medium text-ink-800 hover:text-ink-600">
            Go to the ventures board
          </Link>
        </div>

        {myVentures.length > 0 ? (
          <ul className="mt-4 flex flex-col divide-y divide-ink-100 border-t border-ink-100">
            {myVentures.map((venture) => (
              <li key={venture.id} className="py-4">
                <p className="text-[15px] font-medium text-ink-900">{venture.title}</p>
                <p className="mt-1 text-sm text-ink-500">{venture.looking_for}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 border border-dashed border-ink-200 p-6 text-[15px] text-ink-500">
            You have not posted a venture yet. Post one to find a cofounder
            or teammates from inside the club.
          </p>
        )}
      </div>
    </div>
  );
}
