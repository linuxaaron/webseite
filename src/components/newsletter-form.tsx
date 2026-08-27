"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({ type: "idle", message: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "loading", message: "Deine Anmeldung wird verarbeitet …" });

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      setStatus({
        type: data.ok ? "success" : "error",
        message: data.message || "Es ist ein unbekannter Fehler aufgetreten.",
      });
      if (data.ok) setEmail("");
    } catch {
      setStatus({ type: "error", message: "Die Anmeldung konnte gerade nicht verarbeitet werden." });
    }
  }

  return (
    <>
      <form onSubmit={submit} className="mt-7">
        <label htmlFor="newsletter-email" className="sr-only">E-Mail-Adresse</label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="newsletter-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="deine@email.de"
            className="min-h-12 flex-1 rounded-full border border-[var(--border)] bg-[var(--bg)] px-5 outline-none transition focus:border-[var(--accent)]"
          />
          <button
            type="submit"
            disabled={status.type === "loading"}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60"
          >
            {status.type === "loading" ? "Wird verarbeitet …" : "Anmelden"}
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
      {status.message && (
        <div
          aria-live="polite"
          className={`mt-5 rounded-xl border px-4 py-3 text-sm leading-6 ${status.type === "success" ? "border-[var(--accent)]/40 bg-[var(--accent)]/8" : "border-[var(--border)]"}`}
        >
          {status.type === "success" && <CheckCircle2 className="mr-2 inline-block text-[var(--accent)]" size={16} />}
          {status.message}
        </div>
      )}
    </>
  );
}

export function NewsletterIntroIcon() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]">
      <Mail size={20} />
    </div>
  );
}
