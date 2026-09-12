"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password")
        })
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error || "Could not log in.");
      }

      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      setStatus("error");
      setErrorMessage(error instanceof Error ? error.message : "Could not log in.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label htmlFor="email" className="field-label">Email</label>
        <input id="email" name="email" type="email" required className="field-input" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">Password</label>
        <input id="password" name="password" type="password" required className="field-input" />
      </div>

      {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

      <button type="submit" disabled={status === "submitting"} className="btn btn-primary">
        {status === "submitting" ? "Logging in..." : "Log in"}
      </button>

      <div className="border-t border-ink-100 pt-5 text-sm text-ink-500">
        <p className="font-medium text-ink-700">Trying the demo</p>
        <p className="mt-1">
          Email demo@eic.wsei.edu.pl, password EICDemo123! until the real
          member accounts are connected.
        </p>
      </div>
    </form>
  );
}
