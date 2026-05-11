"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, CalendarDays, CheckCircle2, Users, XCircle } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  MANAGER_FIRST_NAME,
  TEAM_CAPACITY_NEXT_4,
  TEAM_OUT_TODAY,
  TEAM_OUT_THIS_WEEK,
  LEAVE_TYPE_MAP,
  type TeamRequest,
  type WellbeingSignal,
} from "@/components/leave/data";
import { ApprovalQueueCard } from "@/components/leave/approval-queue";
import { WellbeingAlerts } from "@/components/leave/wellbeing-alerts";
import { TeamCapacitySparkline } from "@/components/leave/team-capacity";
import { ManagerStats } from "@/components/leave/manager-stats";
import { DecisionsLog } from "@/components/leave/decisions-log";
import { DelegationStatusBanner } from "@/components/leave/delegation-banner";

export default function ManagerHomePage() {
  const { setScreen } = useScreen();
  const {
    teamRequests,
    decisionLog,
    activeSignals,
    decideTeamRequest,
    decideTeamRequestsBulk,
    dismissSignal,
    activeDelegate,
    escalationTriggered,
  } = useLeaveStore();

  const [denyTarget, setDenyTarget] = useState<TeamRequest | null>(null);
  const [denyReason, setDenyReason] = useState("");
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Manager Home" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  function handleApprove(id: string) {
    decideTeamRequest(id, "approved");
    const target = teamRequests.find((r) => r.id === id);
    flashOnce(target ? `Approved ${target.employeeName.split(" ")[0]}'s request.` : "Approved.");
  }

  function handleDeny() {
    if (!denyTarget) return;
    decideTeamRequest(denyTarget.id, "rejected", denyReason || undefined);
    flashOnce(`Denied ${denyTarget.employeeName.split(" ")[0]}'s request.`);
    setDenyTarget(null);
    setDenyReason("");
  }

  function handleSignalAction(s: WellbeingSignal) {
    flashOnce(`1:1 with ${s.employeeName} drafted in your calendar.`);
  }

  // Stats
  const pending = teamRequests.filter((r) => r.status === "pending");
  const avgApprovalHours = 3.4;
  const totalAvailable = TEAM_CAPACITY_NEXT_4[0].available;
  const totalCapacity = TEAM_CAPACITY_NEXT_4[0].total;
  const utilization = Math.round(((totalCapacity - totalAvailable) / totalCapacity) * 100);

  const outToday = useMemo(() => TEAM_OUT_TODAY, []);
  const outThisWeek = useMemo(() => TEAM_OUT_THIS_WEEK, []);
  const [outRange, setOutRange] = useState<"today" | "week">("today");
  const out = outRange === "today" ? outToday : outThisWeek;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Hi {MANAGER_FIRST_NAME} — {pending.length === 0 ? "queue is clear." : (
            <>
              <span className="text-brand">{pending.length} request{pending.length !== 1 ? "s" : ""}</span> waiting.
            </>
          )}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Triage your queue, watch capacity, and keep an eye on wellbeing.
        </p>
      </motion.div>

      {/* Delegation status (only when active) */}
      {activeDelegate && (
        <DelegationStatusBanner
          delegate={activeDelegate.peer}
          reason={activeDelegate.reason}
          escalation={escalationTriggered}
        />
      )}

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.05 }}
      >
        <ManagerStats
          pendingCount={pending.length}
          avgApprovalHours={avgApprovalHours}
          teamUtilization={utilization}
        />
      </motion.div>

      {/* Queue */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: 0.1 }}
      >
        <ApprovalQueueCard
          requests={teamRequests}
          otherRequests={teamRequests}
          onApprove={handleApprove}
          onDenyClick={(r) => setDenyTarget(r)}
          onBulkApprove={(ids) => {
            decideTeamRequestsBulk(ids, "approved");
            flashOnce(`Approved ${ids.length} request${ids.length !== 1 ? "s" : ""}.`);
          }}
          onBulkDeny={(ids) => {
            decideTeamRequestsBulk(ids, "rejected", "Bulk decision.");
            flashOnce(`Denied ${ids.length} request${ids.length !== 1 ? "s" : ""}.`);
          }}
          delegateLabel={
            activeDelegate
              ? escalationTriggered?.peer.name ?? activeDelegate.peer.name
              : null
          }
        />
      </motion.div>

      {/* Two-column lower section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3 — capacity + wellbeing + decisions */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="lg:col-span-2 space-y-6"
        >
          <TeamCapacitySparkline points={TEAM_CAPACITY_NEXT_4} />
          <WellbeingAlerts
            signals={activeSignals}
            onAction={handleSignalAction}
            onDismiss={dismissSignal}
          />
          <DecisionsLog entries={decisionLog} />
        </motion.div>

        {/* Right 1/3 — out today/week + quick links */}
        <motion.aside
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="space-y-6"
        >
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Users className="size-4 text-brand-teal" />
                <h3 className="text-sm font-semibold text-foreground">Out {outRange === "today" ? "today" : "this week"}</h3>
              </div>
              <div className="flex gap-1 bg-secondary rounded-md p-0.5 text-[11px]">
                {(["today", "week"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setOutRange(r)}
                    className={`px-2 py-1 rounded transition-colors ${
                      outRange === r ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {r === "today" ? "Today" : "This week"}
                  </button>
                ))}
              </div>
            </div>

            {out.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">Nobody out — full crew.</p>
            ) : (
              <div className="space-y-2">
                {out.map((m) => {
                  const type = LEAVE_TYPE_MAP[m.leaveType];
                  return (
                    <div key={m.id} className="flex items-center gap-3">
                      <div className={`size-8 shrink-0 rounded-full ${m.avatarColor} text-white text-[10px] font-bold flex items-center justify-center`}>
                        {m.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">{m.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          <span className={type.color}>{type.shortLabel}</span>
                          {m.modifier ? ` · ${m.modifier}` : ""}
                        </p>
                      </div>
                      <span className="text-[10px] text-muted-foreground/60 whitespace-nowrap">{m.whenLabel}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-3">Quick links</h3>
            <div className="space-y-1.5 text-xs">
              <Link href="/leave/team" className="flex items-center gap-2 text-foreground hover:text-brand transition-colors">
                <Users className="size-3.5 text-muted-foreground" />
                Team leave overview
                <ArrowRight className="size-3 ml-auto opacity-50" />
              </Link>
              <Link href="/leave/approvals" className="flex items-center gap-2 text-foreground hover:text-brand transition-colors">
                <CheckCircle2 className="size-3.5 text-muted-foreground" />
                Full approvals queue
                <ArrowRight className="size-3 ml-auto opacity-50" />
              </Link>
              <Link href="/leave/calendar" className="flex items-center gap-2 text-foreground hover:text-brand transition-colors">
                <CalendarDays className="size-3.5 text-muted-foreground" />
                Team calendar
                <ArrowRight className="size-3 ml-auto opacity-50" />
              </Link>
              <Link href="/leave/manager/reports" className="flex items-center gap-2 text-foreground hover:text-brand transition-colors">
                <CheckCircle2 className="size-3.5 text-muted-foreground" />
                Reports
                <ArrowRight className="size-3 ml-auto opacity-50" />
              </Link>
              <Link href="/leave/manager/delegation" className="flex items-center gap-2 text-foreground hover:text-brand transition-colors">
                <Users className="size-3.5 text-muted-foreground" />
                Delegation
                <ArrowRight className="size-3 ml-auto opacity-50" />
              </Link>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Deny reason modal */}
      <AnimatePresence>
        {denyTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-50 bg-black/50"
              onClick={() => setDenyTarget(null)}
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
                  <div className="size-9 shrink-0 rounded-full bg-destructive/10 flex items-center justify-center">
                    <XCircle className="size-5 text-destructive" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">
                      Deny {denyTarget.employeeName}&apos;s request?
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {LEAVE_TYPE_MAP[denyTarget.type].label} · {denyTarget.startDate}
                      {denyTarget.startDate === denyTarget.endDate ? "" : ` – ${denyTarget.endDate}`}
                    </p>
                  </div>
                </div>
                <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
                  Reason (optional, shared with employee)
                </label>
                <textarea
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  rows={3}
                  placeholder="e.g. Quarter close that week — please retry the week after."
                  className="w-full px-3 py-2 rounded-lg bg-secondary text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:ring-2 focus:ring-brand/40 resize-none"
                />
                <div className="flex items-center justify-end gap-2 mt-4">
                  <button
                    onClick={() => setDenyTarget(null)}
                    className="h-9 px-3 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeny}
                    className="h-9 px-3 rounded-lg bg-destructive text-white text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    Deny request
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Flash bar */}
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
