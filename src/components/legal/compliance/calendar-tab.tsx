"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  MARCH_CALENDAR,
  FILING_STATUS_CONFIG,
  type FilingStatus,
} from "@/components/legal/compliance/data";

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// March 2026 starts on Sunday (day 0 in JS, but we want Mon=0, so Sun=6)
// March 1, 2026 is a Sunday → offset = 6 (Mon-based grid)
const MARCH_START_OFFSET = 6;
const MARCH_DAYS = 31;
const TODAY = 27;

function getDayCells(): (number | null)[] {
  const cells: (number | null)[] = [];
  for (let i = 0; i < MARCH_START_OFFSET; i++) cells.push(null);
  for (let d = 1; d <= MARCH_DAYS; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const LEGEND_STATUSES: FilingStatus[] = [
  "filed",
  "overdue",
  "due_soon",
  "upcoming",
  "in_progress",
];

export function CalendarTab() {
  const [view, setView] = useState<"month" | "quarter">("month");
  const cells = getDayCells();
  const rows: (number | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    rows.push(cells.slice(i, i + 7));
  }

  const filingsMap = new Map<number, typeof MARCH_CALENDAR>();
  for (const f of MARCH_CALENDAR) {
    if (!filingsMap.has(f.day)) filingsMap.set(f.day, []);
    filingsMap.get(f.day)!.push(f);
  }

  return (
    <motion.div {...fadeIn} className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm">
            <ChevronLeft className="size-4" />
          </Button>
          <span className="text-sm font-semibold text-foreground min-w-[120px] text-center">
            March 2026
          </span>
          <Button variant="ghost" size="icon-sm">
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5">
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              view === "month"
                ? "bg-card text-foreground font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView("quarter")}
            className={`px-3 py-1 text-xs rounded-md transition-colors ${
              view === "quarter"
                ? "bg-card text-foreground font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Quarter
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-border">
          {WEEKDAYS.map((d) => (
            <div
              key={d}
              className="px-2 py-2 text-[10px] font-medium text-muted-foreground text-center uppercase tracking-wider"
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day rows */}
        {rows.map((row, ri) => (
          <div key={ri} className="grid grid-cols-7">
            {row.map((day, ci) => {
              const isToday = day === TODAY;
              const filings = day ? filingsMap.get(day) ?? [] : [];
              return (
                <div
                  key={`${ri}-${ci}`}
                  className={`border-b border-r border-border p-2 min-h-[80px] ${
                    day ? "bg-card" : "bg-secondary/30"
                  } ${isToday ? "ring-2 ring-destructive/40 ring-inset" : ""}`}
                >
                  {day && (
                    <>
                      <span
                        className={`text-xs ${
                          isToday
                            ? "text-destructive font-bold"
                            : "text-muted-foreground"
                        }`}
                      >
                        {day}
                      </span>
                      <div className="mt-1 space-y-0.5">
                        {filings.map((f, fi) => {
                          const cfg = FILING_STATUS_CONFIG[f.status];
                          return (
                            <div
                              key={fi}
                              className="flex items-center gap-1 truncate"
                            >
                              <span
                                className={`size-1.5 rounded-full shrink-0 ${cfg.dotClass}`}
                              />
                              <span className="text-[10px] text-foreground/80 truncate">
                                {f.filingName}
                              </span>
                              <span className="text-[9px] text-muted-foreground shrink-0">
                                {f.entity.split(" ").pop()}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4">
        {LEGEND_STATUSES.map((s) => {
          const cfg = FILING_STATUS_CONFIG[s];
          return (
            <div key={s} className="flex items-center gap-1.5">
              <span className={`size-2 rounded-full ${cfg.dotClass}`} />
              <span className="text-xs text-muted-foreground">{cfg.label}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
