/* ================================================================
   O2S Onboarding Hub — Types & Mock Data
   ================================================================ */

export type OnboardingTab = "active" | "preboarding" | "timeline" | "tasks" | "surveys" | "analytics";

export const ONBOARDING_TABS: { key: OnboardingTab; label: string; count?: number }[] = [
  { key: "active", label: "Active Journeys", count: 8 },
  { key: "preboarding", label: "Pre-boarding", count: 3 },
  { key: "timeline", label: "Timeline" },
  { key: "tasks", label: "Tasks & Checklists" },
  { key: "surveys", label: "Pulse Surveys" },
  { key: "analytics", label: "Analytics" },
];

/* ── Phase Config ── */

export type Phase = "preboarding" | "day1" | "week1" | "month1" | "month2" | "month3" | "graduated";

export const PHASE_CONFIG: Record<Phase, { label: string; colorClass: string; bgClass: string }> = {
  preboarding: { label: "Pre-boarding", colorClass: "text-info", bgClass: "bg-info" },
  day1: { label: "Day 1", colorClass: "text-brand", bgClass: "bg-brand" },
  week1: { label: "Week 1", colorClass: "text-brand-purple", bgClass: "bg-brand-purple" },
  month1: { label: "Month 1", colorClass: "text-brand-teal", bgClass: "bg-brand-teal" },
  month2: { label: "Month 2", colorClass: "text-warning", bgClass: "bg-warning" },
  month3: { label: "Month 3", colorClass: "text-success", bgClass: "bg-success" },
  graduated: { label: "Graduated", colorClass: "text-success", bgClass: "bg-success" },
};

/* ── New Hires ── */

export interface NewHire {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  location: string;
  manager: string;
  buddy: string | null;
  startDate: string;
  phase: Phase;
  dayNumber: number | null;
  progress: number;
  tasksCompleted: number;
  tasksTotal: number;
  aiTasksCompleted: number;
  pulseScore: number | null;
  atRisk: boolean;
}

export const NEW_HIRES: NewHire[] = [
  // Pre-boarding
  { id: "nh1", name: "Liam Chen", initials: "LC", role: "Sr. Frontend Engineer", department: "Engineering", location: "San Francisco", manager: "Sophia Lee", buddy: null, startDate: "Apr 1", phase: "preboarding", dayNumber: null, progress: 12, tasksCompleted: 2, tasksTotal: 18, aiTasksCompleted: 3, pulseScore: null, atRisk: false },
  { id: "nh2", name: "Mia Foster", initials: "MF", role: "UX Designer", department: "Design", location: "Remote", manager: "Ryan Martinez", buddy: null, startDate: "Apr 7", phase: "preboarding", dayNumber: null, progress: 8, tasksCompleted: 1, tasksTotal: 16, aiTasksCompleted: 1, pulseScore: null, atRisk: false },
  { id: "nh3", name: "Ethan Woods", initials: "EW", role: "Backend Engineer", department: "Engineering", location: "San Francisco", manager: "Sophia Lee", buddy: null, startDate: "Apr 14", phase: "preboarding", dayNumber: null, progress: 5, tasksCompleted: 1, tasksTotal: 18, aiTasksCompleted: 1, pulseScore: null, atRisk: false },
  // Day 1
  { id: "nh4", name: "Priya Shah", initials: "PS", role: "Product Manager", department: "Product", location: "San Francisco", manager: "Alex Rivera", buddy: "Jordan Park", startDate: "Mar 25", phase: "day1", dayNumber: 1, progress: 45, tasksCompleted: 8, tasksTotal: 18, aiTasksCompleted: 5, pulseScore: null, atRisk: false },
  // Week 1
  { id: "nh5", name: "Carlos Ruiz", initials: "CR", role: "DevOps Engineer", department: "Engineering", location: "San Francisco", manager: "Sophia Lee", buddy: "Sarah Chen", startDate: "Mar 22", phase: "week1", dayNumber: 3, progress: 72, tasksCompleted: 13, tasksTotal: 18, aiTasksCompleted: 5, pulseScore: null, atRisk: false },
  { id: "nh6", name: "Noah Baker", initials: "NB", role: "Data Scientist", department: "Analytics", location: "Remote", manager: "David Kim", buddy: "Raj Green", startDate: "Mar 20", phase: "week1", dayNumber: 5, progress: 68, tasksCompleted: 11, tasksTotal: 16, aiTasksCompleted: 4, pulseScore: null, atRisk: false },
  // Month 1
  { id: "nh7", name: "Ava Kim", initials: "AK", role: "Sales Rep", department: "Sales", location: "New York", manager: "Lisa Wang", buddy: "Maria Patel", startDate: "Mar 7", phase: "month1", dayNumber: 18, progress: 85, tasksCompleted: 15, tasksTotal: 18, aiTasksCompleted: 6, pulseScore: 4.2, atRisk: false },
  { id: "nh8", name: "Zara Ali", initials: "ZA", role: "Marketing Manager", department: "Marketing", location: "London", manager: "Nina Kowalski", buddy: "Tom Liu", startDate: "Mar 1", phase: "month1", dayNumber: 25, progress: 78, tasksCompleted: 14, tasksTotal: 20, aiTasksCompleted: 5, pulseScore: 2.8, atRisk: true },
  { id: "nh9", name: "Isla Park", initials: "IP", role: "HR Coordinator", department: "People & HR", location: "San Francisco", manager: "Alex Rivera", buddy: "Meera Patel", startDate: "Feb 25", phase: "month1", dayNumber: 30, progress: 90, tasksCompleted: 18, tasksTotal: 20, aiTasksCompleted: 7, pulseScore: 4.5, atRisk: false },
];

/* ── Pre-boarding Tasks ── */

export interface PreboardingTask {
  text: string;
  done: boolean;
  date: string | null;
  assignee: "auto" | "agent" | "scheduled" | "manual";
}

export const PREBOARDING_TASKS: Record<string, PreboardingTask[]> = {
  nh1: [
    { text: "Offer letter signed", done: true, date: "Mar 15", assignee: "auto" },
    { text: "Background check cleared", done: true, date: "Mar 18", assignee: "auto" },
    { text: "Welcome email sent", done: true, date: "Mar 20", assignee: "agent" },
    { text: "Laptop ordered (MacBook Pro 16\")", done: true, date: "Mar 20", assignee: "agent" },
    { text: "Google Workspace account created", done: false, date: null, assignee: "scheduled" },
    { text: "GitHub org invite sent", done: false, date: null, assignee: "scheduled" },
    { text: "Slack channels joined", done: false, date: null, assignee: "scheduled" },
    { text: "Buddy assigned", done: false, date: null, assignee: "manual" },
    { text: "Day 1 calendar event created", done: false, date: null, assignee: "scheduled" },
    { text: "Pre-read materials sent", done: false, date: null, assignee: "scheduled" },
  ],
};

/* ── Overdue Tasks ── */

export interface TaskItem {
  id: string;
  text: string;
  newHire: string;
  phase: string;
  dueDate: string;
  overdueDays?: number;
  assignee: string;
  type: "overdue" | "today" | "week" | "upcoming" | "ai_scheduled";
}

export const ALL_TASKS: TaskItem[] = [
  { id: "t1", text: "Complete HR compliance modules", newHire: "Carlos Ruiz", phase: "Week 1", dueDate: "Mar 26", overdueDays: 1, assignee: "Carlos", type: "overdue" },
  { id: "t2", text: "Submit I-9 documentation", newHire: "Zara Ali", phase: "Month 1", dueDate: "Mar 23", overdueDays: 2, assignee: "Zara", type: "overdue" },
  { id: "t3", text: "Complete benefits enrollment", newHire: "Zara Ali", phase: "Month 1", dueDate: "Mar 24", overdueDays: 1, assignee: "Zara", type: "overdue" },
  { id: "t4", text: "First 1:1 with buddy", newHire: "Noah Baker", phase: "Week 1", dueDate: "Today", assignee: "Sarah Chen", type: "today" },
  { id: "t5", text: "Review team documentation", newHire: "Carlos Ruiz", phase: "Week 1", dueDate: "Today", assignee: "Carlos", type: "today" },
  { id: "t6", text: "7-day pulse survey", newHire: "Carlos Ruiz", phase: "Week 1", dueDate: "Mar 29", assignee: "Agent", type: "week" },
  { id: "t7", text: "Complete dev environment walkthrough", newHire: "Noah Baker", phase: "Week 1", dueDate: "Mar 27", assignee: "Noah", type: "week" },
  { id: "t8", text: "First PR submitted", newHire: "Carlos Ruiz", phase: "Week 1", dueDate: "Mar 28", assignee: "Carlos", type: "week" },
  { id: "t9", text: "Create Google Workspace account", newHire: "Liam Chen", phase: "Pre-board", dueDate: "Mar 30", assignee: "Agent", type: "ai_scheduled" },
  { id: "t10", text: "Send Slack invites", newHire: "Liam Chen", phase: "Pre-board", dueDate: "Mar 30", assignee: "Agent", type: "ai_scheduled" },
  { id: "t11", text: "Create Day 1 calendar event", newHire: "Liam Chen", phase: "Pre-board", dueDate: "Mar 29", assignee: "Agent", type: "ai_scheduled" },
  { id: "t12", text: "Send pre-read materials", newHire: "Mia Foster", phase: "Pre-board", dueDate: "Apr 2", assignee: "Agent", type: "ai_scheduled" },
];

/* ── Survey Data ── */

export interface SurveyResponse {
  id: string;
  name: string;
  role: string;
  surveyType: string;
  date: string;
  overall: number;
  manager: number;
  clarity: number;
  belonging: number;
  comment: string;
  aiAction: string;
  atRisk: boolean;
}

export const SURVEY_RESPONSES: SurveyResponse[] = [
  { id: "s1", name: "Ava Kim", role: "Sales Rep", surveyType: "Day 30", date: "Mar 22", overall: 4.2, manager: 4.5, clarity: 3.8, belonging: 4.0, comment: "Great onboarding but wish there was more product training specific to enterprise sales.", aiAction: "Flagged to Alex Rivera. Recommending additional sales enablement session.", atRisk: false },
  { id: "s2", name: "Zara Ali", role: "Marketing Manager", surveyType: "Day 30", date: "Mar 22", overall: 2.8, manager: 3.0, clarity: 2.5, belonging: 3.0, comment: "Feeling unclear about priorities and lacking context on current campaigns.", aiAction: "LOW SCORE — Flagged Zara as At Risk. Scheduled urgent check-in with Nina Kowalski (manager).", atRisk: true },
  { id: "s3", name: "Isla Park", role: "HR Coordinator", surveyType: "Day 30", date: "Mar 22", overall: 4.5, manager: 4.8, clarity: 4.2, belonging: 4.5, comment: "Loving the team and the tools. Buddy program was incredibly helpful.", aiAction: "", atRisk: false },
];

export const AGGREGATE_SCORES = [
  { dimension: "Overall Satisfaction", score: 4.1, trend: 0.2 },
  { dimension: "Manager Support", score: 4.3, trend: 0.1 },
  { dimension: "Role Clarity", score: 3.8, trend: -0.1 },
  { dimension: "Team Belonging", score: 4.0, trend: 0.0 },
  { dimension: "Tool & Resource Access", score: 4.4, trend: 0.3 },
  { dimension: "Training Quality", score: 3.9, trend: 0.1 },
];

/* ── Analytics KPIs ── */

export const ANALYTICS_KPIS = [
  { label: "Avg. Time to Ramp", value: "42 days", trend: "-3 days vs last Q", positive: true },
  { label: "Completion Rate", value: "89%", trend: "+4% vs last Q", positive: true },
  { label: "Satisfaction Score", value: "4.1/5", trend: "+0.2 vs last Q", positive: true },
  { label: "90-Day Retention", value: "96%", trend: "+2% vs last Q", positive: true },
];

export const RAMP_BY_DEPT = [
  { dept: "Engineering", days: 48 },
  { dept: "Product", days: 38 },
  { dept: "Sales", days: 52 },
  { dept: "Marketing", days: 36 },
  { dept: "People & HR", days: 32 },
  { dept: "Design", days: 35 },
];

export const TASK_BREAKDOWN = [
  { type: "AI Auto-completed", pct: 38, count: 144, colorClass: "bg-brand-teal" },
  { type: "Employee completed", pct: 35, count: 133, colorClass: "bg-brand" },
  { type: "Manager completed", pct: 15, count: 57, colorClass: "bg-brand-purple" },
  { type: "Buddy completed", pct: 8, count: 30, colorClass: "bg-warning" },
  { type: "Overdue/Skipped", pct: 4, count: 15, colorClass: "bg-destructive" },
];

/* ── Stats ── */

export const STATS = {
  active: NEW_HIRES.filter((h) => h.phase !== "preboarding" && h.phase !== "graduated").length,
  preboarding: NEW_HIRES.filter((h) => h.phase === "preboarding").length,
  completedQ1: 24,
  atRisk: NEW_HIRES.filter((h) => h.atRisk).length,
  avgRamp: 42,
};

/* ── Helpers ── */

export function pulseEmoji(score: number | null): string {
  if (score === null) return "—";
  if (score >= 4.0) return "😊";
  if (score >= 3.0) return "😐";
  return "😟";
}

export function pulseColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 4.0) return "text-success";
  if (score >= 3.0) return "text-warning";
  return "text-destructive";
}

export function progressColor(phase: Phase): string {
  return PHASE_CONFIG[phase]?.bgClass ?? "bg-brand";
}
