"use client";

import { useState, FormEvent } from "react";
import VentureCard from "./VentureCard";
import type { SessionUser, VenturePost } from "@/lib/types";

interface VentureBoardProps {
  initialVentures: VenturePost[];
  currentUser: SessionUser | null;
}

const stageOptions = [
  { value: "idea", label: "Idea" },
  { value: "team", label: "Looking for a team" },
  { value: "validate", label: "Validating" },
  { value: "build", label: "Building" },
  { value: "business", label: "Working out the business" },
  { value: "fund", label: "Raising" },
  { value: "launch", label: "Launched" }
];

export default function VentureBoard({
  initialVentures,
  currentUser
}: VentureBoardProps) {
  const [ventures, setVentures] = useState(initialVentures);
  const [formOpen, setFormOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [removingId, setRemovingId] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      title: data.get("title"),
      one_liner: data.get("one_liner"),
      stage: data.get("stage"),
      looking_for: data.get("looking_for")
    };

    try {
      const response = await fetch("/api/ventures", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Could not post your venture.");

      setVentures((prev) => [body.venture, ...prev]);
      form.reset();
      setFormOpen(false);
    } catch (error) {
      setStatus("error");
      setErrorMessage(
        error instanceof Error ? error.message : "Could not post your venture."
      );
      return;
    }
    setStatus("idle");
  }

  async function handleRemove(id: string) {
    setRemovingId(id);
    try {
      await fetch(`/api/ventures/${id}`, { method: "DELETE" });
      setVentures((prev) => prev.filter((venture) => venture.id !== id));
    } finally {
      setRemovingId(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-[15px] text-ink-500">
          {ventures.length} {ventures.length === 1 ? "venture" : "ventures"} posted
        </p>

        {currentUser ? (
          <button
            type="button"
            onClick={() => setFormOpen((value) => !value)}
            className="btn btn-accent"
          >
            {formOpen ? "Close" : "Post your venture"}
          </button>
        ) : (
          <p className="text-sm text-ink-500">
            <a href="/login" className="font-medium text-ink-800 hover:text-ink-600">
              Log in
            </a>{" "}
            to post your own venture or reach out to a team.
          </p>
        )}
      </div>

      {formOpen && currentUser && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 flex flex-col gap-5 border border-ink-100 bg-white p-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="field-label">Venture name</label>
              <input id="title" name="title" required className="field-input" />
            </div>
            <div>
              <label htmlFor="stage" className="field-label">Stage</label>
              <select id="stage" name="stage" className="field-input" defaultValue="idea">
                {stageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="one_liner" className="field-label">
              Describe it in one line
            </label>
            <input id="one_liner" name="one_liner" required className="field-input" />
          </div>

          <div>
            <label htmlFor="looking_for" className="field-label">
              What are you looking for?
            </label>
            <input
              id="looking_for"
              name="looking_for"
              required
              placeholder="For example, a technical cofounder, a designer, early users"
              className="field-input"
            />
          </div>

          {status === "error" && <p className="text-sm text-red-600">{errorMessage}</p>}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="btn btn-primary self-start"
          >
            {status === "submitting" ? "Posting..." : "Post to the board"}
          </button>
        </form>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {ventures.map((venture) => (
          <VentureCard
            key={venture.id}
            venture={venture}
            action={
              currentUser?.id === venture.member_id ? (
                <button
                  type="button"
                  onClick={() => handleRemove(venture.id)}
                  disabled={removingId === venture.id}
                  className="text-sm text-ink-500 hover:text-ink-900"
                >
                  {removingId === venture.id ? "Removing..." : "Remove my post"}
                </button>
              ) : (
                <a
                  href={`mailto:${venture.contact_email}`}
                  className="text-sm font-medium text-ink-800 hover:text-ink-600"
                >
                  Get in touch
                </a>
              )
            }
          />
        ))}
      </div>

      {ventures.length === 0 && (
        <p className="mt-8 border border-dashed border-ink-200 p-8 text-[15px] text-ink-500">
          No ventures posted yet. Be the first to post one, or check back once
          members start sharing what they are building.
        </p>
      )}
    </div>
  );
}
