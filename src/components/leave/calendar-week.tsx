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
  isWeekend,
  personalEntriesForDate,
  teamEntriesForDate,
  holidaysForDate,
  toISO,
  weekDays,
} from "@/components/leave/calendar-utils";

interface Props {
  anchor: Date;
  selected: Date | null;
  onSelect: (d: Date) => void;
  personalRequests: LeaveRequest[];
  teamLeaves: TeamLeave[];
  holidays: PublicHoliday[];
  showTeam: boolean;
}

export function CalendarWeek({
  anchor,
  selected,
  onSelect,
  personalRequests,
  teamLeaves,
  holidays,
  showTeam,
}: Props) {
  const days = weekDays(anchor);
  const today = new Date();

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="grid grid-cols-7">
        {days.map((d, i) => {
          const iso = toISO(d);
          const isToday = isSameDay(d, today);
          const isSelected = selected ? isSameDay(d, selected) : false;
          const weekend = isWeekend(d);

          const personal = personalEntriesForDate(personalRequests, iso);
          const team = teamEntriesForDate(teamLeaves, iso);
          const hols = holidaysForDate(holidays, iso);

          return (
            <button
              key={iso}
              onClick={() => onSelect(d)}
              className={`group relative flex flex-col text-left p-3 min-h-72 ${
                i < 6 ? "border-r border-border" : ""
              } ${weekend ? "bg-surface-overlay/40" : "bg-card"} ${
                isSelected ? "ring-2 ring-brand ring-inset" : "hover:bg-surface-overlay/30"
              } transition-colors`}
            >
              {/* Header */}
              <div className="flex items-baseline justify-between mb-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold">
                    {d.toLocaleDateString("en-IN", { weekday: "short" })}
                  </p>
                  <p
                    className={`text-2xl font-bold tabular-nums ${
                      isToday ? "text-brand" : weekend ? "text-muted-foreground/70" : "text-foreground"
                    }`}
                  >
                    {d.getDate()}
                  </p>
                </div>
                {isToday && (
                  <span className="text-[9px] uppercase tracking-wider text-brand">Today</span>
                )}
              </div>

              {/* Holidays */}
              {hols.map((h) => (
                <div
                  key={h.name}
                  className="flex items-center gap-1.5 mb-1 px-1.5 py-0.5 rounded bg-warning/10 text-[10px] text-warning"
                  title={`${h.name} · ${h.region}`}
                >
                  <span className="size-1 rounded-full bg-warning" />
                  <span className="truncate">{h.name}</span>
                </div>
              ))}

              {/* Personal */}
              <div className="space-y-1 mb-2">
                {personal.map((r) => {
                  const t = LEAVE_TYPE_MAP[r.type];
                  return (
                    <Link
                      key={r.id}
                      href={`/leave/${r.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`block px-2 py-1 rounded text-[11px] ${t.tint} ${t.color} hover:opacity-90`}
                      title={t.label}
                    >
                      <span className="font-medium">{t.shortLabel}</span>
                      <span className="ml-1 text-foreground/70">
                        {r.granularity === "FULL" ? "Full" : r.granularity === "FH" ? "AM" : r.granularity === "SH" ? "PM" : "Hourly"}
                      </span>
                      {r.status === "pending" && (
                        <span className="ml-1 text-[9px] uppercase text-warning">pend</span>
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Team */}
              {showTeam && team.length > 0 && (
                <div className="mt-auto pt-2 border-t border-border space-y-1">
                  {team.slice(0, 4).map((t) => {
                    const type = LEAVE_TYPE_MAP[t.type];
                    return (
                      <div
                        key={t.id}
                        className="flex items-center gap-1.5 text-[10px]"
                        title={`${t.personName} — ${type.label}${t.note ? ` (${t.note})` : ""}`}
                      >
                        <span
                          className={`size-4 shrink-0 rounded-full ${t.avatarColor} text-white text-[7px] font-bold flex items-center justify-center`}
                        >
                          {t.initials}
                        </span>
                        <span className="text-foreground truncate">{t.personName.split(" ")[0]}</span>
                        <span className={`ml-auto shrink-0 ${type.color}`}>{type.shortLabel}</span>
                      </div>
                    );
                  })}
                  {team.length > 4 && (
                    <p className="text-[9px] text-muted-foreground">+{team.length - 4} more</p>
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
