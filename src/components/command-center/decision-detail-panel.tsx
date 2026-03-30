"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  RotateCcw,
  ArrowUpRight,
  Sparkles,
  FileText,
  User,
  Building2,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIRecommendation } from "./ai-recommendation";
import { PanelAlignment } from "./panel-alignment";
import { RiskIndicator } from "./risk-indicator";
import { ConfidenceBadge } from "./confidence-badge";
import {
  type Decision,
  urgencyColor,
  urgencyBgColor,
  urgencyLabel,
  fitScoreColor,
  fitScoreBgColor,
  decisionTypeLabel,
} from "./data";

interface DecisionDetailPanelProps {
  decision: Decision | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onDefer: (id: string) => void;
  aiReasoningExpanded: boolean;
  onToggleAIReasoning: () => void;
}

export function DecisionDetailPanel({
  decision,
  onApprove,
  onReject,
  onDefer,
  aiReasoningExpanded,
  onToggleAIReasoning,
}: DecisionDetailPanelProps) {
  const [simulateOpen, setSimulateOpen] = useState(false);

  if (!decision) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-xl border border-border bg-card/50">
        <div className="size-16 rounded-2xl bg-secondary/50 flex items-center justify-center mb-4">
          <FileText className="size-7 text-muted-foreground/30" />
        </div>
        <p className="text-sm text-muted-foreground/50 font-medium">
          Select a decision from the queue
        </p>
        <p className="text-[11px] text-muted-foreground/30 mt-1">
          Use <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">J</kbd> /{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">K</kbd> to navigate
        </p>
      </div>
    );
  }

  const insight = decision.candidateInsight;

  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-card/50 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={decision.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex flex-col h-full"
        >
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
            {/* ── Header ── */}
            <div className="space-y-3">
              {/* Type + Urgency badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider bg-secondary/50 px-2 py-1 rounded">
                  {decisionTypeLabel(decision.type)}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${urgencyColor(decision.urgency)} ${urgencyBgColor(decision.urgency)}`}
                >
                  {urgencyLabel(decision.urgency)}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-foreground leading-tight">
                {decision.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {decision.subtitle}
              </p>

              {/* Candidate info row */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-secondary/30 border border-border/50">
                <div className="size-10 rounded-full bg-brand-purple/10 flex items-center justify-center text-sm font-bold text-brand-purple shrink-0">
                  {decision.candidateInitials}
                </div>
                <div className="flex-1 min-w-0 grid grid-cols-2 gap-x-4 gap-y-1">
                  <div className="flex items-center gap-1.5">
                    <User className="size-3 text-muted-foreground/40" />
                    <span className="text-xs text-foreground font-medium truncate">
                      {decision.candidateName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="size-3 text-muted-foreground/40" />
                    <span className="text-xs text-muted-foreground truncate">
                      {decision.candidateRole}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Building2 className="size-3 text-muted-foreground/40" />
                    <span className="text-xs text-muted-foreground truncate">
                      {decision.candidateCompany}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="size-3 text-muted-foreground/40" />
                    <span className="text-xs text-muted-foreground truncate">
                      {decision.requisition}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ── AI Recommendation ── */}
            <AIRecommendation
              recommendation={decision.recommendation}
              confidence={decision.confidence}
              reasoning={decision.aiReasoning}
              expanded={aiReasoningExpanded}
              onToggle={onToggleAIReasoning}
            />

            {/* ── Candidate Insight ── */}
            <div className="rounded-xl border border-border bg-card p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">
                  Candidate Insight
                </h3>
                <div className="flex items-center gap-3">
                  <RiskIndicator risks={insight.risks} />
                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${fitScoreBgColor(insight.fitScore)}`}
                  >
                    <span
                      className={`text-lg font-bold ${fitScoreColor(insight.fitScore)}`}
                    >
                      {insight.fitScore}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      fit score
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <p className="text-[13px] text-muted-foreground leading-relaxed">
                {insight.summary}
              </p>

              {/* Strengths & Risks */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-semibold text-success uppercase tracking-wider">
                    Strengths
                  </h4>
                  {insight.strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="size-1.5 rounded-full bg-success mt-1.5 shrink-0" />
                      <span className="text-xs text-muted-foreground leading-snug">
                        {s}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Risks */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-semibold text-destructive uppercase tracking-wider">
                    Risks
                  </h4>
                  {insight.risks.length > 0 ? (
                    insight.risks.map((r, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-destructive mt-1.5 shrink-0" />
                        <span className="text-xs text-muted-foreground leading-snug">
                          {r}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground/40 italic">
                      No risks identified
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── Panel Alignment ── */}
            <PanelAlignment
              votes={decision.interviewerVotes}
              alignment={decision.panelAlignment}
            />

            {/* ── Simulate Outcome ── */}
            <button
              onClick={() => setSimulateOpen(!simulateOpen)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors cursor-pointer"
            >
              <Sparkles className="size-3.5" />
              Simulate outcome
            </button>
            <AnimatePresence>
              {simulateOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-xl border border-brand-purple/20 bg-brand-purple/[0.03] space-y-2">
                    <p className="text-xs font-semibold text-brand-purple">
                      Projected Impact
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="text-center">
                        <div className="text-sm font-bold text-foreground">-2 days</div>
                        <div className="text-[10px] text-muted-foreground">Time to hire</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-foreground">+8%</div>
                        <div className="text-[10px] text-muted-foreground">Funnel velocity</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-bold text-foreground">96%</div>
                        <div className="text-[10px] text-muted-foreground">SLA maintained</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Sticky Action Bar ── */}
          <div className="shrink-0 border-t border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Button
                onClick={() => onApprove(decision.id)}
                className="flex-1 h-10 bg-success hover:bg-success/90 text-white font-semibold text-sm rounded-lg gap-2 cursor-pointer"
              >
                <Check className="size-4" />
                Approve
                <kbd className="ml-1 px-1.5 py-0.5 rounded bg-white/15 text-[9px] font-mono">
                  A
                </kbd>
              </Button>
              <Button
                onClick={() => onReject(decision.id)}
                variant="outline"
                className="flex-1 h-10 border-destructive/30 text-destructive hover:bg-destructive/10 font-semibold text-sm rounded-lg gap-2 cursor-pointer"
              >
                <X className="size-4" />
                Reject
                <kbd className="ml-1 px-1.5 py-0.5 rounded bg-destructive/10 text-[9px] font-mono">
                  R
                </kbd>
              </Button>
              <Button
                onClick={() => onDefer(decision.id)}
                variant="outline"
                className="flex-1 h-10 font-semibold text-sm rounded-lg gap-2 cursor-pointer"
              >
                <RotateCcw className="size-4" />
                Defer
                <kbd className="ml-1 px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono">
                  D
                </kbd>
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
