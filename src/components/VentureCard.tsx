import type { ReactNode } from "react";
import type { VenturePost } from "@/lib/types";

const stageLabel: Record<string, string> = {
  discover: "Discover",
  idea: "Idea",
  team: "Looking for a team",
  validate: "Validating",
  build: "Building",
  business: "Working out the business",
  fund: "Raising",
  launch: "Launched"
};

export default function VentureCard({
  venture,
  action
}: {
  venture: VenturePost;
  action?: ReactNode;
}) {
  return (
    <div className="border border-ink-100 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-display text-lg font-semibold text-ink-900">
            {venture.title}
          </p>
          <p className="mt-1 text-sm text-ink-500">by {venture.member_name}</p>
        </div>
        <span className="whitespace-nowrap rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-ink-800">
          {stageLabel[venture.stage] ?? venture.stage}
        </span>
      </div>

      <p className="mt-3 text-[15px] leading-relaxed text-ink-600">
        {venture.one_liner}
      </p>

      <div className="mt-4 border-t border-ink-100 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
          Looking for
        </p>
        <p className="mt-1 text-[15px] text-ink-700">{venture.looking_for}</p>
      </div>

      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
