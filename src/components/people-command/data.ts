/* ================================================================
   People Decision OS — Unified Command Center
   Contexts: Employees, Performance, Compensation, Engagement
   ================================================================ */

import {
  Users,
  TrendingUp,
  DollarSign,
  Heart,
  AlertTriangle,
  Zap,
  Clock,
  Shield,
  Activity,
  Bot,
  type LucideIcon,
} from "lucide-react";

/* ── Core Types ── */

export type PeopleContext = "employees" | "performance" | "compensation" | "engagement";

export interface ContextConfig {
  key: PeopleContext;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
}

export const CONTEXTS: ContextConfig[] = [
  { key: "employees", label: "Employee Lifecycle", icon: Users, color: "text-brand-teal", bgColor: "bg-brand-teal/10", description: "Onboarding, transitions, exits, compliance" },
  { key: "performance", label: "Performance", icon: TrendingUp, color: "text-brand-purple", bgColor: "bg-brand-purple/10", description: "Reviews, PIPs, promotions, calibration" },
  { key: "compensation", label: "Compensation", icon: DollarSign, color: "text-warning", bgColor: "bg-warning/10", description: "Salary reviews, equity, benchmarking, pay equity" },
  { key: "engagement", label: "Engagement", icon: Heart, color: "text-destructive", bgColor: "bg-destructive/10", description: "Attrition risk, burnout, sentiment, eNPS" },
];

/* ── Decision Types ── */

export type DecisionUrgency = "critical" | "high" | "medium" | "low";
export type DecisionRecommendation = "approve" | "escalate" | "review" | "reject" | "intervene";

export interface PeopleDecision {
  id: string;
  context: PeopleContext;
  type: string;
  title: string;
  subtitle: string;
  entityName: string;
  entityInitials: string;
  entityRole: string;
  entityDepartment: string;
  urgency: DecisionUrgency;
  recommendation: DecisionRecommendation;
  confidence: number;
  aiSummary: string;
  aiReasoning: string;
  strengths: string[];
  risks: string[];
  keyMetrics: { label: string; value: string; color: string }[];
  createdAt: string;
  deadline: string | null;
  status: "pending" | "actioned" | "dismissed";
}

/* ── Agent Events ── */

export interface PeopleAgentEvent {
  id: string;
  context: PeopleContext;
  agent: string;
  agentColor: "teal" | "purple" | "blue" | "warning" | "destructive";
  action: string;
  timestamp: string;
  status: "completed" | "in_progress" | "needs_review" | "failed";
}

/* ── Metrics ── */

export interface ContextMetric {
  label: string;
  value: number;
  suffix?: string;
  trend: string;
  direction: "up" | "neutral" | "warning";
  icon: LucideIcon;
  accent: string;
}

/* ── Helpers ── */

export function urgencyColor(u: DecisionUrgency): string {
  switch (u) { case "critical": return "text-destructive"; case "high": return "text-warning"; case "medium": return "text-brand"; case "low": return "text-muted-foreground"; }
}

export function urgencyBgColor(u: DecisionUrgency): string {
  switch (u) { case "critical": return "bg-destructive/10"; case "high": return "bg-warning/10"; case "medium": return "bg-brand/10"; case "low": return "bg-secondary"; }
}

export function urgencyBorderColor(u: DecisionUrgency): string {
  switch (u) { case "critical": return "border-l-destructive"; case "high": return "border-l-warning"; case "medium": return "border-l-brand"; case "low": return "border-l-muted-foreground/30"; }
}

export function recommendationColor(r: DecisionRecommendation): string {
  switch (r) { case "approve": return "text-success"; case "escalate": return "text-warning"; case "review": return "text-brand"; case "reject": return "text-destructive"; case "intervene": return "text-destructive"; }
}

export function recommendationBgColor(r: DecisionRecommendation): string {
  switch (r) { case "approve": return "bg-success/10"; case "escalate": return "bg-warning/10"; case "review": return "bg-brand/10"; case "reject": return "bg-destructive/10"; case "intervene": return "bg-destructive/10"; }
}

export function recommendationLabel(r: DecisionRecommendation): string {
  switch (r) { case "approve": return "Approve"; case "escalate": return "Escalate"; case "review": return "Review"; case "reject": return "Reject"; case "intervene": return "Intervene"; }
}

export function agentGradient(c: PeopleAgentEvent["agentColor"]): string {
  switch (c) { case "teal": return "from-brand-teal to-brand-teal/60"; case "purple": return "from-brand-purple to-brand-purple/60"; case "blue": return "from-brand to-brand/60"; case "warning": return "from-warning to-warning/60"; case "destructive": return "from-destructive to-destructive/60"; }
}

export function eventStatusColor(s: PeopleAgentEvent["status"]): string {
  switch (s) { case "completed": return "text-success"; case "in_progress": return "text-brand"; case "needs_review": return "text-warning"; case "failed": return "text-destructive"; }
}

export function eventStatusBgColor(s: PeopleAgentEvent["status"]): string {
  switch (s) { case "completed": return "bg-success/10"; case "in_progress": return "bg-brand/10"; case "needs_review": return "bg-warning/10"; case "failed": return "bg-destructive/10"; }
}

export function eventStatusLabel(s: PeopleAgentEvent["status"]): string {
  switch (s) { case "completed": return "Done"; case "in_progress": return "Running"; case "needs_review": return "Review"; case "failed": return "Failed"; }
}

export function scoreColor(s: number): string {
  if (s >= 85) return "text-success"; if (s >= 70) return "text-brand-teal"; if (s >= 55) return "text-brand"; if (s >= 40) return "text-warning"; return "text-destructive";
}

export function confidenceStrokeColor(s: number): string {
  if (s >= 90) return "#10B981"; if (s >= 75) return "#14B8A6"; if (s >= 60) return "#3B82F6"; if (s >= 40) return "#F59E0B"; return "#EF4444";
}

/* ── Mock Data: Metrics per context ── */

export const CONTEXT_METRICS: Record<PeopleContext, ContextMetric[]> = {
  employees: [
    { label: "Headcount", value: 342, trend: "+8 this month", direction: "up", icon: Users, accent: "text-brand-teal" },
    { label: "Attrition Risk", value: 12, trend: "3 critical", direction: "warning", icon: AlertTriangle, accent: "text-destructive" },
    { label: "Onboarding", value: 6, trend: "In progress", direction: "neutral", icon: Zap, accent: "text-brand" },
    { label: "Pending Exits", value: 3, trend: "2 this week", direction: "warning", icon: Clock, accent: "text-warning" },
    { label: "Compliance", value: 98, suffix: "%", trend: "2 overdue", direction: "neutral", icon: Shield, accent: "text-success" },
    { label: "Transfers", value: 4, trend: "In review", direction: "neutral", icon: Activity, accent: "text-brand-purple" },
  ],
  performance: [
    { label: "Reviews Due", value: 28, trend: "Cycle ends Apr 15", direction: "warning", icon: Clock, accent: "text-warning" },
    { label: "Avg Rating", value: 3.8, trend: "+0.2 vs last cycle", direction: "up", icon: TrendingUp, accent: "text-success" },
    { label: "PIPs Active", value: 4, trend: "2 expiring soon", direction: "warning", icon: AlertTriangle, accent: "text-destructive" },
    { label: "Promotions", value: 7, trend: "Pending approval", direction: "neutral", icon: Zap, accent: "text-brand-purple" },
    { label: "Calibration", value: 82, suffix: "%", trend: "Complete", direction: "up", icon: Shield, accent: "text-brand-teal" },
    { label: "Goals Met", value: 71, suffix: "%", trend: "Q1 target: 75%", direction: "neutral", icon: Activity, accent: "text-brand" },
  ],
  compensation: [
    { label: "Pending Reviews", value: 15, trend: "Annual cycle", direction: "neutral", icon: Clock, accent: "text-warning" },
    { label: "Budget Used", value: 78, suffix: "%", trend: "$2.1M remaining", direction: "neutral", icon: DollarSign, accent: "text-brand" },
    { label: "Pay Equity Gap", value: 4.2, suffix: "%", trend: "Target: <3%", direction: "warning", icon: AlertTriangle, accent: "text-destructive" },
    { label: "Market Adj", value: 12, trend: "Below market", direction: "warning", icon: TrendingUp, accent: "text-warning" },
    { label: "Equity Grants", value: 8, trend: "Pending", direction: "neutral", icon: Zap, accent: "text-brand-purple" },
    { label: "Total Comp", value: 14.2, suffix: "M", trend: "Annual run rate", direction: "up", icon: Shield, accent: "text-success" },
  ],
  engagement: [
    { label: "eNPS", value: 42, trend: "+5 vs last quarter", direction: "up", icon: Heart, accent: "text-success" },
    { label: "Burnout Risk", value: 8, trend: "3 critical", direction: "warning", icon: AlertTriangle, accent: "text-destructive" },
    { label: "Sentiment", value: 72, suffix: "%", trend: "Positive", direction: "up", icon: TrendingUp, accent: "text-brand-teal" },
    { label: "1:1 Overdue", value: 14, trend: "This week", direction: "warning", icon: Clock, accent: "text-warning" },
    { label: "Survey Response", value: 89, suffix: "%", trend: "Q1 pulse", direction: "up", icon: Activity, accent: "text-brand" },
    { label: "Retention Risk", value: 5, trend: "High performers", direction: "warning", icon: Shield, accent: "text-brand-purple" },
  ],
};

/* ── Mock Data: Decisions per context ── */

export const CONTEXT_DECISIONS: Record<PeopleContext, PeopleDecision[]> = {
  employees: [
    {
      id: "ed-001", context: "employees", type: "attrition_risk", title: "High attrition risk: Meera Krishnan", subtitle: "Sr. Engineer · Engineering · 3 risk signals detected",
      entityName: "Meera Krishnan", entityInitials: "MK", entityRole: "Sr. Engineer", entityDepartment: "Engineering",
      urgency: "critical", recommendation: "intervene", confidence: 89,
      aiSummary: "Multiple attrition signals detected: declined 2 skip-level invites, LinkedIn profile updated, compensation below 25th percentile for role. Flight risk is high.",
      aiReasoning: "The AI engagement model detected 3 simultaneous risk signals within a 2-week window. Historically, this combination correlates with an 82% probability of voluntary exit within 60 days. Immediate retention intervention recommended.",
      strengths: ["Top performer — 4.5/5 last review", "Team lead for critical migration project", "3 years tenure, deep domain knowledge"],
      risks: ["Compensation 18% below market median", "No promotion in 2 years", "Manager relationship score declining", "LinkedIn profile updated 5 days ago"],
      keyMetrics: [{ label: "Flight Risk", value: "82%", color: "text-destructive" }, { label: "Performance", value: "4.5/5", color: "text-success" }, { label: "Tenure", value: "3 yrs", color: "text-foreground" }],
      createdAt: "15 min ago", deadline: "Today", status: "pending",
    },
    {
      id: "ed-002", context: "employees", type: "onboarding_blocker", title: "Onboarding blocker: Alex Rivera", subtitle: "New hire · Design · Missing compliance docs",
      entityName: "Alex Rivera", entityInitials: "AR", entityRole: "Product Designer", entityDepartment: "Design",
      urgency: "high", recommendation: "review", confidence: 95,
      aiSummary: "Day 5 of onboarding — background check pending, NDA not signed, IT equipment not provisioned. Start date at risk.",
      aiReasoning: "3 of 7 onboarding checkpoints are incomplete past their SLA. Background check provider has not responded in 48 hours. Escalation to HR ops recommended.",
      strengths: ["Offer accepted and signed", "Manager buddy assigned", "Training plan ready"],
      risks: ["Background check delayed — 48hrs no response", "NDA unsigned — legal compliance blocker", "Laptop not provisioned — IT ticket pending"],
      keyMetrics: [{ label: "Progress", value: "4/7", color: "text-warning" }, { label: "Day", value: "5", color: "text-foreground" }, { label: "SLA", value: "At risk", color: "text-destructive" }],
      createdAt: "1 hour ago", deadline: "Tomorrow", status: "pending",
    },
    {
      id: "ed-003", context: "employees", type: "exit_approval", title: "Exit clearance: Ravi Sharma", subtitle: "Backend Engineer · Engineering · Last day Apr 10",
      entityName: "Ravi Sharma", entityInitials: "RS", entityRole: "Backend Engineer", entityDepartment: "Engineering",
      urgency: "medium", recommendation: "approve", confidence: 92,
      aiSummary: "All exit checklist items completed. Knowledge transfer 90% done. No outstanding compliance issues. Ready for final clearance.",
      aiReasoning: "Exit checklist shows 12/13 items complete. The remaining item (return company laptop) is scheduled for pickup on last day. No access revocation issues detected. Recommending approval for smooth exit.",
      strengths: ["Knowledge transfer nearly complete", "No compliance blockers", "Exit interview scheduled"],
      risks: ["1 pending checklist item (laptop return)", "2 active PRs need reassignment"],
      keyMetrics: [{ label: "Checklist", value: "12/13", color: "text-success" }, { label: "KT", value: "90%", color: "text-brand-teal" }, { label: "Last Day", value: "Apr 10", color: "text-foreground" }],
      createdAt: "3 hours ago", deadline: "Apr 8", status: "pending",
    },
  ],
  performance: [
    {
      id: "pd-001", context: "performance", type: "promotion_approval", title: "Promotion: Sarah Chen → Staff Engineer", subtitle: "Engineering · Strong panel consensus",
      entityName: "Sarah Chen", entityInitials: "SC", entityRole: "Sr. Engineer → Staff", entityDepartment: "Engineering",
      urgency: "high", recommendation: "approve", confidence: 94,
      aiSummary: "Sarah has exceeded Staff-level expectations for 2 consecutive cycles. Calibration committee unanimously recommended promotion. Compensation adjustment within approved band.",
      aiReasoning: "Performance data shows consistent Staff-level output: led 3 cross-team initiatives, mentored 4 juniors, 4.8/5 peer review average. Market data supports the compensation adjustment to $195K (65th percentile for Staff in market).",
      strengths: ["4.8/5 peer review — highest in department", "Led 3 cross-team initiatives", "Calibration committee unanimous", "Compensation within band"],
      risks: ["Competing offer from Vercel — time-sensitive", "Team dependency on her for system design decisions"],
      keyMetrics: [{ label: "Rating", value: "4.8/5", color: "text-success" }, { label: "Cycle", value: "2 exceed", color: "text-brand-teal" }, { label: "Band", value: "P65", color: "text-foreground" }],
      createdAt: "30 min ago", deadline: "Today", status: "pending",
    },
    {
      id: "pd-002", context: "performance", type: "pip_review", title: "PIP expiring: Tom Wilson", subtitle: "Backend Engineer · 60-day PIP ending Apr 5",
      entityName: "Tom Wilson", entityInitials: "TW", entityRole: "Sr. Backend Engineer", entityDepartment: "Engineering",
      urgency: "critical", recommendation: "review", confidence: 65,
      aiSummary: "PIP shows mixed progress. Code quality improved (3.2→3.8) but collaboration metrics remain below threshold. Manager assessment is split.",
      aiReasoning: "2 of 4 PIP objectives met. Code quality and technical delivery improved significantly. However, peer feedback on collaboration and communication shows only marginal improvement (2.8→3.1 vs 3.5 target). The decision between extension and exit is a judgment call.",
      strengths: ["Code quality improved 3.2→3.8", "Technical delivery on track", "Attendance and effort high"],
      risks: ["Collaboration score below threshold (3.1 vs 3.5)", "Bias score remains high (15)", "2 peer complaints unresolved", "No-show rate 3.5%"],
      keyMetrics: [{ label: "Objectives", value: "2/4", color: "text-warning" }, { label: "Days Left", value: "6", color: "text-destructive" }, { label: "Trend", value: "Mixed", color: "text-warning" }],
      createdAt: "2 hours ago", deadline: "Apr 5", status: "pending",
    },
    {
      id: "pd-003", context: "performance", type: "calibration_conflict", title: "Calibration conflict: Data team ratings", subtitle: "3 managers disagree on rating distribution",
      entityName: "Data Team", entityInitials: "DT", entityRole: "8 members", entityDepartment: "Data Engineering",
      urgency: "medium", recommendation: "escalate", confidence: 72,
      aiSummary: "Rating distribution for Data team is skewed: 5/8 rated 'Exceeds Expectations' vs org target of 25%. AI detects possible rating inflation.",
      aiReasoning: "Statistical analysis shows the Data team rating distribution deviates significantly from org norms (p<0.01). While the team has strong output metrics, the distribution suggests calibration is needed. Recommending HRBP facilitated session.",
      strengths: ["Team delivered 2 critical projects on time", "Low attrition vs org average", "High internal customer satisfaction"],
      risks: ["Rating inflation — 62% 'Exceeds' vs 25% target", "3 managers not aligned", "May create equity issues with adjacent teams"],
      keyMetrics: [{ label: "Exceeds", value: "62%", color: "text-warning" }, { label: "Target", value: "25%", color: "text-muted-foreground" }, { label: "Gap", value: "37pts", color: "text-destructive" }],
      createdAt: "5 hours ago", deadline: "Apr 12", status: "pending",
    },
  ],
  compensation: [
    {
      id: "cd-001", context: "compensation", type: "salary_review", title: "Market adjustment: 12 engineers below band", subtitle: "Engineering · Annual comp review cycle",
      entityName: "Engineering Dept", entityInitials: "EN", entityRole: "12 employees", entityDepartment: "Engineering",
      urgency: "high", recommendation: "approve", confidence: 88,
      aiSummary: "12 engineers are >15% below market median. Attrition risk is correlated — 4 of the 12 are flagged as flight risks. Total budget impact: $240K.",
      aiReasoning: "Market benchmarking data (Radford Q1 2026) shows 12 engineers below the 25th percentile. Historical analysis shows a 3.2x higher attrition probability for employees >15% below median. The $240K adjustment is within the remaining budget of $2.1M.",
      strengths: ["Budget available — $2.1M remaining", "Clear market data justification", "Addresses 4 attrition risk cases simultaneously"],
      risks: ["Internal equity — may trigger requests from other departments", "Budget impact reduces remaining capacity by 11%"],
      keyMetrics: [{ label: "Employees", value: "12", color: "text-foreground" }, { label: "Budget", value: "$240K", color: "text-warning" }, { label: "Below Band", value: ">15%", color: "text-destructive" }],
      createdAt: "1 hour ago", deadline: "Apr 15", status: "pending",
    },
    {
      id: "cd-002", context: "compensation", type: "equity_grant", title: "Equity refresh: Q2 grants for 8 high performers", subtitle: "Cross-functional · Annual equity refresh",
      entityName: "High Performers", entityInitials: "HP", entityRole: "8 employees", entityDepartment: "Cross-functional",
      urgency: "medium", recommendation: "approve", confidence: 91,
      aiSummary: "8 high performers identified for equity refresh grants. Total grant value: $1.2M RSUs over 4-year vesting. All within policy guidelines.",
      aiReasoning: "These 8 employees represent the top 5% of performers. All have been in-role for 2+ years and received 'Exceeds' ratings for consecutive cycles. Equity refresh is the recommended retention mechanism per compensation policy.",
      strengths: ["All within policy guidelines", "Top 5% performers", "4-year vesting — long-term retention", "Budget pre-approved by CFO"],
      risks: ["May create expectations for annual refresh", "2 employees already have significant equity holdings"],
      keyMetrics: [{ label: "Grants", value: "8", color: "text-foreground" }, { label: "Value", value: "$1.2M", color: "text-brand-purple" }, { label: "Vesting", value: "4 years", color: "text-foreground" }],
      createdAt: "4 hours ago", deadline: "Apr 20", status: "pending",
    },
  ],
  engagement: [
    {
      id: "eg-001", context: "engagement", type: "burnout_alert", title: "Burnout risk: Platform team (5 members)", subtitle: "Engineering · Multiple burnout signals",
      entityName: "Platform Team", entityInitials: "PT", entityRole: "5 engineers", entityDepartment: "Engineering",
      urgency: "critical", recommendation: "intervene", confidence: 86,
      aiSummary: "5 members of the Platform team show burnout indicators: avg 55 hrs/week over 6 weeks, declining PR quality, increased PTO cancellations. Team morale survey dropped 22 points.",
      aiReasoning: "The burnout prediction model flagged the Platform team based on: work hours (55 hrs avg vs 42 hrs norm), PTO cancellation rate (3x higher than avg), code review quality decline (-15%), and pulse survey scores dropping from 78 to 56. Intervention within 2 weeks is recommended to prevent attrition.",
      strengths: ["Team is critical for infrastructure", "All members are high performers", "Manager is aware and willing to act"],
      risks: ["55 hrs/week avg — 31% above norm", "3 PTO cancellations in 4 weeks", "Morale score dropped 78→56", "2 members updated LinkedIn profiles"],
      keyMetrics: [{ label: "Avg Hours", value: "55/wk", color: "text-destructive" }, { label: "Morale", value: "56", color: "text-destructive" }, { label: "Risk Level", value: "High", color: "text-destructive" }],
      createdAt: "20 min ago", deadline: "This week", status: "pending",
    },
    {
      id: "eg-002", context: "engagement", type: "retention_risk", title: "Retention risk: 5 high performers flagged", subtitle: "Cross-department · Q1 engagement data",
      entityName: "High Performers", entityInitials: "HP", entityRole: "5 employees", entityDepartment: "Multiple",
      urgency: "high", recommendation: "review", confidence: 78,
      aiSummary: "Engagement analysis flagged 5 high performers with declining engagement scores. Common factor: all passed over for promotion in last cycle. Combined replacement cost estimated at $1.2M.",
      aiReasoning: "Cross-referencing performance data with engagement signals: all 5 employees received 'Exceeds' ratings but were not promoted in the March cycle. Engagement scores declined 15-25% post-cycle. Historical data shows 60% attrition probability for this profile within 6 months.",
      strengths: ["All are rated 'Exceeds Expectations'", "Deep institutional knowledge", "Critical project dependencies"],
      risks: ["All passed over for promotion last cycle", "Engagement scores declined 15-25%", "60% attrition probability within 6 months", "Combined replacement cost: $1.2M"],
      keyMetrics: [{ label: "At Risk", value: "5", color: "text-destructive" }, { label: "Replace Cost", value: "$1.2M", color: "text-warning" }, { label: "Probability", value: "60%", color: "text-destructive" }],
      createdAt: "2 hours ago", deadline: "This week", status: "pending",
    },
    {
      id: "eg-003", context: "engagement", type: "enps_drop", title: "eNPS dropped in Sales team", subtitle: "Sales · Quarterly pulse survey analysis",
      entityName: "Sales Team", entityInitials: "ST", entityRole: "24 members", entityDepartment: "Sales",
      urgency: "medium", recommendation: "review", confidence: 82,
      aiSummary: "eNPS for Sales dropped from 48 to 28 (a 20-point decline). Top themes: unclear commission structure changes, limited growth paths, manager communication gaps.",
      aiReasoning: "NLP analysis of 18 open-text survey responses reveals 3 primary themes: commission restructuring (mentioned 12 times), career growth (8 times), and management communication (7 times). The decline correlates with the Q4 commission structure change.",
      strengths: ["89% survey response rate — data is reliable", "Team revenue targets on track", "VP Sales open to feedback session"],
      risks: ["20-point eNPS decline in one quarter", "Commission complaints unresolved for 3 months", "3 top performers in passive job search"],
      keyMetrics: [{ label: "eNPS", value: "28", color: "text-warning" }, { label: "Drop", value: "-20pts", color: "text-destructive" }, { label: "Response", value: "89%", color: "text-success" }],
      createdAt: "6 hours ago", deadline: null, status: "pending",
    },
  ],
};

/* ── Mock Data: Agent Events per context ── */

export const CONTEXT_AGENT_EVENTS: Record<PeopleContext, PeopleAgentEvent[]> = {
  employees: [
    { id: "eae-1", context: "employees", agent: "Attrition Agent", agentColor: "destructive", action: "Detected 3 new flight risk signals for Meera Krishnan — LinkedIn update, declined meetings, comp below band", timestamp: "15 min ago", status: "completed" },
    { id: "eae-2", context: "employees", agent: "Onboarding Agent", agentColor: "teal", action: "Escalated Alex Rivera onboarding blockers — background check and NDA pending past SLA", timestamp: "1 hour ago", status: "needs_review" },
    { id: "eae-3", context: "employees", agent: "Compliance Agent", agentColor: "blue", action: "Completed quarterly compliance audit — 98% completion rate, 2 items overdue", timestamp: "2 hours ago", status: "completed" },
    { id: "eae-4", context: "employees", agent: "Exit Agent", agentColor: "warning", action: "Generated exit clearance report for Ravi Sharma — 12/13 checklist items complete", timestamp: "3 hours ago", status: "completed" },
    { id: "eae-5", context: "employees", agent: "Transition Agent", agentColor: "purple", action: "Processing 4 internal transfer requests — manager approvals pending", timestamp: "5 hours ago", status: "in_progress" },
  ],
  performance: [
    { id: "pae-1", context: "performance", agent: "Calibration Agent", agentColor: "purple", action: "Detected rating inflation in Data team — 62% 'Exceeds' vs 25% org target", timestamp: "5 hours ago", status: "completed" },
    { id: "pae-2", context: "performance", agent: "Promotion Agent", agentColor: "teal", action: "Compiled promotion packet for Sarah Chen — unanimous committee recommendation", timestamp: "30 min ago", status: "completed" },
    { id: "pae-3", context: "performance", agent: "PIP Agent", agentColor: "warning", action: "Generated PIP progress report for Tom Wilson — 2/4 objectives met, 6 days remaining", timestamp: "2 hours ago", status: "needs_review" },
    { id: "pae-4", context: "performance", agent: "Goals Agent", agentColor: "blue", action: "Q1 goal completion analysis: 71% met across org — below 75% target", timestamp: "4 hours ago", status: "completed" },
    { id: "pae-5", context: "performance", agent: "Review Agent", agentColor: "purple", action: "Sent reminder to 28 managers with pending reviews — cycle ends Apr 15", timestamp: "6 hours ago", status: "completed" },
  ],
  compensation: [
    { id: "cae-1", context: "compensation", agent: "Benchmarking Agent", agentColor: "blue", action: "Updated market data from Radford Q1 2026 — 12 engineers below 25th percentile", timestamp: "1 hour ago", status: "completed" },
    { id: "cae-2", context: "compensation", agent: "Pay Equity Agent", agentColor: "warning", action: "Detected 4.2% gender pay gap in Engineering — target is <3%", timestamp: "3 hours ago", status: "needs_review" },
    { id: "cae-3", context: "compensation", agent: "Equity Agent", agentColor: "purple", action: "Compiled Q2 equity refresh recommendations — 8 high performers, $1.2M total", timestamp: "4 hours ago", status: "completed" },
    { id: "cae-4", context: "compensation", agent: "Budget Agent", agentColor: "teal", action: "Updated comp budget tracker — 78% utilized, $2.1M remaining for FY26", timestamp: "6 hours ago", status: "completed" },
  ],
  engagement: [
    { id: "gae-1", context: "engagement", agent: "Burnout Agent", agentColor: "destructive", action: "Flagged Platform team (5 members) — 55 hrs/week avg, morale score dropped 22 points", timestamp: "20 min ago", status: "completed" },
    { id: "gae-2", context: "engagement", agent: "Retention Agent", agentColor: "warning", action: "Identified 5 high performers with declining engagement post-promotion cycle", timestamp: "2 hours ago", status: "completed" },
    { id: "gae-3", context: "engagement", agent: "Sentiment Agent", agentColor: "purple", action: "Analyzed Q1 pulse survey — NLP detected commission complaints as top theme in Sales", timestamp: "6 hours ago", status: "completed" },
    { id: "gae-4", context: "engagement", agent: "1:1 Agent", agentColor: "teal", action: "14 managers have overdue 1:1s this week — automated reminders sent", timestamp: "8 hours ago", status: "completed" },
    { id: "gae-5", context: "engagement", agent: "Recognition Agent", agentColor: "blue", action: "Generated weekly recognition digest — 23 peer recognitions, 8 manager kudos", timestamp: "1 day ago", status: "completed" },
  ],
};
