"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Clock, AlertTriangle, Briefcase } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";
import {
  HEADCOUNT_TREND,
  DEPARTMENTS,
  TENURE_DISTRIBUTION,
  ATTRITION_RISK_MATRIX,
  LOCATIONS,
  HIRING_VS_ATTRITION,
} from "@/components/people/data";

/* ── Custom Dark Tooltip ── */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-muted-foreground">
          {p.name}: <span className="font-semibold text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ── Animated Counter ── */

function AnimatedCount({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 1200;
    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [target]);

  return (
    <span ref={ref}>
      {target % 1 !== 0 ? (count / 10).toFixed(1) : count}
      {suffix}
    </span>
  );
}

/* ── Chart Card Wrapper with stagger animation ── */

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.45, ease: "easeOut" as const },
  }),
};

function ChartCard({
  title,
  index,
  children,
  aiPowered = false,
}: {
  title: string;
  index: number;
  children: React.ReactNode;
  aiPowered?: boolean;
}) {
  return (
    <motion.div
      custom={index}
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className={`bg-card border border-border rounded-xl p-6 ${aiPowered ? "border-t-2 border-t-brand-purple" : ""}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {aiPowered && <Sparkles className="size-3.5 text-brand-purple" />}
      </div>
      {children}
    </motion.div>
  );
}

/* ── Department color map for Recharts (needs hex) ── */

const DEPT_COLOR_MAP: Record<string, string> = {
  eng: "#3B82F6",
  sales: "#10B981",
  product: "#6366F1",
  design: "#8B5CF6",
  marketing: "#F59E0B",
  hr: "#14B8A6",
  finance: "#F43F5E",
  ops: "#64748B",
};

const LOCATION_COLORS = ["#3B82F6", "#14B8A6", "#8B5CF6", "#F59E0B"];

/* ── Summary Metrics ── */

const METRICS = [
  {
    label: "Total Headcount",
    value: 142,
    decimals: false,
    suffix: "",
    trend: "+12 YTD",
    trendClass: "text-success",
    icon: TrendingUp,
  },
  {
    label: "Avg Tenure",
    value: 24, // animate as x10 then divide
    decimals: true,
    suffix: " years",
    displayValue: "2.4",
    trend: "+0.3 vs last year",
    trendClass: "text-success",
    icon: Clock,
  },
  {
    label: "Attrition Rate",
    value: 82, // animate as x10
    decimals: true,
    suffix: "%",
    displayValue: "8.2",
    trend: "-1.1% vs industry",
    trendClass: "text-success",
    icon: AlertTriangle,
  },
  {
    label: "Open Positions",
    value: 24,
    decimals: false,
    suffix: "",
    trend: "6 critical",
    trendClass: "text-warning",
    icon: Briefcase,
  },
];

/* ── Sorted departments data for bar chart ── */

const sortedDepts = [...DEPARTMENTS].sort((a, b) => b.count - a.count);

/* ── Attrition Risk intensity helper ── */

function riskCellClass(level: "low" | "medium" | "high", count: number): string {
  const maxes = { low: 40, medium: 10, high: 3 };
  const base = { low: "bg-success", medium: "bg-warning", high: "bg-destructive" };
  const max = maxes[level];
  const ratio = Math.min(count / max, 1);
  // Map ratio to opacity tiers: 10, 20, 30, 40
  if (ratio <= 0.25) return `${base[level]}/10`;
  if (ratio <= 0.5) return `${base[level]}/20`;
  if (ratio <= 0.75) return `${base[level]}/30`;
  return `${base[level]}/40`;
}

/* ── Main AnalyticsView ── */

export function AnalyticsView() {
  return (
    <div className="space-y-6">
      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((m, i) => {
          const Icon = m.icon;
          return (
            <motion.div
              key={m.label}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="size-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground font-medium">{m.label}</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {m.decimals ? (
                  <AnimatedCount target={m.value} suffix={m.suffix} />
                ) : (
                  <>
                    <AnimatedCount target={m.value} />
                    {m.suffix}
                  </>
                )}
              </div>
              <p className={`text-xs mt-1 ${m.trendClass}`}>{m.trend}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Headcount Over Time */}
        <ChartCard title="Headcount Over Time" index={4}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={HEADCOUNT_TREND}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#8892A8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8892A8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                domain={["dataMin - 5", "dataMax + 5"]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ r: 3, fill: "#3B82F6" }}
                activeDot={{ r: 5, fill: "#3B82F6" }}
                name="Headcount"
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 2: Department Breakdown (Horizontal Bar) */}
        <ChartCard title="Department Breakdown" index={5}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart layout="vertical" data={sortedDepts} margin={{ left: 20 }}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fill: "#8892A8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fill: "#8892A8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Employees" radius={[0, 4, 4, 0]} barSize={20}>
                {sortedDepts.map((dept) => (
                  <Cell
                    key={dept.id}
                    fill={DEPT_COLOR_MAP[dept.id] || "#64748B"}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 3: Tenure Distribution (Vertical Bar) */}
        <ChartCard title="Tenure Distribution" index={6}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={TENURE_DISTRIBUTION}>
              <defs>
                <linearGradient id="tenureGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                  <stop offset="100%" stopColor="#14B8A6" stopOpacity={1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="bucket"
                tick={{ fill: "#8892A8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8892A8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="count"
                name="Employees"
                fill="url(#tenureGrad)"
                radius={[4, 4, 0, 0]}
                barSize={36}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Chart 4: Attrition Risk Heatmap (custom grid) */}
        <ChartCard title="Predicted Attrition Risk" index={7} aiPowered>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-3 text-muted-foreground font-medium">
                    Department
                  </th>
                  <th className="text-center py-2 px-3 text-success font-medium">Low</th>
                  <th className="text-center py-2 px-3 text-warning font-medium">Medium</th>
                  <th className="text-center py-2 px-3 text-destructive font-medium">High</th>
                </tr>
              </thead>
              <tbody>
                {ATTRITION_RISK_MATRIX.map((row) => (
                  <tr key={row.department} className="border-b border-border/50">
                    <td className="py-2 pr-3 text-foreground font-medium">{row.department}</td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-10 h-7 rounded ${riskCellClass("low", row.low)} text-foreground font-semibold`}
                      >
                        {row.low}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-10 h-7 rounded ${riskCellClass("medium", row.medium)} text-foreground font-semibold`}
                      >
                        {row.medium}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-10 h-7 rounded ${riskCellClass("high", row.high)} text-foreground font-semibold`}
                      >
                        {row.high}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ChartCard>

        {/* Chart 5: Location Distribution (Donut) */}
        <ChartCard title="Location Distribution" index={8}>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={LOCATIONS}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {LOCATIONS.map((_, i) => (
                    <Cell key={i} fill={LOCATION_COLORS[i % LOCATION_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  iconType="circle"
                  iconSize={8}
                  formatter={(value: string) => (
                    <span className="text-xs text-muted-foreground">{value}</span>
                  )}
                />
                {/* Center text */}
                <text
                  x="50%"
                  y="46%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-foreground text-xl font-bold"
                >
                  142
                </text>
                <text
                  x="50%"
                  y="56%"
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-muted-foreground text-xs"
                >
                  total
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Chart 6: Hiring vs Attrition (Grouped Bar) */}
        <ChartCard title="Hiring vs Attrition" index={9}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={HIRING_VS_ATTRITION}>
              <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: "#8892A8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "#8892A8", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="hires"
                name="Hires"
                fill="#10B981"
                radius={[4, 4, 0, 0]}
                barSize={16}
              />
              <Bar
                dataKey="departures"
                name="Departures"
                fill="#EF4444"
                radius={[4, 4, 0, 0]}
                barSize={16}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}
