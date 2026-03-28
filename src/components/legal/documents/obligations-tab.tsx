"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight, Sparkles, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  OBLIGATIONS,
  OBL_STATUS_CONFIG,
  type Obligation,
  type ObligationStatus,
} from "@/components/legal/documents/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

const OBL_METRICS = [
  { label: "Active", value: "6" },
  { label: "Due This Month", value: "3" },
  { label: "Overdue", value: "2" },
  { label: "Completed", value: "45" },
];

function directionBadge(direction: Obligation["direction"]) {
  switch (direction) {
    case "ours":
      return (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-brand/10 text-brand">
          Ours
        </span>
      );
    case "theirs":
      return (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-warning/10 text-warning">
          Theirs
        </span>
      );
    case "mutual":
      return (
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium bg-brand-purple/10 text-brand-purple">
          Mutual
        </span>
      );
  }
}

function dueDateColor(status: ObligationStatus): string {
  if (status === "overdue") return "text-destructive";
  return "text-foreground";
}

export function ObligationsTab() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Metric Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {OBL_METRICS.map((m) => (
          <div
            key={m.label}
            className="bg-card border border-border rounded-xl px-4 py-3"
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {m.label}
            </div>
            <div className="text-lg font-bold text-foreground mt-0.5">
              {m.value}
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-muted-foreground text-xs">
              <th className="px-4 py-3 text-left font-medium">Obligation</th>
              <th className="px-4 py-3 text-left font-medium">Type</th>
              <th className="px-4 py-3 text-left font-medium">Direction</th>
              <th className="px-4 py-3 text-left font-medium">Due Date</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Assigned To</th>
              <th className="px-4 py-3 text-left font-medium">AI</th>
              <th className="px-4 py-3 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {OBLIGATIONS.map((obl) => {
              const statusCfg = OBL_STATUS_CONFIG[obl.status];
              const isOverdue = obl.status === "overdue";
              const isCompleted = obl.status === "completed";
              const isExpanded = expanded === obl.id;

              return (
                <React.Fragment key={obl.id}>
                  <tr
                    className={`border-b border-border cursor-pointer transition-colors hover:bg-surface-overlay ${
                      isOverdue
                        ? "bg-destructive/5 border-l-[3px] border-l-destructive"
                        : ""
                    } ${isCompleted ? "text-muted-foreground/60" : ""}`}
                    onClick={() =>
                      setExpanded(isExpanded ? null : obl.id)
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {isExpanded ? (
                          <ChevronDown className="size-3 text-muted-foreground shrink-0" />
                        ) : (
                          <ChevronRight className="size-3 text-muted-foreground shrink-0" />
                        )}
                        <div>
                          <div
                            className={`font-medium text-sm ${
                              isCompleted
                                ? "text-muted-foreground/60"
                                : "text-foreground"
                            }`}
                          >
                            {obl.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {obl.contract}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        {obl.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">{directionBadge(obl.direction)}</td>
                    <td
                      className={`px-4 py-3 text-xs font-medium ${dueDateColor(obl.status)}`}
                    >
                      {obl.dueDate}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-xs">
                        <span
                          className={`size-1.5 rounded-full ${statusCfg.dotClass}`}
                        />
                        <span className={statusCfg.textClass}>
                          {statusCfg.label}
                        </span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">
                      {obl.assignedTo}
                    </td>
                    <td className="px-4 py-3">
                      {obl.aiExtracted ? (
                        <Sparkles className="size-3.5 text-brand-purple" />
                      ) : (
                        <span className="text-muted-foreground text-[10px]">
                          —
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Button variant="ghost" size="icon-xs">
                        <MoreHorizontal className="size-3.5" />
                      </Button>
                    </td>
                  </tr>
                  {isExpanded && obl.sourceClause && (
                    <tr>
                      <td colSpan={8} className="px-6 py-4 border-b border-border">
                        <AnimatePresence>
                          <motion.div {...fadeIn}>
                            <div className="bg-secondary rounded-lg p-3 text-xs italic text-muted-foreground">
                              &ldquo;{obl.sourceClause}&rdquo;
                            </div>
                          </motion.div>
                        </AnimatePresence>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
