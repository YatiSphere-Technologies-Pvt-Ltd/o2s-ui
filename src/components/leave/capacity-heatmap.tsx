"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import {
  LEAVE_TYPE_MAP,
  TEAM_LEAVES,
  TEAM_MEMBERS,
  computeDayCapacity,
  filterTeam,
  leaveCoversDate,
  type CapacityFilters,
  type DayCapacity,
  type TeamMember,
} from "@/components/leave/data";
import {
  isSameMonth,
  isWeekend,
  monthGridDays,
  toISO,
} from "@/components/leave/calendar-utils";

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Props {
  anchor: Date;
  filters: CapacityFilters;
  onPickEmployee?: (id: string) => void;
}

function colorFor(cap: DayCapacity, weekend: boolean): { bg: string; text: string } {
  if (weekend) return { bg: "bg-secondary/40", text: "text-muted-foreground/40" };
  if (cap.pctPresent >= 80) return { bg: "bg-success/15", text: "text-success" };
  if (cap.pctPresent >= 50) return { bg: "bg-warning/15", text: "text-warning" };
  return { bg: "bg-destructive/15", text: "text-destructive" };
}

export function CapacityHeatmap({ anchor, filters, onPickEmployee }: Props) {
  const days = monthGridDays(anchor);
  const team = useMemo(() => filterTeam(TEAM_MEMBERS, filters), [filters]);
  const teamIds = useMemo(() => new Set(team.map((m) => m.id)), [team]);

  const leavesForTeam = useMemo(
    () => TEAM_LEAVES.filter((l) => teamIds.has(l.personId)),
    [teamIds],
  );

  // Precompute capacity for each visible day
  const dayCaps = useMemo(() => {
    const out = new Map<string, DayCapacity>();
    for (const d of days) {
      const iso = toISO(d);
      out.set(iso, computeDayCapacity(iso, team, leavesForTeam, filters));
    }
    return out;
  }, [days, team, leavesForTeam, filters]);

  const [hover, setHover] = useState<{ iso: string; x: number; y: number } | null>(null);

  return (
    <div className="bg-card border border-border rounded-xl overflow-visible relative">
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
          const weekend = isWeekend(d);
          const cap = dayCaps.get(iso)!;
          const color = colorFor(cap, weekend);
          const breached = cap.criticalRoleBreached && !weekend && inMonth;

          return (
            <button
              key={iso}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setHover({
                  iso,
                  x: rect.left + rect.width / 2,
                  y: rect.bottom + 8,
                });
              }}
              onMouseLeave={() => setHover((h) => (h?.iso === iso ? null : h))}
              className={`group relative min-h-20 flex flex-col items-start p-1.5 border-r border-b border-border last:border-r-0 ${
                inMonth ? color.bg : "bg-surface-overlay/30"
              } ${breached ? "ring-1 ring-destructive/50 ring-inset" : ""}`}
            >
              <span
                className={`text-[11px] font-medium tabular-nums ${
                  !inMonth ? "text-muted-foreground/40" : weekend ? "text-muted-foreground/60" : color.text
                }`}
              >
                {d.getDate()}
              </span>
              {inMonth && !weekend && (
                <p className={`text-[10px] mt-auto tabular-nums ${color.text}`}>
                  {cap.pctPresent}%
                </p>
              )}
              {breached && (
                <ShieldAlert className="absolute top-1.5 right-1.5 size-3 text-destructive" />
              )}
            </button>
          );
        })}
      </div>

      {/* Hover card */}
      <AnimatePresence>
        {hover && (
          <DayHoverCard
            iso={hover.iso}
            x={hover.x}
            y={hover.y}
            cap={dayCaps.get(hover.iso)!}
            team={team}
            leaves={leavesForTeam}
            onPickEmployee={onPickEmployee}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function DayHoverCard({
  iso,
  x,
  y,
  cap,
  team,
  leaves,
  onPickEmployee,
}: {
  iso: string;
  x: number;
  y: number;
  cap: DayCapacity;
  team: TeamMember[];
  leaves: { personId: string; startDate: string; endDate: string; type: string; note?: string }[];
  onPickEmployee?: (id: string) => void;
}) {
  const date = new Date(iso);
  const label = date.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" });

  const outDetail = team
    .filter((m) => cap.outIds.includes(m.id))
    .map((m) => {
      const l = leaves.find((x) => x.personId === m.id && leaveCoversDate(x, iso));
      return { member: m, leave: l };
    });

  const present = team.length - cap.outIds.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.12 }}
      style={{ position: "fixed", left: x, top: y, transform: "translateX(-50%)" }}
      className="z-50 w-72 bg-card border border-border rounded-xl shadow-xl p-3 pointer-events-auto"
    >
      <div className="flex items-baseline justify-between mb-2">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <p className="text-[11px] text-muted-foreground tabular-nums">
          {present}/{team.length} in office · {cap.pctPresent}%
        </p>
      </div>

      {cap.criticalRoleBreached && cap.breachedRole && (
        <div className="flex items-start gap-2 p-2 mb-2 rounded-lg bg-destructive/10 text-destructive">
          <AlertTriangle className="size-3.5 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-snug">
            <span className="font-medium">{cap.breachedRole}</span> coverage below threshold.
          </p>
        </div>
      )}

      {outDetail.length === 0 ? (
        <p className="text-[11px] text-muted-foreground italic">Full crew in office.</p>
      ) : (
        <ul className="space-y-1.5">
          {outDetail.map(({ member, leave }) => {
            const type = leave ? LEAVE_TYPE_MAP[leave.type as keyof typeof LEAVE_TYPE_MAP] : null;
            return (
              <li key={member.id} className="flex items-center gap-2">
                <button
                  onClick={() => onPickEmployee?.(member.id)}
                  className={`size-6 rounded-full ${member.avatarColor} text-white text-[9px] font-bold flex items-center justify-center shrink-0 hover:ring-2 hover:ring-brand transition-all`}
                  title="Open report detail"
                >
                  {member.initials}
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-foreground truncate">{member.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {type ? <span className={type.color}>{type.shortLabel}</span> : "Out"}
                    {leave?.note ? ` · ${leave.note}` : ""}
                  </p>
                </div>
                <span className="text-[9px] uppercase tracking-wider text-muted-foreground/60 shrink-0">
                  {member.role.split(" ")[0]}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </motion.div>
  );
}
