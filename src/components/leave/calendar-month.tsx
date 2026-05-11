"use client";

import Link from "next/link";
import {
  LEAVE_TYPE_MAP,
  type LeaveRequest,
  type PublicHoliday,
  type TeamLeave,
} from "@/components/leave/data";
import {
  isSameDay,
  isSameMonth,
  isWeekend,
  monthGridDays,
  personalEntriesForDate,
  teamEntriesForDate,
  holidaysForDate,
  toISO,
} from "@/components/leave/calendar-utils";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  anchor: Date;
  selected: Date | null;
  onSelect: (d: Date) => void;
  personalRequests: LeaveRequest[];
  teamLeaves: TeamLeave[];
  holidays: PublicHoliday[];
  showTeam: boolean;
}

export function CalendarMonth({
  anchor,
  selected,
  onSelect,
  personalRequests,
  teamLeaves,
  holidays,
  showTeam,
}: Props) {
  const days = monthGridDays(anchor);
  const today = new Date();

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 border-b border-border bg-surface-overlay/40">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`px-2 py-2 text-[10px] uppercase tracking-wider font-semibold ${
              i >= 5 ? "text-muted-foreground/50" : "text-muted-foreground/80"
            }`}
          >
            {d}
          </div>
        ))}
      </div>

      {/* 6 × 7 grid */}
      <div className="grid grid-cols-7 grid-rows-6">
        {days.map((d) => {
          const iso = toISO(d);
          const inMonth = isSameMonth(d, anchor);
          const isToday = isSameDay(d, today);
          const isSelected = selected ? isSameDay(d, selected) : false;
          const weekend = isWeekend(d);

          const personal = personalEntriesForDate(personalRequests, iso);
          const team = teamEntriesForDate(teamLeaves, iso);
          const hols = holidaysForDate(holidays, iso);
          const isHoliday = hols.length > 0;

          return (
            <button
              key={iso}
              onClick={() => onSelect(d)}
              className={`group relative min-h-24 text-left p-1.5 border-r border-b border-border last-in-row:border-r-0 transition-colors ${
                inMonth ? "bg-card" : "bg-surface-overlay/30"
              } ${isSelected ? "ring-2 ring-brand ring-inset" : "hover:bg-surface-overlay/50"}`}
            >
              {/* Date number */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center justify-center min-w-5 h-5 px-1 rounded-full text-[11px] font-medium tabular-nums ${
                    isToday
                      ? "bg-brand text-brand-foreground"
                      : !inMonth
                      ? "text-muted-foreground/40"
                      : weekend
                      ? "text-muted-foreground/60"
                      : "text-foreground"
                  }`}
                >
                  {d.getDate()}
                </span>
                {isHoliday && (
                  <span
                    className="text-[9px] text-warning truncate max-w-20"
                    title={hols.map((h) => h.name).join(", ")}
                  >
                    {hols[0].name}
                  </span>
                )}
              </div>

              {/* Personal leave bars */}
              <div className="mt-1 space-y-0.5">
                {personal.slice(0, 2).map((r) => {
                  const t = LEAVE_TYPE_MAP[r.type];
                  return (
                    <Link
                      key={r.id}
                      href={`/leave/${r.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${t.tint} ${t.color} hover:opacity-90`}
                      title={`${t.label}${r.reason ? ` — ${r.reason}` : ""}`}
                    >
                      <span className="truncate">{t.shortLabel}</span>
                      {r.status === "pending" && (
                        <span className="ml-auto text-[8px] uppercase tracking-wider text-warning shrink-0">pend</span>
                      )}
                    </Link>
                  );
                })}
                {personal.length > 2 && (
                  <p className="text-[9px] text-muted-foreground px-1">
                    +{personal.length - 2} more
                  </p>
                )}
              </div>

              {/* Team-out avatars */}
              {showTeam && team.length > 0 && (
                <div className="absolute bottom-1 right-1 flex -space-x-1.5">
                  {team.slice(0, 3).map((t) => (
                    <span
                      key={t.id}
                      className={`size-4 rounded-full ${t.avatarColor} ring-1 ring-card text-white text-[7px] font-bold flex items-center justify-center`}
                      title={`${t.personName} — ${LEAVE_TYPE_MAP[t.type].shortLabel}${t.note ? ` (${t.note})` : ""}`}
                    >
                      {t.initials}
                    </span>
                  ))}
                  {team.length > 3 && (
                    <span className="size-4 rounded-full bg-secondary ring-1 ring-card text-muted-foreground text-[7px] font-bold flex items-center justify-center">
                      +{team.length - 3}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

