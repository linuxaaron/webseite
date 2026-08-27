import type { Metadata } from "next";
import { NewsletterForm, NewsletterIntroIcon } from "@/components/newsletter-form";

export const metadata: Metadata = {
  title: "Newsletter | Linux, Security & OSINT",
  description: "Newsletter von Joscha Schmidt mit technischen Artikeln, Linux-Praxis, Cybersecurity, OSINT und ausgewählten digitalen Produkten.",
  alternates: { canonical: "/newsletter" },
};

export default function NewsletterPage() {
  return (
    <main>
      <section className="border-b border-[var(--border)] bg-[var(--surface)] py-20 sm:py-28">
        <div className="container max-w-4xl">
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--accent)]">LINUX AARON · BRIEFING</p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">Linux, Security &amp; OSINT direkt in dein Postfach.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--muted)]">Neue technische Artikel, ausgewählte Cybersecurity-Themen, Linux-Praxis und Hinweise auf neue digitale Produkte – kompakt und ohne unnötigen Lärm.</p>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container grid max-w-5xl gap-10 lg:grid-cols-[1fr_.9fr] lg:items-start">
          <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 sm:p-9">
            <NewsletterIntroIcon />
            <h2 className="mt-6 text-2xl font-semibold">Linux Aaron Briefing abonnieren</h2>
            <p className="mt-3 leading-7 text-[var(--muted)]">Trag deine E-Mail-Adresse ein. Danach bekommst du eine Bestätigungs-Mail. Erst wenn du diese bestätigst, wird die Anmeldung aktiv.</p>
            <NewsletterForm />
            <p className="mt-5 text-xs leading-5 text-[var(--muted)]">Die Anmeldung erfolgt mit Bestätigung. Deine E-Mail-Adresse wird ausschließlich für den Newsletter-Versand verwendet. Du kannst dich jederzeit über den Link in jeder Newsletter-Mail abmelden. Weitere Informationen findest du in der <a href="/datenschutz" className="underline underline-offset-4">Datenschutzerklärung</a>.</p>
          </div>

          <div className="space-y-4">
            {[
              ["Technische Praxis", "Linux-Befehle, Hardening, Systemanalyse und praktische Workflows."],
              ["Security & OSINT", "Ausgewählte Themen aus Cybersecurity, Recherche und digitaler Analyse."],
              ["Neue Produkte", "Hinweise auf neue Guides, Checklisten und Security-Ressourcen."],
            ].map(([title, text]) => (
              <article key={title} className="rounded-2xl border border-[var(--border)] p-5">
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
