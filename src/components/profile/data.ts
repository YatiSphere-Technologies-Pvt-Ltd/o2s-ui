/* ================================================================
   O2S User Profile — Types & Mock Data
   ================================================================ */

export type ProfileTab = "overview" | "preferences" | "security" | "activity" | "notifications" | "privacy";

export const PROFILE_TABS: { key: ProfileTab; label: string }[] = [
  { key: "overview", label: "Profile" },
  { key: "preferences", label: "Preferences" },
  { key: "security", label: "Security" },
  { key: "privacy", label: "Privacy & Consent" },
  { key: "activity", label: "Activity" },
  { key: "notifications", label: "Notifications" },
];

/* ── Roles / Personas ── */

export type Role = "employee" | "manager" | "hr" | "admin";

export const ROLE_META: Record<Role, { label: string; description: string; accent: string }> = {
  employee: { label: "Employee", description: "Your personal workspace", accent: "text-brand-teal" },
  manager:  { label: "Manager",  description: "Your team & approvals",   accent: "text-warning" },
  hr:       { label: "HR / People Ops", description: "Org-wide people operations", accent: "text-brand-purple" },
  admin:    { label: "Admin",    description: "Platform configuration",  accent: "text-destructive" },
};

export const TENANT_NAME = "Latent Bridge";
export const FISCAL_PERIOD = "FY2026 Q2";

/* ── User Profile ── */

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  email: string;
  phone: string;
  /** Display label (kept for legacy UI). Source of truth for capability is `roles`. */
  role: string;
  /** All hats this user wears. */
  roles: Role[];
  /** Default role to switch into on first load. */
  defaultRole: Role;
  department: string;
  team: string;
  location: string;
  timezone: string;
  joinedDate: string;
  title: string;
  bio: string;
  linkedIn: string;
  pronouns: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
  theme: string;
  avatarColor: string;
}

export const CURRENT_USER: UserProfile = {
  id: "u-001",
  firstName: "Prashant",
  lastName: "Singh",
  initials: "PS",
  email: "prashant@latentbridge.com",
  phone: "+91 98765 00000",
  role: "Owner",
  roles: ["employee", "manager", "hr", "admin"],
  defaultRole: "admin",
  department: "Engineering",
  team: "Executive",
  location: "Bangalore, India",
  timezone: "Asia/Kolkata (IST, UTC+5:30)",
  joinedDate: "January 1, 2026",
  title: "CEO & Founder",
  bio: "Building O2S — the AI-native Organization Operating System. Previously VP Engineering at a fintech unicorn. Passionate about using AI to transform how organizations operate.",
  linkedIn: "linkedin.com/in/prashantsingh",
  pronouns: "He/Him",
  language: "English",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "12-hour",
  theme: "Dark",
  avatarColor: "bg-brand-purple",
};

/* ── Security ── */

export interface SecuritySession {
  id: string;
  device: string;
  browser: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  ip: string;
}

export const SESSIONS: SecuritySession[] = [
  { id: "s1", device: "MacBook Pro", browser: "Chrome 122", location: "Bangalore, India", lastActive: "Active now", isCurrent: true, ip: "103.xx.xx.42" },
  { id: "s2", device: "iPhone 15 Pro", browser: "Safari Mobile", location: "Bangalore, India", lastActive: "2 hours ago", isCurrent: false, ip: "103.xx.xx.42" },
  { id: "s3", device: "Windows Desktop", browser: "Edge 122", location: "Mumbai, India", lastActive: "3 days ago", isCurrent: false, ip: "49.xx.xx.18" },
];

export const SECURITY_INFO = {
  authMethod: "SSO (Google Workspace)",
  mfaEnabled: true,
  mfaMethod: "Authenticator App (TOTP)",
  lastPasswordChange: "February 15, 2026",
  passwordExpiry: "Never (SSO managed)",
  loginHistory: [
    { date: "Today, 9:14 AM", method: "SSO", device: "Chrome / MacBook", location: "Bangalore", status: "success" },
    { date: "Yesterday, 8:45 AM", method: "SSO", device: "Chrome / MacBook", location: "Bangalore", status: "success" },
    { date: "Mar 24, 2:30 PM", method: "SSO", device: "Safari / iPhone", location: "Bangalore", status: "success" },
    { date: "Mar 23, 10:00 AM", method: "SSO", device: "Chrome / MacBook", location: "Mumbai", status: "success" },
    { date: "Mar 20, 6:15 PM", method: "SSO", device: "Edge / Windows", location: "Mumbai", status: "success" },
  ],
};

/* ── Activity ── */

export interface ActivityItem {
  id: string;
  action: string;
  detail: string;
  timestamp: string;
  type: "settings" | "hiring" | "people" | "review" | "login" | "ai";
}

export const USER_ACTIVITY: ActivityItem[] = [
  { id: "a1", action: "Approved requisition", detail: "REQ-2026-013: HR Business Partner", timestamp: "Today, 11:30 AM", type: "hiring" },
  { id: "a2", action: "Updated AI agent config", detail: "Changed Recruiter Agent autonomy to Supervised", timestamp: "Today, 10:15 AM", type: "ai" },
  { id: "a3", action: "Logged in via SSO", detail: "Chrome / MacBook Pro / Bangalore", timestamp: "Today, 9:14 AM", type: "login" },
  { id: "a4", action: "Submitted performance review", detail: "Sarah Chen — H1 2026 Annual Review", timestamp: "Yesterday, 4:30 PM", type: "review" },
  { id: "a5", action: "Created requisition", detail: "REQ-2026-015: Marketing Manager", timestamp: "Yesterday, 2:00 PM", type: "hiring" },
  { id: "a6", action: "Approved offer", detail: "Marcus Johnson — Senior Backend Engineer", timestamp: "Mar 24, 3:45 PM", type: "hiring" },
  { id: "a7", action: "Updated billing info", detail: "Changed payment method to Visa ending 6411", timestamp: "Mar 23, 11:00 AM", type: "settings" },
  { id: "a8", action: "Invited user", detail: "sam@acme.com as Manager (Sales)", timestamp: "Mar 22, 10:30 AM", type: "people" },
  { id: "a9", action: "Exported analytics report", detail: "Q1 2026 Hiring Pipeline Report (PDF)", timestamp: "Mar 21, 5:15 PM", type: "review" },
  { id: "a10", action: "Changed org settings", detail: "Updated company name to Latent Bridge Pvt Ltd", timestamp: "Mar 20, 9:00 AM", type: "settings" },
];

export const ACTIVITY_TYPE_CONFIG: Record<string, { icon: string; colorClass: string }> = {
  settings: { icon: "⚙️", colorClass: "text-muted-foreground" },
  hiring: { icon: "💼", colorClass: "text-brand-purple" },
  people: { icon: "👤", colorClass: "text-brand-teal" },
  review: { icon: "📊", colorClass: "text-brand" },
  login: { icon: "🔑", colorClass: "text-success" },
  ai: { icon: "🤖", colorClass: "text-brand-purple" },
};

/* ── Notification Preferences ── */

export type NotificationChannelKey = "email" | "inApp" | "slack" | "teams" | "sms" | "whatsapp";

export const NOTIFICATION_CHANNELS: { key: NotificationChannelKey; label: string }[] = [
  { key: "email",    label: "Email" },
  { key: "inApp",    label: "In-App" },
  { key: "slack",    label: "Slack" },
  { key: "teams",    label: "Teams" },
  { key: "sms",      label: "SMS" },
  { key: "whatsapp", label: "WhatsApp" },
];

export interface NotificationItem {
  label: string;
  email: boolean;
  inApp: boolean;
  slack: boolean;
  teams: boolean;
  sms: boolean;
  whatsapp: boolean;
}

export interface NotificationCategory {
  category: string;
  items: NotificationItem[];
}

const N = (label: string, mask: Partial<Omit<NotificationItem, "label">> = {}): NotificationItem => ({
  label,
  email: mask.email ?? true,
  inApp: mask.inApp ?? true,
  slack: mask.slack ?? false,
  teams: mask.teams ?? false,
  sms:   mask.sms   ?? false,
  whatsapp: mask.whatsapp ?? false,
});

export const NOTIFICATION_PREFS: NotificationCategory[] = [
  { category: "Hiring & Recruiting", items: [
    N("New candidate application", { slack: true }),
    N("Interview scheduled/changed", { slack: true, teams: true }),
    N("Scorecard submitted"),
    N("Offer accepted/declined", { slack: true }),
    N("Requisition approval needed", { slack: true, sms: true }),
    N("AI screening completed", { email: false }),
  ]},
  { category: "People & HR", items: [
    N("Leave request submitted", { teams: true }),
    N("Leave decision (approved/rejected)", { whatsapp: true }),
    N("Performance review due"),
    N("Employee milestone (anniversary)", { slack: true }),
    N("Onboarding task assigned"),
  ]},
  { category: "System & AI", items: [
    N("AI agent error", { slack: true, sms: true }),
    N("AI agent action completed", { email: false }),
    N("Usage limit approaching"),
    N("Security alert", { slack: true, sms: true, whatsapp: true }),
    N("Weekly digest", { inApp: false }),
  ]},
];

export interface QuietHours {
  enabled: boolean;
  start: string; // HH:MM
  end: string;
  weekendsAllDay: boolean;
}

export const DEFAULT_QUIET_HOURS: QuietHours = {
  enabled: true,
  start: "20:00",
  end: "08:00",
  weekendsAllDay: true,
};

/* ── Delegates (for routing questions/asks to specific people by topic) ── */

export interface Delegate {
  topic: string;
  personName: string;
  personInitials: string;
  personRole: string;
}

export const DEFAULT_DELEGATES: Delegate[] = [
  { topic: "Engineering questions", personName: "Meera Krishnan",  personInitials: "MK", personRole: "VP Engineering" },
  { topic: "Operations",            personName: "Anil Sharma",     personInitials: "AS", personRole: "Head of Ops" },
  { topic: "People & HR",           personName: "Priya Desai",     personInitials: "PD", personRole: "People Ops Lead" },
];

/* ── Consent (data handling + agent autonomy) ── */

export type AgentAutonomy = "Manual" | "Supervised" | "Autonomous";

export interface ConsentPrefs {
  shareMedicalLeaveDetails: boolean;       // share medical/sick-leave reason details with manager
  storeHealthDocs: boolean;                // allow platform to retain uploaded medical documents
  agentAutonomy: AgentAutonomy;            // how much initiative agents can take
  agentMayContactColleagues: boolean;      // agents may message colleagues on user's behalf
  shareWellbeingSignals: boolean;          // include in wellbeing/burnout aggregates
}

export const DEFAULT_CONSENT: ConsentPrefs = {
  shareMedicalLeaveDetails: false,
  storeHealthDocs: false,
  agentAutonomy: "Supervised",
  agentMayContactColleagues: false,
  shareWellbeingSignals: true,
};
