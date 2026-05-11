"use client";

import { createContext, useContext, useEffect, useMemo } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";

export type Theme = "Dark" | "Light" | "System";

export interface Prefs {
  theme: Theme;
  reduceMotion: boolean;
  highContrast: boolean;
  largerText: boolean;
  sidebarDefault: "Expanded" | "Collapsed";
}

const DEFAULTS: Prefs = {
  theme: "Dark",
  reduceMotion: false,
  highContrast: false,
  largerText: false,
  sidebarDefault: "Collapsed",
};

interface PrefsContextValue {
  prefs: Prefs;
  setPref: <K extends keyof Prefs>(key: K, value: Prefs[K]) => void;
}

const PrefsContext = createContext<PrefsContextValue | null>(null);

export function PrefsProvider({ children }: { children: React.ReactNode }) {
  const [prefs, setPrefs] = useLocalStorage<Prefs>("o2s.prefs", DEFAULTS);

  const setPref = useMemo(
    () =>
      <K extends keyof Prefs>(key: K, value: Prefs[K]) => {
        setPrefs((prev) => ({ ...prev, [key]: value }));
      },
    [setPrefs],
  );

  useEffect(() => {
    const root = document.documentElement;
    const dark =
      prefs.theme === "Dark" ||
      (prefs.theme === "System" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    root.classList.toggle("dark", dark);
    root.classList.toggle("light", !dark);
    root.classList.toggle("high-contrast", prefs.highContrast);
    root.classList.toggle("larger-text", prefs.largerText);
    root.style.setProperty("--motion-scale", prefs.reduceMotion ? "0" : "1");
  }, [prefs.theme, prefs.highContrast, prefs.largerText, prefs.reduceMotion]);

  const value = useMemo(() => ({ prefs, setPref }), [prefs, setPref]);
  return <PrefsContext.Provider value={value}>{children}</PrefsContext.Provider>;
}

export function usePrefs() {
  const ctx = useContext(PrefsContext);
  if (!ctx) throw new Error("usePrefs must be used inside <PrefsProvider>");
  return ctx;
}
