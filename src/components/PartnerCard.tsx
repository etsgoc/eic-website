import type { Partner } from "@/lib/types";

const levelLabel: Record<Partner["partnership_level"], string> = {
  founding: "Founding partner",
  strategic: "Strategic partner",
  community: "Community partner",
  upcoming: "In conversation"
};

export default function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="border border-ink-100 bg-white p-6">
      <div className="flex items-start justify-between gap-3">
        <p className="font-display text-lg font-semibold text-ink-900">
          {partner.name}
        </p>
        <span className="whitespace-nowrap rounded bg-growth-100 px-2 py-0.5 text-xs font-medium text-growth-600">
          {levelLabel[partner.partnership_level]}
        </span>
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-500">
        {partner.description}
      </p>
      {partner.website_url && (
        <a
          href={partner.website_url}
          className="mt-4 inline-block text-sm font-medium text-ink-800 hover:text-ink-600"
        >
          Visit website
        </a>
      )}
    </div>
  );
}
