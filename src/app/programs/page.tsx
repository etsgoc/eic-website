import JourneyPath from "@/components/JourneyPath";
import { getPrograms } from "@/lib/dataSource";

export default async function ProgramsPage() {
  const programs = await getPrograms();

  return (
    <div className="container-content py-16 md:py-20">
      <p className="text-sm font-medium text-ink-500">Programs</p>
      <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink-900 md:text-4xl">
        Every member moves along the same path, at their own pace
      </h1>
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500">
        These eight stages are not tied to a fixed timeline. A member can
        move quickly if the idea and the support are strong, or take longer
        where it is needed. EIC provides workshops, mentors and connections
        at every stage.
      </p>

      <div className="mt-16">
        <JourneyPath stages={programs} showDescription />
      </div>

      <div className="mt-20 border-t border-ink-100 pt-14">
        <h2 className="font-display text-2xl font-semibold text-ink-900">
          Two tracks, side by side
        </h2>
        <div className="mt-8 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-[15px] font-medium text-ink-900">
              Entrepreneurship track
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
              For members actively building a venture. Covers founder
              matching, customer discovery, business models, and getting
              ready to pitch to mentors and investors.
            </p>
          </div>
          <div>
            <h3 className="text-[15px] font-medium text-ink-900">
              Innovation track
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-500">
              For members interested in innovation more broadly, including
              research, technology and social impact, who do not yet have a
              venture of their own.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
