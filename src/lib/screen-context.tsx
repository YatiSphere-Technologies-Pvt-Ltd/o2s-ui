"use client";

import { createContext, useContext, useMemo, useState } from "react";

export interface ScreenContext {
  module: string;
  page: string;
  recordId?: string;
  recordLabel?: string;
}

interface Value {
  screen: ScreenContext | null;
  setScreen: (s: ScreenContext | null) => void;
}

const ScreenCtx = createContext<Value | null>(null);

export function ScreenContextProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<ScreenContext | null>(null);
  const value = useMemo(() => ({ screen, setScreen }), [screen]);
  return <ScreenCtx.Provider value={value}>{children}</ScreenCtx.Provider>;
}

export function useScreen() {
  const ctx = useContext(ScreenCtx);
  if (!ctx) throw new Error("useScreen must be used inside <ScreenContextProvider>");
  return ctx;
}
