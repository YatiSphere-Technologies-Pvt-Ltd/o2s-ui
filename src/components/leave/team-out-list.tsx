"use client";

import { useState } from "react";
import { LEAVE_TYPE_MAP, TEAM_OUT_TODAY, TEAM_OUT_THIS_WEEK } from "@/components/leave/data";

type Range = "today" | "week";

export function TeamOutList() {
  const [range, setRange] = useState<Range>("today");
  const data = range === "today" ? TEAM_OUT_TODAY : TEAM_OUT_THIS_WEEK;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Team out</h3>
        <div className="flex gap-1 bg-secondary rounded-md p-0.5 text-[11px]">
          {(["today", "week"] as Range[]).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2 py-1 rounded transition-colors ${
                range === r
                  ? "bg-card text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {r === "today" ? "Today" : "This week"}
            </button>
          ))}
        </div>
      </div>

      {data.length === 0 ? (
        <p className="text-xs text-muted-foreground text-center py-4">Nobody&apos;s out — full crew.</p>
      ) : (
        <div className="space-y-2">
          {data.map((m) => {
            const type = LEAVE_TYPE_MAP[m.leaveType];
            return (
              <div key={m.id} className="flex items-center gap-3">
                <div
                  className={`size-8 shrink-0 rounded-full ${m.avatarColor} text-white text-[11px] font-bold flex items-center justify-center`}
                >
                  {m.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground truncate">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">
                    <span className={type.color}>{type.shortLabel}</span> · {m.modifier}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground/60 shrink-0 whitespace-nowrap">
                  {m.whenLabel}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
