"use client";

import Link from "next/link";
import { ArrowRight, ShieldAlert, UserCog } from "lucide-react";
import type { DelegatePeer } from "@/components/leave/data";

interface Props {
  delegate: DelegatePeer;
  reason: "scheduled" | "always_on";
  escalation: { peer: DelegatePeer; cause: "peer_overloaded" | "peer_out" } | null;
}

const CAUSE_COPY: Record<NonNullable<Props["escalation"]>["cause"], string> = {
  peer_overloaded: "your delegate is overloaded",
  peer_out: "your delegate is themselves out",
};

export function DelegationStatusBanner({ delegate, reason, escalation }: Props) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-brand/5 border border-brand/30">
      <UserCog className="size-4 text-brand shrink-0" />
      <div className="flex-1 min-w-0 text-[12px] leading-relaxed text-foreground">
        <span className="font-medium">
          {reason === "scheduled" ? "You're out — approvals are routing to" : "Approvals are routing to"}
        </span>{" "}
        <span className="inline-flex items-center gap-1.5 align-middle">
          <span className={`size-4 rounded-full ${delegate.avatarColor} text-white text-[9px] font-bold flex items-center justify-center`}>
            {delegate.initials}
          </span>
          <span className="text-foreground font-medium">{delegate.name}</span>
        </span>
        <span className="text-muted-foreground">.</span>
        {escalation && (
          <span className="inline-flex items-center gap-1.5 ml-3 text-warning">
            <ShieldAlert className="size-3" />
            Escalating to <span className="font-medium">{escalation.peer.name}</span> — {CAUSE_COPY[escalation.cause]}.
          </span>
        )}
      </div>
      <Link
        href="/leave/manager/delegation"
        className="inline-flex items-center gap-1 text-[11px] text-brand hover:underline shrink-0"
      >
        Manage <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}
