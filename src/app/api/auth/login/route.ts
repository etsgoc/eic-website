import { NextResponse } from "next/server";
import { createSessionToken, verifyLogin, SESSION_COOKIE } from "@/lib/auth";

export async function POST(request: Request) {
  const { email, password } = (await request.json()) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  const user = await verifyLogin(email, password);
  if (!user) {
    return NextResponse.json(
      { error: "That email and password combination was not recognized." },
      { status: 401 }
    );
  }

  const token = await createSessionToken(user);
  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  return response;
}
