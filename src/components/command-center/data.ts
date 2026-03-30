/* ================================================================
   Hiring Command Center — Types, Mock Data & Helpers
   ================================================================ */

import {
  Search,
  Filter,
  Zap,
  Clock,
  Bot,
  Inbox,
  Activity,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

/* ── Types ── */

export type DecisionType =
  | "approve_shortlist"
  | "advance_candidate"
  | "reject_candidate"
  | "approve_offer"
  | "schedule_interview"
  | "extend_deadline";

export type UrgencyLevel = "critical" | "high" | "medium" | "low";

export interface InterviewerVote {
  name: string;
  initials: string;
  vote: "strong_yes" | "yes" | "neutral" | "no" | "strong_no";
  notes: string;
}

export interface CandidateInsight {
  fitScore: number;
  strengths: string[];
  risks: string[];
  summary: string;
}

export interface PanelAlignment {
  votes: { label: string; count: number }[];
  consensusLevel: "strong" | "moderate" | "split" | "insufficient";
}

export interface Decision {
  id: string;
  type: DecisionType;
  title: string;
  subtitle: string;
  urgency: UrgencyLevel;
  recommendation: "approve" | "reject" | "defer";
  confidence: number;
  candidateName: string;
  candidateInitials: string;
  candidateRole: string;
  candidateCompany: string;
  requisition: string;
  aiReasoning: string;
  interviewerVotes: InterviewerVote[];
  candidateInsight: CandidateInsight;
  panelAlignment: PanelAlignment;
  createdAt: string;
  deadline: string | null;
  status: "pending" | "approved" | "rejected" | "deferred";
}

export type AgentEventType =
  | "screen"
  | "source"
  | "schedule"
  | "score"
  | "outreach"
  | "audit"
  | "report"
  | "escalation";

export interface AgentEvent {
  id: string;
  agent: string;
  agentColor: "purple" | "teal" | "blue";
  action: string;
  type: AgentEventType;
  timestamp: string;
  metadata: Record<string, string>;
  status: "completed" | "in_progress" | "needs_review" | "failed";
}

export interface MetricItem {
  label: string;
  value: number;
  suffix?: string;
  trend: string;
  direction: "up" | "neutral" | "warning";
  icon: LucideIcon;
  accent: "brand" | "brand-teal" | "brand-purple" | "warning" | "success" | "destructive";
}

/* ── Helper Functions ── */

export function urgencyColor(urgency: UrgencyLevel): string {
  switch (urgency) {
    case "critical": return "text-destructive";
    case "high": return "text-warning";
    case "medium": return "text-brand";
    case "low": return "text-muted-foreground";
  }
}

export function urgencyBgColor(urgency: UrgencyLevel): string {
  switch (urgency) {
    case "critical": return "bg-destructive/10";
    case "high": return "bg-warning/10";
    case "medium": return "bg-brand/10";
    case "low": return "bg-secondary";
  }
}

export function urgencyLabel(urgency: UrgencyLevel): string {
  switch (urgency) {
    case "critical": return "Critical";
    case "high": return "High";
    case "medium": return "Medium";
    case "low": return "Low";
  }
}

export function urgencyBorderColor(urgency: UrgencyLevel): string {
  switch (urgency) {
    case "critical": return "border-l-destructive";
    case "high": return "border-l-warning";
    case "medium": return "border-l-brand";
    case "low": return "border-l-muted-foreground/30";
  }
}

export function confidenceColor(score: number): string {
  if (score >= 90) return "text-success";
  if (score >= 75) return "text-brand-teal";
  if (score >= 60) return "text-brand";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

export function confidenceStrokeColor(score: number): string {
  if (score >= 90) return "#10B981";
  if (score >= 75) return "#14B8A6";
  if (score >= 60) return "#3B82F6";
  if (score >= 40) return "#F59E0B";
  return "#EF4444";
}

export function fitScoreColor(score: number): string {
  if (score >= 85) return "text-success";
  if (score >= 70) return "text-brand-teal";
  if (score >= 55) return "text-brand";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

export function fitScoreBgColor(score: number): string {
  if (score >= 85) return "bg-success/10";
  if (score >= 70) return "bg-brand-teal/10";
  if (score >= 55) return "bg-brand/10";
  if (score >= 40) return "bg-warning/10";
  return "bg-destructive/10";
}

export function voteColor(vote: InterviewerVote["vote"]): string {
  switch (vote) {
    case "strong_yes": return "text-success";
    case "yes": return "text-success/80";
    case "neutral": return "text-muted-foreground";
    case "no": return "text-destructive/80";
    case "strong_no": return "text-destructive";
  }
}

export function voteBgColor(vote: InterviewerVote["vote"]): string {
  switch (vote) {
    case "strong_yes": return "bg-success/10";
    case "yes": return "bg-success/8";
    case "neutral": return "bg-secondary";
    case "no": return "bg-destructive/8";
    case "strong_no": return "bg-destructive/10";
  }
}

export function voteLabel(vote: InterviewerVote["vote"]): string {
  switch (vote) {
    case "strong_yes": return "Strong Yes";
    case "yes": return "Yes";
    case "neutral": return "Neutral";
    case "no": return "No";
    case "strong_no": return "Strong No";
  }
}

export function consensusColor(level: PanelAlignment["consensusLevel"]): string {
  switch (level) {
    case "strong": return "text-success";
    case "moderate": return "text-brand-teal";
    case "split": return "text-warning";
    case "insufficient": return "text-muted-foreground";
  }
}

export function consensusBgColor(level: PanelAlignment["consensusLevel"]): string {
  switch (level) {
    case "strong": return "bg-success/10";
    case "moderate": return "bg-brand-teal/10";
    case "split": return "bg-warning/10";
    case "insufficient": return "bg-secondary";
  }
}

export function consensusLabel(level: PanelAlignment["consensusLevel"]): string {
  switch (level) {
    case "strong": return "Strong Consensus";
    case "moderate": return "Moderate Alignment";
    case "split": return "Split Panel";
    case "insufficient": return "Insufficient Data";
  }
}

export function decisionTypeLabel(type: DecisionType): string {
  switch (type) {
    case "approve_shortlist": return "Approve Shortlist";
    case "advance_candidate": return "Advance Candidate";
    case "reject_candidate": return "Reject Candidate";
    case "approve_offer": return "Approve Offer";
    case "schedule_interview": return "Schedule Interview";
    case "extend_deadline": return "Extend Deadline";
  }
}

export function agentColorGradient(color: AgentEvent["agentColor"]): string {
  switch (color) {
    case "purple": return "from-brand-purple to-brand-purple/60";
    case "teal": return "from-brand-teal to-brand-teal/60";
    case "blue": return "from-brand to-brand/60";
  }
}

export function eventStatusColor(status: AgentEvent["status"]): string {
  switch (status) {
    case "completed": return "text-success";
    case "in_progress": return "text-brand";
    case "needs_review": return "text-warning";
    case "failed": return "text-destructive";
  }
}

export function eventStatusBgColor(status: AgentEvent["status"]): string {
  switch (status) {
    case "completed": return "bg-success/10";
    case "in_progress": return "bg-brand/10";
    case "needs_review": return "bg-warning/10";
    case "failed": return "bg-destructive/10";
  }
}

export function eventStatusLabel(status: AgentEvent["status"]): string {
  switch (status) {
    case "completed": return "Done";
    case "in_progress": return "Running";
    case "needs_review": return "Review";
    case "failed": return "Failed";
  }
}

/* ── Mock Data: Decisions ── */

export const DECISIONS: Decision[] = [
  {
    id: "dec-001",
    type: "approve_shortlist",
    title: "Approve shortlist for Sr. Backend Engineer",
    subtitle: "5 candidates ready for technical screening",
    urgency: "critical",
    recommendation: "approve",
    confidence: 92,
    candidateName: "Multiple Candidates",
    candidateInitials: "5C",
    candidateRole: "Sr. Backend Engineer",
    candidateCompany: "Various",
    requisition: "REQ-2024-0089",
    aiReasoning: "All 5 candidates meet the minimum qualifications for the Sr. Backend Engineer role. **4 out of 5** have direct experience with distributed systems and Go, which are core requirements. The shortlist was generated using a weighted scoring model across technical skills (40%), experience relevance (30%), and cultural signals (30%). Average fit score is **87/100**. Recommending approval to avoid pipeline stagnation — this req has been open for 23 days and SLA target is 30 days.",
    interviewerVotes: [],
    candidateInsight: {
      fitScore: 87,
      strengths: ["Strong distributed systems experience across all candidates", "4/5 have Go proficiency at senior level", "Diverse company backgrounds reduce groupthink risk"],
      risks: ["1 candidate has a 3-month notice period", "No candidates from target company list"],
      summary: "High-quality shortlist with strong technical alignment. The batch skews toward candidates from mid-size startups, which aligns with the team's engineering culture.",
    },
    panelAlignment: {
      votes: [],
      consensusLevel: "insufficient",
    },
    createdAt: "12 min ago",
    deadline: "2 hours",
    status: "pending",
  },
  {
    id: "dec-002",
    type: "advance_candidate",
    title: "Advance Sarah Chen to Final Round",
    subtitle: "Staff Frontend Engineer · Completed System Design",
    urgency: "high",
    recommendation: "approve",
    confidence: 88,
    candidateName: "Sarah Chen",
    candidateInitials: "SC",
    candidateRole: "Staff Frontend Engineer",
    candidateCompany: "Stripe",
    requisition: "REQ-2024-0072",
    aiReasoning: "Sarah Chen has demonstrated exceptional performance across all interview stages. Her system design round scored **4.5/5** — the highest this quarter for this role. She architected a real-time collaborative editor with **CRDT-based conflict resolution**, demonstrating both depth and breadth. Panel alignment is strong with 3 'Strong Yes' votes. Her compensation expectations ($195K base) are within the approved band ($180K–$210K). **Risk**: She has a competing offer from Vercel with a 5-day decision window.",
    interviewerVotes: [
      { name: "Rajesh Kumar", initials: "RK", vote: "strong_yes", notes: "Best system design interview I've conducted this year. Deep understanding of distributed state." },
      { name: "Emily Watson", initials: "EW", vote: "strong_yes", notes: "Exceptional React and TypeScript depth. Strong mentorship signals." },
      { name: "Marcus Lee", initials: "ML", vote: "strong_yes", notes: "Culture fit is excellent. Asked great questions about team dynamics." },
      { name: "Priya Patel", initials: "PP", vote: "yes", notes: "Solid technical skills. Slightly concerned about management track interest long-term." },
    ],
    candidateInsight: {
      fitScore: 94,
      strengths: ["4.5/5 system design score — highest this quarter", "8 years React/TypeScript, 3 years at Stripe scale", "Strong mentorship and tech lead signals", "Compensation within approved band"],
      risks: ["Competing offer from Vercel — 5-day decision window", "Long-term interest in management track may cause retention risk"],
      summary: "Exceptional candidate with rare combination of deep technical expertise and leadership potential. The competing offer creates urgency — recommend fast-tracking to final round within 48 hours.",
    },
    panelAlignment: {
      votes: [
        { label: "Strong Yes", count: 3 },
        { label: "Yes", count: 1 },
        { label: "Neutral", count: 0 },
        { label: "No", count: 0 },
        { label: "Strong No", count: 0 },
      ],
      consensusLevel: "strong",
    },
    createdAt: "28 min ago",
    deadline: "Today",
    status: "pending",
  },
  {
    id: "dec-003",
    type: "approve_offer",
    title: "Approve offer: Marcus Johnson — $185K",
    subtitle: "Sr. Data Engineer · All rounds completed",
    urgency: "high",
    recommendation: "approve",
    confidence: 85,
    candidateName: "Marcus Johnson",
    candidateInitials: "MJ",
    candidateRole: "Sr. Data Engineer",
    candidateCompany: "Databricks",
    requisition: "REQ-2024-0091",
    aiReasoning: "Marcus Johnson has successfully completed all interview rounds with a composite score of **4.2/5**. The proposed compensation package of **$185K base + $40K RSU** is at the 65th percentile for the role in Bangalore market, which is within our target range (50th–75th). His Databricks background is directly relevant to our data platform migration initiative. **Note**: The headcount budget for this req was approved at $190K max base, so this offer leaves a $5K buffer.",
    interviewerVotes: [
      { name: "Anita Desai", initials: "AD", vote: "strong_yes", notes: "Deep Spark and Delta Lake expertise. Exactly what we need for the migration." },
      { name: "Tom Wilson", initials: "TW", vote: "yes", notes: "Good problem-solving approach. Collaborative style." },
      { name: "Lisa Chen", initials: "LC", vote: "yes", notes: "Strong technical skills. Communication could be slightly more concise." },
    ],
    candidateInsight: {
      fitScore: 82,
      strengths: ["Direct Databricks experience — critical for migration", "4.2/5 composite interview score", "Compensation within approved band with buffer", "Can start within 30 days"],
      risks: ["Communication style noted as 'could be more concise'", "No prior startup experience — adjustment period expected"],
      summary: "Strong hire for the data platform migration. Technical skills are a direct match, and the offer is well within budget. Minor concerns about communication style are addressable through onboarding.",
    },
    panelAlignment: {
      votes: [
        { label: "Strong Yes", count: 1 },
        { label: "Yes", count: 2 },
        { label: "Neutral", count: 0 },
        { label: "No", count: 0 },
        { label: "Strong No", count: 0 },
      ],
      consensusLevel: "strong",
    },
    createdAt: "1 hour ago",
    deadline: "Tomorrow",
    status: "pending",
  },
  {
    id: "dec-004",
    type: "reject_candidate",
    title: "Reject: David Kim — VP Engineering",
    subtitle: "Insufficient panel alignment after final round",
    urgency: "medium",
    recommendation: "reject",
    confidence: 78,
    candidateName: "David Kim",
    candidateInitials: "DK",
    candidateRole: "VP Engineering",
    candidateCompany: "Meta",
    requisition: "REQ-2024-0065",
    aiReasoning: "David Kim's final round revealed a **split panel** with significant disagreement on leadership style. While his technical credentials are strong (ex-Meta, managed 200+ engineers), two interviewers flagged concerns about his **top-down management approach** which conflicts with our collaborative engineering culture. The CTO interview scored 3/5 with notes about 'misalignment on autonomous team philosophy.' Fit score dropped from 78 (post-technical) to **61** (post-final). Recommending rejection with a respectful close — he is a senior industry leader and maintaining the relationship is important.",
    interviewerVotes: [
      { name: "Vikram Shah", initials: "VS", vote: "no", notes: "Management philosophy doesn't align. Very command-and-control oriented." },
      { name: "Sarah Mitchell", initials: "SM", vote: "neutral", notes: "Strong technical background but struggled to articulate vision for autonomous teams." },
      { name: "James Rodriguez", initials: "JR", vote: "yes", notes: "Impressive scale experience. Could bring needed structure to the org." },
      { name: "Nora Ahmed", initials: "NA", vote: "strong_no", notes: "Cultural misfit. Would disrupt the team dynamics we've built." },
    ],
    candidateInsight: {
      fitScore: 61,
      strengths: ["Managed 200+ engineers at Meta scale", "Strong technical architecture background", "Excellent industry reputation and network"],
      risks: ["Top-down management style conflicts with company culture", "CTO scored 3/5 with alignment concerns", "Split panel — 2 negative votes at senior level", "High compensation expectations ($350K+)"],
      summary: "Despite impressive credentials, the cultural misalignment on leadership philosophy is a significant concern for a VP-level hire. The split panel at this seniority level is a strong negative signal.",
    },
    panelAlignment: {
      votes: [
        { label: "Strong Yes", count: 0 },
        { label: "Yes", count: 1 },
        { label: "Neutral", count: 1 },
        { label: "No", count: 1 },
        { label: "Strong No", count: 1 },
      ],
      consensusLevel: "split",
    },
    createdAt: "2 hours ago",
    deadline: null,
    status: "pending",
  },
  {
    id: "dec-005",
    type: "advance_candidate",
    title: "Advance Aisha Patel to Technical Round",
    subtitle: "Product Designer · Phone screen completed",
    urgency: "medium",
    recommendation: "approve",
    confidence: 81,
    candidateName: "Aisha Patel",
    candidateInitials: "AP",
    candidateRole: "Sr. Product Designer",
    candidateCompany: "Figma",
    requisition: "REQ-2024-0094",
    aiReasoning: "Aisha Patel's phone screen was conducted by the Design Lead and received a **4/5** rating. Her portfolio demonstrates strong enterprise UX skills with particular depth in **design systems** and **data-dense interfaces** — both critical for O2S. She has 6 years of experience at Figma working on their enterprise product suite. The AI screening analysis flagged her case study on 'redesigning Figma's admin dashboard' as highly relevant to our current design challenges. Recommending advancement to the design challenge round.",
    interviewerVotes: [
      { name: "Nina Torres", initials: "NT", vote: "yes", notes: "Strong portfolio. Design system thinking is exactly what we need." },
    ],
    candidateInsight: {
      fitScore: 79,
      strengths: ["6 years at Figma — enterprise design expertise", "Design systems specialist", "Data-dense interface experience", "Strong case study relevance"],
      risks: ["Only 1 interview data point so far", "Salary expectations not yet discussed", "May need visa sponsorship"],
      summary: "Promising candidate with directly relevant enterprise design experience. The phone screen was strong and the portfolio aligns well with O2S's design challenges. More data needed from the design challenge round.",
    },
    panelAlignment: {
      votes: [
        { label: "Strong Yes", count: 0 },
        { label: "Yes", count: 1 },
        { label: "Neutral", count: 0 },
        { label: "No", count: 0 },
        { label: "Strong No", count: 0 },
      ],
      consensusLevel: "insufficient",
    },
    createdAt: "3 hours ago",
    deadline: null,
    status: "pending",
  },
  {
    id: "dec-006",
    type: "schedule_interview",
    title: "Schedule: Panel interview for 3 QA candidates",
    subtitle: "QA Lead · Batch scheduling recommended",
    urgency: "low",
    recommendation: "approve",
    confidence: 95,
    candidateName: "Multiple Candidates",
    candidateInitials: "3C",
    candidateRole: "QA Lead",
    candidateCompany: "Various",
    requisition: "REQ-2024-0101",
    aiReasoning: "Three candidates have cleared the technical screening for the QA Lead position and need panel interviews scheduled. The scheduling agent has identified **next Tuesday and Wednesday** as optimal slots based on panel availability (all 4 interviewers have confirmed availability). Recommending batch scheduling to maintain pipeline velocity — the average time between screening and panel for this role is 5.2 days vs. our 4-day target.",
    interviewerVotes: [],
    candidateInsight: {
      fitScore: 74,
      strengths: ["All 3 candidates cleared technical screening", "Diverse testing methodology backgrounds", "Batch scheduling saves 3 days of coordination"],
      risks: ["One candidate is in a different timezone (PST)", "Panel availability may shift — only 2 days confirmed"],
      summary: "Routine scheduling decision. All candidates are qualified and panel is available. Batch scheduling is the most efficient approach.",
    },
    panelAlignment: {
      votes: [],
      consensusLevel: "insufficient",
    },
    createdAt: "4 hours ago",
    deadline: null,
    status: "pending",
  },
  {
    id: "dec-007",
    type: "approve_offer",
    title: "Approve offer: Rachel Torres — $165K",
    subtitle: "DevOps Engineer · Counter-offer scenario",
    urgency: "critical",
    recommendation: "defer",
    confidence: 62,
    candidateName: "Rachel Torres",
    candidateInitials: "RT",
    candidateRole: "DevOps Engineer",
    candidateCompany: "HashiCorp",
    requisition: "REQ-2024-0088",
    aiReasoning: "Rachel Torres received a counter-offer from HashiCorp at **$175K base** after we extended at **$165K**. Our approved band max is $170K. The AI recommends **deferring** this decision to the Hiring Manager for a compensation exception review. Rachel's technical scores are strong (4.1/5) and she brings valuable **Terraform and Kubernetes expertise** that would accelerate our infrastructure roadmap by an estimated 2 months. However, exceeding the band by $5K requires VP-level approval per compensation policy. **Confidence is lower (62%)** because this is a judgment call balancing talent quality against comp policy.",
    interviewerVotes: [
      { name: "Alex Rivera", initials: "AR", vote: "strong_yes", notes: "Exceptional infrastructure knowledge. Would be transformative for our DevOps team." },
      { name: "Jordan Lee", initials: "JL", vote: "yes", notes: "Strong skills, good culture fit. Concerned about comp expectations." },
    ],
    candidateInsight: {
      fitScore: 83,
      strengths: ["Deep Terraform and Kubernetes expertise", "Would accelerate infra roadmap by ~2 months", "4.1/5 composite interview score", "Strong culture fit signals"],
      risks: ["Counter-offer at $175K exceeds our band by $5K", "Requires VP-level compensation exception", "Counter-offer acceptance rate is ~50%", "May create internal equity concerns"],
      summary: "High-quality candidate with a time-sensitive counter-offer situation. The core question is whether the business value justifies a compensation exception. Strong technical fit but requires policy override.",
    },
    panelAlignment: {
      votes: [
        { label: "Strong Yes", count: 1 },
        { label: "Yes", count: 1 },
        { label: "Neutral", count: 0 },
        { label: "No", count: 0 },
        { label: "Strong No", count: 0 },
      ],
      consensusLevel: "moderate",
    },
    createdAt: "35 min ago",
    deadline: "3 hours",
    status: "pending",
  },
  {
    id: "dec-008",
    type: "extend_deadline",
    title: "Extend deadline: ML Engineer requisition",
    subtitle: "REQ-2024-0076 approaching SLA breach",
    urgency: "high",
    recommendation: "approve",
    confidence: 71,
    candidateName: "N/A",
    candidateInitials: "ML",
    candidateRole: "Sr. ML Engineer",
    candidateCompany: "N/A",
    requisition: "REQ-2024-0076",
    aiReasoning: "The Sr. ML Engineer requisition (REQ-2024-0076) is at **day 28 of a 30-day SLA**. Current pipeline has 3 candidates in screening but none have advanced to interviews yet. The sourcing agent reports that **ML engineer market is extremely competitive** — our response rate to outreach is 8% vs. the 15% benchmark. Recommending a **14-day SLA extension** to avoid a breach while the sourcing agent expands search parameters to include adjacent skill profiles (e.g., Data Scientists with MLOps experience).",
    interviewerVotes: [],
    candidateInsight: {
      fitScore: 0,
      strengths: ["3 candidates in screening pipeline", "Sourcing agent expanding search parameters", "Role is business-critical for Q2 roadmap"],
      risks: ["8% outreach response rate vs. 15% benchmark", "28/30 days elapsed on SLA", "No candidates at interview stage", "Competitive market for ML talent"],
      summary: "Pipeline is thin due to competitive ML market conditions. Extension is necessary to avoid SLA breach while the sourcing strategy is adjusted.",
    },
    panelAlignment: {
      votes: [],
      consensusLevel: "insufficient",
    },
    createdAt: "1 hour ago",
    deadline: "2 days",
    status: "pending",
  },
];

/* ── Mock Data: Agent Events ── */

export const AGENT_EVENTS: AgentEvent[] = [
  {
    id: "evt-001",
    agent: "Sourcing Agent",
    agentColor: "purple",
    action: "Added 12 candidates to Sr. Backend Engineer pipeline from LinkedIn and GitHub",
    type: "source",
    timestamp: "2 min ago",
    metadata: { source: "LinkedIn, GitHub", candidates: "12", requisition: "REQ-2024-0089" },
    status: "completed",
  },
  {
    id: "evt-002",
    agent: "Screening Agent",
    agentColor: "teal",
    action: "Completed resume screening for 8 Product Designer applicants — 5 passed, 3 rejected",
    type: "screen",
    timestamp: "5 min ago",
    metadata: { passed: "5", rejected: "3", requisition: "REQ-2024-0094" },
    status: "completed",
  },
  {
    id: "evt-003",
    agent: "Interview Agent",
    agentColor: "blue",
    action: "Flagged scheduling conflict for Sarah Chen's final round — rescheduling in progress",
    type: "schedule",
    timestamp: "8 min ago",
    metadata: { candidate: "Sarah Chen", conflict: "Panel member OOO", requisition: "REQ-2024-0072" },
    status: "in_progress",
  },
  {
    id: "evt-004",
    agent: "Scoring Agent",
    agentColor: "purple",
    action: "Generated composite scores for 6 candidates in Data Engineer pipeline",
    type: "score",
    timestamp: "12 min ago",
    metadata: { candidates: "6", avgScore: "76", requisition: "REQ-2024-0091" },
    status: "completed",
  },
  {
    id: "evt-005",
    agent: "Outreach Agent",
    agentColor: "teal",
    action: "Sent personalized outreach to 15 passive ML Engineer candidates",
    type: "outreach",
    timestamp: "18 min ago",
    metadata: { sent: "15", responseRate: "8%", requisition: "REQ-2024-0076" },
    status: "completed",
  },
  {
    id: "evt-006",
    agent: "Compliance Agent",
    agentColor: "blue",
    action: "Audit completed: All 23 active requisitions have valid approvals and budget allocation",
    type: "audit",
    timestamp: "25 min ago",
    metadata: { reqs: "23", status: "All compliant" },
    status: "completed",
  },
  {
    id: "evt-007",
    agent: "Screening Agent",
    agentColor: "teal",
    action: "Processing 14 new applications for QA Lead position",
    type: "screen",
    timestamp: "30 min ago",
    metadata: { applications: "14", requisition: "REQ-2024-0101" },
    status: "in_progress",
  },
  {
    id: "evt-008",
    agent: "Interview Agent",
    agentColor: "blue",
    action: "Detected inconsistency in feedback for David Kim — panel scores diverge by 2+ points",
    type: "escalation",
    timestamp: "42 min ago",
    metadata: { candidate: "David Kim", variance: "2.3 points", requisition: "REQ-2024-0065" },
    status: "needs_review",
  },
  {
    id: "evt-009",
    agent: "Sourcing Agent",
    agentColor: "purple",
    action: "Expanding search parameters for ML Engineer — adding Data Scientists with MLOps experience",
    type: "source",
    timestamp: "1 hour ago",
    metadata: { newProfiles: "42 identified", requisition: "REQ-2024-0076" },
    status: "in_progress",
  },
  {
    id: "evt-010",
    agent: "Scoring Agent",
    agentColor: "purple",
    action: "Weekly pipeline health report generated — 4 reqs above target, 2 at risk",
    type: "report",
    timestamp: "1 hour ago",
    metadata: { healthy: "4", atRisk: "2", totalReqs: "23" },
    status: "completed",
  },
  {
    id: "evt-011",
    agent: "Outreach Agent",
    agentColor: "teal",
    action: "Follow-up emails sent to 8 candidates who haven't responded in 5+ days",
    type: "outreach",
    timestamp: "2 hours ago",
    metadata: { followUps: "8", avgDaysSilent: "6.2" },
    status: "completed",
  },
  {
    id: "evt-012",
    agent: "Compliance Agent",
    agentColor: "blue",
    action: "Background check initiated for Marcus Johnson — estimated completion in 3 business days",
    type: "audit",
    timestamp: "2 hours ago",
    metadata: { candidate: "Marcus Johnson", estimatedDays: "3" },
    status: "in_progress",
  },
];

/* ── Mock Data: Metrics ── */

export const METRICS: MetricItem[] = [
  { label: "Decisions Today", value: 12, trend: "+3 vs yesterday", direction: "up", icon: Zap, accent: "brand-purple" },
  { label: "Avg Response", value: 4, suffix: "min", trend: "Under SLA", direction: "up", icon: Clock, accent: "success" },
  { label: "Auto-Approved", value: 18, trend: "Low-risk decisions", direction: "neutral", icon: Bot, accent: "brand-teal" },
  { label: "Queue Depth", value: 7, trend: "2 critical", direction: "warning", icon: Inbox, accent: "warning" },
  { label: "Agent Actions/hr", value: 34, trend: "+12% this week", direction: "up", icon: Activity, accent: "brand" },
  { label: "SLA Compliance", value: 96, suffix: "%", trend: "1 at risk", direction: "neutral", icon: ShieldCheck, accent: "success" },
];

/* ── Filter Options ── */

export type QueueFilter = "all" | "critical" | "offers" | "advances" | "shortlists";

export function filterDecisions(decisions: Decision[], filter: QueueFilter): Decision[] {
  const pending = decisions.filter((d) => d.status === "pending");
  switch (filter) {
    case "all": return pending;
    case "critical": return pending.filter((d) => d.urgency === "critical" || d.urgency === "high");
    case "offers": return pending.filter((d) => d.type === "approve_offer");
    case "advances": return pending.filter((d) => d.type === "advance_candidate");
    case "shortlists": return pending.filter((d) => d.type === "approve_shortlist" || d.type === "schedule_interview");
    default: return pending;
  }
}
