"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  ChevronDown,
  ChevronRight,
  Minus,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  COMPLIANCE_ITEMS,
  COUNTRY_COMPLIANCE,
  HR_COUNTRIES,
  complianceSummary,
  type StatutoryCheck,
  type StatutoryCheckOutcome,
} from "@/components/leave/data";

const OUTCOME_META: Record<
  StatutoryCheckOutcome,
  { tint: string; color: string; label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  pass: { tint: "bg-success/10",     color: "text-success",     label: "Pass",   icon: Check },
  warn: { tint: "bg-warning/10",     color: "text-warning",     label: "Warn",   icon: AlertTriangle },
  fail: { tint: "bg-destructive/10", color: "text-destructive", label: "Fail",   icon: AlertOctagon },
  na:   { tint: "bg-secondary",      color: "text-muted-foreground", label: "N/A", icon: Minus },
};

function flagFor(code: string): string {
  return HR_COUNTRIES.find((c) => c.code === code)?.flag ?? "🏳";
}

function nameFor(code: string): string {
  return HR_COUNTRIES.find((c) => c.code === code)?.name ?? code;
}

export default function ComplianceDashboardPage() {
  const { setScreen } = useScreen();
  const { complianceFeed } = useLeaveStore();
  const [expanded, setExpanded] = useState<string | null>("IN");

  useEffect(() => {
    setScreen({ module: "Leave", page: "Compliance dashboard" });
    return () => setScreen(null);
  }, [setScreen]);

  const summary = useMemo(() => complianceSummary(), []);

  // Upcoming deadlines = filing_deadline items + warn/fail compliance items with an effective date
  const upcoming = useMemo(() => {
    const todayISO = new Date().toISOString().slice(0, 10);
    return [...COMPLIANCE_ITEMS]
      .filter((it) => it.effectiveDate && it.effectiveDate >= todayISO)
      .sort((a, b) => (a.effectiveDate! < b.effectiveDate! ? -1 : 1));
  }, []);

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
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Compliance dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Per-country statutory status. Failing items are tracked through to closure.
          </p>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <Kpi label="Checks total" value={`${summary.total}`} tone="brand" />
        <Kpi label="Passing"        value={`${summary.passing}`} tone="success" />
        <Kpi label="Needs action"   value={`${summary.warning}`} tone="warning" />
        <Kpi label="Failing"        value={`${summary.failing}`} tone="destructive" />
      </motion.div>

      {/* Country table */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="p-5 border-b border-border">
          <h3 className="text-sm font-semibold text-foreground">By country</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5">Click a row to expand the statutory check list.</p>
        </div>
        <ul className="divide-y divide-border">
          {COUNTRY_COMPLIANCE.map((row) => {
            const passing = row.checks.filter((c) => c.outcome === "pass").length;
            const warn   = row.checks.filter((c) => c.outcome === "warn").length;
            const fail   = row.checks.filter((c) => c.outcome === "fail").length;
            const open = expanded === row.country;
            const overall: StatutoryCheckOutcome = fail > 0 ? "fail" : warn > 0 ? "warn" : "pass";
            const meta = OUTCOME_META[overall];
            return (
              <li key={row.country}>
                <button
                  onClick={() => setExpanded(open ? null : row.country)}
                  className="w-full flex items-center gap-4 px-5 py-3 hover:bg-surface-overlay/30 transition-colors text-left"
                >
                  <span className="text-2xl leading-none">{flagFor(row.country)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{nameFor(row.country)}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Owner: {row.owner} · last audited {new Date(row.lastAuditedISO).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider">
                    <span className="text-success">{passing} pass</span>
                    {warn > 0 && <span className="text-warning">{warn} warn</span>}
                    {fail > 0 && <span className="text-destructive">{fail} fail</span>}
                  </div>
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider ${meta.tint} ${meta.color}`}>
                    {meta.label}
                  </span>
                  {open ? <ChevronDown className="size-4 text-muted-foreground" /> : <ChevronRight className="size-4 text-muted-foreground" />}
                </button>

                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.18 }}
                    className="overflow-hidden border-t border-border bg-surface-overlay/20"
                  >
                    <ul className="px-5 py-3 space-y-1.5">
                      {row.checks.map((c) => (
                        <CheckRow key={c.id} check={c} />
                      ))}
                    </ul>
                  </motion.div>
                )}
              </li>
            );
          })}
        </ul>
      </motion.section>

      {/* Upcoming deadlines */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.15 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <CalendarClock className="size-4 text-brand" />
          <h3 className="text-sm font-semibold text-foreground">Upcoming deadlines</h3>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-xs text-muted-foreground italic">Nothing due in the next 60 days.</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map((it) => (
              <li key={it.id} className="flex items-start gap-3 p-3 rounded-lg bg-surface-overlay/40 border border-border">
                <span className="text-base leading-none mt-0.5">{flagFor(it.country)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">{it.title}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{it.summary}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1">
                    Effective {new Date(it.effectiveDate!).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {it.source.label}
                  </p>
                </div>
                <Link
                  href="/leave/hr/compliance"
                  className="inline-flex items-center gap-1 text-[11px] text-brand hover:underline shrink-0"
                >
                  Watchdog <ArrowRight className="size-3" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </motion.section>

      <p className="text-[11px] text-muted-foreground/60 text-center">
        Watchdog feed + lifecycle:{" "}
        <Link href="/leave/hr/compliance" className="text-brand hover:underline">/leave/hr/compliance</Link>.
        Recent items: {complianceFeed.length}.
      </p>
    </div>
  );
}

function CheckRow({ check }: { check: StatutoryCheck }) {
  const m = OUTCOME_META[check.outcome];
  const Icon = m.icon;
  return (
    <li className="flex items-start gap-3 p-2 rounded-md">
      <div className={`size-7 shrink-0 rounded-md flex items-center justify-center ${m.tint}`}>
        <Icon className={`size-3.5 ${m.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground">{check.label}</p>
        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{check.detail}</p>
        {check.citation && <p className="text-[10px] text-muted-foreground/60 mt-1">{check.citation}</p>}
      </div>
      <span className={`text-[10px] uppercase tracking-wider ${m.color} shrink-0`}>{m.label}</span>
    </li>
  );
}

function Kpi({ label, value, tone }: { label: string; value: string; tone: "brand" | "success" | "warning" | "destructive" }) {
  const dot = tone === "success" ? "bg-success" : tone === "warning" ? "bg-warning" : tone === "destructive" ? "bg-destructive" : "bg-brand";
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold inline-flex items-center gap-1.5">
        <span className={`size-1.5 rounded-full ${dot}`} />
        {label}
      </p>
      <p className="text-xl font-bold text-foreground mt-1 tabular-nums">{value}</p>
    </div>
  );
}
