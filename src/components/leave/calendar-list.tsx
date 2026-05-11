"use client";

import { useMemo } from "react";
import Link from "next/link";
import { CalendarDays, PartyPopper } from "lucide-react";
import {
  LEAVE_TYPE_MAP,
  type LeaveRequest,
  type PublicHoliday,
  type TeamLeave,
} from "@/components/leave/data";
import { endOfMonth, startOfMonth } from "@/components/leave/calendar-utils";

type Item =
  | { kind: "personal"; key: string; date: string; r: LeaveRequest }
  | { kind: "team"; key: string; date: string; t: TeamLeave }
  | { kind: "holiday"; key: string; date: string; h: PublicHoliday };

interface Props {
  anchor: Date;
  personalRequests: LeaveRequest[];
  teamLeaves: TeamLeave[];
  holidays: PublicHoliday[];
  showTeam: boolean;
}

function fmtDay(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function CalendarList({
  anchor,
  personalRequests,
  teamLeaves,
  holidays,
  showTeam,
}: Props) {
  const items: Item[] = useMemo(() => {
    const start = startOfMonth(anchor);
    const end = endOfMonth(anchor);
    const startISO = start.toISOString().slice(0, 10);
    const endISO = end.toISOString().slice(0, 10);
    const all: Item[] = [];
    for (const r of personalRequests) {
      if (r.status === "rejected" || r.status === "cancelled") continue;
      if (r.endDate < startISO || r.startDate > endISO) continue;
      all.push({ kind: "personal", key: `p-${r.id}`, date: r.startDate, r });
    }
    if (showTeam) {
      for (const t of teamLeaves) {
        if (t.endDate < startISO || t.startDate > endISO) continue;
        all.push({ kind: "team", key: `t-${t.id}`, date: t.startDate, t });
      }
    }
    for (const h of holidays) {
      if (h.date < startISO || h.date > endISO) continue;
      all.push({ kind: "holiday", key: `h-${h.date}-${h.name}`, date: h.date, h });
    }
    return all.sort((a, b) => a.date.localeCompare(b.date));
  }, [anchor, personalRequests, teamLeaves, holidays, showTeam]);

  if (items.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center text-sm text-muted-foreground">
        Nothing scheduled for {anchor.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden divide-y divide-border">
      {items.map((it) => (
        <ListRow key={it.key} item={it} />
      ))}
    </div>
  );
}

function ListRow({ item }: { item: Item }) {
  if (item.kind === "personal") {
    const r = item.r;
    const t = LEAVE_TYPE_MAP[r.type];
    return (
      <Link
        href={`/leave/${r.id}`}
        className="flex items-center gap-4 px-4 py-3 hover:bg-surface-overlay/40 transition-colors"
      >
        <DateCell iso={r.startDate} endIso={r.startDate === r.endDate ? undefined : r.endDate} />
        <div className={`size-8 rounded-md flex items-center justify-center ${t.tint}`}>
          <span className={`text-[10px] font-bold ${t.color}`}>{t.shortLabel}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground">{t.label}</p>
          {r.reason && <p className="text-xs text-muted-foreground truncate">{r.reason}</p>}
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
          {r.status === "pending" ? "Pending" : r.status === "approved" ? "Approved" : "Taken"}
        </span>
      </Link>
    );
  }
  if (item.kind === "team") {
    const t = item.t;
    const type = LEAVE_TYPE_MAP[t.type];
    return (
      <div className="flex items-center gap-4 px-4 py-3 hover:bg-surface-overlay/30 transition-colors">
        <DateCell iso={t.startDate} endIso={t.startDate === t.endDate ? undefined : t.endDate} />
        <div className={`size-8 rounded-full ${t.avatarColor} text-white text-[10px] font-bold flex items-center justify-center`}>
          {t.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground">{t.personName}</p>
          <p className="text-xs text-muted-foreground">
            <span className={type.color}>{type.shortLabel}</span>{t.note ? ` · ${t.note}` : ""}
          </p>
        </div>
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50">Team</span>
      </div>
    );
  }
  const h = item.h;
  return (
    <div className="flex items-center gap-4 px-4 py-3">
      <DateCell iso={h.date} />
      <div className="size-8 rounded-md bg-warning/10 flex items-center justify-center">
        <PartyPopper className="size-4 text-warning" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground">{h.name}</p>
        <p className="text-xs text-muted-foreground">
          {h.region}
          {h.optional ? " · Optional" : ""}
        </p>
      </div>
      <span className="text-[10px] uppercase tracking-wider text-warning/80">Holiday</span>
    </div>
  );
}

function DateCell({ iso, endIso }: { iso: string; endIso?: string }) {
  return (
    <div className="shrink-0 w-32 flex items-center gap-2 text-xs">
      <CalendarDays className="size-3.5 text-muted-foreground/60 shrink-0" />
      <span className="text-foreground tabular-nums">
        {fmtDay(iso)}
        {endIso ? <span className="text-muted-foreground"> – {fmtDay(endIso)}</span> : null}
      </span>
    </div>
  );
}
