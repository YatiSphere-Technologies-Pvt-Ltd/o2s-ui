"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import {
  Briefcase,
  Users,
  Calendar,
  FileCheck,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MetricData {
  label: string;
  value: number;
  trend: string;
  direction: "up" | "neutral" | "warning";
  icon: LucideIcon;
  accent: "brand" | "brand-teal" | "brand-purple" | "warning";
}

const metrics: MetricData[] = [
  {
    label: "Open Roles",
    value: 24,
    trend: "+3 this week",
    direction: "up",
    icon: Briefcase,
    accent: "brand",
  },
  {
    label: "Active Pipeline",
    value: 312,
    trend: "+18% vs last month",
    direction: "up",
    icon: Users,
    accent: "brand-teal",
  },
  {
    label: "Interviews This Week",
    value: 18,
    trend: "4 scheduled today",
    direction: "neutral",
    icon: Calendar,
    accent: "brand-purple",
  },
  {
    label: "Pending Offers",
    value: 6,
    trend: "2 expiring soon",
    direction: "warning",
    icon: FileCheck,
    accent: "warning",
  },
];

const accentMap: Record<string, { bg: string; text: string }> = {
  brand: { bg: "bg-brand/10", text: "text-brand" },
  "brand-teal": { bg: "bg-brand-teal/10", text: "text-brand-teal" },
  "brand-purple": { bg: "bg-brand-purple/10", text: "text-brand-purple" },
  warning: { bg: "bg-warning/10", text: "text-warning" },
};

function useCountUp(target: number, shouldStart: boolean, duration = 1200): number {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);

  const animate = useCallback(() => {
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  }, [target, duration]);

  useEffect(() => {
    if (shouldStart) {
      animate();
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [shouldStart, animate]);

  return count;
}

function MetricCard({ metric, index }: { metric: MetricData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const displayValue = useCountUp(metric.value, isInView);
  const colors = accentMap[metric.accent];
  const Icon = metric.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="rounded-xl border border-border bg-card p-5 transition hover:border-border/80"
    >
      {/* Icon */}
      <div
        className={`mb-3 flex size-9 items-center justify-center rounded-lg ${colors.bg}`}
      >
        <Icon className={`size-5 ${colors.text}`} />
      </div>

      {/* Value */}
      <div className="text-2xl font-bold text-foreground">{displayValue}</div>

      {/* Label */}
      <div className="mt-0.5 text-sm text-muted-foreground">{metric.label}</div>

      {/* Trend */}
      <div className="mt-2 flex items-center gap-1 text-xs">
        {metric.direction === "up" && (
          <>
            <TrendingUp className="size-3.5 text-success" />
            <span className="text-success">{metric.trend}</span>
          </>
        )}
        {metric.direction === "neutral" && (
          <span className="text-muted-foreground">{metric.trend}</span>
        )}
        {metric.direction === "warning" && (
          <>
            <AlertTriangle className="size-3.5 animate-pulse text-warning" />
            <span className="text-warning">{metric.trend}</span>
          </>
        )}
      </div>
    </motion.div>
  );
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

export function MetricsRow() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
    >
      {metrics.map((metric, i) => (
        <MetricCard key={metric.label} metric={metric} index={i} />
      ))}
    </motion.div>
  );
}
