/* ================================================================
   O2S Candidate Detail — Types & Mock Data
   ================================================================ */

export type CandidateTab = "overview" | "resume" | "interviews" | "scorecards" | "communication" | "offer" | "documents" | "activity";

export const CANDIDATE_TABS: { key: CandidateTab; label: string }[] = [
  { key: "overview", label: "Overview" },
  { key: "resume", label: "Resume & Profile" },
  { key: "interviews", label: "Interview Journey" },
  { key: "scorecards", label: "Scorecards" },
  { key: "communication", label: "Communication" },
  { key: "offer", label: "Offer" },
  { key: "documents", label: "Documents" },
  { key: "activity", label: "Activity Log" },
];

/* ── Candidate Profile ── */

export const CANDIDATE = {
  name: "Sarah Chen",
  initials: "SC",
  role: "Senior Frontend Engineer",
  company: "Google",
  location: "San Francisco, PT (UTC-8)",
  email: "sarah.chen@google.com",
  phone: "+1 650-555-0100",
  linkedin: "linkedin.com/in/sarahchen",
  github: "github.com/sarahchen",
  portfolio: "sarahchen.dev",
  source: "LinkedIn (AI Sourced)",
  aiScore: 88,
  stage: "Interview",
  stageColorClass: "bg-brand-purple",
  appliedDate: "Mar 18, 2026",
  daysInPipeline: 22,
  recruiter: "Sarah Kim",
  hiringManager: "Rajesh Kumar",
  noticePeriod: "2 weeks",
  expectedCtc: "$200K–$220K",
  requisition: "REQ-2026-001",
  tags: ["Strong Hire", "Fast Track"],
};

/* ── Candidates List ── */

export interface CandidateListItem {
  id: string;
  name: string;
  initials: string;
  role: string;
  company: string;
  location: string;
  source: string;
  stage: string;
  stageColorClass: string;
  aiScore: number | null;
  appliedDate: string;
  daysInPipeline: number;
  requisition: string;
  recruiter: string;
  tags: string[];
  email: string;
}

export const CANDIDATES_LIST: CandidateListItem[] = [
  { id: "cand-001", name: "Sarah Chen", initials: "SC", role: "Senior Frontend Engineer", company: "Google", location: "San Francisco", source: "LinkedIn (AI Sourced)", stage: "Interview", stageColorClass: "bg-brand-purple", aiScore: 88, appliedDate: "Mar 18", daysInPipeline: 22, requisition: "REQ-2026-001", recruiter: "Sarah Kim", tags: ["Strong Hire", "Fast Track"], email: "sarah.chen@google.com" },
  { id: "cand-002", name: "Marcus Chen", initials: "MC", role: "Backend Engineer", company: "Stripe", location: "SF Bay Area", source: "LinkedIn", stage: "Final Round", stageColorClass: "bg-brand-teal", aiScore: 85, appliedDate: "Mar 10", daysInPipeline: 30, requisition: "REQ-2026-002", recruiter: "Sarah Kim", tags: ["Strong Hire"], email: "marcus@stripe.com" },
  { id: "cand-003", name: "Priya Sharma", initials: "PS", role: "Senior Frontend Engineer", company: "Razorpay", location: "Bangalore", source: "Referral", stage: "Interview", stageColorClass: "bg-brand-purple", aiScore: 92, appliedDate: "Mar 15", daysInPipeline: 25, requisition: "REQ-2026-001", recruiter: "Sarah Kim", tags: ["Strong Hire", "Referred"], email: "priya@razorpay.com" },
  { id: "cand-004", name: "David Kim", initials: "DK", role: "VP Engineering", company: "Notion", location: "San Francisco", source: "Executive Search", stage: "Screened", stageColorClass: "bg-brand", aiScore: 78, appliedDate: "Feb 20", daysInPipeline: 48, requisition: "REQ-2026-004", recruiter: "Sarah Kim", tags: [], email: "david@notion.com" },
  { id: "cand-005", name: "Lisa Park", initials: "LP", role: "Product Designer", company: "Airbnb", location: "New York", source: "Career Page", stage: "Offer", stageColorClass: "bg-warning", aiScore: 84, appliedDate: "Mar 5", daysInPipeline: 35, requisition: "REQ-2026-003", recruiter: "Kavitha Menon", tags: ["Strong Hire"], email: "lisa@airbnb.com" },
  { id: "cand-006", name: "Rahul Sharma", initials: "RS", role: "Senior Frontend Engineer", company: "TCS", location: "Pune", source: "Vendor (TalentForce)", stage: "Screened", stageColorClass: "bg-brand", aiScore: 58, appliedDate: "Mar 22", daysInPipeline: 18, requisition: "REQ-2026-001", recruiter: "Amit Patel", tags: [], email: "rahul@tcs.com" },
  { id: "cand-007", name: "Alex Rivera", initials: "AR", role: "Senior Frontend Engineer", company: "Meta", location: "Remote", source: "Referral", stage: "Interview", stageColorClass: "bg-brand-purple", aiScore: 86, appliedDate: "Mar 12", daysInPipeline: 28, requisition: "REQ-2026-001", recruiter: "Sarah Kim", tags: ["Fast Track", "Referred"], email: "alex@meta.com" },
  { id: "cand-008", name: "Meera Patel", initials: "MP", role: "Senior Frontend Engineer", company: "Flipkart", location: "Bangalore", source: "AI Sourced", stage: "Applied", stageColorClass: "bg-info", aiScore: 74, appliedDate: "Mar 24", daysInPipeline: 16, requisition: "REQ-2026-001", recruiter: "Amit Patel", tags: ["AI Sourced"], email: "meera@flipkart.com" },
  { id: "cand-009", name: "Jordan Lee", initials: "JL", role: "DevOps Engineer", company: "Amazon", location: "Seattle", source: "LinkedIn", stage: "Interview", stageColorClass: "bg-brand-purple", aiScore: 80, appliedDate: "Mar 8", daysInPipeline: 32, requisition: "REQ-2026-007", recruiter: "Sarah Kim", tags: [], email: "jordan@amazon.com" },
  { id: "cand-010", name: "Ananya Reddy", initials: "AR", role: "Product Manager", company: "Swiggy", location: "Bangalore", source: "Career Page", stage: "Hired", stageColorClass: "bg-success", aiScore: 82, appliedDate: "Feb 15", daysInPipeline: 53, requisition: "REQ-2026-005", recruiter: "Kavitha Menon", tags: ["Strong Hire"], email: "ananya@swiggy.com" },
  { id: "cand-011", name: "Tom Wilson", initials: "TW", role: "Data Analyst", company: "Shopify", location: "Remote", source: "Direct Apply", stage: "Rejected", stageColorClass: "bg-destructive", aiScore: 45, appliedDate: "Mar 1", daysInPipeline: 10, requisition: "REQ-2026-010", recruiter: "Sarah Kim", tags: [], email: "tom@shopify.com" },
  { id: "cand-012", name: "Fatima Hassan", initials: "FH", role: "QA Engineer", company: "Infosys", location: "Mumbai", source: "Vendor (SkillBridge)", stage: "Screened", stageColorClass: "bg-brand", aiScore: 68, appliedDate: "Mar 20", daysInPipeline: 20, requisition: "REQ-2026-011", recruiter: "Amit Patel", tags: [], email: "fatima@infosys.com" },
  { id: "cand-013", name: "Aisha Khan", initials: "AK", role: "Full-Stack Engineer", company: "Google", location: "Bangalore", source: "AI Sourced", stage: "Interview", stageColorClass: "bg-brand-purple", aiScore: 94, appliedDate: "Mar 22", daysInPipeline: 18, requisition: "REQ-2026-001", recruiter: "Sarah Kim", tags: ["Strong Hire", "AI Sourced"], email: "aisha@google.com" },
  { id: "cand-014", name: "James O'Brien", initials: "JO", role: "Senior Frontend Engineer", company: "Netflix", location: "Remote", source: "AI Sourced", stage: "Final Round", stageColorClass: "bg-brand-teal", aiScore: 91, appliedDate: "Mar 5", daysInPipeline: 35, requisition: "REQ-2026-001", recruiter: "Sarah Kim", tags: ["Strong Hire"], email: "james@netflix.com" },
  { id: "cand-015", name: "Liam Chen", initials: "LC", role: "Senior Frontend Engineer", company: "Uber", location: "San Francisco", source: "Referral", stage: "Applied", stageColorClass: "bg-info", aiScore: null, appliedDate: "Mar 26", daysInPipeline: 14, requisition: "REQ-2026-001", recruiter: "—", tags: ["Referred"], email: "liam@uber.com" },
];

export const STAGE_CONFIG: Record<string, { label: string; dotClass: string }> = {
  Applied: { label: "Applied", dotClass: "bg-info" },
  Screened: { label: "Screened", dotClass: "bg-brand" },
  Interview: { label: "Interview", dotClass: "bg-brand-purple" },
  "Final Round": { label: "Final Round", dotClass: "bg-brand-teal" },
  Offer: { label: "Offer", dotClass: "bg-warning" },
  Hired: { label: "Hired", dotClass: "bg-success" },
  Rejected: { label: "Rejected", dotClass: "bg-destructive" },
};

/* ── Pipeline Stages ── */

export const PIPELINE_STAGES = [
  { name: "Applied", date: "Mar 18", status: "completed" as const },
  { name: "Screened", date: "Mar 20", status: "completed" as const },
  { name: "Interview", date: "Mar 25", status: "current" as const },
  { name: "Final", date: "Pending", status: "pending" as const },
  { name: "Offer", date: "Not sent", status: "pending" as const },
  { name: "Hired", date: "—", status: "pending" as const },
];

/* ── Skills Match ── */

export const SKILLS_MATCH = {
  required: [
    { skill: "React", stars: 3, status: "match" as const, detail: "7 yrs at Google & Stripe" },
    { skill: "TypeScript", stars: 3, status: "match" as const, detail: "Expert; used in all roles" },
    { skill: "System Design", stars: 2, status: "partial" as const, detail: "Strong frontend, limited backend" },
    { skill: "GraphQL", stars: 0, status: "gap" as const, detail: "Not used in recent roles" },
    { skill: "CSS/Tailwind", stars: 3, status: "match" as const, detail: "Expert level" },
    { skill: "Testing", stars: 2, status: "match" as const, detail: "E2E strategy at Stripe" },
    { skill: "Node.js", stars: 0, status: "gap" as const, detail: "No backend experience" },
  ],
  preferred: [
    { skill: "Next.js", stars: 2, status: "match" as const },
    { skill: "Performance Optimization", stars: 3, status: "match" as const },
    { skill: "Mentorship/Leadership", stars: 3, status: "match" as const },
  ],
  matchCount: 5,
  totalRequired: 7,
};

/* ── Interviews ── */

export interface CandidateInterview {
  id: string;
  type: string;
  interviewer: string;
  interviewerInitials: string;
  date: string;
  time: string;
  duration: string;
  platform: string;
  status: "completed" | "scheduled" | "cancelled";
  rating: number | null;
  recommendation: string | null;
  summary: string | null;
  criteriaRatings: { criterion: string; score: number }[];
}

export const CANDIDATE_INTERVIEWS: CandidateInterview[] = [
  { id: "ci1", type: "Technical Screen", interviewer: "Alex Rivera", interviewerInitials: "AR", date: "Mar 25", time: "10:00 AM – 10:50 AM PT", duration: "50 min", platform: "Google Meet", status: "completed", rating: 5, recommendation: "Strong Yes", summary: "Exceptional technical depth. Asked great clarifying questions and walked through solution with clear reasoning. Definitely advance to final round.", criteriaRatings: [{ criterion: "Communication", score: 5 }, { criterion: "Technical Depth", score: 5 }, { criterion: "Problem Solving", score: 4 }, { criterion: "Culture Fit", score: 4 }, { criterion: "System Design", score: 5 }] },
  { id: "ci2", type: "Phone Screen", interviewer: "Sarah Kim", interviewerInitials: "SK", date: "Mar 22", time: "2:00 PM – 2:32 PM PT", duration: "32 min", platform: "Zoom", status: "completed", rating: 4, recommendation: "Advance", summary: "Very articulate, passionate about frontend DX. Asked insightful questions about our tech stack.", criteriaRatings: [{ criterion: "Communication", score: 5 }, { criterion: "Technical Depth", score: 4 }, { criterion: "Problem Solving", score: 4 }, { criterion: "Culture Fit", score: 4 }, { criterion: "System Design", score: 3 }] },
  { id: "ci3", type: "Behavioral", interviewer: "Maria Lopez", interviewerInitials: "ML", date: "Mar 25", time: "4:00 PM – 4:45 PM PT", duration: "45 min", platform: "Zoom", status: "completed", rating: 4, recommendation: "Advance", summary: "Strong team player, great communication. Showed genuine interest in mentoring.", criteriaRatings: [{ criterion: "Communication", score: 4 }, { criterion: "Teamwork", score: 5 }, { criterion: "Problem Solving", score: 5 }, { criterion: "Culture Fit", score: 5 }] },
  { id: "ci4", type: "System Design", interviewer: "Rajesh Kumar", interviewerInitials: "RK", date: "Mar 26", time: "2:00 PM PT", duration: "60 min", platform: "Google Meet", status: "scheduled", rating: null, recommendation: null, summary: null, criteriaRatings: [] },
];

/* ── Scorecards ── */

export const SCORECARD_COMPARISON = [
  { criterion: "Communication", alex: 5, sarah: 5, maria: 4 },
  { criterion: "Technical Depth", alex: 5, sarah: 4, maria: null },
  { criterion: "Problem Solving", alex: 4, sarah: 4, maria: 5 },
  { criterion: "Culture Fit", alex: 4, sarah: 4, maria: 5 },
  { criterion: "System Design", alex: 5, sarah: 3, maria: null },
  { criterion: "Teamwork", alex: null, sarah: null, maria: 5 },
];

/* ── Communication ── */

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  body: string;
  date: string;
  time: string;
  status: string;
  engagement: string;
  isIncoming: boolean;
}

export const MESSAGES: Message[] = [
  { id: "m1", sender: "Sarah Chen", recipient: "Team", subject: "RE: Offer", body: "Thanks for the offer! I'm very excited. Let me review and get back to you by end of week.", date: "Mar 26", time: "9:30 AM", status: "Delivered", engagement: "Strong positive signal", isIncoming: true },
  { id: "m2", sender: "Recruiter Agent", recipient: "Sarah Chen", subject: "Offer: Senior Frontend Engineer", body: "Dear Sarah, We're excited to extend an offer for the Senior Frontend Engineer role...", date: "Mar 26", time: "8:00 AM", status: "Delivered · Opened 3x", engagement: "Clicked link, Time to read: 2 min", isIncoming: false },
  { id: "m3", sender: "Sarah Kim", recipient: "Sarah Chen", subject: "RE: Interview Follow-up", body: "Hi Sarah, Great to connect yesterday! I wanted to send over some additional info about the role...", date: "Mar 25", time: "4:00 PM", status: "Delivered · Opened", engagement: "No reply", isIncoming: false },
  { id: "m4", sender: "Sarah Chen", recipient: "Sarah Kim", subject: "RE: Interview Schedule", body: "Hi Sarah, Thanks for the details! Tuesday at 10 AM works perfectly for me.", date: "Mar 22", time: "9:15 AM", status: "Delivered", engagement: "Response in 2 hrs", isIncoming: true },
  { id: "m5", sender: "Recruiter Agent", recipient: "Sarah Chen", subject: "Interview Schedule: Senior Frontend Engineer", body: "Hi Sarah, We'd like to schedule your technical interview for...", date: "Mar 21", time: "3:00 PM", status: "Delivered · Opened", engagement: "Replied same day", isIncoming: false },
];

/* ── Offer ── */

export const OFFER = {
  id: "SFE-2026-CHEN-001",
  status: "Pending Approval",
  statusColorClass: "bg-warning/10 text-warning",
  title: "Senior Frontend Engineer",
  department: "Engineering",
  team: "Frontend Platform",
  manager: "Rajesh Kumar",
  startDate: "April 15, 2026",
  expirationDate: "March 30, 2026",
  daysToExpire: 4,
  baseSalary: "$185,000",
  signingBonus: "$25,000",
  performanceBonus: "15%",
  equity: "$500,000 (4yr vest)",
  relocation: "$15,000",
  benefits: ["Health Insurance (medical, dental, vision)", "401(k) matching (6%)", "22 days PTO + 10 holidays", "Home office setup ($5,000)", "Professional development ($3,000/yr)", "Parental leave (16 weeks)"],
  approvalChain: [
    { name: "Deepak Shah", role: "HR Lead", status: "approved" as const, date: "Mar 26, 10:15 AM" },
    { name: "Prashant Singh", role: "CFO", status: "pending" as const, date: null },
    { name: "Rajesh Kumar", role: "VP Engineering", status: "waiting" as const, date: null },
  ],
};

/* ── Documents ── */

export interface CandidateDocument {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedDate: string;
  status: "reviewed" | "pending" | "approved" | "signed";
  statusColorClass: string;
  description: string;
}

export const DOCUMENTS: CandidateDocument[] = [
  { id: "d1", name: "Resume_Sarah_Chen_2026.pdf", type: "📄", size: "245 KB", uploadedDate: "Mar 18", status: "reviewed", statusColorClass: "bg-brand/10 text-brand", description: "7 years experience, Stanford CS" },
  { id: "d2", name: "Portfolio_Website.pdf", type: "📎", size: "1.2 MB", uploadedDate: "Mar 19", status: "pending", statusColorClass: "bg-warning/10 text-warning", description: "Awaiting hiring manager review" },
  { id: "d3", name: "References.docx", type: "📋", size: "89 KB", uploadedDate: "Mar 22", status: "approved", statusColorClass: "bg-success/10 text-success", description: "3 references (Google, Stripe, Stanford)" },
  { id: "d4", name: "Background_Check_Report.pdf", type: "✓", size: "567 KB", uploadedDate: "Mar 25", status: "approved", statusColorClass: "bg-success/10 text-success", description: "Clear — no issues" },
  { id: "d5", name: "Signed_Offer_SFE-2026-CHEN-001.pdf", type: "✓", size: "234 KB", uploadedDate: "Mar 30", status: "signed", statusColorClass: "bg-success/10 text-success", description: "Signed by Sarah Chen" },
];

/* ── Activity Log ── */

export interface ActivityEvent {
  id: string;
  date: string;
  time: string;
  icon: string;
  title: string;
  description: string;
  type: "stage" | "interview" | "ai" | "message" | "offer" | "document" | "system";
  link?: string;
}

export const ACTIVITY_LOG: ActivityEvent[] = [
  { id: "a1", date: "Mar 30", time: "3:15 PM", icon: "📋", title: "Offer Accepted", description: "Sarah Chen accepted offer SFE-2026-CHEN-001. Signed documentation submitted.", type: "offer" },
  { id: "a2", date: "Mar 30", time: "9:00 AM", icon: "✅", title: "Offer Approved", description: "CFO (Prashant Singh) approved offer.", type: "offer" },
  { id: "a3", date: "Mar 29", time: "2:30 PM", icon: "💬", title: "Counter-Offer Received", description: "Sarah Chen countered: Base $195K, Equity $600K, Start Apr 22.", type: "message" },
  { id: "a4", date: "Mar 26", time: "8:00 AM", icon: "📨", title: "Offer Sent", description: "Recruiter Agent sent offer to sarah.chen@google.com.", type: "offer" },
  { id: "a5", date: "Mar 25", time: "4:15 PM", icon: "🎤", title: "Interview Completed", description: "Behavioral interview with Maria Lopez (45 min). Rating: 4/5 — Advance.", type: "interview" },
  { id: "a6", date: "Mar 25", time: "10:00 AM", icon: "🎤", title: "Interview Completed", description: "Technical interview with Alex Rivera (50 min). Rating: 5/5 — Strong Yes.", type: "interview" },
  { id: "a7", date: "Mar 25", time: "12:00 AM", icon: "⚙️", title: "Stage Changed", description: "Interview → Final Round (auto-triggered by technical interview completion).", type: "stage" },
  { id: "a8", date: "Mar 22", time: "2:32 PM", icon: "🎤", title: "Interview Completed", description: "Phone screen with Sarah Kim (32 min). Rating: 4/5 — Advance.", type: "interview" },
  { id: "a9", date: "Mar 20", time: "3:45 PM", icon: "🤖", title: "AI Screened", description: "Recruiter Agent scored candidate 88/100. Auto-advanced to Screened stage.", type: "ai" },
  { id: "a10", date: "Mar 18", time: "3:42 PM", icon: "📨", title: "Applied", description: "Candidate applied via LinkedIn (AI Sourced). Resume + portfolio submitted.", type: "system" },
];

/* ── Helpers ── */

export function scoreColor(score: number): string {
  if (score >= 90) return "text-success";
  if (score >= 75) return "text-brand-teal";
  if (score >= 60) return "text-brand";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

export function scoreBgColor(score: number): string {
  if (score >= 90) return "bg-success";
  if (score >= 75) return "bg-brand-teal";
  if (score >= 60) return "bg-brand";
  if (score >= 40) return "bg-warning";
  return "bg-destructive";
}

export function stageColor(status: string): string {
  switch (status) {
    case "completed": return "bg-success";
    case "current": return "bg-brand-purple";
    case "pending": return "bg-secondary";
    default: return "bg-secondary";
  }
}

export function activityDotColor(type: string): string {
  switch (type) {
    case "offer": return "bg-warning";
    case "interview": return "bg-brand-teal";
    case "ai": return "bg-brand-purple";
    case "message": return "bg-brand";
    case "stage": return "bg-info";
    case "document": return "bg-success";
    default: return "bg-muted-foreground";
  }
}

export function skillStatusColor(status: string): string {
  switch (status) {
    case "match": return "text-success";
    case "partial": return "text-warning";
    case "gap": return "text-destructive";
    default: return "text-muted-foreground";
  }
}

export function skillStatusIcon(status: string): string {
  switch (status) {
    case "match": return "✓";
    case "partial": return "⚠";
    case "gap": return "✗";
    default: return "—";
  }
}
