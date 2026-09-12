import EventRow from "@/components/EventRow";
import { getEvents } from "@/lib/dataSource";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <div className="container-content py-16 md:py-20">
      <p className="text-sm font-medium text-ink-500">Events</p>
      <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink-900 md:text-4xl">
        Workshops, talks and pitch sessions
      </h1>
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500">
        Every EIC event is open to all WSEI students. Dates, rooms and
        registration links will fill in here as they are confirmed.
      </p>

      <div className="mt-12">
        {events.length > 0 ? (
          events.map((event) => <EventRow key={event.id} event={event} />)
        ) : (
          <p className="border border-dashed border-ink-200 p-8 text-[15px] text-ink-500">
            No events are scheduled right now. Check back soon.
          </p>
        )}
      </div>
    </div>
  );
}
