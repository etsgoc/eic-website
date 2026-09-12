import type { Metadata } from "next";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSiteConfig } from "@/lib/dataSource";

export const metadata: Metadata = {
  title: "EIC — Entrepreneurship & Innovation Club, WSEI",
  description:
    "EIC helps WSEI students take an idea, build it into something real, and connect with the mentors, founders and investors who can help it grow.",
  icons: { icon: "/logo.svg" }
};

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const site = await getSiteConfig();

  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer site={site} />
      </body>
    </html>
  );
}
