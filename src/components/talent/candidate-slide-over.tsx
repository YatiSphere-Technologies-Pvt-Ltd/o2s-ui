"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ExternalLink,
  Sparkles,
  ChevronDown,
  Calendar,
  Star,
  Check,
  AlertTriangle,
  XCircle,
  Plus,
  MessageSquare,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type Candidate,
  avatarColorClass,
  scoreBarClass,
  scoreTextClass,
  nextStageLabel,
  STAGE_MAP,
} from "@/components/talent/data";

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */

type SlideOverProps = {
  candidate: Candidate | null;
  onClose: () => void;
};

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

/* Star component */
function Stars({ count, max = 3 }: { count: number; max?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`size-3 ${
            i < count
              ? "fill-warning text-warning"
              : "fill-none text-muted-foreground/40"
          }`}
        />
      ))}
    </span>
  );
}

function Stars5({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-3.5 ${
            i < count
              ? "fill-warning text-warning"
              : "fill-none text-muted-foreground/40"
          }`}
        />
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Overview                                                     */
/* ------------------------------------------------------------------ */

const scoreBreakdown = [
  { label: "Skills Match", value: 85 },
  { label: "Experience", value: 95 },
  { label: "Culture Fit", value: 88 },
  { label: "Growth Potential", value: 96 },
];

const quickFacts: [string, string][] = [
  ["Current Role", "Senior Frontend Dev @ Razorpay"],
  ["Experience", "6 years"],
  ["Education", "B.Tech CS, IIT Delhi"],
  ["Notice Period", "30 days"],
  ["Expected CTC", "\u20B935-40 LPA"],
  ["Source", "LinkedIn"],
  ["Applied", "March 18, 2026"],
];

const skills: { name: string; stars: number }[] = [
  { name: "React", stars: 3 },
  { name: "TypeScript", stars: 3 },
  { name: "Next.js", stars: 2 },
  { name: "System Design", stars: 2 },
  { name: "GraphQL", stars: 2 },
  { name: "Tailwind", stars: 3 },
  { name: "Testing", stars: 2 },
];

function OverviewTab({ aiScore }: { aiScore: number | null }) {
  const displayScore = aiScore ?? 92;

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* AI Match Score */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI Match Score
        </h3>
        <div className="flex items-end gap-2">
          <span
            className={`text-3xl font-bold tabular-nums ${scoreTextClass(displayScore)}`}
          >
            {displayScore}
          </span>
          <span className="text-lg text-muted-foreground mb-0.5">/100</span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${scoreBarClass(displayScore)}`}
            initial={{ width: 0 }}
            animate={{ width: `${displayScore}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <div className="space-y-2 mt-3">
          {scoreBreakdown.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">
                  {item.value}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${scoreBarClass(item.value)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Facts */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Quick Facts
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {quickFacts.map(([key, val]) => (
            <div key={key}>
              <p className="text-[11px] text-muted-foreground">{key}</p>
              <p className="text-sm text-foreground">{val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Skills */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Key Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {skills.map((s) => (
            <span
              key={s.name}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground"
            >
              {s.name}
              <Stars count={s.stars} />
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Skills matched: 6/7 required &middot; 3/4 preferred
        </p>
      </section>

      {/* AI Summary */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          AI Summary
        </h3>
        <div className="rounded-lg border-l-2 border-brand-purple bg-brand-purple/5 p-4 space-y-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-brand-purple" />
            <span className="text-xs font-semibold text-brand-purple">
              Recruiter Agent
            </span>
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            Strong frontend candidate with deep React/TypeScript expertise and
            proven scale experience at Razorpay (50M+ users). Portfolio
            demonstrates strong design sensibility. Key strength: has built
            component libraries used by 40+ engineers. Potential gap: limited
            backend/infra experience. Recommend advancing to technical interview
            with focus on system design.
          </p>
        </div>
      </section>

      {/* Notes */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Notes
        </h3>
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-background p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MessageSquare className="size-3" />
              <span className="font-medium text-foreground">Sarah Kim</span>
              <span>&middot;</span>
              <span>Mar 22</span>
            </div>
            <p className="text-sm text-foreground">
              Great initial call. Very articulate, passionate about DX. Wants to
              work on design systems. Definitely advance.
            </p>
          </div>
          <div className="rounded-lg border border-brand-purple/20 bg-brand-purple/5 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-brand-purple" />
              <span className="font-medium text-brand-purple">
                Recruiter Agent
              </span>
              <span>&middot;</span>
              <span>Mar 20</span>
            </div>
            <p className="text-sm text-foreground">
              Auto-screened. Resume matches 6/7 required skills. Flagged for
              fast-track based on Razorpay tenure and OSS contributions.
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Note
        </Button>
      </section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: AI Analysis                                                  */
/* ------------------------------------------------------------------ */

const matchItems: { icon: "check" | "warn" | "x"; text: string }[] = [
  { icon: "check", text: "6/7 required skills matched (React, TypeScript, Next.js, Tailwind, Testing, GraphQL)" },
  { icon: "check", text: "6 years experience exceeds 4-year minimum" },
  { icon: "check", text: "Built and shipped production design system at scale" },
  { icon: "check", text: "Open-source contributions to React ecosystem" },
  { icon: "warn", text: "System design experience is mid-level; may need coaching for staff-level scope" },
  { icon: "x", text: "No backend/infrastructure experience — gap for full-stack requirements" },
];

const interviewQuestions = [
  "Design a real-time collaborative component editor that supports 100+ concurrent users. Walk through your architecture choices.",
  "You need to migrate a 200-component legacy codebase to a new design system without breaking production. What\u2019s your strategy?",
  "Describe how you\u2019d instrument a frontend application to detect and debug performance regressions before users report them.",
];

const riskFactors = [
  "Currently at Razorpay — may receive counter-offer given seniority",
  "30-day notice period could delay start date if not managed proactively",
  "Limited backend experience may slow full-stack onboarding",
];

function AIAnalysisTab() {
  return (
    <motion.div
      key="ai-analysis"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 bg-brand-purple/2 -mx-5 px-5 -mt-4 pt-4 min-h-full"
    >
      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-brand-purple" />
          <h3 className="text-sm font-semibold text-foreground">
            Recruiter Agent Analysis
          </h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Generated Mar 20, 2026 &middot; Confidence:{" "}
          <span className="inline-flex items-center rounded-full bg-success/15 px-1.5 py-0.5 text-[10px] font-medium text-success">
            High
          </span>
        </p>
      </div>

      {/* Match Rationale */}
      <section className="space-y-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Match Rationale
        </h4>
        <ul className="space-y-2">
          {matchItems.map((item, i) => {
            const Icon =
              item.icon === "check"
                ? Check
                : item.icon === "warn"
                  ? AlertTriangle
                  : XCircle;
            const color =
              item.icon === "check"
                ? "text-success"
                : item.icon === "warn"
                  ? "text-warning"
                  : "text-destructive";
            return (
              <li key={i} className="flex items-start gap-2 text-sm">
                <Icon className={`size-4 shrink-0 mt-0.5 ${color}`} />
                <span className="text-foreground">{item.text}</span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* Comparable Candidates */}
      <section className="space-y-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Comparable Candidates
        </h4>
        <p className="text-sm text-foreground">
          Ranked{" "}
          <span className="font-bold text-brand-purple">#2</span> out of 47
          applicants for this role.
        </p>
      </section>

      {/* Interview Recommendations */}
      <section className="space-y-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Interview Recommendations
        </h4>
        <div className="space-y-2">
          {interviewQuestions.map((q, i) => (
            <div
              key={i}
              className="rounded-lg bg-secondary p-3 font-mono text-sm text-foreground leading-relaxed"
            >
              {q}
            </div>
          ))}
        </div>
      </section>

      {/* Risk Factors */}
      <section className="space-y-2.5">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Risk Factors
        </h4>
        <ul className="space-y-1.5">
          {riskFactors.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground">
              <span className="mt-1.5 size-2 shrink-0 rounded-full bg-warning" />
              {r}
            </li>
          ))}
        </ul>
      </section>

      {/* Recommended Next Step */}
      <section className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recommended Next Step
        </h4>
        <p className="text-sm font-medium text-foreground">
          Advance to Technical Interview within 48 hours
        </p>
        <button className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-brand-purple to-brand px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-opacity">
          <Calendar className="size-4" />
          Approve &amp; Schedule
        </button>
      </section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Timeline                                                     */
/* ------------------------------------------------------------------ */

const timelineEntries: {
  date: string;
  title: string;
  detail: string;
  color: "blue" | "purple" | "teal";
}[] = [
  {
    date: "Mar 25",
    title: "Interview Scheduled",
    detail: "Technical Interview with Alex Rivera — Mar 26, 2:00 PM IST",
    color: "blue",
  },
  {
    date: "Mar 22",
    title: "Phone Screen Completed",
    detail: "Conducted by Sarah Kim — Rating: \u2605\u2605\u2605\u2605\u2606",
    color: "blue",
  },
  {
    date: "Mar 20",
    title: "AI Screened",
    detail: "Recruiter Agent scored 92/100 — auto-flagged for fast track",
    color: "purple",
  },
  {
    date: "Mar 20",
    title: "Stage: Applied \u2192 Screened",
    detail: "Automatically moved after AI screening threshold met",
    color: "teal",
  },
  {
    date: "Mar 18",
    title: "Applied via LinkedIn",
    detail: "Resume and portfolio submitted — source matched to Senior Frontend role",
    color: "blue",
  },
];

const dotColorMap = {
  blue: "bg-brand",
  purple: "bg-brand-purple",
  teal: "bg-brand-teal",
};

const lineColorMap = {
  blue: "border-brand/30",
  purple: "border-brand-purple/30",
  teal: "border-brand-teal/30",
};

function TimelineTab() {
  return (
    <motion.div
      key="timeline"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-0"
    >
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Activity
      </h3>
      <div className="relative">
        {timelineEntries.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.25 }}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            {/* Line */}
            {i < timelineEntries.length - 1 && (
              <div
                className={`absolute left-[4.5px] top-3.5 h-[calc(100%-4px)] w-px border-l ${lineColorMap[entry.color]}`}
              />
            )}
            {/* Dot */}
            <div
              className={`relative z-10 mt-1 size-2.5 shrink-0 rounded-full ${dotColorMap[entry.color]}`}
            />
            {/* Content */}
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-bold text-foreground">{entry.date}</p>
              <p className="text-sm font-medium text-foreground">
                {entry.title}
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {entry.detail}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Scorecards                                                   */
/* ------------------------------------------------------------------ */

const scorecardCriteria: { label: string; rating: number }[] = [
  { label: "Technical Knowledge", rating: 4 },
  { label: "Communication", rating: 5 },
  { label: "Problem Solving", rating: 4 },
  { label: "Culture Fit", rating: 4 },
  { label: "Leadership Potential", rating: 3 },
];

function ScorecardsTab() {
  return (
    <motion.div
      key="scorecards"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Completed scorecard */}
      <div className="rounded-lg border border-border bg-background p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Sarah Kim</p>
            <p className="text-xs text-muted-foreground">
              Phone Screen &middot; Mar 22
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              Overall
            </span>
            <Stars5 count={4} />
          </div>
        </div>

        <div className="space-y-2.5">
          {scorecardCriteria.map((c) => (
            <div
              key={c.label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-muted-foreground">{c.label}</span>
              <Stars5 count={c.rating} />
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">
            Notes
          </p>
          <p className="text-sm text-foreground leading-relaxed">
            Excellent communicator with strong React fundamentals. Clearly
            articulated trade-offs in component design. Showed genuine passion
            for developer experience. Would be a strong addition to the design
            systems team. Slight gap in distributed systems knowledge but strong
            willingness to learn.
          </p>
        </div>
      </div>

      {/* Upcoming */}
      <div className="rounded-lg border border-dashed border-border bg-secondary/50 p-4 text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          No other scorecards yet.
        </p>
        <p className="text-sm text-foreground">
          Upcoming:{" "}
          <span className="font-medium">Technical Interview (Mar 26)</span>{" "}
          &mdash; Alex Rivera
        </p>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Send className="size-3.5" />
          Send Scorecard Reminder
        </Button>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                    */
/* ------------------------------------------------------------------ */

const tabs = ["Overview", "AI Analysis", "Timeline", "Scorecards"] as const;
type TabName = (typeof tabs)[number];

export function CandidateSlideOver({ candidate, onClose }: SlideOverProps) {
  const [activeTab, setActiveTab] = useState<TabName>("Overview");

  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  const email = candidate
    ? `${candidate.name.toLowerCase().replace(/\s+/g, '.')}@company.com`
    : "";

  return (
    <AnimatePresence>
      {candidate && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleOverlayClick}
          />

          {/* Panel */}
          <motion.div
            key="panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, duration: 0.3 }}
            className="fixed right-0 top-0 z-50 flex h-full w-[520px] max-w-full flex-col border-l border-border bg-card shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {/* ---- Header ---- */}
            <div className="shrink-0 border-b border-border px-5 pt-5 pb-4 space-y-4">
              {/* Identity */}
              <div className="flex items-start gap-3.5 pr-8">
                <div
                  className={`size-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0 ${avatarColorClass(candidate.name)}`}
                >
                  {candidate.initials}
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg font-bold text-foreground truncate">
                    {candidate.name}
                  </h2>
                  <p className="text-sm text-muted-foreground truncate">
                    {candidate.role} &middot; {candidate.location}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {email} &middot; +91 98765 43210
                  </p>
                </div>
              </div>

              {/* Links */}
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="xs" className="gap-1 text-xs">
                  LinkedIn
                  <ExternalLink className="size-3" />
                </Button>
                <Button variant="ghost" size="xs" className="gap-1 text-xs">
                  Portfolio
                  <ExternalLink className="size-3" />
                </Button>
                <Button variant="ghost" size="xs" className="gap-1 text-xs">
                  Resume
                  <ExternalLink className="size-3" />
                </Button>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  Move to Stage
                  <ChevronDown className="size-3.5" />
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Calendar className="size-3.5" />
                  Schedule Interview
                </Button>
              </div>
            </div>

            {/* ---- Tab Bar ---- */}
            <div className="shrink-0 border-b border-border px-5">
              <div className="flex gap-5 -mb-px">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative py-2.5 text-sm font-medium transition-colors ${
                      activeTab === tab
                        ? "text-brand"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="slide-over-tab-indicator"
                        className="absolute inset-x-0 -bottom-px h-0.5 bg-brand rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ---- Tab Content (scrollable) ---- */}
            <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
              <AnimatePresence mode="wait">
                {activeTab === "Overview" && (
                  <OverviewTab aiScore={candidate.aiScore} />
                )}
                {activeTab === "AI Analysis" && <AIAnalysisTab />}
                {activeTab === "Timeline" && <TimelineTab />}
                {activeTab === "Scorecards" && <ScorecardsTab />}
              </AnimatePresence>
            </div>

            {/* ---- Bottom Action Bar ---- */}
            <div className="shrink-0 border-t border-border px-5 py-3 flex items-center justify-between bg-card">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive"
                >
                  Reject
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground"
                >
                  Archive
                </Button>
              </div>
              <Button
                size="sm"
                className="bg-brand text-white hover:bg-brand/90"
              >
                {nextStageLabel(candidate.stage)}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
