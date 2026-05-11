"use client";

import Link from "next/link";
import { Heart, X, CalendarRange, AlertTriangle, Activity, Calendar } from "lucide-react";
import type { WellbeingKind, WellbeingSignal } from "@/components/leave/data";

const KIND_META: Record<
  WellbeingKind,
  { icon: React.ComponentType<{ className?: string }>; color: string; tint: string; label: string }
> = {
  no_leave_taken:     { icon: CalendarRange,  color: "text-warning",      tint: "bg-warning/10",       label: "Low usage" },
  sick_cluster:       { icon: AlertTriangle,  color: "text-destructive",  tint: "bg-destructive/10",   label: "Pattern" },
  high_workload:      { icon: Activity,       color: "text-warning",      tint: "bg-warning/10",       label: "Workload" },
  back_to_back:       { icon: Activity,       color: "text-brand",        tint: "bg-brand/10",         label: "Rotation" },
  weekend_bracketing: { icon: Calendar,       color: "text-brand-purple", tint: "bg-brand-purple/10",  label: "Bracketing" },
};

interface Props {
  signals: WellbeingSignal[];
  onAction: (s: WellbeingSignal) => void;
  onDismiss: (id: string) => void;
}

export function WellbeingAlerts({ signals, onAction, onDismiss }: Props) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Heart className="size-4 text-pink-400" />
        <h3 className="text-sm font-semibold text-foreground">Wellbeing alerts</h3>
        <Link
          href="/leave/manager/wellbeing"
          className="ml-auto text-[11px] text-brand hover:underline"
        >
          See all →
        </Link>
      </div>
      {signals.length === 0 ? (
        <p className="text-xs text-muted-foreground italic text-center py-6">
          Nothing flagged right now. We&apos;ll surface patterns as they emerge.
        </p>
      ) : (
        <div className="space-y-2">
          {signals.map((s) => {
            const m = KIND_META[s.kind];
            const Icon = m.icon;
            return (
              <div
                key={s.id}
                className="relative flex items-start gap-3 p-3 bg-surface-overlay/40 border border-border rounded-lg"
              >
                <div className={`size-8 shrink-0 rounded-full ${s.employeeAvatar} text-white text-[10px] font-bold flex items-center justify-center`}>
                  {s.employeeInitials}
                </div>
                <div className="flex-1 min-w-0 pr-6">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-medium text-foreground">{s.employeeName}</span>
                    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${m.tint} ${m.color}`}>
                      <Icon className="size-2.5" />
                      {m.label}
                    </span>
                  </div>
                  <p className="text-xs text-foreground leading-snug">{s.title}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{s.body}</p>
                  {s.cta && (
                    <button
                      onClick={() => onAction(s)}
                      className="mt-2 text-[11px] text-brand hover:underline"
                    >
                      {s.cta} →
                    </button>
                  )}
                </div>
                <button
                  onClick={() => onDismiss(s.id)}
                  className="absolute top-2 right-2 p-0.5 text-muted-foreground/60 hover:text-foreground transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="size-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
