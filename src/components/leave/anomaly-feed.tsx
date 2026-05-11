"use client";

import Link from "next/link";
import { AlertOctagon, ArrowRight, Sparkles, ShieldAlert, TrendingDown, UserMinus } from "lucide-react";
import type { Anomaly, AnomalyKind, AnomalySeverity } from "@/components/leave/data";

const KIND_ICON: Record<AnomalyKind, React.ComponentType<{ className?: string }>> = {
  manager_dismissals: UserMinus,
  statutory_update:   ShieldAlert,
  policy_violation:   AlertOctagon,
  balance_cliff:      TrendingDown,
  data_drift:         Sparkles,
};

const SEVERITY_META: Record<AnomalySeverity, { tint: string; color: string; ring: string }> = {
  high:   { tint: "bg-destructive/10", color: "text-destructive", ring: "ring-destructive/30" },
  medium: { tint: "bg-warning/10",     color: "text-warning",     ring: "ring-warning/30" },
  low:    { tint: "bg-secondary",      color: "text-muted-foreground", ring: "ring-border" },
};

export function AnomalyFeed({ anomalies }: { anomalies: Anomaly[] }) {
  const top = anomalies.slice(0, 3);
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-baseline justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-brand" />
          <h3 className="text-sm font-semibold text-foreground">Top anomalies</h3>
        </div>
        <Link href="/leave/hr/anomalies" className="text-[11px] text-brand hover:underline">
          See all →
        </Link>
      </div>

      {top.length === 0 ? (
        <p className="text-xs text-muted-foreground italic text-center py-6">
          Nothing flagged. Anomaly Agent is monitoring.
        </p>
      ) : (
        <ul className="space-y-3">
          {top.map((a) => {
            const m = SEVERITY_META[a.severity];
            const Icon = KIND_ICON[a.kind];
            return (
              <li
                key={a.id}
                className={`p-3 rounded-lg ring-1 ${m.ring} bg-surface-overlay/40`}
              >
                <div className="flex items-start gap-2.5">
                  <div className={`size-7 shrink-0 rounded-md flex items-center justify-center ${m.tint}`}>
                    <Icon className={`size-3.5 ${m.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                      <p className="text-xs font-medium text-foreground">{a.title}</p>
                      <span className={`text-[9px] uppercase tracking-wider ${m.color}`}>
                        {a.severity}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{a.detail}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[10px] text-muted-foreground/60">{a.source}</span>
                      {a.cta && (
                        a.href ? (
                          <Link href={a.href} className="inline-flex items-center gap-1 text-[11px] text-brand hover:underline">
                            {a.cta} <ArrowRight className="size-3" />
                          </Link>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-brand">
                            {a.cta} <ArrowRight className="size-3" />
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
