/* ================================================================
   O2S User Profile — Types & Mock Data
   ================================================================ */

export type ProfileTab = "overview" | "preferences" | "security" | "activity" | "notifications";

export const PROFILE_TABS: { key: ProfileTab; label: string }[] = [
  { key: "overview", label: "Profile" },
  { key: "preferences", label: "Preferences" },
  { key: "security", label: "Security" },
  { key: "activity", label: "Activity" },
  { key: "notifications", label: "Notifications" },
];

/* ── User Profile ── */

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  initials: string;
  email: string;
  phone: string;
  role: string;
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

export interface NotificationCategory {
  category: string;
  items: { label: string; email: boolean; inApp: boolean; slack: boolean }[];
}

export const NOTIFICATION_PREFS: NotificationCategory[] = [
  { category: "Hiring & Recruiting", items: [
    { label: "New candidate application", email: true, inApp: true, slack: true },
    { label: "Interview scheduled/changed", email: true, inApp: true, slack: true },
    { label: "Scorecard submitted", email: true, inApp: true, slack: false },
    { label: "Offer accepted/declined", email: true, inApp: true, slack: true },
    { label: "Requisition approval needed", email: true, inApp: true, slack: true },
    { label: "AI screening completed", email: false, inApp: true, slack: false },
  ]},
  { category: "People & HR", items: [
    { label: "Leave request submitted", email: true, inApp: true, slack: false },
    { label: "Performance review due", email: true, inApp: true, slack: false },
    { label: "Employee milestone (anniversary)", email: true, inApp: true, slack: true },
    { label: "Onboarding task assigned", email: true, inApp: true, slack: false },
  ]},
  { category: "System & AI", items: [
    { label: "AI agent error", email: true, inApp: true, slack: true },
    { label: "AI agent action completed", email: false, inApp: true, slack: false },
    { label: "Usage limit approaching", email: true, inApp: true, slack: false },
    { label: "Security alert", email: true, inApp: true, slack: true },
    { label: "Weekly digest", email: true, inApp: false, slack: false },
  ]},
];
