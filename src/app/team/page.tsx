import TeamCard from "@/components/TeamCard";
import { getTeamPositions } from "@/lib/dataSource";
import type { TeamPosition } from "@/lib/types";

function groupByCategory(positions: TeamPosition[]) {
  const order: TeamPosition["category"][] = [
    "founder",
    "patron",
    "leadership",
    "team_lead"
  ];
  return order
    .map((category) => ({
      category,
      items: positions
        .filter((p) => p.category === category)
        .sort((a, b) => a.display_order - b.display_order)
    }))
    .filter((group) => group.items.length > 0);
}

const categoryLabel: Record<TeamPosition["category"], string> = {
  founder: "Founder",
  patron: "Club patron",
  leadership: "Leadership team",
  team_lead: "Team leads"
};

export default async function TeamPage() {
  const positions = await getTeamPositions();
  const groups = groupByCategory(positions);

  return (
    <div className="container-content py-16 md:py-20">
      <p className="text-sm font-medium text-ink-500">Team</p>
      <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink-900 md:text-4xl">
        Who runs EIC, and who could be next
      </h1>
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500">
        Every leadership position is filled by student election, with a WSEI
        staff or faculty patron supporting the club. Open positions here will
        fill in as EIC is recognized and elections are held.
      </p>

      <div className="mt-14 flex flex-col gap-14">
        {groups.map((group) => (
          <div key={group.category}>
            <h2 className="font-display text-xl font-semibold text-ink-900">
              {categoryLabel[group.category]}
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {group.items.map((position) => (
                <TeamCard key={position.id} position={position} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
