/* ================================================================
   O2S Jobs — Shared Types, Mock Data & Helpers
   Single source of truth for the Jobs module
   ================================================================ */

/* ── Types ── */

export interface Job {
  id: string;
  reqId: string;
  title: string;
  department: string;
  team: string;
  level: string;
  location: string;
  workModel: "Hybrid" | "Remote" | "On-site";
  employmentType: "Full-time" | "Part-time" | "Contract";
  status: "active" | "draft" | "paused" | "closed" | "internal";
  priority: "urgent" | "high" | "medium" | "low";
  hiringManager: { name: string; id: string };
  recruiter: { name: string; id: string };
  compensation: { min: number; max: number; currency: string; equity: boolean };
  posted: string | null;
  created: string;
  targetFillDate: string;
  daysOpen: number | null;
  estimatedTimeToFill: number;
  pipeline: { applied: number; screened: number; interview: number; final: number; offer: number; hired: number };
  totalCandidates: number;
  healthScore: number | null;
  distribution: string[];
  aiSummary: string;
}

/* ── Status Config ── */

export const STATUS_CONFIG: Record<string, { label: string; abbr: string; dotClass: string; textClass: string }> = {
  active:   { label: "Active",   abbr: "Act", dotClass: "bg-success",      textClass: "text-success" },
  draft:    { label: "Draft",    abbr: "Drf", dotClass: "bg-muted-foreground", textClass: "text-muted-foreground" },
  paused:   { label: "Paused",   abbr: "Pau", dotClass: "bg-warning",      textClass: "text-warning" },
  closed:   { label: "Closed",   abbr: "Cls", dotClass: "bg-destructive",  textClass: "text-destructive" },
  internal: { label: "Internal", abbr: "Int", dotClass: "bg-brand-purple", textClass: "text-brand-purple" },
};

export const PRIORITY_CONFIG: Record<string, { label: string; dotClass: string; textClass: string; bgClass: string }> = {
  urgent: { label: "Urgent", dotClass: "bg-destructive",      textClass: "text-destructive",      bgClass: "bg-destructive/10" },
  high:   { label: "High",   dotClass: "bg-warning",          textClass: "text-warning",          bgClass: "bg-warning/10" },
  medium: { label: "Medium", dotClass: "bg-brand",            textClass: "text-brand",            bgClass: "bg-brand/10" },
  low:    { label: "Low",    dotClass: "bg-muted-foreground", textClass: "text-muted-foreground", bgClass: "bg-secondary" },
};

export const DEPT_COLORS: Record<string, { colorClass: string; textClass: string }> = {
  Engineering: { colorClass: "bg-brand",        textClass: "text-brand" },
  Design:      { colorClass: "bg-brand-purple", textClass: "text-brand-purple" },
  Product:     { colorClass: "bg-info",         textClass: "text-info" },
  Marketing:   { colorClass: "bg-warning",      textClass: "text-warning" },
  Sales:       { colorClass: "bg-success",      textClass: "text-success" },
  "HR & People": { colorClass: "bg-brand-teal", textClass: "text-brand-teal" },
  Finance:     { colorClass: "bg-destructive",  textClass: "text-destructive" },
  Operations:  { colorClass: "bg-muted-foreground", textClass: "text-muted-foreground" },
};

/* ── Mock Jobs ── */

export const JOBS: Job[] = [
  {
    id: "j1", reqId: "REQ-024", title: "Senior Frontend Engineer",
    department: "Engineering", team: "Frontend Platform", level: "IC4",
    location: "Bangalore HQ", workModel: "Hybrid", employmentType: "Full-time",
    status: "active", priority: "urgent",
    hiringManager: { name: "Rajesh Kumar", id: "e20" },
    recruiter: { name: "Sarah Kim", id: "e8" },
    compensation: { min: 2800000, max: 4000000, currency: "INR", equity: true },
    posted: "2026-03-07", created: "2026-02-20", targetFillDate: "2026-04-30",
    daysOpen: 18, estimatedTimeToFill: 32,
    pipeline: { applied: 47, screened: 23, interview: 18, final: 8, offer: 4, hired: 3 },
    totalCandidates: 47, healthScore: 78,
    distribution: ["Career Page", "LinkedIn", "Indeed", "Naukri"],
    aiSummary: "Pipeline healthy. 3 strong candidates in final round.",
  },
  {
    id: "j2", reqId: "REQ-019", title: "Backend Engineer",
    department: "Engineering", team: "Core Platform", level: "IC3",
    location: "Remote - India", workModel: "Remote", employmentType: "Full-time",
    status: "active", priority: "urgent",
    hiringManager: { name: "Rajesh Kumar", id: "e20" },
    recruiter: { name: "Sarah Kim", id: "e8" },
    compensation: { min: 2200000, max: 3500000, currency: "INR", equity: true },
    posted: "2026-03-01", created: "2026-02-15", targetFillDate: "2026-04-15",
    daysOpen: 24, estimatedTimeToFill: 38,
    pipeline: { applied: 38, screened: 18, interview: 12, final: 5, offer: 2, hired: 1 },
    totalCandidates: 38, healthScore: 65,
    distribution: ["Career Page", "LinkedIn", "Indeed"],
    aiSummary: "Screening bottleneck. 8 candidates waiting >5 days.",
  },
  {
    id: "j3", reqId: "REQ-031", title: "Product Designer",
    department: "Design", team: "Product Design", level: "IC3",
    location: "Bangalore HQ", workModel: "On-site", employmentType: "Full-time",
    status: "active", priority: "high",
    hiringManager: { name: "Lisa Park", id: "e22" },
    recruiter: { name: "Kavitha Menon", id: "e13" },
    compensation: { min: 1800000, max: 3000000, currency: "INR", equity: true },
    posted: "2026-03-13", created: "2026-03-01", targetFillDate: "2026-05-15",
    daysOpen: 12, estimatedTimeToFill: 35,
    pipeline: { applied: 29, screened: 14, interview: 8, final: 3, offer: 1, hired: 0 },
    totalCandidates: 29, healthScore: 82,
    distribution: ["Career Page", "LinkedIn"],
    aiSummary: "Strong pipeline. Consider adding design exercise round.",
  },
  {
    id: "j4", reqId: "REQ-012", title: "VP Engineering",
    department: "Engineering", team: "Leadership", level: "VP",
    location: "Bangalore HQ", workModel: "Hybrid", employmentType: "Full-time",
    status: "active", priority: "urgent",
    hiringManager: { name: "Prashant Singh", id: "e0" },
    recruiter: { name: "Sarah Kim", id: "e8" },
    compensation: { min: 6000000, max: 9000000, currency: "INR", equity: true },
    posted: "2026-02-08", created: "2026-01-15", targetFillDate: "2026-04-30",
    daysOpen: 45, estimatedTimeToFill: 60,
    pipeline: { applied: 8, screened: 5, interview: 3, final: 1, offer: 0, hired: 0 },
    totalCandidates: 8, healthScore: 28,
    distribution: ["LinkedIn", "Agency"],
    aiSummary: "Critical: No qualified candidates advancing. Expand sourcing.",
  },
  {
    id: "j5", reqId: "REQ-035", title: "Staff ML Engineer",
    department: "Engineering", team: "AI/ML", level: "IC5",
    location: "Remote - India", workModel: "Remote", employmentType: "Full-time",
    status: "draft", priority: "medium",
    hiringManager: { name: "Prashant Singh", id: "e0" },
    recruiter: { name: "Sarah Kim", id: "e8" },
    compensation: { min: 4000000, max: 6000000, currency: "INR", equity: true },
    posted: null, created: "2026-03-18", targetFillDate: "2026-06-30",
    daysOpen: null, estimatedTimeToFill: 45,
    pipeline: { applied: 0, screened: 0, interview: 0, final: 0, offer: 0, hired: 0 },
    totalCandidates: 0, healthScore: null,
    distribution: [],
    aiSummary: "Draft — complete description to post.",
  },
  {
    id: "j6", reqId: "REQ-028", title: "Growth Marketing Manager",
    department: "Marketing", team: "Growth", level: "IC4",
    location: "Mumbai", workModel: "Hybrid", employmentType: "Full-time",
    status: "paused", priority: "medium",
    hiringManager: { name: "Prashant Singh", id: "e0" },
    recruiter: { name: "Kavitha Menon", id: "e13" },
    compensation: { min: 2000000, max: 3200000, currency: "INR", equity: false },
    posted: "2026-02-22", created: "2026-02-10", targetFillDate: "2026-04-30",
    daysOpen: 31, estimatedTimeToFill: 40,
    pipeline: { applied: 14, screened: 8, interview: 4, final: 1, offer: 0, hired: 0 },
    totalCandidates: 14, healthScore: 52,
    distribution: ["Career Page", "LinkedIn", "Naukri"],
    aiSummary: "Paused — budget reallocation pending Q2 review.",
  },
  {
    id: "j7", reqId: "REQ-015", title: "DevOps Engineer",
    department: "Engineering", team: "Infrastructure", level: "IC3",
    location: "Mumbai", workModel: "Hybrid", employmentType: "Full-time",
    status: "active", priority: "high",
    hiringManager: { name: "Rajesh Kumar", id: "e20" },
    recruiter: { name: "Sarah Kim", id: "e8" },
    compensation: { min: 2000000, max: 3200000, currency: "INR", equity: true },
    posted: "2026-02-15", created: "2026-02-01", targetFillDate: "2026-04-15",
    daysOpen: 38, estimatedTimeToFill: 35,
    pipeline: { applied: 22, screened: 12, interview: 6, final: 2, offer: 1, hired: 0 },
    totalCandidates: 22, healthScore: 58,
    distribution: ["Career Page", "LinkedIn", "Indeed"],
    aiSummary: "Offer pending for 1 candidate. Interview velocity slowing.",
  },
  {
    id: "j8", reqId: "REQ-033", title: "UX Researcher",
    department: "Design", team: "Research", level: "IC3",
    location: "Bangalore HQ", workModel: "Hybrid", employmentType: "Full-time",
    status: "active", priority: "medium",
    hiringManager: { name: "Lisa Park", id: "e22" },
    recruiter: { name: "Kavitha Menon", id: "e13" },
    compensation: { min: 1600000, max: 2800000, currency: "INR", equity: true },
    posted: "2026-03-10", created: "2026-03-01", targetFillDate: "2026-05-31",
    daysOpen: 15, estimatedTimeToFill: 30,
    pipeline: { applied: 18, screened: 9, interview: 4, final: 1, offer: 0, hired: 0 },
    totalCandidates: 18, healthScore: 71,
    distribution: ["Career Page", "LinkedIn"],
    aiSummary: "Pipeline on track. 2 strong candidates advancing.",
  },
  {
    id: "j9", reqId: "REQ-022", title: "Account Executive",
    department: "Sales", team: "Enterprise", level: "IC3",
    location: "Bangalore HQ", workModel: "On-site", employmentType: "Full-time",
    status: "active", priority: "high",
    hiringManager: { name: "Amit Verma", id: "e10" },
    recruiter: { name: "Kavitha Menon", id: "e13" },
    compensation: { min: 1800000, max: 3000000, currency: "INR", equity: false },
    posted: "2026-03-01", created: "2026-02-20", targetFillDate: "2026-04-30",
    daysOpen: 24, estimatedTimeToFill: 28,
    pipeline: { applied: 31, screened: 16, interview: 9, final: 4, offer: 2, hired: 1 },
    totalCandidates: 31, healthScore: 84,
    distribution: ["Career Page", "LinkedIn", "Naukri"],
    aiSummary: "Excellent pipeline. 2 offers pending acceptance.",
  },
  {
    id: "j10", reqId: "REQ-018", title: "Data Analyst",
    department: "Product", team: "Analytics", level: "IC2",
    location: "Remote - India", workModel: "Remote", employmentType: "Full-time",
    status: "closed", priority: "medium",
    hiringManager: { name: "Neha Gupta", id: "e12" },
    recruiter: { name: "Sarah Kim", id: "e8" },
    compensation: { min: 1200000, max: 2000000, currency: "INR", equity: true },
    posted: "2026-01-15", created: "2026-01-05", targetFillDate: "2026-03-15",
    daysOpen: 42, estimatedTimeToFill: 30,
    pipeline: { applied: 56, screened: 28, interview: 14, final: 6, offer: 2, hired: 1 },
    totalCandidates: 56, healthScore: 95,
    distribution: ["Career Page", "LinkedIn", "Indeed", "Naukri"],
    aiSummary: "Filled. Candidate onboarding scheduled for Apr 1.",
  },
  {
    id: "j11", reqId: "REQ-037", title: "Security Engineer",
    department: "Engineering", team: "Security", level: "IC3",
    location: "Bangalore HQ", workModel: "Hybrid", employmentType: "Full-time",
    status: "internal", priority: "medium",
    hiringManager: { name: "Rajesh Kumar", id: "e20" },
    recruiter: { name: "Sarah Kim", id: "e8" },
    compensation: { min: 2400000, max: 3800000, currency: "INR", equity: true },
    posted: "2026-03-20", created: "2026-03-15", targetFillDate: "2026-05-30",
    daysOpen: 5, estimatedTimeToFill: 40,
    pipeline: { applied: 4, screened: 2, interview: 0, final: 0, offer: 0, hired: 0 },
    totalCandidates: 4, healthScore: 60,
    distribution: ["Internal Portal"],
    aiSummary: "Internal posting. 2 employees have expressed interest.",
  },
  {
    id: "j12", reqId: "REQ-036", title: "Brand Designer",
    department: "Design", team: "Brand", level: "IC2",
    location: "Bangalore HQ", workModel: "On-site", employmentType: "Full-time",
    status: "draft", priority: "low",
    hiringManager: { name: "Lisa Park", id: "e22" },
    recruiter: { name: "Kavitha Menon", id: "e13" },
    compensation: { min: 1200000, max: 2200000, currency: "INR", equity: false },
    posted: null, created: "2026-03-22", targetFillDate: "2026-06-30",
    daysOpen: null, estimatedTimeToFill: 25,
    pipeline: { applied: 0, screened: 0, interview: 0, final: 0, offer: 0, hired: 0 },
    totalCandidates: 0, healthScore: null,
    distribution: [],
    aiSummary: "Draft — awaiting JD review from Lisa Park.",
  },
];

/* ── Derived Values ── */

export const ALL_DEPARTMENTS = [...new Set(JOBS.map((j) => j.department))];
export const ALL_LOCATIONS = [...new Set(JOBS.map((j) => j.location))];
export const ALL_STATUSES = ["active", "draft", "paused", "closed", "internal"] as const;
export const ALL_PRIORITIES = ["urgent", "high", "medium", "low"] as const;
export const ALL_HIRING_MANAGERS = [...new Set(JOBS.map((j) => j.hiringManager.name))];

export const JOB_COUNTS = {
  active: JOBS.filter((j) => j.status === "active").length,
  draft: JOBS.filter((j) => j.status === "draft").length,
  paused: JOBS.filter((j) => j.status === "paused").length,
  closed: JOBS.filter((j) => j.status === "closed").length,
};

/* ── Pipeline Stage Config ── */

export const PIPELINE_STAGES = [
  { key: "applied",   label: "Applied",     colorClass: "bg-info" },
  { key: "screened",  label: "Screened",     colorClass: "bg-brand" },
  { key: "interview", label: "Interview",    colorClass: "bg-brand-purple" },
  { key: "final",     label: "Final",        colorClass: "bg-brand-teal" },
  { key: "offer",     label: "Offer",        colorClass: "bg-warning" },
  { key: "hired",     label: "Hired",        colorClass: "bg-success" },
] as const;

/* ── Helpers ── */

export function healthColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-brand-teal";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

export function healthBarColor(score: number | null): string {
  if (score === null) return "bg-secondary";
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-brand-teal";
  if (score >= 40) return "bg-warning";
  return "bg-destructive";
}

export function healthLabel(score: number | null): string {
  if (score === null) return "—";
  if (score >= 80) return "Excellent";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs Attention";
  return "Critical";
}

export function daysOpenColor(days: number | null): string {
  if (days === null) return "text-muted-foreground";
  if (days > 45) return "text-destructive";
  if (days > 30) return "text-warning";
  return "text-muted-foreground";
}

export function formatComp(value: number): string {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)}Cr`;
  if (value >= 100000) return `${(value / 100000).toFixed(0)}L`;
  return `${(value / 1000).toFixed(0)}K`;
}

const AVATAR_PALETTE = [
  "bg-brand", "bg-brand-purple", "bg-brand-teal", "bg-success",
  "bg-warning", "bg-destructive", "bg-info", "bg-[#EC4899]",
];

export function avatarColorClass(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

/* ── Filters ── */

export interface JobFilters {
  search: string;
  departments: string[];
  statuses: string[];
  priorities: string[];
  locations: string[];
  hiringManagers: string[];
}

export const EMPTY_FILTERS: JobFilters = {
  search: "",
  departments: [],
  statuses: [],
  priorities: [],
  locations: [],
  hiringManagers: [],
};

export function filterJobs(jobs: Job[], filters: JobFilters): Job[] {
  return jobs.filter((j) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        j.title.toLowerCase().includes(q) ||
        j.reqId.toLowerCase().includes(q) ||
        j.department.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.hiringManager.name.toLowerCase().includes(q) ||
        j.team.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.departments.length > 0 && !filters.departments.includes(j.department)) return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(j.status)) return false;
    if (filters.priorities.length > 0 && !filters.priorities.includes(j.priority)) return false;
    if (filters.locations.length > 0 && !filters.locations.includes(j.location)) return false;
    if (filters.hiringManagers.length > 0 && !filters.hiringManagers.includes(j.hiringManager.name)) return false;
    return true;
  });
}

export function sortJobs(jobs: Job[], sortBy: string): Job[] {
  const sorted = [...jobs];
  switch (sortBy) {
    case "newest":     sorted.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()); break;
    case "oldest":     sorted.sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime()); break;
    case "most-cand":  sorted.sort((a, b) => b.totalCandidates - a.totalCandidates); break;
    case "least-cand": sorted.sort((a, b) => a.totalCandidates - b.totalCandidates); break;
    case "days-open":  sorted.sort((a, b) => (b.daysOpen ?? 0) - (a.daysOpen ?? 0)); break;
    case "health":     sorted.sort((a, b) => (b.healthScore ?? 0) - (a.healthScore ?? 0)); break;
    case "priority": {
      const order = { urgent: 0, high: 1, medium: 2, low: 3 };
      sorted.sort((a, b) => order[a.priority] - order[b.priority]);
      break;
    }
    default: sorted.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());
  }
  return sorted;
}

/* ── Analytics Data ── */

export const SOURCING_CHANNELS = [
  { channel: "LinkedIn",     volume: 89, qualityPct: 34 },
  { channel: "Referrals",    volume: 42, qualityPct: 71 },
  { channel: "Direct Apply", volume: 67, qualityPct: 28 },
  { channel: "Career Page",  volume: 54, qualityPct: 31 },
  { channel: "AI Sourced",   volume: 38, qualityPct: 52 },
  { channel: "Agency",       volume: 22, qualityPct: 45 },
];

export const HIRING_VELOCITY = [
  { month: "Oct", offers: 6, hires: 5, target: 7 },
  { month: "Nov", offers: 8, hires: 7, target: 7 },
  { month: "Dec", offers: 5, hires: 4, target: 6 },
  { month: "Jan", offers: 7, hires: 6, target: 8 },
  { month: "Feb", offers: 9, hires: 8, target: 8 },
  { month: "Mar", offers: 6, hires: 4, target: 8 },
];
