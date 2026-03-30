"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { type MetricItem, METRICS } from "./data";

function useCountUp(target: number, duration = 1500, inView = true) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    let frame: number;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, inView]);

  return count;
}

const ACCENT_CLASSES: Record<MetricItem["accent"], { icon: string; value: string }> = {
  brand: { icon: "bg-brand/10 text-brand", value: "text-brand" },
  "brand-teal": { icon: "bg-brand-teal/10 text-brand-teal", value: "text-brand-teal" },
  "brand-purple": { icon: "bg-brand-purple/10 text-brand-purple", value: "text-brand-purple" },
  warning: { icon: "bg-warning/10 text-warning", value: "text-warning" },
  success: { icon: "bg-success/10 text-success", value: "text-success" },
  destructive: { icon: "bg-destructive/10 text-destructive", value: "text-destructive" },
};

function MetricCard({ metric, index }: { metric: MetricItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useCountUp(metric.value, 1200, inView);
  const accent = ACCENT_CLASSES[metric.accent];
  const Icon = metric.icon;

  const trendColor =
    metric.direction === "up"
      ? "text-success"
      : metric.direction === "warning"
      ? "text-warning"
      : "text-muted-foreground";

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      className="rounded-xl border border-border bg-card p-4 flex items-start gap-3"
    >
      <div
        className={`size-9 rounded-lg ${accent.icon} flex items-center justify-center shrink-0`}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <div className={`text-xl font-bold ${accent.value} leading-none`}>
          {count}
          {metric.suffix && (
            <span className="text-sm font-semibold ml-0.5">
              {metric.suffix}
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground mt-1 truncate">
          {metric.label}
        </p>
        <p className={`text-[10px] mt-0.5 ${trendColor}`}>{metric.trend}</p>
      </div>
    </motion.div>
  );
}

export function MetricsBar() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {METRICS.map((metric, i) => (
        <MetricCard key={metric.label} metric={metric} index={i} />
      ))}
    </div>
  );
}
