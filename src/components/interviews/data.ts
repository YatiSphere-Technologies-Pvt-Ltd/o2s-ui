/* ================================================================
   O2S Interview Management — Types & Mock Data
   ================================================================ */

export type InterviewTab = "schedule" | "feedback" | "kits" | "debriefs" | "interviewers" | "analytics";

export const INTERVIEW_TABS: { key: InterviewTab; label: string }[] = [
  { key: "schedule", label: "Schedule" },
  { key: "feedback", label: "Feedback & Scorecards" },
  { key: "kits", label: "Interview Kits" },
  { key: "debriefs", label: "Debriefs" },
  { key: "interviewers", label: "Interviewers" },
  { key: "analytics", label: "Analytics" },
];

/* ── Scheduled Interviews ── */

export interface ScheduledInterview {
  id: string;
  candidate: string;
  candidateInitials: string;
  role: string;
  type: string;
  interviewer: string;
  date: string;
  time: string;
  duration: string;
  platform: string;
  status: "scheduled" | "completed" | "cancelled" | "in_progress";
  day: string;
}

export const SCHEDULED_INTERVIEWS: ScheduledInterview[] = [
  { id: "si1", candidate: "Marcus Chen", candidateInitials: "MC", role: "Sr Backend Eng", type: "Technical", interviewer: "Sarah Kumar", date: "Mar 25", time: "9:00 AM", duration: "60 min", platform: "Zoom", status: "completed", day: "Tue" },
  { id: "si2", candidate: "Priya Sharma", candidateInitials: "PS", role: "Sr Frontend Eng", type: "Behavioral", interviewer: "John Rodriguez", date: "Mar 25", time: "10:30 AM", duration: "45 min", platform: "Zoom", status: "completed", day: "Tue" },
  { id: "si3", candidate: "Lisa Park", candidateInitials: "LP", role: "Product Designer", type: "Portfolio Review", interviewer: "David Kim", date: "Mar 26", time: "9:00 AM", duration: "60 min", platform: "Google Meet", status: "scheduled", day: "Wed" },
  { id: "si4", candidate: "Jordan Lee", candidateInitials: "JL", role: "DevOps Engineer", type: "Technical", interviewer: "Alex Torres", date: "Mar 26", time: "10:30 AM", duration: "90 min", platform: "Zoom", status: "scheduled", day: "Wed" },
  { id: "si5", candidate: "Casey Davis", candidateInitials: "CD", role: "Sr Frontend Eng", type: "System Design", interviewer: "Sarah Kumar", date: "Mar 26", time: "2:00 PM", duration: "60 min", platform: "Zoom", status: "scheduled", day: "Wed" },
  { id: "si6", candidate: "Marcus Chen", candidateInitials: "MC", role: "Sr Backend Eng", type: "Hiring Manager", interviewer: "Rajesh Kumar", date: "Mar 27", time: "11:00 AM", duration: "45 min", platform: "Zoom", status: "scheduled", day: "Thu" },
  { id: "si7", candidate: "Priya Sharma", candidateInitials: "PS", role: "Sr Frontend Eng", type: "Culture Fit", interviewer: "Elena Volkov", date: "Mar 27", time: "2:00 PM", duration: "45 min", platform: "Google Meet", status: "scheduled", day: "Thu" },
  { id: "si8", candidate: "Aisha Khan", candidateInitials: "AK", role: "Full-Stack Eng", type: "Phone Screen", interviewer: "Sarah Kumar", date: "Mar 28", time: "9:00 AM", duration: "30 min", platform: "Zoom", status: "scheduled", day: "Fri" },
];

export const INTERVIEW_TYPE_CONFIG: Record<string, { colorClass: string; icon: string }> = {
  "Phone Screen": { colorClass: "bg-brand-teal", icon: "📞" },
  Technical: { colorClass: "bg-brand-purple", icon: "💻" },
  "System Design": { colorClass: "bg-info", icon: "🏗️" },
  Behavioral: { colorClass: "bg-warning", icon: "🎯" },
  "Culture Fit": { colorClass: "bg-success", icon: "👥" },
  "Hiring Manager": { colorClass: "bg-brand", icon: "👔" },
  "Portfolio Review": { colorClass: "bg-brand-purple", icon: "🎨" },
  Panel: { colorClass: "bg-destructive", icon: "👥" },
};

/* ── Feedback / Scorecards ── */

export interface Scorecard {
  id: string;
  candidate: string;
  candidateInitials: string;
  role: string;
  type: string;
  interviewer: string;
  status: "pending" | "completed" | "overdue";
  submittedDate: string | null;
  interviewDate: string;
  recommendation: string | null;
  hireConfidence: number | null;
  ratings: { criterion: string; score: number }[];
  overdueDays?: number;
}

export const SCORECARDS: Scorecard[] = [
  { id: "sc1", candidate: "Marcus Chen", candidateInitials: "MC", role: "Sr Backend Eng", type: "Technical", interviewer: "Sarah Kumar", status: "completed", submittedDate: "1 hour ago", interviewDate: "Mar 25", recommendation: "Strong Yes", hireConfidence: 88, ratings: [{ criterion: "Technical Depth", score: 5 }, { criterion: "Problem Solving", score: 4 }, { criterion: "Communication", score: 3 }, { criterion: "Teamwork", score: 4 }] },
  { id: "sc2", candidate: "Marcus Chen", candidateInitials: "MC", role: "Sr Backend Eng", type: "System Design", interviewer: "Alex Torres", status: "completed", submittedDate: "3 hours ago", interviewDate: "Mar 24", recommendation: "Yes", hireConfidence: 82, ratings: [{ criterion: "Architecture", score: 4 }, { criterion: "Scalability", score: 5 }, { criterion: "Trade-offs", score: 4 }] },
  { id: "sc3", candidate: "Priya Sharma", candidateInitials: "PS", role: "Sr Frontend Eng", type: "Behavioral", interviewer: "John Rodriguez", status: "pending", submittedDate: null, interviewDate: "Mar 25", recommendation: null, hireConfidence: null, ratings: [], overdueDays: 0 },
  { id: "sc4", candidate: "Lisa Park", candidateInitials: "LP", role: "Product Designer", type: "Portfolio Review", interviewer: "David Kim", status: "overdue", submittedDate: null, interviewDate: "Mar 22", recommendation: null, hireConfidence: null, ratings: [], overdueDays: 3 },
  { id: "sc5", candidate: "Casey Davis", candidateInitials: "CD", role: "Sr Frontend Eng", type: "Phone Screen", interviewer: "Elena Volkov", status: "completed", submittedDate: "Yesterday", interviewDate: "Mar 23", recommendation: "Yes", hireConfidence: 76, ratings: [{ criterion: "Communication", score: 4 }, { criterion: "Technical Basics", score: 4 }, { criterion: "Enthusiasm", score: 5 }] },
  { id: "sc6", candidate: "Jordan Lee", candidateInitials: "JL", role: "DevOps Engineer", type: "Technical", interviewer: "Alex Torres", status: "overdue", submittedDate: null, interviewDate: "Mar 21", recommendation: null, hireConfidence: null, ratings: [], overdueDays: 4 },
];

export const REC_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string }> = {
  "Strong Yes": { label: "Strong Yes", colorClass: "text-success", bgClass: "bg-success/10" },
  Yes: { label: "Yes", colorClass: "text-brand-teal", bgClass: "bg-brand-teal/10" },
  Neutral: { label: "Neutral", colorClass: "text-warning", bgClass: "bg-warning/10" },
  No: { label: "No", colorClass: "text-destructive", bgClass: "bg-destructive/10" },
  "Strong No": { label: "Strong No", colorClass: "text-destructive", bgClass: "bg-destructive/15" },
};

/* ── Interview Kits ── */

export interface InterviewKit {
  id: string;
  name: string;
  type: string;
  icon: string;
  duration: string;
  questionCount: number;
  usedCount: number;
  lastUpdated: string;
}

export const INTERVIEW_KITS: InterviewKit[] = [
  { id: "ik1", name: "Phone Screen", type: "Phone Screen", icon: "📞", duration: "30–45 min", questionCount: 8, usedCount: 24, lastUpdated: "Mar 20" },
  { id: "ik2", name: "Technical Interview", type: "Technical", icon: "💻", duration: "60–90 min", questionCount: 12, usedCount: 18, lastUpdated: "Mar 18" },
  { id: "ik3", name: "System Design", type: "System Design", icon: "🏗️", duration: "60 min", questionCount: 6, usedCount: 14, lastUpdated: "Mar 15" },
  { id: "ik4", name: "Behavioral Interview", type: "Behavioral", icon: "🎯", duration: "45–60 min", questionCount: 10, usedCount: 16, lastUpdated: "Mar 12" },
  { id: "ik5", name: "Culture Fit", type: "Culture Fit", icon: "👥", duration: "45 min", questionCount: 8, usedCount: 12, lastUpdated: "Mar 10" },
  { id: "ik6", name: "Hiring Manager", type: "Hiring Manager", icon: "👔", duration: "45 min", questionCount: 10, usedCount: 10, lastUpdated: "Mar 8" },
  { id: "ik7", name: "Portfolio Review (Design)", type: "Portfolio Review", icon: "🎨", duration: "60 min", questionCount: 8, usedCount: 6, lastUpdated: "Mar 5" },
  { id: "ik8", name: "Executive Panel", type: "Panel", icon: "👥", duration: "90 min", questionCount: 15, usedCount: 4, lastUpdated: "Feb 28" },
];

/* ── Debriefs ── */

export interface Debrief {
  id: string;
  candidate: string;
  candidateInitials: string;
  role: string;
  status: "pending" | "in_progress" | "completed";
  scorecardsSubmitted: number;
  scorecardsTotal: number;
  aiCompositeScore: number | null;
  aiRecommendation: string | null;
  interviewerScores: { name: string; type: string; score: number }[];
  decision: string | null;
  decidedBy: string | null;
  decidedDate: string | null;
  aiSummary: string | null;
}

export const DEBRIEFS: Debrief[] = [
  { id: "d1", candidate: "Marcus Chen", candidateInitials: "MC", role: "Sr Backend Eng", status: "pending", scorecardsSubmitted: 3, scorecardsTotal: 3, aiCompositeScore: 86, aiRecommendation: "Strong Yes", interviewerScores: [{ name: "Sarah Kumar", type: "Phone Screen", score: 82 }, { name: "Alex Torres", type: "Technical", score: 88 }, { name: "Elena Volkov", type: "System Design", score: 84 }], decision: null, decidedBy: null, decidedDate: null, aiSummary: "Strong technical foundation with excellent system design skills. Communication could be stronger. Recommend advancing to offer." },
  { id: "d2", candidate: "Priya Sharma", candidateInitials: "PS", role: "Sr Frontend Eng", status: "completed", scorecardsSubmitted: 2, scorecardsTotal: 2, aiCompositeScore: 91, aiRecommendation: "Strong Yes", interviewerScores: [{ name: "Sarah Kumar", type: "Technical", score: 92 }, { name: "John Rodriguez", type: "Behavioral", score: 88 }], decision: "Advance", decidedBy: "Sarah Kumar", decidedDate: "Mar 25", aiSummary: "Exceptional frontend skills with strong leadership qualities. Top candidate for the role." },
  { id: "d3", candidate: "Casey Davis", candidateInitials: "CD", role: "Sr Frontend Eng", status: "pending", scorecardsSubmitted: 1, scorecardsTotal: 2, aiCompositeScore: null, aiRecommendation: null, interviewerScores: [{ name: "Elena Volkov", type: "Phone Screen", score: 76 }], decision: null, decidedBy: null, decidedDate: null, aiSummary: null },
  { id: "d4", candidate: "Lisa Park", candidateInitials: "LP", role: "Product Designer", status: "pending", scorecardsSubmitted: 0, scorecardsTotal: 2, aiCompositeScore: null, aiRecommendation: null, interviewerScores: [], decision: null, decidedBy: null, decidedDate: null, aiSummary: null },
];

/* ── Interviewers ── */

export interface Interviewer {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  interviewTypes: string[];
  thisWeek: number;
  thisMonth: number;
  maxPerWeek: number;
  avgScore: number;
  avgFeedbackTime: string;
  status: "available" | "busy" | "overloaded";
}

export const INTERVIEWERS: Interviewer[] = [
  { id: "iv1", name: "Sarah Kumar", initials: "SK", role: "Staff Engineer", department: "Engineering", interviewTypes: ["Technical", "Phone Screen", "System Design"], thisWeek: 4, thisMonth: 14, maxPerWeek: 5, avgScore: 4.2, avgFeedbackTime: "4 hrs", status: "busy" },
  { id: "iv2", name: "Alex Torres", initials: "AT", role: "Senior Engineer", department: "Engineering", interviewTypes: ["Technical", "System Design"], thisWeek: 3, thisMonth: 10, maxPerWeek: 4, avgScore: 4.5, avgFeedbackTime: "2 hrs", status: "available" },
  { id: "iv3", name: "John Rodriguez", initials: "JR", role: "Engineering Manager", department: "Engineering", interviewTypes: ["Behavioral", "Hiring Manager"], thisWeek: 2, thisMonth: 8, maxPerWeek: 4, avgScore: 3.8, avgFeedbackTime: "8 hrs", status: "available" },
  { id: "iv4", name: "Elena Volkov", initials: "EV", role: "Senior Engineer", department: "Engineering", interviewTypes: ["Technical", "Culture Fit", "Phone Screen"], thisWeek: 5, thisMonth: 16, maxPerWeek: 5, avgScore: 4.0, avgFeedbackTime: "6 hrs", status: "overloaded" },
  { id: "iv5", name: "David Kim", initials: "DK", role: "Design Lead", department: "Design", interviewTypes: ["Portfolio Review", "Culture Fit"], thisWeek: 1, thisMonth: 4, maxPerWeek: 3, avgScore: 4.7, avgFeedbackTime: "3 hrs", status: "available" },
  { id: "iv6", name: "Rajesh Kumar", initials: "RK", role: "VP Engineering", department: "Engineering", interviewTypes: ["Hiring Manager", "Panel"], thisWeek: 2, thisMonth: 6, maxPerWeek: 3, avgScore: 4.1, avgFeedbackTime: "12 hrs", status: "available" },
  { id: "iv7", name: "Maya Desai", initials: "MD", role: "Product Manager", department: "Product", interviewTypes: ["Behavioral", "Culture Fit"], thisWeek: 1, thisMonth: 5, maxPerWeek: 3, avgScore: 4.3, avgFeedbackTime: "5 hrs", status: "available" },
  { id: "iv8", name: "Tom Liu", initials: "TL", role: "Senior Engineer", department: "Engineering", interviewTypes: ["Technical", "System Design"], thisWeek: 3, thisMonth: 11, maxPerWeek: 4, avgScore: 4.4, avgFeedbackTime: "3 hrs", status: "busy" },
];

/* ── Analytics ── */

export const INTERVIEW_ANALYTICS_KPIS = [
  { label: "Interviews This Week", value: "24", trend: "+4 vs last week", positive: true },
  { label: "Avg Feedback Time", value: "5.2 hrs", trend: "-1.5 hrs vs Q3", positive: true },
  { label: "Scorecard Completion", value: "87%", trend: "+3% vs last month", positive: true },
  { label: "Candidate NPS", value: "72", trend: "+8 vs Q3", positive: true },
  { label: "Interviews per Hire", value: "3.2", trend: "-0.4 vs benchmark", positive: true },
];

export const INTERVIEWER_LOAD = [
  { name: "Elena Volkov", load: 5, max: 5, status: "overloaded" as const },
  { name: "Sarah Kumar", load: 4, max: 5, status: "busy" as const },
  { name: "Tom Liu", load: 3, max: 4, status: "busy" as const },
  { name: "Alex Torres", load: 3, max: 4, status: "available" as const },
  { name: "John Rodriguez", load: 2, max: 4, status: "available" as const },
  { name: "Rajesh Kumar", load: 2, max: 3, status: "available" as const },
];

/* ── Counts ── */

export const INTERVIEW_COUNTS = {
  upcoming: SCHEDULED_INTERVIEWS.filter((i) => i.status === "scheduled").length,
  completed: SCHEDULED_INTERVIEWS.filter((i) => i.status === "completed").length,
  pendingDebriefs: DEBRIEFS.filter((d) => d.status === "pending").length,
  overdueFeedback: SCORECARDS.filter((s) => s.status === "overdue").length,
  pendingFeedback: SCORECARDS.filter((s) => s.status === "pending").length,
};

/* ── Helpers ── */

export function loadColor(status: string): string {
  if (status === "overloaded") return "text-destructive";
  if (status === "busy") return "text-warning";
  return "text-success";
}

export function loadBarColor(status: string): string {
  if (status === "overloaded") return "bg-destructive";
  if (status === "busy") return "bg-warning";
  return "bg-success";
}

export function confidenceColor(conf: number | null): string {
  if (conf === null) return "text-muted-foreground";
  if (conf >= 85) return "text-success";
  if (conf >= 70) return "text-brand-teal";
  if (conf >= 55) return "text-warning";
  return "text-destructive";
}
