/* ================================================================
   O2S Settings / Hiring — Types, Mock Data & Helpers
   ================================================================ */

/* ── Types ── */

export type HiringTab = "pipelines" | "scorecards" | "emails" | "offers" | "scheduling" | "career" | "forms";

export interface PipelineTemplate {
  id: string;
  name: string;
  isDefault: boolean;
  stageCount: number;
  activeJobs: number;
  lastEdited: string;
  stages: { name: string; colorClass: string }[];
  aiAutoAdvance: string | null;
}

export interface ScorecardTemplate {
  id: string;
  name: string;
  criteriaCount: number;
  usedByJobs: number;
  type: string;
  typeColorClass: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  category: string;
  categoryColorClass: string;
  subject: string;
  aiPersonalization: boolean;
  autoSend: boolean;
  autoSendTrigger?: string;
  lastEdited: string;
}

export interface OfferTemplate {
  id: string;
  name: string;
  isDefault: boolean;
  usedFor: string;
  includes: string[];
  lastUsed: string;
  usedCount: number;
}

export interface ApprovalRule {
  id: string;
  name: string;
  condition: string;
  approvers: string[];
  timeout: string;
  escalation: string;
}

export interface InterviewType {
  id: string;
  name: string;
  duration: string;
  format: string;
  interviewers: number;
  calendarTitle: string;
  videoTool: string;
}

export interface ApplicationForm {
  id: string;
  name: string;
  isDefault: boolean;
  fieldCount: number;
  usedByJobs: number;
  lastEdited: string;
  fields: string[];
}

/* ── Tab Config ── */

export const HIRING_TABS: { key: HiringTab; label: string }[] = [
  { key: "pipelines", label: "Pipeline Templates" },
  { key: "scorecards", label: "Scorecards" },
  { key: "emails", label: "Email Templates" },
  { key: "offers", label: "Offer Settings" },
  { key: "scheduling", label: "Scheduling" },
  { key: "career", label: "Career Page" },
  { key: "forms", label: "Application Forms" },
];

/* ── Pipeline Templates ── */

export const PIPELINE_TEMPLATES: PipelineTemplate[] = [
  {
    id: "pt1", name: "Standard Hiring Pipeline", isDefault: true,
    stageCount: 6, activeJobs: 8, lastEdited: "Mar 15",
    stages: [
      { name: "Applied", colorClass: "bg-brand" },
      { name: "Screened", colorClass: "bg-success" },
      { name: "Interview", colorClass: "bg-warning" },
      { name: "Final", colorClass: "bg-brand-purple" },
      { name: "Offer", colorClass: "bg-brand-teal" },
      { name: "Hired", colorClass: "bg-success" },
    ],
    aiAutoAdvance: "Applied → Screened (≥75% match)",
  },
  {
    id: "pt2", name: "Engineering Pipeline", isDefault: false,
    stageCount: 8, activeJobs: 4, lastEdited: "Mar 10",
    stages: [
      { name: "Applied", colorClass: "bg-brand" },
      { name: "AI Screen", colorClass: "bg-brand-purple" },
      { name: "Phone", colorClass: "bg-brand-teal" },
      { name: "Technical", colorClass: "bg-warning" },
      { name: "Sys Design", colorClass: "bg-info" },
      { name: "Team Fit", colorClass: "bg-success" },
      { name: "Offer", colorClass: "bg-brand-teal" },
      { name: "Hired", colorClass: "bg-success" },
    ],
    aiAutoAdvance: "Applied → AI Screen (≥80% match)",
  },
  {
    id: "pt3", name: "Executive Search", isDefault: false,
    stageCount: 5, activeJobs: 1, lastEdited: "Feb 28",
    stages: [
      { name: "Sourced", colorClass: "bg-brand-purple" },
      { name: "Intro Call", colorClass: "bg-brand-teal" },
      { name: "Panel", colorClass: "bg-warning" },
      { name: "Reference", colorClass: "bg-info" },
      { name: "Offer", colorClass: "bg-success" },
    ],
    aiAutoAdvance: null,
  },
  {
    id: "pt4", name: "Internship Pipeline", isDefault: false,
    stageCount: 4, activeJobs: 2, lastEdited: "Mar 5",
    stages: [
      { name: "Applied", colorClass: "bg-brand" },
      { name: "Review", colorClass: "bg-brand-teal" },
      { name: "Interview", colorClass: "bg-warning" },
      { name: "Offer", colorClass: "bg-success" },
    ],
    aiAutoAdvance: "Applied → Review (≥70% match)",
  },
  {
    id: "pt5", name: "Contract / Freelance", isDefault: false,
    stageCount: 3, activeJobs: 3, lastEdited: "Mar 18",
    stages: [
      { name: "Applied", colorClass: "bg-brand" },
      { name: "Skills Review", colorClass: "bg-brand-purple" },
      { name: "Engaged", colorClass: "bg-success" },
    ],
    aiAutoAdvance: "Applied → Skills Review (≥85% match)",
  },
];

/* ── Scorecards ── */

export const SCORECARD_TEMPLATES: ScorecardTemplate[] = [
  { id: "sc1", name: "General Interview", criteriaCount: 6, usedByJobs: 12, type: "Universal", typeColorClass: "bg-brand/10 text-brand" },
  { id: "sc2", name: "Engineering Technical", criteriaCount: 8, usedByJobs: 4, type: "Technical", typeColorClass: "bg-brand-purple/10 text-brand-purple" },
  { id: "sc3", name: "System Design", criteriaCount: 5, usedByJobs: 3, type: "Technical", typeColorClass: "bg-brand-purple/10 text-brand-purple" },
  { id: "sc4", name: "Culture & Values", criteriaCount: 4, usedByJobs: 8, type: "Behavioral", typeColorClass: "bg-success/10 text-success" },
  { id: "sc5", name: "Sales Discovery", criteriaCount: 7, usedByJobs: 2, type: "Functional", typeColorClass: "bg-warning/10 text-warning" },
  { id: "sc6", name: "Leadership Panel", criteriaCount: 6, usedByJobs: 1, type: "Executive", typeColorClass: "bg-info/10 text-info" },
  { id: "sc7", name: "Design Portfolio", criteriaCount: 5, usedByJobs: 2, type: "Portfolio", typeColorClass: "bg-brand-teal/10 text-brand-teal" },
  { id: "sc8", name: "Product Sense", criteriaCount: 6, usedByJobs: 3, type: "Functional", typeColorClass: "bg-warning/10 text-warning" },
];

/* ── Email Templates ── */

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  { id: "et1", name: "Application Received", category: "Application", categoryColorClass: "bg-brand/10 text-brand", subject: "Thanks for applying to {{job_title}}", aiPersonalization: true, autoSend: true, autoSendTrigger: "On apply", lastEdited: "Mar 15" },
  { id: "et2", name: "Phone Screen Invite", category: "Interview", categoryColorClass: "bg-brand-purple/10 text-brand-purple", subject: "Interview with {{company}} — {{job_title}}", aiPersonalization: true, autoSend: false, lastEdited: "Mar 12" },
  { id: "et3", name: "Interview Confirmation", category: "Interview", categoryColorClass: "bg-brand-purple/10 text-brand-purple", subject: "Confirmed: {{interview_type}} on {{date}}", aiPersonalization: false, autoSend: true, autoSendTrigger: "On schedule", lastEdited: "Mar 10" },
  { id: "et4", name: "Interview Reminder", category: "Interview", categoryColorClass: "bg-brand-purple/10 text-brand-purple", subject: "Reminder: Interview tomorrow at {{time}}", aiPersonalization: false, autoSend: true, autoSendTrigger: "24h before", lastEdited: "Mar 8" },
  { id: "et5", name: "Rejection — After Screen", category: "Rejection", categoryColorClass: "bg-destructive/10 text-destructive", subject: "Update on your {{job_title}} application", aiPersonalization: true, autoSend: false, lastEdited: "Mar 14" },
  { id: "et6", name: "Rejection — After Interview", category: "Rejection", categoryColorClass: "bg-destructive/10 text-destructive", subject: "Update on your {{job_title}} application", aiPersonalization: true, autoSend: false, lastEdited: "Mar 14" },
  { id: "et7", name: "Offer Letter Email", category: "Offer", categoryColorClass: "bg-success/10 text-success", subject: "Offer: {{job_title}} at {{company}}", aiPersonalization: false, autoSend: false, lastEdited: "Mar 1" },
  { id: "et8", name: "Offer Follow-Up", category: "Offer", categoryColorClass: "bg-success/10 text-success", subject: "Following up on your offer — {{job_title}}", aiPersonalization: true, autoSend: true, autoSendTrigger: "3 days after offer", lastEdited: "Mar 1" },
  { id: "et9", name: "Candidate Withdraw Ack", category: "General", categoryColorClass: "bg-muted-foreground/10 text-muted-foreground", subject: "We understand — thank you, {{first_name}}", aiPersonalization: true, autoSend: true, autoSendTrigger: "On withdraw", lastEdited: "Feb 28" },
  { id: "et10", name: "Referral Thank You", category: "General", categoryColorClass: "bg-muted-foreground/10 text-muted-foreground", subject: "Thanks for referring {{candidate_name}}!", aiPersonalization: false, autoSend: true, autoSendTrigger: "On referral", lastEdited: "Feb 20" },
];

/* ── Offer Templates ── */

export const OFFER_TEMPLATES: OfferTemplate[] = [
  { id: "ot1", name: "Standard Full-Time Offer", isDefault: true, usedFor: "IC1–IC4 levels", includes: ["Base", "Equity", "Benefits", "Start Date"], lastUsed: "3 days ago", usedCount: 42 },
  { id: "ot2", name: "Senior / Executive Offer", isDefault: false, usedFor: "IC5+, M3+ levels", includes: ["Base", "Equity", "Bonus", "Sign-on", "Benefits", "Relocation", "Non-compete"], lastUsed: "2 weeks ago", usedCount: 8 },
  { id: "ot3", name: "Contractor Agreement", isDefault: false, usedFor: "Contractors, Freelancers", includes: ["Rate", "Duration", "SOW", "IP Assignment"], lastUsed: "1 week ago", usedCount: 15 },
  { id: "ot4", name: "Internship Offer", isDefault: false, usedFor: "Interns", includes: ["Stipend", "Duration", "Mentor", "Return Offer"], lastUsed: "1 month ago", usedCount: 6 },
];

/* ── Approval Rules ── */

export const APPROVAL_RULES: ApprovalRule[] = [
  { id: "ar1", name: "Executive Offers (IC5+ or base > $200K)", condition: "IC5+ OR base > $200K", approvers: ["Hiring Manager", "VP", "CEO"], timeout: "48h per approver", escalation: "Auto-remind after 24h" },
  { id: "ar2", name: "Senior Offers (IC3-IC4 or $120K-$200K)", condition: "IC3-IC4 OR $120K-$200K", approvers: ["Hiring Manager", "Department Head"], timeout: "36h per approver", escalation: "Auto-remind after 18h" },
  { id: "ar3", name: "Standard Offers (all others)", condition: "Default", approvers: ["Hiring Manager"], timeout: "24h", escalation: "Auto-remind after 12h" },
];

/* ── Interview Types ── */

export const INTERVIEW_TYPES: InterviewType[] = [
  { id: "it1", name: "Phone Screen", duration: "30 min", format: "Video Call", interviewers: 1, calendarTitle: "{{company}} Phone Screen — {{candidate}}", videoTool: "Zoom" },
  { id: "it2", name: "Technical Interview", duration: "60 min", format: "Video + CodePair", interviewers: 2, calendarTitle: "{{company}} Technical — {{candidate}}", videoTool: "Zoom" },
  { id: "it3", name: "Hiring Manager Chat", duration: "45 min", format: "Video Call", interviewers: 1, calendarTitle: "Chat with {{hm_name}} — {{candidate}}", videoTool: "Zoom" },
  { id: "it4", name: "Panel Interview", duration: "60 min", format: "In-person / Video", interviewers: 4, calendarTitle: "{{company}} Panel — {{candidate}}", videoTool: "Zoom" },
  { id: "it5", name: "Take-Home Assessment", duration: "Async", format: "72h deadline", interviewers: 0, calendarTitle: "Assessment: {{job_title}}", videoTool: "—" },
];

/* ── Application Forms ── */

export const APPLICATION_FORMS: ApplicationForm[] = [
  { id: "af1", name: "Default Application Form", isDefault: true, fieldCount: 8, usedByJobs: 6, lastEdited: "Mar 18", fields: ["Name", "Email", "Phone", "Resume", "Cover Letter", "LinkedIn", "How did you hear?", "Work Authorization"] },
  { id: "af2", name: "Engineering Application", isDefault: false, fieldCount: 10, usedByJobs: 4, lastEdited: "Mar 15", fields: ["Name", "Email", "Phone", "Resume", "LinkedIn", "GitHub", "Portfolio", "Years of Experience", "Tech Stack", "Work Authorization"] },
  { id: "af3", name: "Design Application", isDefault: false, fieldCount: 9, usedByJobs: 2, lastEdited: "Mar 12", fields: ["Name", "Email", "Phone", "Resume", "Portfolio", "Dribbble/Behance", "Design Philosophy", "Years of Experience", "Work Authorization"] },
  { id: "af4", name: "Executive Application", isDefault: false, fieldCount: 7, usedByJobs: 1, lastEdited: "Feb 28", fields: ["Name", "Email", "Phone", "Resume", "LinkedIn", "Executive Summary", "References"] },
  { id: "af5", name: "Quick Apply (Minimal)", isDefault: false, fieldCount: 4, usedByJobs: 3, lastEdited: "Mar 20", fields: ["Name", "Email", "Resume", "LinkedIn"] },
];

/* ── Email Categories ── */

export const EMAIL_CATEGORIES = ["All", "Application", "Interview", "Rejection", "Offer", "General"] as const;

/* ── Helpers ── */

export function stageConnectorDots(stages: { name: string; colorClass: string }[]): string {
  return stages.map((s) => s.name).join(" → ");
}
