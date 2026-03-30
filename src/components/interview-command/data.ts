/* ================================================================
   Interview Command View — Types, Mock Data & Helpers
   Multi-agent, multi-signal decision system for interviews
   ================================================================ */

/* ── Types ── */

export type InterviewRoundType =
  | "phone_screen"
  | "technical"
  | "system_design"
  | "behavioral"
  | "culture_fit"
  | "hiring_manager"
  | "panel";

export type RoundStatus = "pending" | "scheduled" | "in_progress" | "completed" | "cancelled";

export type PanelRecommendation = "strong_hire" | "hire" | "lean_hire" | "lean_no" | "no_hire" | "strong_no";

export interface InterviewerProfile {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  expertise: string[];
  seniority: "junior" | "mid" | "senior" | "staff" | "principal";
  interviewLoad: number;
  maxLoad: number;
  avgFeedbackScore: number;
  biasScore: number;
  totalInterviews: number;
  availability: "available" | "busy" | "overloaded";
}

export interface RoundInterviewer {
  interviewerId: string;
  isAISuggested: boolean;
  reason: string;
}

export interface InterviewRound {
  id: string;
  roundNumber: number;
  type: InterviewRoundType;
  status: RoundStatus;
  interviewers: RoundInterviewer[];
  scheduledAt: string | null;
  duration: number;
  score: number | null;
  feedback: string | null;
  aiQuestions: string[];
}

export interface InterviewPlan {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateInitials: string;
  candidateRole: string;
  candidateCompany: string;
  requisition: string;
  fitScore: number;
  rounds: InterviewRound[];
  overallStatus: "planning" | "in_progress" | "completed" | "decision_pending";
  aiPanelConfidence: number;
  panelGaps: string[];
  panelConflicts: string[];
  createdAt: string;
}

export interface ScheduleSlot {
  id: string;
  date: string;
  time: string;
  interviewerIds: string[];
  isAISuggested: boolean;
  conflictReason: string | null;
  score: number;
}

export interface PanelVote {
  interviewerId: string;
  roundId: string;
  recommendation: PanelRecommendation;
  score: number;
  strengths: string[];
  concerns: string[];
  notes: string;
}

export interface PanelAlignment {
  votes: PanelVote[];
  agreementScore: number;
  hasConflict: boolean;
  conflictExplanation: string | null;
  aiSynthesis: string;
  aiRecommendation: PanelRecommendation;
  aiConfidence: number;
}

/* ── Helpers ── */

export function roundTypeLabel(type: InterviewRoundType): string {
  switch (type) {
    case "phone_screen": return "Phone Screen";
    case "technical": return "Technical";
    case "system_design": return "System Design";
    case "behavioral": return "Behavioral";
    case "culture_fit": return "Culture Fit";
    case "hiring_manager": return "Hiring Manager";
    case "panel": return "Panel";
  }
}

export function roundTypeColor(type: InterviewRoundType): string {
  switch (type) {
    case "phone_screen": return "text-muted-foreground";
    case "technical": return "text-brand";
    case "system_design": return "text-brand-purple";
    case "behavioral": return "text-brand-teal";
    case "culture_fit": return "text-warning";
    case "hiring_manager": return "text-success";
    case "panel": return "text-info";
  }
}

export function roundTypeBgColor(type: InterviewRoundType): string {
  switch (type) {
    case "phone_screen": return "bg-secondary";
    case "technical": return "bg-brand/10";
    case "system_design": return "bg-brand-purple/10";
    case "behavioral": return "bg-brand-teal/10";
    case "culture_fit": return "bg-warning/10";
    case "hiring_manager": return "bg-success/10";
    case "panel": return "bg-info/10";
  }
}

export function roundTypeEmoji(type: InterviewRoundType): string {
  switch (type) {
    case "phone_screen": return "📞";
    case "technical": return "💻";
    case "system_design": return "🏗️";
    case "behavioral": return "🧠";
    case "culture_fit": return "🤝";
    case "hiring_manager": return "👔";
    case "panel": return "👥";
  }
}

export function roundStatusColor(status: RoundStatus): string {
  switch (status) {
    case "pending": return "text-muted-foreground";
    case "scheduled": return "text-brand";
    case "in_progress": return "text-warning";
    case "completed": return "text-success";
    case "cancelled": return "text-destructive";
  }
}

export function roundStatusBgColor(status: RoundStatus): string {
  switch (status) {
    case "pending": return "bg-secondary";
    case "scheduled": return "bg-brand/10";
    case "in_progress": return "bg-warning/10";
    case "completed": return "bg-success/10";
    case "cancelled": return "bg-destructive/10";
  }
}

export function roundStatusLabel(status: RoundStatus): string {
  switch (status) {
    case "pending": return "Pending";
    case "scheduled": return "Scheduled";
    case "in_progress": return "In Progress";
    case "completed": return "Completed";
    case "cancelled": return "Cancelled";
  }
}

export function recommendationColor(rec: PanelRecommendation): string {
  switch (rec) {
    case "strong_hire": return "text-success";
    case "hire": return "text-success/80";
    case "lean_hire": return "text-brand-teal";
    case "lean_no": return "text-warning";
    case "no_hire": return "text-destructive/80";
    case "strong_no": return "text-destructive";
  }
}

export function recommendationBgColor(rec: PanelRecommendation): string {
  switch (rec) {
    case "strong_hire": return "bg-success/10";
    case "hire": return "bg-success/8";
    case "lean_hire": return "bg-brand-teal/10";
    case "lean_no": return "bg-warning/10";
    case "no_hire": return "bg-destructive/8";
    case "strong_no": return "bg-destructive/10";
  }
}

export function recommendationLabel(rec: PanelRecommendation): string {
  switch (rec) {
    case "strong_hire": return "Strong Hire";
    case "hire": return "Hire";
    case "lean_hire": return "Lean Hire";
    case "lean_no": return "Lean No";
    case "no_hire": return "No Hire";
    case "strong_no": return "Strong No";
  }
}

export function seniorityLabel(s: InterviewerProfile["seniority"]): string {
  switch (s) {
    case "junior": return "Junior";
    case "mid": return "Mid";
    case "senior": return "Senior";
    case "staff": return "Staff";
    case "principal": return "Principal";
  }
}

export function availabilityColor(a: InterviewerProfile["availability"]): string {
  switch (a) {
    case "available": return "text-success";
    case "busy": return "text-warning";
    case "overloaded": return "text-destructive";
  }
}

export function scoreColor(score: number): string {
  if (score >= 85) return "text-success";
  if (score >= 70) return "text-brand-teal";
  if (score >= 55) return "text-brand";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

export function scoreBgColor(score: number): string {
  if (score >= 85) return "bg-success/10";
  if (score >= 70) return "bg-brand-teal/10";
  if (score >= 55) return "bg-brand/10";
  if (score >= 40) return "bg-warning/10";
  return "bg-destructive/10";
}

export function getInterviewerById(id: string): InterviewerProfile | undefined {
  return INTERVIEWERS.find((i) => i.id === id);
}

/* ── Mock Data: Interviewers ── */

export const INTERVIEWERS: InterviewerProfile[] = [
  { id: "int-rk", name: "Rajesh Kumar", initials: "RK", role: "Staff Engineer", department: "Engineering", expertise: ["System Design", "Distributed Systems", "Go", "Kubernetes"], seniority: "staff", interviewLoad: 3, maxLoad: 4, avgFeedbackScore: 4.6, biasScore: 8, totalInterviews: 124, availability: "available" },
  { id: "int-ew", name: "Emily Watson", initials: "EW", role: "Sr. Frontend Engineer", department: "Engineering", expertise: ["React", "TypeScript", "System Design", "Performance"], seniority: "senior", interviewLoad: 2, maxLoad: 3, avgFeedbackScore: 4.8, biasScore: 5, totalInterviews: 89, availability: "available" },
  { id: "int-ml", name: "Marcus Lee", initials: "ML", role: "Engineering Manager", department: "Engineering", expertise: ["Leadership", "Culture Fit", "Team Dynamics", "Behavioral"], seniority: "senior", interviewLoad: 4, maxLoad: 4, avgFeedbackScore: 4.3, biasScore: 12, totalInterviews: 156, availability: "busy" },
  { id: "int-pp", name: "Priya Patel", initials: "PP", role: "Principal Engineer", department: "Platform", expertise: ["System Design", "Architecture", "Scalability", "Data Systems"], seniority: "principal", interviewLoad: 1, maxLoad: 2, avgFeedbackScore: 4.9, biasScore: 3, totalInterviews: 201, availability: "available" },
  { id: "int-ad", name: "Anita Desai", initials: "AD", role: "Data Engineering Lead", department: "Data", expertise: ["Spark", "Data Pipelines", "SQL", "Python", "Delta Lake"], seniority: "senior", interviewLoad: 2, maxLoad: 3, avgFeedbackScore: 4.5, biasScore: 7, totalInterviews: 67, availability: "available" },
  { id: "int-tw", name: "Tom Wilson", initials: "TW", role: "Sr. Backend Engineer", department: "Engineering", expertise: ["Go", "Microservices", "APIs", "Testing"], seniority: "senior", interviewLoad: 3, maxLoad: 3, avgFeedbackScore: 4.2, biasScore: 15, totalInterviews: 92, availability: "overloaded" },
  { id: "int-nt", name: "Nina Torres", initials: "NT", role: "Design Lead", department: "Design", expertise: ["Product Design", "Design Systems", "User Research", "Prototyping"], seniority: "senior", interviewLoad: 1, maxLoad: 3, avgFeedbackScore: 4.7, biasScore: 4, totalInterviews: 45, availability: "available" },
  { id: "int-vs", name: "Vikram Shah", initials: "VS", role: "VP Engineering", department: "Engineering", expertise: ["Leadership", "Strategy", "Org Design", "Culture"], seniority: "principal", interviewLoad: 2, maxLoad: 2, avgFeedbackScore: 4.4, biasScore: 10, totalInterviews: 178, availability: "busy" },
];

/* ── Mock Data: Interview Plans ── */

export const INTERVIEW_PLANS: InterviewPlan[] = [
  {
    id: "plan-001",
    candidateId: "cand-sc",
    candidateName: "Sarah Chen",
    candidateInitials: "SC",
    candidateRole: "Staff Frontend Engineer",
    candidateCompany: "Stripe",
    requisition: "REQ-2024-0072",
    fitScore: 94,
    overallStatus: "decision_pending",
    aiPanelConfidence: 92,
    panelGaps: [],
    panelConflicts: [],
    createdAt: "2026-03-20",
    rounds: [
      {
        id: "r1-001", roundNumber: 1, type: "phone_screen", status: "completed",
        interviewers: [{ interviewerId: "int-ew", isAISuggested: true, reason: "Frontend expertise match" }],
        scheduledAt: "Mar 21, 2:00 PM", duration: 45, score: 88, feedback: "Excellent communication and technical depth",
        aiQuestions: ["Describe your experience with React Server Components", "How do you approach performance optimization?"],
      },
      {
        id: "r2-001", roundNumber: 2, type: "technical", status: "completed",
        interviewers: [
          { interviewerId: "int-ew", isAISuggested: true, reason: "React/TypeScript depth" },
          { interviewerId: "int-rk", isAISuggested: false, reason: "System integration perspective" },
        ],
        scheduledAt: "Mar 23, 10:00 AM", duration: 90, score: 91, feedback: "Outstanding live coding. Built CRDT-based editor from scratch.",
        aiQuestions: ["Implement a real-time collaborative text editor", "Design a component library with theming support"],
      },
      {
        id: "r3-001", roundNumber: 3, type: "system_design", status: "completed",
        interviewers: [{ interviewerId: "int-pp", isAISuggested: true, reason: "Principal-level design evaluation" }],
        scheduledAt: "Mar 25, 11:00 AM", duration: 60, score: 95, feedback: "Best system design interview this quarter. Deep CRDT knowledge.",
        aiQuestions: ["Design a real-time collaboration platform at scale", "How would you handle conflict resolution in distributed state?"],
      },
      {
        id: "r4-001", roundNumber: 4, type: "behavioral", status: "completed",
        interviewers: [{ interviewerId: "int-ml", isAISuggested: true, reason: "Culture fit assessment expertise" }],
        scheduledAt: "Mar 26, 3:00 PM", duration: 45, score: 86, feedback: "Strong leadership signals. Great questions about team dynamics.",
        aiQuestions: ["Tell me about a time you led a difficult technical migration", "How do you handle disagreements with product?"],
      },
    ],
  },
  {
    id: "plan-002",
    candidateId: "cand-mj",
    candidateName: "Marcus Johnson",
    candidateInitials: "MJ",
    candidateRole: "Sr. Data Engineer",
    candidateCompany: "Databricks",
    requisition: "REQ-2024-0091",
    fitScore: 82,
    overallStatus: "in_progress",
    aiPanelConfidence: 78,
    panelGaps: ["No Kubernetes expertise on panel"],
    panelConflicts: [],
    createdAt: "2026-03-22",
    rounds: [
      {
        id: "r1-002", roundNumber: 1, type: "phone_screen", status: "completed",
        interviewers: [{ interviewerId: "int-ad", isAISuggested: true, reason: "Data engineering domain match" }],
        scheduledAt: "Mar 23, 10:00 AM", duration: 30, score: 80, feedback: "Solid fundamentals, good Databricks background",
        aiQuestions: ["Walk me through your data pipeline architecture", "How do you handle schema evolution?"],
      },
      {
        id: "r2-002", roundNumber: 2, type: "technical", status: "completed",
        interviewers: [
          { interviewerId: "int-ad", isAISuggested: true, reason: "Spark expertise" },
          { interviewerId: "int-tw", isAISuggested: false, reason: "Backend systems perspective" },
        ],
        scheduledAt: "Mar 25, 2:00 PM", duration: 90, score: 84, feedback: "Good problem-solving. Communication could be more concise.",
        aiQuestions: ["Optimize a slow Spark job processing 10TB daily", "Design a data quality monitoring system"],
      },
      {
        id: "r3-002", roundNumber: 3, type: "system_design", status: "scheduled",
        interviewers: [{ interviewerId: "int-pp", isAISuggested: true, reason: "Data systems architecture" }],
        scheduledAt: "Mar 28, 11:00 AM", duration: 60, score: null, feedback: null,
        aiQuestions: ["Design a real-time data ingestion pipeline", "How would you migrate from batch to streaming?"],
      },
      {
        id: "r4-002", roundNumber: 4, type: "hiring_manager", status: "pending",
        interviewers: [{ interviewerId: "int-ml", isAISuggested: true, reason: "Final team fit evaluation" }],
        scheduledAt: null, duration: 45, score: null, feedback: null,
        aiQuestions: ["What excites you about this role?", "How do you prioritize competing technical demands?"],
      },
    ],
  },
  {
    id: "plan-003",
    candidateId: "cand-dk",
    candidateName: "David Kim",
    candidateInitials: "DK",
    candidateRole: "VP Engineering",
    candidateCompany: "Meta",
    requisition: "REQ-2024-0065",
    fitScore: 61,
    overallStatus: "decision_pending",
    aiPanelConfidence: 55,
    panelGaps: [],
    panelConflicts: ["Split panel on leadership philosophy", "Same-team bias risk: 2 interviewers from Engineering"],
    createdAt: "2026-03-18",
    rounds: [
      {
        id: "r1-003", roundNumber: 1, type: "phone_screen", status: "completed",
        interviewers: [{ interviewerId: "int-vs", isAISuggested: true, reason: "VP-level initial screen" }],
        scheduledAt: "Mar 19, 4:00 PM", duration: 45, score: 75, feedback: "Strong credentials but some concern about management style alignment",
        aiQuestions: ["How do you approach building engineering culture?", "Describe your ideal team structure"],
      },
      {
        id: "r2-003", roundNumber: 2, type: "system_design", status: "completed",
        interviewers: [
          { interviewerId: "int-rk", isAISuggested: true, reason: "Technical depth evaluation" },
          { interviewerId: "int-pp", isAISuggested: true, reason: "Architecture vision assessment" },
        ],
        scheduledAt: "Mar 21, 10:00 AM", duration: 90, score: 78, feedback: "Good architecture knowledge. Tends toward over-engineering.",
        aiQuestions: ["Design the technical strategy for a platform migration", "How do you balance tech debt vs. feature velocity?"],
      },
      {
        id: "r3-003", roundNumber: 3, type: "behavioral", status: "completed",
        interviewers: [
          { interviewerId: "int-ml", isAISuggested: true, reason: "Leadership assessment" },
          { interviewerId: "int-vs", isAISuggested: true, reason: "Executive alignment" },
        ],
        scheduledAt: "Mar 24, 2:00 PM", duration: 60, score: 58, feedback: "Significant divergence in leadership philosophy. Panel split.",
        aiQuestions: ["How do you handle autonomous vs. directed teams?", "Describe a time you transformed an engineering org"],
      },
    ],
  },
];

/* ── Mock Data: Panel Alignment ── */

export const PANEL_ALIGNMENTS: Record<string, PanelAlignment> = {
  "plan-001": {
    votes: [
      { interviewerId: "int-rk", roundId: "r2-001", recommendation: "strong_hire", score: 91, strengths: ["Deep distributed systems knowledge", "Exceptional live coding"], concerns: [], notes: "Best system design interview I've conducted this year." },
      { interviewerId: "int-ew", roundId: "r2-001", recommendation: "strong_hire", score: 88, strengths: ["React/TypeScript mastery", "Strong mentorship signals"], concerns: [], notes: "Exceptional depth. Would immediately elevate the team." },
      { interviewerId: "int-pp", roundId: "r3-001", recommendation: "strong_hire", score: 95, strengths: ["CRDT expertise", "Scalability thinking", "Clear communication"], concerns: [], notes: "Highest system design score this quarter." },
      { interviewerId: "int-ml", roundId: "r4-001", recommendation: "hire", score: 86, strengths: ["Culture fit", "Leadership potential"], concerns: ["Long-term interest in management track"], notes: "Slight concern about retention if no management path available." },
    ],
    agreementScore: 95,
    hasConflict: false,
    conflictExplanation: null,
    aiSynthesis: "Unanimous positive signal across all rounds. Sarah Chen demonstrates exceptional technical depth combined with strong leadership potential. The only minor concern is long-term retention if a management track isn't available, but this is a standard consideration for staff-level hires. Recommendation: proceed to offer immediately given the competing Vercel offer.",
    aiRecommendation: "strong_hire",
    aiConfidence: 96,
  },
  "plan-003": {
    votes: [
      { interviewerId: "int-vs", roundId: "r1-003", recommendation: "lean_hire", score: 75, strengths: ["Impressive scale experience", "Strong network"], concerns: ["Management style alignment", "Compensation expectations"], notes: "CTO interview — scored 3/5 with alignment concerns." },
      { interviewerId: "int-rk", roundId: "r2-003", recommendation: "hire", score: 78, strengths: ["Architecture knowledge", "Meta-scale experience"], concerns: ["Tendency toward over-engineering"], notes: "Good technical depth but may bring unnecessary complexity." },
      { interviewerId: "int-pp", roundId: "r2-003", recommendation: "lean_no", score: 65, strengths: ["Technical breadth"], concerns: ["Vision doesn't align with platform direction", "Over-centralized architecture thinking"], notes: "Concerned about fit with our decentralized platform philosophy." },
      { interviewerId: "int-ml", roundId: "r3-003", recommendation: "no_hire", score: 52, strengths: [], concerns: ["Top-down management conflicts with culture", "Would disrupt team dynamics"], notes: "Cultural misfit. Very command-and-control oriented." },
    ],
    agreementScore: 35,
    hasConflict: true,
    conflictExplanation: "Panel is split on leadership philosophy. Technical evaluators give moderate positive signals based on Meta-scale experience, but leadership evaluators flag significant cultural misalignment. The core disagreement centers on David's preference for top-down management versus the organization's autonomous team philosophy. At VP level, this is a critical cultural risk that outweighs technical credentials.",
    aiSynthesis: "Despite impressive credentials (200+ engineer management at Meta), the panel reveals a fundamental cultural misalignment. Technical scores are adequate but not exceptional for VP level. The leadership round produced the lowest scores, which is a strong negative signal for a VP hire. Recommendation: reject with respectful close — maintaining the relationship is important given his industry standing.",
    aiRecommendation: "no_hire",
    aiConfidence: 78,
  },
};

/* ── Mock Data: Schedule Slots ── */

export const SCHEDULE_SLOTS: ScheduleSlot[] = [
  { id: "slot-1", date: "Mon, Mar 30", time: "10:00 AM – 11:00 AM", interviewerIds: ["int-pp"], isAISuggested: true, conflictReason: null, score: 95 },
  { id: "slot-2", date: "Mon, Mar 30", time: "2:00 PM – 3:00 PM", interviewerIds: ["int-pp"], isAISuggested: true, conflictReason: null, score: 88 },
  { id: "slot-3", date: "Tue, Mar 31", time: "11:00 AM – 12:00 PM", interviewerIds: ["int-pp"], isAISuggested: false, conflictReason: null, score: 82 },
  { id: "slot-4", date: "Tue, Mar 31", time: "3:00 PM – 4:00 PM", interviewerIds: ["int-pp", "int-rk"], isAISuggested: true, conflictReason: null, score: 90 },
  { id: "slot-5", date: "Wed, Apr 1", time: "10:00 AM – 11:00 AM", interviewerIds: ["int-pp"], isAISuggested: false, conflictReason: "Interviewer has team standup", score: 60 },
  { id: "slot-6", date: "Wed, Apr 1", time: "2:00 PM – 3:00 PM", interviewerIds: ["int-rk"], isAISuggested: false, conflictReason: "Outside SLA window", score: 45 },
];
