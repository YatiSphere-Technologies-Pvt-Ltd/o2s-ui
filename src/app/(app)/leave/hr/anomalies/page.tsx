"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertOctagon,
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  Filter,
  ShieldAlert,
  Sparkles,
  TrendingDown,
  UserMinus,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  type Anomaly,
  type AnomalyKind,
  type AnomalySeverity,
} from "@/components/leave/data";
import { AnomalyDrawer } from "@/components/leave/anomaly-drawer";
import type { AnomalyStatus } from "@/lib/leave-store";

type Tab = "active" | "investigating" | "dismissed" | "escalated";

const TAB_LABEL: Record<Tab, string> = {
  active: "Active",
  investigating: "Investigating",
  dismissed: "Dismissed",
  escalated: "Escalated",
};

const KIND_LABEL: Record<AnomalyKind, string> = {
  manager_dismissals: "Manager dismissals",
  statutory_update:   "Statutory update",
  policy_violation:   "Policy violation",
  balance_cliff:      "Balance cliff",
  data_drift:         "Data drift",
};

const KIND_ICON: Record<AnomalyKind, React.ComponentType<{ className?: string }>> = {
  manager_dismissals: UserMinus,
  statutory_update:   ShieldAlert,
  policy_violation:   AlertOctagon,
  balance_cliff:      TrendingDown,
  data_drift:         Sparkles,
};

const SEVERITY_META: Record<AnomalySeverity, { tint: string; color: string; ringClass: string; label: string }> = {
  high:   { tint: "bg-destructive/10", color: "text-destructive", ringClass: "ring-1 ring-destructive/30", label: "High" },
  medium: { tint: "bg-warning/10",     color: "text-warning",     ringClass: "ring-1 ring-warning/30",     label: "Medium" },
  low:    { tint: "bg-secondary",      color: "text-muted-foreground", ringClass: "ring-1 ring-border",   label: "Low" },
};

const SEV_ORDER: AnomalySeverity[] = ["high", "medium", "low"];

function ageLabel(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hours = diff / 3_600_000;
  if (hours < 1) return `${Math.max(1, Math.round(diff / 60_000))}m`;
  if (hours < 24) return `${Math.round(hours)}h`;
  const days = Math.round(hours / 24);
  return `${days}d`;
}

export default function AnomaliesPage() {
  const { setScreen } = useScreen();
  const { anomalyQueue, recordAnomalyAction } = useLeaveStore();

  const [tab, setTab] = useState<Tab>("active");
  const [severityFilter, setSeverityFilter] = useState<AnomalySeverity | "all">("all");
  const [kindFilter, setKindFilter] = useState<AnomalyKind | "all">("all");
  const [drawerId, setDrawerId] = useState<string | null>(null);
  const [actionTarget, setActionTarget] = useState<{ kind: "dismiss" | "escalate"; anomaly: Anomaly } | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Anomaly Review" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  const filteredByFilters = useMemo(
    () =>
      anomalyQueue.filter(({ anomaly }) => {
        if (severityFilter !== "all" && anomaly.severity !== severityFilter) return false;
        if (kindFilter !== "all" && anomaly.kind !== kindFilter) return false;
        return true;
      }),
    [anomalyQueue, severityFilter, kindFilter],
  );

  const counts: Record<Tab, number> = useMemo(() => {
    const c: Record<Tab, number> = { active: 0, investigating: 0, dismissed: 0, escalated: 0 };
    for (const x of filteredByFilters) {
      const s = x.state.status as AnomalyStatus;
      if ((Object.keys(c) as Tab[]).includes(s as Tab)) c[s as Tab]++;
    }
    return c;
  }, [filteredByFilters]);

  const rows = useMemo(
    () =>
      filteredByFilters
        .filter((x) => x.state.status === (tab as AnomalyStatus))
        .sort((a, b) => {
          const sa = SEV_ORDER.indexOf(a.anomaly.severity);
          const sb = SEV_ORDER.indexOf(b.anomaly.severity);
          if (sa !== sb) return sa - sb;
          return b.anomaly.detectedAt.localeCompare(a.anomaly.detectedAt);
        }),
    [filteredByFilters, tab],
  );

  const drawerRow = drawerId
    ? anomalyQueue.find((x) => x.anomaly.id === drawerId) ?? null
    : null;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3"
      >
        <Link
          href="/leave/hr"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Anomaly review</h1>
          <p className="text-sm text-muted-foreground">
            Patterns flagged by Anomaly Agent. Investigate carefully — these are hints, not verdicts.
          </p>
        </div>
      </motion.div>

      {/* Audit banner */}
      <div className="flex items-start gap-3 p-3 rounded-xl bg-brand/5 border border-brand/30">
        <Sparkles className="size-4 text-brand shrink-0 mt-0.5" />
        <p className="text-[12px] leading-relaxed text-foreground">
          <span className="font-medium">Strong audit trail.</span>{" "}
          <span className="text-muted-foreground">
            Every view, dismissal, and escalation is recorded with your name and time. Treat patterns as conversation starters, not accusations.
          </span>
        </p>
      </div>

      {/* Tabs + filters */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center border-b border-border overflow-x-auto scrollbar-thin">
          {(Object.keys(TAB_LABEL) as Tab[]).map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`relative px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors ${
                  active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {TAB_LABEL[t]}
                <span
                  className={`ml-1.5 inline-flex items-center justify-center min-w-4.5 h-4 px-1 rounded-full text-[10px] tabular-nums ${
                    active ? "bg-brand/10 text-brand" : "bg-secondary text-muted-foreground"
                  }`}
                >
                  {counts[t]}
                </span>
                {active && <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand rounded-full" />}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="size-3.5 text-muted-foreground" />
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value as AnomalySeverity | "all")}
            className="h-8 px-2 rounded-md border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value as AnomalyKind | "all")}
            className="h-8 px-2 rounded-md border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All types</option>
            {(Object.keys(KIND_LABEL) as AnomalyKind[]).map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* List */}
      {rows.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-16 text-center">
          <Sparkles className="size-6 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-foreground">
            {tab === "active" ? "Nothing flagged." : `No ${TAB_LABEL[tab].toLowerCase()} items.`}
          </p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {rows.map(({ anomaly, state }) => {
            const KIcon = KIND_ICON[anomaly.kind];
            const m = SEVERITY_META[anomaly.severity];
            return (
              <li key={anomaly.id}>
                <button
                  onClick={() => setDrawerId(anomaly.id)}
                  className={`w-full text-left bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-colors ${m.ringClass}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`size-9 shrink-0 rounded-lg flex items-center justify-center ${m.tint}`}>
                      <KIcon className={`size-4 ${m.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider ${m.tint} ${m.color}`}>
                          {m.label}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {KIND_LABEL[anomaly.kind]}
                        </span>
                        {anomaly.subject && (
                          <span className="text-[11px] text-foreground">· {anomaly.subject.name}</span>
                        )}
                        {state.audit.length > 0 && (
                          <span className="text-[10px] text-muted-foreground/60">· {state.audit.length} action{state.audit.length !== 1 ? "s" : ""} logged</span>
                        )}
                      </div>
                      <p className="text-sm font-medium text-foreground leading-snug">{anomaly.title}</p>
                      <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">{anomaly.detail}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-muted-foreground/70">
                        <span>{anomaly.source}</span>
                        <span>·</span>
                        <span>aged {ageLabel(anomaly.detectedAt)}</span>
                        {typeof anomaly.confidence === "number" && (
                          <>
                            <span>·</span>
                            <span className="text-foreground">{anomaly.confidence}% confident</span>
                          </>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground/40 shrink-0 mt-1" />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {/* Drawer */}
      <AnomalyDrawer
        open={!!drawerRow}
        anomaly={drawerRow?.anomaly ?? null}
        state={drawerRow?.state ?? null}
        onClose={() => setDrawerId(null)}
        onView={() => {
          if (!drawerRow) return;
          // Only log a viewed event once per anomaly per session
          if (drawerRow.state.audit.some((a) => a.kind === "viewed")) return;
          recordAnomalyAction(drawerRow.anomaly.id, "viewed");
        }}
        onMarkInvestigating={() => {
          if (!drawerRow) return;
          recordAnomalyAction(drawerRow.anomaly.id, "marked_investigating", { newStatus: "investigating" });
          flashOnce("Marked as investigating.");
        }}
        onRunSuggested={() => {
          if (!drawerRow?.anomaly.suggestedNextStep) return;
          recordAnomalyAction(drawerRow.anomaly.id, "ran_suggested_step", {
            note: drawerRow.anomaly.suggestedNextStep.label,
          });
          flashOnce("Suggested step ran.");
        }}
        onDismiss={() => {
          if (!drawerRow) return;
          setActionTarget({ kind: "dismiss", anomaly: drawerRow.anomaly });
        }}
        onEscalate={() => {
          if (!drawerRow) return;
          setActionTarget({ kind: "escalate", anomaly: drawerRow.anomaly });
        }}
      />

      {/* Action modal */}
      <AnimatePresence>
        {actionTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-60 bg-black/50"
              onClick={() => {
                setActionTarget(null);
                setActionNote("");
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-60 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full pointer-events-auto p-5">
                <h3 className="text-sm font-semibold text-foreground">
                  {actionTarget.kind === "dismiss" ? "Dismiss anomaly?" : "Escalate anomaly?"}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 mb-4 leading-relaxed">
                  {actionTarget.kind === "dismiss"
                    ? "The signal stays on file. You can revisit it from the Dismissed tab."
                    : "Adds the anomaly to your manager's queue with your context attached."}
                </p>
                <textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  rows={3}
                  placeholder={
                    actionTarget.kind === "dismiss"
                      ? "Reason for dismissal (kept in audit trail)…"
                      : "Why this needs escalation…"
                  }
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40 resize-none"
                />
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => {
                      setActionTarget(null);
                      setActionNote("");
                    }}
                    className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      if (!actionTarget) return;
                      const kind = actionTarget.kind === "dismiss" ? "dismissed" : "escalated";
                      recordAnomalyAction(actionTarget.anomaly.id, kind, {
                        note: actionNote || undefined,
                        newStatus: kind as AnomalyStatus,
                      });
                      flashOnce(actionTarget.kind === "dismiss" ? "Dismissed." : "Escalated.");
                      setActionTarget(null);
                      setActionNote("");
                    }}
                    className={`h-9 px-3 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity ${
                      actionTarget.kind === "escalate" ? "bg-warning" : "bg-secondary text-foreground"
                    }`}
                  >
                    {actionTarget.kind === "dismiss" ? "Dismiss" : "Escalate"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-70 px-4 py-2.5 rounded-lg bg-card border border-border shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="size-4 text-success" />
            <span className="text-xs text-foreground">{flash}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
