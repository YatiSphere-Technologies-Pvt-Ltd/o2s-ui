"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
  ReferenceLine,
} from "recharts";
import {
  HIRING_FUNNEL,
  SOURCING_DATA,
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

/* ── Chart 1: Hiring Funnel (Full Width) ── */

function HiringFunnelFull() {
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
    <ChartCard title="Hiring Funnel" className="lg:col-span-2">
      <div className="space-y-4">
        {HIRING_FUNNEL.map((stage, i) => {
          const conversionRate =
            i > 0
              ? ((stage.count / HIRING_FUNNEL[i - 1].count) * 100).toFixed(0)
              : null;

          return (
            <div key={stage.stage}>
              {conversionRate && (
                <div className="flex justify-center mb-1.5">
                  <span className="text-[10px] text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded-full">
                    {conversionRate}% pass-through
                  </span>
                </div>
              )}
              <div className="flex items-center gap-4">
                <span className="text-xs text-muted-foreground w-24 shrink-0">
                  {stage.stage}
                </span>
                <div className="flex-1 relative h-9 bg-secondary/50 rounded-lg overflow-hidden">
                  <motion.div
                    className="absolute inset-y-0 left-0 rounded-lg"
                    style={{ background: funnelColors[i] }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(stage.count / maxCount) * 100}%` }}
                    transition={{ duration: 0.8, delay: i * 0.1, ease: "easeOut" as const }}
                  />
                  <div className="relative z-10 flex items-center h-full px-3 justify-between">
                    <span className="text-sm font-semibold text-foreground">
                      {stage.count}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {stage.percentage}%
                    </span>
                  </div>
                </div>
                <div className="w-20 shrink-0 text-right">
                  <span
                    className={`text-xs font-medium ${
                      stage.percentage >= stage.benchmark
                        ? "text-success"
                        : "text-destructive"
                    }`}
                  >
                    vs bench:{" "}
                    {stage.percentage >= stage.benchmark ? "+" : ""}
                    {(stage.percentage - stage.benchmark).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-5 pt-4 border-t border-border flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Overall conversion (Applied to Hired)</span>
        <span className="text-sm font-bold text-foreground">
          {HIRING_FUNNEL[HIRING_FUNNEL.length - 1].percentage}%
        </span>
      </div>
    </ChartCard>
  );
}

/* ── Chart 2: Sourcing Channel Effectiveness ── */

function SourcingChannelChart() {
  return (
    <ChartCard
      title="Sourcing Channel Effectiveness"
      aiFooter="Referrals produce 3.2x higher interview rates than LinkedIn."
    >
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={SOURCING_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="channel" tick={{ fill: "#8892A8", fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#8892A8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<DarkTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            iconSize={8}
          />
          <Bar dataKey="volume" fill="#3B82F6" radius={[3, 3, 0, 0]} name="Volume" />
          <Bar dataKey="quality" fill="#14B8A6" radius={[3, 3, 0, 0]} name="Quality %" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ── Chart 3: Time to Fill by Department ── */

const DEPT_TTF = [
  { dept: "Engineering", days: 42 },
  { dept: "Sales", days: 28 },
  { dept: "Product", days: 38 },
  { dept: "Marketing", days: 22 },
  { dept: "Design", days: 48 },
  { dept: "Finance", days: 32 },
];

function getHealthColor(days: number): string {
  if (days < 30) return "bg-success";
  if (days <= 45) return "bg-warning";
  return "bg-destructive";
}

function getHealthText(days: number): string {
  if (days < 30) return "text-success";
  if (days <= 45) return "text-warning";
  return "text-destructive";
}

function TimeToFillByDeptChart() {
  const maxDays = Math.max(...DEPT_TTF.map((d) => d.days));

  return (
    <ChartCard title="Time to Fill by Department">
      <div className="space-y-3">
        {DEPT_TTF.map((d, i) => (
          <div key={d.dept} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-24 shrink-0">{d.dept}</span>
            <div className="flex-1 relative h-6 bg-secondary/50 rounded-md overflow-hidden">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-md ${getHealthColor(d.days)}`}
                initial={{ width: 0 }}
                animate={{ width: `${(d.days / maxDays) * 100}%` }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" as const }}
                style={{ opacity: 0.8 }}
              />
              <div className="relative z-10 flex items-center h-full px-2">
                <span className={`text-xs font-semibold ${getHealthText(d.days)}`}>
                  {d.days}d
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center gap-4 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" /> &lt;30d</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" /> 30-45d</span>
        <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" /> &gt;45d</span>
      </div>
    </ChartCard>
  );
}

/* ── Chart 4: Hiring Velocity ── */

const HIRING_VELOCITY = [
  { month: "Oct", offers: 6, hires: 5, target: 7 },
  { month: "Nov", offers: 8, hires: 7, target: 7 },
  { month: "Dec", offers: 5, hires: 4, target: 6 },
  { month: "Jan", offers: 7, hires: 6, target: 8 },
  { month: "Feb", offers: 9, hires: 8, target: 8 },
  { month: "Mar", offers: 6, hires: 4, target: 8 },
];

function HiringVelocityChart() {
  return (
    <ChartCard title="Hiring Velocity">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={HIRING_VELOCITY}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" tick={{ fill: "#8892A8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#8892A8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<DarkTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />
          <Line type="monotone" dataKey="offers" stroke="#3B82F6" strokeWidth={2} name="Offers" dot={{ fill: "#3B82F6", r: 3 }} />
          <Line type="monotone" dataKey="hires" stroke="#14B8A6" strokeWidth={2} name="Hires" dot={{ fill: "#14B8A6", r: 3 }} />
          <Line type="monotone" dataKey="target" stroke="#64748B" strokeWidth={1.5} strokeDasharray="6 4" dot={false} name="Target" />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ── Chart 5: Offer Competitiveness ── */

const OFFER_COMP = [
  { role: "SDE-2", yours: 24, market: 22 },
  { role: "SDE-3", yours: 36, market: 38 },
  { role: "PM", yours: 30, market: 32 },
  { role: "Designer", yours: 20, market: 21 },
  { role: "Data Eng", yours: 28, market: 26 },
];

function OfferCompetitivenessChart() {
  return (
    <ChartCard title="Offer Competitiveness (P50, in LPA)">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={OFFER_COMP}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="role" tick={{ fill: "#8892A8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "#8892A8", fontSize: 11 }} axisLine={false} tickLine={false} />
          <Tooltip content={<DarkTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11 }} iconSize={8} />
          <Bar dataKey="yours" fill="#3B82F6" radius={[3, 3, 0, 0]} name="Your Offer" />
          <Bar dataKey="market" fill="#64748B" radius={[3, 3, 0, 0]} name="Market P50" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/* ── Chart 6: Recruiter Workload ── */

const RECRUITER_LOAD = [
  { name: "Ananya S.", candidates: 52 },
  { name: "Ravi K.", candidates: 48 },
  { name: "Meera P.", candidates: 55 },
  { name: "Vikram D.", candidates: 38 },
];

const CAPACITY = 50;

function RecruiterWorkloadChart() {
  const maxCandidates = Math.max(...RECRUITER_LOAD.map((r) => r.candidates), CAPACITY + 10);

  return (
    <ChartCard title="Recruiter Workload">
      <div className="space-y-3">
        {RECRUITER_LOAD.map((r, i) => {
          const overCapacity = r.candidates > CAPACITY;
          return (
            <div key={r.name} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-24 shrink-0 truncate">{r.name}</span>
              <div className="flex-1 relative h-7 bg-secondary/50 rounded-md overflow-hidden">
                {/* Capacity marker */}
                <div
                  className="absolute inset-y-0 border-r-2 border-dashed border-muted-foreground/40 z-10"
                  style={{ left: `${(CAPACITY / maxCandidates) * 100}%` }}
                />
                <motion.div
                  className={`absolute inset-y-0 left-0 rounded-md ${
                    overCapacity ? "bg-warning" : "bg-brand"
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(r.candidates / maxCandidates) * 100}%` }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" as const }}
                  style={{ opacity: 0.8 }}
                />
                <div className="relative z-10 flex items-center h-full px-2">
                  <span
                    className={`text-xs font-semibold ${
                      overCapacity ? "text-warning" : "text-foreground"
                    }`}
                  >
                    {r.candidates}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-0.5 w-4 border-t-2 border-dashed border-muted-foreground/40" /> Capacity ({CAPACITY})
        </span>
        <span className="flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-warning" /> Over capacity
        </span>
      </div>
    </ChartCard>
  );
}

/* ── Main Export ── */

export function RecruitingCharts() {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <HiringFunnelFull />
      <SourcingChannelChart />
      <TimeToFillByDeptChart />
      <HiringVelocityChart />
      <OfferCompetitivenessChart />
      <RecruiterWorkloadChart />
    </motion.div>
  );
}
