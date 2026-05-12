"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Check, ChevronRight, Clock, FileSignature } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useClmStore } from "@/lib/clm-store";
import { CONTRACT_TYPE_LABEL, counterpartyById, formatINR } from "@/components/legal/clm/data";

export default function SignaturesHubPage() {
  const { setScreen } = useScreen();
  const { contracts, markSigned } = useClmStore();

  useEffect(() => {
    setScreen({ module: "Legal", page: "Signatures" });
    return () => setScreen(null);
  }, [setScreen]);

  const inFlight = useMemo(() => {
    return contracts
      .filter((c) => c.status === "out_for_signature" || c.signatures.some((s) => s.status === "pending"))
      .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt));
  }, [contracts]);

  const recentlyExecuted = useMemo(() => {
    return contracts
      .filter((c) => c.signatures.length > 0 && c.signatures.every((s) => s.status === "signed"))
      .sort((a, b) => b.lastActivityAt.localeCompare(a.lastActivityAt))
      .slice(0, 6);
  }, [contracts]);

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
          <div className="size-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <FileSignature className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Signatures</h1>
            <p className="text-sm text-muted-foreground">
              {inFlight.length} contracts in signing. DocuSign / Adobe Sign / native fallback.
            </p>
          </div>
        </div>
      </motion.div>

      <section>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">In flight</p>
        <ul className="bg-card border border-border rounded-xl overflow-hidden">
          {inFlight.map((c) => {
            const cp = counterpartyById(c.counterpartyId);
            const signed = c.signatures.filter((s) => s.status === "signed").length;
            const pending = c.signatures.filter((s) => s.status === "pending");
            return (
              <li key={c.id} className="border-b border-border last:border-b-0">
                <div className="px-4 py-3 hover:bg-surface-overlay/40 transition-colors">
                  <Link href={`/legal/contracts/${c.id}`} className="flex items-start gap-3 flex-wrap">
                    <div className="size-9 rounded-lg bg-secondary text-muted-foreground flex items-center justify-center shrink-0">
                      <FileSignature className="size-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">{c.title}</p>
                      <div className="flex items-center gap-2 text-[11px] text-muted-foreground/70 mt-0.5 flex-wrap">
                        <code className="font-mono">{c.id}</code>
                        <span>·</span>
                        <span>{cp?.name}</span>
                        <span>·</span>
                        <span>{CONTRACT_TYPE_LABEL[c.type]}</span>
                        <span>·</span>
                        <span>{formatINR(c.valueINR)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-medium tabular-nums">{signed} / {c.signatures.length}</span>
                      <ChevronRight className="size-3.5 text-muted-foreground/40" />
                    </div>
                  </Link>
                  {pending.length > 0 && (
                    <ul className="mt-3 ml-12 space-y-1">
                      {pending.map((s) => {
                        const key = `${s.party}:${s.signerName}`;
                        return (
                          <li key={key} className="flex items-center gap-2 text-[11px]">
                            <Clock className="size-3 text-warning" />
                            <span className="text-foreground">{s.signerName}</span>
                            <span className="text-muted-foreground">{s.signerTitle}</span>
                            <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ml-auto ${s.party === "us" ? "bg-brand/10 text-brand" : "bg-brand-purple/10 text-brand-purple"}`}>
                              {s.party}
                            </span>
                            <button
                              onClick={() => markSigned(c.id, key, new Date().toISOString())}
                              className="inline-flex items-center gap-1 h-6 px-2 rounded text-[10px] bg-card border border-border hover:bg-surface-overlay transition-colors"
                            >
                              <Check className="size-2.5" />
                              Mark signed
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
          {inFlight.length === 0 && (
            <li className="px-4 py-12 text-center text-sm text-muted-foreground italic">
              No contracts awaiting signature.
            </li>
          )}
        </ul>
      </section>

      <section>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Recently executed</p>
        <ul className="bg-card border border-border rounded-xl overflow-hidden">
          {recentlyExecuted.map((c) => {
            const cp = counterpartyById(c.counterpartyId);
            const lastSigned = c.signatures
              .filter((s) => s.signedAt)
              .map((s) => s.signedAt!)
              .sort((a, b) => b.localeCompare(a))[0];
            return (
              <li key={c.id} className="border-b border-border last:border-b-0">
                <Link
                  href={`/legal/contracts/${c.id}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-overlay/40 transition-colors"
                >
                  <Check className="size-3.5 text-success" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{c.title}</p>
                    <p className="text-[11px] text-muted-foreground">{cp?.name} · executed {lastSigned?.slice(0, 10) ?? "—"}</p>
                  </div>
                  <ChevronRight className="size-3.5 text-muted-foreground/40" />
                </Link>
              </li>
            );
          })}
          {recentlyExecuted.length === 0 && (
            <li className="px-4 py-8 text-center text-sm text-muted-foreground italic">Nothing executed recently.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
