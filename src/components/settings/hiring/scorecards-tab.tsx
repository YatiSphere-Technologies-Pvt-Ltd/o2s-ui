"use client";

import { motion } from "framer-motion";
import { Plus, Pencil, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SCORECARD_TEMPLATES } from "@/components/settings/hiring/data";

const rowVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.04, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function ScorecardsTab() {
  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-muted-foreground max-w-xl">
          Create reusable scorecards for structured interviews. Assign them to interview stages
          across jobs.
        </p>
        <Button size="sm">
          <Plus className="size-3.5" />
          New Scorecard
        </Button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Name</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Criteria</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Used By</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground">Type</th>
              <th className="px-4 py-3 text-xs font-medium text-muted-foreground text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {SCORECARD_TEMPLATES.map((sc, i) => (
              <motion.tr
                key={sc.id}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={rowVariants}
                className="border-b border-border last:border-0 hover:bg-surface-overlay transition-colors"
              >
                <td className="px-4 py-3 font-medium text-foreground">{sc.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{sc.criteriaCount} criteria</td>
                <td className="px-4 py-3 text-muted-foreground">{sc.usedByJobs} jobs</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${sc.typeColorClass}`}
                  >
                    {sc.type}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button variant="ghost" size="icon-xs">
                      <Pencil className="size-3" />
                    </Button>
                    <Button variant="ghost" size="icon-xs">
                      <MoreHorizontal className="size-3.5" />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
