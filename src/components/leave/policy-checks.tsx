"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, AlertTriangle, X, Info, ChevronRight } from "lucide-react";
import type { CheckSeverity, PolicyCheck } from "@/components/leave/data";

const SEVERITY: Record<CheckSeverity, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  pass: { icon: Check,          color: "text-success",     bg: "bg-success/10" },
  warn: { icon: AlertTriangle,  color: "text-warning",     bg: "bg-warning/10" },
  fail: { icon: X,              color: "text-destructive", bg: "bg-destructive/10" },
  info: { icon: Info,           color: "text-brand",       bg: "bg-brand/10" },
};

export function PolicyChecks({ checks }: { checks: PolicyCheck[] }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="space-y-1.5">
      {checks.map((c) => {
        const m = SEVERITY[c.severity];
        const Icon = m.icon;
        const isOpen = open === c.id;
        return (
          <div key={c.id} className="rounded-lg border border-border bg-surface-overlay/40">
            <button
              onClick={() => setOpen(isOpen ? null : c.id)}
              className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-surface-overlay transition-colors rounded-lg"
            >
              <div className={`size-6 shrink-0 rounded-md flex items-center justify-center ${m.bg}`}>
                <Icon className={`size-3.5 ${m.color}`} />
              </div>
              <span className="flex-1 min-w-0 text-xs text-foreground truncate">{c.label}</span>
              {c.citation && (
                <span className="text-[10px] text-muted-foreground/60 shrink-0">{c.citation}</span>
              )}
              <ChevronRight className={`size-3 text-muted-foreground/60 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden"
                >
                  <p className="px-3 pb-2.5 pt-0 text-[11px] text-muted-foreground leading-relaxed">
                    {c.detail}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
