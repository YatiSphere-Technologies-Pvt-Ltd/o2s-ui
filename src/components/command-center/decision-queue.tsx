"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Inbox } from "lucide-react";
import { DecisionCard } from "./decision-card";
import { type Decision, type QueueFilter, filterDecisions } from "./data";

interface DecisionQueueProps {
  decisions: Decision[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  filter: QueueFilter;
  onFilterChange: (filter: QueueFilter) => void;
}

const FILTER_OPTIONS: { key: QueueFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "critical", label: "Urgent" },
  { key: "offers", label: "Offers" },
  { key: "advances", label: "Advances" },
  { key: "shortlists", label: "Shortlists" },
];

export function DecisionQueue({
  decisions,
  selectedId,
  onSelect,
  filter,
  onFilterChange,
}: DecisionQueueProps) {
  const filtered = useMemo(
    () => filterDecisions(decisions, filter),
    [decisions, filter]
  );

  const pendingCount = decisions.filter((d) => d.status === "pending").length;
  const criticalCount = decisions.filter((d) => d.status === "pending" && (d.urgency === "critical" || d.urgency === "high")).length;

  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-card/50 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 px-4 py-3 border-b border-border">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-sm font-semibold text-foreground">Decision Queue</h2>
          <div className="flex items-center gap-1.5">
            {criticalCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-destructive/15 text-destructive text-[10px] font-bold animate-pulse">
                {criticalCount}
              </span>
            )}
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-secondary text-muted-foreground text-[10px] font-bold">
              {pendingCount}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1 flex-wrap">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onFilterChange(opt.key)}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all duration-150 cursor-pointer ${
                filter === opt.key
                  ? "bg-brand-purple/15 text-brand-purple shadow-sm"
                  : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-secondary/30"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
        <AnimatePresence mode="popLayout">
          {filtered.length > 0 ? (
            filtered.map((decision) => (
              <motion.div
                key={decision.id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
              >
                <DecisionCard
                  decision={decision}
                  isSelected={selectedId === decision.id}
                  onSelect={() => onSelect(decision.id)}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 text-muted-foreground/30"
            >
              {pendingCount === 0 ? (
                <>
                  <div className="size-12 rounded-xl bg-success/10 flex items-center justify-center mb-3">
                    <Check className="size-6 text-success" />
                  </div>
                  <p className="text-xs font-medium text-success/60">All clear!</p>
                  <p className="text-[10px] text-muted-foreground/30 mt-1">No pending decisions</p>
                </>
              ) : (
                <>
                  <Inbox className="size-8 mb-2" />
                  <p className="text-xs">No decisions match this filter</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-4 py-2 border-t border-border/50">
        <p className="text-[10px] text-muted-foreground/40">
          {filtered.length} of {pendingCount} pending
        </p>
      </div>
    </div>
  );
}
