"use client";

import { useCallback, useSyncExternalStore } from "react";

const subscribers = new Set<() => void>();
function subscribe(cb: () => void) {
  subscribers.add(cb);
  const onStorage = () => cb();
  if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
  return () => {
    subscribers.delete(cb);
    if (typeof window !== "undefined") window.removeEventListener("storage", onStorage);
  };
}
function notify() {
  for (const cb of subscribers) cb();
}

function readRaw(key: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parse<T>(raw: string | null, fallback: T): T {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

/**
 * Persistent state hook backed by localStorage.
 * `initial` must be referentially stable across renders (a module-level constant
 * or a memoized value) — it's used as the fallback when nothing is stored.
 */
export function useLocalStorage<T>(
  key: string,
  initial: T,
): [T, (v: T | ((prev: T) => T)) => void] {
  const getSnapshot = useCallback(() => readRaw(key), [key]);
  const getServerSnapshot = useCallback(() => null, []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = parse<T>(raw, initial);

  const set = useCallback(
    (v: T | ((prev: T) => T)) => {
      const current = parse<T>(readRaw(key), initial);
      const next = typeof v === "function" ? (v as (p: T) => T)(current) : v;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {}
      notify();
    },
    [key, initial],
  );

  return [value, set];
}
