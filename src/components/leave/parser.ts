/* ================================================================
   Rule-based leave-intent parser.
   Handles common English phrases like "next Friday", "tomorrow",
   "half-day Friday", "Mon-Wed", "sick today", "Jun 12 to 14".
   Deterministic and inspectable; not exhaustive.
   ================================================================ */

import { LEAVE_TYPES, type LeaveTypeKey } from "@/components/leave/data";

export interface ParsedIntent {
  raw: string;
  /** Inclusive start (ISO yyyy-mm-dd). */
  startDate?: string;
  /** Inclusive end. Same as startDate for single-day. */
  endDate?: string;
  /** Day count (working days approximated as range length minus weekends). */
  workingDays?: number;
  granularity: "FULL" | "FH" | "SH" | "HOURS";
  leaveType?: LeaveTypeKey;
  /** Anything Aurora picked up but isn't a structured field. */
  notes: string[];
  /** Tokens it couldn't resolve. */
  unresolved: string[];
}

const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const SHORT_DAY = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

const LEAVE_TYPE_KEYWORDS: { rx: RegExp; key: LeaveTypeKey }[] = [
  { rx: /\b(privileged|pl|annual|earned|vacation|holiday)\b/i, key: "privileged" },
  { rx: /\b(sick|unwell|fever|flu|sl|medical)\b/i,             key: "sick" },
  { rx: /\b(casual|cl)\b/i,                                     key: "casual" },
  { rx: /\b(comp[- ]?off|compoff|co)\b/i,                       key: "compoff" },
  { rx: /\b(maternity)\b/i,                                     key: "maternity" },
  { rx: /\b(paternity|pat)\b/i,                                 key: "paternity" },
  { rx: /\b(bereavement)\b/i,                                   key: "bereavement" },
  { rx: /\b(wfa|wfh|remote|work[- ]from)\b/i,                   key: "wfa" },
];

function toISO(d: Date): string {
  // local-time YYYY-MM-DD (avoid TZ surprises)
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

function startOfDay(d: Date): Date {
  const r = new Date(d);
  r.setHours(0, 0, 0, 0);
  return r;
}

function nextWeekday(from: Date, targetDow: number, options: { strictlyAfter: boolean } = { strictlyAfter: true }): Date {
  const d = startOfDay(from);
  const cur = d.getDay();
  let delta = (targetDow - cur + 7) % 7;
  if (delta === 0 && options.strictlyAfter) delta = 7;
  return addDays(d, delta);
}

function workingDaysBetween(startISO: string, endISO: string): number {
  const s = new Date(startISO);
  const e = new Date(endISO);
  let count = 0;
  for (let d = new Date(s); d <= e; d = addDays(d, 1)) {
    const dow = d.getDay();
    if (dow !== 0 && dow !== 6) count++;
  }
  return count;
}

function findDayName(token: string): number | null {
  const t = token.toLowerCase();
  const fullIdx = DAY_NAMES.indexOf(t);
  if (fullIdx >= 0) return fullIdx;
  const shortIdx = SHORT_DAY.indexOf(t);
  if (shortIdx >= 0) return shortIdx;
  return null;
}

function parseExplicitDate(text: string, now: Date): string | null {
  // "Jun 12", "12 Jun", "Jun 12 2026", "12/6", "2026-06-12"
  // ISO direct
  const isoMatch = text.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (isoMatch) {
    const d = new Date(Number(isoMatch[1]), Number(isoMatch[2]) - 1, Number(isoMatch[3]));
    if (!isNaN(d.getTime())) return toISO(d);
  }
  // "Jun 12" or "12 Jun"
  const monthFirst = text.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2})\b/i);
  if (monthFirst) {
    const m = MONTHS.indexOf(monthFirst[1].toLowerCase().slice(0, 3));
    const day = Number(monthFirst[2]);
    const year = now.getFullYear();
    const candidate = new Date(year, m, day);
    // if it's in the past relative to today, assume next year
    if (candidate < startOfDay(now)) candidate.setFullYear(year + 1);
    return toISO(candidate);
  }
  const dayFirst = text.match(/\b(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i);
  if (dayFirst) {
    const m = MONTHS.indexOf(dayFirst[2].toLowerCase().slice(0, 3));
    const day = Number(dayFirst[1]);
    const year = now.getFullYear();
    const candidate = new Date(year, m, day);
    if (candidate < startOfDay(now)) candidate.setFullYear(year + 1);
    return toISO(candidate);
  }
  return null;
}

function parseRelativeDay(text: string, now: Date): string | null {
  const lc = text.toLowerCase();
  if (/\btoday\b/.test(lc)) return toISO(startOfDay(now));
  if (/\btomorrow\b/.test(lc)) return toISO(addDays(now, 1));
  if (/\byesterday\b/.test(lc)) return toISO(addDays(now, -1));
  if (/\bday after tomorrow\b/.test(lc)) return toISO(addDays(now, 2));

  // "next Friday", "this Friday", "Friday"
  const nextRx = /\bnext\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)\b/i;
  const thisRx = /\bthis\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)\b/i;
  const bareDay = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i;

  let m = lc.match(nextRx);
  if (m) {
    const dow = findDayName(m[1]);
    if (dow !== null) {
      // "next X" = upcoming X strictly after today; for clarity advance by 7 if same week
      const upcoming = nextWeekday(now, dow);
      // If today's "next Friday" parses to this-week-Friday, advance by 7 to mean "the one after"
      if (upcoming.getTime() - startOfDay(now).getTime() < 7 * 86400000) {
        return toISO(addDays(upcoming, 7));
      }
      return toISO(upcoming);
    }
  }
  m = lc.match(thisRx);
  if (m) {
    const dow = findDayName(m[1]);
    if (dow !== null) return toISO(nextWeekday(now, dow, { strictlyAfter: false }));
  }
  m = lc.match(bareDay);
  if (m) {
    const dow = findDayName(m[1]);
    if (dow !== null) return toISO(nextWeekday(now, dow, { strictlyAfter: false }));
  }
  return null;
}

function parseRange(text: string, now: Date): { start: string; end: string } | null {
  // "Mon to Wed", "Mon-Wed", "12-14 June", "Jun 12 to 14", "Jun 12 to Jun 14"
  // Pattern A: <day>-<day> or <day> to <day>
  const dayPair = text.match(
    /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)\s*(?:-|to|–|—|through|thru)\s*(monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)\b/i,
  );
  if (dayPair) {
    const a = findDayName(dayPair[1]);
    const b = findDayName(dayPair[2]);
    if (a !== null && b !== null) {
      const start = nextWeekday(now, a, { strictlyAfter: false });
      let end = nextWeekday(start, b, { strictlyAfter: false });
      // If end ended up before start (same-week wrap-around case), advance week
      if (end < start) end = addDays(end, 7);
      return { start: toISO(start), end: toISO(end) };
    }
  }

  // Pattern B: "12-14 June" or "12 to 14 June"
  const numericRange = text.match(/\b(\d{1,2})\s*(?:-|to|–|—)\s*(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\b/i);
  if (numericRange) {
    const d1 = Number(numericRange[1]);
    const d2 = Number(numericRange[2]);
    const m = MONTHS.indexOf(numericRange[3].toLowerCase().slice(0, 3));
    const year = now.getFullYear();
    let start = new Date(year, m, d1);
    let end = new Date(year, m, d2);
    if (start < startOfDay(now)) {
      start.setFullYear(year + 1);
      end.setFullYear(year + 1);
    }
    if (end < start) [start, end] = [end, start];
    return { start: toISO(start), end: toISO(end) };
  }

  // Pattern C: "Jun 12 to 14" or "Jun 12 to Jun 14"
  const monthFirstRange = text.match(
    /\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{1,2})\s*(?:-|to|–|—)\s*(?:(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+)?(\d{1,2})\b/i,
  );
  if (monthFirstRange) {
    const m1 = MONTHS.indexOf(monthFirstRange[1].toLowerCase().slice(0, 3));
    const d1 = Number(monthFirstRange[2]);
    const m2 = monthFirstRange[3] ? MONTHS.indexOf(monthFirstRange[3].toLowerCase().slice(0, 3)) : m1;
    const d2 = Number(monthFirstRange[4]);
    const year = now.getFullYear();
    let start = new Date(year, m1, d1);
    let end = new Date(year, m2, d2);
    if (start < startOfDay(now)) {
      start.setFullYear(year + 1);
      end.setFullYear(year + 1);
    }
    if (end < start) [start, end] = [end, start];
    return { start: toISO(start), end: toISO(end) };
  }

  return null;
}

function parseGranularity(text: string): ParsedIntent["granularity"] {
  const lc = text.toLowerCase();
  if (/\bhalf[- ]?day\b/.test(lc)) {
    if (/\b(afternoon|pm|second half|2nd half|sh)\b/.test(lc)) return "SH";
    return "FH"; // default half-day = first half
  }
  if (/\bfirst half\b|\bfh\b/.test(lc)) return "FH";
  if (/\bsecond half\b|\bsh\b/.test(lc)) return "SH";
  if (/\b(few hours|an hour|hourly)\b/.test(lc)) return "HOURS";
  return "FULL";
}

function parseLeaveType(text: string): LeaveTypeKey | undefined {
  for (const { rx, key } of LEAVE_TYPE_KEYWORDS) {
    if (rx.test(text)) return key;
  }
  return undefined;
}

export function parseLeaveIntent(text: string, now: Date = new Date()): ParsedIntent {
  const out: ParsedIntent = {
    raw: text,
    granularity: parseGranularity(text),
    notes: [],
    unresolved: [],
  };

  out.leaveType = parseLeaveType(text);
  if (out.granularity === "FULL" && /\bsick\b/i.test(text)) {
    // "sick today" implies same-day full sick
  }

  // 1) Range first
  const range = parseRange(text, now);
  if (range) {
    out.startDate = range.start;
    out.endDate = range.end;
  } else {
    // 2) Single explicit date
    const explicit = parseExplicitDate(text, now);
    if (explicit) {
      out.startDate = explicit;
      out.endDate = explicit;
    } else {
      // 3) Relative day
      const rel = parseRelativeDay(text, now);
      if (rel) {
        out.startDate = rel;
        out.endDate = rel;
      }
    }
  }

  if (out.startDate && out.endDate) {
    out.workingDays =
      out.granularity === "FULL"
        ? workingDaysBetween(out.startDate, out.endDate)
        : 0.5;
  }

  // Sensible defaults: a bare "sick today" should pick sick leave type if not already set
  if (!out.leaveType && /\bsick\b/i.test(text)) out.leaveType = "sick";

  // Surface tokens we couldn't pin down (very rough)
  if (!out.startDate) out.unresolved.push("date");
  if (!out.leaveType) out.unresolved.push("leave type");

  return out;
}

/** Friendly summary line for Aurora bubbles. */
export function summarizeIntent(p: ParsedIntent): string {
  if (!p.startDate) return "I couldn't pin down a date. Want to try again with something like “next Friday” or “Jun 12 to 14”?";
  const type = p.leaveType ? LEAVE_TYPES.find((t) => t.key === p.leaveType)?.label ?? "leave" : "leave";
  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
  const range = p.startDate === p.endDate ? fmt(p.startDate) : `${fmt(p.startDate)} → ${fmt(p.endDate!)}`;
  const gran =
    p.granularity === "FH" ? " (first half)" :
    p.granularity === "SH" ? " (second half)" :
    p.granularity === "HOURS" ? " (hourly)" : "";
  return `Got it — ${type} on ${range}${gran}.`;
}
