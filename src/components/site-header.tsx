"use client";

import { Github, Instagram, Menu, Music2, Newspaper, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";

const links = [
  ["Projekte", "/projekte"],
  ["Blog", "/blog"],
  ["Cyber News", "/news"],
  ["Shop", "/shop"],
  ["Audit & Vortrag", "/buchung"],
  ["Über mich", "/ueber-mich"],
  ["Kontakt", "/kontakt"],
] as const;

function isActivePath(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function NavigationIcon({ href, size }: { href: string; size: number }) {
  if (href === "/news") return <Newspaper size={size} aria-hidden="true" />;
  if (href === "/shop") return <ShoppingBag size={size} aria-hidden="true" />;
  return null;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--bg)]/85 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4 sm:gap-6">
        <Link href="/" aria-label="Joscha Aaron Schmidt – Startseite" className="inline-flex min-w-0 items-center gap-2 font-semibold tracking-tight">
          <Image src="/sunflower-logo.png" alt="" width={36} height={36} priority className="size-9 shrink-0 object-contain" />
          <span className="truncate">Joscha Aaron Schmidt</span>
        </Link>

        <nav aria-label="Hauptnavigation" className="hidden items-center gap-6 text-sm text-[var(--muted)] md:flex">
          {links.map(([label, href]) => {
            const active = isActivePath(pathname, href);
            return (
              <Link key={href} href={href} aria-current={active ? "page" : undefined} className={`inline-flex items-center gap-1.5 rounded-sm transition hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${active ? "text-[var(--accent)]" : ""}`}>
                <NavigationIcon href={href} size={14} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <a href="https://github.com/linuxaaron" target="_blank" rel="noopener noreferrer" aria-label="GitHub Profil" className="hidden rounded-full border border-[var(--border)] p-2 text-[var(--muted)] hover:text-[var(--text)] sm:block"><Github size={16} /></a>
          <a href="https://www.instagram.com/linux_aaron/" target="_blank" rel="noreferrer" aria-label="Instagram" className="hidden rounded-full border border-[var(--border)] p-2 text-[var(--muted)] hover:text-[var(--text)] sm:block"><Instagram size={16} /></a>
          <a href="https://www.tiktok.com/@linux_aaron" target="_blank" rel="noreferrer" aria-label="TikTok" className="hidden rounded-full border border-[var(--border)] p-2 text-[var(--muted)] hover:text-[var(--text)] sm:block"><Music2 size={16} /></a>
          <ThemeToggle />
          <button type="button" onClick={() => setOpen((value) => !value)} className="rounded-full border border-[var(--border)] p-2 md:hidden" aria-label={open ? "Navigation schließen" : "Navigation öffnen"} aria-expanded={open} aria-controls="mobile-navigation">
            {open ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-navigation" aria-label="Mobile Hauptnavigation" className="border-t border-[var(--border)] px-4 py-4 md:hidden">
          <div className="container flex flex-col gap-4 text-sm text-[var(--muted)]">
            {links.map(([label, href]) => {
              const active = isActivePath(pathname, href);
              return (
                <Link key={href} href={href} onClick={() => setOpen(false)} aria-current={active ? "page" : undefined} className={`inline-flex items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)] ${active ? "text-[var(--accent)]" : ""}`}>
                  <NavigationIcon href={href} size={15} />
                  {label}
                </Link>
              );
            })}
            <div className="flex gap-5 border-t border-[var(--border)] pt-4">
              <a href="https://github.com/linuxaaron" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://www.instagram.com/linux_aaron/" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://www.tiktok.com/@linux_aaron" target="_blank" rel="noreferrer">TikTok</a>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
