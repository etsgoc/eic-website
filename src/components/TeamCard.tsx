import type { TeamPosition } from "@/lib/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function TeamCard({ position }: { position: TeamPosition }) {
  return (
    <div className="flex items-start gap-4 border border-ink-100 bg-white p-5">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-sm font-semibold ${
          position.is_filled
            ? "bg-ink-800 text-paper"
            : "border border-dashed border-ink-200 text-ink-400"
        }`}
      >
        {position.member_name ? initials(position.member_name) : "?"}
      </div>
      <div>
        <p className="text-[15px] font-medium text-ink-900">{position.title}</p>
        {position.is_filled ? (
          <>
            <p className="mt-0.5 text-sm text-ink-600">{position.member_name}</p>
            {position.member_bio && (
              <p className="mt-1 text-sm text-ink-400">{position.member_bio}</p>
            )}
          </>
        ) : (
          <p className="mt-0.5 text-sm text-ink-400">
            Open, pending {position.category === "patron" ? "appointment" : "election"}
          </p>
        )}
        <p className="mt-2 text-sm leading-relaxed text-ink-500">
          {position.description}
        </p>
      </div>
    </div>
  );
}
