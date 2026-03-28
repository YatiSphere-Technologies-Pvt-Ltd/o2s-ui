"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  Clock,
  ThumbsUp,
  IndianRupee,
  Activity,
  Sparkles,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  JOBS,
  SOURCING_CHANNELS,
  HIRING_VELOCITY,
  PIPELINE_STAGES,
  healthBarColor,
  healthLabel,
  healthColor,
} from "@/components/jobs/data";

/* ------------------------------------------------------------------ */
/*  Custom Tooltip                                                     */
/* ------------------------------------------------------------------ */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-muted-foreground">
          {p.name}:{" "}
          <span className="font-semibold text-foreground">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chart Card Wrapper                                                 */
/* ------------------------------------------------------------------ */

function ChartCard({
  title,
  children,
  index,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  index: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.3 }}
      className={`bg-card border border-border rounded-xl p-5 space-y-4 ${className}`}
    >
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Summary Card                                                       */
/* ------------------------------------------------------------------ */

function SummaryCard({
  icon: Icon,
  label,
  value,
  trend,
  trendClass,
  index,
  extra,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  trend: string;
  trendClass: string;
  index: number;
  extra?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.25 }}
      className="bg-card border border-border rounded-xl p-5 space-y-2"
    >
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
      <p className={`text-xs font-medium ${trendClass}`}>{trend}</p>
      {extra}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chart 1: Time to Fill by Role                                      */
/* ------------------------------------------------------------------ */

function TimeToFillChart() {
  const data = useMemo(() => {
    return JOBS.filter((j) => j.status === "active")
      .map((j) => ({
        name: j.title.length > 18 ? j.title.slice(0, 18) + "…" : j.title,
        daysOpen: j.daysOpen ?? 0,
        health: j.healthScore ?? 0,
      }))
      .sort((a, b) => b.daysOpen - a.daysOpen);
  }, []);

  function barFill(health: number): string {
    if (health >= 70) return "var(--color-success)";
    if (health >= 40) return "var(--color-warning)";
    return "var(--color-destructive)";
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
        <XAxis
          type="number"
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          width={130}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="daysOpen" name="Days Open" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={barFill(entry.health)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Chart 2: Pipeline Conversion Funnel (custom HTML)                  */
/* ------------------------------------------------------------------ */

function PipelineFunnel() {
  const totals = useMemo(() => {
    const activeJobs = JOBS.filter((j) => j.status === "active");
    return PIPELINE_STAGES.map((stage) => ({
      ...stage,
      count: activeJobs.reduce(
        (sum, j) => sum + j.pipeline[stage.key as keyof typeof j.pipeline],
        0
      ),
    }));
  }, []);

  const maxCount = Math.max(...totals.map((s) => s.count), 1);

  return (
    <div className="space-y-2.5">
      {totals.map((stage, i) => {
        const pct = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
        const convRate =
          i > 0 && totals[i - 1].count > 0
            ? ((stage.count / totals[i - 1].count) * 100).toFixed(0)
            : null;

        return (
          <div key={stage.key} className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground font-medium">{stage.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-foreground font-semibold tabular-nums">
                  {stage.count}
                </span>
                {convRate !== null && (
                  <span className="text-muted-foreground text-[10px]">
                    ({convRate}% conv.)
                  </span>
                )}
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${stage.colorClass}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Chart 3: Sourcing Channel Effectiveness                            */
/* ------------------------------------------------------------------ */

function SourcingChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={SOURCING_CHANNELS} margin={{ left: -10, right: 10 }}>
        <XAxis
          dataKey="channel"
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "var(--color-muted-foreground)" }}
        />
        <Bar
          dataKey="volume"
          name="Volume"
          fill="var(--color-brand)"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="qualityPct"
          name="Quality %"
          fill="var(--color-brand-teal)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Chart 4: Hiring Velocity                                           */
/* ------------------------------------------------------------------ */

function HiringVelocityChart() {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={HIRING_VELOCITY} margin={{ left: -10, right: 10 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border)"
          vertical={false}
        />
        <XAxis
          dataKey="month"
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: "var(--color-muted-foreground)" }}
        />
        <ReferenceLine
          y={7}
          stroke="var(--color-muted-foreground)"
          strokeDasharray="6 4"
          label={{
            value: "Target",
            fill: "var(--color-muted-foreground)",
            fontSize: 10,
            position: "insideTopRight",
          }}
        />
        <Line
          type="monotone"
          dataKey="offers"
          name="Offers"
          stroke="var(--color-brand)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-brand)" }}
          activeDot={{ r: 5 }}
        />
        <Line
          type="monotone"
          dataKey="hires"
          name="Hires"
          stroke="var(--color-success)"
          strokeWidth={2}
          dot={{ r: 3, fill: "var(--color-success)" }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

/* ------------------------------------------------------------------ */
/*  Chart 5: AI Recruiter Performance                                  */
/* ------------------------------------------------------------------ */

const AI_STATS: { label: string; value: string }[] = [
  { label: "Candidates Screened", value: "847" },
  { label: "Screening Accuracy", value: "91%" },
  { label: "Sourced Candidates", value: "156" },
  { label: "Questions Generated", value: "89" },
  { label: "JDs Optimized", value: "14" },
  { label: "Time Saved", value: "~120 hrs" },
];

function AIPerformanceCard({ index }: { index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 + index * 0.08, duration: 0.3 }}
      className="bg-brand-purple/[0.03] border border-brand-purple/20 rounded-xl p-5 space-y-4"
    >
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-brand-purple" />
        <h3 className="text-sm font-semibold text-foreground">
          AI Recruiter Performance
        </h3>
      </div>
      <div className="space-y-3">
        {AI_STATS.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-between py-1.5 border-b border-border last:border-0"
          >
            <span className="text-sm text-muted-foreground">{stat.label}</span>
            <span className="text-sm font-bold text-foreground tabular-nums">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export function JobsAnalyticsView() {
  const activeJobs = useMemo(
    () => JOBS.filter((j) => j.status === "active"),
    []
  );

  const avgTimeToFill = useMemo(() => {
    if (activeJobs.length === 0) return 0;
    return Math.round(
      activeJobs.reduce((sum, j) => sum + j.estimatedTimeToFill, 0) /
        activeJobs.length
    );
  }, [activeJobs]);

  const avgHealth = useMemo(() => {
    const scored = activeJobs.filter((j) => j.healthScore !== null);
    if (scored.length === 0) return null;
    return Math.round(
      scored.reduce((sum, j) => sum + (j.healthScore ?? 0), 0) / scored.length
    );
  }, [activeJobs]);

  return (
    <div className="px-6 pb-6 space-y-6">
      {/* ── Summary Row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <SummaryCard
          icon={Briefcase}
          label="Open Roles"
          value={String(activeJobs.length)}
          trend="+6 vs last quarter"
          trendClass="text-success"
          index={0}
        />
        <SummaryCard
          icon={Clock}
          label="Avg Time to Fill"
          value={`${avgTimeToFill} days`}
          trend="-8 days"
          trendClass="text-success"
          index={1}
        />
        <SummaryCard
          icon={ThumbsUp}
          label="Offer Accept Rate"
          value="87%"
          trend="+5% vs benchmark"
          trendClass="text-success"
          index={2}
        />
        <SummaryCard
          icon={IndianRupee}
          label="Cost per Hire"
          value="₹1.2L"
          trend="-12% vs last year"
          trendClass="text-success"
          index={3}
        />
        <SummaryCard
          icon={Activity}
          label="Pipeline Health"
          value={avgHealth !== null ? String(avgHealth) : "—"}
          trend={avgHealth !== null ? healthLabel(avgHealth) : "—"}
          trendClass={healthColor(avgHealth)}
          index={4}
          extra={
            avgHealth !== null ? (
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${healthBarColor(avgHealth)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${avgHealth}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            ) : null
          }
        />
      </div>

      {/* ── Charts Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Time to Fill by Role" index={0}>
          <TimeToFillChart />
        </ChartCard>

        <ChartCard title="Pipeline Conversion Funnel" index={1}>
          <PipelineFunnel />
        </ChartCard>

        <ChartCard title="Sourcing Channel Effectiveness" index={2}>
          <SourcingChart />
        </ChartCard>

        <ChartCard title="Hiring Velocity" index={3}>
          <HiringVelocityChart />
        </ChartCard>

        <AIPerformanceCard index={4} />
      </div>
    </div>
  );
}
