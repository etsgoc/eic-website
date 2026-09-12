import Link from "next/link";
import Logo from "./Logo";
import type { SiteConfig } from "@/lib/types";

export default function Footer({ site }: { site: SiteConfig }) {
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="container-content grid gap-10 py-14 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-[15px] leading-relaxed text-ink-500">
            {site.club_name_en} ({site.club_name_pl}), at {site.location}.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-ink-900">Club</p>
          <ul className="flex flex-col gap-2.5 text-[15px] text-ink-500">
            <li><Link href="/about" className="hover:text-ink-900">About</Link></li>
            <li><Link href="/programs" className="hover:text-ink-900">Programs</Link></li>
            <li><Link href="/team" className="hover:text-ink-900">Team</Link></li>
            <li><Link href="/partners" className="hover:text-ink-900">Partners</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-ink-900">Stay in touch</p>
          <ul className="flex flex-col gap-2.5 text-[15px] text-ink-500">
            <li><Link href="/events" className="hover:text-ink-900">Events</Link></li>
            <li><Link href="/ventures" className="hover:text-ink-900">Ventures</Link></li>
            <li><Link href="/announcements" className="hover:text-ink-900">Announcements</Link></li>
            <li><Link href="/contact" className="hover:text-ink-900">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-medium text-ink-900">Reach us</p>
          <ul className="flex flex-col gap-2.5 text-[15px] text-ink-500">
            <li>
              <a href={`mailto:${site.contact_email}`} className="hover:text-ink-900">
                {site.contact_email}
              </a>
            </li>
            <li>
              <a href={site.social_instagram} className="hover:text-ink-900">Instagram</a>
            </li>
            <li>
              <a href={site.social_linkedin} className="hover:text-ink-900">LinkedIn</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-ink-100 py-6">
        <div className="container-content flex flex-col gap-2 text-sm text-ink-400 md:flex-row md:items-center md:justify-between">
          <p>{site.founding_status}.</p>
          <p>&copy; {new Date().getFullYear()} {site.short_name}, {site.location}.</p>
        </div>
      </div>
    </footer>
  );
}
