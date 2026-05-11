"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Filter, Wallet } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import {
  HR_COUNTRIES,
  LIABILITY_BY_COST_CENTER,
  LIABILITY_PROJECTION_12M,
} from "@/components/leave/data";
import { Sparkline } from "@/components/leave/sparkline";

function fmtLakh(v: number): string {
  if (v >= 100) return `₹${(v / 100).toFixed(2)} Cr`;
  return `₹${v.toFixed(1)} L`;
}

function flagFor(code: string): string {
  return HR_COUNTRIES.find((c) => c.code === code)?.flag ?? "🏳";
}

export default function LiabilityDashboardPage() {
  const { setScreen } = useScreen();
  const [country, setCountry] = useState<string>("all");

  useEffect(() => {
    setScreen({ module: "Leave", page: "Liability dashboard" });
    return () => setScreen(null);
  }, [setScreen]);

  const rows = useMemo(
    () => (country === "all" ? LIABILITY_BY_COST_CENTER : LIABILITY_BY_COST_CENTER.filter((r) => r.country === country)),
    [country],
  );

  const totals = useMemo(() => {
    const accrued = rows.reduce((s, r) => s + r.accruedLakh, 0);
    const paid    = rows.reduce((s, r) => s + r.paidLakhYTD, 0);
    const encash  = rows.reduce((s, r) => s + r.encashmentLakhYTD, 0);
    const head    = rows.reduce((s, r) => s + r.headcount, 0);
    return { accrued, paid, encash, head };
  }, [rows]);

  const projection = LIABILITY_PROJECTION_12M.map((p) => p.accruedLakh);
  const projectionPeak = Math.max(...projection);
  const projectionLow = Math.min(...projection);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link
            href="/leave/hr/reports"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Leave liability</h1>
            <p className="text-sm text-muted-foreground">
              Accrued vs paid-out, encashment exposure, 12-month projection.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="size-3.5 text-muted-foreground" />
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-9 px-3 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="all">All countries</option>
              {HR_COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
              ))}
            </select>
          </div>
          <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity">
            <Download className="size-3.5" />
            Export
          </button>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3"
      >
        <Kpi label="Current accrued"        value={fmtLakh(totals.accrued)} sub={`${totals.head} headcount in scope`} />
        <Kpi label="Paid out YTD"           value={fmtLakh(totals.paid)}     sub="actual disbursements" />
        <Kpi label="Encashment exposure"    value={fmtLakh(totals.encash)}  sub="cash-out at separation" />
        <Kpi label="Per-employee average"   value={totals.head ? fmtLakh(totals.accrued / totals.head) : "—"} sub="accrued / headcount" />
      </motion.div>

      {/* Projection */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-5"
      >
        <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
          <h3 className="text-sm font-semibold text-foreground">12-month projection</h3>
          <p className="text-[11px] text-muted-foreground">
            peak {fmtLakh(projectionPeak)} · trough {fmtLakh(projectionLow)}
          </p>
        </div>
        <Sparkline values={projection} color="text-warning" width={920} height={120} />
        <div className="flex items-center justify-between mt-2 text-[10px] text-muted-foreground/70">
          {LIABILITY_PROJECTION_12M.map((p) => (
            <span key={p.monthLabel} className={p.note ? "text-warning" : ""} title={p.note}>
              {p.monthLabel}
            </span>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-3">
          Drops at <span className="text-warning">Dec</span> (year-end encashment) and{" "}
          <span className="text-warning">Mar</span> (FY close) are expected.
        </p>
      </motion.section>

      {/* By cost center */}
      <motion.section
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.15 }}
        className="bg-card border border-border rounded-xl overflow-hidden"
      >
        <div className="p-5 border-b border-border flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">By cost center</h3>
          <span className="text-[11px] text-muted-foreground">{rows.length} cost centers</span>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-sm">
            <thead className="bg-surface-overlay/30 border-b border-border">
              <tr>
                <Th>Cost center</Th>
                <Th>Country</Th>
                <Th align="right">Headcount</Th>
                <Th align="right">Accrued</Th>
                <Th align="right">Paid YTD</Th>
                <Th align="right">Encash YTD</Th>
                <Th align="right">Per head</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface-overlay/30 transition-colors">
                  <td className="py-2.5 px-4 text-xs text-foreground">{r.name}</td>
                  <td className="py-2.5 px-4 text-xs text-foreground inline-flex items-center gap-1.5">
                    <span className="text-base leading-none">{flagFor(r.country)}</span>
                    {r.country}
                  </td>
                  <td className="py-2.5 px-4 text-right text-xs text-foreground tabular-nums">{r.headcount}</td>
                  <td className="py-2.5 px-4 text-right text-xs text-foreground tabular-nums">{fmtLakh(r.accruedLakh)}</td>
                  <td className="py-2.5 px-4 text-right text-xs text-foreground tabular-nums">{fmtLakh(r.paidLakhYTD)}</td>
                  <td className="py-2.5 px-4 text-right text-xs text-foreground tabular-nums">{fmtLakh(r.encashmentLakhYTD)}</td>
                  <td className="py-2.5 px-4 text-right text-xs text-foreground tabular-nums">{fmtLakh(r.accruedLakh / r.headcount)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-surface-overlay/30">
              <tr>
                <td className="py-2.5 px-4 text-xs font-medium text-foreground">Totals</td>
                <td className="py-2.5 px-4" />
                <td className="py-2.5 px-4 text-right text-xs font-medium text-foreground tabular-nums">{totals.head}</td>
                <td className="py-2.5 px-4 text-right text-xs font-medium text-foreground tabular-nums">{fmtLakh(totals.accrued)}</td>
                <td className="py-2.5 px-4 text-right text-xs font-medium text-foreground tabular-nums">{fmtLakh(totals.paid)}</td>
                <td className="py-2.5 px-4 text-right text-xs font-medium text-foreground tabular-nums">{fmtLakh(totals.encash)}</td>
                <td className="py-2.5 px-4 text-right text-xs font-medium text-foreground tabular-nums">{totals.head ? fmtLakh(totals.accrued / totals.head) : "—"}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </motion.section>

      <p className="text-[11px] text-muted-foreground/60 text-center pt-2">
        <Wallet className="size-3 inline align-baseline mr-1 text-muted-foreground/60" />
        Liability is computed monthly and pushed to the warehouse on the configured cadence.
      </p>
    </div>
  );
}

function Kpi({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{label}</p>
      <p className="text-xl font-bold text-foreground mt-1 tabular-nums">{value}</p>
      <p className="text-[10px] text-muted-foreground/60 mt-0.5">{sub}</p>
    </div>
  );
}

function Th({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <th
      className={`text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold py-2 px-4 whitespace-nowrap ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}
