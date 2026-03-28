/* ================================================================
   O2S Requisitions v2 — Types & Mock Data
   Multi-slot positions, TA Queue, HR Queue, Candidate Mapping
   ================================================================ */

export type ReqTab = "all" | "pending" | "taQueue" | "hrQueue" | "headcount" | "analytics";

export const REQ_TABS: { key: ReqTab; label: string; count?: number }[] = [
  { key: "all", label: "All Requisitions" },
  { key: "pending", label: "Pending Approval", count: 8 },
  { key: "taQueue", label: "TA Queue", count: 6 },
  { key: "hrQueue", label: "HR Queue", count: 3 },
  { key: "headcount", label: "Headcount Planning" },
  { key: "analytics", label: "Analytics" },
];

/* ── Status Config ── */

export type ReqStatus = "draft" | "pending_approval" | "approved" | "sourcing" | "interviewing" | "offer_stage" | "partially_filled" | "filled" | "on_hold" | "cancelled";
export type SlotStatus = "open" | "sourcing" | "interviewing" | "offer_extended" | "offer_accepted" | "filled" | "on_hold" | "cancelled";
export type ReqPriority = "urgent" | "high" | "standard" | "low";
export type ReqType = "new_headcount" | "backfill" | "contractor" | "intern" | "conversion";

export const STATUS_CONFIG: Record<ReqStatus, { label: string; abbr: string; dotClass: string; textClass: string }> = {
  draft:              { label: "Draft",              abbr: "Drf", dotClass: "bg-muted-foreground",    textClass: "text-muted-foreground" },
  pending_approval:   { label: "Pending Approval",   abbr: "Pen", dotClass: "bg-warning",            textClass: "text-warning" },
  approved:           { label: "Approved",           abbr: "Apr", dotClass: "bg-success",             textClass: "text-success" },
  sourcing:           { label: "Sourcing",           abbr: "Src", dotClass: "bg-brand",               textClass: "text-brand" },
  interviewing:       { label: "Interviewing",       abbr: "Int", dotClass: "bg-brand-purple",        textClass: "text-brand-purple" },
  offer_stage:        { label: "Offer Stage",        abbr: "Ofr", dotClass: "bg-info",                textClass: "text-info" },
  partially_filled:   { label: "Partially Filled",   abbr: "PFl", dotClass: "bg-brand-teal",          textClass: "text-brand-teal" },
  filled:             { label: "Filled",             abbr: "Fld", dotClass: "bg-success",             textClass: "text-success" },
  on_hold:            { label: "On Hold",            abbr: "Hld", dotClass: "bg-destructive",         textClass: "text-destructive" },
  cancelled:          { label: "Cancelled",          abbr: "Cnc", dotClass: "bg-muted-foreground/40", textClass: "text-muted-foreground/40" },
};

export const SLOT_STATUS_CONFIG: Record<SlotStatus, { label: string; dotClass: string }> = {
  open:             { label: "Open",             dotClass: "bg-brand" },
  sourcing:         { label: "Sourcing",         dotClass: "bg-warning" },
  interviewing:     { label: "Interviewing",     dotClass: "bg-brand-purple" },
  offer_extended:   { label: "Offer Extended",   dotClass: "bg-info" },
  offer_accepted:   { label: "Offer Accepted",   dotClass: "bg-success" },
  filled:           { label: "Filled",           dotClass: "bg-success" },
  on_hold:          { label: "On Hold",          dotClass: "bg-destructive" },
  cancelled:        { label: "Cancelled",        dotClass: "bg-muted-foreground" },
};

export const PRIORITY_CONFIG: Record<ReqPriority, { label: string; dotClass: string; textClass: string }> = {
  urgent:   { label: "Urgent",   dotClass: "bg-destructive",      textClass: "text-destructive" },
  high:     { label: "High",     dotClass: "bg-warning",          textClass: "text-warning" },
  standard: { label: "Standard", dotClass: "bg-brand",            textClass: "text-brand" },
  low:      { label: "Low",      dotClass: "bg-muted-foreground", textClass: "text-muted-foreground" },
};

export const TYPE_CONFIG: Record<ReqType, { label: string; colorClass: string }> = {
  new_headcount: { label: "New Headcount", colorClass: "text-brand" },
  backfill:      { label: "Backfill",      colorClass: "text-success" },
  contractor:    { label: "Contractor",    colorClass: "text-warning" },
  intern:        { label: "Intern",        colorClass: "text-brand-purple" },
  conversion:    { label: "Conversion",    colorClass: "text-brand-teal" },
};

/* ── Position Slot ── */

export interface PositionSlot {
  id: string;
  slotNumber: number;
  location: string;
  workMode: string;
  status: SlotStatus;
  candidatesMapped: number;
  interviewing: number;
  offers: number;
  recruiter: string;
  compensationOverride?: string;
}

/* ── Candidate Mapping ── */

export interface CandidateMapping {
  id: string;
  name: string;
  initials: string;
  matchScore: number;
  stage: string;
  source: string;
  mappedDate: string;
}

/* ── Approval Step ── */

export interface ApprovalStep {
  name: string;
  role: string;
  status: "approved" | "pending" | "rejected" | "waiting";
  date: string | null;
  comment?: string;
}

/* ── Job Description ── */

export interface JobDescription {
  aboutRole: string;
  responsibilities: string[];
  requiredSkills: string[];
  preferredSkills: string[];
  qualifications: string;
  jdQualityScore: number;
  generatedByAI: boolean;
}

/* ── Requisition ── */

export interface Requisition {
  id: string;
  title: string;
  department: string;
  level: string;
  type: ReqType;
  priority: ReqPriority;
  status: ReqStatus;
  hiringManager: string;
  createdDate: string;
  targetFillDate: string;
  daysOpen: number | null;
  salaryRange: string;
  totalPositions: number;
  filledPositions: number;
  slots: PositionSlot[];
  totalCandidatesMapped: number;
  totalInterviewing: number;
  totalOffers: number;
  approvalChain: ApprovalStep[];
  approvalProgress: string;
  aiUrgencyScore: number;
  healthScore: number | null;
  businessCase: string;
  linkedJobId: string | null;
  aiInsight: string;
  jobDescription?: JobDescription;
  minExperience?: number;
  education?: string;
  certifications?: string[];
  equityEligible?: boolean;
  bonusEligible?: boolean;
  bonusTarget?: string;
  autoCreateJob?: boolean;
}

/* ── Form Options ── */

export const DEPARTMENTS = ["Engineering", "Design", "Product", "Marketing", "Sales", "HR & People", "Finance", "Operations", "Legal"];

export const LEVELS = [
  { value: "IC1", label: "IC1 — Junior" },
  { value: "IC2", label: "IC2 — Associate" },
  { value: "IC3", label: "IC3 — Mid-Level" },
  { value: "IC4", label: "IC4 — Senior" },
  { value: "IC5", label: "IC5 — Staff" },
  { value: "IC6", label: "IC6 — Principal" },
  { value: "M1", label: "M1 — Manager" },
  { value: "M2", label: "M2 — Senior Manager" },
  { value: "M3", label: "M3 — Director" },
  { value: "M4", label: "M4 — VP" },
  { value: "M5", label: "M5 — SVP / C-Level" },
];

export const HIRING_MANAGERS = [
  "Prashant Singh", "Rajesh Kumar", "Lisa Park", "Amit Verma", "Neha Gupta", "Kavitha Menon", "Anil Singh",
];

export const RECRUITERS = [
  "Sarah Kim", "Amit Patel", "Kavitha Menon",
];

export const LOCATIONS = [
  "Bangalore, India", "Pune, India", "Mumbai, India", "Kopa, India", "Remote — India", "Remote — International",
  "San Francisco, USA", "New York, USA", "Remote — USA", "Dubai, UAE",
];

export const APPROVERS = [
  { name: "Rajesh Kumar", role: "VP Engineering" },
  { name: "Prashant Singh", role: "CEO" },
  { name: "Deepak Joshi", role: "CFO" },
  { name: "Lisa Park", role: "VP Design" },
  { name: "Amit Verma", role: "VP Sales" },
  { name: "Neha Gupta", role: "VP Product" },
  { name: "Ananya Sharma", role: "Finance Director" },
];

/* ── AI JD Templates ── */

export const AI_JD_TEMPLATES: Record<string, { aboutRole: string; responsibilities: string[]; requiredSkills: string[]; preferredSkills: string[]; qualifications: string }> = {
  "Senior Frontend Engineer": {
    aboutRole: "We're looking for a Senior Frontend Engineer to join our team and build high-quality, scalable user interfaces. You'll work closely with designers and backend engineers to deliver exceptional user experiences across our platform.",
    responsibilities: [
      "Architect and build reusable React component libraries and design systems",
      "Drive frontend performance optimization across all product surfaces",
      "Mentor 2-3 junior engineers on the platform team",
      "Collaborate with Design on the design system evolution and component standards",
      "Lead technical decisions for frontend architecture and technology choices",
      "Conduct thorough code reviews and establish coding standards",
      "Participate in on-call rotation for frontend infrastructure",
    ],
    requiredSkills: ["React", "TypeScript", "System Design", "CSS/Tailwind", "Testing", "Performance Optimization"],
    preferredSkills: ["Next.js", "GraphQL", "Design Systems", "Accessibility", "Mentoring"],
    qualifications: "Bachelor's degree in Computer Science or equivalent. 5+ years of professional frontend development experience with React and TypeScript. Proven track record of building production applications at scale.",
  },
  "Backend Engineer": {
    aboutRole: "We're hiring a Backend Engineer to design and build robust, scalable APIs and services. You'll work on our core platform infrastructure, ensuring reliability and performance at scale.",
    responsibilities: [
      "Design and implement RESTful and GraphQL APIs",
      "Build and maintain microservices architecture",
      "Optimize database queries and data pipelines",
      "Implement security best practices and data protection",
      "Write comprehensive tests and maintain CI/CD pipelines",
      "Participate in architecture reviews and technical discussions",
    ],
    requiredSkills: ["Python", "Node.js", "PostgreSQL", "REST APIs", "Docker", "AWS"],
    preferredSkills: ["GraphQL", "Kubernetes", "Redis", "Kafka", "Terraform"],
    qualifications: "Bachelor's in CS or equivalent. 3+ years backend development experience. Strong understanding of distributed systems and database design.",
  },
  "Product Designer": {
    aboutRole: "We're looking for a Product Designer to create intuitive, beautiful experiences across our platform. You'll own the full design process from research through to final delivery.",
    responsibilities: [
      "Lead end-to-end design for product features from concept to launch",
      "Conduct user research, usability testing, and data analysis",
      "Create wireframes, prototypes, and high-fidelity designs in Figma",
      "Build and maintain our design system components",
      "Collaborate closely with product managers and engineers",
      "Present designs to stakeholders and incorporate feedback",
    ],
    requiredSkills: ["Figma", "User Research", "Prototyping", "Design Systems", "Interaction Design"],
    preferredSkills: ["Motion Design", "Accessibility", "Data Visualization", "HTML/CSS"],
    qualifications: "3+ years of product design experience. Strong portfolio demonstrating end-to-end design process. Experience with design systems at scale.",
  },
};


/* ── HR Queue Item ── */

export interface HRQueueItem {
  id: string;
  requisitionId: string;
  candidateName: string;
  candidateInitials: string;
  jobTitle: string;
  slotInfo: string;
  department: string;
  location: string;
  joiningDate: string;
  daysUntilJoining: number;
  handoffDate: string;
  handoffBy: string;
  offerDetails: string;
  tasks: { text: string; status: "done" | "in_progress" | "pending" }[];
  preboardingProgress: number;
}

/* ── Mock Requisitions ── */

export const REQUISITIONS: Requisition[] = [
  {
    id: "REQ-2026-001", title: "Senior Frontend Engineer", department: "Engineering", level: "IC4", type: "new_headcount", priority: "urgent", status: "sourcing",
    hiringManager: "Rajesh Kumar", createdDate: "Jan 15", targetFillDate: "Apr 30", daysOpen: 64, salaryRange: "₹28L–50L",
    totalPositions: 2, filledPositions: 0,
    slots: [
      { id: "S1", slotNumber: 1, location: "Pune, India", workMode: "Onsite", status: "interviewing", candidatesMapped: 5, interviewing: 2, offers: 0, recruiter: "Sarah Kim" },
      { id: "S2", slotNumber: 2, location: "Kopa, India", workMode: "Hybrid", status: "sourcing", candidatesMapped: 2, interviewing: 0, offers: 0, recruiter: "Amit Patel" },
    ],
    totalCandidatesMapped: 7, totalInterviewing: 2, totalOffers: 0,
    approvalChain: [{ name: "Rajesh Kumar", role: "HM", status: "approved", date: "Jan 15" }, { name: "Deepak Joshi", role: "CFO", status: "approved", date: "Jan 18" }, { name: "Prashant Singh", role: "VP", status: "approved", date: "Jan 21" }],
    approvalProgress: "3/3", aiUrgencyScore: 78, healthScore: 72,
    businessCase: "Frontend team at capacity with 3 product launches in Q2. Need 2 senior engineers for dashboard and mobile web initiatives.",
    linkedJobId: "JOB-001", aiInsight: "Pune slot on track. Kopa needs 6+ more candidates — found 6 matches in Talent Pool.",
  },
  {
    id: "REQ-2026-002", title: "Backend Engineer", department: "Engineering", level: "IC3", type: "new_headcount", priority: "urgent", status: "interviewing",
    hiringManager: "Rajesh Kumar", createdDate: "Jan 20", targetFillDate: "Apr 15", daysOpen: 58, salaryRange: "₹22L–45L",
    totalPositions: 3, filledPositions: 1,
    slots: [
      { id: "S3", slotNumber: 1, location: "Bangalore, India", workMode: "Hybrid", status: "filled", candidatesMapped: 6, interviewing: 0, offers: 0, recruiter: "Sarah Kim" },
      { id: "S4", slotNumber: 2, location: "Pune, India", workMode: "Onsite", status: "interviewing", candidatesMapped: 4, interviewing: 3, offers: 1, recruiter: "Sarah Kim" },
      { id: "S5", slotNumber: 3, location: "Remote", workMode: "Remote", status: "sourcing", candidatesMapped: 2, interviewing: 0, offers: 0, recruiter: "Amit Patel" },
    ],
    totalCandidatesMapped: 12, totalInterviewing: 3, totalOffers: 1,
    approvalChain: [{ name: "Rajesh Kumar", role: "HM", status: "approved", date: "Jan 20" }, { name: "Prashant Singh", role: "VP", status: "approved", date: "Jan 22" }],
    approvalProgress: "2/2", aiUrgencyScore: 82, healthScore: 68,
    businessCase: "Scaling backend team for API gateway and microservices migration.", linkedJobId: "JOB-002",
    aiInsight: "Slot 1 filled. Slot 2 has strong pipeline. Slot 3 needs sourcing — recommend AI sourcing from LinkedIn.",
  },
  {
    id: "REQ-2026-003", title: "Product Designer", department: "Design", level: "IC3", type: "new_headcount", priority: "high", status: "offer_stage",
    hiringManager: "Lisa Park", createdDate: "Feb 15", targetFillDate: "May 15", daysOpen: 38, salaryRange: "₹18L–28L",
    totalPositions: 1, filledPositions: 0,
    slots: [
      { id: "S6", slotNumber: 1, location: "Bangalore, India", workMode: "On-site", status: "offer_extended", candidatesMapped: 4, interviewing: 0, offers: 1, recruiter: "Kavitha Menon" },
    ],
    totalCandidatesMapped: 4, totalInterviewing: 0, totalOffers: 1,
    approvalChain: [{ name: "Lisa Park", role: "HM", status: "approved", date: "Feb 15" }, { name: "Prashant Singh", role: "VP", status: "approved", date: "Feb 17" }],
    approvalProgress: "2/2", aiUrgencyScore: 55, healthScore: 91,
    businessCase: "Need dedicated product designer for new mobile app initiative.", linkedJobId: "JOB-003",
    aiInsight: "Offer extended to top candidate. Response expected within 3 days.",
  },
  {
    id: "REQ-2026-004", title: "VP Engineering", department: "Engineering", level: "M4", type: "new_headcount", priority: "urgent", status: "interviewing",
    hiringManager: "Prashant Singh", createdDate: "Dec 10", targetFillDate: "Apr 30", daysOpen: 100, salaryRange: "₹60L–90L",
    totalPositions: 1, filledPositions: 0,
    slots: [
      { id: "S7", slotNumber: 1, location: "Bangalore, India", workMode: "Hybrid", status: "interviewing", candidatesMapped: 3, interviewing: 2, offers: 0, recruiter: "Sarah Kim" },
    ],
    totalCandidatesMapped: 3, totalInterviewing: 2, totalOffers: 0,
    approvalChain: [{ name: "Prashant Singh", role: "CEO", status: "approved", date: "Dec 10" }, { name: "Deepak Joshi", role: "CFO", status: "approved", date: "Dec 12" }],
    approvalProgress: "2/2", aiUrgencyScore: 92, healthScore: 45,
    businessCase: "Critical leadership hire for engineering org scaling to 50+.", linkedJobId: "JOB-004",
    aiInsight: "SLA breached. 2 finalists in process — recommend expediting decisions.",
  },
  {
    id: "REQ-2026-005", title: "Growth Marketing Manager", department: "Marketing", level: "IC3", type: "new_headcount", priority: "standard", status: "on_hold",
    hiringManager: "Prashant Singh", createdDate: "Feb 22", targetFillDate: "May 30", daysOpen: 31, salaryRange: "₹20L–32L",
    totalPositions: 1, filledPositions: 0,
    slots: [{ id: "S8", slotNumber: 1, location: "Mumbai, India", workMode: "Hybrid", status: "on_hold", candidatesMapped: 3, interviewing: 0, offers: 0, recruiter: "Kavitha Menon" }],
    totalCandidatesMapped: 3, totalInterviewing: 0, totalOffers: 0,
    approvalChain: [{ name: "Prashant Singh", role: "CEO", status: "approved", date: "Feb 22" }],
    approvalProgress: "1/1", aiUrgencyScore: 42, healthScore: 52,
    businessCase: "Growth team expansion for Q3 campaigns.", linkedJobId: "JOB-005",
    aiInsight: "On hold per budget review. 3 candidates mapped — resume when unblocked.",
  },
  {
    id: "REQ-2026-006", title: "Staff ML Engineer", department: "Engineering", level: "IC5", type: "new_headcount", priority: "high", status: "draft",
    hiringManager: "Prashant Singh", createdDate: "Mar 18", targetFillDate: "Jun 30", daysOpen: null, salaryRange: "₹40L–60L",
    totalPositions: 1, filledPositions: 0,
    slots: [{ id: "S9", slotNumber: 1, location: "Remote", workMode: "Remote", status: "open", candidatesMapped: 0, interviewing: 0, offers: 0, recruiter: "—" }],
    totalCandidatesMapped: 0, totalInterviewing: 0, totalOffers: 0,
    approvalChain: [], approvalProgress: "—", aiUrgencyScore: 35, healthScore: null,
    businessCase: "AI/ML team expansion for O2S intelligence layer.", linkedJobId: null,
    aiInsight: "Draft — submit for approval to begin sourcing.",
  },
  // Pending approval
  { id: "REQ-2026-007", title: "DevOps Engineer", department: "Engineering", level: "IC3", type: "new_headcount", priority: "high", status: "pending_approval", hiringManager: "Rajesh Kumar", createdDate: "Mar 10", targetFillDate: "May 15", daysOpen: null, salaryRange: "₹20L–32L", totalPositions: 1, filledPositions: 0, slots: [{ id: "S10", slotNumber: 1, location: "Mumbai, India", workMode: "Hybrid", status: "open", candidatesMapped: 0, interviewing: 0, offers: 0, recruiter: "—" }], totalCandidatesMapped: 0, totalInterviewing: 0, totalOffers: 0, approvalChain: [{ name: "Rajesh Kumar", role: "HM", status: "approved", date: "Mar 10" }, { name: "Deepak Joshi", role: "CFO", status: "pending", date: null }], approvalProgress: "1/2", aiUrgencyScore: 65, healthScore: null, businessCase: "Infrastructure team needs DevOps capacity for CI/CD migration.", linkedJobId: null, aiInsight: "Awaiting CFO approval." },
  { id: "REQ-2026-008", title: "Account Executive", department: "Sales", level: "IC3", type: "new_headcount", priority: "high", status: "pending_approval", hiringManager: "Amit Verma", createdDate: "Mar 12", targetFillDate: "May 30", daysOpen: null, salaryRange: "₹18L–30L", totalPositions: 2, filledPositions: 0, slots: [{ id: "S11", slotNumber: 1, location: "Bangalore", workMode: "On-site", status: "open", candidatesMapped: 0, interviewing: 0, offers: 0, recruiter: "—" }, { id: "S12", slotNumber: 2, location: "Mumbai", workMode: "On-site", status: "open", candidatesMapped: 0, interviewing: 0, offers: 0, recruiter: "—" }], totalCandidatesMapped: 0, totalInterviewing: 0, totalOffers: 0, approvalChain: [{ name: "Amit Verma", role: "HM", status: "approved", date: "Mar 12" }, { name: "Prashant Singh", role: "VP", status: "pending", date: null }], approvalProgress: "1/2", aiUrgencyScore: 58, healthScore: null, businessCase: "Sales expansion for enterprise segment.", linkedJobId: null, aiInsight: "Pending VP approval." },
  { id: "REQ-2026-009", title: "UX Researcher", department: "Design", level: "IC3", type: "new_headcount", priority: "standard", status: "pending_approval", hiringManager: "Lisa Park", createdDate: "Mar 14", targetFillDate: "Jun 15", daysOpen: null, salaryRange: "₹16L–28L", totalPositions: 1, filledPositions: 0, slots: [{ id: "S13", slotNumber: 1, location: "Bangalore", workMode: "Hybrid", status: "open", candidatesMapped: 0, interviewing: 0, offers: 0, recruiter: "—" }], totalCandidatesMapped: 0, totalInterviewing: 0, totalOffers: 0, approvalChain: [{ name: "Lisa Park", role: "HM", status: "approved", date: "Mar 14" }, { name: "Prashant Singh", role: "VP", status: "pending", date: null }], approvalProgress: "1/2", aiUrgencyScore: 45, healthScore: null, businessCase: "User research capacity for product discovery.", linkedJobId: null, aiInsight: "Pending VP approval." },
  { id: "REQ-2026-010", title: "Security Engineer", department: "Engineering", level: "IC3", type: "backfill", priority: "standard", status: "pending_approval", hiringManager: "Rajesh Kumar", createdDate: "Mar 15", targetFillDate: "May 30", daysOpen: null, salaryRange: "₹24L–38L", totalPositions: 1, filledPositions: 0, slots: [{ id: "S14", slotNumber: 1, location: "Bangalore", workMode: "Hybrid", status: "open", candidatesMapped: 0, interviewing: 0, offers: 0, recruiter: "—" }], totalCandidatesMapped: 0, totalInterviewing: 0, totalOffers: 0, approvalChain: [{ name: "Rajesh Kumar", role: "HM", status: "approved", date: "Mar 15" }, { name: "Deepak Joshi", role: "CFO", status: "pending", date: null }, { name: "Prashant Singh", role: "VP", status: "waiting", date: null }], approvalProgress: "1/3", aiUrgencyScore: 58, healthScore: null, businessCase: "Backfill for departing security engineer.", linkedJobId: null, aiInsight: "Awaiting CFO approval." },
  { id: "REQ-2026-011", title: "Junior Frontend Developer", department: "Engineering", level: "IC1", type: "new_headcount", priority: "low", status: "pending_approval", hiringManager: "Rajesh Kumar", createdDate: "Mar 18", targetFillDate: "Jun 30", daysOpen: null, salaryRange: "₹8L–15L", totalPositions: 2, filledPositions: 0, slots: [{ id: "S15", slotNumber: 1, location: "Pune", workMode: "Onsite", status: "open", candidatesMapped: 0, interviewing: 0, offers: 0, recruiter: "—" }, { id: "S16", slotNumber: 2, location: "Kopa", workMode: "Onsite", status: "open", candidatesMapped: 0, interviewing: 0, offers: 0, recruiter: "—" }], totalCandidatesMapped: 0, totalInterviewing: 0, totalOffers: 0, approvalChain: [{ name: "Rajesh Kumar", role: "HM", status: "approved", date: "Mar 18" }, { name: "Prashant Singh", role: "VP", status: "pending", date: null }], approvalProgress: "1/2", aiUrgencyScore: 25, healthScore: null, businessCase: "Junior hires for frontend platform team.", linkedJobId: null, aiInsight: "Pending VP approval." },
  { id: "REQ-2026-012", title: "HR Business Partner", department: "HR & People", level: "IC4", type: "backfill", priority: "high", status: "pending_approval", hiringManager: "Prashant Singh", createdDate: "Mar 20", targetFillDate: "May 15", daysOpen: null, salaryRange: "₹22L–35L", totalPositions: 1, filledPositions: 0, slots: [{ id: "S17", slotNumber: 1, location: "Bangalore", workMode: "Hybrid", status: "open", candidatesMapped: 0, interviewing: 0, offers: 0, recruiter: "—" }], totalCandidatesMapped: 0, totalInterviewing: 0, totalOffers: 0, approvalChain: [{ name: "Prashant Singh", role: "CEO", status: "approved", date: "Mar 20" }, { name: "Deepak Joshi", role: "CFO", status: "pending", date: null }], approvalProgress: "1/2", aiUrgencyScore: 68, healthScore: null, businessCase: "Backfill for HRBP supporting engineering.", linkedJobId: null, aiInsight: "Awaiting CFO approval." },
  { id: "REQ-2026-013", title: "SDR", department: "Sales", level: "IC1", type: "new_headcount", priority: "standard", status: "pending_approval", hiringManager: "Amit Verma", createdDate: "Mar 22", targetFillDate: "May 30", daysOpen: null, salaryRange: "₹6L–12L", totalPositions: 3, filledPositions: 0, slots: [{ id: "S18", slotNumber: 1, location: "Bangalore", workMode: "On-site", status: "open", candidatesMapped: 0, interviewing: 0, offers: 0, recruiter: "—" }, { id: "S19", slotNumber: 2, location: "Mumbai", workMode: "On-site", status: "open", candidatesMapped: 0, interviewing: 0, offers: 0, recruiter: "—" }, { id: "S20", slotNumber: 3, location: "Pune", workMode: "On-site", status: "open", candidatesMapped: 0, interviewing: 0, offers: 0, recruiter: "—" }], totalCandidatesMapped: 0, totalInterviewing: 0, totalOffers: 0, approvalChain: [{ name: "Amit Verma", role: "HM", status: "approved", date: "Mar 22" }, { name: "Deepak Joshi", role: "CFO", status: "pending", date: null }], approvalProgress: "1/2", aiUrgencyScore: 40, healthScore: null, businessCase: "SDR team expansion for pipeline generation.", linkedJobId: null, aiInsight: "Pending CFO approval." },
  // Sourcing (approved, in TA Queue)
  { id: "REQ-2026-014", title: "Data Engineer", department: "Engineering", level: "IC3", type: "new_headcount", priority: "standard", status: "sourcing", hiringManager: "Prashant Singh", createdDate: "Mar 1", targetFillDate: "May 31", daysOpen: 25, salaryRange: "₹20L–35L", totalPositions: 1, filledPositions: 0, slots: [{ id: "S21", slotNumber: 1, location: "Remote", workMode: "Remote", status: "sourcing", candidatesMapped: 4, interviewing: 0, offers: 0, recruiter: "Amit Patel" }], totalCandidatesMapped: 4, totalInterviewing: 0, totalOffers: 0, approvalChain: [{ name: "Prashant Singh", role: "CEO", status: "approved", date: "Mar 3" }], approvalProgress: "1/1", aiUrgencyScore: 50, healthScore: 60, businessCase: "Data pipeline team for analytics infrastructure.", linkedJobId: "JOB-014", aiInsight: "4 candidates mapped, screening in progress." },
  { id: "REQ-2026-015", title: "Content Marketer", department: "Marketing", level: "IC2", type: "new_headcount", priority: "low", status: "sourcing", hiringManager: "Prashant Singh", createdDate: "Mar 5", targetFillDate: "Jun 15", daysOpen: 21, salaryRange: "₹10L–18L", totalPositions: 1, filledPositions: 0, slots: [{ id: "S22", slotNumber: 1, location: "Mumbai", workMode: "Hybrid", status: "sourcing", candidatesMapped: 2, interviewing: 0, offers: 0, recruiter: "Kavitha Menon" }], totalCandidatesMapped: 2, totalInterviewing: 0, totalOffers: 0, approvalChain: [{ name: "Prashant Singh", role: "CEO", status: "approved", date: "Mar 7" }], approvalProgress: "1/1", aiUrgencyScore: 30, healthScore: 55, businessCase: "Content marketing for thought leadership.", linkedJobId: "JOB-015", aiInsight: "2 candidates mapped, more sourcing needed." },
];

/* ── HR Queue ── */

export const HR_QUEUE: HRQueueItem[] = [
  { id: "hrq1", requisitionId: "REQ-2026-002", candidateName: "Sarah Chen", candidateInitials: "SC", jobTitle: "Backend Engineer", slotInfo: "Slot 1 of 3", department: "Engineering", location: "Bangalore (Hybrid)", joiningDate: "Mar 31, 2026", daysUntilJoining: 5, handoffDate: "Mar 15", handoffBy: "Sarah Kim", offerDetails: "₹35L LPA · Notice: Completed", tasks: [{ text: "Offer letter signed", status: "done" }, { text: "Background verification", status: "done" }, { text: "ID verification (Aadhaar + PAN)", status: "in_progress" }, { text: "Equipment request (MacBook Pro)", status: "in_progress" }, { text: "Email & Slack provisioning", status: "pending" }, { text: "Buddy assignment", status: "pending" }, { text: "Day-1 schedule creation", status: "pending" }], preboardingProgress: 40 },
  { id: "hrq2", requisitionId: "REQ-2026-003", candidateName: "Priya Desai", candidateInitials: "PD", jobTitle: "Product Designer", slotInfo: "Slot 1 of 1", department: "Design", location: "Bangalore (On-site)", joiningDate: "Apr 7, 2026", daysUntilJoining: 12, handoffDate: "Mar 20", handoffBy: "Kavitha Menon", offerDetails: "₹24L LPA · Notice: 2 weeks remaining", tasks: [{ text: "Offer letter signed", status: "done" }, { text: "Background verification", status: "in_progress" }, { text: "Portfolio review archived", status: "done" }, { text: "Equipment request", status: "pending" }, { text: "Design tool licenses", status: "pending" }, { text: "Buddy assignment", status: "pending" }], preboardingProgress: 33 },
  { id: "hrq3", requisitionId: "REQ-2026-001", candidateName: "Ankit Sharma", candidateInitials: "AS", jobTitle: "Senior Frontend Engineer", slotInfo: "Slot 1 of 2 (Pune)", department: "Engineering", location: "Pune (Onsite)", joiningDate: "Apr 21, 2026", daysUntilJoining: 26, handoffDate: "Mar 25", handoffBy: "Sarah Kim", offerDetails: "₹42L LPA · Notice: 30 days", tasks: [{ text: "Offer letter signed", status: "done" }, { text: "Background verification", status: "pending" }, { text: "Relocation assistance", status: "pending" }, { text: "Equipment request", status: "pending" }, { text: "Email & Slack provisioning", status: "pending" }], preboardingProgress: 20 },
];

/* ── Headcount Planning ── */

export interface DeptHeadcount {
  dept: string;
  colorClass: string;
  authorized: number;
  current: number;
  openPositions: number;
  inPipeline: number;
}

export const DEPT_HEADCOUNTS: DeptHeadcount[] = [
  { dept: "Engineering", colorClass: "bg-brand", authorized: 36, current: 28, openPositions: 8, inPipeline: 22 },
  { dept: "Design", colorClass: "bg-brand-purple", authorized: 12, current: 9, openPositions: 2, inPipeline: 4 },
  { dept: "Product", colorClass: "bg-info", authorized: 8, current: 6, openPositions: 1, inPipeline: 0 },
  { dept: "Marketing", colorClass: "bg-warning", authorized: 10, current: 8, openPositions: 2, inPipeline: 5 },
  { dept: "Sales", colorClass: "bg-success", authorized: 15, current: 12, openPositions: 5, inPipeline: 0 },
  { dept: "HR & People", colorClass: "bg-brand-teal", authorized: 6, current: 5, openPositions: 1, inPipeline: 0 },
];

/* ── Analytics ── */

export const REQ_ANALYTICS_KPIS = [
  { label: "Avg Time to Approval", value: "4.2 days", trend: "-1.5d vs Q3", positive: true },
  { label: "Avg Time to First Map", value: "8 days", trend: "-3d vs Q3", positive: true },
  { label: "Positions Open", value: "15", trend: "Across 6 reqs", positive: false },
  { label: "Candidate Coverage", value: "5.2x", trend: "Per slot avg", positive: true },
  { label: "SLA Compliance", value: "72%", trend: "-8% vs target", positive: false },
];

/* ── Counts ── */

export const REQ_COUNTS = {
  total: REQUISITIONS.length,
  totalPositions: REQUISITIONS.reduce((s, r) => s + r.totalPositions, 0),
  openPositions: REQUISITIONS.reduce((s, r) => s + (r.totalPositions - r.filledPositions), 0),
  pending: REQUISITIONS.filter((r) => r.status === "pending_approval").length,
  taQueue: REQUISITIONS.filter((r) => ["sourcing", "interviewing", "offer_stage", "partially_filled"].includes(r.status)).length,
  hrQueue: HR_QUEUE.length,
};

/* ── Helpers ── */

export function urgencyColor(score: number): string {
  if (score > 80) return "text-destructive";
  if (score > 60) return "text-warning";
  if (score > 40) return "text-brand";
  return "text-muted-foreground";
}

export function healthColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-brand";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

export function healthBarColor(score: number | null): string {
  if (score === null) return "bg-secondary";
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-brand";
  if (score >= 40) return "bg-warning";
  return "bg-destructive";
}

export function urgencyBadge(score: number): { label: string; colorClass: string; bgClass: string } {
  if (score > 80) return { label: "NEEDS ACTION", colorClass: "text-destructive", bgClass: "bg-destructive/10" };
  if (score > 60) return { label: "ATTENTION", colorClass: "text-warning", bgClass: "bg-warning/10" };
  return { label: "ON TRACK", colorClass: "text-success", bgClass: "bg-success/10" };
}
