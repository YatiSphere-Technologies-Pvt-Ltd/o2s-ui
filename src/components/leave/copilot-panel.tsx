"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Check,
  ChevronRight,
  Copy,
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from "lucide-react";
import {
  COVERAGE_CANDIDATES,
  type CoPilotRec,
  type CoPilotVerdict,
  type CoverageCandidate,
} from "@/components/leave/data";

const VERDICT_META: Record<
  CoPilotVerdict,
  { icon: React.ComponentType<{ className?: string }>; tint: string; color: string; ring: string; label: string }
> = {
  approve: { icon: ShieldCheck,  tint: "bg-success/10",      color: "text-success",     ring: "ring-success/30",     label: "Approve" },
  review:  { icon: ChevronRight, tint: "bg-warning/10",      color: "text-warning",     ring: "ring-warning/30",     label: "Discuss" },
  block:   { icon: ShieldAlert,  tint: "bg-destructive/10",  color: "text-destructive", ring: "ring-destructive/30", label: "Deny / negotiate" },
};

interface Props {
  rec: CoPilotRec;
  defaultDelegate?: CoverageCandidate | null;
  onCopyMessage: () => void;
  copied: boolean;
}

export function CoPilotPanel({ rec, defaultDelegate = null, onCopyMessage, copied }: Props) {
  const m = VERDICT_META[rec.verdict];
  const Icon = m.icon;
  const [delegate, setDelegate] = useState<CoverageCandidate | null>(
    defaultDelegate ?? COVERAGE_CANDIDATES[0] ?? null,
  );

  return (
    <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-linear-to-r from-brand/[0.05] to-brand-purple/[0.05]">
        <div className="flex items-center gap-2 mb-2">
          <div className="size-7 rounded-full bg-linear-to-r from-brand to-brand-purple flex items-center justify-center">
            <Sparkles className="size-3.5 text-white" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Approval Co-Pilot</h3>
          <span className="ml-auto text-[10px] text-muted-foreground/60">v1 · rule-based</span>
        </div>

        {/* Verdict + confidence */}
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ring-1 ${m.tint} ${m.color} ${m.ring} text-xs font-semibold`}
          >
            <Icon className="size-3.5" />
            Recommendation: {m.label}
          </span>
          <ConfidenceBar value={rec.confidence} verdict={rec.verdict} />
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">{rec.rationale}</p>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 scrollbar-thin">
        {/* Reasoning */}
        <Section title="Reasoning">
          <ul className="space-y-1.5">
            {rec.reasoning.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-foreground leading-snug">
                <span className={`size-1 rounded-full bg-current ${m.color} mt-1.5 shrink-0`} />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </Section>

        {/* Coverage proposal */}
        <Section title="Coverage proposal" icon={UserCheck}>
          <div className="space-y-1.5">
            {COVERAGE_CANDIDATES.slice(0, 3).map((c) => {
              const selected = delegate?.id === c.id;
              return (
                <button
                  key={c.id}
                  onClick={() => setDelegate(selected ? null : c)}
                  className={`w-full text-left p-2.5 rounded-lg border transition-colors ${
                    selected
                      ? "border-brand bg-brand/5"
                      : "border-border bg-surface-overlay/40 hover:bg-surface-overlay"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`size-7 rounded-full ${c.avatarColor} text-white text-[10px] font-bold flex items-center justify-center`}>
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground">{c.name}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2">{c.reason}</p>
                    </div>
                    <span
                      className={`size-3.5 rounded-full border-2 shrink-0 ${
                        selected ? "border-brand bg-brand" : "border-border"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </Section>

        {/* Suggested message */}
        <Section title="Suggested message to employee" icon={Lightbulb}>
          <div className="bg-surface-overlay/40 border border-border rounded-lg p-3">
            <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">{rec.suggestedMessage}</p>
            <div className="flex items-center justify-end mt-2">
              <button
                onClick={onCopyMessage}
                className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-[11px] text-muted-foreground hover:text-foreground transition-colors"
              >
                {copied ? <Check className="size-3 text-success" /> : <Copy className="size-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        </Section>

        {/* Coach note */}
        {rec.coachNote && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-start gap-2.5 p-3 rounded-lg bg-warning/5 border border-warning/30"
          >
            <Lightbulb className="size-3.5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-warning font-semibold mb-0.5">
                Manager Coach
              </p>
              <p className="text-xs text-foreground leading-snug">{rec.coachNote}</p>
            </div>
            <button className="ml-auto text-muted-foreground/60 hover:text-foreground" aria-label="Dismiss coach note">
              <X className="size-3" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function ConfidenceBar({ value, verdict }: { value: number; verdict: CoPilotVerdict }) {
  const color =
    verdict === "approve" ? "bg-success" : verdict === "review" ? "bg-warning" : "bg-destructive";
  return (
    <div className="flex-1 min-w-32">
      <div className="flex items-center justify-between text-[10px] mb-0.5">
        <span className="uppercase tracking-wider text-muted-foreground/70">Confidence</span>
        <span className="text-foreground tabular-nums">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full ${color} rounded-full`}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-2 text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">
        {Icon && <Icon className="size-3" />}
        {title}
      </div>
      {children}
    </div>
  );
}
