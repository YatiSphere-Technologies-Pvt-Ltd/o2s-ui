/* ================================================================
   O2S Talent Acquisition — Shared Journey Data & Types
   The connective tissue across all TA pages
   ================================================================ */

export type JourneyStatus = "draft" | "pending_approval" | "approved" | "sourcing" | "interviewing" | "offer_stage" | "filled" | "cancelled" | "on_hold";
export type PipelineStage = "applied" | "screened" | "interview" | "final_round" | "offer" | "hired";
export type TAPage = "pipeline" | "requisitions" | "pool" | "vendors" | "interviews" | "candidates";

export interface JourneyMilestone {
  type: string;
  timestamp: string;
  actor: string;
}

export interface HiringJourney {
  id: string;
  requisitionId: string;
  jobId: string | null;
  jobTitle: string;
  department: string;
  level: string;
  location: string;
  hiringManager: string;
  status: JourneyStatus;
  daysOpen: number;
  totalCandidates: number;
  activeCandidates: number;
  candidatesByStage: Record<PipelineStage, number>;
  interviewsScheduled: number;
  interviewsCompleted: number;
  offersExtended: number;
  offersAccepted: number;
  healthScore: number;
  bottleneck: string | null;
  riskFlags: string[];
  milestones: JourneyMilestone[];
}

/* ── Journey Stage Config ── */

export const JOURNEY_STAGES = [
  { key: "requisition", label: "Requisition", page: "requisitions" as TAPage },
  { key: "job_posted", label: "Job Posted", page: "pipeline" as TAPage },
  { key: "pipeline", label: "Pipeline", page: "pipeline" as TAPage },
  { key: "interviews", label: "Interviews", page: "interviews" as TAPage },
  { key: "offers", label: "Offers", page: "candidates" as TAPage },
  { key: "handoff", label: "Handoff", page: "candidates" as TAPage },
] as const;

export function journeyStageStatus(journey: HiringJourney): Record<string, "completed" | "active" | "pending"> {
  const s = journey.status;
  return {
    requisition: "completed",
    job_posted: journey.jobId ? "completed" : s === "pending_approval" || s === "draft" ? "pending" : "completed",
    pipeline: s === "sourcing" || s === "interviewing" ? "active" : s === "offer_stage" || s === "filled" ? "completed" : "pending",
    interviews: s === "interviewing" ? "active" : s === "offer_stage" || s === "filled" ? "completed" : "pending",
    offers: s === "offer_stage" ? "active" : s === "filled" ? "completed" : "pending",
    handoff: s === "filled" ? "completed" : "pending",
  };
}

/* ── Health Score Colors ── */

export function healthColor(score: number): string {
  if (score >= 81) return "text-success";
  if (score >= 61) return "text-brand";
  if (score >= 31) return "text-warning";
  return "text-destructive";
}

export function healthBgColor(score: number): string {
  if (score >= 81) return "bg-success";
  if (score >= 61) return "bg-brand";
  if (score >= 31) return "bg-warning";
  return "bg-destructive";
}

export function healthLabel(score: number): string {
  if (score >= 81) return "Excellent";
  if (score >= 61) return "Good";
  if (score >= 31) return "At Risk";
  return "Critical";
}

/* ── TA Sub-Nav Config ── */

export const TA_SUB_NAV: { key: TAPage; label: string; href: string }[] = [
  { key: "pipeline", label: "Pipeline", href: "/talent" },
  { key: "requisitions", label: "Requisitions", href: "/requisitions" },
  { key: "pool", label: "Talent Pool", href: "/talent-pool" },
  { key: "vendors" as TAPage, label: "Vendors", href: "/vendors" },
  { key: "interviews", label: "Interviews", href: "/interviews" },
  { key: "candidates", label: "Candidates", href: "/candidates" },
];

/* ── Mock Journeys ── */

export const MOCK_JOURNEYS: HiringJourney[] = [
  {
    id: "journey-001", requisitionId: "REQ-2026-001", jobId: "JOB-001",
    jobTitle: "Senior Frontend Engineer", department: "Engineering", level: "IC4", location: "Remote",
    hiringManager: "Rajesh Kumar", status: "interviewing", daysOpen: 54,
    totalCandidates: 47, activeCandidates: 30,
    candidatesByStage: { applied: 47, screened: 18, interview: 8, final_round: 3, offer: 1, hired: 0 },
    interviewsScheduled: 5, interviewsCompleted: 12, offersExtended: 1, offersAccepted: 0,
    healthScore: 78, bottleneck: "Interview scheduling — 3 candidates waiting 5+ days",
    riskFlags: ["interview_scheduling_delay"],
    milestones: [
      { type: "requisition_created", timestamp: "Jan 15", actor: "Rajesh Kumar" },
      { type: "approved", timestamp: "Jan 21", actor: "VP Engineering" },
      { type: "job_posted", timestamp: "Jan 24", actor: "AI Recruiter Agent" },
      { type: "first_application", timestamp: "Jan 26", actor: "System" },
      { type: "offer_extended", timestamp: "Mar 20", actor: "Rajesh Kumar" },
    ],
  },
  {
    id: "journey-002", requisitionId: "REQ-2026-007", jobId: "JOB-007",
    jobTitle: "DevOps Lead", department: "Infrastructure", level: "IC5", location: "Hybrid",
    hiringManager: "Anil Singh", status: "sourcing", daysOpen: 15,
    totalCandidates: 12, activeCandidates: 10,
    candidatesByStage: { applied: 12, screened: 4, interview: 1, final_round: 0, offer: 0, hired: 0 },
    interviewsScheduled: 1, interviewsCompleted: 0, offersExtended: 0, offersAccepted: 0,
    healthScore: 34, bottleneck: "Low candidate volume — need more sourcing",
    riskFlags: ["low_pipeline_volume"],
    milestones: [
      { type: "requisition_created", timestamp: "Mar 11", actor: "Anil Singh" },
      { type: "approved", timestamp: "Mar 14", actor: "CTO" },
      { type: "job_posted", timestamp: "Mar 16", actor: "AI Recruiter Agent" },
    ],
  },
  {
    id: "journey-003", requisitionId: "REQ-2026-003", jobId: "JOB-003",
    jobTitle: "Product Designer", department: "Design", level: "IC3", location: "Bangalore",
    hiringManager: "Lisa Park", status: "interviewing", daysOpen: 30,
    totalCandidates: 23, activeCandidates: 15,
    candidatesByStage: { applied: 23, screened: 12, interview: 5, final_round: 2, offer: 0, hired: 0 },
    interviewsScheduled: 3, interviewsCompleted: 7, offersExtended: 0, offersAccepted: 0,
    healthScore: 91, bottleneck: null, riskFlags: [],
    milestones: [
      { type: "requisition_created", timestamp: "Feb 24", actor: "Lisa Park" },
      { type: "approved", timestamp: "Feb 27", actor: "Design Director" },
      { type: "job_posted", timestamp: "Mar 1", actor: "AI Recruiter Agent" },
    ],
  },
  {
    id: "journey-004", requisitionId: "REQ-2026-015", jobId: null,
    jobTitle: "Marketing Manager", department: "Marketing", level: "IC3", location: "Mumbai",
    hiringManager: "James Wright", status: "pending_approval", daysOpen: 3,
    totalCandidates: 0, activeCandidates: 0,
    candidatesByStage: { applied: 0, screened: 0, interview: 0, final_round: 0, offer: 0, hired: 0 },
    interviewsScheduled: 0, interviewsCompleted: 0, offersExtended: 0, offersAccepted: 0,
    healthScore: 50, bottleneck: "Awaiting VP approval (3 days)",
    riskFlags: ["approval_delay"],
    milestones: [
      { type: "requisition_created", timestamp: "Mar 23", actor: "James Wright" },
      { type: "approval_submitted", timestamp: "Mar 23", actor: "James Wright" },
    ],
  },
];

export const ACTIVE_JOURNEYS = MOCK_JOURNEYS.filter((j) => j.status !== "filled" && j.status !== "cancelled");
export const TOTAL_CANDIDATES_ALL = MOCK_JOURNEYS.reduce((s, j) => s + j.totalCandidates, 0);
export const TOTAL_INTERVIEWING = MOCK_JOURNEYS.reduce((s, j) => s + j.candidatesByStage.interview + j.candidatesByStage.final_round, 0);
export const TOTAL_OFFERS = MOCK_JOURNEYS.reduce((s, j) => s + j.offersExtended, 0);
