/* ================================================================
   O2S Analytics — Shared Types, Mock Data & Helpers
   Single source of truth for the Analytics module
   ================================================================ */

/* ── Types ── */

export type AnalyticsTab = "overview" | "recruiting" | "people" | "compensation" | "dei" | "custom";

export interface KPI {
  id: string;
  label: string;
  value: number;
  format: "number" | "days" | "percentage" | "score" | "currency";
  trend: { value: number; label: string; percentage: number; direction: "up" | "down"; positive: boolean };
  target: { value: number; percentage: number } | null;
  sparkline: number[];
  icon: string;
  accent: string;
}

export interface Insight {
  id: string;
  priority: "critical" | "warning" | "positive";
  title: string;
  detail: string;
  tab: AnalyticsTab;
}

/* ── KPI Sets ── */

export const OVERVIEW_KPIS: KPI[] = [
  { id: "headcount", label: "Total Headcount", value: 142, format: "number", trend: { value: 12, label: "+12 YTD", percentage: 9.2, direction: "up", positive: true }, target: { value: 160, percentage: 88.75 }, sparkline: [108, 112, 116, 118, 120, 122, 126, 128, 131, 136, 140, 142], icon: "Users", accent: "brand" },
  { id: "openRoles", label: "Open Roles", value: 24, format: "number", trend: { value: 6, label: "+6 vs Q4", percentage: 33, direction: "up", positive: false }, target: null, sparkline: [14, 16, 18, 18, 20, 24], icon: "Briefcase", accent: "info" },
  { id: "timeToFill", label: "Avg Time to Fill", value: 34, format: "days", trend: { value: -8, label: "-8d vs Q3", percentage: -19, direction: "down", positive: true }, target: { value: 30, percentage: 88 }, sparkline: [48, 45, 42, 42, 38, 34], icon: "Clock", accent: "brand-teal" },
  { id: "attrition", label: "Attrition Rate", value: 8.2, format: "percentage", trend: { value: -1.1, label: "-1.1% YoY", percentage: -12, direction: "down", positive: true }, target: { value: 10, percentage: 100 }, sparkline: [11.2, 10.8, 9.6, 9.2, 9.0, 8.8, 8.6, 8.4, 8.4, 8.2, 8.2, 8.2], icon: "TrendingDown", accent: "success" },
  { id: "engagement", label: "Engagement Score", value: 78, format: "score", trend: { value: 3, label: "+3 vs survey", percentage: 4, direction: "up", positive: true }, target: { value: 80, percentage: 97.5 }, sparkline: [71, 72, 73, 75, 75, 76, 76, 78], icon: "Heart", accent: "brand-purple" },
  { id: "costPerHire", label: "Cost per Hire", value: 120000, format: "currency", trend: { value: -12, label: "-12% YoY", percentage: -12, direction: "down", positive: true }, target: { value: 150000, percentage: 100 }, sparkline: [165000, 155000, 148000, 140000, 132000, 120000], icon: "IndianRupee", accent: "warning" },
];

export const RECRUITING_KPIS: KPI[] = [
  { id: "openReqs", label: "Open Requisitions", value: 24, format: "number", trend: { value: 6, label: "+6 this qtr", percentage: 33, direction: "up", positive: false }, target: { value: 30, percentage: 80 }, sparkline: [14, 16, 18, 20, 22, 24], icon: "Briefcase", accent: "brand" },
  { id: "pipeline", label: "Active Pipeline", value: 312, format: "number", trend: { value: 18, label: "+18% MoM", percentage: 18, direction: "up", positive: true }, target: null, sparkline: [180, 210, 240, 260, 285, 312], icon: "Users", accent: "info" },
  { id: "ttf", label: "Avg Time to Fill", value: 34, format: "days", trend: { value: -8, label: "-8d vs Q3", percentage: -19, direction: "down", positive: true }, target: { value: 30, percentage: 88 }, sparkline: [48, 45, 42, 42, 38, 34], icon: "Clock", accent: "brand-teal" },
  { id: "offerAccept", label: "Offer Acceptance", value: 87, format: "percentage", trend: { value: 5, label: "+5% vs bench", percentage: 6, direction: "up", positive: true }, target: { value: 85, percentage: 100 }, sparkline: [78, 80, 82, 84, 85, 87], icon: "CheckCircle", accent: "success" },
  { id: "sourceQuality", label: "Source Quality", value: 34, format: "percentage", trend: { value: 4, label: "+4% vs Q3", percentage: 13, direction: "up", positive: true }, target: { value: 30, percentage: 100 }, sparkline: [24, 26, 28, 30, 32, 34], icon: "Target", accent: "brand-purple" },
  { id: "cph", label: "Cost per Hire", value: 120000, format: "currency", trend: { value: -12, label: "-12% YoY", percentage: -12, direction: "down", positive: true }, target: { value: 150000, percentage: 100 }, sparkline: [165000, 155000, 148000, 140000, 132000, 120000], icon: "IndianRupee", accent: "warning" },
];

export const PEOPLE_KPIS: KPI[] = [
  { id: "headcount", label: "Total Headcount", value: 142, format: "number", trend: { value: 12, label: "+12 YTD", percentage: 9.2, direction: "up", positive: true }, target: { value: 160, percentage: 88.75 }, sparkline: [108, 112, 116, 118, 120, 122, 126, 128, 131, 136, 140, 142], icon: "Users", accent: "brand" },
  { id: "attrition", label: "Attrition Rate", value: 8.2, format: "percentage", trend: { value: -1.1, label: "-1.1% YoY", percentage: -12, direction: "down", positive: true }, target: { value: 10, percentage: 100 }, sparkline: [11.2, 10.8, 9.6, 9.2, 9.0, 8.8, 8.6, 8.4, 8.4, 8.2, 8.2, 8.2], icon: "TrendingDown", accent: "success" },
  { id: "tenure", label: "Avg Tenure", value: 2.4, format: "number", trend: { value: 0.3, label: "+0.3 YoY", percentage: 14, direction: "up", positive: true }, target: null, sparkline: [1.8, 1.9, 2.0, 2.1, 2.2, 2.4], icon: "Calendar", accent: "brand-teal" },
  { id: "engagement", label: "Engagement Score", value: 78, format: "score", trend: { value: 3, label: "+3 vs survey", percentage: 4, direction: "up", positive: true }, target: { value: 80, percentage: 97.5 }, sparkline: [71, 72, 73, 75, 75, 76, 76, 78], icon: "Heart", accent: "brand-purple" },
  { id: "mgrRatio", label: "Manager:IC Ratio", value: 7.2, format: "number", trend: { value: -0.3, label: "-0.3 vs Q3", percentage: -4, direction: "down", positive: true }, target: null, sparkline: [8.0, 7.8, 7.6, 7.5, 7.4, 7.2], icon: "UserCheck", accent: "info" },
  { id: "mobility", label: "Internal Mobility", value: 8.4, format: "percentage", trend: { value: 2.1, label: "+2.1% YoY", percentage: 33, direction: "up", positive: true }, target: { value: 10, percentage: 84 }, sparkline: [4.2, 5.0, 5.8, 6.3, 7.1, 8.4], icon: "ArrowUpRight", accent: "warning" },
];

export const COMP_KPIS: KPI[] = [
  { id: "avgBase", label: "Avg Base Salary", value: 2460000, format: "currency", trend: { value: 8.2, label: "+8.2% YoY", percentage: 8.2, direction: "up", positive: true }, target: null, sparkline: [2100000, 2200000, 2280000, 2350000, 2400000, 2460000], icon: "IndianRupee", accent: "brand" },
  { id: "compaRatio", label: "Compa-Ratio", value: 0.97, format: "number", trend: { value: -0.02, label: "-0.02 vs Q3", percentage: -2, direction: "down", positive: false }, target: null, sparkline: [0.99, 0.99, 0.98, 0.98, 0.97, 0.97], icon: "Scale", accent: "brand-teal" },
  { id: "payGap", label: "Pay Equity Gap", value: 3.2, format: "percentage", trend: { value: -1.8, label: "-1.8% YoY", percentage: -36, direction: "down", positive: true }, target: { value: 3, percentage: 94 }, sparkline: [6.2, 5.4, 4.8, 4.2, 3.6, 3.2], icon: "Equal", accent: "success" },
  { id: "budget", label: "Total Comp Budget", value: 382000000, format: "currency", trend: { value: 14, label: "+14% YoY", percentage: 14, direction: "up", positive: false }, target: { value: 400000000, percentage: 95.5 }, sparkline: [310, 330, 345, 360, 372, 382], icon: "Wallet", accent: "warning" },
  { id: "esop", label: "ESOPs Allocated", value: 68, format: "percentage", trend: { value: 12, label: "+12% YoY", percentage: 21, direction: "up", positive: true }, target: null, sparkline: [42, 48, 52, 58, 64, 68], icon: "TrendingUp", accent: "brand-purple" },
  { id: "market", label: "Market Position", value: 52, format: "number", trend: { value: -3, label: "-3 pts vs H1", percentage: -5, direction: "down", positive: false }, target: null, sparkline: [58, 57, 56, 55, 53, 52], icon: "BarChart3", accent: "info" },
];

export const DEI_KPIS: KPI[] = [
  { id: "genderDiv", label: "Gender Diversity", value: 38, format: "percentage", trend: { value: 4, label: "+4% F YoY", percentage: 12, direction: "up", positive: true }, target: { value: 40, percentage: 95 }, sparkline: [30, 32, 33, 35, 36, 38], icon: "Users", accent: "brand-purple" },
  { id: "leaderDiv", label: "Leadership Diversity", value: 28, format: "percentage", trend: { value: 6, label: "+6% YoY", percentage: 27, direction: "up", positive: true }, target: { value: 35, percentage: 80 }, sparkline: [18, 20, 22, 24, 26, 28], icon: "Crown", accent: "brand" },
  { id: "hireDiv", label: "Hiring Diversity", value: 42, format: "percentage", trend: { value: 8, label: "+8% vs Q3", percentage: 24, direction: "up", positive: true }, target: { value: 45, percentage: 93 }, sparkline: [28, 32, 34, 36, 40, 42], icon: "UserPlus", accent: "brand-teal" },
  { id: "inclusion", label: "Inclusion Score", value: 74, format: "score", trend: { value: 5, label: "+5 vs survey", percentage: 7, direction: "up", positive: true }, target: { value: 80, percentage: 92.5 }, sparkline: [62, 65, 67, 69, 72, 74], icon: "Heart", accent: "success" },
  { id: "promoEquity", label: "Promotion Equity", value: 0.96, format: "number", trend: { value: 0, label: "Stable", percentage: 0, direction: "up", positive: true }, target: null, sparkline: [0.92, 0.93, 0.94, 0.95, 0.96, 0.96], icon: "ArrowUpRight", accent: "warning" },
  { id: "repGap", label: "Representation Gap", value: 3, format: "number", trend: { value: -2, label: "-2 vs Q3", percentage: -40, direction: "down", positive: true }, target: { value: 0, percentage: 0 }, sparkline: [8, 7, 6, 5, 5, 3], icon: "AlertTriangle", accent: "destructive" },
];

/* ── Chart Data ── */

export const HEADCOUNT_TREND = [
  { month: "Apr '25", headcount: 108, hires: 4, departures: 1, target: 130 },
  { month: "May '25", headcount: 112, hires: 5, departures: 1, target: 132 },
  { month: "Jun '25", headcount: 116, hires: 6, departures: 2, target: 135 },
  { month: "Jul '25", headcount: 118, hires: 4, departures: 2, target: 138 },
  { month: "Aug '25", headcount: 120, hires: 3, departures: 1, target: 140 },
  { month: "Sep '25", headcount: 122, hires: 4, departures: 2, target: 142 },
  { month: "Oct '25", headcount: 126, hires: 5, departures: 1, target: 145 },
  { month: "Nov '25", headcount: 128, hires: 3, departures: 1, target: 148 },
  { month: "Dec '25", headcount: 131, hires: 5, departures: 2, target: 150 },
  { month: "Jan '26", headcount: 136, hires: 7, departures: 2, target: 153 },
  { month: "Feb '26", headcount: 140, hires: 5, departures: 1, target: 156 },
  { month: "Mar '26", headcount: 142, hires: 6, departures: 4, target: 160 },
];

export const HIRING_FUNNEL = [
  { stage: "Applied", count: 312, percentage: 100, benchmark: 100 },
  { stage: "Screened", count: 186, percentage: 59.6, benchmark: 55 },
  { stage: "Interview", count: 89, percentage: 28.5, benchmark: 25 },
  { stage: "Final Round", count: 34, percentage: 10.9, benchmark: 10 },
  { stage: "Offer", count: 12, percentage: 3.8, benchmark: 4 },
  { stage: "Hired", count: 8, percentage: 2.6, benchmark: 2.1 },
];

export const DEPT_BREAKDOWN = [
  { dept: "Engineering", count: 48, pct: 33.8, color: "#3B82F6" },
  { dept: "Sales", count: 28, pct: 19.7, color: "#10B981" },
  { dept: "Product", count: 18, pct: 12.7, color: "#6366F1" },
  { dept: "Marketing", count: 14, pct: 9.9, color: "#F59E0B" },
  { dept: "Design", count: 12, pct: 8.5, color: "#8B5CF6" },
  { dept: "HR", count: 8, pct: 5.6, color: "#14B8A6" },
  { dept: "Finance", count: 8, pct: 5.6, color: "#F43F5E" },
  { dept: "Operations", count: 6, pct: 4.2, color: "#64748B" },
];

export const ATTRITION_TREND = [
  { month: "Apr '25", rate: 11.2, benchmark: 9.3 },
  { month: "May '25", rate: 10.8, benchmark: 9.3 },
  { month: "Jun '25", rate: 9.6, benchmark: 9.3 },
  { month: "Jul '25", rate: 9.2, benchmark: 9.3 },
  { month: "Aug '25", rate: 9.0, benchmark: 9.3 },
  { month: "Sep '25", rate: 8.8, benchmark: 9.3 },
  { month: "Oct '25", rate: 8.6, benchmark: 9.3 },
  { month: "Nov '25", rate: 8.4, benchmark: 9.3 },
  { month: "Dec '25", rate: 8.4, benchmark: 9.3 },
  { month: "Jan '26", rate: 8.2, benchmark: 9.3 },
  { month: "Feb '26", rate: 8.2, benchmark: 9.3 },
  { month: "Mar '26", rate: 8.2, benchmark: 9.3 },
];

export const TTF_DISTRIBUTION = [
  { bucket: "0-15", count: 4, label: "0-15d" },
  { bucket: "16-25", count: 8, label: "16-25d" },
  { bucket: "26-35", count: 12, label: "26-35d" },
  { bucket: "36-45", count: 10, label: "36-45d" },
  { bucket: "46-55", count: 6, label: "46-55d" },
  { bucket: "56-65", count: 4, label: "56-65d" },
  { bucket: "66-75", count: 2, label: "66-75d" },
  { bucket: "76+", count: 1, label: "76+d" },
];

export const SOURCING_DATA = [
  { channel: "LinkedIn", volume: 89, quality: 34, cost: 45000 },
  { channel: "Referrals", volume: 42, quality: 62, cost: 55000 },
  { channel: "Direct Apply", volume: 56, quality: 28, cost: 8000 },
  { channel: "Career Page", volume: 48, quality: 31, cost: 12000 },
  { channel: "AI Sourced", volume: 38, quality: 48, cost: 3200 },
  { channel: "Agency", volume: 18, quality: 55, cost: 280000 },
];

export const AI_ACCURACY_TREND = [
  { month: "Jul", ai: 82, human: 76 }, { month: "Aug", ai: 84, human: 77 },
  { month: "Sep", ai: 86, human: 77 }, { month: "Oct", ai: 87, human: 78 },
  { month: "Nov", ai: 88, human: 78 }, { month: "Dec", ai: 89, human: 78 },
  { month: "Jan", ai: 90, human: 78 }, { month: "Feb", ai: 90, human: 78 },
  { month: "Mar", ai: 91, human: 78 },
];

export const ENGAGEMENT_BREAKDOWN = [
  { dim: "Growth", score: 82 }, { dim: "Compensation", score: 68 },
  { dim: "Culture", score: 84 }, { dim: "Manager", score: 81 },
  { dim: "Work-Life", score: 76 }, { dim: "Role Clarity", score: 88 },
  { dim: "Collaboration", score: 79 }, { dim: "Recognition", score: 72 },
];

export const TENURE_DIST = [
  { bucket: "<6mo", count: 18 }, { bucket: "6mo-1y", count: 22 },
  { bucket: "1-2y", count: 34 }, { bucket: "2-3y", count: 28 },
  { bucket: "3-5y", count: 30 }, { bucket: "5y+", count: 10 },
];

export const DEI_BY_LEVEL = [
  { level: "IC1-IC2", female: 42, male: 54, nb: 4 },
  { level: "IC3-IC4", female: 36, male: 61, nb: 3 },
  { level: "Lead/Mgr", female: 32, male: 65, nb: 3 },
  { level: "Director+", female: 28, male: 70, nb: 2 },
  { level: "VP+", female: 25, male: 75, nb: 0 },
];

export const DEI_PIPELINE = [
  { stage: "Applied", female: 42, male: 55, nb: 3 },
  { stage: "Screened", female: 40, male: 57, nb: 3 },
  { stage: "Interview", female: 35, male: 62, nb: 3 },
  { stage: "Final", female: 24, male: 73, nb: 3 },
  { stage: "Offer", female: 33, male: 64, nb: 3 },
  { stage: "Hired", female: 38, male: 59, nb: 3 },
];

export const DEI_TREND = [
  { quarter: "Q1 '25", female: 32, target: 40 },
  { quarter: "Q2 '25", female: 33, target: 40 },
  { quarter: "Q3 '25", female: 35, target: 40 },
  { quarter: "Q4 '25", female: 36, target: 40 },
  { quarter: "Q1 '26", female: 38, target: 40 },
];

export const COMP_BANDS = [
  { level: "IC1", p25: 8, p50: 10, p75: 12, yours: 10.5 },
  { level: "IC2", p25: 12, p50: 16, p75: 20, yours: 15.8 },
  { level: "IC3", p25: 18, p50: 24, p75: 30, yours: 23.5 },
  { level: "IC4", p25: 26, p50: 32, p75: 40, yours: 31 },
  { level: "IC5", p25: 35, p50: 45, p75: 55, yours: 42 },
  { level: "Mgr", p25: 30, p50: 38, p75: 48, yours: 39 },
  { level: "Dir", p25: 45, p50: 55, p75: 70, yours: 54 },
  { level: "VP", p25: 60, p50: 75, p75: 95, yours: 72 },
];

export const INCLUSION_SCORES = [
  { dim: "Belonging", score: 78 }, { dim: "Safety", score: 72 },
  { dim: "Voice", score: 70 }, { dim: "Opportunity", score: 76 },
  { dim: "Fairness", score: 74 }, { dim: "Recognition", score: 68 },
];

/* ── Insights ── */

export const AI_INSIGHTS: Insight[] = [
  { id: "ins1", priority: "critical", title: "Engineering attrition risk increased 12% MoM", detail: "5 employees flagged as high-risk. Primary driver: comp below market after Q1 adjustments at competitors.", tab: "people" },
  { id: "ins2", priority: "warning", title: "Interview-to-offer conversion dropped to 22%", detail: "Was 34% last quarter. Bottleneck in technical rounds — avg 3.2 interviews per hire vs benchmark 2.4.", tab: "recruiting" },
  { id: "ins3", priority: "positive", title: "Referral hires outperforming all channels", detail: "2.8× more likely to exceed expectations at 6-month review. Referral volume up 45% since bonus increase.", tab: "recruiting" },
  { id: "ins4", priority: "warning", title: "Female representation drops 18pp at Final Round", detail: "42% in pipeline → 24% at final round. May indicate interview panel composition bias.", tab: "dei" },
  { id: "ins5", priority: "positive", title: "AI screening accuracy reached all-time high of 91%", detail: "Up from 82% at launch. Now outperforming human screeners by 13 percentage points consistently.", tab: "overview" },
];

/* ── Scheduled Reports ── */

export const SCHEDULED_REPORTS = [
  { id: "sr1", name: "Weekly Pipeline Digest", recipients: "prashant@latentbridge.com", frequency: "Every Monday 9:00 AM", lastSent: "Mar 24", status: "active" },
  { id: "sr2", name: "Monthly Board Pack", recipients: "leadership@latentbridge.com", frequency: "1st of month", lastSent: "Mar 1", status: "active" },
];

export const SAVED_REPORTS = [
  { id: "r1", name: "Weekly Hiring Pipeline", saved: "Mar 20", desc: "Recruiting funnel + sourcing breakdown for all active roles" },
  { id: "r2", name: "Board Metrics Dashboard", saved: "Mar 1", desc: "Headcount, attrition, comp, DEI — quarterly view" },
  { id: "r3", name: "Engineering Health Check", saved: "Feb 15", desc: "Eng-specific: team growth, attrition risk, skill gaps" },
];

/* ── Helpers ── */

export function formatKPIValue(value: number, format: string): string {
  switch (format) {
    case "number": return value % 1 === 0 ? value.toLocaleString() : value.toFixed(1);
    case "days": return `${value}d`;
    case "percentage": return `${value}%`;
    case "score": return `${value}/100`;
    case "currency": {
      if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)}Cr`;
      if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
      return `₹${(value / 1000).toFixed(0)}K`;
    }
    default: return String(value);
  }
}

export function trendColorClass(positive: boolean): string {
  return positive ? "text-success" : "text-destructive";
}

export function insightDotClass(priority: string): string {
  switch (priority) {
    case "critical": return "bg-destructive";
    case "warning": return "bg-warning";
    case "positive": return "bg-success";
    default: return "bg-muted-foreground";
  }
}

export function insightBgClass(priority: string): string {
  switch (priority) {
    case "critical": return "bg-destructive/5 border-destructive/20";
    case "warning": return "bg-warning/5 border-warning/20";
    case "positive": return "bg-success/5 border-success/20";
    default: return "bg-secondary border-border";
  }
}
