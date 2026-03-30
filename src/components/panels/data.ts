/* ================================================================
   Panel Management — Types, Mock Data & Helpers
   ================================================================ */

/* ── Types ── */

export type InterviewSkill =
  | "System Design"
  | "DSA"
  | "Behavioral"
  | "Culture Fit"
  | "Technical"
  | "Leadership"
  | "Frontend"
  | "Backend"
  | "Data Engineering"
  | "Machine Learning"
  | "DevOps"
  | "Mobile"
  | "Product Design"
  | "Security";

export type Seniority = "junior" | "mid" | "senior" | "staff" | "principal" | "director" | "vp";
export type PanelStatus = "active" | "paused" | "onboarding" | "offboarded";
export type CalendarProvider = "google" | "outlook" | "apple" | "none";
export type AvailabilitySource = "calendar_sync" | "manual" | "booking_link";

export interface WeeklySlot {
  day: "mon" | "tue" | "wed" | "thu" | "fri";
  times: string[];
}

export interface PanelMember {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: string;
  department: string;
  seniority: Seniority;
  status: PanelStatus;
  interviewTypes: InterviewSkill[];
  certifications: string[];
  languages: string[];

  // Availability
  availabilitySource: AvailabilitySource;
  calendarProvider: CalendarProvider;
  calendarConnected: boolean;
  lastSynced: string | null;
  weeklySlots: WeeklySlot[];
  blockedDates: string[];

  // Preferences
  maxPerWeek: number;
  maxPerDay: number;
  minGapMinutes: number;
  preferredDuration: number;
  noInterviewDays: string[];

  // Performance
  totalInterviews: number;
  thisWeekCount: number;
  thisMonthCount: number;
  avgFeedbackScore: number;
  avgFeedbackTime: string;
  biasScore: number;
  candidateSatisfaction: number;
  noShowRate: number;

  // Meta
  joinedPanel: string;
  lastInterview: string | null;
  trainedOn: string[];
}

export type PanelTab = "members" | "availability" | "performance" | "settings";

export const PANEL_TABS: { key: PanelTab; label: string }[] = [
  { key: "members", label: "Panel Members" },
  { key: "availability", label: "Availability" },
  { key: "performance", label: "Performance" },
  { key: "settings", label: "Settings" },
];

/* ── Helpers ── */

export function seniorityLabel(s: Seniority): string {
  switch (s) {
    case "junior": return "Junior";
    case "mid": return "Mid-Level";
    case "senior": return "Senior";
    case "staff": return "Staff";
    case "principal": return "Principal";
    case "director": return "Director";
    case "vp": return "VP";
  }
}

export function seniorityOrder(s: Seniority): number {
  return { junior: 1, mid: 2, senior: 3, staff: 4, principal: 5, director: 6, vp: 7 }[s];
}

export function statusColor(s: PanelStatus): string {
  switch (s) {
    case "active": return "text-success";
    case "paused": return "text-warning";
    case "onboarding": return "text-brand";
    case "offboarded": return "text-muted-foreground";
  }
}

export function statusBgColor(s: PanelStatus): string {
  switch (s) {
    case "active": return "bg-success/10";
    case "paused": return "bg-warning/10";
    case "onboarding": return "bg-brand/10";
    case "offboarded": return "bg-secondary";
  }
}

export function statusLabel(s: PanelStatus): string {
  switch (s) {
    case "active": return "Active";
    case "paused": return "Paused";
    case "onboarding": return "Onboarding";
    case "offboarded": return "Offboarded";
  }
}

export function sourceLabel(s: AvailabilitySource): string {
  switch (s) {
    case "calendar_sync": return "Calendar Sync";
    case "manual": return "Manual";
    case "booking_link": return "Booking Link";
  }
}

export function sourceColor(s: AvailabilitySource): string {
  switch (s) {
    case "calendar_sync": return "text-success";
    case "manual": return "text-brand";
    case "booking_link": return "text-brand-purple";
  }
}

export function sourceBgColor(s: AvailabilitySource): string {
  switch (s) {
    case "calendar_sync": return "bg-success/10";
    case "manual": return "bg-brand/10";
    case "booking_link": return "bg-brand-purple/10";
  }
}

export function scoreColor(score: number): string {
  if (score >= 4.5) return "text-success";
  if (score >= 4.0) return "text-brand-teal";
  if (score >= 3.5) return "text-brand";
  if (score >= 3.0) return "text-warning";
  return "text-destructive";
}

export function biasLabel(score: number): string {
  if (score <= 5) return "Low";
  if (score <= 10) return "Medium";
  return "High";
}

export function biasColor(score: number): string {
  if (score <= 5) return "text-success";
  if (score <= 10) return "text-warning";
  return "text-destructive";
}

export function loadColor(current: number, max: number): string {
  const pct = current / max;
  if (pct >= 1) return "text-destructive";
  if (pct >= 0.75) return "text-warning";
  return "text-success";
}

export const TIME_SLOTS = [
  "9:00", "9:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "12:30", "1:00", "1:30", "2:00", "2:30",
  "3:00", "3:30", "4:00", "4:30", "5:00", "5:30",
];

export const DAYS: { key: "mon" | "tue" | "wed" | "thu" | "fri"; label: string }[] = [
  { key: "mon", label: "Monday" },
  { key: "tue", label: "Tuesday" },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday" },
  { key: "fri", label: "Friday" },
];

/* ── Mock Data ── */

export const PANEL_MEMBERS: PanelMember[] = [
  {
    id: "pm-rk", name: "Rajesh Kumar", initials: "RK", email: "rajesh@o2s.app", role: "Staff Engineer", department: "Engineering", seniority: "staff", status: "active",
    interviewTypes: ["System Design", "Backend", "DSA"], certifications: ["System Design Certified", "Interviewer Level 3"], languages: ["English", "Hindi"],
    availabilitySource: "calendar_sync", calendarProvider: "google", calendarConnected: true, lastSynced: "5 min ago",
    weeklySlots: [
      { day: "mon", times: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "2:00", "2:30", "3:00", "3:30"] },
      { day: "tue", times: ["10:00", "10:30", "11:00", "11:30", "3:00", "3:30", "4:00", "4:30"] },
      { day: "wed", times: ["9:00", "9:30", "10:00", "10:30", "2:00", "2:30"] },
      { day: "thu", times: ["10:00", "10:30", "11:00", "11:30", "2:00", "2:30", "3:00", "3:30"] },
      { day: "fri", times: ["9:00", "9:30", "10:00", "10:30"] },
    ],
    blockedDates: ["2026-04-10", "2026-04-11"],
    maxPerWeek: 4, maxPerDay: 2, minGapMinutes: 30, preferredDuration: 60, noInterviewDays: ["fri"],
    totalInterviews: 124, thisWeekCount: 3, thisMonthCount: 9, avgFeedbackScore: 4.6, avgFeedbackTime: "4 hrs", biasScore: 8, candidateSatisfaction: 92, noShowRate: 1.2,
    joinedPanel: "Jan 2025", lastInterview: "Yesterday", trainedOn: ["System Design Rubric", "Bias Awareness", "Behavioral STAR Method"],
  },
  {
    id: "pm-ew", name: "Emily Watson", initials: "EW", email: "emily@o2s.app", role: "Sr. Frontend Engineer", department: "Engineering", seniority: "senior", status: "active",
    interviewTypes: ["Frontend", "System Design", "Technical"], certifications: ["Interviewer Level 2"], languages: ["English"],
    availabilitySource: "calendar_sync", calendarProvider: "google", calendarConnected: true, lastSynced: "12 min ago",
    weeklySlots: [
      { day: "mon", times: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"] },
      { day: "tue", times: ["10:00", "10:30", "11:00", "11:30", "2:00", "2:30"] },
      { day: "wed", times: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30", "1:00", "1:30", "2:00", "2:30", "3:00", "3:30"] },
      { day: "thu", times: ["10:00", "10:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"] },
      { day: "fri", times: ["10:00", "10:30", "11:00", "11:30"] },
    ],
    blockedDates: [],
    maxPerWeek: 3, maxPerDay: 2, minGapMinutes: 30, preferredDuration: 60, noInterviewDays: [],
    totalInterviews: 89, thisWeekCount: 2, thisMonthCount: 7, avgFeedbackScore: 4.8, avgFeedbackTime: "2 hrs", biasScore: 5, candidateSatisfaction: 96, noShowRate: 0,
    joinedPanel: "Mar 2025", lastInterview: "Today", trainedOn: ["Frontend Assessment Rubric", "Bias Awareness"],
  },
  {
    id: "pm-pp", name: "Priya Patel", initials: "PP", email: "priya@o2s.app", role: "Principal Engineer", department: "Platform", seniority: "principal", status: "active",
    interviewTypes: ["System Design", "Technical", "Data Engineering"], certifications: ["System Design Certified", "Interviewer Level 3", "Bar Raiser"], languages: ["English", "Gujarati"],
    availabilitySource: "manual", calendarProvider: "none", calendarConnected: false, lastSynced: null,
    weeklySlots: [
      { day: "mon", times: ["10:00", "10:30", "11:00", "11:30"] },
      { day: "wed", times: ["10:00", "10:30", "11:00", "11:30", "3:00", "3:30"] },
      { day: "fri", times: ["10:00", "10:30", "11:00", "11:30"] },
    ],
    blockedDates: ["2026-04-07", "2026-04-08", "2026-04-09"],
    maxPerWeek: 2, maxPerDay: 1, minGapMinutes: 60, preferredDuration: 60, noInterviewDays: ["tue", "thu"],
    totalInterviews: 201, thisWeekCount: 1, thisMonthCount: 4, avgFeedbackScore: 4.9, avgFeedbackTime: "6 hrs", biasScore: 3, candidateSatisfaction: 98, noShowRate: 0,
    joinedPanel: "Sep 2024", lastInterview: "2 days ago", trainedOn: ["System Design Rubric", "Bar Raiser Training", "Bias Awareness", "Executive Assessment"],
  },
  {
    id: "pm-ml", name: "Marcus Lee", initials: "ML", email: "marcus@o2s.app", role: "Engineering Manager", department: "Engineering", seniority: "senior", status: "active",
    interviewTypes: ["Behavioral", "Culture Fit", "Leadership"], certifications: ["Interviewer Level 2", "Behavioral Certified"], languages: ["English", "Mandarin"],
    availabilitySource: "calendar_sync", calendarProvider: "outlook", calendarConnected: true, lastSynced: "3 min ago",
    weeklySlots: [
      { day: "mon", times: ["9:00", "9:30", "10:00", "10:30", "2:00", "2:30", "3:00", "3:30", "4:00", "4:30"] },
      { day: "tue", times: ["9:00", "9:30", "2:00", "2:30", "3:00", "3:30"] },
      { day: "wed", times: ["10:00", "10:30", "2:00", "2:30", "4:00", "4:30", "5:00", "5:30"] },
      { day: "thu", times: ["9:00", "9:30", "10:00", "10:30", "3:00", "3:30", "4:00", "4:30"] },
      { day: "fri", times: ["9:00", "9:30", "10:00", "10:30"] },
    ],
    blockedDates: [],
    maxPerWeek: 4, maxPerDay: 2, minGapMinutes: 30, preferredDuration: 45, noInterviewDays: [],
    totalInterviews: 156, thisWeekCount: 4, thisMonthCount: 12, avgFeedbackScore: 4.3, avgFeedbackTime: "8 hrs", biasScore: 12, candidateSatisfaction: 88, noShowRate: 2.1,
    joinedPanel: "Jun 2024", lastInterview: "Today", trainedOn: ["Behavioral STAR Method", "Bias Awareness"],
  },
  {
    id: "pm-ad", name: "Anita Desai", initials: "AD", email: "anita@o2s.app", role: "Data Engineering Lead", department: "Data", seniority: "senior", status: "active",
    interviewTypes: ["Data Engineering", "Technical", "DSA"], certifications: ["Interviewer Level 2"], languages: ["English", "Hindi", "Kannada"],
    availabilitySource: "booking_link", calendarProvider: "google", calendarConnected: false, lastSynced: "1 day ago",
    weeklySlots: [
      { day: "mon", times: ["9:00", "9:30", "10:00", "10:30", "11:00", "11:30"] },
      { day: "tue", times: ["10:00", "10:30", "11:00", "11:30", "1:00", "1:30", "2:00", "2:30"] },
      { day: "wed", times: ["9:00", "9:30", "10:00", "10:30"] },
      { day: "thu", times: ["10:00", "10:30", "11:00", "11:30", "2:00", "2:30"] },
      { day: "fri", times: ["10:00", "10:30"] },
    ],
    blockedDates: [],
    maxPerWeek: 3, maxPerDay: 2, minGapMinutes: 30, preferredDuration: 60, noInterviewDays: [],
    totalInterviews: 67, thisWeekCount: 2, thisMonthCount: 6, avgFeedbackScore: 4.5, avgFeedbackTime: "5 hrs", biasScore: 7, candidateSatisfaction: 91, noShowRate: 0.8,
    joinedPanel: "Nov 2025", lastInterview: "Yesterday", trainedOn: ["Data Engineering Rubric", "Bias Awareness"],
  },
  {
    id: "pm-nt", name: "Nina Torres", initials: "NT", email: "nina@o2s.app", role: "Design Lead", department: "Design", seniority: "senior", status: "active",
    interviewTypes: ["Product Design", "Culture Fit", "Behavioral"], certifications: ["Design Assessment Certified"], languages: ["English", "Spanish"],
    availabilitySource: "manual", calendarProvider: "none", calendarConnected: false, lastSynced: null,
    weeklySlots: [
      { day: "mon", times: ["10:00", "10:30", "11:00", "11:30", "2:00", "2:30", "3:00", "3:30"] },
      { day: "wed", times: ["10:00", "10:30", "11:00", "11:30", "2:00", "2:30"] },
      { day: "thu", times: ["11:00", "11:30", "12:00", "12:30", "3:00", "3:30"] },
    ],
    blockedDates: ["2026-04-14"],
    maxPerWeek: 3, maxPerDay: 2, minGapMinutes: 30, preferredDuration: 45, noInterviewDays: ["tue", "fri"],
    totalInterviews: 45, thisWeekCount: 1, thisMonthCount: 3, avgFeedbackScore: 4.7, avgFeedbackTime: "3 hrs", biasScore: 4, candidateSatisfaction: 95, noShowRate: 0,
    joinedPanel: "Jan 2026", lastInterview: "3 days ago", trainedOn: ["Design Portfolio Review Guide", "Bias Awareness"],
  },
  {
    id: "pm-tw", name: "Tom Wilson", initials: "TW", email: "tom@o2s.app", role: "Sr. Backend Engineer", department: "Engineering", seniority: "senior", status: "paused",
    interviewTypes: ["Backend", "DSA", "Technical"], certifications: ["Interviewer Level 1"], languages: ["English"],
    availabilitySource: "calendar_sync", calendarProvider: "google", calendarConnected: true, lastSynced: "8 min ago",
    weeklySlots: [
      { day: "mon", times: ["11:00", "11:30", "12:00", "12:30"] },
      { day: "wed", times: ["11:00", "11:30", "4:00", "4:30", "5:00", "5:30"] },
      { day: "fri", times: ["1:00", "1:30", "4:00", "4:30"] },
    ],
    blockedDates: [],
    maxPerWeek: 3, maxPerDay: 2, minGapMinutes: 30, preferredDuration: 60, noInterviewDays: ["tue", "thu"],
    totalInterviews: 92, thisWeekCount: 3, thisMonthCount: 11, avgFeedbackScore: 4.2, avgFeedbackTime: "12 hrs", biasScore: 15, candidateSatisfaction: 84, noShowRate: 3.5,
    joinedPanel: "Apr 2025", lastInterview: "Today", trainedOn: ["DSA Rubric"],
  },
  {
    id: "pm-vs", name: "Vikram Shah", initials: "VS", email: "vikram@o2s.app", role: "VP Engineering", department: "Engineering", seniority: "vp", status: "active",
    interviewTypes: ["Leadership", "Culture Fit", "System Design"], certifications: ["Bar Raiser", "Executive Assessment"], languages: ["English", "Hindi"],
    availabilitySource: "calendar_sync", calendarProvider: "outlook", calendarConnected: true, lastSynced: "1 min ago",
    weeklySlots: [
      { day: "tue", times: ["10:00", "10:30", "11:00", "11:30"] },
      { day: "thu", times: ["2:00", "2:30", "3:00", "3:30"] },
    ],
    blockedDates: ["2026-04-15", "2026-04-16", "2026-04-17", "2026-04-18"],
    maxPerWeek: 2, maxPerDay: 1, minGapMinutes: 60, preferredDuration: 60, noInterviewDays: ["mon", "wed", "fri"],
    totalInterviews: 178, thisWeekCount: 2, thisMonthCount: 5, avgFeedbackScore: 4.4, avgFeedbackTime: "10 hrs", biasScore: 10, candidateSatisfaction: 90, noShowRate: 0.5,
    joinedPanel: "Jan 2024", lastInterview: "Today", trainedOn: ["Executive Assessment", "Bar Raiser Training", "Bias Awareness", "Leadership Rubric"],
  },
];
