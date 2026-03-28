/* ================================================================
   O2S Settings / Performance & Appraisals — Types & Mock Data
   ================================================================ */

export type PerfSettingsTab = "cycles" | "ratings" | "competencies" | "calibration" | "goals" | "privacy" | "automation" | "aiAgent";

export const PERF_SETTINGS_TABS: { key: PerfSettingsTab; label: string }[] = [
  { key: "cycles", label: "Cycle Templates" },
  { key: "ratings", label: "Rating Scales" },
  { key: "competencies", label: "Competency Framework" },
  { key: "calibration", label: "Calibration Rules" },
  { key: "goals", label: "Goal Framework" },
  { key: "privacy", label: "Anonymity & Privacy" },
  { key: "automation", label: "Automation" },
  { key: "aiAgent", label: "AI Performance Agent" },
];

/* ── Cycle Templates ── */

export interface CycleTemplate {
  id: string;
  name: string;
  isDefault: boolean;
  phaseCount: number;
  duration: string;
  scope: string;
  phases: string[];
  includes: string[];
  lastUsed: string;
}

export const CYCLE_TEMPLATES: CycleTemplate[] = [
  { id: "ct1", name: "Annual Performance Review", isDefault: true, phaseCount: 5, duration: "8-10 weeks", scope: "Full 360°", phases: ["Self-Review", "Peer Feedback", "Manager Review", "Calibration", "Delivery"], includes: ["Competency ratings", "Goal review", "Written narratives", "Development plan"], lastUsed: "H1 2026 (active)" },
  { id: "ct2", name: "Quarterly Check-in", isDefault: false, phaseCount: 3, duration: "3-4 weeks", scope: "Manager only", phases: ["Self-Review", "Manager Review", "Delivery"], includes: ["Goal progress", "Quick pulse ratings", "Development check"], lastUsed: "Q4 2025" },
  { id: "ct3", name: "Probation Review", isDefault: false, phaseCount: 2, duration: "1-2 weeks", scope: "Manager only", phases: ["Manager Assessment", "Delivery"], includes: ["Role-fit evaluation", "30/60/90-day milestone check"], lastUsed: "Mar 2026" },
  { id: "ct4", name: "Performance Improvement Plan (PIP)", isDefault: false, phaseCount: 3, duration: "4-8 weeks", scope: "HR + Manager", phases: ["Plan Creation", "Weekly Check-ins", "Final Assessment"], includes: ["Improvement goals", "Weekly progress", "Success criteria"], lastUsed: "Feb 2026" },
  { id: "ct5", name: "360° Feedback Pulse", isDefault: false, phaseCount: 2, duration: "2 weeks", scope: "Peers only", phases: ["Peer Nomination", "Peer Feedback"], includes: ["Lightweight peer feedback", "No rating — qualitative only"], lastUsed: "Q3 2025" },
];

/* ── Rating Scales ── */

export interface RatingScale {
  id: string;
  name: string;
  isDefault: boolean;
  usedIn: string[];
  levels: { value: number | string; label: string; description?: string; colorClass: string }[];
}

export const RATING_SCALES: RatingScale[] = [
  { id: "rs1", name: "5-Point Performance Scale", isDefault: true, usedIn: ["Annual Review", "Quarterly Check-in"],
    levels: [
      { value: 5, label: "Exceptional", description: "Consistently exceeds all expectations; role model", colorClass: "bg-success" },
      { value: 4, label: "Exceeds", description: "Frequently surpasses expectations in key areas", colorClass: "bg-brand" },
      { value: 3, label: "Meets", description: "Fully meets role expectations", colorClass: "bg-warning" },
      { value: 2, label: "Developing", description: "Partially meets; growth areas identified", colorClass: "bg-[#F97316]" },
      { value: 1, label: "Below", description: "Does not meet expectations; improvement plan required", colorClass: "bg-destructive" },
    ] },
  { id: "rs2", name: "4-Point Scale (No Middle)", isDefault: false, usedIn: ["Leadership Panel"],
    levels: [
      { value: 4, label: "Strong Yes", colorClass: "bg-success" },
      { value: 3, label: "Yes", colorClass: "bg-brand" },
      { value: 2, label: "Concerns", colorClass: "bg-warning" },
      { value: 1, label: "No", colorClass: "bg-destructive" },
    ] },
  { id: "rs3", name: "Thumbs Up / Down", isDefault: false, usedIn: ["360° Feedback Pulse"],
    levels: [
      { value: "👍", label: "Strength", colorClass: "bg-success" },
      { value: "👎", label: "Development Area", colorClass: "bg-warning" },
    ] },
];

/* ── Competency Framework ── */

export interface RoleFamily {
  id: string;
  name: string;
  levels: string[];
  competencies: string[];
  employeeCount: number;
}

export const ROLE_FAMILIES: RoleFamily[] = [
  { id: "rf1", name: "Engineering (IC Track)", levels: ["IC1", "IC2", "IC3", "IC4", "IC5", "IC6"], competencies: ["Technical Excellence", "Problem Solving", "Communication", "Leadership", "Collaboration", "Innovation"], employeeCount: 32 },
  { id: "rf2", name: "Engineering (Management)", levels: ["M1", "M2", "M3", "M4 (VP)", "M5 (SVP)"], competencies: ["People Leadership", "Technical Strategy", "Execution", "Communication", "Hiring & Talent", "Culture Building"], employeeCount: 8 },
  { id: "rf3", name: "Product", levels: ["PM1", "PM2", "PM3 (Sr)", "GPM", "VP Product"], competencies: ["User Empathy", "Analytical Rigor", "Prioritization", "Technical Fluency", "Strategic Thinking", "Communication"], employeeCount: 17 },
  { id: "rf4", name: "Sales", levels: ["SDR", "AE", "Sr AE", "Team Lead", "Director"], competencies: ["Discovery Skills", "Product Knowledge", "Objection Handling", "Closing Ability", "Coachability", "Energy & Presence", "Track Record"], employeeCount: 20 },
  { id: "rf5", name: "Design", levels: ["D1", "D2", "D3 (Sr)", "D4 (Staff)", "Head"], competencies: ["Visual Craft", "UX Thinking", "Process & Method", "Impact & Outcomes", "Presentation"], employeeCount: 10 },
];

export interface CompetencyItem {
  name: string;
  usedBy: string;
  category: string;
  categoryColorClass: string;
}

export const COMPETENCY_LIBRARY: CompetencyItem[] = [
  { name: "Technical Excellence", usedBy: "Engineering", category: "Technical", categoryColorClass: "bg-brand-purple/10 text-brand-purple" },
  { name: "Problem Solving", usedBy: "Eng, Product", category: "Core", categoryColorClass: "bg-brand/10 text-brand" },
  { name: "Communication", usedBy: "All", category: "Core", categoryColorClass: "bg-brand/10 text-brand" },
  { name: "Leadership", usedBy: "All", category: "Leadership", categoryColorClass: "bg-warning/10 text-warning" },
  { name: "Collaboration", usedBy: "All", category: "Core", categoryColorClass: "bg-brand/10 text-brand" },
  { name: "Innovation", usedBy: "Eng, Product", category: "Growth", categoryColorClass: "bg-success/10 text-success" },
  { name: "User Empathy", usedBy: "Product, Design", category: "Functional", categoryColorClass: "bg-brand-teal/10 text-brand-teal" },
  { name: "Strategic Thinking", usedBy: "Product, Mgmt", category: "Leadership", categoryColorClass: "bg-warning/10 text-warning" },
  { name: "Analytical Rigor", usedBy: "Product, Data", category: "Technical", categoryColorClass: "bg-brand-purple/10 text-brand-purple" },
  { name: "Discovery Skills", usedBy: "Sales", category: "Functional", categoryColorClass: "bg-brand-teal/10 text-brand-teal" },
  { name: "Closing Ability", usedBy: "Sales", category: "Functional", categoryColorClass: "bg-brand-teal/10 text-brand-teal" },
  { name: "Visual Craft", usedBy: "Design", category: "Functional", categoryColorClass: "bg-brand-teal/10 text-brand-teal" },
  { name: "People Leadership", usedBy: "Management", category: "Leadership", categoryColorClass: "bg-warning/10 text-warning" },
  { name: "Execution", usedBy: "All", category: "Core", categoryColorClass: "bg-brand/10 text-brand" },
];

/* ── Calibration Rules ── */

export const DISTRIBUTION_TARGETS = [
  { rating: "Exceptional", target: "5-10%", tolerance: "±3%", colorClass: "bg-success" },
  { rating: "Exceeds", target: "15-25%", tolerance: "±5%", colorClass: "bg-brand" },
  { rating: "Meets", target: "50-60%", tolerance: "±5%", colorClass: "bg-warning" },
  { rating: "Developing", target: "10-20%", tolerance: "±5%", colorClass: "bg-[#F97316]" },
  { rating: "Below", target: "2-5%", tolerance: "±2%", colorClass: "bg-destructive" },
];

/* ── Leveling Matrix (Engineering IC) ── */

export const BENCHMARK_MATRIX: Record<string, Record<string, number>> = {
  "Technical Excellence": { IC1: 2.0, IC2: 2.5, IC3: 3.0, IC4: 3.5, IC5: 4.0, IC6: 4.5 },
  "Problem Solving":      { IC1: 2.0, IC2: 2.5, IC3: 3.0, IC4: 3.5, IC5: 4.0, IC6: 4.5 },
  "Communication":        { IC1: 1.5, IC2: 2.0, IC3: 2.5, IC4: 3.0, IC5: 3.5, IC6: 4.0 },
  "Leadership":           { IC1: 1.0, IC2: 1.5, IC3: 2.0, IC4: 2.5, IC5: 3.5, IC6: 4.5 },
  "Collaboration":        { IC1: 2.0, IC2: 2.5, IC3: 3.0, IC4: 3.5, IC5: 3.5, IC6: 4.0 },
  "Innovation":           { IC1: 1.5, IC2: 2.0, IC3: 2.5, IC4: 3.0, IC5: 3.5, IC6: 4.5 },
};

export const LEVEL_TITLES: Record<string, string> = {
  IC1: "Junior Engineer", IC2: "Engineer", IC3: "Senior Engineer",
  IC4: "Staff Engineer", IC5: "Principal Engineer", IC6: "Distinguished Engineer",
};
