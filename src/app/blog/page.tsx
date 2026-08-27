import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Security Blog | Linux, Cybersecurity, OSINT & Web Security",
  description: "Technische Beiträge zu Linux, Cybersecurity, OSINT, Web Security, DFIR und Incident Response von Joscha Aaron Schmidt.",
  alternates: { canonical: "/blog" },
  openGraph: { title: "Security Blog | Joscha Aaron Schmidt", description: "Technische Beiträge zu Linux, Cybersecurity, OSINT, Web Security, DFIR und Incident Response.", url: "https://www.joschaschmidt.com/blog", type: "website" },
  twitter: { card: "summary_large_image", title: "Security Blog | Linux, Cybersecurity, OSINT & Web Security", description: "Technische Beiträge zu Linux, Cybersecurity, OSINT, Web Security, DFIR und Incident Response von Joscha Aaron Schmidt." },
};

const posts = [
  { slug: "welches-betriebssystem-empfehle-ich", title: "Welches Betriebssystem empfehle ich?", date: "2026-08-27", category: "Linux · BSD · Cybersecurity", excerpt: "Warum ich kein Betriebssystem pauschal empfehle und welche Systeme ich je nach Einsatzgebiet bevorzuge." },
  { slug: "vpn-empfehlungen-proton-mullvad", title: "Meine VPN-Empfehlungen: Proton VPN und Mullvad VPN", date: "2026-08-26", category: "VPN · Datenschutz · Cybersecurity", excerpt: "Warum ich Proton VPN und Mullvad VPN empfehle – mit Fokus auf No-Logs, unabhängige Audits, Datensparsamkeit und nachvollziehbare Sicherheitsversprechen." },
  { slug: "hardware-geldmacherei-it-einsteiger", title: "Braucht man wirklich 64 oder 128 GB RAM? Wenn IT-Hardware zur Geldmacherei wird", date: "2026-08-09", category: "Hardware · Linux · IT-Einstieg", excerpt: "Warum man für den Einstieg in die IT nicht automatisch High-End-Hardware braucht – und weshalb ein günstiger Rechner oft das bessere Lernwerkzeug ist." },
  { slug: "burp-suite-nuclei-websecurity", title: "Burp Suite & Nuclei: Zwei Werkzeuge für moderne Web-Security-Analysen", date: "2026-08-09", category: "Web Security · Burp Suite · Nuclei", excerpt: "Wie Burp Suite bei der interaktiven HTTP-Analyse und Nuclei bei wiederholbaren Checks helfen – und warum beide Ergebnisse manuell geprüft werden müssen." },
  { slug: "essential-linux-commands-cybersecurity", title: "Linux für Cybersecurity: Befehle, Analyse & Incident Response", date: "2026-08-09", category: "Linux · Cybersecurity · DFIR", excerpt: "Ein Praxisbeitrag zu Netzwerkdiagnose, Prozessanalyse, Forensik, Log-Analyse, Hardening und strukturierter Incident Response." },
  { slug: "osint-webanalyse", title: "OSINT bei der technischen Webanalyse", date: "2026-08-08", category: "OSINT", excerpt: "Welche öffentlich zugänglichen Informationen sich bei einer technischen Webanalyse sinnvoll miteinander verbinden lassen." },
];

export default function Blog() {
  return <main className="container py-20 sm:py-28"><Reveal><p className="font-mono text-xs text-[var(--accent)]">02 / BLOG</p><h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-6xl">Security Blog</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">Technische Notizen und praktische Beiträge zu OSINT, Web Security, Linux, DFIR und Incident Response – mit Fokus auf nachvollziehbare Beispiele.</p></Reveal><Reveal><a href="/news" className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-[var(--accent)]/50 bg-[var(--surface)] p-5 transition hover:border-[var(--accent)]"><div><p className="font-mono text-xs text-[var(--accent)]">LIVE · RSS</p><h2 className="mt-2 text-xl font-semibold">Cyber News</h2><p className="mt-1 text-sm text-[var(--muted)]">Aktuelle Security-News aus RSS-Feeds direkt auf der Website.</p></div><ArrowUpRight className="shrink-0 text-[var(--accent)]" size={20}/></a></Reveal><div className="mt-8 space-y-4">{posts.map((post,i)=><Reveal key={post.slug} delay={i*.06}><a href={`/blog/${post.slug}`} className="block rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7 transition hover:-translate-y-0.5 hover:border-[var(--accent)]"><div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--muted)]"><span>{post.date}</span><span>·</span><span className="text-[var(--accent)]">{post.category}</span></div><h2 className="mt-4 text-2xl font-semibold">{post.title}</h2><p className="mt-3 max-w-2xl leading-7 text-[var(--muted)]">{post.excerpt}</p><span className="mt-5 inline-block text-sm text-[var(--accent)]">Artikel lesen →</span></a></Reveal>)}</div></main>;
}
