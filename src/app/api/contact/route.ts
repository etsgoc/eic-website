import { NextResponse } from "next/server";
import { saveRecord } from "@/lib/writes";
import type { ContactMessage } from "@/lib/types";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<ContactMessage>;

  if (!body.name || !body.email || !body.message) {
    return NextResponse.json(
      { error: "Name, email and message are required." },
      { status: 400 }
    );
  }

  const result = await saveRecord("contact_messages", "contact-messages.json", {
    id: crypto.randomUUID(),
    name: body.name,
    email: body.email,
    subject: body.subject ?? "General enquiry",
    message: body.message,
    is_read: false,
    created_at: new Date().toISOString()
  });

  return NextResponse.json({ success: result.saved });
}
