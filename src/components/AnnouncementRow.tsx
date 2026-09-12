import type { Announcement } from "@/lib/types";

export default function AnnouncementRow({ item }: { item: Announcement }) {
  const date = new Date(item.published_at).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  return (
    <article className="border-b border-ink-100 py-7 first:pt-0 last:border-b-0">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        {item.is_pinned && (
          <span className="rounded bg-ink-800 px-2 py-0.5 text-xs font-medium text-paper">
            Pinned
          </span>
        )}
        <span className="text-sm text-ink-400">{date}</span>
      </div>
      <h3 className="mt-2 font-display text-lg font-semibold text-ink-900">
        {item.title}
      </h3>
      <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-500">
        {item.body}
      </p>
    </article>
  );
}
