"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, User, FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AUDIT_TRAIL, type AuditEntry } from "@/components/legal/compliance/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

const staggerChild = {
  initial: { opacity: 0, x: -8 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

type FilterType = "all" | "filings" | "reminders" | "escalations" | "uploads";

const FILTER_PILLS: { key: FilterType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "filings", label: "Filings" },
  { key: "reminders", label: "Reminders" },
  { key: "escalations", label: "Escalations" },
  { key: "uploads", label: "Uploads" },
];

function matchesFilter(entry: AuditEntry, filter: FilterType): boolean {
  if (filter === "all") return true;
  const action = entry.action.toLowerCase();
  if (filter === "filings") return action.includes("filed") || action.includes("marked");
  if (filter === "reminders") return action.includes("reminder");
  if (filter === "escalations") return action.includes("escalat");
  if (filter === "uploads") return action.includes("upload") || entry.hasDocument;
  return true;
}

function groupByDate(entries: AuditEntry[]): Map<string, AuditEntry[]> {
  const map = new Map<string, AuditEntry[]>();
  for (const e of entries) {
    if (!map.has(e.date)) map.set(e.date, []);
    map.get(e.date)!.push(e);
  }
  return map;
}

export function AuditTab() {
  const [filter, setFilter] = useState<FilterType>("all");
  const filtered = AUDIT_TRAIL.filter((e) => matchesFilter(e, filter));
  const grouped = groupByDate(filtered);

  return (
    <motion.div {...fadeIn} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Filter pills */}
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
          {FILTER_PILLS.map((p) => (
            <button
              key={p.key}
              onClick={() => setFilter(p.key)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                filter === p.key
                  ? "bg-card text-foreground font-medium shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        {/* Export buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="size-3.5" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm">
            <Download className="size-3.5" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Array.from(grouped.entries()).map(([date, entries]) => (
          <div key={date}>
            <div className="text-xs font-semibold text-foreground mb-3">
              {date}
            </div>
            <div className="relative ml-3">
              {/* Vertical connector */}
              <div className="absolute left-3 top-0 bottom-0 border-l-2 border-border" />

              <div className="space-y-3">
                {entries.map((entry, i) => (
                  <motion.div
                    key={entry.id}
                    {...staggerChild}
                    transition={{
                      ...staggerChild.transition,
                      delay: i * 0.05,
                    }}
                    className="relative flex gap-3 pl-6"
                  >
                    {/* Dot on timeline */}
                    <div className="absolute left-[5px] top-1.5 size-3 rounded-full border-2 border-border bg-card z-10 flex items-center justify-center">
                      {entry.isAI ? (
                        <span className="text-[8px]">🤖</span>
                      ) : (
                        <span className="size-1.5 rounded-full bg-muted-foreground" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-card border border-border rounded-lg p-3 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground font-mono">
                          {entry.time}
                        </span>
                        <span className="flex items-center gap-1">
                          {entry.isAI ? (
                            <Bot className="size-3 text-destructive" />
                          ) : (
                            <User className="size-3 text-muted-foreground" />
                          )}
                          <span className="font-medium text-sm text-foreground">
                            {entry.actor}
                          </span>
                        </span>
                        {entry.hasDocument && (
                          <FileText className="size-3 text-brand" />
                        )}
                      </div>
                      <div className="text-xs">
                        <span className="text-foreground">{entry.action}</span>
                        <span className="text-muted-foreground ml-1">
                          — {entry.detail}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                          {entry.entity}
                        </span>
                        {entry.filingId && (
                          <span className="text-[10px] text-brand font-mono cursor-pointer hover:underline">
                            {entry.filingId}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-8 text-sm text-muted-foreground">
          No audit entries match this filter.
        </div>
      )}
    </motion.div>
  );
}
