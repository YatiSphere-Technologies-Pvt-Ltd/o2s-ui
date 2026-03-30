"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
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

  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-card/50 overflow-hidden">
      {/* Header */}
      <div className="shrink-0 p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground">
            Decision Queue
          </h2>
          <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 rounded-full bg-destructive/10 text-destructive text-[10px] font-bold">
            {pendingCount}
          </span>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => onFilterChange(opt.key)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-medium transition-colors cursor-pointer ${
                filter === opt.key
                  ? "bg-brand-purple/15 text-brand-purple"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-2 space-y-2">
        {filtered.length > 0 ? (
          filtered.map((decision) => (
            <DecisionCard
              key={decision.id}
              decision={decision}
              isSelected={selectedId === decision.id}
              onSelect={() => onSelect(decision.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground/40">
            <p className="text-xs">No decisions match this filter</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 px-4 py-2.5 border-t border-border">
        <p className="text-[10px] text-muted-foreground/50">
          {filtered.length} of {pendingCount} pending
        </p>
      </div>
    </div>
  );
}
