"use client";

import { useMemo } from "react";
import {
  LEAVE_TYPE_MAP,
  TEAM_LEAVES,
  type TeamLeave,
  type LeaveTypeKey,
} from "@/components/leave/data";
import {
  addDays,
  dateInRange,
  isWeekend,
  toISO,
} from "@/components/leave/calendar-utils";

interface Props {
  startISO: string;
  endISO: string;
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  employeeAvatar: string;
  type: LeaveTypeKey;
}

/**
 * A compact strip showing the 7 days around the request range, with the
 * requesting employee at the top and any teammates also out below them.
 */
export function TeamCalendarOverlay({
  startISO,
  endISO,
  employeeId,
  employeeName,
  employeeInitials,
  employeeAvatar,
  type,
}: Props) {
  // Show: 1 day before → request range → 1 day after, capped at 9 days.
  const days = useMemo(() => {
    const start = new Date(startISO);
    const end = new Date(endISO);
    const padded = addDays(start, -1);
    const len = Math.min(9, Math.round((end.getTime() - start.getTime()) / 86400000) + 3);
    return Array.from({ length: len }, (_, i) => addDays(padded, i));
  }, [startISO, endISO]);

  // Pick teammates with at least one overlapping leave in the window.
  const teammates = useMemo(() => {
    const inWindow = (l: TeamLeave) =>
      days.some((d) => dateInRange(toISO(d), l.startDate, l.endDate));
    const ids = new Set<string>();
    TEAM_LEAVES.filter((l) => l.personId !== employeeId && inWindow(l)).forEach((l) => ids.add(l.personId));
    return Array.from(ids).map((id) => TEAM_LEAVES.find((l) => l.personId === id)!);
  }, [days, employeeId]);

  const requesterType = LEAVE_TYPE_MAP[type];

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Team calendar overlay</h3>
        <p className="text-[11px] text-muted-foreground">
          {teammates.length} teammate{teammates.length !== 1 ? "s" : ""} out in this window
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="grid gap-px bg-border rounded-md overflow-hidden min-w-fit" style={{ gridTemplateColumns: `min-content repeat(${days.length}, minmax(36px, 1fr))` }}>
          {/* Header row: blank corner + day labels */}
          <div className="bg-card px-3 py-1.5" />
          {days.map((d) => {
            const inRange = dateInRange(toISO(d), startISO, endISO);
            const weekend = isWeekend(d);
            return (
              <div
                key={`hd-${toISO(d)}`}
                className={`px-1.5 py-1.5 text-center ${
                  weekend ? "bg-surface-overlay/60" : "bg-card"
                } ${inRange ? "ring-2 ring-brand ring-inset" : ""}`}
              >
                <p className="text-[9px] uppercase tracking-wider text-muted-foreground/60">
                  {d.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 1)}
                </p>
                <p
                  className={`text-[11px] tabular-nums ${
                    weekend ? "text-muted-foreground/60" : "text-foreground"
                  }`}
                >
                  {d.getDate()}
                </p>
              </div>
            );
          })}

          {/* Requesting employee row */}
          <div className="bg-card px-3 py-1.5 flex items-center gap-2 min-w-32">
            <span className={`size-5 rounded-full ${employeeAvatar} text-white text-[8px] font-bold flex items-center justify-center`}>
              {employeeInitials}
            </span>
            <span className="text-[11px] text-foreground truncate">{employeeName.split(" ")[0]}</span>
          </div>
          {days.map((d) => {
            const inRange = dateInRange(toISO(d), startISO, endISO);
            const weekend = isWeekend(d);
            return (
              <div
                key={`rq-${toISO(d)}`}
                className={`${weekend ? "bg-surface-overlay/60" : "bg-card"} ${inRange ? "ring-2 ring-brand ring-inset" : ""} flex items-center justify-center p-1`}
              >
                {inRange && !weekend && (
                  <span className={`block w-full h-2 rounded-full ${requesterType.color} bg-current opacity-80`} />
                )}
              </div>
            );
          })}

          {/* Teammate rows */}
          {teammates.map((seed) => {
            const personLeaves = TEAM_LEAVES.filter((l) => l.personId === seed.personId);
            return (
              <RowFragment
                key={`tm-${seed.personId}`}
                seed={seed}
                personLeaves={personLeaves}
                days={days}
                rangeStart={startISO}
                rangeEnd={endISO}
              />
            );
          })}

          {teammates.length === 0 && (
            <div className="bg-card px-3 py-3 col-span-full text-[11px] text-muted-foreground italic text-center">
              Nobody else is out in this window.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RowFragment({
  seed,
  personLeaves,
  days,
  rangeStart,
  rangeEnd,
}: {
  seed: TeamLeave;
  personLeaves: TeamLeave[];
  days: Date[];
  rangeStart: string;
  rangeEnd: string;
}) {
  return (
    <>
      <div className="bg-card px-3 py-1.5 flex items-center gap-2 min-w-32">
        <span className={`size-5 rounded-full ${seed.avatarColor} text-white text-[8px] font-bold flex items-center justify-center`}>
          {seed.initials}
        </span>
        <span className="text-[11px] text-foreground truncate">{seed.personName.split(" ")[0]}</span>
      </div>
      {days.map((d) => {
        const iso = toISO(d);
        const weekend = isWeekend(d);
        const inRange = dateInRange(iso, rangeStart, rangeEnd);
        const onLeave = personLeaves.find((l) => dateInRange(iso, l.startDate, l.endDate));
        const type = onLeave ? LEAVE_TYPE_MAP[onLeave.type] : null;
        return (
          <div
            key={`${seed.personId}-${iso}`}
            className={`${weekend ? "bg-surface-overlay/60" : "bg-card"} ${
              inRange ? "ring-1 ring-brand/40 ring-inset" : ""
            } flex items-center justify-center p-1`}
            title={onLeave ? `${seed.personName} · ${type?.label}${onLeave.note ? ` (${onLeave.note})` : ""}` : ""}
          >
            {onLeave && !weekend && (
              <span className={`block w-full h-2 rounded-full ${type?.color} bg-current opacity-50`} />
            )}
          </div>
        );
      })}
    </>
  );
}

