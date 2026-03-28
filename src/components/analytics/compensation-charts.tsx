"use client";

import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Scatter,
  ComposedChart,
  ReferenceLine,
} from "recharts";
import { COMP_BANDS } from "@/components/analytics/data";

/* ── Dark Tooltip ── */

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

/* ── Animation ── */

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

/* ── Compa-Ratio Data ── */

const COMPA_RATIO_DATA = [
  { dept: "Engineering", ratio: 0.98 },
  { dept: "Sales", ratio: 1.02 },
  { dept: "Design", ratio: 0.94 },
  { dept: "Product", ratio: 0.97 },
  { dept: "Marketing", ratio: 0.96 },
  { dept: "HR", ratio: 1.01 },
  { dept: "Finance", ratio: 0.99 },
  { dept: "Ops", ratio: 0.95 },
];

/* ── Custom Dot for "Yours" ── */

function YoursDot(props: any) {
  const { cx, cy } = props;
  if (cx == null || cy == null) return null;
  return (
    <circle cx={cx} cy={cy} r={5} fill="#F43F5E" stroke="#fff" strokeWidth={1.5} />
  );
}

/* ── Chart 1: Salary Bands ── */

function SalaryBandsChart() {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      className="bg-card border border-border rounded-xl p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Salary Bands (₹L)
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <ComposedChart data={COMP_BANDS} barGap={2}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis
            dataKey="level"
            tick={{ fill: "#8892A8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#8892A8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            label={{ value: "₹ Lakhs", angle: -90, position: "insideLeft", fill: "#8892A8", fontSize: 10 }}
          />
          <Tooltip content={<DarkTooltip />} />
          <Bar dataKey="p25" fill="#3B82F6" fillOpacity={0.3} radius={[2, 2, 0, 0]} name="P25" />
          <Bar dataKey="p50" fill="#3B82F6" fillOpacity={0.6} radius={[2, 2, 0, 0]} name="P50" />
          <Bar dataKey="p75" fill="#3B82F6" fillOpacity={0.9} radius={[2, 2, 0, 0]} name="P75" />
          <Scatter dataKey="yours" fill="#F43F5E" name="You" shape={<YoursDot />} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand/30" /> P25
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand/60" /> P50
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-brand/90" /> P75
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive" /> You
        </span>
      </div>
    </motion.div>
  );
}

/* ── Chart 2: Compa-Ratio by Department ── */

function CompaRatioChart() {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      className="bg-card border border-border rounded-xl p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Compa-Ratio by Department
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={COMPA_RATIO_DATA} layout="vertical" barSize={18}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis
            type="number"
            domain={[0.88, 1.1]}
            tick={{ fill: "#8892A8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="dept"
            tick={{ fill: "#8892A8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={80}
          />
          <Tooltip content={<DarkTooltip />} />
          <ReferenceLine x={0.95} stroke="#64748B" strokeDasharray="4 3" />
          <ReferenceLine x={1.05} stroke="#64748B" strokeDasharray="4 3" />
          <ReferenceLine x={1.0} stroke="#8892A8" strokeWidth={1} />
          <Bar dataKey="ratio" radius={[0, 4, 4, 0]} name="Compa-Ratio">
            {COMPA_RATIO_DATA.map((entry, index) => {
              const inRange = entry.ratio >= 0.95 && entry.ratio <= 1.05;
              return (
                <Cell
                  key={index}
                  fill={inRange ? "#10B981" : "#F59E0B"}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-success" /> In range (0.95–1.05)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm bg-warning" /> Out of range
        </span>
      </div>
    </motion.div>
  );
}

/* ── Main Export ── */

export function CompensationCharts() {
  return (
    <div className="space-y-6">
      <SalaryBandsChart />
      <CompaRatioChart />
    </div>
  );
}
