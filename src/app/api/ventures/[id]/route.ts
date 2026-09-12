import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySessionToken, SESSION_COOKIE } from "@/lib/session";
import { deleteVenture } from "@/lib/ventures";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  const user = token ? await verifySessionToken(token) : null;
  if (!user) {
    return NextResponse.json({ error: "Log in first." }, { status: 401 });
  }

  const result = await deleteVenture(params.id, user.id, user.is_admin);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 403 });
  }

  return NextResponse.json({ success: true });
}
