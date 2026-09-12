import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { registerForEvent, unregisterFromEvent } from "@/lib/eventRegistrations";
import { getEvents } from "@/lib/dataSource";

async function getCurrentUser() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Log in to register for events." },
      { status: 401 }
    );
  }

  const events = await getEvents();
  const event = events.find((item) => item.id === params.id);
  if (!event) {
    return NextResponse.json({ error: "Event not found." }, { status: 404 });
  }

  const result = await registerForEvent(params.id, user, event.capacity);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 409 });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json(
      { error: "Log in to manage your registrations." },
      { status: 401 }
    );
  }

  await unregisterFromEvent(params.id, user.id);
  return NextResponse.json({ success: true });
}
