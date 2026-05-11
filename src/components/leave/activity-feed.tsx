"use client";

import { Check, Plus, FileText, X, Ban, Send } from "lucide-react";
import { RECENT_ACTIVITY, type ActivityKind } from "@/components/leave/data";

const KIND_ICON: Record<ActivityKind, { icon: React.ComponentType<{ className?: string }>; tint: string; color: string }> = {
  approved:  { icon: Check,    tint: "bg-success/10",      color: "text-success" },
  submitted: { icon: Send,     tint: "bg-brand/10",        color: "text-brand" },
  balance:   { icon: Plus,     tint: "bg-brand-teal/10",   color: "text-brand-teal" },
  policy:    { icon: FileText, tint: "bg-secondary",       color: "text-muted-foreground" },
  rejected:  { icon: X,        tint: "bg-destructive/10",  color: "text-destructive" },
  cancelled: { icon: Ban,      tint: "bg-secondary",       color: "text-muted-foreground" },
};

export function ActivityFeed() {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="text-sm font-semibold text-foreground mb-3">Recent activity</h3>
      <div className="space-y-3">
        {RECENT_ACTIVITY.map((a) => {
          const m = KIND_ICON[a.kind];
          const Icon = m.icon;
          return (
            <div key={a.id} className="flex items-start gap-3">
              <div className={`size-7 shrink-0 rounded-full flex items-center justify-center ${m.tint}`}>
                <Icon className={`size-3.5 ${m.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-relaxed">{a.text}</p>
                <p className="text-[10px] text-muted-foreground/60 mt-0.5">{a.whenLabel}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
