/* ================================================================
   O2S Talent Pool — Types & Mock Data
   ================================================================ */

export type PoolTab = "all" | "pools" | "nurture" | "aiSourcing" | "analytics";

export const POOL_TABS: { key: PoolTab; label: string }[] = [
  { key: "all", label: "All Talent" },
  { key: "pools", label: "Pools" },
  { key: "nurture", label: "Nurture Campaigns" },
  { key: "aiSourcing", label: "AI Sourcing" },
  { key: "analytics", label: "Analytics" },
];

/* ── Source Config ── */

export const SOURCE_CONFIG: Record<string, { label: string; dotClass: string }> = {
  ai_sourced: { label: "AI Sourced", dotClass: "bg-brand-purple" },
  linkedin:   { label: "LinkedIn", dotClass: "bg-brand" },
  referral:   { label: "Referral", dotClass: "bg-success" },
  career_page:{ label: "Career Page", dotClass: "bg-info" },
  event:      { label: "Event", dotClass: "bg-warning" },
  agency:     { label: "Agency", dotClass: "bg-brand-teal" },
  past_app:   { label: "Past Applicant", dotClass: "bg-info" },
};

export const ENGAGEMENT_CONFIG: Record<string, { label: string; colorClass: string; bgClass: string }> = {
  hot:    { label: "Hot", colorClass: "text-success", bgClass: "bg-success/10" },
  warm:   { label: "Warm", colorClass: "text-warning", bgClass: "bg-warning/10" },
  cold:   { label: "Cold", colorClass: "text-brand", bgClass: "bg-brand/10" },
  unresp: { label: "Unresponsive", colorClass: "text-muted-foreground", bgClass: "bg-secondary" },
};

export const STAGE_CONFIG: Record<string, { label: string; dotClass: string }> = {
  new:           { label: "New", dotClass: "bg-info" },
  contacted:     { label: "Contacted", dotClass: "bg-brand" },
  interested:    { label: "Interested", dotClass: "bg-brand-purple" },
  not_now:       { label: "Not Now", dotClass: "bg-warning" },
  not_interested:{ label: "Not Interested", dotClass: "bg-destructive" },
  converted:     { label: "Converted", dotClass: "bg-success" },
};

/* ── Talent Pool Candidates ── */

export interface PoolCandidate {
  id: string;
  name: string;
  initials: string;
  role: string;
  company: string;
  location: string;
  source: string;
  engagement: string;
  stage: string;
  aiMatch: number | null;
  lastContacted: string;
  skills: string[];
  pools: string[];
  addedDate: string;
}

export const POOL_CANDIDATES: PoolCandidate[] = [
  { id: "pc1", name: "Priya Sharma", initials: "PS", role: "Sr. Frontend Engineer", company: "Google", location: "San Francisco", source: "ai_sourced", engagement: "hot", stage: "interested", aiMatch: 92, lastContacted: "2d ago", skills: ["React", "TypeScript", "Node.js", "AWS"], pools: ["Senior Engineers"], addedDate: "Mar 15" },
  { id: "pc2", name: "Marcus Chen", initials: "MC", role: "Backend Engineer", company: "Stripe", location: "SF Bay Area", source: "linkedin", engagement: "warm", stage: "contacted", aiMatch: 87, lastContacted: "1w ago", skills: ["Python", "Go", "Kubernetes"], pools: ["Senior Engineers"], addedDate: "Mar 10" },
  { id: "pc3", name: "Lisa Park", initials: "LP", role: "Product Designer", company: "Airbnb", location: "New York", source: "referral", engagement: "hot", stage: "new", aiMatch: null, lastContacted: "3d ago", skills: ["Figma", "UX Research", "Design Systems"], pools: ["Design Talent"], addedDate: "Mar 20" },
  { id: "pc4", name: "David Kim", initials: "DK", role: "VP Engineering", company: "Notion", location: "San Francisco", source: "ai_sourced", engagement: "cold", stage: "converted", aiMatch: 78, lastContacted: "3w ago", skills: ["Leadership", "System Architecture", "Scaling"], pools: ["Executive Pipeline"], addedDate: "Feb 15" },
  { id: "pc5", name: "Sarah Lopez", initials: "SL", role: "Senior Designer", company: "Meta", location: "Remote", source: "career_page", engagement: "unresp", stage: "not_interested", aiMatch: null, lastContacted: "2mo ago", skills: ["Visual Design", "Branding"], pools: ["Design Talent"], addedDate: "Jan 10" },
  { id: "pc6", name: "Aisha Khan", initials: "AK", role: "Sr. Full-Stack Engineer", company: "Google", location: "Bangalore", source: "ai_sourced", engagement: "hot", stage: "interested", aiMatch: 94, lastContacted: "1d ago", skills: ["React", "TypeScript", "Node.js", "AWS"], pools: ["Senior Engineers"], addedDate: "Mar 22" },
  { id: "pc7", name: "Raj Patel", initials: "RP", role: "Backend Engineer", company: "Amazon", location: "Seattle", source: "linkedin", engagement: "warm", stage: "contacted", aiMatch: 89, lastContacted: "5d ago", skills: ["Java", "AWS", "Microservices"], pools: ["Senior Engineers"], addedDate: "Mar 8" },
  { id: "pc8", name: "Elena Garcia", initials: "EG", role: "DevOps Engineer", company: "Uber", location: "SF Bay Area", source: "event", engagement: "cold", stage: "not_now", aiMatch: 76, lastContacted: "2w ago", skills: ["Terraform", "Kubernetes", "CI/CD"], pools: [], addedDate: "Mar 5" },
  { id: "pc9", name: "Tom Wilson", initials: "TW", role: "Product Manager", company: "Shopify", location: "Remote", source: "referral", engagement: "warm", stage: "interested", aiMatch: 82, lastContacted: "4d ago", skills: ["Product Strategy", "Analytics", "Agile"], pools: ["Product Leaders"], addedDate: "Mar 18" },
  { id: "pc10", name: "Nina Kowalski", initials: "NK", role: "Marketing Director", company: "HubSpot", location: "Boston", source: "linkedin", engagement: "cold", stage: "contacted", aiMatch: 71, lastContacted: "3w ago", skills: ["Growth Marketing", "Content Strategy", "SEO"], pools: [], addedDate: "Feb 28" },
  { id: "pc11", name: "James O'Brien", initials: "JO", role: "Staff Engineer", company: "Netflix", location: "Remote", source: "ai_sourced", engagement: "hot", stage: "new", aiMatch: 91, lastContacted: "Never", skills: ["Go", "Distributed Systems", "gRPC"], pools: ["Senior Engineers"], addedDate: "Mar 24" },
  { id: "pc12", name: "Maria Santos", initials: "MS", role: "UX Researcher", company: "Spotify", location: "London", source: "past_app", engagement: "warm", stage: "contacted", aiMatch: 68, lastContacted: "1w ago", skills: ["User Research", "Surveys", "Data Analysis"], pools: ["Design Talent"], addedDate: "Mar 1" },
];

/* ── Pools ── */

export interface TalentPoolDef {
  id: string;
  name: string;
  type: "manual" | "smart";
  owner: string;
  candidateCount: number;
  activeRoles: number;
  lastUpdated: string;
  isPublic: boolean;
  smartRules?: string;
  contacted: number;
  responseRate: number;
  converted: number;
}

export const TALENT_POOLS: TalentPoolDef[] = [
  { id: "p1", name: "Senior Engineers", type: "smart", owner: "Prashant Singh", candidateCount: 12, activeRoles: 3, lastUpdated: "2 days ago", isPublic: true, smartRules: "React + 5+ years exp in SF Bay Area", contacted: 10, responseRate: 75, converted: 2 },
  { id: "p2", name: "Design Talent", type: "manual", owner: "Lisa Park", candidateCount: 8, activeRoles: 2, lastUpdated: "5 days ago", isPublic: true, contacted: 5, responseRate: 60, converted: 1 },
  { id: "p3", name: "Product Leaders", type: "smart", owner: "Neha Gupta", candidateCount: 6, activeRoles: 1, lastUpdated: "1 week ago", isPublic: false, smartRules: "PM with 8+ years, SaaS experience", contacted: 3, responseRate: 33, converted: 0 },
  { id: "p4", name: "Executive Pipeline", type: "manual", owner: "Prashant Singh", candidateCount: 4, activeRoles: 1, lastUpdated: "2 weeks ago", isPublic: false, contacted: 4, responseRate: 50, converted: 1 },
  { id: "p5", name: "Silver Medalists", type: "manual", owner: "Sarah Kim", candidateCount: 15, activeRoles: 0, lastUpdated: "3 days ago", isPublic: true, contacted: 12, responseRate: 58, converted: 3 },
  { id: "p6", name: "Referral Network", type: "smart", owner: "Kavitha Menon", candidateCount: 9, activeRoles: 2, lastUpdated: "1 day ago", isPublic: true, smartRules: "Employee referrals, any department", contacted: 7, responseRate: 71, converted: 2 },
];

/* ── Nurture Campaigns ── */

export interface NurtureCampaign {
  id: string;
  name: string;
  pool: string;
  status: "active" | "paused" | "draft" | "completed";
  sent: number;
  opened: number;
  openRate: number;
  replied: number;
  replyRate: number;
  lastSent: string;
}

export const NURTURE_CAMPAIGNS: NurtureCampaign[] = [
  { id: "nc1", name: "Fall 2026 Eng Push", pool: "Senior Engineers", status: "active", sent: 45, opened: 28, openRate: 62, replied: 8, replyRate: 18, lastSent: "Mar 22" },
  { id: "nc2", name: "Product Leaders Q2", pool: "Product Leaders", status: "paused", sent: 120, opened: 64, openRate: 53, replied: 12, replyRate: 10, lastSent: "Mar 15" },
  { id: "nc3", name: "Design Talent 2026", pool: "Design Talent", status: "draft", sent: 0, opened: 0, openRate: 0, replied: 0, replyRate: 0, lastSent: "—" },
  { id: "nc4", name: "Silver Medalists", pool: "Silver Medalists", status: "completed", sent: 87, opened: 52, openRate: 60, replied: 15, replyRate: 17, lastSent: "Mar 10" },
  { id: "nc5", name: "Referral Nurture", pool: "Referral Network", status: "active", sent: 25, opened: 18, openRate: 72, replied: 6, replyRate: 24, lastSent: "Mar 20" },
];

export const CAMPAIGN_STATUS_CONFIG: Record<string, { label: string; dotClass: string; textClass: string }> = {
  active:    { label: "Active", dotClass: "bg-success", textClass: "text-success" },
  paused:    { label: "Paused", dotClass: "bg-warning", textClass: "text-warning" },
  draft:     { label: "Draft", dotClass: "bg-muted-foreground", textClass: "text-muted-foreground" },
  completed: { label: "Completed", dotClass: "bg-brand-teal", textClass: "text-brand-teal" },
};

/* ── AI Sourced Candidates ── */

export interface AISourcingResult {
  id: string;
  name: string;
  initials: string;
  role: string;
  company: string;
  location: string;
  matchScore: number;
  topMatch: string;
  topMatchPct: number;
  matchReason: string;
  skills: string[];
  source: string;
  discovered: string;
}

export const AI_SOURCED: AISourcingResult[] = [
  { id: "as1", name: "Aisha Khan", initials: "AK", role: "Sr. Full-Stack Engineer", company: "Google", location: "Bangalore", matchScore: 94, topMatch: "Sr. Frontend", topMatchPct: 95, matchReason: "8 years full-stack exp, expert in React + TypeScript, led 3-person team, open to relocation", skills: ["React", "TypeScript", "Node.js", "AWS"], source: "LinkedIn", discovered: "1 day ago" },
  { id: "as2", name: "Raj Patel", initials: "RP", role: "Backend Engineer", company: "Amazon", location: "Seattle", matchScore: 89, topMatch: "Backend Eng", topMatchPct: 92, matchReason: "6 years Java/AWS, microservices at scale, SDE III at Amazon", skills: ["Java", "AWS", "Kubernetes", "DynamoDB"], source: "LinkedIn", discovered: "2 days ago" },
  { id: "as3", name: "Elena Garcia", initials: "EG", role: "DevOps Engineer", company: "Uber", location: "SF Bay Area", matchScore: 76, topMatch: "DevOps Eng", topMatchPct: 78, matchReason: "5 years Terraform/K8s, strong CI/CD background, contributed to CNCF projects", skills: ["Terraform", "Kubernetes", "CI/CD", "Go"], source: "GitHub", discovered: "3 days ago" },
];

/* ── Analytics ── */

export const POOL_ANALYTICS_KPIS = [
  { label: "Total Candidates", value: "45", trend: "+2 this week", positive: true },
  { label: "Active Pools", value: "6", trend: "1 stalled", positive: false },
  { label: "Nurture Campaigns", value: "3 active", trend: "62% avg open", positive: true },
  { label: "Sourced-to-Hire", value: "18%", trend: "Past 6 months", positive: true },
  { label: "Avg Time in Pool", value: "76 days", trend: "Median", positive: true },
  { label: "Converted This Week", value: "3", trend: "From talent pool", positive: true },
];

export const ENGAGEMENT_FUNNEL = [
  { stage: "In Pool", count: 45, pct: 100 },
  { stage: "Contacted", count: 28, pct: 62 },
  { stage: "Responsive", count: 18, pct: 40 },
  { stage: "In Interviews", count: 8, pct: 18 },
  { stage: "Offers Extended", count: 2, pct: 4 },
  { stage: "Hired", count: 1, pct: 2 },
];

export const SOURCE_BREAKDOWN = [
  { source: "AI Sourced", count: 12, pct: 27, avgMatch: 85 },
  { source: "LinkedIn", count: 14, pct: 31, avgMatch: 76 },
  { source: "Referral", count: 9, pct: 20, avgMatch: 88 },
  { source: "Past Applicant", count: 6, pct: 13, avgMatch: 65 },
  { source: "Career Page", count: 3, pct: 7, avgMatch: 58 },
  { source: "Event", count: 1, pct: 2, avgMatch: 70 },
];

/* ── Helpers ── */

export function matchColor(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 90) return "text-success";
  if (score >= 75) return "text-brand-teal";
  if (score >= 60) return "text-brand";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

export function matchBgColor(score: number | null): string {
  if (score === null) return "bg-secondary";
  if (score >= 90) return "bg-success/10";
  if (score >= 75) return "bg-brand-teal/10";
  if (score >= 60) return "bg-brand/10";
  if (score >= 40) return "bg-warning/10";
  return "bg-destructive/10";
}

export function matchLabel(score: number | null): string {
  if (score === null) return "—";
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 40) return "Average";
  return "Weak";
}

export const TOTAL_CANDIDATES = POOL_CANDIDATES.length;
export const TOTAL_POOLS = TALENT_POOLS.length;
export const ACTIVE_CAMPAIGNS = NURTURE_CAMPAIGNS.filter((c) => c.status === "active").length;
