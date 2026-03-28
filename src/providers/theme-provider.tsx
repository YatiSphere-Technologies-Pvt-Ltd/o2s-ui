"use client";

import * as React from "react";

interface ThemeProviderProps {
  children: React.ReactNode;
  attribute?: string;
  defaultTheme?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

const ThemeContext = React.createContext<{
  theme: string;
  setTheme: (theme: string) => void;
}>({ theme: "system", setTheme: () => {} });

export function useTheme() {
  return React.useContext(ThemeContext);
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState(defaultTheme);

  const resolvedTheme = React.useMemo(() => {
    if (theme === "system" && enableSystem) {
      if (typeof window === "undefined") return "dark";
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return theme;
  }, [theme, enableSystem]);

  const setTheme = React.useCallback(
    (newTheme: string) => {
      setThemeState(newTheme);
      try {
        localStorage.setItem("o2s-theme", newTheme);
      } catch {}
    },
    []
  );

  // Apply theme class to <html> element
  React.useEffect(() => {
    const root = document.documentElement;

    if (disableTransitionOnChange) {
      root.style.setProperty("transition", "none");
      // Force reflow
      void root.offsetHeight;
    }

    if (attribute === "class") {
      root.classList.remove("light", "dark");
      root.classList.add(resolvedTheme);
    } else {
      root.setAttribute(attribute, resolvedTheme);
    }

    if (disableTransitionOnChange) {
      requestAnimationFrame(() => {
        root.style.removeProperty("transition");
      });
    }
  }, [resolvedTheme, attribute, disableTransitionOnChange]);

  // Read stored theme on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("o2s-theme");
      if (stored) setThemeState(stored);
    } catch {}
  }, []);

  // Listen for system preference changes
  React.useEffect(() => {
    if (!enableSystem) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      if (theme === "system") {
        // Force re-render to pick up new resolved theme
        setThemeState("system");
      }
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [enableSystem, theme]);

  const value = React.useMemo(
    () => ({ theme, setTheme }),
    [theme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
