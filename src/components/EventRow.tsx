import type { ReactNode } from "react";
import type { EventItem } from "@/lib/types";

function formatDateParts(iso: string) {
  const date = new Date(iso);
  const month = date.toLocaleDateString("en-GB", { month: "short" });
  const day = date.toLocaleDateString("en-GB", { day: "2-digit" });
  const time = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit"
  });
  return { month, day, time };
}

interface EventRowProps {
  event: EventItem;
  registeredCount?: number;
  action?: ReactNode;
}

export default function EventRow({ event, registeredCount, action }: EventRowProps) {
  const { month, day, time } = formatDateParts(event.start_time);
  const spotsLabel =
    event.capacity != null
      ? `${registeredCount ?? 0} of ${event.capacity} spots taken`
      : null;

  return (
    <article className="flex flex-col gap-4 border-b border-ink-100 py-7 first:pt-0 last:border-b-0 md:flex-row md:gap-8">
      <div className="flex shrink-0 items-baseline gap-2 md:w-24 md:flex-col md:items-start md:gap-0">
        <span className="text-sm font-medium uppercase text-ink-500">{month}</span>
        <span className="font-display text-3xl font-semibold text-ink-900">{day}</span>
      </div>

      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h3 className="font-display text-lg font-semibold text-ink-900">
            {event.title}
          </h3>
          {event.is_featured && (
            <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-ink-800">
              Featured
            </span>
          )}
        </div>
        <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-500">
          {event.description}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-500">
          <span>{time}</span>
          <span>{event.location}</span>
          {spotsLabel && <span>{spotsLabel}</span>}
        </div>

        {action && <div className="mt-4">{action}</div>}
      </div>
    </article>
  );
}
