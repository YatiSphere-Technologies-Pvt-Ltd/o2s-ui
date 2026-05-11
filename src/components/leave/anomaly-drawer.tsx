"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ban,
  Check,
  Eye,
  Sparkles,
  Siren,
  X,
} from "lucide-react";
import type { Anomaly } from "@/components/leave/data";
import type { AnomalyActionState } from "@/lib/leave-store";

const SEVERITY: Record<Anomaly["severity"], { tint: string; color: string; label: string }> = {
  high:   { tint: "bg-destructive/10", color: "text-destructive", label: "High" },
  medium: { tint: "bg-warning/10",     color: "text-warning",     label: "Medium" },
  low:    { tint: "bg-secondary",      color: "text-muted-foreground", label: "Low" },
};

const STATUS_META: Record<AnomalyActionState["status"], { color: string; label: string }> = {
  active:        { color: "text-foreground",       label: "Active" },
  investigating: { color: "text-brand",            label: "Investigating" },
  dismissed:     { color: "text-muted-foreground", label: "Dismissed" },
  escalated:     { color: "text-warning",          label: "Escalated" },
};

const AUDIT_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  viewed: Eye,
  marked_investigating: Sparkles,
  ran_suggested_step: Check,
  dismissed: Ban,
  escalated: Siren,
};

interface Props {
  open: boolean;
  anomaly: Anomaly | null;
  state: AnomalyActionState | null;
  onClose: () => void;
  onMarkInvestigating: () => void;
  onRunSuggested: () => void;
  onDismiss: () => void;
  onEscalate: () => void;
  onView: () => void; // called automatically on open
}

export function AnomalyDrawer({
  open,
  anomaly,
  state,
  onClose,
  onMarkInvestigating,
  onRunSuggested,
  onDismiss,
  onEscalate,
  onView,
}: Props) {
  useEffect(() => {
    if (open && anomaly) onView();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, anomaly?.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && anomaly && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 240 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[480px] bg-card border-l border-border flex flex-col"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 p-4 border-b border-border">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider ${SEVERITY[anomaly.severity].tint} ${SEVERITY[anomaly.severity].color}`}>
                    {SEVERITY[anomaly.severity].label}
                  </span>
                  {state && (
                    <span className={`text-[10px] uppercase tracking-wider ${STATUS_META[state.status].color}`}>
                      {STATUS_META[state.status].label}
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-semibold text-foreground leading-snug">{anomaly.title}</h3>
                <p className="text-[11px] text-muted-foreground mt-0.5">{anomaly.source}</p>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-5">
              {/* Subject */}
              {anomaly.subject && (
                <div className="flex items-center gap-2.5">
                  {anomaly.subject.kind === "employee" && anomaly.subject.initials ? (
                    <div className={`size-9 rounded-full ${anomaly.subject.avatarColor ?? "bg-secondary"} text-white text-[11px] font-bold flex items-center justify-center`}>
                      {anomaly.subject.initials}
                    </div>
                  ) : (
                    <div className="size-9 rounded-full bg-secondary text-muted-foreground text-[11px] font-bold flex items-center justify-center">
                      ?
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-foreground">{anomaly.subject.name}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{anomaly.subject.kind}</p>
                  </div>
                </div>
              )}

              {/* Pattern detail */}
              <p className="text-xs text-foreground leading-relaxed">{anomaly.detail}</p>

              {/* Chart */}
              {anomaly.chart && (
                <Section title={anomaly.chart.title}>
                  <PatternChart points={anomaly.chart.points} />
                </Section>
              )}

              {/* Peer comparison */}
              {anomaly.peerComparison && anomaly.peerComparison.length > 0 && (
                <Section title="Peer comparison">
                  <ul className="space-y-2">
                    {anomaly.peerComparison.map((p, i) => (
                      <li key={i} className="text-[11px]">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-muted-foreground">{p.label}</span>
                          <span>
                            <span className={`font-medium ${p.subjectIsBetter ? "text-success" : "text-foreground"}`}>{p.subjectValue}</span>
                            <span className="text-muted-foreground"> vs {p.peerValue}</span>
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={`h-full rounded-full ${p.subjectIsBetter ? "bg-success" : "bg-warning"}`}
                            style={{ width: `${Math.round(Math.min(1, Math.max(0, p.ratio)) * 100)}%` }}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Reasoning */}
              {anomaly.reasoning && (
                <Section
                  title={
                    typeof anomaly.confidence === "number"
                      ? `Agent reasoning · ${anomaly.confidence}% confidence`
                      : "Agent reasoning"
                  }
                >
                  <ul className="space-y-1.5 text-xs">
                    {anomaly.reasoning.map((r, i) => (
                      <li key={i} className="flex items-start gap-2 text-foreground leading-snug">
                        <span className="size-1 rounded-full bg-current text-muted-foreground/40 mt-1.5 shrink-0" />
                        <span>{r}</span>
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Suggested next step */}
              {anomaly.suggestedNextStep && (
                <Section title="Suggested next step">
                  <div className="p-3 rounded-lg bg-brand/5 border border-brand/30">
                    <p className="text-xs font-medium text-foreground">{anomaly.suggestedNextStep.label}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                      {anomaly.suggestedNextStep.rationale}
                    </p>
                  </div>
                </Section>
              )}

              {/* Audit trail */}
              {state && state.audit.length > 0 && (
                <Section title="Audit trail">
                  <ol className="space-y-2 text-[11px]">
                    {state.audit.map((e) => {
                      const Icon = AUDIT_ICON[e.kind] ?? Eye;
                      return (
                        <li key={e.id} className="flex items-start gap-2">
                          <div className="size-5 shrink-0 rounded bg-secondary flex items-center justify-center">
                            <Icon className="size-3 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-foreground">
                              <span className="font-medium">{e.actor}</span>
                              <span className="text-muted-foreground"> · {e.kind.replace(/_/g, " ")}</span>
                            </p>
                            {e.note && <p className="text-muted-foreground leading-snug mt-0.5">{e.note}</p>}
                            <p className="text-[10px] text-muted-foreground/60 mt-0.5">{e.whenLabel}</p>
                          </div>
                        </li>
                      );
                    })}
                  </ol>
                </Section>
              )}
            </div>

            {/* Footer actions */}
            <div className="border-t border-border p-3 flex items-center gap-2 flex-wrap">
              <button
                onClick={onMarkInvestigating}
                disabled={state?.status === "investigating"}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs text-foreground hover:bg-surface-overlay transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Sparkles className="size-3" />
                Investigate
              </button>
              <button
                onClick={onDismiss}
                disabled={state?.status === "dismissed"}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card text-xs text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Ban className="size-3" />
                Dismiss
              </button>
              <button
                onClick={onEscalate}
                disabled={state?.status === "escalated"}
                className="inline-flex items-center gap-1.5 ml-auto px-3 py-2 rounded-lg border border-warning/40 bg-warning/5 text-xs text-warning hover:bg-warning/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Siren className="size-3" />
                Escalate
              </button>
              {anomaly.suggestedNextStep && (
                <button
                  onClick={onRunSuggested}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-brand text-brand-foreground text-xs font-medium hover:opacity-90 transition-opacity"
                >
                  <Check className="size-3" />
                  Run suggested
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">{title}</p>
      {children}
    </div>
  );
}

function PatternChart({ points }: { points: { label: string; value: number; highlight?: boolean }[] }) {
  const max = Math.max(1, ...points.map((p) => p.value));
  return (
    <div className="flex items-end gap-1.5 h-24">
      {points.map((p) => {
        const pct = (p.value / max) * 100;
        return (
          <div key={p.label} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex-1 flex items-end">
              <div
                className={`w-full rounded-sm ${p.highlight ? "bg-destructive" : "bg-brand"}`}
                style={{ height: p.value > 0 ? `${Math.max(15, pct)}%` : "6%" }}
                title={`${p.label}: ${p.value}`}
              />
            </div>
            <div className="text-center">
              <p className="text-[10px] tabular-nums text-foreground">{p.value}</p>
              <p className="text-[9px] text-muted-foreground/60">{p.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
