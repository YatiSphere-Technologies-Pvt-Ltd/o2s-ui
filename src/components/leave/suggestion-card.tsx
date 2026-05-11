"use client";

import { Heart, Calendar, Clock, ShieldCheck, X } from "lucide-react";
import type { AgentSuggestion, SuggestionKind } from "@/components/leave/data";

const KIND_META: Record<SuggestionKind, { icon: React.ComponentType<{ className?: string }>; tint: string; color: string }> = {
  planner:   { icon: Calendar,     tint: "bg-brand/10",       color: "text-brand" },
  wellbeing: { icon: Heart,        tint: "bg-pink-400/10",    color: "text-pink-400" },
  expiry:    { icon: Clock,        tint: "bg-destructive/10", color: "text-destructive" },
  policy:    { icon: ShieldCheck,  tint: "bg-success/10",     color: "text-success" },
};

export function SuggestionCard({
  s,
  onPrimary,
  onDismiss,
}: {
  s: AgentSuggestion;
  onPrimary?: (s: AgentSuggestion) => void;
  onDismiss?: (s: AgentSuggestion) => void;
}) {
  const meta = KIND_META[s.kind];
  const Icon = meta.icon;
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-border/80 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`size-9 shrink-0 rounded-lg flex items-center justify-center ${meta.tint}`}>
          <Icon className={`size-4 ${meta.color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-semibold">
              {s.source}
            </p>
            {onDismiss && (
              <button
                onClick={() => onDismiss(s)}
                className="p-0.5 text-muted-foreground/60 hover:text-foreground"
                aria-label="Dismiss"
              >
                <X className="size-3" />
              </button>
            )}
          </div>
          <p className="text-sm font-medium text-foreground mt-0.5">{s.title}</p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed">{s.body}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPrimary?.(s)}
          className="px-3 py-1.5 rounded-md bg-brand text-brand-foreground text-xs font-medium hover:opacity-90 transition-opacity"
        >
          {s.primary.label}
        </button>
        {s.secondary && (
          <button
            onClick={() => onDismiss?.(s)}
            className="px-3 py-1.5 rounded-md text-muted-foreground text-xs hover:text-foreground transition-colors"
          >
            {s.secondary.label}
          </button>
        )}
      </div>
    </div>
  );
}
