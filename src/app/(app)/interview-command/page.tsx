"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Users, ChevronDown } from "lucide-react";
import { FlowGraph } from "@/components/interview-command/flow-graph";
import { PanelView } from "@/components/interview-command/panel-view";
import { SchedulingView } from "@/components/interview-command/scheduling-view";
import { AlignmentView } from "@/components/interview-command/alignment-view";
import {
  INTERVIEW_PLANS,
  PANEL_ALIGNMENTS,
  type InterviewPlan,
  scoreColor,
} from "@/components/interview-command/data";

const tabTransition = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
};

export default function InterviewCommandPage() {
  const [selectedPlanId, setSelectedPlanId] = useState(INTERVIEW_PLANS[0].id);
  const [selectedRoundId, setSelectedRoundId] = useState<string | null>(INTERVIEW_PLANS[0].rounds[0]?.id ?? null);
  const [rightPanel, setRightPanel] = useState<"panel" | "schedule" | "alignment">("panel");

  const plan = useMemo(
    () => INTERVIEW_PLANS.find((p) => p.id === selectedPlanId) ?? INTERVIEW_PLANS[0],
    [selectedPlanId]
  );

  const selectedRound = useMemo(
    () => plan.rounds.find((r) => r.id === selectedRoundId) ?? null,
    [plan, selectedRoundId]
  );

  const alignment = PANEL_ALIGNMENTS[plan.id];
  const hasAlignment = !!alignment;

  const handleSelectPlan = (id: string) => {
    setSelectedPlanId(id);
    const newPlan = INTERVIEW_PLANS.find((p) => p.id === id);
    if (newPlan) {
      setSelectedRoundId(newPlan.rounds[0]?.id ?? null);
      setRightPanel(PANEL_ALIGNMENTS[id] ? "alignment" : "panel");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-gradient-to-br from-brand-purple to-brand flex items-center justify-center">
            <Users className="size-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Interview Command</h1>
            <p className="text-sm text-muted-foreground">
              Multi-agent panel intelligence and decision system
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{INTERVIEW_PLANS.length} active plans</span>
          <span className="text-muted-foreground/20">·</span>
          <span>{INTERVIEW_PLANS.filter((p) => p.overallStatus === "decision_pending").length} pending decisions</span>
        </div>
      </div>

      {/* Candidate selector */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-1">
        {INTERVIEW_PLANS.map((p) => {
          const isActive = selectedPlanId === p.id;
          const completedRounds = p.rounds.filter((r) => r.status === "completed").length;
          return (
            <button
              key={p.id}
              onClick={() => handleSelectPlan(p.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all duration-150 cursor-pointer whitespace-nowrap shrink-0 ${
                isActive
                  ? "border-brand bg-brand/[0.04] ring-1 ring-brand"
                  : "border-border hover:bg-secondary/20"
              }`}
            >
              <div className="size-7 rounded-full bg-brand-purple/10 flex items-center justify-center text-[10px] font-bold text-brand-purple">
                {p.candidateInitials}
              </div>
              <div className="text-left">
                <span className="text-sm font-semibold text-foreground block">{p.candidateName}</span>
                <span className="text-[10px] text-muted-foreground">{p.candidateRole} · {completedRounds}/{p.rounds.length} rounds</span>
              </div>
              <span className={`text-sm font-bold ml-2 ${scoreColor(p.fitScore)}`}>{p.fitScore}</span>
            </button>
          );
        })}
      </div>

      {/* Main layout: Flow Graph on top, 2-column below */}
      <div className="space-y-4">
        {/* Flow Graph (full width) */}
        <FlowGraph
          plan={plan}
          selectedRoundId={selectedRoundId}
          onSelectRound={(id) => {
            setSelectedRoundId(id);
            setRightPanel("panel");
          }}
        />

        {/* Detail panels: Panel/Schedule on left, Alignment on right */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {/* Left: Panel + Schedule */}
          <div className="space-y-4">
            {/* Tab toggle */}
            <div className="flex items-center gap-1 bg-secondary/30 rounded-lg p-0.5 w-fit">
              {([
                { key: "panel" as const, label: "Panel" },
                { key: "schedule" as const, label: "Schedule" },
                ...(hasAlignment ? [{ key: "alignment" as const, label: "Alignment" }] : []),
              ]).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setRightPanel(tab.key)}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    rightPanel === tab.key
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground/50 hover:text-muted-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={rightPanel + selectedRoundId} {...tabTransition}>
                {rightPanel === "panel" && selectedRound && (
                  <PanelView round={selectedRound} />
                )}
                {rightPanel === "schedule" && selectedRound && (
                  <SchedulingView
                    round={selectedRound}
                    onSchedule={() => {}}
                  />
                )}
                {rightPanel === "alignment" && alignment && (
                  <AlignmentView
                    alignment={alignment}
                    candidateName={plan.candidateName}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Round detail / feedback */}
          <div className="space-y-4">
            {selectedRound && (
              <div className="rounded-xl border border-border bg-card/50 p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">
                  Round {selectedRound.roundNumber} Details
                </h3>

                {/* Score */}
                {selectedRound.score !== null && (
                  <div className="flex items-center gap-3">
                    <div className={`text-3xl font-bold ${scoreColor(selectedRound.score)}`}>
                      {selectedRound.score}
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Round Score</span>
                      <span className="text-[10px] text-muted-foreground/50">out of 100</span>
                    </div>
                  </div>
                )}

                {/* Feedback */}
                {selectedRound.feedback && (
                  <div>
                    <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider block mb-1.5">
                      Feedback Summary
                    </span>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                      {selectedRound.feedback}
                    </p>
                  </div>
                )}

                {/* Schedule info */}
                {selectedRound.scheduledAt && (
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{selectedRound.scheduledAt}</span>
                    <span className="text-muted-foreground/20">·</span>
                    <span>{selectedRound.duration} min</span>
                  </div>
                )}

                {!selectedRound.score && !selectedRound.feedback && (
                  <p className="text-xs text-muted-foreground/40 italic">
                    Interview not yet completed — no feedback available
                  </p>
                )}
              </div>
            )}

            {/* Quick AI Insight */}
            {plan.aiPanelConfidence > 0 && (
              <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="h-0.5 bg-gradient-to-r from-brand-purple via-brand to-brand-teal" />
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="size-4 text-brand-purple" />
                    <span className="text-sm font-semibold text-foreground">AI Panel Confidence</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className={`text-2xl font-bold ${scoreColor(plan.aiPanelConfidence)}`}>
                      {plan.aiPanelConfidence}%
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-snug flex-1">
                      {plan.aiPanelConfidence >= 85
                        ? "Panel is well-assembled with strong expertise coverage and low bias risk."
                        : plan.aiPanelConfidence >= 70
                          ? "Panel has adequate coverage but some gaps identified. Review AI suggestions."
                          : "Panel has significant gaps or conflict risks. Reconfiguration recommended."}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
