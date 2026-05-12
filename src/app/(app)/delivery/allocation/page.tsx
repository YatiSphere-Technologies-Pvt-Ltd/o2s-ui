"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type KeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  CopyPlus,
  Eraser,
  Filter as FilterIcon,
  Lock,
  Maximize2,
  Minimize2,
  MoreHorizontal,
  Move,
  Plus,
  Save,
  Scissors,
  Search,
  Split,
  TrendingUp,
  Unlock,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import { useLocalStorage } from "@/lib/use-local-storage";
import { PEOPLE, PROJECTS } from "@/components/delivery/data";

/* ────────────────────────────────────────────────────────────── */
/* Helpers                                                       */
/* ────────────────────────────────────────────────────────────── */

interface CellAddr { rowIdx: number; colIdx: number }
interface AdHocProj { id: string; name: string; shortName: string }

function rowKey(personId: string, projectId: string): string {
  return `${personId}__${projectId}`;
}

/**
 * Parse a date-only ISO string (`YYYY-MM-DD`) as **local** midnight, not UTC.
 * Required so `.getDay()` returns the correct local weekday and we don't
 * cross midnight when the user is in a timezone west of UTC.
 */
function parseDateLocal(iso: string): Date {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return new Date(y, (m ?? 1) - 1, d ?? 1, 12, 0, 0, 0);
}

function mondayOf(d: Date): Date {
  const out = new Date(d);
  const day = out.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  out.setDate(out.getDate() + diff);
  out.setHours(12, 0, 0, 0);
  return out;
}

/** Format a Date back to a date-only ISO using **local** components (not UTC). */
function fmtISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function generateWeeks(startISO: string, weeks: number): string[] {
  const start = mondayOf(parseDateLocal(startISO));
  const out: string[] = [];
  for (let i = 0; i < weeks; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i * 7);
    out.push(fmtISO(d));
  }
  return out;
}

/** Generate day-level columns starting at a Monday for N weeks. */
function generateDays(startISO: string, weeks: number, includeWeekends: boolean): string[] {
  const start = mondayOf(parseDateLocal(startISO));
  const out: string[] = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      if (!includeWeekends && (d === 5 || d === 6)) continue; // skip Sat / Sun
      const day = new Date(start);
      day.setDate(start.getDate() + w * 7 + d);
      out.push(fmtISO(day));
    }
  }
  return out;
}

/** Return the Monday-ISO for any date-ISO. */
function weekStartOf(dateISO: string): string {
  const d = parseDateLocal(dateISO);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  return fmtISO(monday);
}

function shortWeekLabel(iso: string): string {
  return parseDateLocal(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function shortDayLabel(iso: string): string {
  return parseDateLocal(iso).toLocaleDateString("en-IN", { weekday: "short" });
}

function dayOfMonthLabel(iso: string): string {
  return parseDateLocal(iso).getDate().toString();
}

function isWeekStart(iso: string): boolean {
  return parseDateLocal(iso).getDay() === 1; // Monday
}

function nameForProject(projectId: string, adHoc: AdHocProj[]): string {
  const seed = PROJECTS.find((p) => p.id === projectId);
  if (seed) return seed.shortName;
  const ad = adHoc.find((p) => p.id === projectId);
  return ad?.shortName ?? projectId;
}

function utilCellClass(pct: number): string {
  if (pct === 0) return "text-muted-foreground/30";
  if (pct <= 80) return "bg-success/15 text-success";
  if (pct <= 100) return "bg-warning/25 text-foreground";
  return "bg-destructive/30 text-destructive font-bold";
}

function cellFillClass(pct: number): string {
  if (pct === 0) return "";
  if (pct <= 30) return "bg-brand/5";
  if (pct <= 70) return "bg-brand/10";
  return "bg-brand/15";
}

/* ────────────────────────────────────────────────────────────── */

interface MatrixRow {
  rowKey: string;
  personId: string;
  projectId: string;
  isAdHoc: boolean;
  cells: Record<string, { id: string; pct: number; kind: "soft" | "hard" }>;
}

/* ────────────────────────────────────────────────────────────── */
/* Page                                                          */
/* ────────────────────────────────────────────────────────────── */

export default function AllocationMatrixPage() {
  const { setScreen } = useScreen();
  const {
    allocations,
    addAllocation,
    updateAllocation,
    deleteAllocation,
    addAdHocProject,
    adHocProjects,
    dailyAllocationFor,
    setDailyAllocation,
    clearDailyAllocation,
  } = useDeliveryStore();

  /* Period + granularity */
  const today = useMemo(() => fmtISO(mondayOf(parseDateLocal("2026-05-12"))), []);
  const [startISO, setStartISO] = useState(today);
  const [weeksCount, setWeeksCount] = useState(6);
  const [granularity, setGranularity] = useLocalStorage<"week" | "day">("o2s.allocGranularity", "week");
  const [includeWeekends, setIncludeWeekends] = useLocalStorage<boolean>("o2s.allocWeekends", false);
  const [fullscreen, setFullscreen] = useState(false);

  /** Toggle "true" fullscreen — page covers entire viewport AND requests browser fullscreen API. */
  const toggleFullscreen = useCallback(() => {
    setFullscreen((curr) => {
      const next = !curr;
      try {
        if (next) {
          if (document.fullscreenElement == null) {
            void document.documentElement.requestFullscreen?.();
          }
        } else if (document.fullscreenElement != null) {
          void document.exitFullscreen?.();
        }
      } catch {
        // Some browsers block requestFullscreen outside of a direct user gesture
        // in iframes or sandboxed contexts. The in-app fullscreen still works.
      }
      return next;
    });
  }, []);

  // Sync browser fullscreen-exit (Esc / F11) back into our state.
  useEffect(() => {
    function onChange() {
      if (document.fullscreenElement == null && fullscreen) {
        // User pressed Esc on the native chrome — leave our flag as-is so
        // the in-app fullscreen stays. Only exit completely if both are off.
      }
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, [fullscreen]);

  // Esc closes the in-app fullscreen too.
  useEffect(() => {
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape" && fullscreen) {
        // Allow Esc to leave when no cell is being edited (cell edit Esc is handled inside the grid).
        const tag = (e.target as HTMLElement | null)?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") {
          setFullscreen(false);
          if (document.fullscreenElement != null) void document.exitFullscreen?.();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fullscreen]);

  /* Filters */
  const [filterPerson, setFilterPerson] = useState<string>("all");
  const [filterProject, setFilterProject] = useState<string>("all");
  const [filterUtil, setFilterUtil] = useState<"all" | "over" | "under" | "exact">("all");
  const [query, setQuery] = useState("");

  /* UI state */
  const [flash, setFlash] = useState<string | null>(null);
  const [edits, setEdits] = useState(0);
  const [editing, setEditing] = useState<CellAddr | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [focus, setFocus] = useState<CellAddr | null>(null);
  const [selection, setSelection] = useState<{ start: CellAddr; end: CellAddr } | null>(null);
  const [clipboard, setClipboard] = useState<{ values: (number | null)[][]; cut: boolean } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; cell: CellAddr } | null>(null);
  const [showAddInline, setShowAddInline] = useState(false);
  const [newPersonId, setNewPersonId] = useState<string>("");
  const [newProjectChoice, setNewProjectChoice] = useState<string>("");
  const [newAdHocLabel, setNewAdHocLabel] = useState<string>("");

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Allocation matrix" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 1600);
  }

  function bump(label?: string) {
    setEdits((e) => e + 1);
    if (label) flashOnce(label);
  }

  /* Visible columns. Week mode: Monday ISOs. Day mode: each day ISO. */
  const cols = useMemo(
    () =>
      granularity === "week"
        ? generateWeeks(startISO, weeksCount)
        : generateDays(startISO, weeksCount, includeWeekends),
    [startISO, weeksCount, granularity, includeWeekends],
  );

  /** Convenience alias used throughout the rest of the page. */
  const weeks = cols;

  /* The underlying set of weeks the visible columns cover. Used to know which rows
     to surface in day mode (rows still come from weekly allocations). */
  const weeksCovered = useMemo(
    () =>
      granularity === "week"
        ? cols
        : Array.from(new Set(cols.map((c) => weekStartOf(c)))),
    [cols, granularity],
  );

  const rows = useMemo<MatrixRow[]>(() => {
    const weekSet = new Set(weeksCovered);
    const byRow = new Map<string, MatrixRow>();
    for (const a of allocations) {
      if (!weekSet.has(a.weekISO)) continue;
      const k = rowKey(a.personId, a.projectId);
      let row = byRow.get(k);
      if (!row) {
        const isAdHoc = !PROJECTS.some((p) => p.id === a.projectId);
        row = { rowKey: k, personId: a.personId, projectId: a.projectId, isAdHoc, cells: {} };
        byRow.set(k, row);
      }
      // Keep the underlying weekly cell record for week-mode rendering.
      row.cells[a.weekISO] = { id: a.id, pct: a.pct, kind: a.kind };
    }
    return Array.from(byRow.values()).sort((a, b) => {
      const an = PEOPLE.find((p) => p.id === a.personId)?.name ?? "";
      const bn = PEOPLE.find((p) => p.id === b.personId)?.name ?? "";
      if (an !== bn) return an.localeCompare(bn);
      return nameForProject(a.projectId, adHocProjects).localeCompare(nameForProject(b.projectId, adHocProjects));
    });
  }, [allocations, weeksCovered, adHocProjects]);

  /* Resource totals — week mode: total per visible week. Day mode: total per visible day. */
  const resourceTotals = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    if (granularity === "week") {
      for (const a of allocations) {
        if (!cols.includes(a.weekISO)) continue;
        if (!map[a.personId]) map[a.personId] = {};
        map[a.personId][a.weekISO] = (map[a.personId][a.weekISO] ?? 0) + a.pct;
      }
    } else {
      // Day mode: sum per-day across all (person, project) pairs.
      for (const r of rows) {
        for (const day of cols) {
          const v = dailyAllocationFor(r.personId, r.projectId, day);
          if (v === 0) continue;
          if (!map[r.personId]) map[r.personId] = {};
          map[r.personId][day] = (map[r.personId][day] ?? 0) + v;
        }
      }
    }
    return map;
  }, [allocations, cols, granularity, rows, dailyAllocationFor]);

  /* Apply filters AFTER totals (filters affect display, not math) */
  const visibleRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (filterPerson !== "all" && r.personId !== filterPerson) return false;
      if (filterProject !== "all" && r.projectId !== filterProject) return false;
      if (q) {
        const person = PEOPLE.find((p) => p.id === r.personId)?.name.toLowerCase() ?? "";
        const project = nameForProject(r.projectId, adHocProjects).toLowerCase();
        if (!person.includes(q) && !project.includes(q)) return false;
      }
      if (filterUtil !== "all") {
        const totals = Object.values(resourceTotals[r.personId] ?? {});
        const anyOver = totals.some((t) => t > 100);
        const anyUnder = totals.some((t) => t < 100 && t > 0);
        const anyExact = totals.some((t) => t === 100);
        if (filterUtil === "over" && !anyOver) return false;
        if (filterUtil === "under" && !anyUnder) return false;
        if (filterUtil === "exact" && !anyExact) return false;
      }
      return true;
    });
  }, [rows, filterPerson, filterProject, filterUtil, query, resourceTotals, adHocProjects]);

  /* Group visible rows by person for rendering with header rows */
  const groupedByPerson = useMemo(() => {
    const map = new Map<string, MatrixRow[]>();
    for (const r of visibleRows) {
      if (!map.has(r.personId)) map.set(r.personId, []);
      map.get(r.personId)!.push(r);
    }
    return map;
  }, [visibleRows]);

  /* ── Cell ops ────────────────────────────────────────────── */

  function setCellValue(rowIdx: number, colIdx: number, pct: number) {
    const row = visibleRows[rowIdx];
    if (!row) return;
    const col = cols[colIdx];
    if (!col) return;
    const clamped = Math.max(0, Math.min(200, Math.round(pct)));
    if (granularity === "day") {
      setDailyAllocation(row.personId, row.projectId, col, clamped);
      return;
    }
    // Week mode (col is a Monday ISO):
    const existing = row.cells[col];
    if (clamped === 0) {
      if (existing) deleteAllocation(existing.id);
    } else if (existing) {
      updateAllocation(existing.id, { pct: clamped });
    } else {
      addAllocation({ personId: row.personId, projectId: row.projectId, weekISO: col, pct: clamped, kind: "soft" });
    }
  }

  function getCellValue(rowIdx: number, colIdx: number): number {
    const row = visibleRows[rowIdx];
    if (!row) return 0;
    const col = cols[colIdx];
    if (granularity === "day") return dailyAllocationFor(row.personId, row.projectId, col);
    return row.cells[col]?.pct ?? 0;
  }

  /** In day mode, a day with a per-day override behaves differently from one inheriting from the week. */
  function getCellMeta(rowIdx: number, colIdx: number): { value: number; kind: "soft" | "hard"; isOverride: boolean } {
    const row = visibleRows[rowIdx];
    if (!row) return { value: 0, kind: "soft", isOverride: false };
    const col = cols[colIdx];
    if (granularity === "day") {
      const wk = weekStartOf(col);
      const weekly = row.cells[wk];
      const value = dailyAllocationFor(row.personId, row.projectId, col);
      const isOverride = (weekly?.pct ?? 0) !== value;
      return { value, kind: weekly?.kind ?? "soft", isOverride };
    }
    const cell = row.cells[col];
    return { value: cell?.pct ?? 0, kind: cell?.kind ?? "soft", isOverride: false };
  }

  function toggleSoftHard(rowIdx: number, colIdx: number) {
    const row = visibleRows[rowIdx];
    if (!row) return;
    const col = cols[colIdx];
    // Soft/hard is a week-level concept. In day mode, toggle on the underlying week.
    const wk = granularity === "day" ? weekStartOf(col) : col;
    const existing = row.cells[wk];
    if (!existing) return;
    updateAllocation(existing.id, { kind: existing.kind === "hard" ? "soft" : "hard" });
    bump("Booking type toggled.");
  }

  function clearRange(start: CellAddr, end: CellAddr) {
    const [r1, r2] = [Math.min(start.rowIdx, end.rowIdx), Math.max(start.rowIdx, end.rowIdx)];
    const [c1, c2] = [Math.min(start.colIdx, end.colIdx), Math.max(start.colIdx, end.colIdx)];
    for (let r = r1; r <= r2; r++) {
      for (let c = c1; c <= c2; c++) {
        setCellValue(r, c, 0);
      }
    }
  }

  /* ── Bulk utility functions ─────────────────────────────── */

  function duplicateColumnRight(colIdx: number) {
    if (colIdx >= weeks.length - 1) return;
    for (let r = 0; r < visibleRows.length; r++) {
      const v = getCellValue(r, colIdx);
      setCellValue(r, colIdx + 1, v);
    }
    bump(`Duplicated ${shortWeekLabel(weeks[colIdx])} → ${shortWeekLabel(weeks[colIdx + 1])}`);
  }

  function projectForward(colIdx: number) {
    // Replicate this column's values across all later weeks.
    for (let r = 0; r < visibleRows.length; r++) {
      const v = getCellValue(r, colIdx);
      for (let c = colIdx + 1; c < weeks.length; c++) {
        setCellValue(r, c, v);
      }
    }
    bump(`Projected ${shortWeekLabel(weeks[colIdx])} forward to ${weeks.length - colIdx - 1} weeks`);
  }

  function normaliseRowTo100(rowIdx: number, colIdx: number) {
    // Scale all of this person's project rows for this week so total = 100.
    const row = visibleRows[rowIdx];
    if (!row) return;
    const week = weeks[colIdx];
    const personRows = visibleRows.filter((r) => r.personId === row.personId);
    const total = personRows.reduce((s, r) => s + (r.cells[week]?.pct ?? 0), 0);
    if (total === 0) return;
    const scale = 100 / total;
    for (const r of personRows) {
      const cur = r.cells[week]?.pct ?? 0;
      const next = Math.round(cur * scale);
      const idx = visibleRows.indexOf(r);
      if (idx >= 0) setCellValue(idx, colIdx, next);
    }
    bump(`Normalised ${PEOPLE.find((p) => p.id === row.personId)?.name} to 100% for ${shortWeekLabel(week)}`);
  }

  function evenSplitRow(rowIdx: number, colIdx: number) {
    const row = visibleRows[rowIdx];
    if (!row) return;
    const personRows = visibleRows.filter((r) => r.personId === row.personId);
    if (personRows.length === 0) return;
    const each = Math.floor(100 / personRows.length);
    for (const r of personRows) {
      const idx = visibleRows.indexOf(r);
      if (idx >= 0) setCellValue(idx, colIdx, each);
    }
    bump(`Even split → ${each}% across ${personRows.length} projects`);
  }

  function setBench(rowIdx: number, colIdx: number) {
    const row = visibleRows[rowIdx];
    if (!row) return;
    const week = weeks[colIdx];
    const personRows = visibleRows.filter((r) => r.personId === row.personId);
    for (const r of personRows) {
      const idx = visibleRows.indexOf(r);
      if (idx >= 0) setCellValue(idx, colIdx, 0);
    }
    bump(`${PEOPLE.find((p) => p.id === row.personId)?.name} marked bench for ${shortWeekLabel(week)}`);
  }

  function fillRight(cell: CellAddr) {
    const v = getCellValue(cell.rowIdx, cell.colIdx);
    for (let c = cell.colIdx + 1; c < weeks.length; c++) {
      setCellValue(cell.rowIdx, c, v);
    }
    bump(`Filled ${v}% across ${weeks.length - cell.colIdx - 1} weeks`);
  }

  function fillDown(cell: CellAddr) {
    const v = getCellValue(cell.rowIdx, cell.colIdx);
    for (let r = cell.rowIdx + 1; r < visibleRows.length; r++) {
      setCellValue(r, cell.colIdx, v);
    }
    bump(`Filled ${v}% down ${visibleRows.length - cell.rowIdx - 1} rows`);
  }

  /* ── Clipboard ──────────────────────────────────────────── */

  function copySelection(cut = false) {
    const sel = selection ?? (focus ? { start: focus, end: focus } : null);
    if (!sel) return;
    const [r1, r2] = [Math.min(sel.start.rowIdx, sel.end.rowIdx), Math.max(sel.start.rowIdx, sel.end.rowIdx)];
    const [c1, c2] = [Math.min(sel.start.colIdx, sel.end.colIdx), Math.max(sel.start.colIdx, sel.end.colIdx)];
    const values: (number | null)[][] = [];
    for (let r = r1; r <= r2; r++) {
      const row: (number | null)[] = [];
      for (let c = c1; c <= c2; c++) row.push(getCellValue(r, c));
      values.push(row);
    }
    setClipboard({ values, cut });
    // Also push to system clipboard as TSV for paste-into-Excel.
    const tsv = values.map((row) => row.map((v) => (v == null ? "" : String(v))).join("\t")).join("\n");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(tsv).catch(() => {});
    }
    bump(cut ? "Cut to clipboard." : "Copied.");
    if (cut) clearRange(sel.start, sel.end);
  }

  function pasteAt(cell: CellAddr) {
    if (!clipboard) return;
    for (let r = 0; r < clipboard.values.length; r++) {
      for (let c = 0; c < clipboard.values[r].length; c++) {
        const v = clipboard.values[r][c];
        if (v != null) setCellValue(cell.rowIdx + r, cell.colIdx + c, v);
      }
    }
    bump("Pasted.");
  }

  function onPasteEvent(e: ClipboardEvent<HTMLDivElement>) {
    if (editing) return;
    if (!focus) return;
    const txt = e.clipboardData?.getData("text/plain") ?? "";
    if (!txt) return;
    e.preventDefault();
    const grid = txt
      .replace(/\r/g, "")
      .split("\n")
      .filter((l) => l.length > 0)
      .map((line) => line.split("\t").map((v) => {
        const n = parseInt(v.trim(), 10);
        return Number.isFinite(n) ? n : null;
      }));
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const v = grid[r][c];
        if (v != null) setCellValue(focus.rowIdx + r, focus.colIdx + c, v);
      }
    }
    bump(`Pasted ${grid.length}×${grid[0]?.length ?? 0} from clipboard`);
  }

  /* ── Editing ────────────────────────────────────────────── */

  function startEdit(cell: CellAddr, seed?: string) {
    const cur = getCellValue(cell.rowIdx, cell.colIdx);
    setEditing(cell);
    setEditValue(seed ?? (cur > 0 ? String(cur) : ""));
  }

  function commitEdit() {
    if (!editing) return;
    const raw = editValue.trim();
    const num = raw === "" ? 0 : parseInt(raw, 10);
    if (Number.isFinite(num)) setCellValue(editing.rowIdx, editing.colIdx, num);
    setEditing(null);
    setEditValue("");
    bump();
  }

  function cancelEdit() {
    setEditing(null);
    setEditValue("");
  }

  function moveFocus(dR: number, dC: number) {
    if (!focus) return;
    const nR = Math.max(0, Math.min(visibleRows.length - 1, focus.rowIdx + dR));
    const nC = Math.max(0, Math.min(weeks.length - 1, focus.colIdx + dC));
    setFocus({ rowIdx: nR, colIdx: nC });
    setSelection(null);
  }

  function extendSelection(dR: number, dC: number) {
    if (!focus) return;
    const start = selection?.start ?? focus;
    const cur = selection?.end ?? focus;
    const end: CellAddr = {
      rowIdx: Math.max(0, Math.min(visibleRows.length - 1, cur.rowIdx + dR)),
      colIdx: Math.max(0, Math.min(weeks.length - 1, cur.colIdx + dC)),
    };
    setSelection({ start, end });
    setFocus(end);
  }

  function onGridKey(e: KeyboardEvent<HTMLDivElement>) {
    if (editing) {
      if (e.key === "Enter") { e.preventDefault(); commitEdit(); moveFocus(1, 0); }
      else if (e.key === "Escape") { e.preventDefault(); cancelEdit(); }
      else if (e.key === "Tab") { e.preventDefault(); commitEdit(); moveFocus(0, e.shiftKey ? -1 : 1); }
      return;
    }
    if (!focus) return;
    const mod = e.metaKey || e.ctrlKey;
    if (mod && (e.key === "c" || e.key === "C")) { e.preventDefault(); copySelection(false); return; }
    if (mod && (e.key === "x" || e.key === "X")) { e.preventDefault(); copySelection(true); return; }
    if (mod && (e.key === "v" || e.key === "V")) { e.preventDefault(); pasteAt(focus); return; }
    if (mod && (e.key === "d" || e.key === "D")) { e.preventDefault(); fillDown(focus); return; }
    if (mod && (e.key === "r" || e.key === "R")) { e.preventDefault(); fillRight(focus); return; }

    if (e.shiftKey) {
      if (e.key === "ArrowRight") { e.preventDefault(); extendSelection(0, 1); return; }
      if (e.key === "ArrowLeft") { e.preventDefault(); extendSelection(0, -1); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); extendSelection(-1, 0); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); extendSelection(1, 0); return; }
    }

    if (e.key === "ArrowRight") { e.preventDefault(); moveFocus(0, 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); moveFocus(0, -1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); moveFocus(-1, 0); }
    else if (e.key === "ArrowDown" || e.key === "Enter") { e.preventDefault(); moveFocus(1, 0); }
    else if (e.key === "Tab") { e.preventDefault(); moveFocus(0, e.shiftKey ? -1 : 1); }
    else if (e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault();
      if (selection) clearRange(selection.start, selection.end);
      else setCellValue(focus.rowIdx, focus.colIdx, 0);
      bump();
    }
    else if (/^[0-9]$/.test(e.key)) { e.preventDefault(); startEdit(focus, e.key); }
    else if (e.key === "F2") { e.preventDefault(); startEdit(focus); }
  }

  function onCellMouseDown(rowIdx: number, colIdx: number, e: ReactMouseEvent) {
    if (e.button === 2) {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, cell: { rowIdx, colIdx } });
      setFocus({ rowIdx, colIdx });
      return;
    }
    setContextMenu(null);
    if (e.shiftKey && focus) {
      setSelection({ start: focus, end: { rowIdx, colIdx } });
    } else {
      setFocus({ rowIdx, colIdx });
      setSelection(null);
    }
    gridRef.current?.focus();
  }

  /* Inline add row */
  function commitAddRow() {
    if (!newPersonId) return;
    let projectId = "";
    if (newProjectChoice === "__adhoc__") {
      if (!newAdHocLabel.trim()) return;
      projectId = addAdHocProject(newAdHocLabel.trim());
    } else {
      projectId = newProjectChoice;
    }
    addAllocation({ personId: newPersonId, projectId, weekISO: weeks[0], pct: 0, kind: "soft" });
    setShowAddInline(false);
    setNewPersonId("");
    setNewProjectChoice("");
    setNewAdHocLabel("");
    bump("Row added.");
  }

  function removeRow(rk: string) {
    const row = rows.find((r) => r.rowKey === rk);
    if (!row) return;
    for (const c of Object.values(row.cells)) deleteAllocation(c.id);
    bump("Row removed.");
  }

  /* ── Helpers ── */
  const gridRef = useRef<HTMLDivElement>(null);

  function inSelection(rowIdx: number, colIdx: number): boolean {
    if (!selection) return false;
    const [r1, r2] = [Math.min(selection.start.rowIdx, selection.end.rowIdx), Math.max(selection.start.rowIdx, selection.end.rowIdx)];
    const [c1, c2] = [Math.min(selection.start.colIdx, selection.end.colIdx), Math.max(selection.start.colIdx, selection.end.colIdx)];
    return rowIdx >= r1 && rowIdx <= r2 && colIdx >= c1 && colIdx <= c2;
  }

  /* ────────────────────────────────────────────────────────── */
  /* Render                                                    */
  /* ────────────────────────────────────────────────────────── */

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-60 bg-background"
          : "-m-6 lg:-m-8 min-h-[calc(100vh-3.5rem)] bg-background"
      }
    >
      <div className="flex flex-col h-full">
        {/* TOOLBAR ROW 1: navigation + period */}
        <header className="shrink-0 px-3 py-2 border-b border-border bg-card flex items-center gap-2 flex-wrap">
          <Link href="/delivery/capacity" className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors" aria-label="Back">
            <ArrowLeft className="size-4" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-sm font-semibold text-foreground">Allocation matrix</h1>
            <p className="text-[10px] text-muted-foreground tabular-nums">
              {visibleRows.length} rows · {weeks.length} {granularity === "day" ? "days" : "weeks"} · click to edit · target 100% / {granularity === "day" ? "day" : "wk"}
            </p>
          </div>

          <div className="h-6 w-px bg-border mx-1" />

          <div className="flex items-center gap-1">
            <button onClick={() => {
              const d = parseDateLocal(startISO); d.setDate(d.getDate() - 7); setStartISO(fmtISO(d));
            }} className="size-7 rounded flex items-center justify-center text-muted-foreground hover:bg-surface-overlay hover:text-foreground" title="Previous week">
              <ChevronLeft className="size-3.5" />
            </button>
            <input
              type="date"
              value={startISO}
              onChange={(e) => setStartISO(fmtISO(mondayOf(parseDateLocal(e.target.value))))}
              className="h-7 px-2 rounded border border-border bg-background text-[11px] text-foreground tabular-nums outline-none focus-visible:border-ring"
            />
            <button onClick={() => {
              const d = parseDateLocal(startISO); d.setDate(d.getDate() + 7); setStartISO(fmtISO(d));
            }} className="size-7 rounded flex items-center justify-center text-muted-foreground hover:bg-surface-overlay hover:text-foreground" title="Next week">
              <ChevronRight className="size-3.5" />
            </button>
            <select value={weeksCount} onChange={(e) => setWeeksCount(Number(e.target.value))}
              className="h-7 px-2 rounded border border-border bg-background text-[11px] text-foreground outline-none">
              <option value={4}>4w</option>
              <option value={6}>6w</option>
              <option value={8}>8w</option>
              <option value={12}>12w</option>
              <option value={16}>16w</option>
            </select>
            <button onClick={() => setStartISO(today)} className="h-7 px-2 rounded border border-border bg-background text-[11px] text-muted-foreground hover:text-foreground">Today</button>
          </div>

          <div className="h-6 w-px bg-border mx-1" />

          {/* View granularity toggle */}
          <div className="flex items-center gap-1">
            <div className="inline-flex rounded border border-border overflow-hidden">
              <button
                onClick={() => setGranularity("week")}
                className={`h-7 px-2.5 text-[11px] font-medium transition-colors ${granularity === "week" ? "bg-brand text-brand-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
              >
                Week
              </button>
              <button
                onClick={() => setGranularity("day")}
                className={`h-7 px-2.5 text-[11px] font-medium transition-colors border-l border-border ${granularity === "day" ? "bg-brand text-brand-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
              >
                Day
              </button>
            </div>
            {granularity === "day" && (
              <label className="inline-flex items-center gap-1 h-7 px-2 rounded border border-border bg-background text-[11px] text-muted-foreground cursor-pointer hover:text-foreground">
                <input
                  type="checkbox"
                  checked={includeWeekends}
                  onChange={(e) => setIncludeWeekends(e.target.checked)}
                  className="accent-brand size-3"
                />
                Sat/Sun
              </label>
            )}
          </div>

          <div className="h-6 w-px bg-border mx-1" />

          {/* Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <FilterIcon className="size-3 text-muted-foreground" />
            <select value={filterPerson} onChange={(e) => setFilterPerson(e.target.value)}
              className="h-7 px-2 rounded border border-border bg-background text-[11px] text-foreground outline-none max-w-32">
              <option value="all">All people</option>
              {PEOPLE.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
            <select value={filterProject} onChange={(e) => setFilterProject(e.target.value)}
              className="h-7 px-2 rounded border border-border bg-background text-[11px] text-foreground outline-none max-w-32">
              <option value="all">All projects</option>
              {PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.shortName}</option>)}
              {adHocProjects.map((p) => <option key={p.id} value={p.id}>{p.shortName} (ad-hoc)</option>)}
            </select>
            <select value={filterUtil} onChange={(e) => setFilterUtil(e.target.value as "all" | "over" | "under" | "exact")}
              className="h-7 px-2 rounded border border-border bg-background text-[11px] text-foreground outline-none">
              <option value="all">Any util</option>
              <option value="over">Over 100%</option>
              <option value="under">Under 100%</option>
              <option value="exact">Exactly 100%</option>
            </select>
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-muted-foreground/60 pointer-events-none" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search…"
                className="h-7 pl-6 pr-2 rounded border border-border bg-background text-[11px] text-foreground outline-none w-28 focus-visible:w-40 transition-all" />
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground tabular-nums inline-flex items-center gap-1">
              <Save className="size-3" />
              Auto-saved · {edits} edits
            </span>
            <button onClick={toggleFullscreen} className="size-7 rounded flex items-center justify-center text-muted-foreground hover:bg-surface-overlay hover:text-foreground" title={fullscreen ? "Exit fullscreen (Esc)" : "Fullscreen"}>
              {fullscreen ? <Minimize2 className="size-3.5" /> : <Maximize2 className="size-3.5" />}
            </button>
          </div>
        </header>

        {/* TOOLBAR ROW 2: utility actions */}
        <div className="shrink-0 px-3 py-1.5 border-b border-border bg-card/60 flex items-center gap-1 flex-wrap text-[11px]">
          <ToolbarButton icon={Copy} label="Copy" onClick={() => copySelection(false)} disabled={!focus} hint="⌘C" />
          <ToolbarButton icon={Scissors} label="Cut" onClick={() => copySelection(true)} disabled={!focus} hint="⌘X" />
          <ToolbarButton icon={Move} label="Paste" onClick={() => focus && pasteAt(focus)} disabled={!clipboard || !focus} hint="⌘V" />
          <ToolbarButton icon={Eraser} label="Clear" onClick={() => {
            if (!focus) return;
            if (selection) clearRange(selection.start, selection.end); else setCellValue(focus.rowIdx, focus.colIdx, 0);
            bump();
          }} disabled={!focus} />
          <div className="h-5 w-px bg-border mx-0.5" />
          <ToolbarButton icon={Copy} label="Fill →" onClick={() => focus && fillRight(focus)} disabled={!focus} hint="⌘R" />
          <ToolbarButton icon={Copy} label="Fill ↓" onClick={() => focus && fillDown(focus)} disabled={!focus} hint="⌘D" />
          <ToolbarButton icon={CopyPlus} label={granularity === "day" ? "Duplicate day" : "Duplicate week"} onClick={() => focus && duplicateColumnRight(focus.colIdx)} disabled={!focus} hint="Copy this column to the next" />
          <ToolbarButton icon={TrendingUp} label="Project forward" onClick={() => focus && projectForward(focus.colIdx)} disabled={!focus} hint={`Replicate to all later ${granularity === "day" ? "days" : "weeks"}`} />
          <div className="h-5 w-px bg-border mx-0.5" />
          <ToolbarButton icon={Split} label="Normalise → 100%" onClick={() => focus && normaliseRowTo100(focus.rowIdx, focus.colIdx)} disabled={!focus} hint="Scale person to 100%" />
          <ToolbarButton icon={Split} label="Even split" onClick={() => focus && evenSplitRow(focus.rowIdx, focus.colIdx)} disabled={!focus} hint="Distribute equally" />
          <ToolbarButton icon={Eraser} label="Set bench" onClick={() => focus && setBench(focus.rowIdx, focus.colIdx)} disabled={!focus} hint="Clear person's week" />
          <ToolbarButton icon={Lock} label="Soft / Hard" onClick={() => focus && toggleSoftHard(focus.rowIdx, focus.colIdx)} disabled={!focus} hint="Toggle booking type" />
        </div>

        {/* Flash */}
        <AnimatePresence>
          {flash && (
            <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="shrink-0 bg-success/10 border-b border-success/30 px-3 py-1 text-[11px] text-success flex items-center gap-2">
              <Check className="size-3" />
              {flash}
            </motion.div>
          )}
        </AnimatePresence>

        {/* GRID */}
        <div
          ref={gridRef}
          className="flex-1 overflow-auto outline-none"
          tabIndex={0}
          onKeyDown={onGridKey}
          onPaste={onPasteEvent}
          onContextMenu={(e) => e.preventDefault()}
        >
          <table className="border-separate border-spacing-0 text-[12px] min-w-max">
            <thead className="sticky top-0 z-20 bg-card">
              <tr>
                <th className="sticky left-0 z-30 bg-card border-b border-r border-border px-3 py-2 text-left text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold min-w-60 max-w-72">
                  Resource → Project
                </th>
                {weeks.map((w, ci) => {
                  const isDayMode = granularity === "day";
                  const isMon = isDayMode && isWeekStart(w);
                  const isWeekend = isDayMode && (parseDateLocal(w).getDay() === 0 || parseDateLocal(w).getDay() === 6);
                  return (
                    <th
                      key={w}
                      onClick={() => setFocus({ rowIdx: focus?.rowIdx ?? 0, colIdx: ci })}
                      className={`border-b border-r border-border py-2 text-center text-[10px] uppercase tracking-wider font-semibold cursor-pointer hover:bg-surface-overlay/30 ${
                        isDayMode ? "px-1 min-w-14" : "px-2 min-w-24"
                      } ${isMon ? "border-l-2 border-l-border" : ""} ${isWeekend ? "bg-surface-overlay/40 text-muted-foreground/40" : focus?.colIdx === ci ? "text-brand" : "text-muted-foreground/70"}`}
                    >
                      {isDayMode ? (
                        <div className="flex flex-col items-center leading-tight">
                          <span className="text-[9px] opacity-70">{shortDayLabel(w)}</span>
                          <span className="text-[11px] tabular-nums normal-case font-bold text-foreground">{dayOfMonthLabel(w)}</span>
                        </div>
                      ) : (
                        shortWeekLabel(w)
                      )}
                    </th>
                  );
                })}
                <th className="border-b border-l-2 border-border px-3 py-2 text-right text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold min-w-20">
                  Row total
                </th>
              </tr>
            </thead>

            <tbody>
              {Array.from(groupedByPerson.entries()).map(([personId, personRows]) => {
                const person = PEOPLE.find((p) => p.id === personId);
                if (!person) return null;
                return (
                  <PersonGroup
                    key={personId}
                    personId={personId}
                    personName={person.name}
                    personInitials={person.initials}
                    personAvatarColor={person.avatarColor}
                    personJobTitle={person.jobTitle}
                    weeks={weeks}
                    totals={resourceTotals[personId] ?? {}}
                    rows={personRows}
                    visibleRows={visibleRows}
                    focus={focus}
                    selection={selection}
                    editing={editing}
                    editValue={editValue}
                    setEditValue={setEditValue}
                    commitEdit={commitEdit}
                    cancelEdit={cancelEdit}
                    onCellMouseDown={onCellMouseDown}
                    onCellDoubleClick={(r, c) => startEdit({ rowIdx: r, colIdx: c })}
                    inSelection={inSelection}
                    adHocProjects={adHocProjects}
                    removeRow={removeRow}
                    granularity={granularity}
                    getCellMeta={getCellMeta}
                  />
                );
              })}

              {/* Inline Add row */}
              <tr>
                <td colSpan={weeks.length + 2} className="px-3 py-1.5 border-b border-border bg-surface-overlay/20">
                  {!showAddInline ? (
                    <button
                      onClick={() => {
                        setShowAddInline(true);
                        setNewPersonId(PEOPLE[0]?.id ?? "");
                        setNewProjectChoice(PROJECTS[0]?.id ?? "");
                      }}
                      className="inline-flex items-center gap-1.5 h-7 px-2.5 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-surface-overlay/60 transition-colors"
                    >
                      <Plus className="size-3" />
                      Add row
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 flex-wrap">
                      <select value={newPersonId} onChange={(e) => setNewPersonId(e.target.value)}
                        className="h-7 px-2 rounded border border-border bg-background text-[11px] text-foreground outline-none">
                        {PEOPLE.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                      <span className="text-[11px] text-muted-foreground">→</span>
                      <select value={newProjectChoice} onChange={(e) => setNewProjectChoice(e.target.value)}
                        className="h-7 px-2 rounded border border-border bg-background text-[11px] text-foreground outline-none">
                        <optgroup label="Existing projects">
                          {PROJECTS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                          {adHocProjects.map((p) => <option key={p.id} value={p.id}>{p.name} (ad-hoc)</option>)}
                        </optgroup>
                        <optgroup label="Other">
                          <option value="__adhoc__">+ Type ad-hoc project name…</option>
                        </optgroup>
                      </select>
                      {newProjectChoice === "__adhoc__" && (
                        <input
                          value={newAdHocLabel}
                          onChange={(e) => setNewAdHocLabel(e.target.value)}
                          placeholder="Project name (e.g. Internal R&D)"
                          autoFocus
                          onKeyDown={(e) => { if (e.key === "Enter") commitAddRow(); }}
                          className="h-7 px-2 rounded border border-input bg-background text-[11px] text-foreground outline-none focus-visible:border-ring w-56"
                        />
                      )}
                      <button onClick={commitAddRow}
                        disabled={!newPersonId || (newProjectChoice === "__adhoc__" ? !newAdHocLabel.trim() : !newProjectChoice)}
                        className="inline-flex items-center gap-1 h-7 px-2.5 rounded bg-brand text-brand-foreground text-[11px] font-medium hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed">
                        <Check className="size-3" />
                        Add
                      </button>
                      <button onClick={() => { setShowAddInline(false); setNewProjectChoice(""); setNewAdHocLabel(""); }}
                        className="inline-flex items-center gap-1 h-7 px-2 rounded text-[11px] text-muted-foreground hover:text-foreground">
                        <X className="size-3" />
                        Cancel
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            </tbody>

            {/* Column totals */}
            <tfoot className="sticky bottom-0 z-20 bg-card">
              <tr>
                <td className="sticky left-0 z-30 bg-card border-t border-r border-border px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                  Org total / {granularity === "day" ? "day" : "week"}
                </td>
                {weeks.map((w) => {
                  const colTotal = Object.values(resourceTotals).reduce((s, r) => s + (r[w] ?? 0), 0);
                  const peopleAllocated = Object.values(resourceTotals).filter((r) => (r[w] ?? 0) > 0).length;
                  const dayOfWk = parseDateLocal(w).getDay();
                  const isMon = granularity === "day" && dayOfWk === 1;
                  const isWeekend = granularity === "day" && (dayOfWk === 0 || dayOfWk === 6);
                  return (
                    <td key={w} className={`border-t border-r border-border text-center py-2 ${granularity === "day" ? "px-1" : "px-2"} ${isMon ? "border-l-2 border-l-border" : ""} ${isWeekend ? "bg-surface-overlay/30 text-muted-foreground/40" : ""}`}>
                      <p className="text-[12px] tabular-nums font-semibold text-foreground">{colTotal}%</p>
                      <p className="text-[9px] text-muted-foreground/70">{peopleAllocated}p</p>
                    </td>
                  );
                })}
                <td className="border-t border-l-2 border-border" />
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Status bar */}
        <footer className="shrink-0 px-3 py-1 border-t border-border bg-card flex items-center gap-3 flex-wrap text-[10px] text-muted-foreground">
          <span>Type to overwrite · Enter / Tab to commit · Shift+arrow to select · ⌘C/⌘V copy/paste · ⌘R fill→ · ⌘D fill↓ · right-click for menu</span>
          <span className="inline-flex items-center gap-1"><span className="size-2 rounded-sm bg-success/30" />Healthy</span>
          <span className="inline-flex items-center gap-1"><span className="size-2 rounded-sm bg-warning/40" />Full</span>
          <span className="inline-flex items-center gap-1"><span className="size-2 rounded-sm bg-destructive/40" />Over</span>
          <span className="ml-auto"><sub>s</sub> soft / bold hard</span>
        </footer>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onCopy={() => { copySelection(false); setContextMenu(null); }}
          onCut={() => { copySelection(true); setContextMenu(null); }}
          onPaste={() => { pasteAt(contextMenu.cell); setContextMenu(null); }}
          onClear={() => { setCellValue(contextMenu.cell.rowIdx, contextMenu.cell.colIdx, 0); bump(); setContextMenu(null); }}
          onFillRight={() => { fillRight(contextMenu.cell); setContextMenu(null); }}
          onFillDown={() => { fillDown(contextMenu.cell); setContextMenu(null); }}
          onDuplicateWeek={() => { duplicateColumnRight(contextMenu.cell.colIdx); setContextMenu(null); }}
          onProjectForward={() => { projectForward(contextMenu.cell.colIdx); setContextMenu(null); }}
          onNormalise={() => { normaliseRowTo100(contextMenu.cell.rowIdx, contextMenu.cell.colIdx); setContextMenu(null); }}
          onEvenSplit={() => { evenSplitRow(contextMenu.cell.rowIdx, contextMenu.cell.colIdx); setContextMenu(null); }}
          onSetBench={() => { setBench(contextMenu.cell.rowIdx, contextMenu.cell.colIdx); setContextMenu(null); }}
          onToggleSoftHard={() => { toggleSoftHard(contextMenu.cell.rowIdx, contextMenu.cell.colIdx); setContextMenu(null); }}
          onResetToWeekly={granularity === "day" ? () => {
            const row = visibleRows[contextMenu.cell.rowIdx];
            const col = cols[contextMenu.cell.colIdx];
            if (row && col) {
              clearDailyAllocation(row.personId, row.projectId, col);
              bump("Reset to weekly inheritance.");
            }
            setContextMenu(null);
          } : undefined}
          granularity={granularity}
        />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Person Group + Row                                            */
/* ────────────────────────────────────────────────────────────── */

interface PersonGroupProps {
  personId: string;
  personName: string;
  personInitials: string;
  personAvatarColor: string;
  personJobTitle: string;
  weeks: string[];
  totals: Record<string, number>;
  rows: MatrixRow[];
  visibleRows: MatrixRow[];
  focus: CellAddr | null;
  selection: { start: CellAddr; end: CellAddr } | null;
  editing: CellAddr | null;
  editValue: string;
  setEditValue: (v: string) => void;
  commitEdit: () => void;
  cancelEdit: () => void;
  onCellMouseDown: (rowIdx: number, colIdx: number, e: ReactMouseEvent) => void;
  onCellDoubleClick: (rowIdx: number, colIdx: number) => void;
  inSelection: (rowIdx: number, colIdx: number) => boolean;
  adHocProjects: AdHocProj[];
  removeRow: (rk: string) => void;
  granularity: "week" | "day";
  /** For day-mode rendering, retrieves the per-day value + meta. */
  getCellMeta: (rowIdx: number, colIdx: number) => { value: number; kind: "soft" | "hard"; isOverride: boolean };
}

function PersonGroup(props: PersonGroupProps) {
  const {
    personName, personInitials, personAvatarColor, personJobTitle,
    weeks, totals, rows, visibleRows,
    focus, editing, editValue, setEditValue, commitEdit, cancelEdit,
    onCellMouseDown, onCellDoubleClick, inSelection, adHocProjects, removeRow,
    granularity, getCellMeta,
  } = props;
  const isDayMode = granularity === "day";

  return (
    <>
      {/* Summary row */}
      <tr className="bg-surface-overlay/30">
        <td className="sticky left-0 z-10 bg-surface-overlay/60 border-b border-r border-border px-3 py-1.5">
          <div className="flex items-center gap-2">
            <span className={`size-6 rounded-full ${personAvatarColor} text-white text-[9px] font-bold flex items-center justify-center`}>{personInitials}</span>
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-foreground">{personName}</p>
              <p className="text-[10px] text-muted-foreground/70">{personJobTitle}</p>
            </div>
          </div>
        </td>
        {weeks.map((w) => {
          const t = totals[w] ?? 0;
          const dayOfWk = parseDateLocal(w).getDay();
          const isMon = isDayMode && dayOfWk === 1;
          const isWeekend = isDayMode && (dayOfWk === 0 || dayOfWk === 6);
          return (
            <td key={w} className={`border-b border-r border-border text-center text-[11px] tabular-nums font-semibold py-1 ${isDayMode ? "px-1" : "px-2"} ${isMon ? "border-l-2 border-l-border" : ""} ${isWeekend ? "bg-surface-overlay/30 text-muted-foreground/40" : utilCellClass(t)}`}>
              {t}%
            </td>
          );
        })}
        <td className="border-b border-l-2 border-border text-right px-3 py-1 text-[11px] tabular-nums font-semibold text-muted-foreground">
          Σ
        </td>
      </tr>

      {/* Project rows */}
      {rows.map((row) => {
        const rIdx = visibleRows.indexOf(row);
        return (
          <tr key={row.rowKey} className="group">
            <td className="sticky left-0 z-10 bg-card border-b border-r border-border px-3 py-1.5">
              <div className="flex items-center gap-2 pl-6">
                <span className={`size-1.5 rounded-full ${row.isAdHoc ? "bg-warning" : "bg-brand"}`} />
                <p className="text-[12px] text-foreground truncate flex-1">{nameForProject(row.projectId, adHocProjects)}</p>
                <button onClick={() => removeRow(row.rowKey)} className="size-5 rounded text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-colors opacity-0 group-hover:opacity-100" aria-label="Remove row">
                  <X className="size-3" />
                </button>
              </div>
            </td>
            {weeks.map((w, cIdx) => {
              const meta = isDayMode ? getCellMeta(rIdx, cIdx) : { value: row.cells[w]?.pct ?? 0, kind: row.cells[w]?.kind ?? "soft" as const, isOverride: false };
              const pct = meta.value;
              const isFocused = focus?.rowIdx === rIdx && focus.colIdx === cIdx;
              const isSelected = inSelection(rIdx, cIdx);
              const isEditing = editing?.rowIdx === rIdx && editing.colIdx === cIdx;
              const dayOfWk = parseDateLocal(w).getDay();
              const isMon = isDayMode && dayOfWk === 1;
              const isWeekend = isDayMode && (dayOfWk === 0 || dayOfWk === 6);
              return (
                <td
                  key={w}
                  onMouseDown={(e) => onCellMouseDown(rIdx, cIdx, e)}
                  onDoubleClick={() => onCellDoubleClick(rIdx, cIdx)}
                  className={`border-b border-r border-border text-center text-[11px] tabular-nums py-1 cursor-cell select-none relative ${isDayMode ? "px-1" : "px-2"} ${isMon ? "border-l-2 border-l-border" : ""} ${isWeekend ? "bg-surface-overlay/30" : cellFillClass(pct)} ${
                    isFocused ? "outline outline-2 outline-brand outline-offset-[-2px]" : ""
                  } ${isSelected ? "bg-brand/20" : ""}`}
                  title={meta.isOverride ? "Day-level override (differs from weekly)" : undefined}
                >
                  {isEditing ? (
                    <input
                      autoFocus
                      type="text"
                      inputMode="numeric"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
                      onBlur={commitEdit}
                      onKeyDown={(e) => { if (e.key === "Escape") { e.preventDefault(); cancelEdit(); } }}
                      className="absolute inset-0 w-full h-full bg-background text-center text-foreground tabular-nums outline outline-2 outline-brand"
                    />
                  ) : pct > 0 ? (
                    <span className={meta.kind === "soft" ? "text-muted-foreground" : "text-foreground font-medium"}>
                      {pct}
                      {meta.kind === "soft" ? <sub className="text-[8px]">s</sub> : null}
                      {meta.isOverride ? <sub className="text-[8px] text-warning ml-0.5">d</sub> : null}
                    </span>
                  ) : (
                    <span className="text-muted-foreground/30">·</span>
                  )}
                </td>
              );
            })}
            <td className="border-b border-l-2 border-border text-right px-3 py-1 text-[11px] tabular-nums text-muted-foreground">
              {/* Row total — sum over visible columns. In day mode, sum daily values. */}
              {weeks.reduce((s, w, idx) => {
                if (isDayMode) {
                  return s + (getCellMeta(visibleRows.indexOf(row), idx).value);
                }
                return s + (row.cells[w]?.pct ?? 0);
              }, 0)}%
            </td>
          </tr>
        );
      })}
    </>
  );
}

/* ────────────────────────────────────────────────────────────── */
/* Context menu                                                  */
/* ────────────────────────────────────────────────────────────── */

interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onCopy: () => void;
  onCut: () => void;
  onPaste: () => void;
  onClear: () => void;
  onFillRight: () => void;
  onFillDown: () => void;
  onDuplicateWeek: () => void;
  onProjectForward: () => void;
  onNormalise: () => void;
  onEvenSplit: () => void;
  onSetBench: () => void;
  onToggleSoftHard: () => void;
  onResetToWeekly?: () => void;
  granularity: "week" | "day";
}

function ContextMenu(props: ContextMenuProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDown(e: globalThis.MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) props.onClose();
    }
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") props.onClose();
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [props]);

  return (
    <div
      ref={ref}
      className="fixed z-50 min-w-52 bg-card border border-border rounded-lg shadow-2xl py-1 text-[12px]"
      style={{ left: Math.min(props.x, window.innerWidth - 220), top: Math.min(props.y, window.innerHeight - 400) }}
    >
      <MenuItem icon={Copy} label="Copy" hint="⌘C" onClick={props.onCopy} />
      <MenuItem icon={Scissors} label="Cut" hint="⌘X" onClick={props.onCut} />
      <MenuItem icon={Move} label="Paste" hint="⌘V" onClick={props.onPaste} />
      <MenuItem icon={Eraser} label="Clear cell" onClick={props.onClear} />
      <Divider />
      <MenuItem icon={Copy} label="Fill right" hint="⌘R" onClick={props.onFillRight} />
      <MenuItem icon={Copy} label="Fill down" hint="⌘D" onClick={props.onFillDown} />
      <MenuItem icon={CopyPlus} label={props.granularity === "day" ? "Duplicate this day →" : "Duplicate this week →"} onClick={props.onDuplicateWeek} />
      <MenuItem icon={TrendingUp} label={`Project forward (all later ${props.granularity === "day" ? "days" : "weeks"})`} onClick={props.onProjectForward} />
      <Divider />
      <MenuItem icon={Split} label={`Normalise person to 100% (this ${props.granularity === "day" ? "day" : "week"})`} onClick={props.onNormalise} />
      <MenuItem icon={Split} label="Even split across projects" onClick={props.onEvenSplit} />
      <MenuItem icon={Eraser} label="Set bench (clear all)" onClick={props.onSetBench} />
      <Divider />
      <MenuItem icon={Unlock} label="Toggle soft / hard" onClick={props.onToggleSoftHard} />
      {props.granularity === "day" && props.onResetToWeekly && (
        <MenuItem icon={Eraser} label="Reset to weekly value (inherit)" onClick={props.onResetToWeekly} />
      )}
    </div>
  );
}

function MenuItem({ icon: Icon, label, hint, onClick }: { icon: React.ComponentType<{ className?: string }>; label: string; hint?: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2.5 px-3 py-1.5 hover:bg-surface-overlay text-left text-foreground">
      <Icon className="size-3 text-muted-foreground shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      {hint && <span className="text-[10px] text-muted-foreground/70 font-mono">{hint}</span>}
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-border my-0.5 mx-2" />;
}

/* ────────────────────────────────────────────────────────────── */
/* Toolbar Button                                                */
/* ────────────────────────────────────────────────────────────── */

function ToolbarButton({
  icon: Icon,
  label,
  onClick,
  disabled,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={hint}
      className="inline-flex items-center gap-1 h-7 px-2 rounded border border-border bg-background text-foreground hover:bg-surface-overlay hover:border-border/80 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-background transition-colors"
    >
      <Icon className="size-3" />
      <span>{label}</span>
    </button>
  );
}

// Suppress unused warnings on imports that survived rewrites
void MoreHorizontal;
