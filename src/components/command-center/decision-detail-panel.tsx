"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Check,
  X,
  RotateCcw,
  Sparkles,
  FileText,
  User,
  Building2,
  Briefcase,
  Brain,
  Users,
  BarChart3,
  Clock,
  AlertCircle,
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

type DetailTab = "summary" | "ai" | "panel";

export function DecisionDetailPanel({
  decision,
  onApprove,
  onReject,
  onDefer,
  aiReasoningExpanded,
  onToggleAIReasoning,
}: DecisionDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<DetailTab>("summary");
  const [simulateOpen, setSimulateOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  const showFeedback = (action: string) => {
    setActionFeedback(action);
    setTimeout(() => setActionFeedback(null), 1500);
  };

  if (!decision) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-xl border border-border bg-card/50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="size-20 rounded-2xl bg-linear-to-br from-brand-purple/10 to-brand-teal/10 flex items-center justify-center mx-auto mb-5">
            <Brain className="size-9 text-brand-purple/30" />
          </div>
          <p className="text-base font-semibold text-muted-foreground/40">
            Select a decision to review
          </p>
          <p className="text-xs text-muted-foreground/25 mt-2 max-w-xs mx-auto">
            Use <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">J</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[10px] font-mono">K</kbd> to navigate the queue, or click any decision card
          </p>
        </motion.div>
      </div>
    );
  }

  const insight = decision.candidateInsight;
  const isUrgentDeadline = decision.deadline && (decision.deadline.includes("hour") || decision.deadline === "Today");
  const hasPanel = decision.interviewerVotes.length > 0;

  const TABS: { key: DetailTab; label: string; icon: typeof Brain }[] = [
    { key: "summary", label: "Summary", icon: FileText },
    { key: "ai", label: "AI Analysis", icon: Brain },
    ...(hasPanel ? [{ key: "panel" as DetailTab, label: "Panel", icon: Users }] : []),
  ];

  return (
    <div className="flex flex-col h-full rounded-xl border border-border bg-card/50 overflow-hidden">
      {/* Action feedback overlay */}
      <AnimatePresence>
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-card/90 backdrop-blur-sm rounded-xl"
          >
            <div className="text-center">
              <div className={`size-16 rounded-2xl mx-auto mb-3 flex items-center justify-center ${
                actionFeedback === "approved" ? "bg-success/10" : actionFeedback === "rejected" ? "bg-destructive/10" : "bg-warning/10"
              }`}>
                {actionFeedback === "approved" ? <Check className="size-8 text-success" /> :
                 actionFeedback === "rejected" ? <X className="size-8 text-destructive" /> :
                 <RotateCcw className="size-8 text-warning" />}
              </div>
              <p className="text-sm font-semibold text-foreground capitalize">{actionFeedback}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={decision.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="flex flex-col h-full relative"
        >
          {/* ── Header (sticky) ── */}
          <div className="shrink-0 border-b border-border p-4 space-y-3">
            {/* Title row */}
            <div className="flex items-start gap-3">
              <div className="size-11 rounded-xl bg-brand-purple/10 flex items-center justify-center text-sm font-bold text-brand-purple shrink-0">
                {decision.candidateInitials}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-bold text-foreground leading-tight line-clamp-2">
                  {decision.title}
                </h2>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className={`text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${urgencyBgColor(decision.urgency)} ${urgencyColor(decision.urgency)}`}>
                    {urgencyLabel(decision.urgency)}
                  </span>
                  <span className="text-[10px] text-muted-foreground/50">{decisionTypeLabel(decision.type)}</span>
                  {decision.deadline && (
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full ${isUrgentDeadline ? "bg-destructive/10 text-destructive" : "bg-secondary text-muted-foreground"}`}>
                      {isUrgentDeadline && <AlertCircle className="size-3 animate-pulse" />}
                      Due: {decision.deadline}
                    </span>
                  )}
                </div>
              </div>
              <ConfidenceBadge score={decision.confidence} size="md" />
            </div>

            {/* Candidate info compact row */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><User className="size-3 text-muted-foreground/40" />{decision.candidateName}</span>
              <span className="flex items-center gap-1"><Briefcase className="size-3 text-muted-foreground/40" />{decision.candidateRole}</span>
              <span className="flex items-center gap-1"><Building2 className="size-3 text-muted-foreground/40" />{decision.candidateCompany}</span>
              <span className="text-muted-foreground/30 font-mono">{decision.requisition}</span>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-1 -mb-3 pt-1">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg text-xs font-medium transition-all cursor-pointer border-b-2 ${
                      isActive
                        ? "text-foreground border-brand bg-card"
                        : "text-muted-foreground/50 border-transparent hover:text-muted-foreground"
                    }`}
                  >
                    <TabIcon className="size-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Tab Content ── */}
          <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
            <AnimatePresence mode="wait">
              {activeTab === "summary" && (
                <motion.div key="summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
                  {/* Fit score + AI recommendation compact */}
                  <div className="flex items-stretch gap-3">
                    {/* Fit score card */}
                    <div className={`flex-1 rounded-xl border border-border p-4 flex items-center gap-4 ${fitScoreBgColor(insight.fitScore)}`}>
                      <span className={`text-3xl font-bold ${fitScoreColor(insight.fitScore)}`}>{insight.fitScore}</span>
                      <div>
                        <span className="text-xs font-semibold text-foreground block">Fit Score</span>
                        <RiskIndicator risks={insight.risks} />
                      </div>
                    </div>

                    {/* Quick AI recommendation */}
                    <div className={`flex-1 rounded-xl border p-4 flex items-center gap-3 ${
                      decision.recommendation === "approve" ? "border-success/20 bg-success/[0.03]" :
                      decision.recommendation === "reject" ? "border-destructive/20 bg-destructive/[0.03]" :
                      "border-warning/20 bg-warning/[0.03]"
                    }`}>
                      <div className={`size-10 rounded-lg flex items-center justify-center ${
                        decision.recommendation === "approve" ? "bg-success/10" :
                        decision.recommendation === "reject" ? "bg-destructive/10" : "bg-warning/10"
                      }`}>
                        <Sparkles className={`size-5 ${
                          decision.recommendation === "approve" ? "text-success" :
                          decision.recommendation === "reject" ? "text-destructive" : "text-warning"
                        }`} />
                      </div>
                      <div>
                        <span className={`text-sm font-bold capitalize ${
                          decision.recommendation === "approve" ? "text-success" :
                          decision.recommendation === "reject" ? "text-destructive" : "text-warning"
                        }`}>{decision.recommendation}</span>
                        <span className="text-[10px] text-muted-foreground block">{decision.confidence}% confidence</span>
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{insight.summary}</p>
                  </div>

                  {/* Strengths & Risks side by side */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="rounded-xl border border-success/10 bg-success/[0.02] p-4 space-y-2.5">
                      <h4 className="text-[10px] font-semibold text-success uppercase tracking-wider">Strengths</h4>
                      {insight.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="size-3 text-success shrink-0 mt-0.5" />
                          <span className="text-xs text-foreground/80 leading-snug">{s}</span>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl border border-destructive/10 bg-destructive/[0.02] p-4 space-y-2.5">
                      <h4 className="text-[10px] font-semibold text-destructive uppercase tracking-wider">Risks</h4>
                      {insight.risks.length > 0 ? insight.risks.map((r, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <AlertCircle className="size-3 text-destructive shrink-0 mt-0.5" />
                          <span className="text-xs text-foreground/80 leading-snug">{r}</span>
                        </div>
                      )) : (
                        <p className="text-xs text-muted-foreground/40 italic">No risks identified</p>
                      )}
                    </div>
                  </div>

                  {/* Simulate */}
                  <button
                    onClick={() => setSimulateOpen(!simulateOpen)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-brand-purple/15 text-xs text-brand-purple/60 hover:text-brand-purple hover:bg-brand-purple/[0.03] transition-colors cursor-pointer"
                  >
                    <BarChart3 className="size-3.5" />
                    {simulateOpen ? "Hide projected impact" : "Simulate outcome"}
                  </button>
                  <AnimatePresence>
                    {simulateOpen && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="p-4 rounded-xl border border-brand-purple/15 bg-brand-purple/[0.03] grid grid-cols-3 gap-4">
                          {[
                            { label: "Time to hire", value: "-2 days", color: "text-success" },
                            { label: "Funnel velocity", value: "+8%", color: "text-brand-teal" },
                            { label: "SLA maintained", value: "96%", color: "text-brand" },
                          ].map((s) => (
                            <div key={s.label} className="text-center">
                              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
                              <div className="text-[10px] text-muted-foreground">{s.label}</div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {activeTab === "ai" && (
                <motion.div key="ai" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <AIRecommendation
                    recommendation={decision.recommendation}
                    confidence={decision.confidence}
                    reasoning={decision.aiReasoning}
                    expanded={aiReasoningExpanded}
                    onToggle={onToggleAIReasoning}
                  />
                </motion.div>
              )}

              {activeTab === "panel" && (
                <motion.div key="panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <PanelAlignment
                    votes={decision.interviewerVotes}
                    alignment={decision.panelAlignment}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Elevated Action Bar ── */}
          <div className="shrink-0 p-4 bg-linear-to-t from-card via-card to-card/80 border-t border-border">
            <div className="flex items-center gap-2.5">
              <Button
                onClick={() => { onApprove(decision.id); showFeedback("approved"); }}
                className="flex-1 h-11 bg-success hover:bg-success/90 text-white font-semibold text-sm rounded-xl gap-2 cursor-pointer shadow-[0_4px_12px_rgba(16,185,129,0.2)]"
              >
                <Check className="size-4" />
                Approve
                <kbd className="ml-auto px-1.5 py-0.5 rounded bg-white/20 text-[9px] font-mono">A</kbd>
              </Button>
              <Button
                onClick={() => { onReject(decision.id); showFeedback("rejected"); }}
                variant="outline"
                className="flex-1 h-11 border-destructive/25 text-destructive hover:bg-destructive/8 font-semibold text-sm rounded-xl gap-2 cursor-pointer"
              >
                <X className="size-4" />
                Reject
                <kbd className="ml-auto px-1.5 py-0.5 rounded bg-destructive/10 text-[9px] font-mono">R</kbd>
              </Button>
              <Button
                onClick={() => { onDefer(decision.id); showFeedback("deferred"); }}
                variant="outline"
                className="h-11 px-4 font-semibold text-sm rounded-xl gap-2 cursor-pointer"
              >
                <RotateCcw className="size-4" />
                <kbd className="px-1.5 py-0.5 rounded bg-secondary text-[9px] font-mono">D</kbd>
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
