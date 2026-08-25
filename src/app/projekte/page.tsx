import type { Metadata } from "next";
import { ArrowUpRight, Shield, Search, LayoutDashboard, BriefcaseBusiness, Database } from "lucide-react";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Projekte und Open Source Arbeiten",
  description: "Ausgewählte Open Source und Portfolio-Projekte von Joscha Aaron Schmidt zu Cybersecurity, OSINT, Malware-Analyse, Security Monitoring und Webentwicklung.",
  alternates: { canonical: "/projekte" },
};

const projects = [
  {
    name: "web-osint",
    description: "In Go entwickeltes OSINT-Werkzeug zur Analyse öffentlich beobachtbarer Informationen über Domains und Websites – inklusive DNS, TLS, Security-Headern, Technologien und JSON-Reports.",
    href: "https://github.com/linuxaaron/web-osint",
    icon: Search,
    tags: ["OSINT", "Go", "Web Analysis"],
  },
  {
    name: "OSINT ADHD",
    description: "Strukturierte und kuratierte Sammlung von OSINT-Ressourcen für webbasierte Recherchen. Enthält die Ressourcen des offiziellen OSINT Frameworks sowie eine getrennte Sammlung persönlicher Empfehlungen, mit Fokus auf nachvollziehbare Quellen, Datenqualität und verantwortungsvolle Nutzung.",
    href: "https://github.com/linuxaaron/Osint-ADHD",
    icon: Database,
    tags: ["OSINT", "Ressourcensammlung", "Open Source"],
  },
  {
    name: "malware-analyzer",
    description: "Defensiver Static-Malware-Analyzer zur technischen Triage verdächtiger Dateien. Analysiert unter anderem Hashes, Strings, PE-Strukturen, Entropie, IOCs und optionale YARA-Regeln.",
    href: "https://github.com/linuxaaron/malware-analyzer",
    icon: Shield,
    tags: ["Security", "Malware Analysis", "Python"],
  },
  {
    name: "security-dashboard",
    description: "Security Dashboard zur Verwaltung von Assets, Schwachstellen und Sicherheitsereignissen mit nachvollziehbarer Risikobewertung und CVE-Daten aus der NVD API.",
    href: "https://github.com/linuxaaron/security-dashboard",
    icon: LayoutDashboard,
    tags: ["Cybersecurity", "Next.js", "FastAPI"],
  },
  {
    name: "portfolio",
    description: "Eigenständiges persönliches Portfolio mit Fokus auf Webentwicklung, Full Stack Development, Cybersecurity, OSINT, Linux/Unix, Netzwerktechnik und Open Source.",
    href: "https://github.com/linuxaaron/portfolio",
    icon: BriefcaseBusiness,
    tags: ["Portfolio", "Web Development", "Open Source"],
  },
];

export default function Projects() {
  return (
    <main className="container py-20 sm:py-28">
      <Reveal>
        <p className="font-mono text-xs text-[var(--accent)]">01 / PROJECTS</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Projekte</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
          Ausgewählte Open Source-, Security- und Portfolio-Projekte. Fokus auf nachvollziehbare Technik, saubere Umsetzung und praktische Ergebnisse.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 md:grid-cols-2">
        {projects.map((project, index) => {
          const Icon = project.icon;
          return (
            <Reveal key={project.name} delay={index * 0.06}>
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 transition hover:-translate-y-1 hover:border-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              >
                <Icon size={20} className="text-[var(--accent)]" aria-hidden="true" />
                <h2 className="mt-8 text-xl font-semibold">{project.name}</h2>
                <p className="mt-3 min-h-24 text-sm leading-6 text-[var(--muted)]">{project.description}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-[var(--surface-2)] px-2.5 py-1 font-mono text-[11px] text-[var(--muted)]">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-7 inline-flex items-center gap-2 text-sm">
                  Repository <ArrowUpRight size={15} aria-hidden="true" />
                </span>
              </a>
            </Reveal>
          );
        })}
      </div>
    </main>
  );
}
