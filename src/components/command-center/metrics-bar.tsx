"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { type MetricItem, METRICS } from "./data";

function useCountUp(target: number, duration = 1000, inView = true) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    let frame: number;
    const start = performance.now();
    const animate = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 4)) * target));
      if (p < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, inView]);

  return count;
}

const ACCENT_CLASSES: Record<MetricItem["accent"], string> = {
  brand: "text-brand",
  "brand-teal": "text-brand-teal",
  "brand-purple": "text-brand-purple",
  warning: "text-warning",
  success: "text-success",
  destructive: "text-destructive",
};

function CompactMetric({ metric, index }: { metric: MetricItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(metric.value, 1000, inView);
  const accent = ACCENT_CLASSES[metric.accent];
  const Icon = metric.icon;

  const trendColor =
    metric.direction === "up" ? "text-success" :
    metric.direction === "warning" ? "text-warning" :
    "text-muted-foreground/50";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border/50 bg-card/50"
    >
      <Icon className={`size-3.5 ${accent} shrink-0`} />
      <div className="min-w-0">
        <span className={`text-sm font-bold ${accent} tabular-nums`}>
          {count}{metric.suffix && <span className="text-xs ml-0.5">{metric.suffix}</span>}
        </span>
        <span className="text-[10px] text-muted-foreground ml-1.5">{metric.label}</span>
      </div>
      <span className={`text-[9px] ml-auto shrink-0 ${trendColor}`}>{metric.trend}</span>
    </motion.div>
  );
}

interface MetricsBarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function MetricsBar({ collapsed = false, onToggle }: MetricsBarProps) {
  if (collapsed) {
    return (
      <button
        onClick={onToggle}
        className="flex items-center gap-3 px-3 py-1.5 rounded-lg border border-border/30 bg-card/30 cursor-pointer hover:bg-secondary/20 transition-colors"
      >
        {METRICS.slice(0, 3).map((m) => {
          const Icon = m.icon;
          return (
            <span key={m.label} className="flex items-center gap-1.5 text-xs">
              <Icon className={`size-3 ${ACCENT_CLASSES[m.accent]}`} />
              <span className={`font-bold tabular-nums ${ACCENT_CLASSES[m.accent]}`}>{m.value}{m.suffix}</span>
              <span className="text-muted-foreground/40">{m.label}</span>
            </span>
          );
        })}
        <ChevronDown className="size-3 text-muted-foreground/30 ml-1" />
      </button>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
      {METRICS.map((metric, i) => (
        <CompactMetric key={metric.label} metric={metric} index={i} />
      ))}
    </div>
  );
}
