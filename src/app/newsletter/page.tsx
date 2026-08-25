"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, Mail } from "lucide-react";

export default function NewsletterPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{ type: "idle" | "loading" | "success" | "error"; message: string }>({ type: "idle", message: "" });

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "loading", message: "Deine Anmeldung wird verarbeitet …" });
    try {
      const response = await fetch("/api/newsletter/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      const data = await response.json();
      setStatus({ type: data.ok ? "success" : "error", message: data.message || "Es ist ein unbekannter Fehler aufgetreten." });
      if (data.ok) setEmail("");
    } catch {
      setStatus({ type: "error", message: "Die Anmeldung konnte gerade nicht verarbeitet werden." });
    }
  }

  return <main><section className="border-b border-[var(--border)] bg-[var(--surface)] py-20 sm:py-28"><div className="container max-w-4xl"><p className="font-mono text-xs tracking-[0.2em] text-[var(--accent)]">LINUX AARON · BRIEFING</p><h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">Linux, Security &amp; OSINT direkt in dein Postfach.</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">Neue technische Artikel, ausgewählte Cybersecurity-Themen, Linux-Praxis und Hinweise auf neue digitale Produkte – kompakt und ohne unnötigen Lärm.</p></div></section><section className="py-16 sm:py-24"><div className="container grid max-w-5xl gap-10 lg:grid-cols-[1fr_.9fr] lg:items-start"><div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-9"><div className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]"><Mail size={20}/></div><h2 className="mt-6 text-2xl font-semibold">Linux Aaron Briefing abonnieren</h2><p className="mt-3 leading-7 text-[var(--muted)]">Trag deine E-Mail-Adresse ein. Danach bekommst du eine Bestätigungs-Mail. Erst wenn du diese bestätigst, wird die Anmeldung aktiv.</p><form onSubmit={submit} className="mt-7"><label htmlFor="newsletter-email" className="sr-only">E-Mail-Adresse</label><div className="flex flex-col gap-3 sm:flex-row"><input id="newsletter-email" type="email" required autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="deine@email.de" className="min-h-12 flex-1 rounded-full border border-[var(--border)] bg-[var(--bg)] px-5 outline-none transition focus:border-[var(--accent)]"/><button type="submit" disabled={status.type === "loading"} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--accent)] px-6 text-sm font-semibold text-black transition hover:brightness-110 disabled:cursor-wait disabled:opacity-60">{status.type === "loading" ? "Wird verarbeitet …" : "Anmelden"}<ArrowRight size={16}/></button></div></form>{status.message&&<div aria-live="polite" className={`mt-5 rounded-xl border px-4 py-3 text-sm leading-6 ${status.type === "success" ? "border-[var(--accent)]/40 bg-[var(--accent)]/8" : "border-[var(--border)]"}`}>{status.type === "success"&&<CheckCircle2 className="mr-2 inline-block text-[var(--accent)]" size={16}/>} {status.message}</div>}<p className="mt-5 text-xs leading-5 text-[var(--muted)]">Die Anmeldung erfolgt mit Bestätigung. Deine E-Mail-Adresse wird ausschließlich für den Newsletter-Versand verwendet. Du kannst dich jederzeit über den Link in jeder Newsletter-Mail abmelden. Weitere Informationen findest du in der <a href="/datenschutz" className="underline underline-offset-4">Datenschutzerklärung</a>.</p></div><div className="space-y-4">{[["Technische Praxis","Linux-Befehle, Hardening, Systemanalyse und praktische Workflows."],["Security & OSINT","Ausgewählte Themen aus Cybersecurity, Recherche und digitaler Analyse."],["Neue Produkte","Hinweise auf neue Guides, Checklisten und Security-Ressourcen."]].map(([title,text])=><article key={title} className="rounded-2xl border border-[var(--border)] p-5"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p></article>)}</div></div></section></main>;
}
