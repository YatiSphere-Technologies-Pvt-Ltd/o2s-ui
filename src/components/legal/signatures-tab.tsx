"use client";

import { motion } from "framer-motion";
import { Bell, XCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  PENDING_SIGNATURES,
  SIG_STATUS_CONFIG,
  type Contract,
} from "@/components/legal/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

function daysSinceCreated(createdAt: string): number {
  const created = new Date(createdAt);
  const now = new Date("2026-03-27");
  return Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24));
}

function SignerTimeline({ contract }: { contract: Contract }) {
  return (
    <div className="space-y-0">
      {contract.signatures.map((signer, i) => {
        const cfg = SIG_STATUS_CONFIG[signer.status];
        return (
          <div key={i} className="flex items-start gap-3">
            {/* Vertical line connector */}
            <div className="flex flex-col items-center">
              <span className={`text-sm ${cfg?.colorClass ?? "text-muted-foreground"}`}>
                {cfg?.icon ?? "?"}
              </span>
              {i < contract.signatures.length - 1 && (
                <div className="w-px h-4 bg-border" />
              )}
            </div>
            <div className="flex items-center gap-2 text-xs pb-2">
              <span className="text-foreground font-medium">{signer.name}</span>
              <span className="text-muted-foreground">({signer.role})</span>
              {signer.status === "signed" && contract.executedDate && (
                <span className="text-muted-foreground text-[10px]">{contract.executedDate}</span>
              )}
              <span className={`text-[10px] ${cfg?.colorClass ?? "text-muted-foreground"}`}>
                {cfg?.label ?? signer.status}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function SignaturesTab() {
  return (
    <div className="space-y-4">
      {PENDING_SIGNATURES.map((c, i) => {
        const days = daysSinceCreated(c.createdAt);
        const overdue = days > 5;

        return (
          <motion.div
            key={c.id}
            {...fadeIn}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] as const, delay: i * 0.04 }}
            className={`bg-card border border-border rounded-xl p-5 space-y-4 ${
              overdue ? "bg-destructive/5 border-l-[3px] border-l-destructive" : ""
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{c.id}</span>
                  <span className="font-semibold text-sm text-foreground">{c.title}</span>
                </div>
                <span className="text-xs text-muted-foreground">Party B: {c.partyB.name}</span>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">{days} days pending</div>
                {overdue && (
                  <span className="text-[10px] text-destructive font-medium">Overdue</span>
                )}
              </div>
            </div>

            {/* Signature Progress */}
            <SignerTimeline contract={c} />

            {/* Sent via */}
            <div className="text-[10px] text-muted-foreground">
              Sent via: {c.partyB.type === "vendor" ? "DocuSign" : "Internal"}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-1">
              <Button variant="outline" size="xs">
                <Bell className="size-3" />
                Send Reminder
              </Button>
              <Button variant="outline" size="xs" className="text-destructive border-destructive/30 hover:bg-destructive/10">
                <XCircle className="size-3" />
                Void
              </Button>
              <Button variant="outline" size="xs">
                <Eye className="size-3" />
                View Contract
              </Button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
