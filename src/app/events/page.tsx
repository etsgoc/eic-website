import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { getEvents } from "@/lib/dataSource";
import {
  getRegisteredEventIdsForMember,
  getRegistrationCounts
} from "@/lib/eventRegistrations";
import EventsList from "@/components/EventsList";

export default async function EventsPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const currentUser = token ? await verifySessionToken(token) : null;

  const [events, counts, registeredIds] = await Promise.all([
    getEvents(),
    getRegistrationCounts(),
    currentUser ? getRegisteredEventIdsForMember(currentUser.id) : Promise.resolve([])
  ]);

  return (
    <div className="container-content py-16 md:py-20">
      <p className="text-sm font-medium text-ink-500">Events</p>
      <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink-900 md:text-4xl">
        Workshops, talks and pitch sessions
      </h1>
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500">
        Every EIC event is open to all WSEI students. Log in to register and
        keep track of what you are going to.
      </p>

      <div className="mt-12">
        {events.length > 0 ? (
          <EventsList
            events={events}
            initialCounts={counts}
            initialRegisteredIds={registeredIds}
            currentUser={currentUser}
          />
        ) : (
          <p className="border border-dashed border-ink-200 p-8 text-[15px] text-ink-500">
            No events are scheduled right now. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
