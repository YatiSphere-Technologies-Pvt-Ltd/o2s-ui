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
} from "recharts";
import { DEI_BY_LEVEL, DEI_PIPELINE } from "@/components/analytics/data";

/* ── Shared Tooltip ── */

function DarkTooltip({ active, payload, label }: any) {
  if (!active || !payload) return null;
  return (
    <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} className="text-muted-foreground">
          {p.name}: <span className="font-semibold text-foreground">{p.value}%</span>
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

/* ── Chart 1: Gender by Level ── */

function GenderByLevelChart() {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      className="bg-card border border-border rounded-xl p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Gender by Level
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={DEI_BY_LEVEL} layout="vertical" barSize={20} stackOffset="expand">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
            tick={{ fill: "#8892A8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="level"
            tick={{ fill: "#8892A8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={70}
          />
          <Tooltip content={<DarkTooltip />} />
          <Bar dataKey="female" stackId="g" fill="#8B5CF6" name="Female" radius={[0, 0, 0, 0]} />
          <Bar dataKey="male" stackId="g" fill="#3B82F6" name="Male" radius={[0, 0, 0, 0]} />
          <Bar dataKey="nb" stackId="g" fill="#14B8A6" name="Non-binary" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#8B5CF6" }} /> Female
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#3B82F6" }} /> Male
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#14B8A6" }} /> Non-binary
        </span>
      </div>
    </motion.div>
  );
}

/* ── Chart 2: Pipeline Diversity ── */

function PipelineDiversityChart() {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="show"
      className="bg-card border border-border rounded-xl p-5"
    >
      <h3 className="text-sm font-semibold text-foreground mb-4">
        Pipeline Diversity
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={DEI_PIPELINE} layout="vertical" barSize={20} stackOffset="expand">
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
            tick={{ fill: "#8892A8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="stage"
            tick={{ fill: "#8892A8", fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={70}
          />
          <Tooltip content={<DarkTooltip />} />
          <Bar dataKey="female" stackId="g" fill="#8B5CF6" name="Female" />
          <Bar dataKey="male" stackId="g" fill="#3B82F6" name="Male" />
          <Bar dataKey="nb" stackId="g" fill="#14B8A6" name="Non-binary" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#8B5CF6" }} /> Female
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#3B82F6" }} /> Male
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#14B8A6" }} /> Non-binary
        </span>
      </div>

      {/* AI Annotation */}
      <div className="flex items-start gap-2 mt-4 p-3 rounded-lg bg-warning/5 border border-warning/20">
        <Sparkles className="h-3.5 w-3.5 text-brand-purple mt-0.5 shrink-0" />
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          <span className="font-medium text-foreground">Female representation drops 18pp at Final Round.</span>{" "}
          42% in pipeline narrows to 24% at final round. Consider diverse panel requirement to
          address potential interview panel composition bias.
        </p>
      </div>
    </motion.div>
  );
}

/* ── Main Export ── */

export function DEICharts() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GenderByLevelChart />
      <PipelineDiversityChart />
    </div>
  );
}
