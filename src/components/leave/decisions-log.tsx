"use client";

import Link from "next/link";
import { Check, X } from "lucide-react";
import type { DecisionLogEntry } from "@/components/leave/data";

export function DecisionsLog({ entries }: { entries: DecisionLogEntry[] }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">Recent decisions</h3>
      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No decisions yet.</p>
      ) : (
        <div className="space-y-3">
          {entries.slice(0, 6).map((e) => (
            <div key={e.id} className="flex items-start gap-3">
              <div className="relative">
                <div className={`size-8 shrink-0 rounded-full ${e.employeeAvatar} text-white text-[10px] font-bold flex items-center justify-center`}>
                  {e.employeeInitials}
                </div>
                <span
                  className={`absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full ring-2 ring-card flex items-center justify-center ${
                    e.decision === "approved" ? "bg-success" : "bg-destructive"
                  }`}
                >
                  {e.decision === "approved" ? (
                    <Check className="size-2 text-white" />
                  ) : (
                    <X className="size-2 text-white" />
                  )}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs text-foreground">
                    <span className="font-medium">{e.employeeName}</span>{" "}
                    <span className="text-muted-foreground">· {e.decision}</span>
                  </p>
                  <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">{e.whenLabel}</span>
                </div>
                <Link
                  href={`/leave/${e.requestId}`}
                  className="text-[11px] text-muted-foreground hover:text-brand transition-colors"
                >
                  {e.summary}
                </Link>
                {e.note && <p className="text-[11px] text-muted-foreground/80 mt-0.5">&ldquo;{e.note}&rdquo;</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
