"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Filter as FilterIcon,
  Pin,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  ABSENCE_LAST_6_MONTHS,
  BRADFORD_LAST_12_MONTHS,
  DISTRIBUTION_BY_EMPLOYEE,
  DISTRIBUTION_BY_TYPE,
  HR_COUNTRIES,
  LEAVE_TRENDS_6M,
  LEAVE_TYPES,
  LEAVE_TYPE_MAP,
  LIABILITY_BY_COST_CENTER,
  REPORT_DIMENSIONS,
  REPORT_MEASURES,
  SUB_TEAMS,
  type LeaveTypeKey,
  type ReportDimension,
  type ReportMeasure,
} from "@/components/leave/data";

interface PreviewRow {
  label: string;
  value: number;
}

function compute(dim: ReportDimension, measure: ReportMeasure, filters: Filters): PreviewRow[] {
  /* Pragmatic dispatch — we don't have a real warehouse, so a few hand-chosen
     dimension × measure combos are real, the rest synthesise from related seeds. */

  // Filter applicability
  const inCountry = (c: string) => filters.country === "all" || c === filters.country;
  const inType    = (t: LeaveTypeKey) => filters.type === "all" || t === filters.type;
  const inTeam    = (t: string) => filters.team === "all" || t === filters.team;

  if (dim === "leave_type") {
    if (measure === "days_taken") {
      return DISTRIBUTION_BY_TYPE
        .filter((r) => inType(r.type))
        .map((r) => ({ label: LEAVE_TYPE_MAP[r.type].label, value: r.days }));
    }
    if (measure === "request_count") {
      return DISTRIBUTION_BY_TYPE
        .filter((r) => inType(r.type))
        .map((r) => ({ label: LEAVE_TYPE_MAP[r.type].label, value: Math.round(r.days / 1.5) }));
    }
  }

  if (dim === "country") {
    if (measure === "absenteeism_rate") {
      const rates: Record<string, number> = { IN: 3.2, UK: 2.4, US: 2.1, SG: 1.8, DE: 4.1 };
      return HR_COUNTRIES
        .filter((c) => inCountry(c.code))
        .map((c) => ({ label: c.name, value: rates[c.code] ?? 2.5 }));
    }
    if (measure === "liability_value") {
      const m = new Map<string, number>();
      for (const r of LIABILITY_BY_COST_CENTER) {
        if (!inCountry(r.country)) continue;
        m.set(r.country, (m.get(r.country) ?? 0) + r.accruedLakh);
      }
      return HR_COUNTRIES.filter((c) => inCountry(c.code)).map((c) => ({
        label: c.name,
        value: m.get(c.code) ?? 0,
      }));
    }
  }

  if (dim === "month") {
    if (measure === "days_taken") {
      return LEAVE_TRENDS_6M.map((p) => ({
        label: p.monthLabel,
        value: p.byType.filter((b) => inType(b.type)).reduce((s, x) => s + x.days, 0),
      }));
    }
    if (measure === "absenteeism_rate") {
      return ABSENCE_LAST_6_MONTHS.map((p) => ({
        label: p.monthLabel,
        value: Math.round((p.daysLost / p.workingDaysAvail) * 1000) / 10,
      }));
    }
  }

  if (dim === "employee") {
    if (measure === "days_taken") {
      return DISTRIBUTION_BY_EMPLOYEE
        .map((r) => ({
          label: r.employeeName,
          value: r.byType
            .filter((b) => inType(b.type))
            .reduce((s, b) => s + b.days, 0),
        }))
        .sort((a, b) => b.value - a.value);
    }
    if (measure === "bradford_score") {
      return BRADFORD_LAST_12_MONTHS.map((b) => ({ label: b.employeeName, value: b.score })).sort((a, b) => b.value - a.value);
    }
    if (measure === "avg_days_per_employee") {
      return DISTRIBUTION_BY_EMPLOYEE.map((r) => ({ label: r.employeeName, value: r.total }));
    }
  }

  if (dim === "sub_team") {
    if (measure === "days_taken") {
      // Synthetic: derive from team seed
      return SUB_TEAMS.filter(inTeam).map((t) => ({
        label: t,
        value: 14 + Math.floor((t.length * 11) % 23),
      }));
    }
  }

  // Fallback synthesised series
  return Array.from({ length: 5 }, (_, i) => ({ label: `Series ${i + 1}`, value: 10 + Math.floor((i * 7) % 17) }));
}

interface Filters {
  country: string;
  type: LeaveTypeKey | "all";
  team: string;
}

const DEFAULT_FILTERS: Filters = { country: "all", type: "all", team: "all" };

export default function ReportBuilderPage() {
  const { setScreen } = useScreen();
  const { togglePinnedReport } = useLeaveStore();

  const [dim, setDim] = useState<ReportDimension>("leave_type");
  const [measure, setMeasure] = useState<ReportMeasure>("days_taken");
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [name, setName] = useState("Untitled report");
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Report builder" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  const rows = useMemo(() => compute(dim, measure, filters), [dim, measure, filters]);
  const max = Math.max(1, ...rows.map((r) => r.value));
  const unit = REPORT_MEASURES.find((m) => m.value === measure)?.unit ?? "";

  const activeFilterChips = useMemo(() => {
    const out: { key: string; label: string; onRemove: () => void }[] = [];
    if (filters.country !== "all") {
      const country = HR_COUNTRIES.find((c) => c.code === filters.country);
      out.push({ key: "country", label: `Country: ${country?.name ?? filters.country}`, onRemove: () => setFilters((f) => ({ ...f, country: "all" })) });
    }
    if (filters.type !== "all") {
      out.push({ key: "type", label: `Type: ${LEAVE_TYPE_MAP[filters.type as LeaveTypeKey].label}`, onRemove: () => setFilters((f) => ({ ...f, type: "all" })) });
    }
    if (filters.team !== "all") {
      out.push({ key: "team", label: `Team: ${filters.team}`, onRemove: () => setFilters((f) => ({ ...f, team: "all" })) });
    }
    return out;
  }, [filters]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3 flex-wrap"
      >
        <Link
          href="/leave/hr/reports"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-2xl font-bold text-foreground tracking-tight w-full bg-transparent border-none outline-none focus:ring-2 focus:ring-brand/40 rounded-md px-1 -mx-1"
          />
          <p className="text-sm text-muted-foreground mt-0.5">
            Build a custom report by picking a dimension, a measure, and optional filters. Preview updates live.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => flashOnce(`Exported ${name} as CSV.`)} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">
            <Download className="size-3.5" />
            CSV
          </button>
          <button onClick={() => flashOnce(`Scheduled ${name} weekly to #people-ops.`)} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">
            <Send className="size-3.5" />
            Schedule
          </button>
          <button onClick={() => { togglePinnedReport(`custom:${name}`); flashOnce(`Pinned ${name} to home.`); }} className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Pin className="size-3.5" />
            Pin
          </button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left: pickers */}
        <motion.aside
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="space-y-4 lg:col-span-1"
        >
          <section className="bg-card border border-border rounded-xl p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Dimension</p>
            <select
              value={dim}
              onChange={(e) => setDim(e.target.value as ReportDimension)}
              className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
            >
              {REPORT_DIMENSIONS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </section>

          <section className="bg-card border border-border rounded-xl p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Measure</p>
            <select
              value={measure}
              onChange={(e) => setMeasure(e.target.value as ReportMeasure)}
              className="w-full h-10 px-3 rounded-lg bg-secondary text-sm text-foreground outline-none focus:ring-2 focus:ring-brand/40"
            >
              {REPORT_MEASURES.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </section>

          <section className="bg-card border border-border rounded-xl p-4 space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold flex items-center gap-1">
              <FilterIcon className="size-3" />
              Filters
            </p>
            <select
              value={filters.country}
              onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))}
              className="w-full h-9 px-2.5 rounded-lg bg-secondary text-xs text-foreground outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="all">All countries</option>
              {HR_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
            <select
              value={filters.team}
              onChange={(e) => setFilters((f) => ({ ...f, team: e.target.value }))}
              className="w-full h-9 px-2.5 rounded-lg bg-secondary text-xs text-foreground outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="all">All teams</option>
              {SUB_TEAMS.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select
              value={filters.type}
              onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value as LeaveTypeKey | "all" }))}
              className="w-full h-9 px-2.5 rounded-lg bg-secondary text-xs text-foreground outline-none focus:ring-2 focus:ring-brand/40"
            >
              <option value="all">All leave types</option>
              {LEAVE_TYPES.filter((t) => t.available).map((t) => (
                <option key={t.key} value={t.key}>{t.label}</option>
              ))}
            </select>
          </section>
        </motion.aside>

        {/* Right: preview */}
        <motion.section
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="lg:col-span-3 bg-card border border-border rounded-xl p-5 space-y-4"
        >
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider bg-brand/10 text-brand">
                <Sparkles className="size-2.5" />
                Live preview
              </span>
              <span className="text-[11px] text-muted-foreground">
                {REPORT_DIMENSIONS.find((d) => d.value === dim)?.label} ×{" "}
                {REPORT_MEASURES.find((m) => m.value === measure)?.label}
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {activeFilterChips.length === 0 && (
                <span className="text-[10px] text-muted-foreground/60">No filters</span>
              )}
              {activeFilterChips.map((c) => (
                <span
                  key={c.key}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-[11px] text-foreground"
                >
                  {c.label}
                  <button onClick={c.onRemove} aria-label={`Remove filter ${c.key}`} className="text-muted-foreground hover:text-foreground">
                    <X className="size-2.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Chart */}
          {rows.length === 0 ? (
            <p className="text-xs text-muted-foreground italic text-center py-10">No data for this combination.</p>
          ) : (
            <div className="space-y-2">
              {rows.map((r) => {
                const pct = Math.round((r.value / max) * 100);
                return (
                  <div key={r.label} className="flex items-center gap-3 text-[11px]">
                    <span className="w-40 text-foreground truncate">{r.label}</span>
                    <div className="flex-1 h-3 rounded bg-secondary overflow-hidden">
                      <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="w-20 text-right text-foreground tabular-nums">{r.value} {unit}</span>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-[10px] text-muted-foreground/60 pt-2 border-t border-border">
            Computed from local seed data. In production this query runs against the warehouse and supports save / share / schedule.
          </p>
        </motion.section>
      </div>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-70 px-4 py-2.5 rounded-lg bg-card border border-border shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="size-4 text-success" />
            <span className="text-xs text-foreground">{flash}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
