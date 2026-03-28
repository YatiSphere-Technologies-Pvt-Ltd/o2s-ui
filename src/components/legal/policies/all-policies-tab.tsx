"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Table2, ClipboardList, Eye, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  POLICIES,
  STATUS_CONFIG,
  REVIEW_STATUS_CONFIG,
  ackBarColor,
  type Policy,
} from "@/components/legal/policies/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

function StatusBadge({ status }: { status: Policy["status"] }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.bgClass} ${cfg.textClass}`}
    >
      <span className={`size-1.5 rounded-full ${cfg.dotClass}`} />
      {cfg.label}
    </span>
  );
}

function ReviewBadge({ status }: { status: Policy["reviewStatus"] }) {
  const cfg = REVIEW_STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${cfg.bgClass} ${cfg.colorClass}`}
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}

function AckBar({ rate }: { rate: number }) {
  const color = ackBarColor(rate);
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 flex-1 rounded-full bg-secondary">
        <div
          className={`h-1.5 rounded-full ${color}`}
          style={{ width: `${rate}%` }}
        />
      </div>
      <span className="text-[10px] text-muted-foreground font-medium">
        {rate}%
      </span>
    </div>
  );
}

function PolicyCard({ policy }: { policy: Policy }) {
  const isLowAck = policy.ackRequired && policy.ackRate < 60;

  return (
    <div
      className={`bg-card border border-border rounded-xl p-5 space-y-3 ${
        isLowAck ? "border-l-[3px] border-l-destructive" : ""
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <ClipboardList className="size-4 text-muted-foreground shrink-0" />
          <span className="font-semibold text-sm truncate">{policy.title}</span>
        </div>
        <span className="text-[10px] bg-secondary text-muted-foreground rounded-full px-2 py-0.5 shrink-0">
          {policy.categoryLabel}
        </span>
      </div>

      {/* Status + Version */}
      <div className="flex items-center gap-2">
        <StatusBadge status={policy.status} />
        <span className="text-[10px] text-muted-foreground bg-secondary rounded-full px-1.5 py-0.5">
          v{policy.currentVersion}
        </span>
      </div>

      {/* Entities */}
      <div className="flex flex-wrap gap-1">
        {policy.entities.map((e) => (
          <span
            key={e}
            className="text-[10px] bg-secondary text-muted-foreground rounded-full px-2 py-0.5"
          >
            {e}
          </span>
        ))}
      </div>

      {/* Ack Progress */}
      {policy.ackRequired && (
        <div className="space-y-1">
          <AckBar rate={policy.ackRate} />
          {policy.ackStats.overdue > 0 && (
            <div className="text-xs text-destructive">
              ⚠ {policy.ackStats.overdue} overdue ack.
            </div>
          )}
        </div>
      )}

      {/* Review */}
      <div className="flex items-center justify-between">
        <ReviewBadge status={policy.reviewStatus} />
        <span className="text-xs text-muted-foreground">{policy.owner}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button variant="outline" size="xs">
          <Eye className="size-3" />
          View
        </Button>
        <Button variant="outline" size="xs">
          <Send className="size-3" />
          Distribute
        </Button>
      </div>
    </div>
  );
}

export function AllPoliciesTab() {
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  return (
    <motion.div {...fadeIn} className="space-y-4">
      {/* View toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {POLICIES.length} policies
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
          <button
            onClick={() => setViewMode("cards")}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "cards"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="size-3.5" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-1.5 rounded-md transition-colors ${
              viewMode === "table"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Table2 className="size-3.5" />
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === "cards" ? (
          <motion.div
            key="cards"
            {...fadeIn}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          >
            {POLICIES.map((p) => (
              <PolicyCard key={p.id} policy={p} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="table"
            {...fadeIn}
            className="bg-card border border-border rounded-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Title
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Category
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Version
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Entities
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Ack Rate
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Review
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Owner
                    </th>
                    <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {POLICIES.map((p) => {
                    const isLowAck = p.ackRequired && p.ackRate < 60;
                    return (
                      <tr
                        key={p.id}
                        className={`border-b border-border hover:bg-secondary/50 transition-colors ${
                          isLowAck
                            ? "border-l-[3px] border-l-destructive"
                            : ""
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="font-medium text-foreground">
                            {p.title}
                          </div>
                          <div className="text-[10px] text-muted-foreground font-mono">
                            {p.id}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs">
                          {p.categoryLabel}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={p.status} />
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          v{p.currentVersion}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-1">
                            {p.entities.map((e) => (
                              <span
                                key={e}
                                className="text-[10px] bg-secondary rounded-full px-1.5 py-0.5"
                              >
                                {e}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 min-w-30">
                          {p.ackRequired ? (
                            <AckBar rate={p.ackRate} />
                          ) : (
                            <span className="text-[10px] text-muted-foreground">
                              N/A
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <ReviewBadge status={p.reviewStatus} />
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {p.owner}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon-xs">
                              <Eye className="size-3" />
                            </Button>
                            <Button variant="ghost" size="icon-xs">
                              <Send className="size-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
