"use client";

import { ExternalLink } from "lucide-react";
import type { WorkItem, WorkPriority, WorkState } from "@/components/leave/data";

const PRIORITY_META: Record<WorkPriority, { color: string; tint: string }> = {
  P0: { color: "text-destructive",      tint: "bg-destructive/10" },
  P1: { color: "text-warning",          tint: "bg-warning/10" },
  P2: { color: "text-brand",            tint: "bg-brand/10" },
  P3: { color: "text-muted-foreground", tint: "bg-secondary" },
};

const STATE_LABEL: Record<WorkState, string> = {
  in_progress: "In progress",
  review:      "In review",
  blocked:     "Blocked",
  done:        "Done",
};

const STATE_COLOR: Record<WorkState, string> = {
  in_progress: "text-brand",
  review:      "text-warning",
  blocked:     "text-destructive",
  done:        "text-success",
};

function fmtDue(iso: string, leaveStartISO: string, leaveEndISO: string): { label: string; danger: boolean } {
  const dueLabel = new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const dueDuringLeave = iso >= leaveStartISO && iso <= leaveEndISO;
  const dueJustBefore = (() => {
    const due = new Date(iso);
    const start = new Date(leaveStartISO);
    const days = Math.round((start.getTime() - due.getTime()) / 86400000);
    return days >= 0 && days <= 2;
  })();
  return {
    label: dueDuringLeave ? `Due ${dueLabel} · during leave` : dueJustBefore ? `Due ${dueLabel} · day before leave` : `Due ${dueLabel}`,
    danger: dueDuringLeave,
  };
}

export function OpenWorkList({
  items,
  leaveStartISO,
  leaveEndISO,
}: {
  items: WorkItem[];
  leaveStartISO: string;
  leaveEndISO: string;
}) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Open work</h3>
        <span className="text-[11px] text-muted-foreground">From Jira / Linear</span>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No open work tracked for this teammate.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((w) => {
            const p = PRIORITY_META[w.priority];
            const due = fmtDue(w.dueISO, leaveStartISO, leaveEndISO);
            return (
              <li
                key={w.id}
                className={`flex items-start gap-3 p-2.5 rounded-lg border ${
                  due.danger ? "border-destructive/30 bg-destructive/5" : "border-border bg-surface-overlay/40"
                }`}
              >
                <span className={`shrink-0 inline-flex items-center justify-center min-w-7 h-5 px-1.5 rounded text-[10px] font-bold ${p.color} ${p.tint}`}>
                  {w.priority}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-foreground leading-snug">
                    <span className="font-mono text-[10px] text-muted-foreground/80 mr-1.5">{w.id}</span>
                    {w.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-[10px]">
                    <span className={STATE_COLOR[w.state]}>{STATE_LABEL[w.state]}</span>
                    <span className="text-muted-foreground">·</span>
                    <span className={due.danger ? "text-destructive" : "text-muted-foreground"}>
                      {due.label}
                    </span>
                  </div>
                </div>
                <button
                  className="p-1 text-muted-foreground/60 hover:text-foreground transition-colors shrink-0"
                  aria-label="Open ticket"
                  title={`Open ${w.source}`}
                >
                  <ExternalLink className="size-3" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
