"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  CalendarClock,
  FileWarning,
  GaugeCircle,
  ScrollText,
} from "lucide-react";
import type { AnomalySeverity, AttentionItem, AttentionKind } from "@/components/leave/data";

const KIND_ICON: Record<AttentionKind, React.ComponentType<{ className?: string }>> = {
  cert_expiring:      FileWarning,
  statutory_deadline: CalendarClock,
  policy_review_due:  ScrollText,
  anomaly_spike:      GaugeCircle,
  balance_cliff:      AlertCircle,
};

const SEV: Record<AnomalySeverity, { tint: string; color: string }> = {
  high:   { tint: "bg-destructive/10", color: "text-destructive" },
  medium: { tint: "bg-warning/10",     color: "text-warning" },
  low:    { tint: "bg-secondary",      color: "text-muted-foreground" },
};

export function AttentionPanel({ items }: { items: AttentionItem[] }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-baseline justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Needs your attention</h3>
        <span className="text-[11px] text-muted-foreground">{items.length} items</span>
      </div>
      <ul className="space-y-2.5">
        {items.map((it) => {
          const Icon = KIND_ICON[it.kind];
          const sev = SEV[it.severity];
          return (
            <li key={it.id} className="flex items-start gap-3">
              <div className={`size-8 shrink-0 rounded-md flex items-center justify-center ${sev.tint}`}>
                <Icon className={`size-4 ${sev.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2 flex-wrap">
                  <p className="text-xs font-medium text-foreground">{it.title}</p>
                  <span className="text-[10px] text-muted-foreground/70 whitespace-nowrap">{it.dueLabel}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{it.detail}</p>
                {it.cta && (
                  it.href ? (
                    <Link href={it.href} className="inline-flex items-center gap-1 mt-1 text-[11px] text-brand hover:underline">
                      {it.cta} <ArrowRight className="size-3" />
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1 mt-1 text-[11px] text-brand">
                      {it.cta} <ArrowRight className="size-3" />
                    </span>
                  )
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
