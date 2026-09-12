import { NextResponse } from "next/server";
import { getPrograms } from "@/lib/dataSource";

export async function GET() {
  const programs = await getPrograms();
  return NextResponse.json({ programs });
}
