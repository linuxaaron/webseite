"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

// Versioned key intentionally resets the previous dark-mode default.
// New visitors start in light mode; an explicit user choice is persisted.
const THEME_STORAGE_KEY = "theme-v2";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    const isDark = stored === "dark";

    document.documentElement.classList.toggle("dark", isDark);
    setDark(isDark);
  }, []);

  function toggle() {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem(THEME_STORAGE_KEY, next ? "dark" : "light");
    setDark(next);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? "Hellen Modus aktivieren" : "Dunklen Modus aktivieren"}
      title={dark ? "Hellen Modus aktivieren" : "Dunklen Modus aktivieren"}
      className="rounded-full border border-[var(--border)] p-2 text-[var(--muted)] transition hover:text-[var(--text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]"
    >
      {dark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
