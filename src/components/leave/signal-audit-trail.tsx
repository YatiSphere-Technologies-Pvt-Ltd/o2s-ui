"use client";

import { Ban, Check, Eye, MessageSquare, Send, Share2, Siren } from "lucide-react";
import type { SignalActionKind, SignalAuditEntry } from "@/lib/leave-store";

const META: Record<
  SignalActionKind,
  { icon: React.ComponentType<{ className?: string }>; tint: string; color: string; label: string }
> = {
  viewed:                 { icon: Eye,           tint: "bg-secondary",      color: "text-muted-foreground", label: "Viewed" },
  suggested_leave:        { icon: Send,          tint: "bg-brand/10",       color: "text-brand",            label: "Suggested leave" },
  scheduled_one_on_one:   { icon: MessageSquare, tint: "bg-brand-teal/10",  color: "text-brand-teal",       label: "Scheduled 1:1" },
  shared_resources:       { icon: Share2,        tint: "bg-brand-purple/10",color: "text-brand-purple",     label: "Shared resources" },
  marked_addressed:       { icon: Check,         tint: "bg-success/10",     color: "text-success",          label: "Marked addressed" },
  dismissed:              { icon: Ban,           tint: "bg-secondary",      color: "text-muted-foreground", label: "Dismissed" },
  escalated:              { icon: Siren,         tint: "bg-warning/10",     color: "text-warning",          label: "Escalated to HR" },
};

export function SignalAuditTrail({ entries }: { entries: SignalAuditEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">
        Action history
      </p>
      <ol className="space-y-1.5">
        {entries.map((e) => {
          const m = META[e.kind];
          const Icon = m.icon;
          return (
            <li key={e.id} className="flex items-start gap-2 text-[11px]">
              <div className={`size-5 shrink-0 rounded flex items-center justify-center ${m.tint}`}>
                <Icon className={`size-3 ${m.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground">
                  <span className="font-medium">{m.label}</span>
                  <span className="text-muted-foreground/60"> · {e.whenLabel}</span>
                </p>
                {e.note && <p className="text-muted-foreground leading-snug mt-0.5">{e.note}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
