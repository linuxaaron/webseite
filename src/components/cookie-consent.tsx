"use client";

import { useEffect, useState } from "react";
import { Cookie, ShieldCheck } from "lucide-react";

const STORAGE_KEY = "cookie-consent-v3";

export type CookieConsentChoice = "accepted" | "rejected";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(STORAGE_KEY) === null);
    } catch {
      setVisible(true);
    }
  }, []);

  const saveChoice = (choice: CookieConsentChoice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Wenn lokale Speicherung blockiert ist, gilt die Auswahl nur für diese Sitzung.
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-label="Cookies & Datenschutz"
      aria-describedby="cookie-consent-description"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-2xl rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <div className="flex gap-4">
        <div className="hidden shrink-0 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 sm:block">
          <Cookie className="text-[var(--accent)]" size={21} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-[var(--accent)] sm:hidden" size={18} />
            <h2 className="font-semibold text-[var(--text)]">Cookies &amp; Datenschutz</h2>
          </div>
          <p id="cookie-consent-description" className="mt-2 text-sm leading-6 text-[var(--muted)]">
            Diese Website verwendet keine eigenen Werbe- oder Tracking-Cookies. Technisch notwendige
            Cookies können durch Hosting- und Sicherheitsdienste wie Cloudflare gesetzt werden.
            Optionale Analyse- oder Marketing-Technologien werden erst nach deiner ausdrücklichen
            Zustimmung eingesetzt.
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Du kannst optionale Technologien ablehnen. Deine Auswahl kannst du später über die
            Cookie-Einstellungen erneut ändern. Mehr Informationen findest du in der{" "}
            <a href="/datenschutz" className="text-[var(--accent)] hover:underline">
              Datenschutzerklärung
            </a>.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => saveChoice("rejected")}
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)]"
            >
              Nur notwendige
            </button>
            <a
              href="/datenschutz"
              className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)]"
            >
              Datenschutz
            </a>
            <button
              type="button"
              onClick={() => saveChoice("accepted")}
              className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-black transition hover:brightness-110"
            >
              Alle akzeptieren
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
