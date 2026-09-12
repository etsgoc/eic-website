import { NextResponse } from "next/server";
import { getTeamPositions } from "@/lib/dataSource";

export async function GET() {
  const team = await getTeamPositions();
  return NextResponse.json({ team });
}
