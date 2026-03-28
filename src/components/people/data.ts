/* ================================================================
   O2S People — Shared Types, Mock Data & Helpers
   Single source of truth for the People module
   ================================================================ */

/* ── Types ── */

export interface Employee {
  id: string;
  name: string;
  initials: string;
  role: string;
  department: string;
  team: string;
  level: string;
  location: string;
  manager: string | null;
  managerId: string | null;
  status: "active" | "onboarding" | "leave" | "offboarding" | "contractor";
  email: string;
  phone: string;
  startDate: string;
  tenure: string;
  skills: string[];
  tags: string[];
  directReports: number;
  lastDate?: string;
  contractEnd?: string;
  aiScore: {
    engagement: number;
    attritionRisk: string;
    attritionProbability: number;
    performanceTrajectory: string;
  } | null;
}

export interface Department {
  id: string;
  name: string;
  colorClass: string;
  textColorClass: string;
  count: number;
  head: string;
}

export interface Location {
  name: string;
  count: number;
  percentage: number;
}

/* ── Departments ── */

export const DEPARTMENTS: Department[] = [
  { id: "eng",       name: "Engineering",   colorClass: "bg-brand",        textColorClass: "text-brand",        count: 48, head: "Rajesh Kumar" },
  { id: "sales",     name: "Sales",         colorClass: "bg-success",      textColorClass: "text-success",      count: 28, head: "Amit Verma" },
  { id: "product",   name: "Product",       colorClass: "bg-info",         textColorClass: "text-info",         count: 18, head: "Neha Gupta" },
  { id: "design",    name: "Design",        colorClass: "bg-brand-purple", textColorClass: "text-brand-purple", count: 12, head: "Lisa Park" },
  { id: "marketing", name: "Marketing",     colorClass: "bg-warning",      textColorClass: "text-warning",      count: 14, head: "Kavita Rao" },
  { id: "hr",        name: "HR & People",   colorClass: "bg-brand-teal",   textColorClass: "text-brand-teal",   count: 8,  head: "Prashant Singh" },
  { id: "finance",   name: "Finance",       colorClass: "bg-destructive",  textColorClass: "text-destructive",  count: 8,  head: "Deepak Joshi" },
  { id: "ops",       name: "Operations",    colorClass: "bg-muted-foreground", textColorClass: "text-muted-foreground", count: 6, head: "Ravi Shankar" },
];

export const DEPT_MAP: Record<string, Department> = Object.fromEntries(
  DEPARTMENTS.map((d) => [d.name, d])
);

/* ── Locations ── */

export const LOCATIONS: Location[] = [
  { name: "Bangalore HQ",           count: 72, percentage: 50.7 },
  { name: "Mumbai",                  count: 24, percentage: 16.9 },
  { name: "Remote - India",         count: 34, percentage: 23.9 },
  { name: "Remote - International", count: 12, percentage: 8.5 },
];

/* ── Status Config ── */

export const STATUS_CONFIG: Record<string, { label: string; abbr: string; colorClass: string; dotClass: string }> = {
  active:       { label: "Active",       abbr: "Act", colorClass: "text-success",      dotClass: "bg-success" },
  onboarding:   { label: "Onboarding",   abbr: "Onb", colorClass: "text-brand",        dotClass: "bg-brand" },
  leave:        { label: "On Leave",     abbr: "Lve", colorClass: "text-warning",      dotClass: "bg-warning" },
  offboarding:  { label: "Offboarding",  abbr: "Off", colorClass: "text-destructive",  dotClass: "bg-destructive" },
  contractor:   { label: "Contractor",   abbr: "Con", colorClass: "text-brand-purple", dotClass: "bg-brand-purple" },
};

/* ── Levels ── */

export const LEVELS = ["IC1", "IC2", "IC3", "IC4", "IC5", "Lead", "Manager", "Director", "VP", "C-Suite", "Contractor"] as const;

/* ── Mock Employees ── */

export const EMPLOYEES: Employee[] = [
  // Leadership
  { id: "e0",  name: "Prashant Singh",  initials: "PS", role: "CEO & Founder",            department: "Engineering", team: "Executive",          level: "C-Suite",    location: "Bangalore HQ",           manager: null,             managerId: null,  status: "active",      email: "prashant@latentbridge.com",      phone: "+91 98765 00000", startDate: "2021-01-01", tenure: "5y 2m",  skills: ["AI/ML", "Product Strategy", "Leadership", "Fundraising", "Engineering"],                          tags: ["Founder"],     directReports: 7,  aiScore: { engagement: 95, attritionRisk: "low", attritionProbability: 1, performanceTrajectory: "up" } },
  { id: "e20", name: "Rajesh Kumar",    initials: "RK", role: "VP Engineering",            department: "Engineering", team: "Leadership",          level: "VP",         location: "Bangalore HQ",           manager: "Prashant Singh", managerId: "e0",  status: "active",      email: "rajesh.kumar@latentbridge.com",  phone: "+91 98765 33333", startDate: "2021-06-01", tenure: "4y 9m",  skills: ["System Architecture", "Team Leadership", "Distributed Systems", "Cloud Infrastructure"],          tags: [],              directReports: 48, aiScore: { engagement: 86, attritionRisk: "low", attritionProbability: 6, performanceTrajectory: "stable" } },
  { id: "e22", name: "Lisa Park",       initials: "LP", role: "VP Design",                 department: "Design",      team: "Leadership",          level: "VP",         location: "Bangalore HQ",           manager: "Prashant Singh", managerId: "e0",  status: "active",      email: "lisa.park@latentbridge.com",     phone: "+91 98765 44444", startDate: "2022-01-15", tenure: "4y 2m",  skills: ["Design Leadership", "Design Systems", "User Research", "Brand"],                                  tags: [],              directReports: 12, aiScore: { engagement: 84, attritionRisk: "low", attritionProbability: 8, performanceTrajectory: "stable" } },
  { id: "e10", name: "Amit Verma",      initials: "AV", role: "VP Sales",                  department: "Sales",       team: "Leadership",          level: "VP",         location: "Bangalore HQ",           manager: "Prashant Singh", managerId: "e0",  status: "active",      email: "amit.verma@latentbridge.com",    phone: "+91 21098 76543", startDate: "2022-06-01", tenure: "3y 9m",  skills: ["Enterprise Sales", "GTM Strategy", "Team Leadership", "SaaS"],                                    tags: [],              directReports: 28, aiScore: { engagement: 90, attritionRisk: "low", attritionProbability: 4, performanceTrajectory: "up" } },
  { id: "e12", name: "Neha Gupta",      initials: "NG", role: "VP Product",                department: "Product",     team: "Leadership",          level: "VP",         location: "Bangalore HQ",           manager: "Prashant Singh", managerId: "e0",  status: "active",      email: "neha.gupta@latentbridge.com",    phone: "+91 09876 54321", startDate: "2022-03-01", tenure: "4y 0m",  skills: ["Product Strategy", "Roadmapping", "User Research", "Data Analysis", "OKRs"],                      tags: [],              directReports: 18, aiScore: { engagement: 88, attritionRisk: "low", attritionProbability: 5, performanceTrajectory: "stable" } },
  // Engineering
  { id: "e1",  name: "Priya Sharma",    initials: "PS", role: "Senior Frontend Engineer",  department: "Engineering", team: "Frontend Platform",   level: "IC4",        location: "Bangalore HQ",           manager: "Rajesh Kumar",   managerId: "e20", status: "active",      email: "priya.sharma@latentbridge.com",  phone: "+91 98765 43210", startDate: "2023-03-15", tenure: "3y 0m",  skills: ["React", "TypeScript", "Next.js", "System Design", "GraphQL", "Tailwind", "Testing"],              tags: [],              directReports: 3,  aiScore: { engagement: 87, attritionRisk: "low", attritionProbability: 8, performanceTrajectory: "up" } },
  { id: "e2",  name: "Marcus Chen",     initials: "MC", role: "Backend Engineer",          department: "Engineering", team: "Core Platform",       level: "IC3",        location: "Remote - India",         manager: "Rajesh Kumar",   managerId: "e20", status: "active",      email: "marcus.chen@latentbridge.com",   phone: "+91 87654 32109", startDate: "2024-07-01", tenure: "1y 8m",  skills: ["Python", "FastAPI", "PostgreSQL", "Redis", "Docker", "AWS"],                                      tags: [],              directReports: 0,  aiScore: { engagement: 74, attritionRisk: "medium", attritionProbability: 22, performanceTrajectory: "stable" } },
  { id: "e3",  name: "Alex Rivera",     initials: "AR", role: "Frontend Engineer",         department: "Engineering", team: "Frontend Platform",   level: "IC2",        location: "Bangalore HQ",           manager: "Priya Sharma",   managerId: "e1",  status: "active",      email: "alex.rivera@latentbridge.com",   phone: "+91 76543 21098", startDate: "2025-01-15", tenure: "1y 2m",  skills: ["React", "TypeScript", "CSS", "Testing"],                                                          tags: [],              directReports: 0,  aiScore: { engagement: 82, attritionRisk: "low", attritionProbability: 5, performanceTrajectory: "up" } },
  { id: "e4",  name: "Maya Chen",       initials: "MC", role: "DevOps Engineer",           department: "Engineering", team: "Infrastructure",      level: "IC3",        location: "Mumbai",                 manager: "Rajesh Kumar",   managerId: "e20", status: "onboarding",  email: "maya.chen@latentbridge.com",     phone: "+91 65432 10987", startDate: "2026-03-31", tenure: "0y 0m",  skills: ["Kubernetes", "Terraform", "AWS", "CI/CD", "Python"],                                              tags: ["New"],         directReports: 0,  aiScore: null },
  { id: "e5",  name: "David Kim",       initials: "DK", role: "Data Scientist",            department: "Engineering", team: "AI/ML",               level: "IC4",        location: "Remote - International", manager: "Prashant Singh", managerId: "e0",  status: "leave",       email: "david.kim@latentbridge.com",     phone: "+82 10 1234 5678", startDate: "2022-01-10", tenure: "4y 2m", skills: ["Python", "PyTorch", "ML Ops", "SQL", "Spark", "LLMs"],                                            tags: [],              directReports: 2,  aiScore: { engagement: 68, attritionRisk: "medium", attritionProbability: 28, performanceTrajectory: "stable" } },
  { id: "e6",  name: "Yuki Tanaka",     initials: "YT", role: "Frontend Engineer",         department: "Engineering", team: "Frontend Platform",   level: "IC2",        location: "Remote - International", manager: "Priya Sharma",   managerId: "e1",  status: "active",      email: "yuki.tanaka@latentbridge.com",   phone: "+81 90 1234 5678", startDate: "2025-07-01", tenure: "0y 8m", skills: ["React", "TypeScript", "Next.js", "Storybook"],                                                    tags: [],              directReports: 0,  aiScore: { engagement: 79, attritionRisk: "low", attritionProbability: 10, performanceTrajectory: "up" } },
  { id: "e7",  name: "Sam Wilson",      initials: "SW", role: "Junior Frontend Developer", department: "Engineering", team: "Frontend Platform",   level: "IC1",        location: "Bangalore HQ",           manager: "Priya Sharma",   managerId: "e1",  status: "active",      email: "sam.wilson@latentbridge.com",    phone: "+91 54321 09876", startDate: "2025-12-15", tenure: "0y 3m",  skills: ["React", "JavaScript", "CSS", "HTML"],                                                              tags: ["New"],         directReports: 0,  aiScore: { engagement: 91, attritionRisk: "low", attritionProbability: 3, performanceTrajectory: "up" } },
  // Design
  { id: "e8",  name: "Sarah Kim",       initials: "SK", role: "Product Designer",          department: "Design",      team: "Product Design",      level: "IC3",        location: "Bangalore HQ",           manager: "Lisa Park",      managerId: "e22", status: "active",      email: "sarah.kim@latentbridge.com",     phone: "+91 43210 98765", startDate: "2023-09-01", tenure: "2y 6m",  skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"],                       tags: [],              directReports: 0,  aiScore: { engagement: 85, attritionRisk: "low", attritionProbability: 7, performanceTrajectory: "up" } },
  { id: "e9",  name: "Raj Malhotra",    initials: "RM", role: "UX Researcher",             department: "Design",      team: "Research",            level: "IC3",        location: "Mumbai",                 manager: "Lisa Park",      managerId: "e22", status: "active",      email: "raj.malhotra@latentbridge.com",  phone: "+91 32109 87654", startDate: "2024-02-15", tenure: "2y 1m",  skills: ["User Interviews", "Surveys", "Data Analysis", "Workshop Facilitation"],                            tags: [],              directReports: 0,  aiScore: { engagement: 78, attritionRisk: "low", attritionProbability: 12, performanceTrajectory: "stable" } },
  // Sales
  { id: "e11", name: "Nisha Reddy",     initials: "NR", role: "Account Executive",         department: "Sales",       team: "Enterprise",          level: "IC3",        location: "Bangalore HQ",           manager: "Amit Verma",     managerId: "e10", status: "active",      email: "nisha.reddy@latentbridge.com",   phone: "+91 10987 65432", startDate: "2024-04-01", tenure: "1y 11m", skills: ["SaaS Sales", "Negotiation", "CRM", "Enterprise Deals"],                                            tags: [],              directReports: 0,  aiScore: { engagement: 83, attritionRisk: "low", attritionProbability: 9, performanceTrajectory: "up" } },
  // HR
  { id: "e13", name: "Kavitha Menon",   initials: "KM", role: "HR Business Partner",       department: "HR & People", team: "HRBP",                level: "IC4",        location: "Bangalore HQ",           manager: "Prashant Singh", managerId: "e0",  status: "active",      email: "kavitha.menon@latentbridge.com", phone: "+91 98765 11111", startDate: "2023-06-01", tenure: "2y 9m",  skills: ["Employee Relations", "Performance Management", "Compensation", "Labor Law"],                      tags: [],              directReports: 2,  aiScore: { engagement: 80, attritionRisk: "low", attritionProbability: 11, performanceTrajectory: "stable" } },
  // Offboarding
  { id: "e14", name: "Rohit Saxena",    initials: "RS", role: "Marketing Manager",         department: "Marketing",   team: "Growth",              level: "IC4",        location: "Mumbai",                 manager: "Prashant Singh", managerId: "e0",  status: "offboarding", email: "rohit.saxena@latentbridge.com",  phone: "+91 87654 22222", startDate: "2021-11-01", tenure: "4y 4m",  skills: ["SEO", "Content Strategy", "Paid Ads", "Analytics"],                                                tags: [],              directReports: 0,  lastDate: "2026-04-15", aiScore: { engagement: 42, attritionRisk: "confirmed", attritionProbability: 100, performanceTrajectory: "down" } },
  // Contractor
  { id: "e15", name: "Tomoko Hayashi",  initials: "TH", role: "Security Consultant",       department: "Engineering", team: "Security",            level: "Contractor", location: "Remote - International", manager: "Rajesh Kumar",   managerId: "e20", status: "contractor",  email: "tomoko@external.com",            phone: "+81 80 9876 5432", startDate: "2025-10-01", tenure: "0y 5m", skills: ["Penetration Testing", "SOC 2", "OWASP", "Cloud Security"],                                        tags: ["Contractor"],  directReports: 0,  contractEnd: "2026-09-30", aiScore: null },
  // More Engineering
  { id: "e16", name: "Anil Singh",      initials: "AS", role: "Engineering Manager",       department: "Engineering", team: "Infrastructure",      level: "Manager",    location: "Bangalore HQ",           manager: "Rajesh Kumar",   managerId: "e20", status: "active",      email: "anil.singh@latentbridge.com",    phone: "+91 98765 55555", startDate: "2022-08-01", tenure: "3y 7m",  skills: ["DevOps", "Cloud Architecture", "Team Management", "SRE"],                                        tags: [],              directReports: 6,  aiScore: { engagement: 81, attritionRisk: "low", attritionProbability: 9, performanceTrajectory: "stable" } },
  { id: "e17", name: "Arjun Mehta",     initials: "AM", role: "Staff Engineer",            department: "Engineering", team: "Core Platform",       level: "IC5",        location: "Bangalore HQ",           manager: "Rajesh Kumar",   managerId: "e20", status: "active",      email: "arjun.mehta@latentbridge.com",   phone: "+91 98765 66666", startDate: "2021-09-01", tenure: "4y 6m",  skills: ["Go", "Microservices", "gRPC", "Kafka", "System Design"],                                          tags: [],              directReports: 0,  aiScore: { engagement: 76, attritionRisk: "medium", attritionProbability: 18, performanceTrajectory: "stable" } },
  { id: "e18", name: "Fatima Hassan",   initials: "FH", role: "QA Engineer",               department: "Engineering", team: "Quality",             level: "IC3",        location: "Mumbai",                 manager: "Rajesh Kumar",   managerId: "e20", status: "active",      email: "fatima.hassan@latentbridge.com", phone: "+91 98765 77777", startDate: "2024-01-15", tenure: "2y 2m",  skills: ["Selenium", "Cypress", "API Testing", "Performance Testing"],                                      tags: [],              directReports: 0,  aiScore: { engagement: 72, attritionRisk: "low", attritionProbability: 14, performanceTrajectory: "stable" } },
];

/* ── Filter Values ── */

export const ALL_DEPARTMENTS = DEPARTMENTS.map((d) => d.name);
export const ALL_LOCATIONS = [...new Set(EMPLOYEES.map((e) => e.location))];
export const ALL_STATUSES = ["active", "onboarding", "leave", "offboarding", "contractor"] as const;
export const ALL_LEVELS_UNIQUE = [...new Set(EMPLOYEES.map((e) => e.level))];
export const ALL_MANAGERS = [...new Set(EMPLOYEES.filter((e) => e.manager).map((e) => e.manager!))];

/* ── Chart Data ── */

export const HEADCOUNT_TREND = [
  { month: "Apr", count: 118 }, { month: "May", count: 120 }, { month: "Jun", count: 122 },
  { month: "Jul", count: 126 }, { month: "Aug", count: 128 }, { month: "Sep", count: 130 },
  { month: "Oct", count: 131 }, { month: "Nov", count: 133 }, { month: "Dec", count: 136 },
  { month: "Jan", count: 138 }, { month: "Feb", count: 140 }, { month: "Mar", count: 142 },
];

export const TENURE_DISTRIBUTION = [
  { bucket: "<6mo",  count: 18 }, { bucket: "6mo-1y", count: 22 },
  { bucket: "1-2y",  count: 34 }, { bucket: "2-3y",   count: 28 },
  { bucket: "3-5y",  count: 30 }, { bucket: "5y+",    count: 10 },
];

export const HIRING_VS_ATTRITION = [
  { month: "Apr", hires: 4, departures: 1 }, { month: "May", hires: 3, departures: 1 },
  { month: "Jun", hires: 5, departures: 2 }, { month: "Jul", hires: 6, departures: 2 },
  { month: "Aug", hires: 3, departures: 1 }, { month: "Sep", hires: 4, departures: 2 },
  { month: "Oct", hires: 2, departures: 1 }, { month: "Nov", hires: 3, departures: 1 },
  { month: "Dec", hires: 5, departures: 2 }, { month: "Jan", hires: 4, departures: 2 },
  { month: "Feb", hires: 3, departures: 1 }, { month: "Mar", hires: 6, departures: 2 },
];

export const ATTRITION_RISK_MATRIX = [
  { department: "Engineering", low: 38, medium: 8, high: 2 },
  { department: "Sales",       low: 20, medium: 6, high: 2 },
  { department: "Product",     low: 15, medium: 2, high: 1 },
  { department: "Design",      low: 10, medium: 2, high: 0 },
  { department: "Marketing",   low: 9,  medium: 4, high: 1 },
  { department: "HR & People", low: 7,  medium: 1, high: 0 },
  { department: "Finance",     low: 6,  medium: 2, high: 0 },
  { department: "Operations",  low: 5,  medium: 1, high: 0 },
];

/* ── Helpers ── */

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

export function engagementColor(score: number): string {
  if (score >= 80) return "text-success";
  if (score >= 60) return "text-warning";
  return "text-destructive";
}

export function engagementBarColor(score: number): string {
  if (score >= 80) return "bg-success";
  if (score >= 60) return "bg-warning";
  return "bg-destructive";
}

export function riskColor(risk: string): string {
  if (risk === "low") return "text-success";
  if (risk === "medium") return "text-warning";
  return "text-destructive";
}

export function riskBgColor(risk: string): string {
  if (risk === "low") return "bg-success/15";
  if (risk === "medium") return "bg-warning/15";
  return "bg-destructive/15";
}

export function skillLevelClass(level: number): string {
  if (level >= 5) return "text-success";
  if (level >= 4) return "text-brand-teal";
  if (level >= 3) return "text-brand";
  return "text-muted-foreground";
}

/* ── Filters ── */

export interface PeopleFilters {
  search: string;
  departments: string[];
  locations: string[];
  statuses: string[];
  levels: string[];
  managers: string[];
}

export const EMPTY_FILTERS: PeopleFilters = {
  search: "",
  departments: [],
  locations: [],
  statuses: [],
  levels: [],
  managers: [],
};

export function filterEmployees(employees: Employee[], filters: PeopleFilters): Employee[] {
  return employees.filter((e) => {
    if (filters.search) {
      const q = filters.search.toLowerCase();
      const match =
        e.name.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.team.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.skills.some((s) => s.toLowerCase().includes(q));
      if (!match) return false;
    }
    if (filters.departments.length > 0 && !filters.departments.includes(e.department)) return false;
    if (filters.locations.length > 0 && !filters.locations.includes(e.location)) return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(e.status)) return false;
    if (filters.levels.length > 0 && !filters.levels.includes(e.level)) return false;
    if (filters.managers.length > 0 && !filters.managers.includes(e.manager ?? "")) return false;
    return true;
  });
}

export function sortEmployees(employees: Employee[], sortBy: string): Employee[] {
  const sorted = [...employees];
  switch (sortBy) {
    case "name-az":
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-za":
      sorted.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "department":
      sorted.sort((a, b) => a.department.localeCompare(b.department));
      break;
    case "newest":
      sorted.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      break;
    case "oldest":
      sorted.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      break;
    case "tenure":
      sorted.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      break;
    default:
      sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  return sorted;
}
