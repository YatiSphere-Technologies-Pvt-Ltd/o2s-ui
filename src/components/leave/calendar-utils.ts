/* ================================================================
   Calendar utility functions — pure, no React.
   ================================================================ */

import type { LeaveRequest, PublicHoliday, TeamLeave } from "@/components/leave/data";

export function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

export function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

/** Returns the Monday on or before the given date. */
export function startOfWeek(d: Date): Date {
  const r = new Date(d);
  const dow = (r.getDay() + 6) % 7; // 0 = Monday
  r.setDate(r.getDate() - dow);
  r.setHours(0, 0, 0, 0);
  return r;
}

/** 42-cell grid (6 rows × 7 days) starting on Monday for the month containing `anchor`. */
export function monthGridDays(anchor: Date): Date[] {
  const first = startOfMonth(anchor);
  const gridStart = startOfWeek(first);
  return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
}

/** 7-day week starting on Monday containing `anchor`. */
export function weekDays(anchor: Date): Date[] {
  const start = startOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => addDays(start, i));
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

export function isWeekend(d: Date): boolean {
  const dow = d.getDay();
  return dow === 0 || dow === 6;
}

/** True if iso falls on or between start..end inclusive. */
export function dateInRange(iso: string, startISO: string, endISO: string): boolean {
  return iso >= startISO && iso <= endISO;
}

const TAKEN_STATUSES = new Set(["taken", "approved", "pending"]);

export function personalEntriesForDate(
  requests: LeaveRequest[],
  iso: string,
): LeaveRequest[] {
  return requests
    .filter((r) => TAKEN_STATUSES.has(r.status))
    .filter((r) => dateInRange(iso, r.startDate, r.endDate));
}

export function teamEntriesForDate(team: TeamLeave[], iso: string): TeamLeave[] {
  return team.filter((t) => dateInRange(iso, t.startDate, t.endDate));
}

export function holidaysForDate(hols: PublicHoliday[], iso: string): PublicHoliday[] {
  return hols.filter((h) => h.date === iso);
}

export interface YearStats {
  usedYTD: number;
  planned: number;
  remaining: number;
  allotment: number;
}

/** Compute aggregate stats across personal balances + future approved/pending requests. */
export function computeYearStats(
  requests: LeaveRequest[],
  balances: { type: string; balance: number; used: number; pending: number; annualAllotment: number }[],
  todayISO: string,
): YearStats {
  const usedYTD = balances.reduce((s, b) => s + b.used, 0);
  const planned = requests
    .filter((r) => (r.status === "approved" || r.status === "pending") && r.startDate >= todayISO)
    .reduce((s, r) => s + r.days, 0);
  const remaining = balances
    // remaining counts only "discretionary" buckets
    .filter((b) => ["privileged", "casual", "compoff", "wfa"].includes(b.type))
    .reduce((s, b) => s + b.balance, 0);
  const allotment = balances.reduce((s, b) => s + b.annualAllotment, 0);
  return { usedYTD, planned, remaining, allotment };
}
