/* ================================================================
   Interview Arena — Types, Mock Data & Helpers
   BookMyShow-style interactive scheduling grid
   ================================================================ */

/* ── Types ── */

export type SlotStatus = "empty" | "booked" | "blocked" | "ai_suggested";
export type RoundType = "dsa" | "system_design" | "behavioral" | "culture_fit" | "hiring_manager" | "phone_screen";
export type CandidateStage = "round_1" | "round_2" | "round_3" | "final";
export type CandidatePriority = "urgent" | "high" | "normal" | "low";

export type AvailabilitySource = "calendar_sync" | "manual" | "link";
export type DayOfWeek = "mon" | "tue" | "wed" | "thu" | "fri";

export interface AvailabilityPreference {
  maxInterviewsPerWeek: number;
  maxInterviewsPerDay: number;
  minGapMinutes: number;
  preferredTimes: string[];
  blockedTimes: string[];
  source: AvailabilitySource;
  calendarConnected: boolean;
  lastSynced: string | null;
}

export interface ArenaInterviewer {
  id: string;
  name: string;
  initials: string;
  role: string;
  skills: string[];
  load: number;
  maxLoad: number;
  availability: string[];
  availabilityPreference: AvailabilityPreference;
}

export interface InterviewSlot {
  id: string;
  interviewerId: string;
  time: string;
  status: SlotStatus;
  candidateId: string | null;
  candidateName: string | null;
  candidateInitials: string | null;
  roundType: RoundType | null;
  fitScore: number | null;
  aiScore: number | null;
  conflictReason: string | null;
}

export interface ArenaCandidate {
  id: string;
  name: string;
  initials: string;
  role: string;
  stage: CandidateStage;
  priority: CandidatePriority;
  fitScore: number;
  requiredRoundType: RoundType;
  preferredInterviewerSkills: string[];
}

/* ── Helpers ── */

export function roundTypeLabel(type: RoundType): string {
  switch (type) {
    case "dsa": return "DSA";
    case "system_design": return "System Design";
    case "behavioral": return "Behavioral";
    case "culture_fit": return "Culture Fit";
    case "hiring_manager": return "HM";
    case "phone_screen": return "Phone";
  }
}

export function roundTypeColor(type: RoundType): string {
  switch (type) {
    case "dsa": return "text-brand";
    case "system_design": return "text-brand-purple";
    case "behavioral": return "text-brand-teal";
    case "culture_fit": return "text-warning";
    case "hiring_manager": return "text-success";
    case "phone_screen": return "text-muted-foreground";
  }
}

export function roundTypeBgColor(type: RoundType): string {
  switch (type) {
    case "dsa": return "bg-brand/15";
    case "system_design": return "bg-brand-purple/15";
    case "behavioral": return "bg-brand-teal/15";
    case "culture_fit": return "bg-warning/15";
    case "hiring_manager": return "bg-success/15";
    case "phone_screen": return "bg-secondary";
  }
}

export function stageLabel(stage: CandidateStage): string {
  switch (stage) {
    case "round_1": return "R1";
    case "round_2": return "R2";
    case "round_3": return "R3";
    case "final": return "Final";
  }
}

export function priorityColor(p: CandidatePriority): string {
  switch (p) {
    case "urgent": return "text-destructive";
    case "high": return "text-warning";
    case "normal": return "text-brand";
    case "low": return "text-muted-foreground";
  }
}

export function priorityBgColor(p: CandidatePriority): string {
  switch (p) {
    case "urgent": return "bg-destructive/10";
    case "high": return "bg-warning/10";
    case "normal": return "bg-brand/10";
    case "low": return "bg-secondary";
  }
}

export function scoreColor(s: number): string {
  if (s >= 85) return "text-success";
  if (s >= 70) return "text-brand-teal";
  if (s >= 55) return "text-brand";
  if (s >= 40) return "text-warning";
  return "text-destructive";
}

export function loadColor(load: number, max: number): string {
  const pct = load / max;
  if (pct >= 1) return "text-destructive";
  if (pct >= 0.75) return "text-warning";
  return "text-success";
}

/* ── Constants ── */

export const TIME_SLOTS = [
  "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "1:00", "1:30", "2:00", "2:30",
  "3:00", "3:30", "4:00", "4:30", "5:00", "5:30",
];

/* ── Mock Data: Interviewers ── */

export const ARENA_INTERVIEWERS: ArenaInterviewer[] = [
  { id: "ai-rk", name: "Rajesh Kumar", initials: "RK", role: "Staff Engineer", skills: ["System Design", "Go", "Distributed Systems"], load: 3, maxLoad: 4, availability: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "2:00", "2:30", "3:00", "3:30"],
    availabilityPreference: { maxInterviewsPerWeek: 4, maxInterviewsPerDay: 2, minGapMinutes: 30, preferredTimes: ["10:00", "10:30", "11:00", "11:30"], blockedTimes: ["12:00", "12:30", "1:00", "1:30"], source: "calendar_sync", calendarConnected: true, lastSynced: "5 min ago" } },
  { id: "ai-ew", name: "Emily Watson", initials: "EW", role: "Sr. Frontend", skills: ["React", "TypeScript", "System Design"], load: 2, maxLoad: 3, availability: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"],
    availabilityPreference: { maxInterviewsPerWeek: 3, maxInterviewsPerDay: 2, minGapMinutes: 30, preferredTimes: ["10:00", "10:30", "2:00", "2:30"], blockedTimes: ["5:00", "5:30"], source: "calendar_sync", calendarConnected: true, lastSynced: "12 min ago" } },
  { id: "ai-pp", name: "Priya Patel", initials: "PP", role: "Principal Eng", skills: ["Architecture", "Scalability", "System Design", "Data Systems"], load: 1, maxLoad: 2, availability: ["10:00", "10:30", "11:00", "11:30", "3:00", "3:30", "4:00", "4:30"],
    availabilityPreference: { maxInterviewsPerWeek: 2, maxInterviewsPerDay: 1, minGapMinutes: 60, preferredTimes: ["10:00", "10:30"], blockedTimes: ["9:00", "9:30", "12:00", "12:30", "1:00", "1:30", "2:00", "2:30"], source: "manual", calendarConnected: false, lastSynced: null } },
  { id: "ai-ml", name: "Marcus Lee", initials: "ML", role: "Eng Manager", skills: ["Leadership", "Behavioral", "Culture Fit"], load: 4, maxLoad: 4, availability: ["9:00", "9:30", "10:00", "10:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30", "5:00", "5:30"],
    availabilityPreference: { maxInterviewsPerWeek: 4, maxInterviewsPerDay: 2, minGapMinutes: 30, preferredTimes: ["9:00", "9:30", "2:00", "2:30"], blockedTimes: ["11:00", "11:30", "12:00", "12:30", "1:00", "1:30"], source: "calendar_sync", calendarConnected: true, lastSynced: "3 min ago" } },
  { id: "ai-ad", name: "Anita Desai", initials: "AD", role: "Data Lead", skills: ["Spark", "Data Pipelines", "SQL", "Python"], load: 2, maxLoad: 3, availability: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "1:00", "1:30", "2:00", "2:30"],
    availabilityPreference: { maxInterviewsPerWeek: 3, maxInterviewsPerDay: 2, minGapMinutes: 30, preferredTimes: ["10:00", "10:30", "11:00", "11:30"], blockedTimes: ["12:00", "12:30", "3:00", "3:30", "4:00", "4:30", "5:00", "5:30"], source: "link", calendarConnected: false, lastSynced: "1 day ago" } },
  { id: "ai-nt", name: "Nina Torres", initials: "NT", role: "Design Lead", skills: ["Product Design", "Design Systems", "User Research"], load: 1, maxLoad: 3, availability: ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "2:00", "2:30", "3:00", "3:30"],
    availabilityPreference: { maxInterviewsPerWeek: 3, maxInterviewsPerDay: 2, minGapMinutes: 30, preferredTimes: ["11:00", "11:30", "2:00", "2:30"], blockedTimes: ["9:00", "9:30", "4:00", "4:30", "5:00", "5:30"], source: "manual", calendarConnected: false, lastSynced: null } },
  { id: "ai-tw", name: "Tom Wilson", initials: "TW", role: "Sr. Backend", skills: ["Go", "Microservices", "APIs", "DSA"], load: 3, maxLoad: 3, availability: ["11:00", "11:30", "12:00", "12:30", "1:00", "1:30", "4:00", "4:30", "5:00", "5:30"],
    availabilityPreference: { maxInterviewsPerWeek: 3, maxInterviewsPerDay: 2, minGapMinutes: 30, preferredTimes: ["11:00", "11:30", "4:00", "4:30"], blockedTimes: ["9:00", "9:30", "10:00", "10:30", "2:00", "2:30", "3:00", "3:30"], source: "calendar_sync", calendarConnected: true, lastSynced: "8 min ago" } },
];

/* ── Mock Data: Candidates ── */

export const ARENA_CANDIDATES: ArenaCandidate[] = [
  { id: "ac-1", name: "Sarah Chen", initials: "SC", role: "Staff Frontend", stage: "round_2", priority: "urgent", fitScore: 94, requiredRoundType: "system_design", preferredInterviewerSkills: ["System Design", "React"] },
  { id: "ac-2", name: "Marcus Johnson", initials: "MJ", role: "Sr. Data Eng", stage: "round_2", priority: "high", fitScore: 82, requiredRoundType: "system_design", preferredInterviewerSkills: ["Data Systems", "Architecture"] },
  { id: "ac-3", name: "Aisha Patel", initials: "AP", role: "Sr. Designer", stage: "round_1", priority: "normal", fitScore: 79, requiredRoundType: "behavioral", preferredInterviewerSkills: ["Product Design", "Culture Fit"] },
  { id: "ac-4", name: "James Rodriguez", initials: "JR", role: "Backend Eng", stage: "round_1", priority: "normal", fitScore: 75, requiredRoundType: "dsa", preferredInterviewerSkills: ["Go", "DSA"] },
  { id: "ac-5", name: "Rachel Torres", initials: "RT", role: "DevOps Eng", stage: "round_3", priority: "urgent", fitScore: 83, requiredRoundType: "hiring_manager", preferredInterviewerSkills: ["Leadership"] },
  { id: "ac-6", name: "Wei Zhang", initials: "WZ", role: "ML Engineer", stage: "round_1", priority: "high", fitScore: 88, requiredRoundType: "dsa", preferredInterviewerSkills: ["Python", "System Design"] },
];

/* ── Mock Data: Pre-booked slots ── */

export const INITIAL_SLOTS: InterviewSlot[] = [
  { id: "s-1", interviewerId: "ai-rk", time: "10:00", status: "booked", candidateId: "ac-ext-1", candidateName: "Alex Rivera", candidateInitials: "AR", roundType: "system_design", fitScore: 78, aiScore: null, conflictReason: null },
  { id: "s-2", interviewerId: "ai-ew", time: "11:00", status: "booked", candidateId: "ac-ext-2", candidateName: "Jordan Lee", candidateInitials: "JL", roundType: "dsa", fitScore: 72, aiScore: null, conflictReason: null },
  { id: "s-3", interviewerId: "ai-ml", time: "9:00", status: "booked", candidateId: "ac-ext-3", candidateName: "Kim Park", candidateInitials: "KP", roundType: "behavioral", fitScore: 85, aiScore: null, conflictReason: null },
  { id: "s-4", interviewerId: "ai-ml", time: "2:00", status: "booked", candidateId: "ac-ext-4", candidateName: "Lisa Huang", candidateInitials: "LH", roundType: "culture_fit", fitScore: 80, aiScore: null, conflictReason: null },
  { id: "s-5", interviewerId: "ai-ad", time: "10:00", status: "booked", candidateId: "ac-ext-5", candidateName: "Ravi Sharma", candidateInitials: "RS", roundType: "dsa", fitScore: 76, aiScore: null, conflictReason: null },
  { id: "s-6", interviewerId: "ai-tw", time: "11:00", status: "booked", candidateId: "ac-ext-6", candidateName: "Maya Chen", candidateInitials: "MC", roundType: "dsa", fitScore: 81, aiScore: null, conflictReason: null },
  { id: "s-7", interviewerId: "ai-pp", time: "10:00", status: "booked", candidateId: "ac-ext-7", candidateName: "Omar Ali", candidateInitials: "OA", roundType: "system_design", fitScore: 90, aiScore: null, conflictReason: null },
];

/* ── AI Scoring Logic ── */

export function computeAIScore(
  interviewer: ArenaInterviewer,
  candidate: ArenaCandidate,
  time: string,
  existingSlots: InterviewSlot[]
): { score: number; reasons: string[]; conflicts: string[] } {
  let score = 50;
  const reasons: string[] = [];
  const conflicts: string[] = [];

  // Skill match
  const matchedSkills = candidate.preferredInterviewerSkills.filter((s) =>
    interviewer.skills.some((is) => is.toLowerCase().includes(s.toLowerCase()))
  );
  if (matchedSkills.length > 0) {
    score += matchedSkills.length * 15;
    reasons.push(`${matchedSkills.length} skill match${matchedSkills.length > 1 ? "es" : ""}`);
  }

  // Load
  if (interviewer.load >= interviewer.maxLoad) {
    score -= 30;
    conflicts.push("Interviewer at max capacity");
  } else if (interviewer.load >= interviewer.maxLoad * 0.75) {
    score -= 10;
    reasons.push("Near capacity");
  } else {
    score += 10;
    reasons.push("Has capacity");
  }

  // Availability
  if (!interviewer.availability.includes(time)) {
    score = 0;
    conflicts.push("Not available at this time");
  }

  // Back-to-back check
  const timeIndex = TIME_SLOTS.indexOf(time);
  const adjacentTimes = [TIME_SLOTS[timeIndex - 1], TIME_SLOTS[timeIndex + 1]].filter(Boolean);
  const hasAdjacent = existingSlots.some(
    (s) => s.interviewerId === interviewer.id && adjacentTimes.includes(s.time) && s.status === "booked"
  );
  if (hasAdjacent) {
    score -= 15;
    conflicts.push("Back-to-back interview");
  }

  // Double booking
  const isDoubleBooked = existingSlots.some(
    (s) => s.interviewerId === interviewer.id && s.time === time && s.status === "booked"
  );
  if (isDoubleBooked) {
    score = 0;
    conflicts.push("Already booked");
  }

  return { score: Math.max(0, Math.min(100, score)), reasons, conflicts };
}
