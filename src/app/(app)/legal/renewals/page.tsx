"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Sparkles,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useClmStore } from "@/lib/clm-store";
import {
  CONTRACT_TYPE_LABEL,
  contractById as seedContractById,
  counterpartyById,
  formatINR,
  type RenewalEvent,
} from "@/components/legal/clm/data";

type WindowFilter = "all" | "30" | "60" | "90" | "180";

const RECO_ICON = {
  renew: CheckCircle2,
  renegotiate: RotateCcw,
  terminate: XCircle,
  decision_pending: TriangleAlert,
};
const RECO_TONE = {
  renew: "text-success bg-success/10 border-success/40",
  renegotiate: "text-warning bg-warning/10 border-warning/40",
  terminate: "text-destructive bg-destructive/10 border-destructive/40",
  decision_pending: "text-muted-foreground bg-secondary border-border",
};

export default function RenewalsPage() {
  const { setScreen } = useScreen();
  const { renewals, decideRenewal } = useClmStore();
  const [windowFilter, setWindowFilter] = useState<WindowFilter>("90");
  const [statusFilter, setStatusFilter] = useState<"open" | "decided" | "all">("open");

  useEffect(() => {
    setScreen({ module: "Legal", page: "Renewals" });
    return () => setScreen(null);
  }, [setScreen]);

  const filtered = useMemo(() => {
    return renewals
      .filter((r) => {
        if (statusFilter === "open" && r.decisionStatus !== "open") return false;
        if (statusFilter === "decided" && r.decisionStatus === "open") return false;
        if (windowFilter === "all") return true;
        const maxDays = Number(windowFilter);
        return r.daysUntilEvent <= maxDays;
      })
      .sort((a, b) => a.daysUntilEvent - b.daysUntilEvent);
  }, [renewals, windowFilter, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3"
      >
        <Link
          href="/legal"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
            <Calendar className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Renewals</h1>
            <p className="text-sm text-muted-foreground">
              12 months out. Renewal Sentinel surfaces each contract with a recommendation grounded in usage and alternatives.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-2 flex-wrap">
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mr-1">Window</p>
        {(["30", "60", "90", "180", "all"] as const).map((w) => (
          <button
            key={w}
            onClick={() => setWindowFilter(w)}
            className={`h-8 px-2.5 rounded-lg text-[11px] transition-colors ${
              windowFilter === w
                ? "bg-warning/10 text-warning border border-warning/30"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {w === "all" ? "All" : `≤ ${w}d`}
          </button>
        ))}
        <span className="text-muted-foreground/40 mx-1">·</span>
        {(["open", "decided", "all"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`h-8 px-2.5 rounded-lg text-[11px] transition-colors capitalize ${
              statusFilter === s
                ? "bg-brand/10 text-brand border border-brand/30"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((r) => (
          <RenewalCard key={r.id} renewal={r} onDecide={(d) => decideRenewal(r.id, d)} />
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground italic py-12">No renewals in this window.</p>
        )}
      </div>
    </div>
  );
}

function RenewalCard({
  renewal,
  onDecide,
}: {
  renewal: RenewalEvent;
  onDecide: (d: "renew" | "renegotiate" | "terminate") => void;
}) {
  const contract = seedContractById(renewal.contractId);
  const cp = contract ? counterpartyById(contract.counterpartyId) : undefined;
  const RecoIcon = RECO_ICON[renewal.recommendation];
  const decided = renewal.decisionStatus !== "open";
  const overdue = renewal.daysUntilEvent < 0 && renewal.decisionStatus === "open";

  return (
    <article className="bg-card border border-border rounded-xl overflow-hidden">
      <header className="px-4 py-3 bg-surface-overlay/40 border-b border-border flex items-start gap-3 flex-wrap">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/legal/contracts/${renewal.contractId}`} className="text-sm font-semibold text-foreground hover:underline">
              {contract?.title ?? renewal.contractId}
            </Link>
            <code className="text-[10px] font-mono text-muted-foreground/60">{contract?.id}</code>
            {overdue && (
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium bg-destructive/10 text-destructive">
                Window passed
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-0.5 flex-wrap">
            <span>{cp?.name}</span>
            <span>·</span>
            <span>{contract && CONTRACT_TYPE_LABEL[contract.type]}</span>
            <span>·</span>
            <span>{contract && formatINR(contract.valueINR)}</span>
            <span>·</span>
            <span>Event: {renewal.eventDateISO}</span>
            <span>·</span>
            <span>Notice opens: {renewal.noticeWindowOpensISO}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{renewal.daysUntilEvent >= 0 ? "Days until" : "Days ago"}</p>
          <p className={`text-2xl font-bold tabular-nums ${overdue ? "text-destructive" : renewal.daysUntilEvent <= 30 ? "text-warning" : "text-foreground"}`}>
            {Math.abs(renewal.daysUntilEvent)}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3">
        <div className="p-3 md:border-r border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="size-3.5 text-brand-purple" />
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Recommendation</p>
          </div>
          <div className={`inline-flex items-center gap-1.5 text-sm font-semibold mt-1.5 px-2 py-1 rounded border ${RECO_TONE[renewal.recommendation]}`}>
            <RecoIcon className="size-3.5" />
            <span className="capitalize">{renewal.recommendation.replace("_", " ")}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-2 capitalize">{renewal.kind.replace("_", " ")}</p>
        </div>

        <div className="p-3 md:border-r border-border">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Signals</p>
          <ul className="mt-1.5 space-y-1">
            {renewal.signals.map((s, i) => (
              <li key={i} className="flex items-start gap-1.5 text-[11px]">
                <span className={`mt-0.5 ${s.tone === "positive" ? "text-success" : s.tone === "negative" ? "text-destructive" : "text-muted-foreground"}`}>
                  {s.tone === "positive" ? "+" : s.tone === "negative" ? "−" : "="}
                </span>
                <span className="text-foreground">{s.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Alternatives</p>
          {renewal.alternatives.length === 0 ? (
            <p className="text-[11px] text-muted-foreground/60 italic mt-1.5">—</p>
          ) : (
            <ul className="mt-1.5 space-y-1">
              {renewal.alternatives.map((a, i) => (
                <li key={i} className="flex items-start gap-1.5 text-[11px] text-foreground">
                  <ChevronRight className="size-3 text-muted-foreground/40 mt-0.5 shrink-0" />
                  {a}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <footer className="px-4 py-2.5 bg-surface-overlay/30 border-t border-border flex items-center gap-2 flex-wrap">
        {decided ? (
          <p className="text-[11px] text-foreground">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mr-2">Decision</span>
            {renewal.decisionStatus.replace("decided_", "").replace(/_/g, " ")} by {renewal.decisionBy} on {renewal.decisionWhenISO?.slice(0, 10)}
          </p>
        ) : (
          <>
            <button
              onClick={() => onDecide("renew")}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-[11px] bg-success/10 text-success border border-success/40 hover:bg-success/20 transition-colors"
            >
              <CheckCircle2 className="size-3" />
              Renew
            </button>
            <button
              onClick={() => onDecide("renegotiate")}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-[11px] bg-warning/10 text-warning border border-warning/40 hover:bg-warning/20 transition-colors"
            >
              <RotateCcw className="size-3" />
              Renegotiate
            </button>
            <button
              onClick={() => onDecide("terminate")}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded text-[11px] bg-destructive/10 text-destructive border border-destructive/40 hover:bg-destructive/20 transition-colors"
            >
              <XCircle className="size-3" />
              Terminate
            </button>
          </>
        )}
        <Link
          href={`/legal/contracts/${renewal.contractId}`}
          className="text-[11px] text-brand hover:underline ml-auto inline-flex items-center gap-1"
        >
          Open contract <ChevronRight className="size-3" />
        </Link>
      </footer>
    </article>
  );
}
