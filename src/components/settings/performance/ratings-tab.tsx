"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RATING_SCALES } from "@/components/settings/performance/data";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function RatingsTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-muted-foreground max-w-xl">
          Define rating scales used across review cycles. Each scale can have different levels,
          labels, and visual indicators.
        </p>
        <Button size="sm">
          <Plus className="size-3.5" />
          New Scale
        </Button>
      </div>

      <div className="grid gap-4">
        {RATING_SCALES.map((scale, i) => (
          <motion.div
            key={scale.id}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-card border border-border rounded-xl p-5"
          >
            {/* Name + Default badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{scale.name}</span>
              {scale.isDefault && (
                <span className="bg-warning/10 text-warning text-[10px] font-medium rounded px-1.5 py-0.5">
                  DEFAULT
                </span>
              )}
            </div>

            {/* Used in pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {scale.usedIn.map((u) => (
                <span
                  key={u}
                  className="bg-secondary text-muted-foreground text-[10px] font-medium rounded px-1.5 py-0.5"
                >
                  {u}
                </span>
              ))}
            </div>

            {/* Rating levels */}
            <div className="mt-4 space-y-2">
              {scale.levels.map((level) => (
                <div key={String(level.value)} className="flex items-start gap-3">
                  <div className={`size-2.5 rounded-full ${level.colorClass} mt-1 shrink-0`} />
                  <div className="flex items-baseline gap-2 min-w-0">
                    <span className="text-sm font-mono font-medium text-foreground w-6 shrink-0">
                      {level.value}
                    </span>
                    <span className="text-sm font-medium text-foreground">{level.label}</span>
                  </div>
                  {level.description && (
                    <span className="text-xs text-muted-foreground ml-auto shrink-0 max-w-[50%] text-right">
                      {level.description}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Display settings */}
            {scale.isDefault && (
              <div className="mt-4 pt-3 border-t border-border">
                <p className="text-xs font-medium text-muted-foreground mb-2">Display Settings</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground">Rating colors:</span>
                    <div className="flex gap-0.5 ml-1">
                      {scale.levels.map((level) => (
                        <div
                          key={String(level.value)}
                          className={`size-3 rounded-sm ${level.colorClass}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <span className="text-xs text-muted-foreground">Rounding:</span>
                    <label className="flex items-center gap-1.5 text-xs text-foreground">
                      <input
                        type="radio"
                        name="rounding"
                        defaultChecked
                        className="size-3 accent-brand"
                      />
                      Nearest 0.5
                    </label>
                    <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <input type="radio" name="rounding" className="size-3 accent-brand" />
                      Nearest 1.0
                    </label>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
