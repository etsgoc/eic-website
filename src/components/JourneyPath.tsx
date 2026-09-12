import type { ProgramStage } from "@/lib/types";

interface JourneyPathProps {
  stages: ProgramStage[];
  showDescription?: boolean;
}

export default function JourneyPath({
  stages,
  showDescription = false
}: JourneyPathProps) {
  const sorted = [...stages].sort((a, b) => a.stage_order - b.stage_order);

  return (
    <div className="relative">
      <div className="absolute left-[7px] top-0 bottom-0 w-px bg-ink-200 md:left-0 md:right-0 md:top-[7px] md:h-px md:w-auto md:bottom-auto" />
      <ol className="relative flex flex-col gap-7 md:flex-row md:justify-between md:gap-3">
        {sorted.map((stage, index) => (
          <li
            key={stage.id}
            className="relative flex items-start gap-4 md:flex-1 md:flex-col md:items-center md:gap-3 md:text-center"
          >
            <span
              className={`relative z-10 mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-paper ${
                index === sorted.length - 1 ? "bg-amber" : "bg-ink-800"
              }`}
              aria-hidden="true"
            />
            <div>
              <p className="text-[15px] font-medium text-ink-900">{stage.title}</p>
              {showDescription && (
                <p className="mt-1.5 max-w-[22ch] text-sm leading-relaxed text-ink-500 md:mx-auto">
                  {stage.description}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
