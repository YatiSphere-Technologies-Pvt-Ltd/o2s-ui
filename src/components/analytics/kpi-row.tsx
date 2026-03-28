"use client";

import { useEffect, useRef, useState } from "react";
import {
  Users,
  Briefcase,
  Clock,
  TrendingDown,
  TrendingUp,
  Heart,
  IndianRupee,
  CheckCircle,
  Target,
  Calendar,
  UserCheck,
  ArrowUpRight,
  Scale,
  Equal,
  Wallet,
  BarChart3,
  Crown,
  UserPlus,
  AlertTriangle,
} from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";
import type { KPI } from "@/components/analytics/data";
import { formatKPIValue, trendColorClass } from "@/components/analytics/data";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Users,
  Briefcase,
  Clock,
  TrendingDown,
  TrendingUp,
  Heart,
  IndianRupee,
  CheckCircle,
  Target,
  Calendar,
  UserCheck,
  ArrowUpRight,
  Scale,
  Equal,
  Wallet,
  BarChart3,
  Crown,
  UserPlus,
  AlertTriangle,
};

const ACCENT_BG: Record<string, string> = {
  brand: "bg-brand/10 text-brand",
  info: "bg-brand/10 text-brand",
  "brand-teal": "bg-brand-teal/10 text-brand-teal",
  "brand-purple": "bg-brand-purple/10 text-brand-purple",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

const ACCENT_STROKE: Record<string, string> = {
  brand: "#3B82F6",
  info: "#3B82F6",
  "brand-teal": "#14B8A6",
  "brand-purple": "#8B5CF6",
  success: "#10B981",
  warning: "#F59E0B",
  destructive: "#F43F5E",
};

/* ── Count-up hook ── */

function useCountUp(target: number, duration = 800) {
  const [current, setCurrent] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const start = performance.now();
    const from = 0;

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease out quad
      const eased = 1 - (1 - progress) * (1 - progress);
      setCurrent(from + (target - from) * eased);
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return current;
}

/* ── Sparkline SVG ── */

function Sparkline({ data, accent }: { data: number[]; accent: string }) {
  if (data.length < 2) return null;
  const w = 80;
  const h = 40;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const stroke = ACCENT_STROKE[accent] ?? "#3B82F6";

  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * (h - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Single KPI Card ── */

function KPICard({ kpi }: { kpi: KPI }) {
  const Icon = ICON_MAP[kpi.icon] ?? Users;
  const accentBg = ACCENT_BG[kpi.accent] ?? ACCENT_BG.brand;
  const animatedValue = useCountUp(kpi.value);

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-2">
      {/* Icon + Sparkline */}
      <div className="flex items-start justify-between">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${accentBg}`}>
          <Icon className="h-4 w-4" />
        </div>
        <Sparkline data={kpi.sparkline} accent={kpi.accent} />
      </div>

      {/* Label */}
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {kpi.label}
      </p>

      {/* Value */}
      <p className="text-2xl font-bold text-foreground leading-none">
        {formatKPIValue(
          kpi.format === "percentage" || kpi.format === "score" || kpi.format === "days"
            ? Math.round(animatedValue)
            : kpi.format === "number" && kpi.value % 1 !== 0
              ? parseFloat(animatedValue.toFixed(1))
              : kpi.format === "currency"
                ? Math.round(animatedValue)
                : Math.round(animatedValue),
          kpi.format
        )}
      </p>

      {/* Trend */}
      <div className={`flex items-center gap-1 text-xs ${trendColorClass(kpi.trend.positive)}`}>
        {kpi.trend.direction === "up" ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )}
        <span>{kpi.trend.label}</span>
      </div>

      {/* Target bar */}
      {kpi.target && (
        <div className="mt-1">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground mb-0.5">
            <span>Target</span>
            <span>{kpi.target.percentage.toFixed(0)}%</span>
          </div>
          <div className="h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-brand rounded-full transition-all duration-700"
              style={{ width: `${Math.min(kpi.target.percentage, 100)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Main Export ── */

interface KPIRowProps {
  kpis: KPI[];
}

export function KPIRow({ kpis }: KPIRowProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {kpis.map((kpi) => (
        <KPICard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  );
}
