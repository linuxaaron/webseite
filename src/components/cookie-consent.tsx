"use client";

import { useEffect, useState } from "react";
import { Cookie, ShieldCheck, X } from "lucide-react";

const STORAGE_KEY = "cookie-consent-v3";

export type CookieConsentChoice = "accepted" | "rejected";

type Props = {
  openSettings?: boolean;
  onSettingsHandled?: () => void;
};

export function CookieConsent({ openSettings = false, onSettingsHandled }: Props) {
  const [visible, setVisible] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    try {
      const choice = window.localStorage.getItem(STORAGE_KEY);
      setVisible(choice === null);
      setAnalytics(choice === "accepted");
    } catch {
      setVisible(true);
    }
  }, []);

  useEffect(() => {
    if (openSettings) {
      setSettingsOpen(true);
      onSettingsHandled?.();
    }
  }, [openSettings, onSettingsHandled]);

  const saveChoice = (choice: CookieConsentChoice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // Wenn lokale Speicherung blockiert ist, gilt die Auswahl nur für diese Sitzung.
    }
    setAnalytics(choice === "accepted");
    setVisible(false);
    setSettingsOpen(false);
  };

  const saveSettings = () => saveChoice(analytics ? "accepted" : "rejected");

  if (!visible && !settingsOpen) return null;

  const dialog = settingsOpen ? (
    <aside
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-settings-title"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 p-5 shadow-2xl shadow-black/40 backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-3">
          <div className="hidden shrink-0 rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 sm:block">
            <Cookie className="text-[var(--accent)]" size={21} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="text-[var(--accent)] sm:hidden" size={18} />
              <h2 id="cookie-settings-title" className="font-semibold text-[var(--text)]">Cookie Einstellungen</h2>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Verwalte hier deine Zustimmung zu optionalen Technologien. Notwendige Technologien bleiben immer aktiv.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSettingsOpen(false)}
          aria-label="Cookie Einstellungen schließen"
          className="rounded-full p-2 text-[var(--muted)] transition hover:bg-[var(--bg)] hover:text-[var(--text)]"
        >
          <X size={18} />
        </button>
      </div>

      <div className="mt-5 grid gap-3">
        <div className="rounded-xl border border-[var(--border)] p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-medium">Notwendige Technologien</p>
              <p className="mt-1 text-xs leading-5 text-[var(--muted)]">Für grundlegende Funktionen und Sicherheit erforderlich.</p>
            </div>
            <span className="shrink-0 text-xs font-medium text-[var(--muted)]">Immer aktiv</span>
          </div>
        </div>

        <label className="flex cursor-pointer items-start justify-between gap-4 rounded-xl border border-[var(--border)] p-4">
          <span>
            <span className="block font-medium">Optionale Analyse &amp; Marketing</span>
            <span className="mt-1 block text-xs leading-5 text-[var(--muted)]">Nur aktiv, wenn du ausdrücklich zustimmst.</span>
          </span>
          <input
            type="checkbox"
            checked={analytics}
            onChange={(event) => setAnalytics(event.target.checked)}
            className="mt-1 size-4 accent-[var(--accent)]"
          />
        </label>
      </div>

      <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button type="button" onClick={() => saveChoice("rejected")} className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium transition hover:border-[var(--accent)]">
          Nur notwendige
        </button>
        <button type="button" onClick={saveSettings} className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-semibold text-black transition hover:brightness-110">
          Auswahl speichern
        </button>
      </div>
    </aside>
  ) : (
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
            Diese Website verwendet keine eigenen Werbe- oder Tracking-Cookies. Technisch notwendige Cookies können durch Hosting- und Sicherheitsdienste wie Cloudflare gesetzt werden. Optionale Analyse- oder Marketing-Technologien werden erst nach deiner ausdrücklichen Zustimmung eingesetzt.
          </p>
          <p className="mt-2 text-xs leading-5 text-[var(--muted)]">
            Du kannst optionale Technologien ablehnen. Deine Auswahl kannst du später über die Cookie-Einstellungen erneut ändern. Mehr Informationen findest du in der{" "}
            <a href="/datenschutz" className="text-[var(--accent)] hover:underline">Datenschutzerklärung</a>.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-3">
            <button type="button" onClick={() => saveChoice("rejected")} className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)]">Nur notwendige</button>
            <button type="button" onClick={() => setSettingsOpen(true)} className="inline-flex min-h-10 items-center justify-center rounded-full border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text)] transition hover:border-[var(--accent)]">Einstellungen</button>
            <button type="button" onClick={() => saveChoice("accepted")} className="inline-flex min-h-10 items-center justify-center rounded-full bg-[var(--accent)] px-5 py-2 text-sm font-medium text-black transition hover:brightness-110">Alle akzeptieren</button>
          </div>
        </div>
      </div>
    </aside>
  );

  return dialog;
}
