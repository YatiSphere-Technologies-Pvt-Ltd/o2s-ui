"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  Filter,
  ShieldAlert,
  Siren,
  XCircle,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  type WellbeingKind,
  type WellbeingSeverity,
  type WellbeingSignal,
} from "@/components/leave/data";
import { SignalCard } from "@/components/leave/signal-card";
import type { SignalStatus } from "@/lib/leave-store";

type Tab = "active" | "addressed" | "dismissed" | "escalated";

const TAB_LABEL: Record<Tab, string> = {
  active: "Active",
  addressed: "Addressed",
  dismissed: "Dismissed",
  escalated: "Escalated",
};

const TAB_TO_STATUS: Record<Tab, SignalStatus> = {
  active: "active",
  addressed: "addressed",
  dismissed: "dismissed",
  escalated: "escalated",
};

const KIND_LABEL: Record<WellbeingKind, string> = {
  no_leave_taken: "Low PTO usage",
  sick_cluster: "Sick clusters",
  high_workload: "High workload",
  back_to_back: "Back-to-back",
  weekend_bracketing: "Weekend bracketing",
};

const SEVERITY_ORDER: WellbeingSeverity[] = ["high", "medium", "low"];

export default function WellbeingPage() {
  const { setScreen } = useScreen();
  const { wellbeingSignals, recordSignalAction } = useLeaveStore();

  const [tab, setTab] = useState<Tab>("active");
  const [severityFilter, setSeverityFilter] = useState<WellbeingSeverity | "all">("all");
  const [kindFilter, setKindFilter] = useState<WellbeingKind | "all">("all");

  const [actionTarget, setActionTarget] = useState<
    | { kind: "dismiss" | "escalate"; signal: WellbeingSignal }
    | null
  >(null);
  const [actionNote, setActionNote] = useState("");
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Wellbeing alerts" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  // Counts respect type+severity filters but not the tab itself.
  const filteredByFilters = useMemo(() => {
    return wellbeingSignals.filter(({ signal }) => {
      if (severityFilter !== "all" && signal.severity !== severityFilter) return false;
      if (kindFilter !== "all" && signal.kind !== kindFilter) return false;
      return true;
    });
  }, [wellbeingSignals, severityFilter, kindFilter]);

  const counts: Record<Tab, number> = useMemo(() => {
    const c: Record<Tab, number> = { active: 0, addressed: 0, dismissed: 0, escalated: 0 };
    for (const x of filteredByFilters) {
      const t = (Object.keys(TAB_TO_STATUS) as Tab[]).find(
        (k) => TAB_TO_STATUS[k] === x.state.status,
      );
      if (t) c[t]++;
    }
    return c;
  }, [filteredByFilters]);

  const rows = useMemo(() => {
    const status = TAB_TO_STATUS[tab];
    return filteredByFilters
      .filter((x) => x.state.status === status)
      .sort((a, b) => {
        const sa = SEVERITY_ORDER.indexOf(a.signal.severity);
        const sb = SEVERITY_ORDER.indexOf(b.signal.severity);
        if (sa !== sb) return sa - sb;
        return b.signal.detectedAt.localeCompare(a.signal.detectedAt);
      });
  }, [filteredByFilters, tab]);

  function handleSuggestLeave(s: WellbeingSignal) {
    recordSignalAction(s.id, "suggested_leave", {
      note: `Aurora draft sent to ${s.employeeName.split(" ")[0]}`,
    });
    flashOnce(`Leave suggestion drafted for ${s.employeeName.split(" ")[0]}.`);
  }
  function handleScheduleOneOnOne(s: WellbeingSignal) {
    recordSignalAction(s.id, "scheduled_one_on_one", {
      note: "1:1 draft added to manager's calendar",
    });
    flashOnce(`1:1 with ${s.employeeName.split(" ")[0]} drafted in your calendar.`);
  }
  function handleShareResources(s: WellbeingSignal) {
    recordSignalAction(s.id, "shared_resources", {
      note: "Sent burnout-prevention resources link",
    });
    flashOnce("Resources link sent.");
  }
  function handleMarkAddressed(s: WellbeingSignal) {
    recordSignalAction(s.id, "marked_addressed", { newStatus: "addressed" });
    flashOnce("Marked addressed.");
  }
  function handleConfirmDismiss() {
    if (!actionTarget || actionTarget.kind !== "dismiss") return;
    recordSignalAction(actionTarget.signal.id, "dismissed", {
      note: actionNote || undefined,
      newStatus: "dismissed",
    });
    flashOnce("Dismissed.");
    setActionTarget(null);
    setActionNote("");
  }
  function handleConfirmEscalate() {
    if (!actionTarget || actionTarget.kind !== "escalate") return;
    recordSignalAction(actionTarget.signal.id, "escalated", {
      note: actionNote || undefined,
      newStatus: "escalated",
    });
    flashOnce("Escalated to HR.");
    setActionTarget(null);
    setActionNote("");
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link
            href="/leave/manager"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Wellbeing alerts</h1>
            <p className="text-sm text-muted-foreground">
              Patterns the Wellbeing Agent surfaced for proactive check-ins.
            </p>
          </div>
        </div>
      </motion.div>

      {/* HR-visible banner */}
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="flex items-start gap-3 p-3 rounded-xl bg-warning/5 border border-warning/30"
      >
        <Eye className="size-4 text-warning shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0 text-[12px] leading-relaxed text-foreground">
          <span className="font-medium">This screen is private to you and HR.</span>{" "}
          <span className="text-muted-foreground">
            Action history (dismissals, escalations, addressed-marks) is recorded for audit and feeds HR&apos;s anomaly view.
            Use these patterns to start conversations — not as performance signals.
          </span>
        </div>
      </motion.div>

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
                  className={`ml-1.5 inline-flex items-center justify-center min-w-[18px] h-4 px-1 rounded-full text-[10px] tabular-nums ${
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
            onChange={(e) => setSeverityFilter(e.target.value as WellbeingSeverity | "all")}
            className="h-8 px-2 rounded-md border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All severities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select
            value={kindFilter}
            onChange={(e) => setKindFilter(e.target.value as WellbeingKind | "all")}
            className="h-8 px-2 rounded-md border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All types</option>
            {(Object.keys(KIND_LABEL) as WellbeingKind[]).map((k) => (
              <option key={k} value={k}>
                {KIND_LABEL[k]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      {rows.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-16 text-center">
          <ShieldAlert className="size-6 text-muted-foreground/40 mx-auto mb-3" />
          <p className="text-sm text-foreground">
            {tab === "active" ? "Nothing flagged." : `No ${TAB_LABEL[tab].toLowerCase()} signals.`}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {tab === "active"
              ? "The Wellbeing Agent will surface patterns as they emerge."
              : "Move signals here via the actions on active alerts."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rows.map(({ signal, state }) => (
            <SignalCard
              key={signal.id}
              signal={signal}
              state={state}
              onSuggestLeave={() => handleSuggestLeave(signal)}
              onScheduleOneOnOne={() => handleScheduleOneOnOne(signal)}
              onShareResources={() => handleShareResources(signal)}
              onMarkAddressed={() => handleMarkAddressed(signal)}
              onDismissClick={() => setActionTarget({ kind: "dismiss", signal })}
              onEscalateClick={() => setActionTarget({ kind: "escalate", signal })}
            />
          ))}
        </div>
      )}

      {/* Dismiss / escalate modal */}
      <AnimatePresence>
        {actionTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-black/50"
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
            >
              <div className="bg-card border border-border rounded-xl shadow-xl max-w-md w-full pointer-events-auto p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className={`size-9 shrink-0 rounded-full flex items-center justify-center ${
                      actionTarget.kind === "escalate"
                        ? "bg-warning/10"
                        : "bg-secondary"
                    }`}
                  >
                    {actionTarget.kind === "escalate" ? (
                      <Siren className="size-5 text-warning" />
                    ) : (
                      <XCircle className="size-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {actionTarget.kind === "escalate"
                        ? `Escalate ${actionTarget.signal.employeeName}'s signal to HR?`
                        : `Dismiss ${actionTarget.signal.employeeName}'s signal?`}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {actionTarget.kind === "escalate"
                        ? "HR will see the signal, your reason, and the action history. This is the right path when you need additional support."
                        : "This signal will be removed from your active queue. Your reason (if any) is kept in the audit trail."}
                    </p>
                  </div>
                </div>
                <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
                  Reason {actionTarget.kind === "escalate" ? "(recommended)" : "(optional)"}
                </label>
                <textarea
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  rows={3}
                  placeholder={
                    actionTarget.kind === "escalate"
                      ? "What you've tried; why HR support helps now."
                      : "e.g. Confirmed with employee that this was situational, not a pattern."
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
                    onClick={actionTarget.kind === "escalate" ? handleConfirmEscalate : handleConfirmDismiss}
                    className={`h-9 px-3 rounded-lg text-white text-sm font-medium hover:opacity-90 transition-opacity ${
                      actionTarget.kind === "escalate" ? "bg-warning" : "bg-secondary text-foreground"
                    }`}
                  >
                    {actionTarget.kind === "escalate" ? "Escalate" : "Dismiss"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-lg bg-card border border-border shadow-lg flex items-center gap-2"
          >
            <CheckCircle2 className="size-4 text-success" />
            <span className="text-xs text-foreground">{flash}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
