import type { Metadata } from "next";
import { Mail, Github } from "lucide-react";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Kontakt | Webentwicklung, IT & Cybersecurity",
  description: "Kontakt zu Joscha Aaron Schmidt für Webentwicklung, technische Projekte, IT, OSINT und Cybersecurity.",
  alternates: { canonical: "/kontakt" },
};

export default function Contact() {
  return (
    <main className="container py-20 sm:py-28">
      <Reveal>
        <p className="font-mono text-xs text-[var(--accent)]">04 / CONTACT</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Kontakt</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Du möchtest über eine Website, ein technisches Projekt, IT-Themen oder eine Zusammenarbeit sprechen? Schreib mir einfach per E-Mail oder über GitHub.
        </p>
      </Reveal>
      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        <a href="mailto:joschaschmidt@mail.de" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 hover:border-[var(--accent)]">
          <Mail className="text-[var(--accent)]" />
          <h2 className="mt-7 text-xl font-semibold">E-Mail</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">joschaschmidt@mail.de</p>
        </a>
        <a href="https://github.com/linuxaaron" target="_blank" rel="noopener noreferrer" className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 hover:border-[var(--accent)]">
          <Github className="text-[var(--accent)]" />
          <h2 className="mt-7 text-xl font-semibold">GitHub</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">github.com/linuxaaron</p>
        </a>
      </div>
    </main>
  );
}
