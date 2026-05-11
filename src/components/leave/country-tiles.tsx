"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, MapPin } from "lucide-react";
import type { ComplianceBand, CountryTile } from "@/components/leave/data";

const BAND_META: Record<ComplianceBand, { label: string; tint: string; color: string; dot: string }> = {
  green: { label: "Compliant",     tint: "bg-success/10",     color: "text-success",     dot: "bg-success" },
  amber: { label: "Action soon",   tint: "bg-warning/10",     color: "text-warning",     dot: "bg-warning" },
  red:   { label: "Overdue",       tint: "bg-destructive/10", color: "text-destructive", dot: "bg-destructive" },
};

export function CountryTiles({ countries }: { countries: CountryTile[] }) {
  const [drill, setDrill] = useState<CountryTile | null>(null);
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Globe2 className="size-4 text-brand" />
        <h3 className="text-sm font-semibold text-foreground">Where we operate</h3>
        <span className="ml-auto text-[11px] text-muted-foreground">{countries.length} countries</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {countries.map((c) => {
          const b = BAND_META[c.compliance];
          return (
            <button
              key={c.code}
              onClick={() => setDrill(c)}
              className="text-left p-3 rounded-lg border border-border bg-surface-overlay/40 hover:bg-surface-overlay transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl leading-none">{c.flag}</span>
                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${b.tint} ${b.color}`}>
                  <span className={`size-1.5 rounded-full ${b.dot}`} />
                  {b.label}
                </span>
              </div>
              <p className="text-xs font-medium text-foreground">{c.name}</p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                <span className="tabular-nums">{c.headcount}</span> headcount ·{" "}
                <span className="tabular-nums">{c.onLeaveToday}</span> out today
              </p>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {drill && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-40 bg-black/50"
              onClick={() => setDrill(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full pointer-events-auto p-5">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl leading-none">{drill.flag}</span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-foreground">{drill.name}</h3>
                    <p className="text-[11px] text-muted-foreground">
                      <span className="tabular-nums">{drill.headcount}</span> headcount ·{" "}
                      <span className="tabular-nums">{drill.onLeaveToday}</span> out today
                    </p>
                  </div>
                  <span className={`ml-auto inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider ${BAND_META[drill.compliance].tint} ${BAND_META[drill.compliance].color}`}>
                    <span className={`size-1.5 rounded-full ${BAND_META[drill.compliance].dot}`} />
                    {BAND_META[drill.compliance].label}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed flex items-start gap-2">
                  <MapPin className="size-3 text-muted-foreground/60 shrink-0 mt-0.5" />
                  {drill.status}
                </p>
                <p className="text-[10px] text-muted-foreground/60 mt-4">
                  Full country drilldown coming with the Compliance module.
                </p>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setDrill(null)}
                    className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
