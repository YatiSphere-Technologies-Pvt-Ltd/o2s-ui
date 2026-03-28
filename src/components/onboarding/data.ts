/* ================================================================
   O2S Organization Onboarding — Types & Mock Data
   ================================================================ */

export type OnboardingStep = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface StepConfig {
  step: OnboardingStep;
  title: string;
  subtitle: string;
  phase: "account" | "workspace" | "activation";
  skippable: boolean;
}

export const STEPS: StepConfig[] = [
  { step: 1, title: "Sign Up", subtitle: "Create your account", phase: "account", skippable: false },
  { step: 2, title: "Verify Email", subtitle: "Confirm your email address", phase: "account", skippable: false },
  { step: 3, title: "Company Profile", subtitle: "Tell us about your company", phase: "workspace", skippable: false },
  { step: 4, title: "Workspace", subtitle: "Customize your workspace", phase: "workspace", skippable: true },
  { step: 5, title: "Org Structure", subtitle: "Set up departments & locations", phase: "workspace", skippable: true },
  { step: 6, title: "Import People", subtitle: "Add your employee directory", phase: "workspace", skippable: true },
  { step: 7, title: "Integrations", subtitle: "Connect your tools", phase: "activation", skippable: true },
  { step: 8, title: "AI Agents", subtitle: "Configure AI autonomy", phase: "activation", skippable: true },
  { step: 9, title: "Invite Team", subtitle: "Bring your team onboard", phase: "activation", skippable: true },
  { step: 10, title: "Launch", subtitle: "You're ready to go", phase: "activation", skippable: false },
];

export const PHASES = [
  { key: "account", label: "Account", steps: [1, 2] },
  { key: "workspace", label: "Workspace Setup", steps: [3, 4, 5, 6] },
  { key: "activation", label: "Activation", steps: [7, 8, 9, 10] },
];

/* ── Step 3: Industry & Size Options ── */

export const INDUSTRIES = [
  "Technology", "Healthcare", "Finance & Banking", "Education", "Manufacturing",
  "Retail & E-Commerce", "Media & Entertainment", "Government", "Non-Profit",
  "Professional Services", "Real Estate", "Energy", "Transportation", "Hospitality", "Legal", "Other",
];

export const COMPANY_SIZES = [
  { value: "1-10", label: "1–10", plan: "Starter" },
  { value: "11-50", label: "11–50", plan: "Starter" },
  { value: "51-200", label: "51–200", plan: "Professional" },
  { value: "201-500", label: "201–500", plan: "Professional" },
  { value: "501-1000", label: "501–1,000", plan: "Enterprise" },
  { value: "1001-5000", label: "1,001–5,000", plan: "Enterprise" },
  { value: "5000+", label: "5,000+", plan: "Enterprise" },
];

export const USE_CASES = [
  { id: "hiring", icon: "🎯", label: "Hiring & Recruiting" },
  { id: "people", icon: "👥", label: "People Management" },
  { id: "performance", icon: "📊", label: "Performance Reviews" },
  { id: "ai", icon: "🤖", label: "AI Automation" },
  { id: "compliance", icon: "📋", label: "Compliance" },
  { id: "allinone", icon: "🔄", label: "All-in-One" },
];

/* ── Step 5: Default Templates ── */

export const TECH_DEPARTMENTS = [
  { name: "Engineering", children: ["Frontend", "Backend", "DevOps", "QA"] },
  { name: "Product", children: ["Design", "PM", "Research"] },
  { name: "People & HR", children: [] },
  { name: "Sales", children: ["Enterprise", "Mid-Market", "SDR"] },
  { name: "Marketing", children: ["Content", "Growth", "Brand"] },
  { name: "Finance", children: [] },
];

export const DEFAULT_LOCATIONS = [
  { city: "San Francisco", country: "US", type: "Headquarters" as const },
  { city: "Remote", country: "—", type: "Remote" as const },
];

/* ── Step 6: CSV Fields ── */

export const CSV_COLUMN_MAP = [
  { source: "Full Name", target: "Employee Name", status: "mapped" as const },
  { source: "Email", target: "Work Email", status: "mapped" as const },
  { source: "Dept", target: "Department", status: "mapped" as const },
  { source: "Start Date", target: "Hire Date", status: "mapped" as const },
  { source: "Manager", target: "Reports To", status: "review" as const },
  { source: "emp_id", target: "Employee ID", status: "auto" as const },
  { source: "Salary", target: "Skip", status: "skipped" as const },
];

export const CSV_PREVIEW = [
  { name: "Sarah Chen", email: "sarah@acme.com", dept: "Engineering" },
  { name: "Alex Rivera", email: "alex@acme.com", dept: "Product" },
  { name: "Maria Santos", email: "maria@acme.com", dept: "Sales" },
  { name: "Tom Liu", email: "tom@acme.com", dept: "Engineering" },
  { name: "Priya Sharma", email: "priya@acme.com", dept: "Engineering" },
];

/* ── Step 7: Recommended Integrations ── */

export const RECOMMENDED_INTEGRATIONS = [
  { id: "google", name: "Google Workspace", logoInitial: "G", logoColor: "#4285F4" },
  { id: "slack", name: "Slack", logoInitial: "S", logoColor: "#E01E5A" },
  { id: "jira", name: "Jira", logoInitial: "J", logoColor: "#0052CC" },
  { id: "github", name: "GitHub", logoInitial: "G", logoColor: "#6e7681" },
];

export const MORE_INTEGRATIONS = [
  { category: "Communication", items: ["Microsoft Teams", "Zoom", "Gmail"] },
  { category: "Productivity", items: ["Notion", "Asana", "Linear", "Confluence"] },
  { category: "HR & Payroll", items: ["ADP", "Gusto", "BambooHR", "Paylocity"] },
  { category: "Identity & SSO", items: ["Okta", "Azure AD", "OneLogin"] },
  { category: "Developer", items: ["GitHub", "GitLab", "Bitbucket"] },
];

/* ── Step 8: AI Agents ── */

export interface AIAgentConfig {
  id: string;
  name: string;
  abbr: string;
  description: string;
  colorClass: string;
  bgClass: string;
  defaultAutonomy: string;
  enabled: boolean;
}

export const AI_AGENTS: AIAgentConfig[] = [
  { id: "recruiter", name: "Recruiter Agent", abbr: "Rec", description: "Screens candidates, schedules interviews, drafts offer letters", colorClass: "text-brand-purple", bgClass: "bg-brand-purple", defaultAutonomy: "Supervised", enabled: true },
  { id: "compliance", name: "Compliance Agent", abbr: "Cmp", description: "Monitors labor law changes, flags risks, updates policies", colorClass: "text-destructive", bgClass: "bg-destructive", defaultAutonomy: "Approval Required", enabled: true },
  { id: "analytics", name: "Analytics Agent", abbr: "Ana", description: "Generates reports, spots trends, predicts attrition", colorClass: "text-brand", bgClass: "bg-brand", defaultAutonomy: "Full Auto", enabled: true },
  { id: "onboarding", name: "Onboarding Agent", abbr: "Onb", description: "Creates checklists, provisions IT access, sends welcome emails", colorClass: "text-brand-teal", bgClass: "bg-brand-teal", defaultAutonomy: "Supervised", enabled: true },
  { id: "performance", name: "Performance Agent", abbr: "Prf", description: "Facilitates reviews, tracks goals, generates 360 feedback", colorClass: "text-warning", bgClass: "bg-warning", defaultAutonomy: "Manual", enabled: false },
  { id: "policy", name: "Policy Agent", abbr: "Pol", description: "Answers HR policy questions, maintains knowledge base", colorClass: "text-info", bgClass: "bg-info", defaultAutonomy: "Manual", enabled: false },
  { id: "orchestrator", name: "Orchestrator Agent", abbr: "Orc", description: "Coordinates between agents, routes tasks, manages priorities", colorClass: "text-success", bgClass: "bg-success", defaultAutonomy: "Full Auto", enabled: true },
];

export const AUTONOMY_PRESETS = [
  { id: "conservative", icon: "🛡️", label: "Conservative", description: "AI suggests, you decide. Best for regulated industries.", detail: "All agents require approval before acting." },
  { id: "balanced", icon: "⚖️", label: "Balanced", description: "AI acts on routine, you approve big decisions.", detail: "Recommended for most teams.", recommended: true },
  { id: "full", icon: "🚀", label: "Full AI", description: "AI handles everything, you review after.", detail: "Best for fast-moving startups." },
];

/* ── Step 9: Team Roles ── */

export const TEAM_ROLES = [
  { value: "admin", label: "Admin", description: "Full access to all settings and data" },
  { value: "hr_manager", label: "HR Manager", description: "Manage people, reviews, and compliance" },
  { value: "recruiter", label: "Recruiter", description: "Manage jobs, candidates, and hiring pipeline" },
  { value: "hiring_manager", label: "Hiring Manager", description: "Review candidates and approve offers for their roles" },
  { value: "viewer", label: "Viewer", description: "Read-only access to assigned areas" },
];

/* ── Step 10: Activation Checklist ── */

export const ACTIVATION_CHECKLIST = [
  { id: "ac1", label: "Company profile configured", completed: true },
  { id: "ac2", label: "Workspace branded", completed: true },
  { id: "ac3", label: "Departments set up", completed: true },
  { id: "ac4", label: "Employees imported", completed: true },
  { id: "ac5", label: "2 integrations connected", completed: true },
  { id: "ac6", label: "AI agents configured", completed: true },
  { id: "ac7", label: "Team invited", completed: true },
  { id: "ac8", label: "Post your first job", completed: false },
  { id: "ac9", label: "Run your first AI screening", completed: false },
  { id: "ac10", label: "Complete a performance review cycle", completed: false },
];

/* ── Brand Color Presets ── */

export const BRAND_COLORS = [
  "#3B82F6", "#8B5CF6", "#14B8A6", "#10B981",
  "#6366F1", "#F43F5E", "#F59E0B", "#64748B",
];
