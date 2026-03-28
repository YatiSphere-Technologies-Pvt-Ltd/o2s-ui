"use client";

import { motion } from "framer-motion";
import { Plus, Pencil, Copy, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CYCLE_TEMPLATES } from "@/components/settings/performance/data";

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function CyclesTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-muted-foreground max-w-xl">
          Define reusable review cycle templates with phases, timelines, and scope. Assign a
          template when launching a new cycle.
        </p>
        <Button size="sm">
          <Plus className="size-3.5" />
          New Template
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CYCLE_TEMPLATES.map((tpl, i) => (
          <motion.div
            key={tpl.id}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-card border border-border rounded-xl p-5"
          >
            {/* Name + Default badge */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-foreground">{tpl.name}</span>
              {tpl.isDefault && (
                <span className="bg-warning/10 text-warning text-[10px] font-medium rounded px-1.5 py-0.5">
                  DEFAULT
                </span>
              )}
            </div>

            {/* Meta */}
            <p className="text-xs text-muted-foreground mt-1">
              {tpl.phaseCount} phases &middot; {tpl.duration} &middot; {tpl.scope}
            </p>

            {/* Phase chain */}
            <p className="text-xs text-muted-foreground mt-2">
              {tpl.phases.join(" → ")}
            </p>

            {/* Includes as pills */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {tpl.includes.map((inc) => (
                <span
                  key={inc}
                  className="bg-secondary text-muted-foreground text-[10px] font-medium rounded px-1.5 py-0.5"
                >
                  {inc}
                </span>
              ))}
            </div>

            {/* Last used */}
            <p className="text-[11px] text-muted-foreground mt-3">
              Last used: {tpl.lastUsed}
            </p>

            {/* Actions */}
            <div className="flex items-center gap-1.5 mt-4 pt-3 border-t border-border">
              <Button variant="ghost" size="xs">
                <Pencil className="size-3" />
                Edit
              </Button>
              <Button variant="ghost" size="xs">
                <Copy className="size-3" />
                Duplicate
              </Button>
              <Button variant="ghost" size="icon-xs" className="ml-auto">
                <MoreHorizontal className="size-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
