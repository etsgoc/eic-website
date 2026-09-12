import AnnouncementRow from "@/components/AnnouncementRow";
import { getAnnouncements } from "@/lib/dataSource";

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div className="container-content py-16 md:py-20">
      <p className="text-sm font-medium text-ink-500">Announcements</p>
      <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink-900 md:text-4xl">
        What is happening with EIC
      </h1>
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500">
        Updates on official recognition, elections, and everything else
        members need to know.
      </p>

      <div className="mt-12">
        {announcements.length > 0 ? (
          announcements.map((item) => (
            <AnnouncementRow key={item.id} item={item} />
          ))
        ) : (
          <p className="border border-dashed border-ink-200 p-8 text-[15px] text-ink-500">
            No announcements yet.
          </p>
        )}
      </div>
    </div>
  );
}
