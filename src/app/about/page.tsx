import { getSiteConfig } from "@/lib/dataSource";

export default async function AboutPage() {
  const site = await getSiteConfig();

  return (
    <div className="container-content py-16 md:py-20">
      <p className="text-sm font-medium text-ink-500">About</p>
      <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink-900 md:text-4xl">
        A student led way into entrepreneurship at WSEI
      </h1>
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500">
        {site.mission}
      </p>

      <div className="mt-14 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-display text-xl font-semibold text-ink-900">
            What EIC is
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
            EIC is a student organization, not an investment fund, an
            incubator on its own, or a company. It sits between WSEI students
            and the wider entrepreneurship world, connecting members to
            education, mentors, other students, companies and investors.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-ink-900">
            What EIC is not
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
            EIC does not claim ownership of any member's idea or company
            simply because they take part in the club. It does not promise
            funding directly, but works to introduce ventures to people who
            can genuinely help, from mentors to investors.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-ink-900">
            Why WSEI, why now
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
            Students at WSEI already study subjects that naturally lead to
            entrepreneurship and innovation. WSEI is also a short walk from
            Imaguru, a working coaching and investment organization, which
            means EIC can connect students to real support quickly rather
            than building an ecosystem from nothing.
          </p>
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold text-ink-900">
            How EIC is run
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
            EIC is led by students, elected by members, with a WSEI staff or
            faculty patron supporting the club. Full details are set out in
            the EIC constitution, and every position is described on the
            team page.
          </p>
        </div>
      </div>
    </div>
  );
}
