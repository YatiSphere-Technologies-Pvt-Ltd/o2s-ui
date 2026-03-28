"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  BarChart,
  Bar,
  ReferenceLine,
} from "recharts";
import {
  HEADCOUNT_TREND,
  HIRING_FUNNEL,
  DEPT_BREAKDOWN,
  ATTRITION_TREND,
  TTF_DISTRIBUTION,
  AI_ACCURACY_TREND,
} from "@/components/analytics/data";

/* ── Shared Dark Tooltip ── */

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

/* ── Animation Variants ── */

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

/* ── Chart Card Wrapper ── */

function ChartCard({
  children,
  title,
  className = "",
  aiFooter,
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
  aiFooter?: string;
}) {
  return (
    <motion.div
      variants={cardVariants}
      className={`bg-card border border-border rounded-xl p-6 ${className}`}
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">{title}</h3>
      {children}
      {aiFooter && (
        <div className="flex items-center gap-1.5 mt-4">
          <Sparkles className="h-3 w-3 text-brand-purple" />
          <p className="text-[11px] text-muted-foreground">{aiFooter}</p>
        </div>
      )}
    </motion.div>
  );
}

/* ── Chart 1: Headcount Trend ── */

function HeadcountTrendChart() {
  return (
    <ChartCard
      title="Headcount Trend"
      className="lg:col-span-2"
      aiFooter="On track to reach 160 target by H1 end."
    >
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={HEADCOUNT_TREND}>
          <defs>
            <linearGradient id="headcountFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" tick={{ fill: "#8892A8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#8892A8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[100, "auto"]} />
          <Tooltip content={<DarkTooltip />} />
          <Area
            type="monotone"
            dataKey="headcount"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#headcountFill)"
            name="Headcount"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="#64748B"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            dot={false}
            name="Target"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ── Chart 2: Hiring Funnel (custom HTML) ── */

function HiringFunnelChart() {
  const maxCount = HIRING_FUNNEL[0].count;
  const funnelColors = [
    "linear-gradient(90deg, #6366F1, #818CF8)",
    "linear-gradient(90deg, #6366F1, #7C3AED)",
    "linear-gradient(90deg, #7C3AED, #3B82F6)",
    "linear-gradient(90deg, #3B82F6, #14B8A6)",
    "linear-gradient(90deg, #14B8A6, #10B981)",
    "linear-gradient(90deg, #10B981, #059669)",
  ];

  return (
    <ChartCard title="Hiring Funnel">
      <div className="space-y-3">
        {HIRING_FUNNEL.map((stage, i) => {
          const conversionRate =
            i > 0
              ? ((stage.count / HIRING_FUNNEL[i - 1].count) * 100).toFixed(0)
              : null;

          return (
            <div key={stage.stage}>
              {conversionRate && (
                <div className="flex justify-center mb-1">
                  <span className="text-[10px] text-muted-foreground">
                    {conversionRate}% conversion
                  </span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-20 shrink-0">
                  {stage.stage}
                </span>
                <div className="flex-1 relative h-7 bg-secondary/50 rounded-md overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-md"
                    style={{ background: funnelColors[i] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(stage.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" as const }}
                  />
                  <div className="relative z-10 flex items-center h-full px-2 justify-between">
                    <span className="text-xs font-semibold text-foreground">
                      {stage.count}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {stage.percentage}%
                    </span>
                  </div>
                </div>
                <span
                  className={`text-[10px] w-10 text-right ${
                    stage.percentage >= stage.benchmark
                      ? "text-success"
                      : "text-destructive"
                  }`}
                >
                  {stage.percentage >= stage.benchmark ? "+" : ""}
                  {(stage.percentage - stage.benchmark).toFixed(1)}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Overall conversion</span>
          <span className="text-sm font-semibold text-foreground">
            {HIRING_FUNNEL[HIRING_FUNNEL.length - 1].percentage}%
          </span>
        </div>
      </div>
    </ChartCard>
  );
}

/* ── Chart 3: Department Breakdown (Donut) ── */

function DeptBreakdownChart() {
  return (
    <ChartCard title="Department Breakdown">
      <div className="flex flex-col items-center">
        <div className="relative">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={DEPT_BREAKDOWN}
                dataKey="count"
                nameKey="dept"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                strokeWidth={0}
              >
                {DEPT_BREAKDOWN.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<DarkTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold text-foreground">142</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mt-4 w-full">
          {DEPT_BREAKDOWN.map((d) => (
            <div key={d.dept} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full shrink-0"
                style={{ backgroundColor: d.color }}
              />
              <span className="text-xs text-muted-foreground truncate">{d.dept}</span>
              <span className="text-xs font-medium text-foreground ml-auto">{d.count}</span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}

/* ── Chart 4: Attrition Trend ── */

function AttritionTrendChart() {
  return (
    <ChartCard title="Attrition Trend">
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={ATTRITION_TREND}>
          <defs>
            <linearGradient id="attritionFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" tick={{ fill: "#8892A8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#8892A8", fontSize: 11 }} axisLine={false} tickLine={false} domain={[7, 12]} />
          <Tooltip content={<DarkTooltip />} />
          <Area
            type="monotone"
            dataKey="rate"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#attritionFill)"
            name="Rate"
          />
          <Line
            type="monotone"
            dataKey="benchmark"
            stroke="#64748B"
            strokeWidth={1.5}
            strokeDasharray="6 4"
            dot={false}
            name="Benchmark"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ── Chart 5: Time to Fill Distribution ── */

function TTFDistributionChart() {
  return (
    <ChartCard title="Time to Fill Distribution">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={TTF_DISTRIBUTION}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="label" tick={{ fill: "#8892A8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#8892A8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<DarkTooltip />} />
          <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Roles" />
          <ReferenceLine x="26-35" stroke="#10B981" strokeDasharray="6 4" strokeWidth={1.5} label={{ value: "Median", fill: "#10B981", fontSize: 10, position: "top" }} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ── Chart 6: AI Performance ── */

function AIPerformanceCard() {
  return (
    <motion.div
      variants={cardVariants}
      className="bg-brand-purple/[0.03] border border-brand-purple/20 rounded-xl overflow-hidden"
    >
      {/* Top gradient bar */}
      <div className="h-[3px] bg-gradient-to-r from-brand-purple via-brand to-brand-teal" />
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-4 w-4 text-brand-purple" />
          <h3 className="text-sm font-semibold text-foreground">AI Performance</h3>
        </div>

        {/* Big stat cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">2,847</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Screened</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">91%</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Accuracy</p>
          </div>
          <div className="bg-secondary/50 rounded-lg p-3 text-center">
            <p className="text-lg font-bold text-foreground">~360 hrs</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Time Saved</p>
          </div>
        </div>

        {/* AI vs Human accuracy trend */}
        <p className="text-[11px] text-muted-foreground mb-2">Screening Accuracy Trend</p>
        <ResponsiveContainer width="100%" height={100}>
          <LineChart data={AI_ACCURACY_TREND}>
            <XAxis dataKey="month" tick={{ fill: "#8892A8", fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip content={<DarkTooltip />} />
            <Line type="monotone" dataKey="ai" stroke="#8B5CF6" strokeWidth={2} dot={false} name="AI" />
            <Line type="monotone" dataKey="human" stroke="#64748B" strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Human" />
          </LineChart>
        </ResponsiveContainer>

        {/* ROI */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">ROI:</span>
          <span className="bg-success/10 text-success text-xs font-semibold px-2 py-0.5 rounded-md">
            4.3x return
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main Export ── */

export function OverviewCharts() {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <HeadcountTrendChart />
      <HiringFunnelChart />
      <DeptBreakdownChart />
      <AttritionTrendChart />
      <TTFDistributionChart />
      <AIPerformanceCard />
    </motion.div>
  );
}
