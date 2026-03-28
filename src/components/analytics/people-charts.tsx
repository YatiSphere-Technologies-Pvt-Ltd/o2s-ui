"use client";

import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  HEADCOUNT_TREND,
  TENURE_DIST,
  ENGAGEMENT_BREAKDOWN,
} from "@/components/analytics/data";

/* ── Shared tooltip ── */

function DarkTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-muted-foreground">
          {p.name}: <span className="font-semibold text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ── Hardcoded data ── */

const ATTRITION_BY_DEPT = [
  { dept: "Engineering", voluntary: 4, involuntary: 1 },
  { dept: "Sales", voluntary: 3, involuntary: 2 },
  { dept: "Product", voluntary: 2, involuntary: 0 },
  { dept: "Marketing", voluntary: 1, involuntary: 1 },
  { dept: "Design", voluntary: 1, involuntary: 0 },
  { dept: "HR", voluntary: 0, involuntary: 1 },
];

const NEW_HIRE_RETENTION = [
  { day: "30d", pct: 95 },
  { day: "60d", pct: 90 },
  { day: "90d", pct: 85 },
  { day: "180d", pct: 78 },
  { day: "365d", pct: 72 },
];

const TEAM_GROWTH = [
  { month: "Oct '25", Engineering: 8, Sales: 4, Product: 3, Design: 2 },
  { month: "Nov '25", Engineering: 6, Sales: 5, Product: 2, Design: 3 },
  { month: "Dec '25", Engineering: 10, Sales: 3, Product: 4, Design: 1 },
  { month: "Jan '26", Engineering: 12, Sales: 6, Product: 3, Design: 2 },
  { month: "Feb '26", Engineering: 9, Sales: 4, Product: 5, Design: 3 },
  { month: "Mar '26", Engineering: 11, Sales: 5, Product: 4, Design: 2 },
];

/* ── Animation ── */

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

/* ── Component ── */

export function PeopleCharts() {
  const maxAttrition = Math.max(
    ...ATTRITION_BY_DEPT.map((d) => d.voluntary + d.involuntary)
  );

  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {/* Chart 1 — Headcount Trend (full width) */}
      <motion.div
        className="bg-card border border-border rounded-xl p-6 lg:col-span-2"
        variants={item}
      >
        <p className="text-sm font-semibold mb-4">Headcount Trend</p>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={HEADCOUNT_TREND}>
            <defs>
              <linearGradient id="hcGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11 }} />
            <YAxis className="text-xs" tick={{ fontSize: 11 }} />
            <Tooltip content={<DarkTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Area
              type="monotone"
              dataKey="headcount"
              name="Headcount"
              stroke="#3B82F6"
              fill="url(#hcGrad)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#8B5CF6"
              fill="none"
              strokeDasharray="5 5"
              strokeWidth={1.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Chart 2 — Tenure Distribution */}
      <motion.div className="bg-card border border-border rounded-xl p-6" variants={item}>
        <p className="text-sm font-semibold mb-4">Tenure Distribution</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={TENURE_DIST}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="bucket" className="text-xs" tick={{ fontSize: 11 }} />
            <YAxis className="text-xs" tick={{ fontSize: 11 }} />
            <Tooltip content={<DarkTooltip />} />
            <Bar dataKey="count" name="Employees" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Chart 3 — Attrition by Department (custom horizontal bars) */}
      <motion.div className="bg-card border border-border rounded-xl p-6" variants={item}>
        <p className="text-sm font-semibold mb-4">Attrition by Department</p>
        <div className="space-y-3">
          {ATTRITION_BY_DEPT.map((d) => {
            const total = d.voluntary + d.involuntary;
            const volPct = (d.voluntary / maxAttrition) * 100;
            const invPct = (d.involuntary / maxAttrition) * 100;
            return (
              <div key={d.dept}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-muted-foreground">{d.dept}</span>
                  <span className="font-medium text-foreground">{total}</span>
                </div>
                <div className="flex h-5 gap-0.5 rounded overflow-hidden">
                  <div
                    className="bg-destructive/70 rounded-l transition-all"
                    style={{ width: `${volPct}%` }}
                    title={`Voluntary: ${d.voluntary}`}
                  />
                  <div
                    className="bg-warning/70 rounded-r transition-all"
                    style={{ width: `${invPct}%` }}
                    title={`Involuntary: ${d.involuntary}`}
                  />
                </div>
              </div>
            );
          })}
          <div className="flex gap-4 pt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-destructive/70" /> Voluntary
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-sm bg-warning/70" /> Involuntary
            </span>
          </div>
        </div>
      </motion.div>

      {/* Chart 4 — Engagement Breakdown (horizontal bars) */}
      <motion.div className="bg-card border border-border rounded-xl p-6" variants={item}>
        <p className="text-sm font-semibold mb-4">Engagement Breakdown</p>
        <div className="space-y-3">
          {ENGAGEMENT_BREAKDOWN.map((d) => (
            <div key={d.dim}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{d.dim}</span>
                <span className="font-medium text-foreground">{d.score}/100</span>
              </div>
              <div className="h-4 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${d.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Chart 5 — New Hire Retention */}
      <motion.div className="bg-card border border-border rounded-xl p-6" variants={item}>
        <p className="text-sm font-semibold mb-4">New Hire Retention</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={NEW_HIRE_RETENTION}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="day" className="text-xs" tick={{ fontSize: 11 }} />
            <YAxis
              className="text-xs"
              tick={{ fontSize: 11 }}
              domain={[60, 100]}
              tickFormatter={(v: number) => `${v}%`}
            />
            <Tooltip content={<DarkTooltip />} />
            <Line
              type="monotone"
              dataKey="pct"
              name="Retention %"
              stroke="#10B981"
              strokeWidth={2}
              dot={{ r: 4, fill: "#10B981" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Chart 6 — Team Growth (Stacked Bar) */}
      <motion.div className="bg-card border border-border rounded-xl p-6" variants={item}>
        <p className="text-sm font-semibold mb-4">Team Growth</p>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={TEAM_GROWTH}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 11 }} />
            <YAxis className="text-xs" tick={{ fontSize: 11 }} />
            <Tooltip content={<DarkTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="Engineering" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
            <Bar dataKey="Sales" stackId="a" fill="#10B981" />
            <Bar dataKey="Product" stackId="a" fill="#6366F1" />
            <Bar dataKey="Design" stackId="a" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  );
}
