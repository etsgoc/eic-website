import { NextResponse } from "next/server";
import { saveRecord } from "@/lib/writes";
import type { MembershipApplication } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<MembershipApplication>;

  if (!body.full_name || !body.email || !body.motivation) {
    return NextResponse.json(
      { error: "Full name, email and motivation are required." },
      { status: 400 }
    );
  }

  const result = await saveRecord("membership_applications", {
    full_name: body.full_name,
    email: body.email,
    album_number: body.album_number ?? "",
    field_of_study: body.field_of_study ?? "",
    year_of_study: body.year_of_study ?? "",
    interest_area: body.interest_area ?? "",
    motivation: body.motivation,
    status: "pending",
    created_at: new Date().toISOString()
  });

  return NextResponse.json({ success: result.saved });
}
