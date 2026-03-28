/* ================================================================
   O2S Settings / Billing — Shared Types, Mock Data & Helpers
   ================================================================ */

/* ── Types ── */

export interface Plan {
  name: string;
  tier: "starter" | "professional" | "enterprise";
  priceAnnual: number;
  priceMonthly: number;
  current?: boolean;
  badge?: string;
  features: Record<string, string | number | boolean>;
}

export interface UsageMeter {
  id: string;
  label: string;
  icon: string;
  current: number;
  limit: number;
  unit: string;
  percentage: number;
  trend: { value: number; label: string; direction: "up" | "down" };
  subtext: string;
  actionLabel: string;
}

export interface Invoice {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "paid" | "draft" | "pending" | "overdue";
  paidDate: string | null;
}

export interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex";
  last4: string;
  expiry: string;
  name: string;
  isDefault: boolean;
  expiryWarning: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  icon: string;
  description: string;
  price: number;
  billingCycle: string;
  active: boolean;
  includedIn: string | null;
}

export interface SeatChange {
  date: string;
  action: string;
  employee: string | null;
  reason: string;
  totalAfter: number;
}

/* ── Settings Sidebar Config ── */

export interface SettingsNavItem {
  label: string;
  href: string;
  icon: string;
}

export interface SettingsNavGroup {
  label: string;
  items: SettingsNavItem[];
}

export const SETTINGS_NAV: SettingsNavGroup[] = [
  {
    label: "Organization",
    items: [
      { label: "Organization Profile", href: "/settings/org", icon: "Building2" },
      { label: "Users & Roles", href: "/settings/users", icon: "Users" },
      { label: "Billing & Subscription", href: "/settings/billing", icon: "CreditCard" },
      { label: "Integrations", href: "/settings/integrations", icon: "Plug" },
    ],
  },
  {
    label: "Platform",
    items: [
      { label: "AI & Agents", href: "/settings/ai", icon: "Sparkles" },
      { label: "Security & Compliance", href: "/settings/security", icon: "Shield" },
      { label: "Hiring Settings", href: "/settings/hiring", icon: "Briefcase" },
      { label: "Performance & Appraisals", href: "/settings/performance", icon: "BarChart3" },
      { label: "People & HR", href: "/settings/people", icon: "UserCircle" },
      { label: "Notifications", href: "/settings/notifications", icon: "Bell" },
    ],
  },
  {
    label: "Developer",
    items: [
      { label: "Data & Import/Export", href: "/settings/data", icon: "Database" },
      { label: "API & Webhooks", href: "/settings/api", icon: "Code" },
      { label: "Customization", href: "/settings/custom", icon: "Palette" },
    ],
  },
];

/* ── Current Plan ── */

export const CURRENT_PLAN = {
  name: "Professional",
  tier: "professional" as const,
  pricePerEmployee: 18.0,
  priceMonthly: 22.0,
  billingCycle: "annual" as const,
  annualDiscount: 20,
  annualSavings: 6134.4,
  activeEmployees: 142,
  monthlyTotal: 2556.0,
  annualTotal: 30672.0,
  billingPeriod: { start: "Jan 1, 2026", end: "Dec 31, 2026" },
  nextInvoice: { date: "Apr 1, 2026", estimatedAmount: 2556.0 },
  renewalDate: "Jan 1, 2027",
  autoRenew: true,
};

/* ── Usage Meters ── */

export const USAGE_METERS: UsageMeter[] = [
  { id: "employees", label: "Active Employees", icon: "Users", current: 142, limit: 200, unit: "seats", percentage: 71, trend: { value: 12, label: "+12 this quarter", direction: "up" }, subtext: "58 seats remaining", actionLabel: "Add Seats" },
  { id: "aiActions", label: "AI Agent Actions", icon: "Zap", current: 8240, limit: 15000, unit: "actions", percentage: 54.9, trend: { value: 2100, label: "+2,100 vs last month", direction: "up" }, subtext: "Resets Apr 1, 2026", actionLabel: "View Details" },
  { id: "storage", label: "Storage", icon: "HardDrive", current: 12.4, limit: 50, unit: "GB", percentage: 24.8, trend: { value: 2.1, label: "+2.1 GB this quarter", direction: "up" }, subtext: "37.6 GB remaining", actionLabel: "Manage Storage" },
  { id: "apiCalls", label: "API Calls (Monthly)", icon: "Code", current: 34500, limit: 100000, unit: "calls", percentage: 34.5, trend: { value: 8200, label: "+8,200 vs last month", direction: "up" }, subtext: "Resets Apr 1, 2026", actionLabel: "View API Usage" },
];

/* ── Plans ── */

export const PLANS: Plan[] = [
  {
    name: "Starter", tier: "starter", priceAnnual: 8, priceMonthly: 10,
    features: {
      employees: "Up to 50", jobs: "10 active", adminUsers: 3,
      careerPage: "Basic", customDomain: false,
      aiScreening: false, aiSourcing: false, aiJD: false,
      aiAnalytics: false, aiCompliance: false, customAI: false,
      agentActions: "—",
      storage: "5 GB", apiAccess: false, webhooks: false,
      dataExport: "CSV", dataRetention: "1 year",
      google: true, slack: false, linkedin: false, hris: false,
      sso: false, scim: false, customIntegrations: false,
      gdpr: "Basic", soc2: false, euAiAct: false,
      auditLog: "30 days", dataResidency: "US only",
      emailSupport: "48h", chatSupport: false, phoneSupport: false,
      csm: false, onboarding: "Self-serve", sla: "99.5%",
    },
  },
  {
    name: "Professional", tier: "professional", priceAnnual: 18, priceMonthly: 22,
    current: true, badge: "CURRENT PLAN",
    features: {
      employees: "Up to 500", jobs: "50 active", adminUsers: 15,
      careerPage: "Branded", customDomain: true,
      aiScreening: "15K/mo", aiSourcing: "Basic", aiJD: true,
      aiAnalytics: "Weekly", aiCompliance: false, customAI: false,
      agentActions: "15,000/mo",
      storage: "50 GB", apiAccess: "100K/mo", webhooks: "10",
      dataExport: "CSV + API", dataRetention: "3 years",
      google: true, slack: true, linkedin: true, hris: true,
      sso: false, scim: false, customIntegrations: false,
      gdpr: "Full", soc2: "Report access", euAiAct: false,
      auditLog: "1 year", dataResidency: "US or EU",
      emailSupport: "24h", chatSupport: "Business hrs", phoneSupport: false,
      csm: false, onboarding: "Guided", sla: "99.9%",
    },
  },
  {
    name: "Enterprise", tier: "enterprise", priceAnnual: 32, priceMonthly: 40,
    badge: "BEST FOR GROWING TEAMS",
    features: {
      employees: "Unlimited", jobs: "Unlimited", adminUsers: "Unlimited",
      careerPage: "White-label", customDomain: true,
      aiScreening: "Unlimited", aiSourcing: "Advanced", aiJD: true,
      aiAnalytics: "Real-time", aiCompliance: true, customAI: true,
      agentActions: "Unlimited",
      storage: "500 GB", apiAccess: "Unlimited", webhooks: "Unlimited",
      dataExport: "Full + Bulk", dataRetention: "7 years",
      google: true, slack: true, linkedin: true, hris: true,
      sso: true, scim: true, customIntegrations: true,
      gdpr: "Full + DPA", soc2: "Full + custom", euAiAct: "Full suite",
      auditLog: "7 years", dataResidency: "US, EU, IN",
      emailSupport: "4h", chatSupport: "24/7", phoneSupport: "Dedicated",
      csm: "Named CSM", onboarding: "White-glove", sla: "99.95% + BAA",
    },
  },
];

/* ── Feature Rows for Comparison Table ── */

export interface FeatureRow {
  key: string;
  label: string;
}

export interface FeatureGroup {
  label: string;
  rows: FeatureRow[];
}

export const FEATURE_GROUPS: FeatureGroup[] = [
  { label: "Core", rows: [
    { key: "employees", label: "Employees" }, { key: "jobs", label: "Jobs" },
    { key: "adminUsers", label: "Admin Users" }, { key: "careerPage", label: "Career Page" },
    { key: "customDomain", label: "Custom Domain" },
  ]},
  { label: "AI Agents", rows: [
    { key: "aiScreening", label: "AI Screening" }, { key: "aiSourcing", label: "AI Sourcing" },
    { key: "aiJD", label: "AI JD Generator" }, { key: "aiAnalytics", label: "AI Analytics" },
    { key: "aiCompliance", label: "AI Compliance" }, { key: "customAI", label: "Custom AI Rules" },
    { key: "agentActions", label: "Agent Actions" },
  ]},
  { label: "Data", rows: [
    { key: "storage", label: "Storage" }, { key: "apiAccess", label: "API Access" },
    { key: "webhooks", label: "Webhooks" }, { key: "dataExport", label: "Data Export" },
    { key: "dataRetention", label: "Data Retention" },
  ]},
  { label: "Integrations", rows: [
    { key: "google", label: "Google / Microsoft" }, { key: "slack", label: "Slack" },
    { key: "linkedin", label: "LinkedIn Recruiter" }, { key: "hris", label: "HRIS Import" },
    { key: "sso", label: "SSO / SAML" }, { key: "scim", label: "SCIM" },
    { key: "customIntegrations", label: "Custom Integrations" },
  ]},
  { label: "Compliance", rows: [
    { key: "gdpr", label: "GDPR" }, { key: "soc2", label: "SOC 2" },
    { key: "euAiAct", label: "EU AI Act" }, { key: "auditLog", label: "Audit Log" },
    { key: "dataResidency", label: "Data Residency" },
  ]},
  { label: "Support", rows: [
    { key: "emailSupport", label: "Email Support" }, { key: "chatSupport", label: "Chat Support" },
    { key: "phoneSupport", label: "Phone Support" }, { key: "csm", label: "CSM" },
    { key: "onboarding", label: "Onboarding" }, { key: "sla", label: "SLA" },
  ]},
];

/* ── Add-Ons ── */

export const ADD_ONS: AddOn[] = [
  { id: "extraAI", name: "Extra AI Actions", icon: "Zap", description: "+10,000 AI agent actions per month", price: 99, billingCycle: "month", active: false, includedIn: null },
  { id: "security", name: "Advanced Security", icon: "Shield", description: "SSO, SCIM, IP allowlisting, advanced audit", price: 149, billingCycle: "month", active: false, includedIn: "enterprise" },
  { id: "reporting", name: "Custom Reporting", icon: "BarChart3", description: "Report builder + scheduled email delivery", price: 79, billingCycle: "month", active: false, includedIn: null },
  { id: "dataRegion", name: "India Data Region", icon: "Globe", description: "India data residency option", price: 49, billingCycle: "month", active: false, includedIn: "enterprise" },
  { id: "extraStorage", name: "Extra Storage", icon: "HardDrive", description: "+100 GB document and file storage", price: 29, billingCycle: "month", active: true, includedIn: null },
  { id: "prioritySupport", name: "Priority Support", icon: "Headphones", description: "4-hour response SLA + dedicated Slack channel", price: 199, billingCycle: "month", active: false, includedIn: "enterprise" },
];

/* ── Payment Methods ── */

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "pm1", type: "visa", last4: "6411", expiry: "08/2028", name: "Prashant Singh", isDefault: true, expiryWarning: false },
  { id: "pm2", type: "mastercard", last4: "2847", expiry: "03/2027", name: "Latent Bridge Pvt Ltd", isDefault: false, expiryWarning: true },
];

export const BILLING_INFO = {
  company: "Latent Bridge Pvt Ltd",
  address: "#42, 3rd Floor, Koramangala 4th Block",
  city: "Bangalore",
  state: "Karnataka",
  postalCode: "560034",
  country: "India",
  taxId: "29AABCL1234F1Z5",
  billingEmail: "billing@latentbridge.com",
};

/* ── Invoices ── */

export const INVOICES: Invoice[] = [
  { id: "INV-0042", date: "Apr 1, 2026", description: "Professional Plan (142 emp)", amount: 2556.0, status: "draft", paidDate: null },
  { id: "INV-0041", date: "Mar 1, 2026", description: "Professional Plan (140 emp)", amount: 2520.0, status: "paid", paidDate: "Mar 1" },
  { id: "INV-0040", date: "Feb 1, 2026", description: "Professional Plan (138 emp)", amount: 2484.0, status: "paid", paidDate: "Feb 1" },
  { id: "INV-0039", date: "Jan 1, 2026", description: "Professional Plan (136 emp)", amount: 2448.0, status: "paid", paidDate: "Jan 2" },
  { id: "INV-0038", date: "Jan 1, 2026", description: "Add-on: Extra AI Actions", amount: 99.0, status: "paid", paidDate: "Jan 2" },
  { id: "INV-0037", date: "Dec 1, 2025", description: "Professional Plan (133 emp)", amount: 2394.0, status: "paid", paidDate: "Dec 1" },
  { id: "INV-0036", date: "Nov 1, 2025", description: "Professional Plan (131 emp)", amount: 2358.0, status: "paid", paidDate: "Nov 1" },
];

/* ── Spending Trend ── */

export const SPENDING_TREND = [
  { month: "Apr", amount: 1944 }, { month: "May", amount: 2016 }, { month: "Jun", amount: 2088 },
  { month: "Jul", amount: 2124 }, { month: "Aug", amount: 2196 }, { month: "Sep", amount: 2268 },
  { month: "Oct", amount: 2304 }, { month: "Nov", amount: 2358 }, { month: "Dec", amount: 2394 },
  { month: "Jan", amount: 2547 }, { month: "Feb", amount: 2484 }, { month: "Mar", amount: 2556 },
];

/* ── Seat Management ── */

export const SEAT_MANAGEMENT = {
  active: 142,
  deactivated: 8,
  pendingInvites: 4,
  contractors: 6,
  contractorRate: 0.5,
  totalSeats: 149,
  limit: 200,
  autoScale: true,
  overageRate: 22.0,
};

export const SEAT_CHANGES: SeatChange[] = [
  { date: "Mar 24", action: "added", employee: "Maya Chen", reason: "onboarded", totalAfter: 142 },
  { date: "Mar 15", action: "added", employee: "Sam Wilson", reason: "onboarded", totalAfter: 141 },
  { date: "Mar 10", action: "removed", employee: "Rohit Saxena", reason: "offboarded", totalAfter: 140 },
  { date: "Feb 28", action: "limit_increase", employee: null, reason: "Manual increase by admin", totalAfter: 200 },
];

/* ── Helpers ── */

export function usageColor(pct: number): string {
  if (pct > 90) return "bg-destructive";
  if (pct > 70) return "bg-warning";
  return "bg-success";
}

export function usageTextColor(pct: number): string {
  if (pct > 90) return "text-destructive";
  if (pct > 70) return "text-warning";
  return "text-success";
}

export function invoiceStatusConfig(status: string): { dotClass: string; label: string } {
  switch (status) {
    case "paid": return { dotClass: "bg-success", label: "Paid" };
    case "draft": return { dotClass: "bg-muted-foreground", label: "Draft" };
    case "pending": return { dotClass: "bg-warning", label: "Pending" };
    case "overdue": return { dotClass: "bg-destructive", label: "Overdue" };
    default: return { dotClass: "bg-muted-foreground", label: status };
  }
}

export function planTierColor(tier: string): string {
  switch (tier) {
    case "starter": return "bg-brand";
    case "professional": return "bg-brand-purple";
    case "enterprise": return "bg-warning";
    default: return "bg-brand";
  }
}

export function planTierBorder(tier: string): string {
  switch (tier) {
    case "starter": return "border-t-brand";
    case "professional": return "border-t-brand-purple";
    case "enterprise": return "border-t-warning";
    default: return "border-t-brand";
  }
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function featureValue(val: string | number | boolean): { text: string; type: "check" | "cross" | "text" } {
  if (val === true) return { text: "", type: "check" };
  if (val === false) return { text: "", type: "cross" };
  return { text: String(val), type: "text" };
}
