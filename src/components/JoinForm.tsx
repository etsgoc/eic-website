"use client";

import { useState, FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

export default function JoinForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      full_name: data.get("full_name"),
      email: data.get("email"),
      album_number: data.get("album_number"),
      field_of_study: data.get("field_of_study"),
      year_of_study: data.get("year_of_study"),
      interest_area: data.get("interest_area"),
      motivation: data.get("motivation")
    };

    try {
      const response = await fetch("/api/join", {
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
        <p className="font-display text-lg font-semibold text-ink-900">
          Application received
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink-600">
          Thank you for applying to EIC. You will hear from the team once
          membership opens officially.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="field-label">Full name</label>
          <input id="full_name" name="full_name" required className="field-input" />
        </div>
        <div>
          <label htmlFor="email" className="field-label">WSEI email</label>
          <input id="email" name="email" type="email" required className="field-input" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="album_number" className="field-label">Album number</label>
          <input id="album_number" name="album_number" className="field-input" />
        </div>
        <div>
          <label htmlFor="field_of_study" className="field-label">Field of study</label>
          <input id="field_of_study" name="field_of_study" className="field-input" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="year_of_study" className="field-label">Year of study</label>
          <select id="year_of_study" name="year_of_study" className="field-input">
            <option value="1">Year 1</option>
            <option value="2">Year 2</option>
            <option value="3">Year 3</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="interest_area" className="field-label">Main interest</label>
          <select id="interest_area" name="interest_area" className="field-input">
            <option value="entrepreneurship">Entrepreneurship, I have an idea</option>
            <option value="cofounder">Looking for a cofounder or team</option>
            <option value="innovation">Innovation and research</option>
            <option value="operations">Helping run the club</option>
            <option value="exploring">Just exploring for now</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="motivation" className="field-label">
          What do you want to get out of EIC?
        </label>
        <textarea
          id="motivation"
          name="motivation"
          required
          rows={4}
          className="field-input"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <button type="submit" disabled={status === "submitting"} className="btn btn-accent self-start">
        {status === "submitting" ? "Sending..." : "Submit application"}
      </button>
    </form>
  );
}
