"use client";

import { useState, ReactNode } from "react";
import Link from "next/link";
import EventRow from "./EventRow";
import type { EventItem, SessionUser } from "@/lib/types";

interface EventsListProps {
  events: EventItem[];
  initialCounts: Record<string, number>;
  initialRegisteredIds: string[];
  currentUser: SessionUser | null;
}

export default function EventsList({
  events,
  initialCounts,
  initialRegisteredIds,
  currentUser
}: EventsListProps) {
  const [counts, setCounts] = useState(initialCounts);
  const [registeredIds, setRegisteredIds] = useState(new Set(initialRegisteredIds));
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [errorByEvent, setErrorByEvent] = useState<Record<string, string>>({});

  async function handleRegister(event: EventItem) {
    setPendingId(event.id);
    setErrorByEvent((prev) => ({ ...prev, [event.id]: "" }));

    try {
      const response = await fetch(`/api/events/${event.id}/register`, {
        method: "POST"
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not register.");

      setRegisteredIds((prev) => new Set(prev).add(event.id));
      setCounts((prev) => ({ ...prev, [event.id]: (prev[event.id] ?? 0) + 1 }));
    } catch (error) {
      setErrorByEvent((prev) => ({
        ...prev,
        [event.id]: error instanceof Error ? error.message : "Could not register."
      }));
    } finally {
      setPendingId(null);
    }
  }

  async function handleUnregister(event: EventItem) {
    setPendingId(event.id);
    try {
      await fetch(`/api/events/${event.id}/register`, { method: "DELETE" });
      setRegisteredIds((prev) => {
        const next = new Set(prev);
        next.delete(event.id);
        return next;
      });
      setCounts((prev) => ({
        ...prev,
        [event.id]: Math.max(0, (prev[event.id] ?? 1) - 1)
      }));
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      {events.map((event) => {
        const isRegistered = registeredIds.has(event.id);
        const isFull =
          event.capacity != null && (counts[event.id] ?? 0) >= event.capacity;
        const isPending = pendingId === event.id;

        let action: ReactNode;
        if (!currentUser) {
          action = (
            <Link
              href={`/login?redirectTo=/events`}
              className="text-sm font-medium text-ink-800 hover:text-ink-600"
            >
              Log in to register
            </Link>
          );
        } else if (isRegistered) {
          action = (
            <div className="flex items-center gap-3">
              <span className="rounded bg-growth-100 px-2 py-0.5 text-xs font-medium text-growth-600">
                You are registered
              </span>
              <button
                type="button"
                onClick={() => handleUnregister(event)}
                disabled={isPending}
                className="text-sm text-ink-500 hover:text-ink-900"
              >
                {isPending ? "Cancelling..." : "Cancel registration"}
              </button>
            </div>
          );
        } else if (isFull) {
          action = <span className="text-sm text-ink-400">This event is full</span>;
        } else {
          action = (
            <button
              type="button"
              onClick={() => handleRegister(event)}
              disabled={isPending}
              className="btn btn-primary px-4 py-2 text-sm"
            >
              {isPending ? "Registering..." : "Register"}
            </button>
          );
        }

        return (
          <div key={event.id}>
            <EventRow
              event={event}
              registeredCount={counts[event.id] ?? 0}
              action={action}
            />
            {errorByEvent[event.id] && (
              <p className="-mt-4 pb-4 text-sm text-red-600">
                {errorByEvent[event.id]}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
