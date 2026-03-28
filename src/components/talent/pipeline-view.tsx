"use client";

import { useRef, useMemo } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  ChevronDown,
  Sparkles,
  CalendarPlus,
  ClipboardCheck,
  Users,
  FileText,
  Rocket,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type Candidate,
  type Stage,
  STAGES,
  STAGE_MAP,
  avatarColorClass,
  scoreTextClass,
  tagClasses,
} from "@/components/talent/data";

/* ── Types ── */

interface PipelineViewProps {
  candidates: Candidate[];
  onSelectCandidate: (c: Candidate) => void;
}

interface StageBucket {
  stage: Stage;
  candidates: Candidate[];
  avgDays: number;
  count: number;
}

/* ── Stage action config ── */

const STAGE_ACTIONS: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  applied: { label: "Screen All with AI", icon: Sparkles, className: "bg-brand-purple/10 text-brand-purple" },
  screened: { label: "Schedule Interviews", icon: CalendarPlus, className: "bg-brand/10 text-brand" },
  interview: { label: "View Scorecards", icon: ClipboardCheck, className: "bg-brand-purple/10 text-brand-purple" },
  final: { label: "Start Debrief", icon: Users, className: "bg-brand-teal/10 text-brand-teal" },
  offer: { label: "Generate Offer", icon: FileText, className: "bg-warning/10 text-warning" },
  hired: { label: "Begin Onboarding", icon: Rocket, className: "bg-success/10 text-success" },
};

const ROW_ACTIONS: Record<string, string> = {
  applied: "Screen",
  screened: "Interview",
  interview: "Scorecard",
  final: "Debrief",
  offer: "Offer",
  hired: "Onboard",
};

/* ── Helpers ── */

function conversionColor(rate: number): string {
  if (rate > 50) return "text-success";
  if (rate >= 30) return "text-warning";
  return "text-destructive";
}

function daysDisplay(days: number): { text: string; className: string } {
  const label = days === 1 ? "1 day" : `${days} days`;
  if (days > 5) return { text: `${label} \u{1F534}`, className: "text-destructive" };
  if (days >= 3) return { text: `${label} \u26A0`, className: "text-warning" };
  return { text: label, className: "text-foreground" };
}

function scoreDisplay(score: number | null): { text: string; className: string } {
  if (score === null) return { text: "\u2014", className: "text-muted-foreground" };
  const cls = scoreTextClass(score);
  return { text: String(score), className: cls };
}

/* ── Component ── */

export function PipelineView({ candidates, onSelectCandidate }: PipelineViewProps) {
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const buckets: StageBucket[] = useMemo(() => {
    return STAGES.map((stage) => {
      const stageCandidates = candidates
        .filter((c) => c.stage === stage.id)
        .sort((a, b) => b.daysInStage - a.daysInStage);
      const totalDays = stageCandidates.reduce((sum, c) => sum + c.daysInStage, 0);
      const avgDays = stageCandidates.length > 0 ? totalDays / stageCandidates.length : 0;
      return { stage, candidates: stageCandidates, avgDays, count: stageCandidates.length };
    });
  }, [candidates]);

  const maxCount = useMemo(() => Math.max(...buckets.map((b) => b.count), 1), [buckets]);

  /* Health score */
  const healthScore = useMemo(() => {
    let score = 100;
    for (const c of candidates) {
      if (c.daysInStage > 7) score -= 10;
      else if (c.daysInStage > 3) score -= 5;
    }
    return Math.max(0, Math.min(100, score));
  }, [candidates]);

  const bottleneck = useMemo(() => {
    let worst: StageBucket | null = null;
    for (const b of buckets) {
      if (b.count > 0 && (!worst || b.avgDays > worst.avgDays)) worst = b;
    }
    return worst;
  }, [buckets]);

  const healthColor =
    healthScore >= 70 ? "bg-success" : healthScore >= 40 ? "bg-warning" : "bg-destructive";

  const aiInsight = useMemo(() => {
    const warnings: string[] = [];
    for (const b of buckets) {
      const stale = b.candidates.filter((c) => c.daysInStage > 5);
      if (stale.length > 0) {
        warnings.push(
          `${stale.length} candidate${stale.length > 1 ? "s" : ""} waiting >5 days in ${b.stage.name}`
        );
      }
    }
    if (warnings.length === 0) return "Pipeline is healthy — no immediate action needed.";
    return warnings.join("; ") + " — recommend prioritizing these candidates.";
  }, [buckets]);

  const scrollToStage = (stageId: string) => {
    const el = sectionRefs.current[stageId];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      {/* ── Section 1: Pipeline Funnel Summary ── */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {buckets.map((bucket, i) => {
          const prevCount = i > 0 ? buckets[i - 1].count : 0;
          const conversionRate = i === 0 ? 100 : prevCount > 0 ? Math.round((bucket.count / prevCount) * 100) : 0;
          const dropOff = i === 0 ? null : prevCount > 0 ? conversionRate - 100 : 0;
          const barWidth = maxCount > 0 ? (bucket.count / maxCount) * 100 : 0;

          return (
            <div key={bucket.stage.id} className="flex items-center gap-1">
              {i > 0 && (
                <ChevronRight className="size-4 text-muted-foreground/30 shrink-0" />
              )}
              <button
                onClick={() => scrollToStage(bucket.stage.id)}
                className="bg-card border border-border rounded-xl p-4 flex-1 min-w-[140px] text-left hover:border-foreground/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`size-2.5 rounded-full ${bucket.stage.colorClass}`} />
                  <span className="text-sm font-semibold text-foreground">{bucket.stage.name}</span>
                </div>
                <div className="text-2xl font-bold text-foreground">{bucket.count}</div>
                <div className="flex items-center gap-2 mt-1">
                  {i > 0 && (
                    <>
                      <span className={`text-xs ${conversionColor(conversionRate)}`}>
                        {conversionRate}%
                      </span>
                      {dropOff !== null && dropOff !== 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({dropOff > 0 ? "+" : ""}{dropOff}%)
                        </span>
                      )}
                    </>
                  )}
                </div>
                {/* Proportional bar */}
                <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${bucket.stage.colorClass}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${barWidth}%` }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.4, 0, 0.2, 1] as const }}
                  />
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {/* ── Section 2: Stage-by-Stage Queue ── */}
      <div className="space-y-4">
        {buckets.map((bucket, sIdx) => {
          const action = STAGE_ACTIONS[bucket.stage.id];
          const rowAction = ROW_ACTIONS[bucket.stage.id];
          const ActionIcon = action?.icon;

          return (
            <div key={bucket.stage.id}>
              <div
                ref={(el) => { sectionRefs.current[bucket.stage.id] = el; }}
              >
                {/* Section header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`size-2.5 rounded-full ${bucket.stage.colorClass}`} />
                    <span className="font-semibold text-foreground">{bucket.stage.name}</span>
                    <span className="text-muted-foreground text-sm">({bucket.count} candidate{bucket.count !== 1 ? "s" : ""})</span>
                    {bucket.count > 0 && (
                      <span className="text-xs text-muted-foreground ml-2">
                        avg {bucket.avgDays.toFixed(1)} days
                      </span>
                    )}
                  </div>
                  {action && ActionIcon && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`rounded-full gap-1.5 text-xs ${action.className}`}
                    >
                      <ActionIcon className="size-3.5" />
                      {action.label}
                    </Button>
                  )}
                </div>

                {/* Queue table */}
                <div className="bg-card border border-border rounded-xl overflow-hidden flex">
                  {/* Left color stripe */}
                  <div className={`w-1 shrink-0 ${bucket.stage.colorClass}`} />

                  <div className="flex-1 min-w-0">
                    {bucket.candidates.length === 0 ? (
                      <div className="text-muted-foreground/60 text-xs py-3 text-center">
                        No candidates in this stage
                      </div>
                    ) : (
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-border text-xs text-muted-foreground">
                            <th className="py-2 px-3 w-10 font-medium">#</th>
                            <th className="py-2 px-3 font-medium">Candidate</th>
                            <th className="py-2 px-3 font-medium">Source</th>
                            <th className="py-2 px-3 font-medium">Days in Stage</th>
                            <th className="py-2 px-3 font-medium">AI Score</th>
                            <th className="py-2 px-3 font-medium">Tags</th>
                            <th className="py-2 px-3 font-medium text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bucket.candidates.map((candidate, idx) => {
                            const days = daysDisplay(candidate.daysInStage);
                            const score = scoreDisplay(candidate.aiScore);
                            const avatarBg = avatarColorClass(candidate.name);

                            return (
                              <tr
                                key={candidate.id}
                                onClick={() => onSelectCandidate(candidate)}
                                className="border-b border-border last:border-b-0 hover:bg-surface-overlay cursor-pointer transition-colors"
                              >
                                <td className="py-2.5 px-3 text-xs text-muted-foreground">{idx + 1}</td>
                                <td className="py-2.5 px-3">
                                  <div className="flex items-center gap-2.5">
                                    <div
                                      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${avatarBg}`}
                                    >
                                      {candidate.initials}
                                    </div>
                                    <div>
                                      <div className="text-sm font-medium text-foreground">{candidate.name}</div>
                                      <div className="text-xs text-muted-foreground">{candidate.role}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="py-2.5 px-3 text-xs text-muted-foreground">
                                  {candidate.aiSourced ? (
                                    <span>AI <span className="inline-block">&#x2728;</span></span>
                                  ) : (
                                    candidate.source
                                  )}
                                </td>
                                <td className={`py-2.5 px-3 text-xs ${days.className}`}>{days.text}</td>
                                <td className={`py-2.5 px-3 text-sm font-semibold ${score.className}`}>
                                  {score.text}
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="flex gap-1">
                                    {candidate.tags.slice(0, 2).map((tag) => (
                                      <span
                                        key={tag}
                                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${tagClasses(tag)}`}
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                                <td className="py-2.5 px-3">
                                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs text-brand">
                                      {rowAction}
                                    </Button>
                                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground">
                                      <ArrowRight className="size-3.5" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </div>

              {/* Connector arrow between sections */}
              {sIdx < buckets.length - 1 && (
                <div className="flex justify-center py-1">
                  <ChevronDown className="size-5 text-muted-foreground/20" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Section 3: Pipeline Health Strip ── */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-6 flex-wrap">
          {/* Health score */}
          <div className="flex items-center gap-3 min-w-[200px]">
            <span className="text-sm font-semibold text-foreground">Pipeline Health</span>
            <div className="flex items-center gap-2 flex-1">
              <div className="w-24 h-1.5 rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${healthColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${healthScore}%` }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as const }}
                />
              </div>
              <span className="text-sm font-bold text-foreground">{healthScore}/100</span>
            </div>
          </div>

          {/* Separator */}
          <span className="text-muted-foreground/30">|</span>

          {/* Bottleneck */}
          {bottleneck && bottleneck.count > 0 && (
            <div className="text-xs text-muted-foreground">
              Bottleneck:{" "}
              <span className="font-medium text-foreground">
                {bottleneck.stage.name}
              </span>{" "}
              ({bottleneck.avgDays.toFixed(1)} day avg)
            </div>
          )}

          {/* Separator */}
          <span className="text-muted-foreground/30">|</span>

          {/* AI Insight */}
          <div className="flex items-center gap-1.5 text-xs text-brand-purple flex-1 min-w-0">
            <Sparkles className="size-3.5 shrink-0" />
            <span className="truncate">{aiInsight}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
