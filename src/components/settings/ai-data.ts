/* ================================================================
   O2S Settings / AI & Agents — Types, Mock Data & Helpers
   ================================================================ */

/* ── Types ── */

export type AgentStatus = "active" | "idle" | "paused" | "error" | "disabled";
export type AutonomyLevel = "full" | "supervised" | "approval" | "manual";

export interface AgentPerformance {
  [key: string]: number;
}

export interface Agent {
  id: string;
  name: string;
  abbr: string;
  description: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  status: AgentStatus;
  enabled: boolean;
  autonomyLevel: AutonomyLevel;
  comingSoon?: boolean;
  lastAction: { time: string; description: string };
  metrics: { label: string; value: string }[];
  activitySparkline: number[];
  actionsThisMonth: number;
}

export interface AgentLogEntry {
  id: string;
  agentId: string;
  agentAbbr: string;
  agentColorClass: string;
  timestamp: string;
  action: string;
  detail: string;
  confidence: number | null;
  status: "auto" | "completed" | "review" | "pending" | "error" | "in_progress" | "alert";
}

/* ── Agent Status Config ── */

export const STATUS_CONFIG: Record<AgentStatus, { label: string; dotClass: string; textClass: string }> = {
  active:   { label: "Active",   dotClass: "bg-success",          textClass: "text-success" },
  idle:     { label: "Idle",     dotClass: "bg-muted-foreground", textClass: "text-muted-foreground" },
  paused:   { label: "Paused",   dotClass: "bg-warning",          textClass: "text-warning" },
  error:    { label: "Error",    dotClass: "bg-destructive",      textClass: "text-destructive" },
  disabled: { label: "Disabled", dotClass: "bg-muted-foreground/40", textClass: "text-muted-foreground/40" },
};

export const AUTONOMY_LEVELS: { key: AutonomyLevel; label: string; shortLabel: string; description: string; colorClass: string }[] = [
  { key: "full",       label: "Full Auto",         shortLabel: "Full",     description: "Agent acts independently. Decisions executed immediately.", colorClass: "bg-success text-success" },
  { key: "supervised", label: "Supervised",         shortLabel: "Supvd",    description: "Agent acts, human reviews within 24h. Actions can be undone.", colorClass: "bg-brand text-brand" },
  { key: "approval",   label: "Approval Required",  shortLabel: "Apprvl",   description: "Agent recommends, waits for human approval before acting.", colorClass: "bg-warning text-warning" },
  { key: "manual",     label: "Manual / Assist",    shortLabel: "Manual",   description: "Agent only responds when asked. No proactive actions.", colorClass: "bg-muted-foreground text-muted-foreground" },
];

/* ── Mock Agents ── */

export const AGENTS: Agent[] = [
  {
    id: "recruiter", name: "Recruiter Agent", abbr: "Rec",
    description: "Screens candidates, sources talent, generates interview questions, and optimizes job descriptions.",
    colorClass: "text-brand-purple", bgClass: "bg-brand-purple", borderClass: "border-brand-purple",
    status: "active", enabled: true, autonomyLevel: "approval",
    lastAction: { time: "3 min ago", description: "Screened 4 applications for Sr Frontend Engineer" },
    metrics: [{ label: "Screened", value: "1,847" }, { label: "Accuracy", value: "91%" }, { label: "Hrs Saved", value: "~45" }],
    activitySparkline: [380, 420, 510, 460, 580, 620, 540],
    actionsThisMonth: 4120,
  },
  {
    id: "compliance", name: "Compliance Agent", abbr: "Cmp",
    description: "Runs bias audits, monitors adverse impact, ensures regulatory compliance, and flags risks.",
    colorClass: "text-destructive", bgClass: "bg-destructive", borderClass: "border-destructive",
    status: "active", enabled: true, autonomyLevel: "supervised",
    lastAction: { time: "22 min ago", description: "Completed bias audit for Sr Frontend pipeline" },
    metrics: [{ label: "Audits", value: "12" }, { label: "Violations", value: "0" }, { label: "Hrs Saved", value: "~18" }],
    activitySparkline: [90, 110, 120, 100, 130, 140, 110],
    actionsThisMonth: 824,
  },
  {
    id: "analytics", name: "Analytics Agent", abbr: "Ana",
    description: "Generates reports, detects anomalies, surfaces insights, and benchmarks performance.",
    colorClass: "text-brand", bgClass: "bg-brand", borderClass: "border-brand",
    status: "active", enabled: true, autonomyLevel: "full",
    lastAction: { time: "1 hr ago", description: "Generated weekly pipeline health report" },
    metrics: [{ label: "Reports", value: "48" }, { label: "Anomalies", value: "23" }, { label: "Hrs Saved", value: "~62" }],
    activitySparkline: [200, 230, 210, 250, 240, 270, 260],
    actionsThisMonth: 1648,
  },
  {
    id: "onboarding", name: "Onboarding Agent", abbr: "Onb",
    description: "Creates onboarding checklists, provisions IT access, assigns buddies, sends welcome emails.",
    colorClass: "text-brand-teal", bgClass: "bg-brand-teal", borderClass: "border-brand-teal",
    status: "active", enabled: true, autonomyLevel: "supervised",
    lastAction: { time: "2 hrs ago", description: "Created Day 1 checklist for Maya Chen" },
    metrics: [{ label: "Checklists", value: "18" }, { label: "IT Prov.", value: "12" }, { label: "Hrs Saved", value: "~24" }],
    activitySparkline: [180, 200, 220, 210, 250, 230, 260],
    actionsThisMonth: 1648,
  },
  {
    id: "performance", name: "Performance Agent", abbr: "Prf",
    description: "Facilitates performance reviews, tracks goals, generates 360 feedback, identifies growth paths.",
    colorClass: "text-warning", bgClass: "bg-warning", borderClass: "border-warning",
    status: "disabled", enabled: false, autonomyLevel: "manual", comingSoon: true,
    lastAction: { time: "—", description: "Not yet activated" },
    metrics: [{ label: "Reviews", value: "—" }, { label: "Goals", value: "—" }, { label: "Hrs Saved", value: "—" }],
    activitySparkline: [0, 0, 0, 0, 0, 0, 0],
    actionsThisMonth: 0,
  },
  {
    id: "policy", name: "Policy Agent", abbr: "Pol",
    description: "Answers HR policy questions, maintains knowledge base, auto-responds to employee queries.",
    colorClass: "text-info", bgClass: "bg-info", borderClass: "border-info",
    status: "disabled", enabled: false, autonomyLevel: "manual", comingSoon: true,
    lastAction: { time: "—", description: "Not yet activated" },
    metrics: [{ label: "Queries", value: "—" }, { label: "KB Articles", value: "—" }, { label: "Hrs Saved", value: "—" }],
    activitySparkline: [0, 0, 0, 0, 0, 0, 0],
    actionsThisMonth: 0,
  },
  {
    id: "orchestrator", name: "Orchestrator Agent", abbr: "Orc",
    description: "Coordinates between agents, routes tasks, manages priorities, handles escalations.",
    colorClass: "text-success", bgClass: "bg-success", borderClass: "border-success",
    status: "active", enabled: true, autonomyLevel: "full",
    lastAction: { time: "15 min ago", description: "Routed interview scheduling to Sarah Kim" },
    metrics: [{ label: "Routings", value: "342" }, { label: "SLA", value: "98.5%" }, { label: "Escalations", value: "12" }],
    activitySparkline: [40, 52, 48, 55, 50, 60, 58],
    actionsThisMonth: 342,
  },
];

/* ── Activity Log ── */

export const ACTIVITY_LOG: AgentLogEntry[] = [
  { id: "l1", agentId: "recruiter", agentAbbr: "R", agentColorClass: "bg-brand-purple", timestamp: "11:42 AM", action: "Screened Priya Sharma (92)", detail: "Result: Advanced to Screened — Strong Hire", confidence: 92, status: "auto" },
  { id: "l2", agentId: "recruiter", agentAbbr: "R", agentColorClass: "bg-brand-purple", timestamp: "11:41 AM", action: "Screened Raj Patel (45)", detail: "Result: Held for manual review", confidence: 45, status: "review" },
  { id: "l3", agentId: "recruiter", agentAbbr: "R", agentColorClass: "bg-brand-purple", timestamp: "11:40 AM", action: "Screened Emma Watson (28)", detail: "Result: Auto-archived", confidence: 28, status: "auto" },
  { id: "l4", agentId: "analytics", agentAbbr: "A", agentColorClass: "bg-brand", timestamp: "11:30 AM", action: "Generated weekly pipeline report", detail: "Sent to prashant@latentbridge.com", confidence: null, status: "completed" },
  { id: "l5", agentId: "onboarding", agentAbbr: "O", agentColorClass: "bg-brand-teal", timestamp: "11:15 AM", action: "Created onboarding checklist: Maya Chen", detail: "Standard template, 18 items", confidence: 88, status: "completed" },
  { id: "l6", agentId: "compliance", agentAbbr: "C", agentColorClass: "bg-destructive", timestamp: "11:00 AM", action: "Bias audit: Sr Frontend Eng pipeline", detail: "No adverse impact detected. All clear.", confidence: null, status: "completed" },
  { id: "l7", agentId: "recruiter", agentAbbr: "R", agentColorClass: "bg-brand-purple", timestamp: "10:45 AM", action: "Sourced 8 candidates for VP Engineering", detail: "LinkedIn: 5, GitHub: 3", confidence: 76, status: "completed" },
  { id: "l8", agentId: "orchestrator", agentAbbr: "Or", agentColorClass: "bg-success", timestamp: "10:30 AM", action: "Routed interview scheduling to Sarah Kim", detail: "3 interviews for this week", confidence: 94, status: "completed" },
  { id: "l9", agentId: "recruiter", agentAbbr: "R", agentColorClass: "bg-brand-purple", timestamp: "10:15 AM", action: "FAILED: Outreach to David Kim", detail: "Error: LinkedIn API rate limit exceeded", confidence: null, status: "error" },
  { id: "l10", agentId: "analytics", agentAbbr: "A", agentColorClass: "bg-brand", timestamp: "9:00 AM", action: "Anomaly: Interview no-show rate +15%", detail: "Flagged for admin review", confidence: 78, status: "alert" },
  { id: "l11", agentId: "recruiter", agentAbbr: "R", agentColorClass: "bg-brand-purple", timestamp: "9:00 AM", action: "Daily batch: Screened 12 new applications", detail: "Sr Frontend: 4, Backend: 5, Designer: 3", confidence: null, status: "completed" },
  { id: "l12", agentId: "recruiter", agentAbbr: "R", agentColorClass: "bg-brand-purple", timestamp: "Yesterday", action: "Generated JD for Staff ML Engineer", detail: "Draft saved, awaiting HM review", confidence: 82, status: "pending" },
];

/* ── Safety Metrics ── */

export const SAFETY_METRICS = [
  { label: "Bias Audits", value: "12", subtext: "All passed", colorClass: "text-success" },
  { label: "Violations", value: "0", subtext: "Clean", colorClass: "text-success" },
  { label: "Overrides", value: "23", subtext: "23 human overrides", colorClass: "text-warning" },
  { label: "Error Rate", value: "1.2%", subtext: "Down from 2.8%", colorClass: "text-success" },
];

export const SAFETY_EVENTS = [
  { date: "Mar 25", description: "Bias audit passed: Sr Frontend Eng pipeline (no adverse impact)", type: "success" as const },
  { date: "Mar 22", description: "Human override: Admin rejected AI recommendation for candidate #4821", type: "warning" as const },
  { date: "Mar 20", description: "Bias audit passed: Backend Eng pipeline (no adverse impact)", type: "success" as const },
  { date: "Mar 18", description: "Alert: Confidence below 60% on 3 consecutive screens (resolved)", type: "warning" as const },
  { date: "Mar 15", description: "Monthly safety report generated and sent to compliance", type: "info" as const },
];

/* ── Helpers ── */

export function confidenceColor(conf: number | null): string {
  if (conf === null) return "text-muted-foreground";
  if (conf >= 85) return "text-success";
  if (conf >= 60) return "text-warning";
  return "text-destructive";
}

export function confidenceDotClass(conf: number | null): string {
  if (conf === null) return "bg-muted-foreground";
  if (conf >= 85) return "bg-success";
  if (conf >= 60) return "bg-warning";
  return "bg-destructive";
}

export function logStatusConfig(status: string): { icon: string; colorClass: string; label: string } {
  switch (status) {
    case "auto":        return { icon: "✅", colorClass: "text-success", label: "Auto" };
    case "completed":   return { icon: "✅", colorClass: "text-success", label: "Done" };
    case "review":      return { icon: "⏸", colorClass: "text-warning", label: "Review" };
    case "pending":     return { icon: "📋", colorClass: "text-brand", label: "Pending" };
    case "error":       return { icon: "❌", colorClass: "text-destructive", label: "Error" };
    case "in_progress": return { icon: "🔄", colorClass: "text-brand", label: "Running" };
    case "alert":       return { icon: "🔔", colorClass: "text-warning", label: "Alert" };
    default:            return { icon: "—", colorClass: "text-muted-foreground", label: status };
  }
}

export function safetyEventColor(type: string): string {
  switch (type) {
    case "success": return "text-success";
    case "warning": return "text-warning";
    case "info": return "text-brand";
    default: return "text-muted-foreground";
  }
}

export function safetyEventDot(type: string): string {
  switch (type) {
    case "success": return "bg-success";
    case "warning": return "bg-warning";
    case "info": return "bg-brand";
    default: return "bg-muted-foreground";
  }
}

export const ACTIVE_AGENT_COUNT = AGENTS.filter((a) => a.status === "active").length;
export const TOTAL_AGENT_COUNT = AGENTS.length;
export const TOTAL_ACTIONS_MTD = AGENTS.reduce((sum, a) => sum + a.actionsThisMonth, 0);
