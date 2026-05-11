"use client";

import Link from "next/link";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import type { HrKpi } from "@/components/leave/data";

const TONE: Record<HrKpi["tone"], { dotBg: string; deltaGood: string; deltaBad: string }> = {
  success:     { dotBg: "bg-success",     deltaGood: "text-success",     deltaBad: "text-warning" },
  warning:     { dotBg: "bg-warning",     deltaGood: "text-success",     deltaBad: "text-destructive" },
  destructive: { dotBg: "bg-destructive", deltaGood: "text-success",     deltaBad: "text-destructive" },
  brand:       { dotBg: "bg-brand",       deltaGood: "text-success",     deltaBad: "text-destructive" },
  neutral:     { dotBg: "bg-muted-foreground/40", deltaGood: "text-success", deltaBad: "text-destructive" },
};

export function HrKpiStrip({ kpis }: { kpis: HrKpi[] }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {kpis.map((k) => {
        const tone = TONE[k.tone];
        const goodDirection = k.trendDirection === "good";
        const dPct = k.deltaPct;
        const showDelta = typeof dPct === "number" && Number.isFinite(dPct);
        const isImprovement =
          showDelta &&
          ((goodDirection && (dPct as number) > 0) || (!goodDirection && (dPct as number) < 0));
        const deltaColor = showDelta
          ? isImprovement
            ? tone.deltaGood
            : tone.deltaBad
          : "";
        const DeltaIcon = showDelta ? ((dPct as number) >= 0 ? TrendingUp : TrendingDown) : null;

        const card = (
          <div className="h-full bg-card border border-border rounded-xl p-4 flex flex-col gap-2 hover:border-border/80 transition-colors">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
                <span className={`size-1.5 rounded-full ${tone.dotBg}`} />
                {k.label}
              </span>
              {k.href && <ArrowRight className="size-3 text-muted-foreground/40" />}
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-xl font-bold text-foreground tabular-nums">{k.value}</p>
              {showDelta && DeltaIcon && (
                <span className={`inline-flex items-center gap-0.5 text-[11px] ${deltaColor} tabular-nums`}>
                  <DeltaIcon className="size-3" />
                  {Math.abs(dPct as number).toFixed(1)}%
                </span>
              )}
            </div>
            {k.sub && <p className="text-[11px] text-muted-foreground leading-snug">{k.sub}</p>}
          </div>
        );

        return k.href ? (
          <Link key={k.id} href={k.href} className="block focus:outline-none focus:ring-2 focus:ring-brand/40 rounded-xl">
            {card}
          </Link>
        ) : (
          <div key={k.id}>{card}</div>
        );
      })}
    </div>
  );
}
