"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  MessageCircle,
  Calendar,
  MoreHorizontal,
  MapPin,
  Star,
  FileText,
  Sparkles,
  Check,
  AlertTriangle,
  Plus,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Award,
  Users,
  ArrowRight,
  CheckCircle,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  type Employee,
  DEPT_MAP,
  STATUS_CONFIG,
  avatarColorClass,
  engagementColor,
  engagementBarColor,
  riskColor,
  riskBgColor,
} from "@/components/people/data";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface EmployeeSlideOverProps {
  employee: Employee | null;
  onClose: () => void;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

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

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </h3>
  );
}

function tzForLocation(location: string): string {
  if (location.includes("International")) return "Varies";
  return "IST (UTC+5:30)";
}

/* ------------------------------------------------------------------ */
/*  Tab: Overview                                                      */
/* ------------------------------------------------------------------ */

const upcomingEvents = [
  { date: "Mar 26", title: "1:1 with Manager", time: "10:00 AM IST" },
  { date: "Mar 28", title: "Sprint Retrospective", time: "3:00 PM IST" },
  { date: "Apr 01", title: "Quarterly OKR Review", time: "11:00 AM IST" },
  { date: "Apr 05", title: "Team Offsite Planning", time: "2:00 PM IST" },
];

const recentNotes = [
  {
    author: "Manager",
    authorName: "",
    date: "Mar 20",
    text: "Strong quarter — exceeded sprint velocity targets by 15%. Recommend for IC4 promotion cycle in Q2.",
    isAI: false,
  },
  {
    author: "System",
    authorName: "AI Pulse",
    date: "Mar 18",
    text: "Engagement score increased by 4 points this month. Collaboration index with Design team improved significantly.",
    isAI: true,
  },
];

function OverviewTab({ employee }: { employee: Employee }) {
  const dept = DEPT_MAP[employee.department];
  const quickFacts: [string, string | React.ReactNode][] = [
    ["Employee ID", employee.id.toUpperCase()],
    ["Department", employee.department],
    ["Team", employee.team],
    ["Level", employee.level],
    [
      "Manager",
      employee.manager ? (
        <span className="text-brand cursor-pointer hover:underline">
          {employee.manager}
        </span>
      ) : (
        "—"
      ),
    ],
    ["Start Date", new Date(employee.startDate).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })],
    ["Tenure", employee.tenure],
    ["Location", employee.location],
    ["Employment Type", employee.status === "contractor" ? "Contractor" : "Full-Time"],
    ["Work Model", employee.location.startsWith("Remote") ? "Remote" : "Hybrid"],
  ];

  const managerNote = { ...recentNotes[0], authorName: employee.manager ?? "Direct Manager" };

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
        <SectionHeading>Quick Facts</SectionHeading>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          {quickFacts.map(([key, val]) => (
            <div key={key as string}>
              <p className="text-[11px] text-muted-foreground">{key}</p>
              <p className="text-sm text-foreground">{val}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Direct Reports */}
      {employee.directReports > 0 && (
        <section className="space-y-3">
          <SectionHeading>Direct Reports</SectionHeading>
          <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3">
            <div className="flex items-center gap-2">
              <Users className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {employee.directReports} direct report{employee.directReports !== 1 ? "s" : ""}
              </span>
            </div>
            <span className="text-xs text-brand cursor-pointer hover:underline">
              View Team
            </span>
          </div>
        </section>
      )}

      {/* About */}
      <section className="space-y-3">
        <SectionHeading>About</SectionHeading>
        <p className="text-sm leading-relaxed text-foreground">
          {employee.name} is a {employee.role} in the {employee.team} team within {employee.department}.
          {" "}With {employee.tenure} of tenure at LatentBridge, they have been instrumental in driving key initiatives
          across the organization. Known for strong cross-functional collaboration and a growth mindset,
          they consistently deliver high-quality work and mentor junior team members.
        </p>
      </section>

      {/* Upcoming Events */}
      <section className="space-y-3">
        <SectionHeading>Upcoming Events</SectionHeading>
        <div className="space-y-2">
          {upcomingEvents.map((evt, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border border-border bg-background p-2.5">
              <Calendar className="size-4 text-muted-foreground shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{evt.title}</p>
                <p className="text-xs text-muted-foreground">{evt.date} &middot; {evt.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Notes */}
      <section className="space-y-3">
        <SectionHeading>Recent Notes</SectionHeading>
        <div className="space-y-3">
          <div className="rounded-lg border border-border bg-background p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MessageSquare className="size-3" />
              <span className="font-medium text-foreground">{managerNote.authorName}</span>
              <span>&middot;</span>
              <span>{managerNote.date}</span>
            </div>
            <p className="text-sm text-foreground">{managerNote.text}</p>
          </div>
          <div className="rounded-lg border border-brand-purple/20 bg-brand-purple/5 p-3 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="size-3 text-brand-purple" />
              <span className="font-medium text-brand-purple">AI Pulse</span>
              <span>&middot;</span>
              <span>{recentNotes[1].date}</span>
            </div>
            <p className="text-sm text-foreground">{recentNotes[1].text}</p>
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
/*  Tab: Employment                                                    */
/* ------------------------------------------------------------------ */

const leaveBalances = [
  { type: "Paid Leave", used: 6, total: 24 },
  { type: "Sick Leave", used: 2, total: 12 },
  { type: "Comp Off", used: 1, total: 3 },
];

const documents = [
  { name: "Offer Letter", date: "Jan 2023" },
  { name: "NDA Agreement", date: "Jan 2023" },
  { name: "Compensation Revision Letter", date: "Apr 2025" },
  { name: "ESOP Grant Letter", date: "Jul 2024" },
  { name: "ID Proof (Aadhaar)", date: "Jan 2023" },
];

const benefits = [
  { name: "Health Insurance (Family Floater)", active: true },
  { name: "Term Life Insurance (2Cr)", active: true },
  { name: "Gym & Wellness Allowance", active: true },
  { name: "Learning & Development Budget", active: true },
  { name: "Relocation Assistance", active: false },
];

function EmploymentTab({ employee }: { employee: Employee }) {
  const baseSalary = 2400000;
  const variable = 400000;
  const esops = 1200000;
  const totalComp = baseSalary + variable + esops;

  const showAttritionWarning =
    employee.aiScore &&
    (employee.aiScore.attritionRisk === "medium" || employee.aiScore.attritionRisk === "high");

  return (
    <motion.div
      key="employment"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Compensation */}
      <section className="space-y-3">
        <SectionHeading>Compensation</SectionHeading>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
          <div>
            <p className="text-[11px] text-muted-foreground">Base Salary</p>
            <p className="text-sm font-medium text-foreground">₹{(baseSalary / 100000).toFixed(1)}L / yr</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Variable</p>
            <p className="text-sm font-medium text-foreground">₹{(variable / 100000).toFixed(1)}L / yr</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">ESOPs (Vested Value)</p>
            <p className="text-sm font-medium text-foreground">₹{(esops / 100000).toFixed(1)}L</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Total Comp</p>
            <p className="text-sm font-bold text-foreground">₹{(totalComp / 100000).toFixed(1)}L / yr</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Band</p>
            <p className="text-sm text-foreground">{employee.level} — Band 3</p>
          </div>
          <div>
            <p className="text-[11px] text-muted-foreground">Last Revision</p>
            <p className="text-sm text-foreground">Apr 2025</p>
          </div>
        </div>
      </section>

      {/* AI Flag */}
      {showAttritionWarning && (
        <div className="rounded-lg border-l-2 border-brand-purple bg-brand-purple/5 p-4 space-y-1">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-brand-purple" />
            <span className="text-xs font-semibold text-brand-purple">AI Insight</span>
          </div>
          <p className="text-sm text-warning leading-relaxed">
            Compensation is below the 50th percentile for this role and level in the current market.
            Consider a mid-cycle revision to reduce attrition risk.
          </p>
        </div>
      )}

      {/* Leave Balance */}
      <section className="space-y-3">
        <SectionHeading>Leave Balance</SectionHeading>
        <div className="space-y-2">
          {leaveBalances.map((lb) => (
            <div key={lb.type} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{lb.type}</span>
              <span className="font-medium text-foreground">
                {lb.total - lb.used} / {lb.total} remaining
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Documents */}
      <section className="space-y-3">
        <SectionHeading>Documents</SectionHeading>
        <div className="space-y-1.5">
          {documents.map((doc) => (
            <div
              key={doc.name}
              className="flex items-center gap-2.5 rounded-lg border border-border bg-background p-2.5 cursor-pointer hover:bg-secondary/50 transition-colors"
            >
              <FileText className="size-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{doc.name}</p>
              </div>
              <span className="text-xs text-muted-foreground shrink-0">{doc.date}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="space-y-3">
        <SectionHeading>Benefits</SectionHeading>
        <div className="space-y-2">
          {benefits.map((b) => (
            <div key={b.name} className="flex items-center gap-2.5 text-sm">
              <div
                className={`size-4 rounded border flex items-center justify-center shrink-0 ${
                  b.active
                    ? "bg-brand border-brand text-white"
                    : "border-border bg-background"
                }`}
              >
                {b.active && <Check className="size-3" />}
              </div>
              <span className={b.active ? "text-foreground" : "text-muted-foreground"}>
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Skills                                                        */
/* ------------------------------------------------------------------ */

type VerificationType = "verified" | "ai-assessed" | "self-assessed";

interface SkillEntry {
  name: string;
  rating: number;
  proficiency: string;
  verification: VerificationType;
}

function skillsForEmployee(employee: Employee): SkillEntry[] {
  const profMap: Record<number, string> = {
    5: "Expert",
    4: "Advanced",
    3: "Intermediate",
    2: "Developing",
    1: "Beginner",
  };
  const verifications: VerificationType[] = ["verified", "ai-assessed", "self-assessed"];
  return employee.skills.map((s, i) => {
    const rating = Math.max(1, 5 - (i % 4));
    return {
      name: s,
      rating,
      proficiency: profMap[rating] ?? "Intermediate",
      verification: verifications[i % 3],
    };
  });
}

const verificationStyles: Record<VerificationType, { label: string; className: string }> = {
  verified: { label: "Verified", className: "bg-success/15 text-success" },
  "ai-assessed": { label: "AI Assessed", className: "bg-brand-purple/15 text-brand-purple" },
  "self-assessed": { label: "Self-Assessed", className: "bg-secondary text-muted-foreground" },
};

const growthCriteria = [
  { label: "Technical Depth", current: 72, target: 85 },
  { label: "System Design", current: 60, target: 80 },
  { label: "Mentorship", current: 45, target: 70 },
  { label: "Cross-team Impact", current: 55, target: 75 },
];

function SkillsTab({ employee }: { employee: Employee }) {
  const skills = skillsForEmployee(employee);

  return (
    <motion.div
      key="skills"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-6"
    >
      {/* Skills Matrix */}
      <section className="space-y-3">
        <SectionHeading>Skills Matrix</SectionHeading>
        <div className="space-y-2.5">
          {skills.map((s) => {
            const vStyle = verificationStyles[s.verification];
            return (
              <div key={s.name} className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{s.name}</span>
                    <span
                      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${vStyle.className}`}
                    >
                      {vStyle.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Stars5 count={s.rating} />
                    <span className="text-xs text-muted-foreground">{s.proficiency}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Skill Insights */}
      <section className="space-y-3">
        <div className="rounded-lg border-l-2 border-brand-purple bg-brand-purple/5 p-4 space-y-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-brand-purple" />
            <span className="text-xs font-semibold text-brand-purple">AI Skill Insights</span>
          </div>
          <p className="text-sm leading-relaxed text-foreground">
            Based on project contributions, PR reviews, and peer feedback, {employee.name} shows
            strong growth in {employee.skills[0] ?? "their primary domain"}. Recommend focusing on
            {" "}{employee.skills.length > 2 ? employee.skills[2] : "system design"} to prepare for the
            next level. Cross-functional collaboration with the Product team could accelerate growth
            in stakeholder management.
          </p>
        </div>
      </section>

      {/* Growth Track */}
      <section className="space-y-3">
        <SectionHeading>Growth Track</SectionHeading>
        <div className="flex items-center gap-2 mb-3">
          <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-foreground">
            {employee.level}
          </span>
          <ArrowRight className="size-3.5 text-muted-foreground" />
          <span className="rounded-full bg-brand/10 px-2.5 py-1 text-xs font-medium text-brand">
            {employee.level === "IC1"
              ? "IC2"
              : employee.level === "IC2"
                ? "IC3"
                : employee.level === "IC3"
                  ? "IC4"
                  : employee.level === "IC4"
                    ? "IC5"
                    : employee.level === "IC5"
                      ? "Lead"
                      : "Next Level"}
          </span>
        </div>
        <div className="space-y-3">
          {growthCriteria.map((c) => (
            <div key={c.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{c.label}</span>
                <span className="font-medium text-foreground">
                  {c.current}% / {c.target}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-brand"
                  initial={{ width: 0 }}
                  animate={{ width: `${(c.current / c.target) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: Timeline                                                      */
/* ------------------------------------------------------------------ */

type TimelineColor = "blue" | "teal" | "amber" | "emerald" | "purple" | "gray";

interface TimelineEntry {
  date: string;
  title: string;
  detail: string;
  color: TimelineColor;
}

const dotColorMap: Record<TimelineColor, string> = {
  blue: "bg-brand",
  teal: "bg-brand-teal",
  amber: "bg-warning",
  emerald: "bg-success",
  purple: "bg-brand-purple",
  gray: "bg-muted-foreground",
};

const lineColorMap: Record<TimelineColor, string> = {
  blue: "bg-brand/30",
  teal: "bg-brand-teal/30",
  amber: "bg-warning/30",
  emerald: "bg-success/30",
  purple: "bg-brand-purple/30",
  gray: "bg-muted-foreground/30",
};

function timelineForEmployee(employee: Employee): TimelineEntry[] {
  const entries: TimelineEntry[] = [
    {
      date: "Mar 20, 2026",
      title: "Note Added by Manager",
      detail: `${employee.manager ?? "Manager"} added a performance note: "Exceeded sprint velocity targets by 15%."`,
      color: "blue",
    },
    {
      date: "Jan 15, 2026",
      title: "Work Anniversary",
      detail: `Celebrated ${employee.tenure} at LatentBridge. Recognized in the all-hands meeting.`,
      color: "emerald",
    },
    {
      date: "Apr 01, 2025",
      title: "Compensation Revision",
      detail: "Annual comp revision applied. Base salary increased by 18%. Band adjusted to current level.",
      color: "amber",
    },
    {
      date: "Jan 10, 2025",
      title: "Role Change",
      detail: `Promoted to ${employee.role}. Updated reporting line and responsibilities.`,
      color: "teal",
    },
    {
      date: "Oct 15, 2024",
      title: "Performance Review — Exceeds Expectations",
      detail: "H2 2024 review completed. Rating: 4.2/5. Strengths: technical depth, collaboration. Growth area: stakeholder management.",
      color: "purple",
    },
    {
      date: "Jul 01, 2024",
      title: "ESOP Grant",
      detail: "Granted 2,400 ESOPs under the refresher pool. 4-year vesting with 1-year cliff.",
      color: "amber",
    },
    {
      date: "Mar 15, 2024",
      title: "Team Change",
      detail: `Moved to ${employee.team} team within ${employee.department}.`,
      color: "gray",
    },
    {
      date: new Date(employee.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      title: "Joined LatentBridge",
      detail: `Joined as part of the ${employee.department} department. Onboarding completed within 2 weeks.`,
      color: "emerald",
    },
  ];
  return entries;
}

function TimelineTab({ employee }: { employee: Employee }) {
  const entries = timelineForEmployee(employee);

  return (
    <motion.div
      key="timeline"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-0"
    >
      <SectionHeading>Employment History</SectionHeading>
      <div className="relative mt-4">
        {entries.map((entry, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07, duration: 0.25 }}
            className="relative flex gap-4 pb-6 last:pb-0"
          >
            {/* Connecting line */}
            {i < entries.length - 1 && (
              <div
                className={`absolute left-[4.5px] top-3.5 h-[calc(100%-4px)] w-[2px] ${lineColorMap[entry.color]}`}
              />
            )}
            {/* Dot */}
            <div
              className={`relative z-10 mt-1 size-2.5 shrink-0 rounded-full ${dotColorMap[entry.color]}`}
            />
            {/* Content */}
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-bold text-foreground">{entry.date}</p>
              <p className="text-sm font-medium text-foreground">{entry.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{entry.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Tab: AI Pulse                                                      */
/* ------------------------------------------------------------------ */

const engagementFactors = [
  { label: "Work Satisfaction", value: 82 },
  { label: "Manager Relationship", value: 90 },
  { label: "Growth Opportunities", value: 75 },
  { label: "Compensation Sentiment", value: 68 },
  { label: "Team Collaboration", value: 88 },
];

const protectiveFactors = [
  "Strong manager relationship (1:1 frequency above average)",
  "Active in 3+ cross-functional projects",
  "Recently received ESOP grant (cliff not yet reached)",
  "High peer collaboration index",
];

const watchFactors = [
  "Compensation below 50th percentile for role",
  "No promotion in last 18 months",
  "LinkedIn profile updated recently",
];

const aiRecommendations = [
  { emoji: "1.", text: "Schedule a career development conversation within the next 2 weeks to discuss growth trajectory and promotion timeline." },
  { emoji: "2.", text: "Consider a mid-cycle compensation adjustment — current pay is 12% below market median for this role and level." },
  { emoji: "3.", text: "Increase visibility by nominating for the upcoming tech talk series or internal conference." },
  { emoji: "4.", text: "Pair with a senior mentor from another team to broaden cross-functional exposure and prepare for next-level scope." },
];

const networkAnalysis = [
  { department: "Engineering", strength: 92 },
  { department: "Product", strength: 78 },
  { department: "Design", strength: 65 },
  { department: "Sales", strength: 34 },
];

function AIPulseTab({ employee }: { employee: Employee }) {
  const score = employee.aiScore;
  const engagement = score?.engagement ?? 75;
  const risk = score?.attritionRisk ?? "low";
  const probability = score?.attritionProbability ?? 5;
  const trajectory = score?.performanceTrajectory ?? "stable";

  const TrendIcon =
    trajectory === "up"
      ? TrendingUp
      : trajectory === "down"
        ? TrendingDown
        : Minus;

  const trajectoryColor =
    trajectory === "up"
      ? "text-success"
      : trajectory === "down"
        ? "text-destructive"
        : "text-warning";

  const trajectoryLabel =
    trajectory === "up"
      ? "Upward Trend"
      : trajectory === "down"
        ? "Downward Trend"
        : "Stable";

  return (
    <motion.div
      key="ai-pulse"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 bg-brand-purple/[0.02] -mx-5 px-5 -mt-4 pt-4 min-h-full"
    >
      {/* Engagement Score */}
      <section className="space-y-3">
        <SectionHeading>Engagement Score</SectionHeading>
        <div className="flex items-end gap-2">
          <span className={`text-3xl font-bold tabular-nums ${engagementColor(engagement)}`}>
            {engagement}
          </span>
          <span className="text-lg text-muted-foreground mb-0.5">/100</span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${engagementBarColor(engagement)}`}
            initial={{ width: 0 }}
            animate={{ width: `${engagement}%` }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        </div>
        <div className="space-y-2 mt-3">
          {engagementFactors.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-medium text-foreground">{item.value}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${engagementBarColor(item.value)}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Attrition Risk */}
      <section className="space-y-3">
        <SectionHeading>Attrition Risk</SectionHeading>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold uppercase ${riskBgColor(risk)} ${riskColor(risk)}`}
          >
            {risk}
          </span>
          <span className="text-sm text-muted-foreground">
            Probability: <span className="font-medium text-foreground">{probability}%</span>
          </span>
        </div>

        <div className="space-y-2 mt-2">
          <p className="text-xs font-medium text-success">Protective Factors</p>
          <ul className="space-y-1.5">
            {protectiveFactors.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <CheckCircle className="size-3.5 shrink-0 mt-0.5 text-success" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 mt-2">
          <p className="text-xs font-medium text-warning">Watch Factors</p>
          <ul className="space-y-1.5">
            {watchFactors.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                <AlertTriangle className="size-3.5 shrink-0 mt-0.5 text-warning" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Performance Trajectory */}
      <section className="space-y-3">
        <SectionHeading>Performance Trajectory</SectionHeading>
        <div className="flex items-center gap-3 rounded-lg border border-border bg-background p-4">
          <TrendIcon className={`size-8 ${trajectoryColor}`} />
          <div>
            <p className="text-sm font-semibold text-foreground">{trajectoryLabel}</p>
            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
              {trajectory === "up"
                ? `${employee.name} has shown consistent improvement across sprint velocity, code quality, and peer feedback over the last 2 quarters. On track for promotion in the next cycle.`
                : trajectory === "down"
                  ? `${employee.name}'s performance metrics have declined over the past quarter. Sprint velocity is down 15% and peer feedback scores dropped. Recommend a focused 1:1 to identify blockers.`
                  : `${employee.name} is performing consistently at the expected level for ${employee.level}. Metrics are steady across all dimensions. Consider stretch assignments to accelerate growth.`}
            </p>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="space-y-3">
        <SectionHeading>AI Recommendations</SectionHeading>
        <div className="space-y-2.5">
          {aiRecommendations.map((rec, i) => (
            <div
              key={i}
              className="flex items-start gap-2.5 rounded-lg bg-secondary p-3 text-sm text-foreground leading-relaxed"
            >
              <span className="font-bold text-brand-purple shrink-0">{rec.emoji}</span>
              <span>{rec.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Network Analysis */}
      <section className="space-y-3 pb-4">
        <SectionHeading>Network Analysis</SectionHeading>
        <div className="space-y-2.5">
          {networkAnalysis.map((n) => (
            <div key={n.department} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{n.department}</span>
                <span className="font-medium text-foreground">{n.strength}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-brand-purple"
                  initial={{ width: 0 }}
                  animate={{ width: `${n.strength}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

const tabs = ["Overview", "Employment", "Skills", "Timeline", "AI Pulse"] as const;
type TabName = (typeof tabs)[number];

export function EmployeeSlideOver({ employee, onClose }: EmployeeSlideOverProps) {
  const [activeTab, setActiveTab] = useState<TabName>("Overview");

  const handleOverlayClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <AnimatePresence>
      {employee && (
        <>
          {/* Overlay */}
          <motion.div
            key="employee-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={handleOverlayClick}
          />

          {/* Panel */}
          <motion.div
            key="employee-panel"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, duration: 0.3 }}
            className="fixed right-0 top-0 z-50 flex h-full w-[560px] max-w-full flex-col border-l border-border bg-card shadow-2xl"
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
              <div className="flex items-start gap-4 pr-8">
                {/* Avatar with status dot */}
                <div className="relative shrink-0">
                  <div
                    className={`size-20 rounded-full flex items-center justify-center text-xl font-bold text-white ${avatarColorClass(employee.name)}`}
                  >
                    {employee.initials}
                  </div>
                  <div
                    className={`absolute bottom-0.5 right-0.5 size-3 rounded-full border-2 border-card ${STATUS_CONFIG[employee.status]?.dotClass ?? "bg-muted-foreground"}`}
                  />
                </div>

                <div className="min-w-0 space-y-1">
                  <h2 className="text-lg font-bold text-foreground truncate">
                    {employee.name}
                  </h2>
                  <p className="text-sm text-muted-foreground truncate">
                    {employee.role}
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <span
                      className={`inline-block size-2 rounded-full ${DEPT_MAP[employee.department]?.colorClass ?? "bg-muted-foreground"}`}
                    />
                    <span>{employee.department}</span>
                    <span>&middot;</span>
                    <span>{employee.team}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3 shrink-0" />
                    <span>{employee.location}</span>
                    <span>&middot;</span>
                    <span>{tzForLocation(employee.location)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {employee.email} &middot; {employee.phone}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Mail className="size-3.5" />
                  Email
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <MessageCircle className="size-3.5" />
                  Slack
                </Button>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Calendar className="size-3.5" />
                  Schedule 1:1
                </Button>
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontal className="size-4" />
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
                        layoutId="employee-tab-indicator"
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
                {activeTab === "Overview" && <OverviewTab employee={employee} />}
                {activeTab === "Employment" && <EmploymentTab employee={employee} />}
                {activeTab === "Skills" && <SkillsTab employee={employee} />}
                {activeTab === "Timeline" && <TimelineTab employee={employee} />}
                {activeTab === "AI Pulse" && <AIPulseTab employee={employee} />}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
