/* ================================================================
   O2S Settings / People & HR — Types & Mock Data
   ================================================================ */

export type PeopleHRTab = "profiles" | "orgStructure" | "leave" | "compensation" | "onboarding" | "offboarding" | "documents" | "selfService";

export const PEOPLE_HR_TABS: { key: PeopleHRTab; label: string }[] = [
  { key: "profiles", label: "Employee Profiles" },
  { key: "orgStructure", label: "Org Structure" },
  { key: "leave", label: "Leave & Time Off" },
  { key: "compensation", label: "Compensation" },
  { key: "onboarding", label: "Onboarding" },
  { key: "offboarding", label: "Offboarding" },
  { key: "documents", label: "Documents & Compliance" },
  { key: "selfService", label: "Employee Self-Service" },
];

/* ── Employee Profile Fields ── */

export interface ProfileField {
  name: string;
  type: string;
  required: boolean;
  visible: boolean;
  locked?: boolean;
}

export const STANDARD_FIELDS: ProfileField[] = [
  { name: "Full Name", type: "Text", required: true, visible: true, locked: true },
  { name: "Email (Work)", type: "Email", required: true, visible: true, locked: true },
  { name: "Email (Personal)", type: "Email", required: false, visible: false },
  { name: "Phone (Work)", type: "Phone", required: false, visible: true },
  { name: "Phone (Personal)", type: "Phone", required: false, visible: false },
  { name: "Date of Birth", type: "Date", required: true, visible: false },
  { name: "Gender", type: "Select", required: false, visible: false },
  { name: "Nationality", type: "Select", required: false, visible: false },
  { name: "Address (Home)", type: "Address", required: false, visible: false },
  { name: "Emergency Contact", type: "Complex", required: true, visible: false },
  { name: "Job Title", type: "Text", required: true, visible: true, locked: true },
  { name: "Department", type: "Select", required: true, visible: true, locked: true },
  { name: "Level / Band", type: "Select", required: true, visible: true },
  { name: "Manager", type: "Relation", required: true, visible: true, locked: true },
  { name: "Employment Type", type: "Select", required: true, visible: true },
  { name: "Start Date", type: "Date", required: true, visible: true, locked: true },
  { name: "Work Location", type: "Select", required: true, visible: true },
  { name: "Remote Status", type: "Select", required: false, visible: true },
  { name: "Pronouns", type: "Text", required: false, visible: true },
  { name: "Bio / About", type: "LongText", required: false, visible: true },
  { name: "Profile Photo", type: "Image", required: false, visible: true },
  { name: "LinkedIn URL", type: "URL", required: false, visible: true },
  { name: "Skills", type: "Tags", required: false, visible: true },
];

export interface CustomField {
  name: string;
  type: string;
  section: string;
}

export const CUSTOM_FIELDS: CustomField[] = [
  { name: "T-Shirt Size", type: "Select", section: "Personal" },
  { name: "Dietary Preference", type: "Select", section: "Personal" },
  { name: "GitHub Username", type: "Text", section: "Work" },
  { name: "Employee ID", type: "Text", section: "Employment" },
  { name: "Cost Center", type: "Select", section: "Finance" },
  { name: "Badge Number", type: "Text", section: "Security" },
  { name: "Parking Spot", type: "Text", section: "Office" },
  { name: "Visa Expiry Date", type: "Date", section: "Compliance" },
];

export interface EmploymentType {
  name: string;
  colorClass: string;
  benefits: boolean;
  leave: string;
  count: number;
}

export const EMPLOYMENT_TYPES: EmploymentType[] = [
  { name: "Full-Time", colorClass: "bg-brand", benefits: true, leave: "Yes", count: 98 },
  { name: "Part-Time", colorClass: "bg-brand-teal", benefits: true, leave: "Pro-rata", count: 12 },
  { name: "Contractor", colorClass: "bg-warning", benefits: false, leave: "No", count: 22 },
  { name: "Intern", colorClass: "bg-brand-purple", benefits: false, leave: "Limited", count: 8 },
  { name: "Temporary", colorClass: "bg-destructive", benefits: false, leave: "Pro-rata", count: 2 },
];

/* ── Org Structure ── */

export interface Department {
  name: string;
  head: string;
  colorClass: string;
  employees: number;
  children?: { name: string; head: string; employees: number }[];
}

export const DEPARTMENTS: Department[] = [
  { name: "Engineering", head: "Arjun Mehta", colorClass: "bg-brand", employees: 40, children: [
    { name: "Frontend", head: "David Kim", employees: 12 },
    { name: "Backend", head: "Lisa Wang", employees: 15 },
    { name: "DevOps", head: "Tom Liu", employees: 8 },
    { name: "QA", head: "—", employees: 5 },
  ]},
  { name: "Product", head: "Meera Patel", colorClass: "bg-brand-purple", employees: 17, children: [
    { name: "Core Product", head: "Priya Sharma", employees: 8 },
    { name: "Growth", head: "—", employees: 5 },
    { name: "Design", head: "Ana Ruiz", employees: 4 },
  ]},
  { name: "Sales", head: "Lisa Wang", colorClass: "bg-success", employees: 20, children: [
    { name: "Enterprise", head: "Alex Johnson", employees: 8 },
    { name: "Mid-Market", head: "Maria Santos", employees: 7 },
    { name: "SDR", head: "—", employees: 5 },
  ]},
  { name: "Marketing", head: "—", colorClass: "bg-warning", employees: 15 },
  { name: "Operations", head: "—", colorClass: "bg-brand-teal", employees: 12 },
  { name: "Finance", head: "—", colorClass: "bg-destructive", employees: 8 },
  { name: "People / HR", head: "Meera Patel", colorClass: "bg-info", employees: 6 },
  { name: "Legal", head: "—", colorClass: "bg-muted-foreground", employees: 4 },
];

export interface Location {
  name: string;
  type: string;
  timezone: string;
  employees: number;
}

export const LOCATIONS: Location[] = [
  { name: "San Francisco HQ", type: "Office", timezone: "PT (UTC-8)", employees: 68 },
  { name: "New York Office", type: "Office", timezone: "ET (UTC-5)", employees: 32 },
  { name: "London Office", type: "Office", timezone: "GMT (UTC+0)", employees: 18 },
  { name: "Bangalore Office", type: "Office", timezone: "IST (UTC+5:30)", employees: 14 },
  { name: "Remote — US", type: "Remote", timezone: "Various", employees: 24 },
  { name: "Remote — EU", type: "Remote", timezone: "Various", employees: 8 },
  { name: "Remote — APAC", type: "Remote", timezone: "Various", employees: 4 },
];

/* ── Leave ── */

export interface LeaveType {
  name: string;
  colorClass: string;
  days: string;
  accrual: string;
  paid: boolean;
}

export const LEAVE_TYPES: LeaveType[] = [
  { name: "Annual Leave", colorClass: "bg-brand", days: "20", accrual: "Monthly", paid: true },
  { name: "Sick Leave", colorClass: "bg-destructive", days: "10", accrual: "Upfront", paid: true },
  { name: "Personal Day", colorClass: "bg-warning", days: "3", accrual: "Upfront", paid: true },
  { name: "Parental Leave", colorClass: "bg-brand-purple", days: "16 wk", accrual: "Eligible", paid: true },
  { name: "Bereavement", colorClass: "bg-muted-foreground", days: "5", accrual: "As needed", paid: true },
  { name: "Jury Duty", colorClass: "bg-muted-foreground", days: "10", accrual: "As needed", paid: true },
  { name: "Volunteer Day", colorClass: "bg-success", days: "2", accrual: "Upfront", paid: true },
  { name: "Unpaid Leave", colorClass: "bg-muted-foreground", days: "30", accrual: "As needed", paid: false },
  { name: "Sabbatical", colorClass: "bg-brand-teal", days: "30", accrual: "Milestone", paid: true },
  { name: "Mental Health Day", colorClass: "bg-info", days: "4", accrual: "Upfront", paid: true },
  { name: "Work From Home", colorClass: "bg-brand", days: "—", accrual: "Unlimited", paid: true },
];

export interface BlackoutPeriod {
  name: string;
  dates: string;
  appliesTo: string;
}

export const BLACKOUT_PERIODS: BlackoutPeriod[] = [
  { name: "Year-End Close", dates: "Dec 20 – Jan 5", appliesTo: "Finance" },
  { name: "Product Launch", dates: "Mar 15 – Mar 22", appliesTo: "Engineering" },
  { name: "Sales QE", dates: "Last week of quarter", appliesTo: "Sales" },
];

export interface HolidayCalendar {
  name: string;
  locations: string;
  days: number;
}

export const HOLIDAY_CALENDARS: HolidayCalendar[] = [
  { name: "US Federal", locations: "SF, NY, Remote-US", days: 11 },
  { name: "UK Bank Holidays", locations: "London", days: 8 },
  { name: "India Public", locations: "Bangalore", days: 14 },
  { name: "Company-Wide", locations: "All", days: 3 },
];

/* ── Compensation ── */

export interface PayBand {
  level: string;
  title: string;
  min: string;
  mid: string;
  max: string;
}

export const ENG_IC_PAY_BANDS: PayBand[] = [
  { level: "IC1", title: "Junior Eng.", min: "$85K", mid: "$100K", max: "$115K" },
  { level: "IC2", title: "Engineer", min: "$110K", mid: "$130K", max: "$150K" },
  { level: "IC3", title: "Senior Eng.", min: "$140K", mid: "$165K", max: "$190K" },
  { level: "IC4", title: "Staff Eng.", min: "$175K", mid: "$205K", max: "$235K" },
  { level: "IC5", title: "Principal", min: "$210K", mid: "$250K", max: "$290K" },
  { level: "IC6", title: "Distinguished", min: "$260K", mid: "$310K", max: "$360K" },
];

export const ENG_MGMT_PAY_BANDS: PayBand[] = [
  { level: "M1", title: "Eng. Manager", min: "$160K", mid: "$185K", max: "$210K" },
  { level: "M2", title: "Sr. EM", min: "$190K", mid: "$220K", max: "$250K" },
  { level: "M3", title: "Director", min: "$230K", mid: "$270K", max: "$310K" },
  { level: "M4", title: "VP Engineering", min: "$280K", mid: "$330K", max: "$380K" },
];

export interface EquityTier {
  level: string;
  range: string;
  vesting: string;
  refresh: string;
}

export const EQUITY_TIERS: EquityTier[] = [
  { level: "IC1", range: "1,000 – 3,000", vesting: "4yr/1cl", refresh: "—" },
  { level: "IC2", range: "3,000 – 8,000", vesting: "4yr/1cl", refresh: "Annual" },
  { level: "IC3", range: "8,000 – 15,000", vesting: "4yr/1cl", refresh: "Annual" },
  { level: "IC4", range: "15,000 – 30,000", vesting: "4yr/1cl", refresh: "Annual" },
  { level: "IC5", range: "30,000 – 60,000", vesting: "4yr/1cl", refresh: "Annual" },
  { level: "IC6", range: "60,000 – 100,000", vesting: "4yr/1cl", refresh: "Annual" },
  { level: "M1-M2", range: "10,000 – 25,000", vesting: "4yr/1cl", refresh: "Annual" },
  { level: "M3-M4", range: "25,000 – 80,000", vesting: "4yr/1cl", refresh: "Annual" },
];

export interface BenefitsPackage {
  name: string;
  eligible: string;
  cost: string;
  enrolled: number;
  items: string[];
}

export const BENEFITS_PACKAGES: BenefitsPackage[] = [
  { name: "Standard", eligible: "FT, PT", cost: "$450/mo", enrolled: 108, items: ["Medical (PPO)", "Dental", "Vision", "Life Ins.", "401(k) 4% match"] },
  { name: "Premium", eligible: "Directors+", cost: "$680/mo", enrolled: 12, items: ["All Standard +", "Executive Health Screening", "Financial Planning"] },
  { name: "Contractor", eligible: "Contractors", cost: "—", enrolled: 0, items: ["No benefits (stipend option: $500/mo)"] },
];

/* ── Onboarding Checklists ── */

export interface OnboardingChecklist {
  name: string;
  isDefault: boolean;
  tasks: number;
  categories: number;
  usedFor: string;
  avgCompletion: string;
  aiTasks: number;
}

export const ONBOARDING_CHECKLISTS: OnboardingChecklist[] = [
  { name: "General Onboarding", isDefault: true, tasks: 24, categories: 5, usedFor: "All roles", avgCompletion: "4.2 days", aiTasks: 8 },
  { name: "Engineering Onboarding", isDefault: false, tasks: 32, categories: 7, usedFor: "Eng roles only", avgCompletion: "6.8 days", aiTasks: 12 },
  { name: "Sales Onboarding", isDefault: false, tasks: 28, categories: 6, usedFor: "Sales roles only", avgCompletion: "5.5 days", aiTasks: 10 },
  { name: "Executive Onboarding", isDefault: false, tasks: 18, categories: 4, usedFor: "Director+ only", avgCompletion: "3.0 days", aiTasks: 5 },
];

/* ── Offboarding ── */

export interface TerminationType {
  type: string;
  noticePeriod: string;
  checklist: string;
  payout: string;
}

export const TERMINATION_TYPES: TerminationType[] = [
  { type: "Voluntary Resignation", noticePeriod: "Per contract", checklist: "Standard", payout: "PTO" },
  { type: "Involuntary Termination", noticePeriod: "Immediate", checklist: "Expedited", payout: "PTO" },
  { type: "Mutual Separation", noticePeriod: "Negotiated", checklist: "Standard", payout: "Custom" },
  { type: "Contract End", noticePeriod: "Per SOW", checklist: "Contractor", payout: "—" },
  { type: "Retirement", noticePeriod: "60 days", checklist: "Extended", payout: "Full" },
  { type: "Reduction in Force", noticePeriod: "30 days", checklist: "Standard", payout: "Severance" },
];

/* ── Document Templates ── */

export interface DocTemplate {
  name: string;
  category: string;
  eSign: boolean;
  used: number;
}

export const DOCUMENT_TEMPLATES: DocTemplate[] = [
  { name: "Employment Agreement", category: "Employment", eSign: true, used: 42 },
  { name: "NDA", category: "Legal", eSign: true, used: 38 },
  { name: "Employee Handbook", category: "Policies", eSign: false, used: 142 },
  { name: "IP Assignment", category: "Legal", eSign: true, used: 42 },
  { name: "Benefits Enrollment", category: "Benefits", eSign: false, used: 108 },
  { name: "Equipment Agreement", category: "IT", eSign: true, used: 35 },
  { name: "Remote Work Policy", category: "Policies", eSign: true, used: 24 },
  { name: "Stock Option Grant", category: "Equity", eSign: true, used: 38 },
  { name: "PIP Template", category: "Performance", eSign: false, used: 3 },
  { name: "Separation Agreement", category: "Legal", eSign: true, used: 5 },
];

export const DOC_CATEGORIES = ["Employment", "Legal", "Policies", "Benefits", "IT", "Equity", "Performance", "Compliance"];
