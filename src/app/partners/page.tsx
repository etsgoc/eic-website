import PartnerCard from "@/components/PartnerCard";
import { getPartners } from "@/lib/dataSource";

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <div className="container-content py-16 md:py-20">
      <p className="text-sm font-medium text-ink-500">Partners</p>
      <h1 className="mt-3 max-w-2xl font-display text-3xl font-semibold text-ink-900 md:text-4xl">
        The people and organizations behind EIC
      </h1>
      <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-ink-500">
        EIC is building relationships with mentors, companies and investors
        who can support WSEI students directly. Here is where that stands.
      </p>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {partners.map((partner) => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>

      <div className="mt-14 border border-dashed border-ink-200 p-8">
        <h2 className="font-display text-lg font-semibold text-ink-900">
          Want to partner with EIC?
        </h2>
        <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink-500">
          Companies, investors and mentors interested in working with WSEI
          students can get in touch through the contact page.
        </p>
        <a
          href="/contact"
          className="mt-4 inline-block text-sm font-medium text-ink-800 hover:text-ink-600"
        >
          Contact EIC
        </a>
      </div>
    </div>
  );
}
