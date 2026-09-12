import Link from "next/link";
import JourneyPath from "@/components/JourneyPath";
import EventRow from "@/components/EventRow";
import AnnouncementRow from "@/components/AnnouncementRow";
import {
  getAnnouncements,
  getPrograms,
  getSiteConfig,
  getUpcomingEvents
} from "@/lib/dataSource";

export default async function HomePage() {
  const [site, programs, events, announcements] = await Promise.all([
    getSiteConfig(),
    getPrograms(),
    getUpcomingEvents(),
    getAnnouncements()
  ]);

  const nextEvents = events.slice(0, 2);
  const latestAnnouncements = announcements.slice(0, 2);

  return (
    <div>
      <section className="border-b border-ink-100">
        <div className="container-content grid gap-12 py-16 md:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <p className="text-sm font-medium text-ink-500">
              {site.club_name_en} ({site.club_name_pl})
            </p>
            <h1 className="mt-4 max-w-xl font-display text-4xl font-semibold leading-[1.1] text-ink-900 md:text-5xl">
              {site.tagline}
            </h1>
            <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-500">
              {site.mission}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/join" className="btn btn-accent">
                Join EIC
              </Link>
              <Link href="/events" className="btn btn-ghost">
                See what is on
              </Link>
            </div>
            <p className="mt-6 text-sm text-ink-400">{site.founding_status}.</p>
          </div>

          <div className="flex flex-col justify-center border-t border-ink-100 pt-10 lg:border-t-0 lg:border-l lg:pl-12 lg:pt-0">
            <p className="mb-6 text-sm font-medium text-ink-900">
              One path, from idea to company
            </p>
            <JourneyPath stages={programs} />
          </div>
        </div>
      </section>

      <section className="border-b border-ink-100 bg-white">
        <div className="container-content grid gap-8 py-12 sm:grid-cols-3">
          <div>
            <p className="font-display text-3xl font-semibold text-ink-900">8</p>
            <p className="mt-1 text-[15px] text-ink-500">
              stages from a first idea to a launched company
            </p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-ink-900">1 street</p>
            <p className="mt-1 text-[15px] text-ink-500">
              away from Imaguru, a working coaching and investment hub
            </p>
          </div>
          <div>
            <p className="font-display text-3xl font-semibold text-ink-900">0%</p>
            <p className="mt-1 text-[15px] text-ink-500">
              equity taken by EIC in any member's venture
            </p>
          </div>
        </div>
      </section>

      <section className="container-content py-16 md:py-20">
        <div className="grid gap-10 md:grid-cols-3 md:gap-8">
          <div>
            <h2 className="font-display text-xl font-semibold text-ink-900">
              Learn by doing
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
              Workshops, founder talks and hands on sessions that teach
              entrepreneurship through real problems, not lectures alone.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink-900">
              Find your team
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
              Meet cofounders, developers, designers and other students who
              want to build something, inside a community that already shares
              your goals.
            </p>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-ink-900">
              Meet the people who can help
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
              Mentors, companies and investors, including neighbours like
              Imaguru, introduced through pitch practice and demo days.
            </p>
          </div>
        </div>
      </section>

      {nextEvents.length > 0 && (
        <section className="border-t border-ink-100 bg-white">
          <div className="container-content py-16 md:py-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold text-ink-900">
                Coming up
              </h2>
              <Link href="/events" className="text-sm font-medium text-ink-800 hover:text-ink-600">
                View all events
              </Link>
            </div>
            <div className="mt-4">
              {nextEvents.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      )}

      {latestAnnouncements.length > 0 && (
        <section className="border-t border-ink-100">
          <div className="container-content py-16 md:py-20">
            <div className="flex items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold text-ink-900">
                Latest announcements
              </h2>
              <Link
                href="/announcements"
                className="text-sm font-medium text-ink-800 hover:text-ink-600"
              >
                View all announcements
              </Link>
            </div>
            <div className="mt-4">
              {latestAnnouncements.map((item) => (
                <AnnouncementRow key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-ink-100 bg-ink-900">
        <div className="container-content flex flex-col items-start gap-6 py-16 md:flex-row md:items-center md:justify-between md:py-20">
          <div>
            <h2 className="font-display text-2xl font-semibold text-paper md:text-3xl">
              Ready to build something?
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-ink-200">
              Membership is free and open to every WSEI student, whatever
              stage your idea is at, even if you do not have one yet.
            </p>
          </div>
          <Link href="/join" className="btn btn-accent shrink-0">
            Apply to join
          </Link>
        </div>
      </section>
    </div>
  );
}
