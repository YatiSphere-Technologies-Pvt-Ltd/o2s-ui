"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  AlertOctagon,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  CloudOff,
  GitBranch,
  Globe,
  History,
  Plane,
  ShieldAlert,
  Sparkles,
  UserCog,
  WifiOff,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { ConfirmDialog } from "@/components/leave/confirm-dialog";

export default function EdgeCasesShowcasePage() {
  const { setScreen } = useScreen();

  const [demo, setDemo] = useState<
    null
    | "policy_violation"
    | "low_balance"
    | "statutory_floor"
    | "destructive"
  >(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Edge cases" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
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
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Edge cases &amp; empty states</h1>
          <p className="text-sm text-muted-foreground">
            Reference designs for the states that build trust. Use them as conversation aids during reviews.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 1 — New hire, no leave taken yet */}
        <EdgeCard
          icon={Sparkles}
          tone="brand"
          title="New hire — nothing yet"
          summary="A fresh employee has no requests or activity. Show a warm welcome plus 'how to start' nudges."
        >
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-4xl mb-2">🌱</p>
            <p className="text-sm font-medium text-foreground">Welcome aboard.</p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Your balances accrue from your join date — first 1.5 PL days hit at the end of this month.
            </p>
            <button className="mt-3 text-[11px] text-brand hover:underline">Take the 2-min product tour →</button>
          </div>
        </EdgeCard>

        {/* 2 — Probation block */}
        <EdgeCard
          icon={ShieldAlert}
          tone="destructive"
          title="Probation period — request blocked"
          summary="Policy citation included, no override. Aurora suggests an alternative."
        >
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-destructive font-semibold">Policy §2.1</p>
            <p className="text-xs text-foreground">
              Privileged Leave isn&apos;t available during the 90-day probation window (Aug 14 → Nov 11). Sick and emergency leave still apply.
            </p>
            <p className="text-[11px] text-muted-foreground italic">
              Aurora: I&apos;ll keep this idea and remind you on Nov 12.
            </p>
          </div>
        </EdgeCard>

        {/* 3 — Negative balance approaching threshold */}
        <EdgeCard
          icon={AlertTriangle}
          tone="warning"
          title="Negative balance approaching"
          summary="Employee will go below zero on approval — warn but allow with manager override."
        >
          <div className="rounded-lg border border-warning/40 bg-warning/5 p-3 flex items-start gap-2">
            <AlertTriangle className="size-4 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-foreground">Balance impact: 2 → −1 PL days</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Per Policy §3.5, you can borrow up to 3 days against future accrual with manager sign-off.
              </p>
              <button
                onClick={() => setDemo("low_balance")}
                className="mt-2 text-[11px] text-brand hover:underline"
              >
                Trigger ConfirmDialog →
              </button>
            </div>
          </div>
        </EdgeCard>

        {/* 4 — Cross-country transfer mid-year */}
        <EdgeCard
          icon={Plane}
          tone="brand"
          title="Cross-country transfer mid-year"
          summary="When an employee moves jurisdictions, leave balances translate per policy version."
        >
          <div className="rounded-lg border border-border bg-card p-3 space-y-2">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
              <Plane className="size-3" />
              IN policy → UK policy · effective 1 Jul 2026
            </div>
            <ul className="text-[11px] text-muted-foreground space-y-0.5 list-disc list-inside">
              <li>PL balance translates 1:1 into UK Annual Leave allotment.</li>
              <li>India Sick Leave converts to UK SSP-eligible days.</li>
              <li>Aurora drafts a transition letter for the employee.</li>
            </ul>
          </div>
        </EdgeCard>

        {/* 5 — Retroactive policy change */}
        <EdgeCard
          icon={History}
          tone="warning"
          title="Retroactive policy change applied"
          summary="Policy v2 supersedes v1 from Mar 1; affected requests get re-evaluated and re-credited where applicable."
        >
          <div className="rounded-lg border border-warning/40 bg-warning/5 p-3 space-y-2">
            <p className="text-[11px] text-foreground">
              Policy <span className="font-mono">leave.sick.cert.v2</span> applied retroactively from 1 Mar 2026.
            </p>
            <p className="text-[11px] text-muted-foreground">
              7 sick-leave records re-credited 1 day each. 3 employees notified by Aurora; no employee action needed.
            </p>
            <p className="text-[10px] text-muted-foreground/60">Trail kept under Settings → Policy versions.</p>
          </div>
        </EdgeCard>

        {/* 6 — Approver on leave, cascade to delegate */}
        <EdgeCard
          icon={UserCog}
          tone="brand"
          title="Approver on leave → cascade to delegate"
          summary="Visual chain showing where the request is routing."
        >
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center gap-2 text-xs">
              <Avatar initials="MK" color="bg-brand-purple" />
              <span className="text-foreground">Meera</span>
              <span className="text-muted-foreground line-through">→</span>
              <span className="text-[10px] uppercase text-muted-foreground italic">on leave</span>
            </div>
            <div className="flex items-center gap-2 text-xs mt-2">
              <span className="text-muted-foreground pl-7">↓</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Avatar initials="AI" color="bg-warning" />
              <span className="text-foreground font-medium">Arjun</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider bg-success/15 text-success">Active delegate</span>
            </div>
          </div>
        </EdgeCard>

        {/* 7 — Statutory floor violation blocked */}
        <EdgeCard
          icon={ShieldAlert}
          tone="destructive"
          title="Statutory floor violation — blocked"
          summary="Hard policy: an employee can't waive a legal minimum. Block with explanation."
        >
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-destructive font-semibold">Statutory floor — India</p>
            <p className="text-xs text-foreground">
              Cannot reduce annual leave below 15 days/year (statutory minimum). Adjustment blocked.
            </p>
            <button
              onClick={() => setDemo("statutory_floor")}
              className="mt-1 text-[11px] text-brand hover:underline"
            >
              Trigger ConfirmDialog →
            </button>
          </div>
        </EdgeCard>

        {/* 8 — Agent low-confidence handoff */}
        <EdgeCard
          icon={GitBranch}
          tone="brand"
          title="Agent low-confidence handoff"
          summary="When the model is uncertain, route to a human gracefully."
        >
          <div className="rounded-lg border border-border bg-card p-3 space-y-2">
            <div className="flex items-start gap-2">
              <div className="size-6 rounded-full bg-linear-to-r from-brand to-brand-purple flex items-center justify-center shrink-0">
                <Sparkles className="size-3 text-white" />
              </div>
              <p className="text-xs text-foreground leading-snug">
                I&apos;m not sure how to handle this one — the request overlaps a country I haven&apos;t fully learned yet. I&apos;ve looped in HR; you&apos;ll hear back within a day.
              </p>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-warning font-semibold flex items-center gap-1">
              <AlertOctagon className="size-3" />
              Confidence 38% — escalating
            </p>
          </div>
        </EdgeCard>

        {/* 9 — Connectivity / sync failure */}
        <EdgeCard
          icon={CloudOff}
          tone="warning"
          title="Connectivity / sync failure"
          summary="Degraded mode: queues writes locally, banner explains state."
        >
          <div className="rounded-lg border border-warning/40 bg-warning/5 p-3 flex items-start gap-2">
            <WifiOff className="size-4 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-medium text-foreground">Offline — writes queued locally</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                We&apos;ll sync 2 pending changes the moment connection returns. Read-only views still work.
              </p>
              <p className="text-[10px] text-muted-foreground/60 mt-1">Last synced 3m ago.</p>
            </div>
          </div>
        </EdgeCard>

        {/* 10 — Country not supported */}
        <EdgeCard
          icon={Globe}
          tone="brand"
          title="Country not yet supported"
          summary="Capture interest gracefully without blocking the employee."
        >
          <div className="rounded-lg border border-border bg-card p-3 space-y-2">
            <p className="text-xs text-foreground">
              Brazil-specific leave types aren&apos;t in O2S yet. Your request is routed to generic Privileged Leave for now.
            </p>
            <p className="text-[11px] text-muted-foreground">
              Want priority? <button className="text-brand hover:underline">Request the BR country pack →</button>
            </p>
          </div>
        </EdgeCard>

        {/* Demo: destructive trigger */}
        <EdgeCard
          icon={AlertOctagon}
          tone="destructive"
          title="Destructive action confirmation"
          summary="High-risk operations use typed-confirm to slow the user down."
        >
          <button
            onClick={() => setDemo("destructive")}
            className="text-[11px] text-brand hover:underline"
          >
            Trigger ConfirmDialog (type-to-confirm) →
          </button>
        </EdgeCard>

        {/* Demo: policy_violation trigger */}
        <EdgeCard
          icon={AlertTriangle}
          tone="warning"
          title="Policy violation confirmation"
          summary="Warn-and-proceed pattern for soft policy breaks."
        >
          <button
            onClick={() => setDemo("policy_violation")}
            className="text-[11px] text-brand hover:underline"
          >
            Trigger ConfirmDialog →
          </button>
        </EdgeCard>
      </div>

      {/* Confirm demos */}
      <ConfirmDialog
        open={demo === "policy_violation"}
        variant="policy_violation"
        title="Approve outside policy window?"
        body="This request was submitted 1 day before start — below the 3-day notice requirement in Policy §3.2. You can override with a note."
        citation="Policy §3.2 · Notice period"
        confirmLabel="Override and approve"
        withNote
        onConfirm={(n) => {
          flashOnce(`Approved with override${n ? `: "${n}"` : ""}.`);
          setDemo(null);
        }}
        onClose={() => setDemo(null)}
      />
      <ConfirmDialog
        open={demo === "low_balance"}
        variant="low_balance"
        title="Approve below minimum balance?"
        body="Approving will leave the employee at -1 days PL — below the 0-day floor. Allowed with manager sign-off per Policy §3.5."
        citation="Policy §3.5 · Negative balance"
        confirmLabel="Approve and borrow"
        withNote
        onConfirm={(n) => {
          flashOnce(`Approved with borrow${n ? `: "${n}"` : ""}.`);
          setDemo(null);
        }}
        onClose={() => setDemo(null)}
      />
      <ConfirmDialog
        open={demo === "statutory_floor"}
        variant="statutory_floor"
        title="Cannot reduce statutory minimum"
        body="India's Factories Act mandates 15 annual leave days/year. This adjustment would bring the employee to 12. Blocked."
        citation="Statutory floor · India · §79 Factories Act 1948"
        confirmLabel="Override"
        block
        onConfirm={() => setDemo(null)}
        onClose={() => setDemo(null)}
      />
      <ConfirmDialog
        open={demo === "destructive"}
        variant="destructive"
        title="Delete leave policy?"
        body="This unpublishes the policy and detaches it from 412 active employees. Cannot be undone — but versions remain in audit."
        confirmLabel="Delete policy"
        typeToConfirm="delete"
        onConfirm={() => {
          flashOnce("Policy deleted.");
          setDemo(null);
        }}
        onClose={() => setDemo(null)}
      />

      {flash && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-70 px-4 py-2.5 rounded-lg bg-card border border-border shadow-lg flex items-center gap-2">
          <CheckCircle2 className="size-4 text-success" />
          <span className="text-xs text-foreground">{flash}</span>
        </div>
      )}
    </div>
  );
}

function EdgeCard({
  icon: Icon,
  tone,
  title,
  summary,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: "brand" | "warning" | "destructive";
  title: string;
  summary: string;
  children: React.ReactNode;
}) {
  const meta =
    tone === "destructive"
      ? { tint: "bg-destructive/10", color: "text-destructive" }
      : tone === "warning"
      ? { tint: "bg-warning/10", color: "text-warning" }
      : { tint: "bg-brand/10", color: "text-brand" };

  return (
    <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <div className={`size-9 shrink-0 rounded-lg flex items-center justify-center ${meta.tint}`}>
          <Icon className={`size-4 ${meta.color}`} />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground leading-snug">{title}</h3>
          <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">{summary}</p>
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function Avatar({ initials, color }: { initials: string; color: string }) {
  return (
    <span className={`size-6 rounded-full ${color} text-white text-[9px] font-bold flex items-center justify-center`}>
      {initials}
    </span>
  );
}
