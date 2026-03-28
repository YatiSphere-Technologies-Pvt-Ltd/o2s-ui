"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import {
  PERF_ANALYTICS_KPIS,
  PERF_BY_DEPT,
  PROMOTION_READINESS,
  MARKET_BENCHMARKS,
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

export function PerfAnalyticsTab() {
  const maxAvg = Math.max(...PERF_BY_DEPT.map((d) => d.avg));

  return (
    <motion.div
      variants={stagger}
      initial="initial"
      animate="animate"
      className="space-y-6"
    >
      {/* KPI Cards */}
      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
      >
        {PERF_ANALYTICS_KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-card border border-border rounded-xl p-4 space-y-1"
          >
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              {kpi.label}
            </span>
            <div className="text-xl font-bold text-foreground">{kpi.value}</div>
            <div
              className={`flex items-center gap-1 text-xs ${
                kpi.positive ? "text-success" : "text-destructive"
              }`}
            >
              {kpi.positive ? (
                <TrendingUp className="size-3" />
              ) : (
                <TrendingDown className="size-3" />
              )}
              {kpi.trend}
            </div>
          </div>
        ))}
      </motion.div>

      {/* Performance by Department */}
      <motion.div
        variants={fadeUp}
        className="bg-card border border-border rounded-xl p-5 space-y-4"
      >
        <h3 className="text-sm font-semibold text-foreground">
          Performance by Department
        </h3>
        <div className="space-y-3">
          {PERF_BY_DEPT.map((dept) => (
            <div key={dept.dept} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm text-foreground">{dept.dept}</span>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">
                    {dept.headcount} people
                  </span>
                  <span className="font-medium text-foreground">
                    {dept.avg.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand rounded-full transition-all"
                  style={{ width: `${(dept.avg / maxAvg) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Promotion Readiness */}
      <motion.div
        variants={fadeUp}
        className="bg-card border border-border rounded-xl p-5 space-y-4"
      >
        <h3 className="text-sm font-semibold text-foreground">
          Promotion Readiness
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left font-medium px-3 py-2">Name</th>
                <th className="text-left font-medium px-3 py-2">
                  Current → Next
                </th>
                <th className="text-left font-medium px-3 py-2">Readiness</th>
                <th className="text-left font-medium px-3 py-2">Signal</th>
              </tr>
            </thead>
            <tbody>
              {PROMOTION_READINESS.map((p) => (
                <tr
                  key={p.name}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-3 py-2.5 font-medium text-foreground">
                    {p.name}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {p.current} → {p.next}
                  </td>
                  <td className="px-3 py-2.5">
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
                  <td className="px-3 py-2.5">
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
      </motion.div>

      {/* Market Benchmarks */}
      <motion.div
        variants={fadeUp}
        className="bg-card border border-border rounded-xl p-5 space-y-4"
      >
        <h3 className="text-sm font-semibold text-foreground">
          Market Benchmarks
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-muted-foreground text-xs">
                <th className="text-left font-medium px-3 py-2">Metric</th>
                <th className="text-left font-medium px-3 py-2">Ours</th>
                <th className="text-left font-medium px-3 py-2">Industry</th>
                <th className="text-left font-medium px-3 py-2">Delta</th>
              </tr>
            </thead>
            <tbody>
              {MARKET_BENCHMARKS.map((b) => (
                <tr
                  key={b.metric}
                  className="border-b border-border last:border-0"
                >
                  <td className="px-3 py-2.5 text-foreground">{b.metric}</td>
                  <td className="px-3 py-2.5 font-medium text-foreground">
                    {b.ours}
                  </td>
                  <td className="px-3 py-2.5 text-muted-foreground">
                    {b.industry}
                  </td>
                  <td
                    className={`px-3 py-2.5 font-medium ${
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
      </motion.div>
    </motion.div>
  );
}
