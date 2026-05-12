"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, MessageSquare } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useClmStore } from "@/lib/clm-store";
import {
  CONTRACT_TYPE_LABEL,
  CLAUSE_LABEL,
  CLAUSE_TINT,
  STATUS_LABEL,
  STATUS_TINT,
  counterpartyById,
  formatINR,
  type ContractStatus,
} from "@/components/legal/clm/data";

const IN_FLIGHT: ContractStatus[] = [
  "intake",
  "drafting",
  "internal_review",
  "out_to_counterparty",
  "negotiation",
  "approval",
  "out_for_signature",
];

export default function NegotiationPage() {
  const { setScreen } = useScreen();
  const { contracts } = useClmStore();
  const [whoHasBall, setWhoHasBall] = useState<"all" | "us" | "counterparty">("all");

  useEffect(() => {
    setScreen({ module: "Legal", page: "Negotiation" });
    return () => setScreen(null);
  }, [setScreen]);

  const inFlight = useMemo(() => {
    return contracts
      .filter((c) => IN_FLIGHT.includes(c.status))
      .filter((c) => {
        if (whoHasBall === "all") return true;
        const lastRound = c.rounds[c.rounds.length - 1];
        // If last round was us, then ball is with counterparty (and vice versa).
        if (!lastRound) return whoHasBall === "us";
        return whoHasBall === "us" ? lastRound.byParty === "counterparty" : lastRound.byParty === "us";
      })
      .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
  }, [contracts, whoHasBall]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3"
      >
        <Link
          href="/legal/contracts"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
            <MessageSquare className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Negotiation tracker</h1>
            <p className="text-sm text-muted-foreground">
              {inFlight.length} contracts in flight. Who has the ball, what changed, why.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-2">
        {(["all", "us", "counterparty"] as const).map((w) => (
          <button
            key={w}
            onClick={() => setWhoHasBall(w)}
            className={`h-9 px-2.5 rounded-lg text-[11px] transition-colors capitalize ${
              whoHasBall === w
                ? "bg-brand-purple/10 text-brand-purple border border-brand-purple/30"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {w === "all" ? "All" : `Ball with ${w}`}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {inFlight.map((c) => {
          const cp = counterpartyById(c.counterpartyId);
          const lastRound = c.rounds[c.rounds.length - 1];
          const ballWith = !lastRound
            ? "us"
            : lastRound.byParty === "us"
              ? "counterparty"
              : "us";
          const openDeviations = c.deviations.filter((d) => d.status === "open");
          return (
            <li key={c.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <Link
                href={`/legal/contracts/${c.id}`}
                className="block px-4 py-3 hover:bg-surface-overlay/40 transition-colors"
              >
                <div className="flex items-start gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground">{c.title}</p>
                  <code className="text-[10px] font-mono text-muted-foreground/60">{c.id}</code>
                  <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${STATUS_TINT[c.status]}`}>
                    {STATUS_LABEL[c.status]}
                  </span>
                  <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${ballWith === "us" ? "bg-destructive/10 text-destructive" : "bg-brand-purple/10 text-brand-purple"}`}>
                    Ball: {ballWith}
                  </span>
                  <ChevronRight className="size-3.5 text-muted-foreground/40 ml-auto" />
                </div>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1.5 flex-wrap">
                  <span>{cp?.name}</span>
                  <span>·</span>
                  <span>{CONTRACT_TYPE_LABEL[c.type]}</span>
                  <span>·</span>
                  <span>{formatINR(c.valueINR)}</span>
                  <span>·</span>
                  <span>Round {c.rounds.length}</span>
                  <span>·</span>
                  <span>Last activity {c.lastActivityAt}</span>
                </div>
                {lastRound && (
                  <p className="text-[12px] text-foreground mt-2 italic leading-snug">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mr-2">
                      {lastRound.byParty === "us" ? "We" : cp?.shortName} sent
                    </span>
                    {lastRound.changes}
                  </p>
                )}
                {openDeviations.length > 0 && (
                  <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                    {openDeviations.slice(0, 4).map((d) => (
                      <span key={d.topic} className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${CLAUSE_TINT[d.severity]}`}>
                        {CLAUSE_LABEL[d.severity]} · {d.topic}
                      </span>
                    ))}
                    {openDeviations.length > 4 && (
                      <span className="text-[10px] text-muted-foreground">+{openDeviations.length - 4} more</span>
                    )}
                  </div>
                )}
              </Link>
            </li>
          );
        })}
        {inFlight.length === 0 && (
          <li className="text-center text-sm text-muted-foreground italic py-12">No contracts match.</li>
        )}
      </ul>
    </div>
  );
}
