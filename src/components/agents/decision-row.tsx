"use client";

import Link from "next/link";
import { Check, ChevronRight, X } from "lucide-react";
import {
  OUTCOME_LABEL,
  OUTCOME_TINT,
  TONE_TINT,
  type AgentDecision,
  type AgentSpec,
} from "./types";
import { AgentIcon } from "./agent-icon";

interface Props {
  decision: AgentDecision;
  spec: AgentSpec | undefined;
  /** Where to link the row to (decision trace page). */
  traceHref: string;
  onApprove?: () => void;
  onReject?: () => void;
}

export function DecisionRow({ decision, spec, traceHref, onApprove, onReject }: Props) {
  const tint = spec ? TONE_TINT[spec.tone] : "bg-secondary text-muted-foreground";
  const outcomeTint = OUTCOME_TINT[decision.outcome];
  const outcomeLabel = OUTCOME_LABEL[decision.outcome];

  return (
    <li className="border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
      <div className="flex items-start gap-3 px-4 py-3">
        <div className={`size-7 rounded-md flex items-center justify-center shrink-0 ${tint}`}>
          <AgentIcon name={spec?.iconName ?? "Bot"} className="size-3.5" />
        </div>
        <Link href={traceHref} className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${outcomeTint}`}>
              {outcomeLabel}
            </span>
            <span className="text-[11px] text-foreground font-medium">{spec?.name ?? decision.agentId}</span>
            <span className="text-[11px] text-muted-foreground">·</span>
            <span className="text-[11px] text-muted-foreground">{decision.whenLabel}</span>
            <span className="text-[11px] text-muted-foreground">·</span>
            <span className="text-[11px] text-muted-foreground tabular-nums">{decision.confidence}% conf</span>
          </div>
          <p className="text-sm text-foreground leading-snug">{decision.summary}</p>
          {decision.recordLabel && (
            <p className="text-[10px] text-muted-foreground/70 mt-0.5">
              <code className="font-mono">{decision.recordLabel}</code>
            </p>
          )}
        </Link>

        {decision.outcome === "pending_review" && (onApprove || onReject) ? (
          <div className="flex items-center gap-1 shrink-0">
            {onApprove && (
              <button
                onClick={onApprove}
                className="size-7 rounded-md flex items-center justify-center bg-success/10 text-success hover:bg-success/20 transition-colors"
                aria-label="Approve"
              >
                <Check className="size-3.5" />
              </button>
            )}
            {onReject && (
              <button
                onClick={onReject}
                className="size-7 rounded-md flex items-center justify-center bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors"
                aria-label="Reject"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        ) : (
          <Link href={traceHref} className="shrink-0 self-center">
            <ChevronRight className="size-4 text-muted-foreground/40" />
          </Link>
        )}
      </div>
    </li>
  );
}
