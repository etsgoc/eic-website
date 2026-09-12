import { NextResponse } from "next/server";
import { getAnnouncements } from "@/lib/dataSource";

export async function GET() {
  const announcements = await getAnnouncements();
  return NextResponse.json({ announcements });
}
