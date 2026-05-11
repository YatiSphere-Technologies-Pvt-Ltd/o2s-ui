"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarPlus,
  Check,
  CheckCircle2,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  Trash2,
  UserCog,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import { DELEGATE_CANDIDATES, PEER_OVERLOAD_THRESHOLD, type DelegatePeer } from "@/components/leave/data";
import { DelegationStatusBanner } from "@/components/leave/delegation-banner";

export default function DelegationPage() {
  const { setScreen } = useScreen();
  const {
    delegation,
    activeDelegate,
    escalationTriggered,
    setDelegation,
    addDelegationWindow,
    removeDelegationWindow,
  } = useLeaveStore();

  const [flash, setFlash] = useState<string | null>(null);
  const [windowStart, setWindowStart] = useState("");
  const [windowEnd, setWindowEnd] = useState("");
  const [windowReason, setWindowReason] = useState("");

  useEffect(() => {
    setScreen({ module: "Leave", page: "Delegation" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2400);
  }

  function pickPeer(peerId: string) {
    setDelegation({ alwaysOnPeerId: peerId });
    flashOnce("Delegate updated.");
  }

  function pickEscalation(peerId: string) {
    setDelegation({ escalationPeerId: peerId });
    flashOnce("Escalation peer updated.");
  }

  function toggleAlwaysOn() {
    if (!delegation.alwaysOnPeerId) {
      flashOnce("Pick a delegate first.");
      return;
    }
    setDelegation({ alwaysOn: !delegation.alwaysOn });
    flashOnce(delegation.alwaysOn ? "Always-on delegation paused." : "Always-on delegation enabled.");
  }

  function submitWindow() {
    if (!windowStart || !windowEnd) {
      flashOnce("Pick both dates.");
      return;
    }
    if (windowEnd < windowStart) {
      flashOnce("End date must be on or after start.");
      return;
    }
    if (!delegation.alwaysOnPeerId) {
      flashOnce("Pick a delegate before scheduling.");
      return;
    }
    addDelegationWindow({ startISO: windowStart, endISO: windowEnd, reason: windowReason || undefined });
    setWindowStart("");
    setWindowEnd("");
    setWindowReason("");
    flashOnce("Scheduled window added.");
  }

  const candidates = DELEGATE_CANDIDATES;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3"
      >
        <Link
          href="/leave/manager"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Delegation</h1>
          <p className="text-sm text-muted-foreground">
            Auto-route approvals to a peer when you&apos;re out — with escalation if they&apos;re overloaded.
          </p>
        </div>
      </motion.div>

      {/* Active banner */}
      {activeDelegate && (
        <DelegationStatusBanner
          delegate={activeDelegate.peer}
          reason={activeDelegate.reason}
          escalation={escalationTriggered}
        />
      )}

      {/* Always-on delegate */}
      <section className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <UserCog className="size-4 text-brand" />
            <h2 className="text-sm font-semibold text-foreground">Always-on delegate</h2>
          </div>
          <button
            onClick={toggleAlwaysOn}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors ${
              delegation.alwaysOn
                ? "bg-success/10 text-success hover:bg-success/15"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {delegation.alwaysOn ? (
              <>
                <PlayCircle className="size-3" />
                Active
              </>
            ) : (
              <>
                <PauseCircle className="size-3" />
                Paused
              </>
            )}
          </button>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Picks up your approvals whenever you can&apos;t. You can keep this on permanently or toggle it as needed.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {candidates
            .filter((c) => !c.role.includes("Director"))
            .map((c) => (
              <PeerOption
                key={c.id}
                peer={c}
                selected={delegation.alwaysOnPeerId === c.id}
                onSelect={() => pickPeer(c.id)}
              />
            ))}
        </div>
      </section>

      {/* Escalation peer */}
      <section className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert className="size-4 text-warning" />
          <h2 className="text-sm font-semibold text-foreground">Escalation rule</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          If your delegate is also out, or has more than{" "}
          <span className="text-foreground font-medium tabular-nums">{PEER_OVERLOAD_THRESHOLD}</span> pending approvals,
          requests route here instead.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {candidates.map((c) => (
            <PeerOption
              key={c.id}
              peer={c}
              selected={delegation.escalationPeerId === c.id}
              onSelect={() => pickEscalation(c.id)}
              compact
            />
          ))}
        </div>
      </section>

      {/* Scheduled windows */}
      <section className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <CalendarPlus className="size-4 text-brand-teal" />
          <h2 className="text-sm font-semibold text-foreground">Scheduled windows</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-3">
          Add date ranges when you&apos;ll be fully out. Approvals route to your delegate automatically.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-3">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">From</label>
            <input
              type="date"
              value={windowStart}
              onChange={(e) => setWindowStart(e.target.value)}
              className="w-full h-9 px-2 rounded-md border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">To</label>
            <input
              type="date"
              value={windowEnd}
              onChange={(e) => setWindowEnd(e.target.value)}
              min={windowStart || undefined}
              className="w-full h-9 px-2 rounded-md border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1">Reason (optional)</label>
            <input
              type="text"
              value={windowReason}
              onChange={(e) => setWindowReason(e.target.value)}
              placeholder="e.g. Annual leave, conference"
              className="w-full h-9 px-2 rounded-md border border-input bg-card text-xs text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={submitWindow}
              className="w-full h-9 px-3 rounded-md bg-brand text-brand-foreground text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1"
            >
              <CalendarPlus className="size-3" />
              Add window
            </button>
          </div>
        </div>

        {delegation.scheduledWindows.length === 0 ? (
          <p className="text-[11px] text-muted-foreground italic">No scheduled windows yet.</p>
        ) : (
          <ul className="space-y-1.5">
            {delegation.scheduledWindows.map((w) => {
              const today = new Date().toISOString().slice(0, 10);
              const isActive = w.startISO <= today && today <= w.endISO;
              const isPast = w.endISO < today;
              return (
                <li
                  key={w.id}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border ${
                    isActive ? "border-success/40 bg-success/5" : isPast ? "border-border bg-secondary/30 opacity-70" : "border-border bg-surface-overlay/40"
                  }`}
                >
                  <CalendarPlus className={`size-3.5 shrink-0 ${isActive ? "text-success" : "text-muted-foreground"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-foreground tabular-nums">
                      {new Date(w.startISO).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      {" – "}
                      {new Date(w.endISO).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                    {w.reason && <p className="text-[11px] text-muted-foreground truncate">{w.reason}</p>}
                  </div>
                  {isActive && (
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider bg-success/15 text-success">
                      Active now
                    </span>
                  )}
                  <button
                    onClick={() => {
                      removeDelegationWindow(w.id);
                      flashOnce("Window removed.");
                    }}
                    className="p-1.5 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                    aria-label="Remove window"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

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

function PeerOption({
  peer,
  selected,
  onSelect,
  compact,
}: {
  peer: DelegatePeer;
  selected: boolean;
  onSelect: () => void;
  compact?: boolean;
}) {
  const overloaded = peer.currentLoad >= PEER_OVERLOAD_THRESHOLD;
  return (
    <button
      onClick={onSelect}
      className={`text-left p-3 rounded-lg border transition-colors ${
        selected ? "border-brand bg-brand/5" : "border-border bg-surface-overlay/40 hover:bg-surface-overlay"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className={`size-9 rounded-full ${peer.avatarColor} text-white text-[11px] font-bold flex items-center justify-center shrink-0`}>
          {peer.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-foreground truncate">{peer.name}</p>
          <p className="text-[11px] text-muted-foreground truncate">{peer.role}</p>
        </div>
        <span
          className={`size-3.5 rounded-full border-2 shrink-0 ${
            selected ? "border-brand bg-brand" : "border-border"
          }`}
        />
      </div>
      {!compact && (
        <div className="flex items-center gap-2 mt-2 text-[10px]">
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${overloaded ? "bg-destructive/10 text-destructive" : "bg-secondary text-muted-foreground"}`}>
            <Check className="size-2" />
            {peer.currentLoad} pending
          </span>
          {peer.outDuringWindow && (
            <span className="text-warning">Out next 2 weeks</span>
          )}
        </div>
      )}
    </button>
  );
}
