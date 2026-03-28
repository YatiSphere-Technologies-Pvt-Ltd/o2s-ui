"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Calendar,
  Users,
} from "lucide-react";
import {
  NINE_BOX_DATA,
  RATING_DISTRIBUTION,
  RATING_COLORS,
  CALIBRATION_SESSIONS,
  MARKET_BENCHMARKS,
  PROMOTION_READINESS,
  readinessBgColor,
  readinessColor,
} from "@/components/performance/data";

const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" as const } },
};

type CalibrationView = "ninebox" | "distribution" | "benchmarks" | "sessions";

const SUB_VIEWS: { key: CalibrationView; label: string }[] = [
  { key: "ninebox", label: "9-Box Grid" },
  { key: "distribution", label: "Distribution" },
  { key: "benchmarks", label: "Benchmarks" },
  { key: "sessions", label: "Sessions" },
];

// Map performance/potential to grid position
function getGridPosition(perf: string, pot: string): { row: number; col: number } {
  const colMap: Record<string, number> = { low: 0, medium: 1, high: 2 };
  const rowMap: Record<string, number> = { high: 0, medium: 1, low: 2 };
  return { row: rowMap[pot] ?? 1, col: colMap[perf] ?? 1 };
}

function NineBoxGrid() {
  // Build a 3x3 grid
  const grid: (typeof NINE_BOX_DATA[number] | null)[][] = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];

  for (const item of NINE_BOX_DATA) {
    const { row, col } = getGridPosition(item.perf, item.pot);
    grid[row][col] = item;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-2">
        {/* Y-axis label */}
        <div className="flex flex-col items-center justify-center h-full pr-2">
          <span className="text-[10px] text-muted-foreground font-medium writing-mode-vertical whitespace-nowrap [writing-mode:vertical-lr] rotate-180">
            Potential ↑
          </span>
        </div>

        <div className="flex-1 space-y-1">
          <div className="grid grid-cols-3 grid-rows-3 gap-1.5">
            {grid.map((row, ri) =>
              row.map((cell, ci) => (
                <div
                  key={`${ri}-${ci}`}
                  className="bg-card border border-border rounded-lg p-3 min-h-[90px] flex flex-col"
                >
                  {cell ? (
                    <>
                      <span className="text-[10px] font-bold text-foreground">
                        {cell.label}
                      </span>
                      <span className="text-lg font-bold text-foreground mt-1">
                        {cell.count}
                      </span>
                      <div className="mt-auto">
                        {cell.employees.slice(0, 3).map((name) => (
                          <span
                            key={name}
                            className="block text-[10px] text-muted-foreground truncate"
                          >
                            {name}
                          </span>
                        ))}
                        {cell.employees.length > 3 && (
                          <span className="text-[10px] text-muted-foreground">
                            +{cell.employees.length - 3} more
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <span className="text-[10px] text-muted-foreground">—</span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* X-axis label */}
          <div className="text-center">
            <span className="text-[10px] text-muted-foreground font-medium">
              Performance →
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DistributionView() {
  const maxCount = Math.max(...RATING_DISTRIBUTION.map((r) => r.count));

  return (
    <div className="space-y-3">
      {RATING_DISTRIBUTION.map((r) => (
        <div key={r.rating} className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              {r.rating}
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className="text-foreground font-medium">
                {r.count} ({r.pct}%)
              </span>
              <span className="text-muted-foreground">
                Target: {r.target}
              </span>
              {r.ok ? (
                <CheckCircle2 className="size-3.5 text-success" />
              ) : (
                <AlertTriangle className="size-3.5 text-warning" />
              )}
            </div>
          </div>
          <div className="h-3 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${RATING_COLORS[r.rating]}`}
              style={{ width: `${(r.count / maxCount) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function BenchmarksView() {
  return (
    <div className="space-y-6">
      {/* Market Benchmarks */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">
          Market Benchmarks
        </h4>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left font-medium px-4 py-2.5">Metric</th>
                <th className="text-left font-medium px-4 py-2.5">Ours</th>
                <th className="text-left font-medium px-4 py-2.5">Industry</th>
                <th className="text-left font-medium px-4 py-2.5">Delta</th>
              </tr>
            </thead>
            <tbody>
              {MARKET_BENCHMARKS.map((b) => (
                <tr
                  key={b.metric}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-2.5 text-foreground">{b.metric}</td>
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {b.ours}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {b.industry}
                  </td>
                  <td
                    className={`px-4 py-2.5 font-medium ${
                      b.ok ? "text-success" : "text-destructive"
                    }`}
                  >
                    {b.delta}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Promotion Readiness */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-foreground">
          Promotion Readiness
        </h4>
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left font-medium px-4 py-2.5">Employee</th>
                <th className="text-left font-medium px-4 py-2.5">
                  Current → Next
                </th>
                <th className="text-left font-medium px-4 py-2.5">
                  Readiness
                </th>
                <th className="text-left font-medium px-4 py-2.5">Signal</th>
              </tr>
            </thead>
            <tbody>
              {PROMOTION_READINESS.map((p) => (
                <tr
                  key={p.name}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {p.name}
                  </td>
                  <td className="px-4 py-2.5 text-muted-foreground">
                    {p.current} → {p.next}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${readinessBgColor(p.readiness)}`}
                          style={{ width: `${p.readiness}%` }}
                        />
                      </div>
                      <span
                        className={`text-xs font-medium ${readinessColor(p.readiness)}`}
                      >
                        {p.readiness}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        p.signal === "Ready"
                          ? "bg-success/10 text-success"
                          : p.signal === "Strong"
                            ? "bg-brand/10 text-brand"
                            : p.signal === "Growing"
                              ? "bg-warning/10 text-warning"
                              : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {p.signal}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function SessionsView() {
  return (
    <div className="space-y-3">
      {CALIBRATION_SESSIONS.map((session) => (
        <div
          key={session.id}
          className="bg-card border border-border rounded-xl p-5 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-foreground">
              {session.name}
            </h4>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                session.status === "completed"
                  ? "bg-success/10 text-success"
                  : "bg-warning/10 text-warning"
              }`}
            >
              {session.status === "completed" ? "Completed" : "Scheduled"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="size-3" />
              {session.date}
            </span>
            <span>{session.duration}</span>
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {session.scope}
            </span>
          </div>

          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Facilitator:</span>{" "}
            {session.facilitator} · Participants: {session.participants}
          </p>

          {/* AI Pre-brief */}
          <div className="border-l-[3px] border-brand-purple bg-brand-purple/5 p-2 rounded-r">
            <p className="text-xs text-muted-foreground flex items-start gap-1">
              <Sparkles className="size-3 text-brand-purple mt-0.5 shrink-0" />
              {session.aiPreBrief}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CalibrationTab() {
  const [subView, setSubView] = useState<CalibrationView>("ninebox");

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-5"
    >
      {/* Header */}
      <motion.div variants={fadeUp}>
        <p className="text-sm text-muted-foreground">
          Calibrate performance ratings, visualize talent distribution, and
          benchmark against the market.
        </p>
      </motion.div>

      {/* Sub-view pills */}
      <motion.div variants={fadeUp} className="flex items-center gap-1.5">
        {SUB_VIEWS.map((v) => (
          <button
            key={v.key}
            onClick={() => setSubView(v.key)}
            className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
              subView === v.key
                ? "bg-brand text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {v.label}
          </button>
        ))}
      </motion.div>

      {/* Content */}
      <motion.div variants={fadeUp}>
        {subView === "ninebox" && <NineBoxGrid />}
        {subView === "distribution" && <DistributionView />}
        {subView === "benchmarks" && <BenchmarksView />}
        {subView === "sessions" && <SessionsView />}
      </motion.div>
    </motion.div>
  );
}
