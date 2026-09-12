import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { createVenture, listVentures } from "@/lib/ventures";

async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function GET() {
  const ventures = await listVentures();
  return NextResponse.json({ ventures });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Log in to post a venture." },
      { status: 401 }
    );
  }

  const body = (await request.json()) as {
    title?: string;
    one_liner?: string;
    stage?: string;
    looking_for?: string;
  };

  if (!body.title || !body.one_liner || !body.looking_for) {
    return NextResponse.json(
      { error: "A title, a one line pitch, and what you are looking for are required." },
      { status: 400 }
    );
  }

  const venture = await createVenture(user, {
    title: body.title,
    one_liner: body.one_liner,
    stage: body.stage || "idea",
    looking_for: body.looking_for
  });

  return NextResponse.json({ venture });
}
