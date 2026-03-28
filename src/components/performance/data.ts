/* ================================================================
   O2S Performance Management — Types, Mock Data & Helpers
   ================================================================ */

export type PerfTab = "cycles" | "feedback" | "goals" | "calibration" | "oneOnOnes" | "analytics";

export const PERF_TABS: { key: PerfTab; label: string }[] = [
  { key: "cycles", label: "Review Cycles" },
  { key: "feedback", label: "Continuous Feedback" },
  { key: "goals", label: "Goals & OKRs" },
  { key: "calibration", label: "Calibration & Benchmarking" },
  { key: "oneOnOnes", label: "1:1 Meetings" },
  { key: "analytics", label: "Performance Analytics" },
];

/* ── Review Cycles ── */

export interface ReviewCycle {
  id: string;
  name: string;
  type: string;
  period: string;
  status: "in_progress" | "completed" | "draft";
  phases: { name: string; status: "done" | "active" | "pending"; completion: number | null }[];
  totalReviews: number;
  completed: number;
  pending: number;
  overdueManagers: number;
  dueDate: string;
  aiInsight: string;
}

export const ACTIVE_CYCLE: ReviewCycle = {
  id: "rc1", name: "H1 2026 Annual Review", type: "Annual", period: "Jan 15 – Mar 31, 2026",
  status: "in_progress",
  phases: [
    { name: "Self-Review", status: "done", completion: 98 },
    { name: "Peer Feedback", status: "done", completion: 89 },
    { name: "Manager Review", status: "active", completion: 68 },
    { name: "Calibration", status: "pending", completion: null },
    { name: "Delivery", status: "pending", completion: null },
  ],
  totalReviews: 142, completed: 96, pending: 46, overdueManagers: 3,
  dueDate: "Mar 25", aiInsight: "23 review drafts generated. 8 flagged for potential recency bias. 4 ratings significantly deviate from peer feedback consensus.",
};

export const PAST_CYCLES: { id: string; name: string; type: string; period: string; status: string }[] = [
  { id: "rc2", name: "Q4 2025 Quarterly", type: "Quarterly", period: "Oct – Dec 2025", status: "completed" },
  { id: "rc3", name: "H2 2025 Annual", type: "Annual", period: "Jul – Dec 2025", status: "completed" },
  { id: "rc4", name: "Q3 2025 Pulse", type: "Pulse", period: "Jul – Sep 2025", status: "completed" },
  { id: "rc5", name: "H2 2026 Annual", type: "Annual", period: "Jul – Dec 2026", status: "draft" },
];

/* ── Feedback ── */

export interface FeedbackItem {
  id: string;
  type: "recognition" | "development" | "milestone" | "coaching" | "shoutout";
  sender: string;
  recipient: string;
  content: string;
  skills: string[];
  value?: string;
  visibility: "public" | "team" | "private";
  reactions: number;
  comments: number;
  date: string;
  aiMapping: string;
}

export const FEEDBACK_TYPE_CONFIG: Record<string, { icon: string; label: string; colorClass: string; bgClass: string }> = {
  recognition: { icon: "🌟", label: "Recognition", colorClass: "text-success", bgClass: "bg-success/10" },
  development: { icon: "📝", label: "Development", colorClass: "text-warning", bgClass: "bg-warning/10" },
  milestone:   { icon: "🎯", label: "Goal Milestone", colorClass: "text-brand", bgClass: "bg-brand/10" },
  coaching:    { icon: "💡", label: "Coaching Note", colorClass: "text-brand-purple", bgClass: "bg-brand-purple/10" },
  shoutout:    { icon: "⚡", label: "Peer Shoutout", colorClass: "text-brand-teal", bgClass: "bg-brand-teal/10" },
};

export const FEEDBACK_ITEMS: FeedbackItem[] = [
  { id: "f1", type: "recognition", sender: "Prashant Singh", recipient: "Sarah Chen", content: "Sarah's architecture for the new API gateway was outstanding. She considered edge cases that saved us weeks of debugging later.", skills: ["System Design", "Technical Leadership"], value: "Engineering Excellence", visibility: "public", reactions: 12, comments: 3, date: "Mar 23", aiMapping: "H1 2026 → Technical (4.2)" },
  { id: "f2", type: "development", sender: "Arjun Mehta", recipient: "Raj Krishnamurthy", content: "Raj's standup updates could be more concise. Sometimes technical details dominate and the business impact gets lost.", skills: ["Communication"], visibility: "private", reactions: 0, comments: 1, date: "Mar 20", aiMapping: "H1 2026 → Communication" },
  { id: "f3", type: "milestone", sender: "System", recipient: "Priya Sharma", content: "Completed Key Result: Launch customer onboarding v2 with 95% satisfaction score (target: 90%)", skills: ["Delivery", "Product Thinking"], visibility: "public", reactions: 8, comments: 2, date: "Mar 18", aiMapping: "Auto → Exceeds for KR delivery" },
  { id: "f4", type: "coaching", sender: "Prashant Singh", recipient: "Sarah Chen", content: "Discussed IC4 promotion path. Sarah is ready for TL5 responsibilities. Need to close communication and leadership gaps.", skills: ["Leadership", "Communication"], visibility: "private", reactions: 0, comments: 0, date: "Mar 15", aiMapping: "H1 2026 → Leadership, Communication" },
  { id: "f5", type: "shoutout", sender: "Lisa Wang", recipient: "Tom Liu", content: "Tom jumped in to help debug a critical production issue over the weekend. Saved us from a P0 outage. True team player!", skills: ["Problem Solving", "Collaboration"], visibility: "public", reactions: 15, comments: 4, date: "Mar 12", aiMapping: "H1 2026 → Problem Solving, Collaboration" },
  { id: "f6", type: "recognition", sender: "Meera Patel", recipient: "Ana Ruiz", content: "Ana's quarterly business review presentation to the board was exceptional. Clear storytelling with data that drove real decisions.", skills: ["Communication", "Data Analysis"], value: "Customer Focus", visibility: "public", reactions: 9, comments: 2, date: "Mar 10", aiMapping: "H1 2026 → Communication (4.0)" },
];

/* ── Goals ── */

export interface Goal {
  id: string;
  title: string;
  owner: string;
  alignsTo: string | null;
  status: "completed" | "on_track" | "at_risk" | "off_track" | "not_started";
  progress: number;
  dueDate: string;
  completedDate?: string;
  keyResults: { text: string; done: boolean; progress?: string }[];
  benchmarkNote?: string;
  aiNote?: string;
  reviewImpact?: string;
}

export const GOAL_STATUS_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string; icon: string }> = {
  completed:   { label: "Completed", colorClass: "text-success", bgClass: "bg-success/10", icon: "✓" },
  on_track:    { label: "On Track", colorClass: "text-brand", bgClass: "bg-brand/10", icon: "●" },
  at_risk:     { label: "At Risk", colorClass: "text-warning", bgClass: "bg-warning/10", icon: "⚠" },
  off_track:   { label: "Off Track", colorClass: "text-destructive", bgClass: "bg-destructive/10", icon: "✗" },
  not_started: { label: "Not Started", colorClass: "text-muted-foreground", bgClass: "bg-secondary", icon: "◐" },
};

export const MY_GOALS: Goal[] = [
  { id: "g1", title: "Launch API Gateway v2", owner: "Sarah Chen", alignsTo: "Ship v2.0 features", status: "completed", progress: 100, dueDate: "Mar 15", completedDate: "Mar 13", keyResults: [{ text: "Design doc approved", done: true }, { text: "Implementation complete", done: true }, { text: "Load testing passes 10K RPS", done: true }, { text: "Zero P0 bugs in first week", done: true }], reviewImpact: "+0.4 to Technical competency", benchmarkNote: "Top 10% completion speed for IC3" },
  { id: "g2", title: "Improve code review turnaround", owner: "Sarah Chen", alignsTo: "Engineering Excellence", status: "on_track", progress: 72, dueDate: "Mar 31", keyResults: [{ text: "Average review time <4 hours", done: true, progress: "3.2h achieved" }, { text: "Review 50 PRs this quarter", done: false, progress: "38/50 (76%)" }, { text: "Mentor 2 junior devs on review quality", done: true }], benchmarkNote: "85th percentile vs team avg (4.8h)" },
  { id: "g3", title: "Present at internal tech talk", owner: "Sarah Chen", alignsTo: "Thought Leadership", status: "at_risk", progress: 20, dueDate: "Mar 31", keyResults: [{ text: "Topic approved", done: true }, { text: "Slides drafted", done: false }, { text: "Talk delivered", done: false }], aiNote: "This goal is at risk with 6 days left. Consider rescheduling to Q2 or adjusting scope.", benchmarkNote: "30% of IC3s complete a talk per quarter" },
  { id: "g4", title: "Reduce technical debt in auth module", owner: "Sarah Chen", alignsTo: "Ship v2.0 features", status: "on_track", progress: 65, dueDate: "Mar 31", keyResults: [{ text: "Audit complete", done: true }, { text: "Refactor critical paths", done: false, progress: "4/6 paths done" }, { text: "Test coverage >90%", done: false, progress: "82% current" }] },
];

export const COMPANY_GOALS = [
  { id: "cg1", title: "Achieve $10M ARR", owner: "Prashant Singh", progress: 78, children: [
    { title: "Close $4M new business", owner: "Sales", progress: 82 },
    { title: "Ship v2.0 features", owner: "Product", progress: 70 },
    { title: "Reduce churn to <3%", owner: "CS", progress: 65 },
  ]},
  { id: "cg2", title: "Scale Engineering Team to 50", owner: "Arjun Mehta", progress: 60, children: [
    { title: "Hire 12 engineers in Q1", owner: "Talent", progress: 75 },
    { title: "Reduce onboarding time to 2 weeks", owner: "Engineering", progress: 50 },
  ]},
];

/* ── Calibration ── */

export const NINE_BOX_DATA = [
  { box: "star", label: "Star", perf: "high", pot: "high", count: 5, employees: ["Sarah Chen", "Tom Liu", "Ana Ruiz", "Priya Sharma", "Mike Johnson"] },
  { box: "growth_star", label: "Growth Star", perf: "medium", pot: "high", count: 8, employees: ["Raj K.", "Emma W.", "David K.", "Lisa W.", "Alex R.", "Sam W.", "Yuki T.", "Fatima H."] },
  { box: "enigma", label: "Enigma", perf: "low", pot: "high", count: 3, employees: ["Jake P.", "Nina T.", "Chris M."] },
  { box: "high_perf", label: "High Performer", perf: "high", pot: "medium", count: 8, employees: ["Maria G.", "Arjun M.", "Meera P.", "Nisha R.", "Kavitha M.", "Amit V.", "Neha G.", "Anil S."] },
  { box: "core_player", label: "Core Player", perf: "medium", pot: "medium", count: 12, employees: ["12 employees"] },
  { box: "risk", label: "Risk", perf: "low", pot: "medium", count: 2, employees: ["2 employees"] },
  { box: "expert", label: "Expert", perf: "high", pot: "low", count: 1, employees: ["1 employee"] },
  { box: "effective", label: "Effective", perf: "medium", pot: "low", count: 2, employees: ["2 employees"] },
  { box: "action", label: "Action Required", perf: "low", pot: "low", count: 1, employees: ["1 employee"] },
];

export const RATING_DISTRIBUTION = [
  { rating: "Exceptional", count: 11, pct: 8, target: "5-10%", ok: true },
  { rating: "Exceeds", count: 40, pct: 28, target: "15-25%", ok: false },
  { rating: "Meets", count: 60, pct: 42, target: "50-60%", ok: false },
  { rating: "Developing", count: 23, pct: 16, target: "10-20%", ok: true },
  { rating: "Below", count: 8, pct: 6, target: "2-5%", ok: false },
];

export const RATING_COLORS: Record<string, string> = {
  Exceptional: "bg-success",
  Exceeds: "bg-brand",
  Meets: "bg-warning",
  Developing: "bg-[#F97316]",
  Below: "bg-destructive",
};

export const CALIBRATION_SESSIONS = [
  { id: "cs1", name: "Engineering Calibration", status: "scheduled", date: "Mar 28, 2026 · 2:00 PM", duration: "90 min", facilitator: "Prashant Singh", participants: "Arjun, David, Lisa", scope: "28 IC engineers", aiPreBrief: "5 rating anomalies detected. 2 cross-team comparisons flagged." },
  { id: "cs2", name: "Company-Wide Calibration", status: "completed", date: "Mar 15, 2026", duration: "—", facilitator: "Prashant Singh", participants: "All managers", scope: "142 employees", aiPreBrief: "Results: 12 ratings adjusted" },
];

/* ── 1:1 Meetings ── */

export interface OneOnOne {
  id: string;
  person: string;
  role: string;
  date: string;
  time: string;
  recurring: string;
  duration: string;
  talkingPoints: string[];
  actionItems: { text: string; done: boolean; overdue?: boolean }[];
}

export const UPCOMING_ONE_ON_ONES: OneOnOne[] = [
  { id: "oo1", person: "Sarah Chen", role: "Senior Software Engineer", date: "Tomorrow", time: "10:00 AM", recurring: "Weekly (Thu)", duration: "30 min", talkingPoints: ["🎯 Q1 goals: 'Tech talk' goal at risk (20%)", "🌟 Recognition from Arjun re: API gateway", "📊 Review cycle: manager review due in 5 days", "📈 Benchmark: performing at IC4 in 4/6 comps"], actionItems: [{ text: "Submit code review guidelines doc", done: true }, { text: "Draft tech talk abstract", done: false, overdue: true }] },
  { id: "oo2", person: "Raj Krishnamurthy", role: "Software Engineer", date: "Friday", time: "2:00 PM", recurring: "Bi-weekly (Fri)", duration: "45 min", talkingPoints: ["📝 Dev feedback from Arjun re: standup clarity", "🎯 Performance module goal at 45% (on track)", "💡 Coaching opportunity: cross-team comms"], actionItems: [{ text: "Share standup best practices doc", done: false }] },
  { id: "oo3", person: "Tom Liu", role: "Software Engineer", date: "Next Monday", time: "11:00 AM", recurring: "Weekly (Mon)", duration: "30 min", talkingPoints: ["🌟 Weekend P0 save — recognition", "🎯 IC3 promotion readiness at 88%", "📊 Q1 goal completion review"], actionItems: [] },
];

/* ── Performance Analytics ── */

export const PERF_ANALYTICS_KPIS = [
  { label: "Avg Performance", value: "3.4", trend: "+0.2 vs H2", positive: true },
  { label: "Goal Completion", value: "74%", trend: "+4% vs Q3", positive: true },
  { label: "Review Completion", value: "68%", trend: "In progress", positive: true },
  { label: "Feedback/Month", value: "2.3", trend: "+28% vs industry", positive: true },
  { label: "Promotion Rate", value: "12%", trend: "-3% vs industry", positive: false },
  { label: "Top Talent Retention", value: "92%", trend: "+7% vs industry", positive: true },
];

export const PERF_BY_DEPT = [
  { dept: "Engineering", avg: 3.5, headcount: 48 },
  { dept: "Sales", avg: 3.6, headcount: 28 },
  { dept: "Product", avg: 3.4, headcount: 18 },
  { dept: "Design", avg: 3.3, headcount: 12 },
  { dept: "Marketing", avg: 3.7, headcount: 14 },
  { dept: "HR", avg: 3.4, headcount: 8 },
];

export const PROMOTION_READINESS = [
  { name: "Sarah Chen", current: "IC3", next: "IC4", readiness: 72, signal: "Strong" },
  { name: "Raj Krishnamurthy", current: "IC3", next: "IC4", readiness: 45, signal: "Growing" },
  { name: "Tom Liu", current: "IC2", next: "IC3", readiness: 88, signal: "Ready" },
  { name: "Ana Ruiz", current: "IC4", next: "IC5", readiness: 61, signal: "Growing" },
  { name: "Jake Peters", current: "M2", next: "M3", readiness: 35, signal: "Early" },
];

export const MARKET_BENCHMARKS = [
  { metric: "Avg Performance", ours: "3.4", industry: "3.2", delta: "+0.2", ok: true },
  { metric: "Promotion Rate", ours: "12%", industry: "15%", delta: "-3%", ok: false },
  { metric: "Time-to-Promote", ours: "18 mo", industry: "14 mo", delta: "+4 mo", ok: false },
  { metric: "Top Performer Retention", ours: "92%", industry: "85%", delta: "+7%", ok: true },
  { metric: "Goal Completion", ours: "74%", industry: "70%", delta: "+4%", ok: true },
  { metric: "Feedback Frequency", ours: "2.3/mo", industry: "1.8/mo", delta: "+28%", ok: true },
];

/* ── Helpers ── */

export function goalProgressColor(progress: number): string {
  if (progress >= 70) return "bg-success";
  if (progress >= 40) return "bg-warning";
  return "bg-destructive";
}

export function readinessColor(pct: number): string {
  if (pct >= 80) return "text-success";
  if (pct >= 60) return "text-brand";
  if (pct >= 40) return "text-warning";
  return "text-destructive";
}

export function readinessBgColor(pct: number): string {
  if (pct >= 80) return "bg-success";
  if (pct >= 60) return "bg-brand";
  if (pct >= 40) return "bg-warning";
  return "bg-destructive";
}
