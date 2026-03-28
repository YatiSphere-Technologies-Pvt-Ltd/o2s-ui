"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Pause,
  Play,
  Share2,
  ArrowRight,
  Edit3,
  Check,
  AlertTriangle,
  XCircle,
  GripVertical,
  TrendingUp,
  Shield,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type Job,
  STATUS_CONFIG,
  PRIORITY_CONFIG,
  DEPT_COLORS,
  PIPELINE_STAGES,
  healthColor,
  healthBarColor,
  healthLabel,
  daysOpenColor,
  formatComp,
  avatarColorClass,
} from "@/components/jobs/data";

/* ================================================================== */
/*  Types                                                              */
/* ================================================================== */

type SlideOverProps = {
  job: Job | null;
  onClose: () => void;
};

/* ================================================================== */
/*  Tab: Overview                                                      */
/* ================================================================== */

const HIRING_TEAM = [
  { name: "Sarah Kim", role: "Lead Recruiter" },
  { name: "Rajesh Kumar", role: "Hiring Manager" },
  { name: "Alex Rivera", role: "Technical Interviewer" },
  { name: "Priya Sharma", role: "Panel Member" },
];

const RECENT_ACTIVITY = [
  { date: "Mar 25", text: "3 new applications received via LinkedIn" },
  { date: "Mar 24", text: "Candidate Arjun Mehta advanced to Final Round" },
  { date: "Mar 23", text: "AI screening completed for 8 candidates" },
  { date: "Mar 22", text: "Interview scheduled with Priya Nair (Mar 26)" },
  { date: "Mar 21", text: "Job description updated — SEO score improved to 82" },
];

function OverviewTab({ job }: { job: Job }) {
  const quickFacts: [string, string][] = [
    ["Req ID", job.reqId],
    ["Department", job.department],
    ["Team", job.team],
    ["Level", job.level],
    ["Location", job.location],
    ["Work Model", job.workModel],
    ["Employment Type", job.employmentType],
    [
      "Compensation",
      `₹${formatComp(job.compensation.min)} – ₹${formatComp(job.compensation.max)}${job.compensation.equity ? " + Equity" : ""}`,
    ],
    ["Hiring Manager", job.hiringManager.name],
    ["Recruiter", job.recruiter.name],
    ["Created", job.created],
    ["Posted", job.posted ?? "Not posted"],
    ["Target Fill Date", job.targetFillDate],
  ];

  const totalPipeline =
    job.pipeline.applied +
    job.pipeline.screened +
    job.pipeline.interview +
    job.pipeline.final +
    job.pipeline.offer +
    job.pipeline.hired;

  return (
    <motion.div
      key="overview"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
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

      {/* Pipeline Summary */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pipeline Summary
        </h3>
        <div className="space-y-2">
          {PIPELINE_STAGES.map((stage, i) => {
            const count = job.pipeline[stage.key as keyof typeof job.pipeline];
            const pct = totalPipeline > 0 ? (count / totalPipeline) * 100 : 0;
            const prevCount =
              i > 0
                ? job.pipeline[
                    PIPELINE_STAGES[i - 1].key as keyof typeof job.pipeline
                  ]
                : null;
            const convRate =
              prevCount !== null && prevCount > 0
                ? ((count / prevCount) * 100).toFixed(0)
                : null;

            return (
              <div key={stage.key} className="space-y-0.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{stage.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground tabular-nums">
                      {count}
                    </span>
                    {convRate !== null && (
                      <span className="text-[10px] text-muted-foreground">
                        ({convRate}%)
                      </span>
                    )}
                  </div>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${stage.colorClass}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Key Metrics */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Key Metrics
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              label: "Time to Fill (est.)",
              value: `${job.estimatedTimeToFill} days`,
            },
            { label: "Source Mix", value: `${job.distribution.length} channels` },
            { label: "Interview Velocity", value: "4.2 days avg" },
            {
              label: "Offer Rate",
              value:
                job.pipeline.applied > 0
                  ? `${((job.pipeline.offer / job.pipeline.applied) * 100).toFixed(0)}%`
                  : "—",
            },
          ].map((m) => (
            <div
              key={m.label}
              className="bg-secondary rounded-lg p-3 space-y-0.5"
            >
              <p className="text-[11px] text-muted-foreground">{m.label}</p>
              <p className="text-sm font-bold text-foreground">{m.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hiring Team */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Hiring Team
        </h3>
        <div className="space-y-2">
          {HIRING_TEAM.map((member) => (
            <div key={member.name} className="flex items-center gap-2.5">
              <div
                className={`size-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 ${avatarColorClass(member.name)}`}
              >
                {member.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {member.name}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {member.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Recent Activity
        </h3>
        <div className="space-y-2">
          {RECENT_ACTIVITY.map((a, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 text-sm"
            >
              <span className="text-[11px] text-muted-foreground shrink-0 mt-0.5 w-12">
                {a.date}
              </span>
              <span className="text-foreground">{a.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Distribution */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Distribution Channels
        </h3>
        <div className="space-y-1.5">
          {job.distribution.length > 0 ? (
            job.distribution.map((ch) => (
              <div key={ch} className="flex items-center gap-2 text-sm">
                <Check className="size-3.5 text-success" />
                <span className="text-foreground">{ch}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No channels configured
            </p>
          )}
        </div>
      </section>
    </motion.div>
  );
}

/* ================================================================== */
/*  Tab: Pipeline                                                      */
/* ================================================================== */

const STAGE_DETAILS: Record<
  string,
  { avgDays: string; aiNote: string }
> = {
  applied: { avgDays: "2.1", aiNote: "Strong inbound volume. Consider raising screening bar." },
  screened: { avgDays: "3.4", aiNote: "AI screening catching 60% of unqualified candidates early." },
  interview: { avgDays: "5.2", aiNote: "Interview scheduling is the primary bottleneck." },
  final: { avgDays: "4.8", aiNote: "Panel availability causing 2-day avg delays." },
  offer: { avgDays: "3.1", aiNote: "Offer approval SLA within target." },
  hired: { avgDays: "—", aiNote: "Onboarding pipeline healthy." },
};

function PipelineTab({ job }: { job: Job }) {
  const totalApplied = job.pipeline.applied || 1;

  return (
    <motion.div
      key="pipeline"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Full funnel */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pipeline Funnel
        </h3>
        <div className="space-y-2">
          {PIPELINE_STAGES.map((stage, i) => {
            const count =
              job.pipeline[stage.key as keyof typeof job.pipeline];
            const pct = (count / totalApplied) * 100;

            return (
              <div key={stage.key} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {stage.label}
                  </span>
                  <span className="text-muted-foreground tabular-nums">
                    {count} ({pct.toFixed(0)}%)
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${stage.colorClass}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.5, delay: i * 0.06 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Stage breakdown cards */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Stage Breakdown
        </h3>
        <div className="space-y-2.5">
          {PIPELINE_STAGES.map((stage) => {
            const count =
              job.pipeline[stage.key as keyof typeof job.pipeline];
            const detail = STAGE_DETAILS[stage.key];

            return (
              <div
                key={stage.key}
                className="bg-card border border-border rounded-lg p-3 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${stage.colorClass}`}
                    />
                    <span className="text-sm font-semibold text-foreground">
                      {stage.label}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-foreground tabular-nums">
                    {count}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Avg days in stage: {detail.avgDays}
                </p>
                <p className="text-xs text-muted-foreground italic">
                  AI: {detail.aiNote}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Bottleneck Analysis */}
      <section className="space-y-3">
        <div className="rounded-xl border border-brand-purple/30 bg-brand-purple/[0.03] p-4 space-y-3 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple to-brand" />
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-brand-purple" />
            <h4 className="text-sm font-semibold text-foreground">
              AI Bottleneck Analysis
            </h4>
          </div>
          <p className="text-sm text-foreground leading-relaxed">
            Primary bottleneck detected at the <strong>Interview</strong> stage.
            Average time-in-stage is 5.2 days vs. target of 3 days. Root cause:
            interviewer calendar conflicts during sprint weeks.
          </p>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recommendations
            </p>
            <ul className="space-y-1 text-sm text-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 rounded-full bg-brand-purple shrink-0" />
                Add 2 backup interviewers to reduce scheduling bottleneck
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 rounded-full bg-brand-purple shrink-0" />
                Enable AI-assisted interview scheduling with calendar optimization
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 size-1.5 rounded-full bg-brand-purple shrink-0" />
                Consider async technical assessment to parallelize evaluation
              </li>
            </ul>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

/* ================================================================== */
/*  Tab: Description                                                   */
/* ================================================================== */

function DescriptionTab({ job }: { job: Job }) {
  return (
    <motion.div
      key="description"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* About */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">About the Role</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          We are looking for a {job.title} to join our {job.team} team in{" "}
          {job.department}. This is a {job.level} level, {job.employmentType}{" "}
          position based in {job.location} ({job.workModel}). You will work
          closely with cross-functional teams to build world-class products that
          serve millions of users across India and beyond.
        </p>
      </section>

      {/* Responsibilities */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Responsibilities</h3>
        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
          <li>Lead technical design and implementation of core platform features</li>
          <li>Mentor junior engineers and contribute to engineering culture</li>
          <li>Collaborate with product and design teams on user-facing features</li>
          <li>Drive technical decisions and architecture discussions</li>
          <li>Participate in code reviews, on-call rotations, and incident response</li>
          <li>Contribute to hiring processes and engineering team growth</li>
        </ul>
      </section>

      {/* Requirements */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Requirements</h3>
        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
          <li>4+ years of professional software development experience</li>
          <li>Strong proficiency in TypeScript and modern JavaScript frameworks</li>
          <li>Experience with cloud platforms (AWS/GCP) and CI/CD pipelines</li>
          <li>Solid understanding of system design principles</li>
          <li>Excellent communication and collaboration skills</li>
        </ul>
      </section>

      {/* Nice to Have */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Nice to Have</h3>
        <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-4">
          <li>Experience with design systems and component library architecture</li>
          <li>Open-source contributions</li>
          <li>Prior startup or high-growth company experience</li>
          <li>Familiarity with AI/ML tooling and integrations</li>
        </ul>
      </section>

      {/* Compensation */}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-foreground">Compensation</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          ₹{formatComp(job.compensation.min)} – ₹{formatComp(job.compensation.max)}{" "}
          ({job.compensation.currency}){job.compensation.equity ? " + Equity (ESOPs)" : ""}.
          Final offer based on experience, skills, and interview performance.
          Benefits include health insurance, learning budget, flexible work, and more.
        </p>
      </section>

      {/* AI Optimization Report */}
      <section className="space-y-3">
        <div className="rounded-xl border border-brand-purple/30 bg-brand-purple/[0.03] p-4 space-y-3 overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple to-brand" />
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-brand-purple" />
            <h4 className="text-sm font-semibold text-foreground">
              AI Optimization Report
            </h4>
          </div>

          {/* JD Quality Score */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">JD Quality Score</span>
              <span className="font-bold text-foreground">82/100</span>
            </div>
            <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-brand-teal"
                initial={{ width: 0 }}
                animate={{ width: "82%" }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-1.5">
            {[
              { icon: "check", text: "Clear role description and expectations" },
              { icon: "check", text: "Inclusive language used throughout" },
              { icon: "check", text: "Compensation range disclosed" },
              { icon: "check", text: "Benefits and perks mentioned" },
              { icon: "warn", text: "Requirements list slightly long (5+ items may deter candidates)" },
              { icon: "x", text: "Missing: remote work policy details" },
            ].map((item, i) => {
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
                <div key={i} className="flex items-start gap-2 text-sm">
                  <Icon className={`size-3.5 shrink-0 mt-0.5 ${color}`} />
                  <span className="text-foreground">{item.text}</span>
                </div>
              );
            })}
          </div>

          {/* Scores */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground">Inclusivity Score</p>
              <p className="text-sm font-bold text-success">88/100</p>
            </div>
            <div className="space-y-1">
              <p className="text-[11px] text-muted-foreground">SEO Score</p>
              <p className="text-sm font-bold text-brand-teal">76/100</p>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

/* ================================================================== */
/*  Tab: Settings                                                      */
/* ================================================================== */

const PIPELINE_STAGE_LIST = [
  "Applied",
  "Phone Screen",
  "Technical Interview",
  "Final Round",
  "Offer",
  "Hired",
];

const AUTOMATION_RULES = [
  { label: "Auto-reject candidates below AI score threshold (40)", enabled: true },
  { label: "Send acknowledgement email on application", enabled: true },
  { label: "Auto-schedule phone screen for AI score > 75", enabled: false },
  { label: "Notify HM when candidate reaches Final stage", enabled: true },
  { label: "Auto-archive after 30 days of inactivity", enabled: false },
];

const INTERVIEW_PLAN = [
  { round: 1, name: "Phone Screen", interviewer: "Recruiter", duration: "30 min" },
  { round: 2, name: "Technical Interview", interviewer: "Engineering Lead", duration: "60 min" },
  { round: 3, name: "System Design", interviewer: "Staff Engineer", duration: "60 min" },
  { round: 4, name: "Culture & Values", interviewer: "Hiring Manager", duration: "45 min" },
];

function SettingsTab() {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Pipeline Stages */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Pipeline Stages
        </h3>
        <div className="space-y-1">
          {PIPELINE_STAGE_LIST.map((stage, i) => (
            <div
              key={stage}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2"
            >
              <GripVertical className="size-3.5 text-muted-foreground cursor-grab" />
              <span className="text-xs text-muted-foreground font-mono tabular-nums w-5">
                {i + 1}
              </span>
              <span className="text-sm text-foreground">{stage}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Automation Rules */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Automation Rules
        </h3>
        <div className="space-y-2">
          {AUTOMATION_RULES.map((rule) => (
            <div
              key={rule.label}
              className="flex items-start gap-3 text-sm"
            >
              <div
                className={`mt-0.5 size-4 rounded shrink-0 border flex items-center justify-center ${
                  rule.enabled
                    ? "bg-brand border-brand"
                    : "border-border bg-secondary"
                }`}
              >
                {rule.enabled && <Check className="size-3 text-white" />}
              </div>
              <span
                className={
                  rule.enabled ? "text-foreground" : "text-muted-foreground"
                }
              >
                {rule.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Scorecard Template */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Scorecard Template
        </h3>
        <div className="bg-card border border-border rounded-lg p-3 space-y-1.5">
          <p className="text-sm font-medium text-foreground">
            Standard Technical Evaluation
          </p>
          <p className="text-xs text-muted-foreground">
            5 criteria &middot; 1-5 star rating &middot; Required notes for
            scores below 3
          </p>
          <p className="text-xs text-muted-foreground">
            Criteria: Technical Knowledge, Communication, Problem Solving,
            Culture Fit, Leadership Potential
          </p>
        </div>
      </section>

      {/* Interview Plan */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Interview Plan
        </h3>
        <div className="space-y-2">
          {INTERVIEW_PLAN.map((round) => (
            <div
              key={round.round}
              className="bg-card border border-border rounded-lg p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <span className="size-6 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-foreground">
                  {round.round}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {round.name}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {round.interviewer}
                  </p>
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {round.duration}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Approvals */}
      <section className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Approvals
        </h3>
        <div className="space-y-2">
          {[
            { person: "Prashant Singh", status: "approved", date: "Feb 20" },
            { person: "Finance Team", status: "approved", date: "Feb 22" },
            { person: "HR Review", status: "approved", date: "Feb 25" },
          ].map((a) => (
            <div
              key={a.person}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-2">
                <Check className="size-3.5 text-success" />
                <span className="text-foreground">{a.person}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {a.status} &middot; {a.date}
              </span>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

/* ================================================================== */
/*  Tab: AI Intel                                                      */
/* ================================================================== */

const SOURCING_RECS = [
  "Increase LinkedIn InMail campaigns targeting passive candidates at Flipkart and PhonePe — high match rate (68%) for this role profile.",
  "Activate employee referral bonus (₹50K) — referral hires show 2.3x retention at O2S.",
  "Post to Hacker News 'Who is Hiring' thread — strong signal for senior IC roles.",
  "Consider partnering with IIT placement cells for fresh perspectives on the team.",
];

const COMPETING_OFFERS = [
  { name: "Candidate A (Final Round)", company: "Razorpay", offer: "₹42L + ESOPs", risk: "high" },
  { name: "Candidate B (Offer)", company: "CRED", offer: "₹38L", risk: "medium" },
  { name: "Candidate C (Interview)", company: "Meesho", offer: "₹35L + ESOPs", risk: "low" },
];

function AIIntelTab({ job }: { job: Job }) {
  const daysOpen = job.daysOpen ?? 0;
  const est = job.estimatedTimeToFill;
  const progressPct = est > 0 ? Math.min((daysOpen / est) * 100, 100) : 0;

  return (
    <motion.div
      key="ai-intel"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 bg-brand-purple/[0.02] -mx-5 px-5 -mt-4 pt-4 min-h-full"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-brand-purple" />
        <h3 className="text-sm font-semibold text-foreground">
          AI Intelligence Report
        </h3>
      </div>

      {/* Predicted Time to Fill */}
      <section className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Predicted Time to Fill
        </h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Day {daysOpen} of est. {est}
            </span>
            <span className={`font-bold ${progressPct > 80 ? "text-destructive" : progressPct > 60 ? "text-warning" : "text-success"}`}>
              {progressPct.toFixed(0)}%
            </span>
          </div>
          <div className="h-3 w-full rounded-full bg-secondary overflow-hidden relative">
            <motion.div
              className={`h-full rounded-full ${progressPct > 80 ? "bg-destructive" : progressPct > 60 ? "bg-warning" : "bg-success"}`}
              initial={{ width: 0 }}
              animate={{ width: `${progressPct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {progressPct <= 60
              ? "On track — pipeline velocity is healthy"
              : progressPct <= 80
                ? "Attention needed — approaching estimated fill time"
                : "At risk — exceeded target timeline, escalate sourcing"}
          </p>
        </div>
      </section>

      {/* Market Intelligence */}
      <section className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Market Intelligence
        </h4>
        <div className="bg-card border border-border rounded-lg p-3 space-y-2.5">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-[11px] text-muted-foreground">Demand</p>
              <p className="text-sm font-bold text-destructive">High</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Supply</p>
              <p className="text-sm font-bold text-warning">Moderate</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Competition</p>
              <p className="text-sm font-bold text-destructive">Intense</p>
            </div>
          </div>
          <div className="border-t border-border pt-2">
            <p className="text-[11px] text-muted-foreground">Salary Benchmark</p>
            <p className="text-sm text-foreground">
              ₹{formatComp(job.compensation.min)} – ₹{formatComp(job.compensation.max)} is{" "}
              <span className="font-semibold text-success">competitive</span> for
              {" "}{job.level} in {job.location}. Market median: ₹{formatComp((job.compensation.min + job.compensation.max) / 2)}.
            </p>
          </div>
        </div>
      </section>

      {/* Candidate Quality Analysis */}
      <section className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Candidate Quality Analysis
        </h4>
        <div className="space-y-2">
          {[
            { label: "Excellent (80+)", pct: 18, color: "bg-success" },
            { label: "Good (60-79)", pct: 35, color: "bg-brand-teal" },
            { label: "Average (40-59)", pct: 30, color: "bg-warning" },
            { label: "Below Average (<40)", pct: 17, color: "bg-destructive" },
          ].map((q) => (
            <div key={q.label} className="space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{q.label}</span>
                <span className="font-semibold text-foreground">{q.pct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${q.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${q.pct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sourcing Recommendations */}
      <section className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Sourcing Recommendations
        </h4>
        <div className="space-y-2">
          {SOURCING_RECS.map((rec, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 text-sm"
            >
              <span className="size-5 rounded-full bg-brand-purple/10 text-brand-purple flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-foreground leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Competitive Offer Intelligence */}
      <section className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Competitive Offer Intelligence
        </h4>
        <div className="space-y-2">
          {COMPETING_OFFERS.map((c) => (
            <div
              key={c.name}
              className="bg-card border border-border rounded-lg p-3 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {c.name}
                </span>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    c.risk === "high"
                      ? "bg-destructive/10 text-destructive"
                      : c.risk === "medium"
                        ? "bg-warning/10 text-warning"
                        : "bg-success/10 text-success"
                  }`}
                >
                  {c.risk} risk
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Competing offer from <span className="text-foreground font-medium">{c.company}</span>{" "}
                at {c.offer}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Bias & Compliance Check */}
      <section className="space-y-3 pb-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Bias & Compliance Check
        </h4>
        <div className="space-y-1.5">
          {[
            { icon: "check", text: "Job description uses gender-neutral language" },
            { icon: "check", text: "No age-discriminatory requirements detected" },
            { icon: "check", text: "Compensation range compliant with pay transparency guidelines" },
            { icon: "check", text: "Equal opportunity statement included" },
            { icon: "warn", text: "Consider adding accessibility accommodations info" },
            { icon: "warn", text: "Location requirement may limit diversity — consider expanding to full remote" },
          ].map((item, i) => {
            const Icon = item.icon === "check" ? Check : AlertTriangle;
            const color =
              item.icon === "check" ? "text-success" : "text-warning";

            return (
              <div key={i} className="flex items-start gap-2 text-sm">
                <Icon className={`size-3.5 shrink-0 mt-0.5 ${color}`} />
                <span className="text-foreground">{item.text}</span>
              </div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
}

/* ================================================================== */
/*  Main Component                                                     */
/* ================================================================== */

const tabs = ["Overview", "Pipeline", "Description", "Settings", "AI Intel"] as const;
type TabName = (typeof tabs)[number];

export function JobSlideOver({ job, onClose }: SlideOverProps) {
  const [activeTab, setActiveTab] = useState<TabName>("Overview");

  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {job && (
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
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
              duration: 0.3,
            }}
            className="fixed right-0 top-0 z-50 flex h-full w-[600px] max-w-full flex-col border-l border-border bg-card shadow-2xl"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-3 top-3 z-10 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>

            {/* ──── Header ──── */}
            <div className="shrink-0 border-b border-border px-5 pt-5 pb-4 space-y-3">
              {/* Badges row */}
              <div className="flex items-center gap-2 flex-wrap pr-8">
                {/* Status badge */}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_CONFIG[job.status].textClass}`}
                  style={{
                    backgroundColor: `color-mix(in srgb, currentColor 10%, transparent)`,
                  }}
                >
                  <span
                    className={`size-1.5 rounded-full ${STATUS_CONFIG[job.status].dotClass}`}
                  />
                  {STATUS_CONFIG[job.status].label}
                </span>
                {/* Priority badge */}
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${PRIORITY_CONFIG[job.priority].textClass} ${PRIORITY_CONFIG[job.priority].bgClass}`}
                >
                  {PRIORITY_CONFIG[job.priority].label}
                </span>
                {/* Req ID */}
                <span className="text-xs text-muted-foreground font-mono">
                  {job.reqId}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-foreground pr-8">
                {job.title}
              </h2>

              {/* Dept + Team */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span
                  className={`size-2.5 rounded-full ${(DEPT_COLORS[job.department] ?? { colorClass: "bg-muted-foreground" }).colorClass}`}
                />
                <span className="text-foreground font-medium">
                  {job.department}
                </span>
                <span>&middot;</span>
                <span>{job.team}</span>
              </div>

              {/* Location + Work Model */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" />
                  {job.location}
                </span>
                <span className="inline-flex items-center gap-1">
                  {job.workModel}
                </span>
              </div>

              {/* HM + Recruiter */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={`size-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${avatarColorClass(job.hiringManager.name)}`}
                  >
                    {job.hiringManager.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  HM: {job.hiringManager.name}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span
                    className={`size-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white ${avatarColorClass(job.recruiter.name)}`}
                  >
                    {job.recruiter.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  Rec: {job.recruiter.name}
                </span>
              </div>

              {/* Posted date + days open */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3" />
                  {job.posted ? `Posted ${job.posted}` : "Not yet posted"}
                </span>
                {job.daysOpen !== null && (
                  <span
                    className={`inline-flex items-center gap-1 ${daysOpenColor(job.daysOpen)}`}
                  >
                    <Clock className="size-3" />
                    {job.daysOpen} days open
                  </span>
                )}
              </div>

              {/* Health bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Pipeline Health</span>
                  <span
                    className={`font-semibold ${healthColor(job.healthScore)}`}
                  >
                    {job.healthScore !== null
                      ? `${job.healthScore} — ${healthLabel(job.healthScore)}`
                      : "—"}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${healthBarColor(job.healthScore)}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${job.healthScore ?? 0}%` }}
                    transition={{ duration: 0.6 }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Edit3 className="size-3.5" />
                  Edit Job
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  {job.status === "paused" ? (
                    <Play className="size-3.5" />
                  ) : (
                    <Pause className="size-3.5" />
                  )}
                  {job.status === "paused" ? "Resume" : "Pause"}
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Share2 className="size-3.5" />
                  Share Link
                </Button>
                <Button
                  size="sm"
                  className="gap-1.5 bg-brand text-white hover:bg-brand/90"
                >
                  <ArrowRight className="size-3.5" />
                  Jump to Pipeline
                </Button>
              </div>
            </div>

            {/* ──── Tab Bar ──── */}
            <div className="shrink-0 border-b border-border px-5">
              <div className="flex gap-4 -mb-px overflow-x-auto scrollbar-thin">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative py-2.5 text-sm font-medium transition-colors whitespace-nowrap ${
                      activeTab === tab
                        ? "text-brand"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="job-tab-indicator"
                        className="absolute inset-x-0 -bottom-px h-0.5 bg-brand rounded-full"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ──── Tab Content (scrollable) ──── */}
            <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
              <AnimatePresence mode="wait">
                {activeTab === "Overview" && <OverviewTab job={job} />}
                {activeTab === "Pipeline" && <PipelineTab job={job} />}
                {activeTab === "Description" && <DescriptionTab job={job} />}
                {activeTab === "Settings" && <SettingsTab />}
                {activeTab === "AI Intel" && <AIIntelTab job={job} />}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
