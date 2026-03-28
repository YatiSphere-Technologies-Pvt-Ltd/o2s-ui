/* ================================================================
   O2S Talent — Shared Types, Mock Data & Helpers
   Single source of truth for all talent views
   ================================================================ */

/* ── Types ── */

export interface Candidate {
  id: string;
  name: string;
  initials: string;
  role: string;
  location: string;
  source: string;
  stage: string;
  aiScore: number | null;
  daysInStage: number;
  tags: string[];
  aiSourced: boolean;
}

export interface Stage {
  id: string;
  name: string;
  colorClass: string;      // Tailwind token class for dot/badge bg
  textColorClass: string;   // Tailwind token class for text
  borderClass: string;      // For column dividers, drag highlights
}

/* ── Stage Definitions ── */

export const STAGES: Stage[] = [
  { id: "applied",   name: "Applied",      colorClass: "bg-info",         textColorClass: "text-info",         borderClass: "border-info" },
  { id: "screened",  name: "Screened",      colorClass: "bg-brand",        textColorClass: "text-brand",        borderClass: "border-brand" },
  { id: "interview", name: "Interview",     colorClass: "bg-brand-purple", textColorClass: "text-brand-purple", borderClass: "border-brand-purple" },
  { id: "final",     name: "Final Round",   colorClass: "bg-brand-teal",   textColorClass: "text-brand-teal",   borderClass: "border-brand-teal" },
  { id: "offer",     name: "Offer",         colorClass: "bg-warning",      textColorClass: "text-warning",      borderClass: "border-warning" },
  { id: "hired",     name: "Hired",         colorClass: "bg-success",      textColorClass: "text-success",      borderClass: "border-success" },
];

export const STAGE_MAP: Record<string, Stage> = Object.fromEntries(
  STAGES.map((s) => [s.id, s])
);

export const STAGE_ORDER = STAGES.map((s) => s.id);

/* ── Mock Candidates ── */

export const CANDIDATES: Candidate[] = [
  // Applied
  { id: "c1",  name: "Sarah Lopez",     initials: "SL", role: "Senior Frontend Engineer", location: "Mumbai",         source: "LinkedIn",     stage: "applied",   aiScore: null, daysInStage: 1, tags: [],                          aiSourced: false },
  { id: "c2",  name: "Raj Patel",       initials: "RP", role: "Senior Frontend Engineer", location: "Pune",           source: "Direct Apply", stage: "applied",   aiScore: null, daysInStage: 1, tags: [],                          aiSourced: false },
  { id: "c3",  name: "Emma Watson",     initials: "EW", role: "Senior Frontend Engineer", location: "London",         source: "LinkedIn",     stage: "applied",   aiScore: null, daysInStage: 2, tags: [],                          aiSourced: false },
  { id: "c4",  name: "Arjun Mehta",     initials: "AM", role: "Senior Frontend Engineer", location: "Delhi",          source: "Referral",     stage: "applied",   aiScore: null, daysInStage: 3, tags: ["Referred"],                 aiSourced: false },
  { id: "c5",  name: "Nina Tanaka",     initials: "NT", role: "Senior Frontend Engineer", location: "Tokyo",          source: "AI Sourced",   stage: "applied",   aiScore: null, daysInStage: 1, tags: ["AI Sourced"],               aiSourced: true },
  // Screened
  { id: "c6",  name: "David Kim",       initials: "DK", role: "Senior Frontend Engineer", location: "Seoul",          source: "Agency",       stage: "screened",  aiScore: 81,   daysInStage: 3, tags: ["AI Sourced"],               aiSourced: true },
  { id: "c7",  name: "Ananya Desai",    initials: "AD", role: "Senior Frontend Engineer", location: "Bangalore",      source: "Career Page",  stage: "screened",  aiScore: 74,   daysInStage: 5, tags: [],                          aiSourced: false },
  { id: "c8",  name: "Michael Torres",  initials: "MT", role: "Senior Frontend Engineer", location: "Austin",         source: "LinkedIn",     stage: "screened",  aiScore: 79,   daysInStage: 2, tags: ["Referred"],                 aiSourced: false },
  { id: "c9",  name: "Fatima Al-Hassan", initials: "FA", role: "Senior Frontend Engineer", location: "Dubai",          source: "LinkedIn",     stage: "screened",  aiScore: 71,   daysInStage: 7, tags: [],                          aiSourced: false },
  // Interview
  { id: "c10", name: "Priya Sharma",    initials: "PS", role: "Senior Frontend Engineer", location: "Bangalore",      source: "LinkedIn",     stage: "interview", aiScore: 92,   daysInStage: 5, tags: ["Strong Hire", "Referred"],  aiSourced: false },
  { id: "c11", name: "Alex Rivera",     initials: "AR", role: "Senior Frontend Engineer", location: "San Francisco",  source: "Referral",     stage: "interview", aiScore: 88,   daysInStage: 3, tags: ["Strong Hire", "Fast Track"], aiSourced: false },
  { id: "c12", name: "Yuki Tanaka",     initials: "YT", role: "Senior Frontend Engineer", location: "Tokyo",          source: "AI Sourced",   stage: "interview", aiScore: 84,   daysInStage: 4, tags: ["AI Sourced"],               aiSourced: true },
  // Final Round
  { id: "c13", name: "Lisa Park",       initials: "LP", role: "Senior Frontend Engineer", location: "Singapore",      source: "Direct Apply", stage: "final",     aiScore: 85,   daysInStage: 2, tags: ["Strong Hire"],              aiSourced: false },
  { id: "c14", name: "James O'Brien",   initials: "JO", role: "Senior Frontend Engineer", location: "Dublin",         source: "LinkedIn",     stage: "final",     aiScore: 83,   daysInStage: 4, tags: [],                          aiSourced: false },
  // Offer
  { id: "c15", name: "Marcus Johnson",  initials: "MJ", role: "Senior Frontend Engineer", location: "Bangalore",      source: "Referral",     stage: "offer",     aiScore: 90,   daysInStage: 3, tags: ["Strong Hire", "Fast Track"], aiSourced: false },
  // Hired
  { id: "c16", name: "Aisha Patel",     initials: "AP", role: "Senior Frontend Engineer", location: "Bangalore",      source: "LinkedIn",     stage: "hired",     aiScore: 91,   daysInStage: 1, tags: ["Strong Hire"],              aiSourced: false },
];

/* ── All unique filter values ── */

export const ALL_SOURCES = [...new Set(CANDIDATES.map((c) => c.source))];
export const ALL_TAGS = [...new Set(CANDIDATES.flatMap((c) => c.tags))].filter(Boolean);

/* ── Helpers (shared across views) ── */

const AVATAR_PALETTE = [
  "bg-info",          // indigo-ish
  "bg-brand",         // blue
  "bg-brand-purple",  // purple
  "bg-brand-teal",    // teal
  "bg-warning",       // amber
  "bg-success",       // green
  "bg-destructive",   // red
  "bg-[#EC4899]",     // pink
];

export function avatarColorClass(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

export function scoreClasses(score: number | null): string {
  if (score === null) return "bg-secondary text-muted-foreground";
  if (score >= 90) return "bg-success/15 text-success";
  if (score >= 75) return "bg-brand-teal/15 text-brand-teal";
  if (score >= 60) return "bg-brand/15 text-brand";
  if (score >= 40) return "bg-warning/15 text-warning";
  return "bg-destructive/15 text-destructive";
}

export function scoreTextClass(score: number | null): string {
  if (score === null) return "text-muted-foreground";
  if (score >= 90) return "text-success";
  if (score >= 75) return "text-brand-teal";
  if (score >= 60) return "text-brand";
  if (score >= 40) return "text-warning";
  return "text-destructive";
}

export function scoreBarClass(score: number): string {
  if (score >= 90) return "bg-success";
  if (score >= 75) return "bg-brand-teal";
  if (score >= 60) return "bg-brand";
  if (score >= 40) return "bg-warning";
  return "bg-destructive";
}

export function tagClasses(tag: string): string {
  switch (tag) {
    case "Strong Hire": return "bg-success/10 text-success";
    case "Fast Track":  return "bg-brand/10 text-brand";
    case "Referred":    return "bg-brand-purple/10 text-brand-purple";
    case "AI Sourced":  return "bg-brand-purple/10 text-brand-purple";
    default:            return "bg-secondary text-muted-foreground";
  }
}

export function daysColor(days: number): string {
  if (days > 10) return "text-destructive";
  if (days > 5)  return "text-warning";
  return "text-muted-foreground";
}

export function nextStageLabel(current: string): string {
  const idx = STAGE_ORDER.indexOf(current);
  if (idx === -1 || idx >= STAGE_ORDER.length - 1) return "Mark as Hired";
  const next = STAGES[idx + 1];
  if (next.id === "hired") return "Mark as Hired";
  return `Advance to ${next.name}`;
}

/* ── Filter candidates ── */

export interface CandidateFilters {
  search: string;
  stages: string[];
  sources: string[];
  tags: string[];
}

export function filterCandidates(
  candidates: Candidate[],
  filters: CandidateFilters
): Candidate[] {
  return candidates.filter((c) => {
    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q) ||
        c.source.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q));
      if (!match) return false;
    }
    // Stage filter
    if (filters.stages.length > 0 && !filters.stages.includes(c.stage)) return false;
    // Source filter
    if (filters.sources.length > 0 && !filters.sources.includes(c.source)) return false;
    // Tag filter
    if (filters.tags.length > 0 && !filters.tags.some((t) => c.tags.includes(t))) return false;
    return true;
  });
}
