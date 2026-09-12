"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import type { SessionUser } from "@/lib/types";

const links = [
  { href: "/about", label: "About" },
  { href: "/programs", label: "Programs" },
  { href: "/events", label: "Events" },
  { href: "/ventures", label: "Ventures" },
  { href: "/announcements", label: "Announcements" },
  { href: "/team", label: "Team" },
  { href: "/partners", label: "Partners" }
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const pathname = usePathname();

  // Re-checked on every navigation, not just once on mount, so the header
  // updates right away after logging in or logging out and redirecting.
  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((response) => response.json())
      .then((body) => {
        if (!cancelled) setUser(body.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-ink-100 bg-paper/95 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[15px] ${
                pathname === link.href
                  ? "font-medium text-ink-900"
                  : "text-ink-500 hover:text-ink-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2.5 rounded border border-ink-200 py-1.5 pl-1.5 pr-3.5 text-[15px] text-ink-800 hover:border-ink-800"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-800 font-display text-xs font-semibold text-paper">
                {initials(user.full_name)}
              </span>
              Account
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-[15px] text-ink-500 hover:text-ink-900">
                Log in
              </Link>
              <Link href="/join" className="btn btn-accent">
                Join EIC
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded border border-ink-200 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {open ? (
              <path
                d="M4 4L16 16M16 4L4 16"
                stroke="#12213A"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            ) : (
              <path
                d="M2.5 5.5H17.5M2.5 10H17.5M2.5 14.5H17.5"
                stroke="#12213A"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-ink-100 bg-paper px-6 py-5 lg:hidden">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-[16px] text-ink-800"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-3 border-t border-ink-100 pt-5">
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 rounded border border-ink-200 px-3.5 py-2.5 text-[15px] text-ink-800"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink-800 font-display text-xs font-semibold text-paper">
                  {initials(user.full_name)}
                </span>
                Account
              </Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="btn btn-ghost">
                  Log in
                </Link>
                <Link href="/join" onClick={() => setOpen(false)} className="btn btn-accent">
                  Join EIC
                </Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
