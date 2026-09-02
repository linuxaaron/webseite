import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Terminal, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Essential Linux Commands for Cybersecurity Specialists | Joscha Schmidt",
  description: "Technischer Beitrag von Joscha Schmidt über Linux Befehle für Cybersecurity, Netzwerkanalyse, Incident Response, Forensik und System Hardening.",
  alternates: { canonical: "/blog/essential-linux-commands-cybersecurity" },
};

const sections = [
  { title: "Netzwerkanalyse", text: "ss, netstat und tcpdump liefern Sichtbarkeit über Verbindungen, offene Ports und Paketverkehr. Besonders nützlich ist die Kombination aus Socket-, Prozess- und Paketinformationen, um verdächtige Verbindungen einem Prozess zuzuordnen." },
  { title: "Prozess- und Systemanalyse", text: "ps, top/htop und lsof helfen dabei, Prozesse, Ressourcenverbrauch, offene Dateien und Netzwerkverbindungen zu untersuchen. Auffällige CPU-Auslastung kann beispielsweise ein Indikator für unerwünschte Mining-Aktivität sein." },
  { title: "Dateisystem und Forensik", text: "find, grep, stat und sha256sum unterstützen die Suche nach kürzlich veränderten Dateien, ungewöhnlichen Berechtigungen und Integritätsabweichungen. Forensische Images sollten möglichst read-only analysiert und über Hashwerte dokumentiert werden." },
  { title: "Logs und Incident Response", text: "journalctl, tail, awk und grep ermöglichen die Korrelation von Authentifizierungs-, System- und Prozessereignissen. Zeitlinien können helfen, Login-Versuche, neue Benutzer, geänderte Dateien und Netzwerkaktivität in einen gemeinsamen Kontext zu bringen." },
  { title: "Benutzer, SSH und Berechtigungen", text: "getent, last, chage, chmod, chown und sshd-Konfigurationsprüfungen unterstützen Audits von Konten, Berechtigungen und Remote-Zugängen. Besonders wichtig sind unnötige Root-Rechte, schwache SSH-Einstellungen und unerwartete Benutzerkonten." },
  { title: "System-Hardening", text: "Die Vorlage behandelt unter anderem Kernel-Parameter, unnötige Dienste, Firewall-Regeln und sichere Dateiberechtigungen. Änderungen an produktiven Systemen sollten vorher getestet und mit einer Rückfallstrategie versehen werden." },
];

export default function LinuxCybersecurityPost() {
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Essential Linux Commands for Cybersecurity Specialists",
    datePublished: "2026-08-08",
    dateModified: "2026-08-08",
    author: { "@type": "Person", "@id": "https://www.joschaschmidt.com/#person", name: "Joscha Schmidt", url: "https://www.joschaschmidt.com/ueber-mich" },
    publisher: { "@type": "Person", "@id": "https://www.joschaschmidt.com/#person", name: "Joscha Aaron Schmidt", url: "https://www.joschaschmidt.com" },
    mainEntityOfPage: "https://www.joschaschmidt.com/blog/essential-linux-commands-cybersecurity",
    inLanguage: "de-DE",
  };

  return <main className="container py-20 sm:py-28"><article className="mx-auto max-w-4xl"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} /><Link href="/blog" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)]"><ArrowLeft size={15}/> Zurück zum Blog</Link><header className="mt-10 border-b border-[var(--border)] pb-10"><div className="flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--muted)]"><span>08.08.2026</span><span>·</span><span className="text-[var(--accent)]">Linux · Cybersecurity</span></div><h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-6xl">Essential Linux Commands for Cybersecurity Specialists</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">Linux ist für Security Analysen besonders wertvoll, weil die Kommandozeile direkten Zugriff auf Netzwerk-, Prozess-, Datei- und Systeminformationen ermöglicht.</p><p className="mt-5 text-sm text-[var(--muted)]">Veröffentlicht von <Link href="/ueber-mich" className="font-medium text-[var(--accent)] hover:underline">Joscha Schmidt</Link></p></header><div className="mt-10 grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"><Terminal size={20} className="text-[var(--accent)]"/><h2 className="mt-6 font-semibold">Command Line als Analyseebene</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Der Leitfaden ordnet Security Kommandos in Netzwerk-, Prozess-, Dateisystem-, Log-, Benutzer- und Systemebenen ein.</p></div><div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6"><ShieldCheck size={20} className="text-[var(--accent)]"/><h2 className="mt-6 font-semibold">Defensive Anwendung</h2><p className="mt-3 text-sm leading-6 text-[var(--muted)]">Die Beispiele sind auf Analyse, Incident Response, Forensik und Hardening ausgerichtet und sollten nur auf eigenen oder ausdrücklich autorisierten Systemen eingesetzt werden.</p></div></div><div className="mt-12 space-y-5">{sections.map((section,i)=><section key={section.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7"><p className="font-mono text-xs text-[var(--accent)]">0{i+1}</p><h2 className="mt-3 text-2xl font-semibold">{section.title}</h2><p className="mt-3 leading-7 text-[var(--muted)]">{section.text}</p></section>)}</div><section className="mt-12 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-7"><h2 className="text-2xl font-semibold">Praxis und Sicherheit</h2><p className="mt-4 leading-7 text-[var(--muted)]">Der zugrunde liegende Leitfaden betont ressourcenschonendes Arbeiten mit nice, ionice, timeout und ulimit, read only Verfahren bei forensischen Untersuchungen, Logging der ausgeführten Befehle sowie Tests außerhalb von Produktionssystemen. Gerade invasive Befehle wie dd, mount, iptables oder Änderungen an sysctl Parametern können Systeme beeinflussen und sollten daher bewusst eingesetzt werden.</p></section><footer className="mt-12 border-t border-[var(--border)] pt-8 text-sm text-[var(--muted)]"><p>Grundlage dieses Blogbeitrags ist der bereitgestellte Leitfaden <strong>„Essential Linux Commands for Cybersecurity Specialists“</strong>. Die vollständige Befehls- und Beispielsammlung befindet sich im PDF.</p></footer></article></main>;
}
