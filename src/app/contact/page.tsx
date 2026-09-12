import { getSiteConfig } from "@/lib/dataSource";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage() {
  const site = await getSiteConfig();

  return (
    <div className="container-content py-16 md:py-20">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <p className="text-sm font-medium text-ink-500">Contact</p>
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink-900 md:text-4xl">
            Get in touch
          </h1>
          <p className="mt-5 text-[17px] leading-relaxed text-ink-500">
            Questions about membership, partnerships, or the club in general
            are all welcome here.
          </p>
          <div className="mt-8 border-t border-ink-100 pt-8">
            <p className="text-sm font-medium text-ink-900">Email</p>
            <a
              href={`mailto:${site.contact_email}`}
              className="mt-1 block text-[15px] text-ink-500 hover:text-ink-900"
            >
              {site.contact_email}
            </a>
          </div>
        </div>

        <ContactForm />
      </div>
    </div>
  );
}
