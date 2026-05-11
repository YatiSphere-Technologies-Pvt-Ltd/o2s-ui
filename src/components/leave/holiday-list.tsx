"use client";

import { CalendarDays } from "lucide-react";
import { UPCOMING_HOLIDAYS } from "@/components/leave/data";

function dayParts(iso: string): { day: string; month: string; weekday: string } {
  const d = new Date(iso);
  return {
    day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
    weekday: d.toLocaleDateString("en-IN", { weekday: "short" }),
  };
}

export function HolidayList() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="size-4 text-brand" />
        <h3 className="text-sm font-semibold text-foreground">Upcoming holidays</h3>
      </div>
      <div className="space-y-2">
        {UPCOMING_HOLIDAYS.map((h) => {
          const { day, month, weekday } = dayParts(h.date);
          return (
            <div key={h.date + h.name} className="flex items-center gap-3">
              <div className="size-10 shrink-0 rounded-md border border-border bg-secondary/40 flex flex-col items-center justify-center">
                <span className="text-[8px] uppercase tracking-wider text-muted-foreground">{month}</span>
                <span className="text-xs font-bold text-foreground leading-none">{day}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {h.name}
                  {h.optional && (
                    <span className="ml-1.5 text-[9px] uppercase tracking-wider text-brand-purple">Opt</span>
                  )}
                </p>
                <p className="text-[10px] text-muted-foreground">{weekday} · {h.region}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
