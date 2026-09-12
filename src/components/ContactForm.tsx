"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: data.get("name"),
      email: data.get("email"),
      subject: data.get("subject"),
      message: data.get("message")
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="border border-growth-600 bg-growth-100 p-6">
        <p className="font-display text-lg font-semibold text-ink-900">Message sent</p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
          Thank you for reaching out. The team will get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">Name</label>
          <input id="name" name="name" required className="field-input" />
        </div>
        <div>
          <label htmlFor="email" className="field-label">Email</label>
          <input id="email" name="email" type="email" required className="field-input" />
        </div>
      </div>

      <div>
        <label htmlFor="subject" className="field-label">Subject</label>
        <input id="subject" name="subject" className="field-input" />
      </div>

      <div>
        <label htmlFor="message" className="field-label">Message</label>
        <textarea id="message" name="message" required rows={5} className="field-input" />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button type="submit" disabled={status === "submitting"} className="btn btn-primary self-start">
        {status === "submitting" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
