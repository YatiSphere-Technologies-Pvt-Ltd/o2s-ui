/* ================================================================
   O2S Settings / Users & Roles (IAM) — Types & Mock Data
   ================================================================ */

export type UsersTab = "members" | "roles" | "permissions" | "sso" | "activity";

export const USERS_TABS: { key: UsersTab; label: string; count?: number }[] = [
  { key: "members", label: "Members", count: 18 },
  { key: "roles", label: "Roles", count: 8 },
  { key: "permissions", label: "Permissions Matrix" },
  { key: "sso", label: "SSO & Auth" },
  { key: "activity", label: "Activity Log" },
];

/* ── Members ── */

export interface Member {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  roleColorClass: string;
  department: string;
  authMethod: string;
  hasSso: boolean;
  hasMfa: boolean;
  status: "active" | "pending" | "deactivated" | "suspended";
  lastActive: string;
  joinedDate?: string;
  invitedDate?: string;
  deactivatedDate?: string;
  deactivatedBy?: string;
  isOwner?: boolean;
}

export const MEMBERS: Member[] = [
  { id: "u1", name: "Prashant Singh", email: "prashant@acme.com", initials: "PS", role: "Owner", roleColorClass: "bg-warning text-background", department: "Engineering", authMethod: "SSO+MFA", hasSso: true, hasMfa: true, status: "active", lastActive: "2 min ago", joinedDate: "Jan 1, 2026", isOwner: true },
  { id: "u2", name: "Sarah Chen", email: "sarah@acme.com", initials: "SC", role: "Admin", roleColorClass: "bg-brand-purple text-white", department: "Engineering", authMethod: "SSO+MFA", hasSso: true, hasMfa: true, status: "active", lastActive: "1 hr ago", joinedDate: "Jan 15, 2026" },
  { id: "u3", name: "Alex Rivera", email: "alex@acme.com", initials: "AR", role: "HR Lead", roleColorClass: "bg-brand text-white", department: "People & HR", authMethod: "SSO+MFA", hasSso: true, hasMfa: true, status: "active", lastActive: "35 min ago", joinedDate: "Feb 1, 2026" },
  { id: "u4", name: "Meera Patel", email: "meera@acme.com", initials: "MP", role: "HR Manager", roleColorClass: "bg-brand-teal text-white", department: "People & HR", authMethod: "SSO+MFA", hasSso: true, hasMfa: true, status: "active", lastActive: "4 hrs ago", joinedDate: "Feb 1, 2026" },
  { id: "u5", name: "Jordan Park", email: "jordan@acme.com", initials: "JP", role: "Recruiter", roleColorClass: "bg-destructive/80 text-white", department: "People & HR", authMethod: "Email+MFA", hasSso: false, hasMfa: true, status: "active", lastActive: "3 hrs ago", joinedDate: "Feb 15, 2026" },
  { id: "u6", name: "Maya Santos", email: "maya@acme.com", initials: "MS", role: "Recruiter", roleColorClass: "bg-destructive/80 text-white", department: "People & HR", authMethod: "SSO", hasSso: true, hasMfa: false, status: "active", lastActive: "1 day ago", joinedDate: "Mar 1, 2026" },
  { id: "u7", name: "David Kim", email: "david@acme.com", initials: "DK", role: "Manager", roleColorClass: "bg-success text-white", department: "Engineering", authMethod: "SSO+MFA", hasSso: true, hasMfa: true, status: "active", lastActive: "2 hrs ago", joinedDate: "Jan 20, 2026" },
  { id: "u8", name: "Lisa Wang", email: "lisa@acme.com", initials: "LW", role: "Manager", roleColorClass: "bg-success text-white", department: "Product", authMethod: "SSO+MFA", hasSso: true, hasMfa: true, status: "active", lastActive: "6 hrs ago", joinedDate: "Feb 1, 2026" },
  { id: "u9", name: "Arjun Mehta", email: "arjun@acme.com", initials: "AM", role: "Manager", roleColorClass: "bg-success text-white", department: "Engineering", authMethod: "SSO", hasSso: true, hasMfa: false, status: "active", lastActive: "Yesterday", joinedDate: "Jan 20, 2026" },
  { id: "u10", name: "Tom Liu", email: "tom@acme.com", initials: "TL", role: "Manager", roleColorClass: "bg-success text-white", department: "Engineering", authMethod: "SSO+MFA", hasSso: true, hasMfa: true, status: "active", lastActive: "3 hrs ago", joinedDate: "Feb 10, 2026" },
  { id: "u11", name: "Raj Krishnamurthy", email: "raj@acme.com", initials: "RK", role: "Manager", roleColorClass: "bg-success text-white", department: "Sales", authMethod: "SSO+MFA", hasSso: true, hasMfa: true, status: "active", lastActive: "Yesterday", joinedDate: "Feb 15, 2026" },
  { id: "u12", name: "Ana Ruiz", email: "ana@acme.com", initials: "AR", role: "Recruiter", roleColorClass: "bg-destructive/80 text-white", department: "People & HR", authMethod: "SSO+MFA", hasSso: true, hasMfa: true, status: "active", lastActive: "5 hrs ago", joinedDate: "Mar 1, 2026" },
  { id: "u13", name: "Chris Wong", email: "chris@acme.com", initials: "CW", role: "Viewer", roleColorClass: "bg-muted-foreground/30 text-muted-foreground", department: "—", authMethod: "Email", hasSso: false, hasMfa: false, status: "active", lastActive: "5 days ago", joinedDate: "Mar 10, 2026" },
  { id: "u14", name: "Priya Sharma", email: "priya@acme.com", initials: "PS", role: "Recruiter", roleColorClass: "bg-destructive/80 text-white", department: "People & HR", authMethod: "SSO+MFA", hasSso: true, hasMfa: true, status: "active", lastActive: "1 hr ago", joinedDate: "Feb 20, 2026" },
  { id: "u15", name: "Mike Johnson", email: "mike@acme.com", initials: "MJ", role: "Comp Analyst", roleColorClass: "bg-info text-white", department: "Finance", authMethod: "SSO+MFA", hasSso: true, hasMfa: true, status: "active", lastActive: "3 hrs ago", joinedDate: "Mar 1, 2026" },
  // Pending
  { id: "u16", name: "", email: "lisa.new@acme.com", initials: "LN", role: "HR Manager", roleColorClass: "bg-brand-teal text-white", department: "—", authMethod: "—", hasSso: false, hasMfa: false, status: "pending", lastActive: "—", invitedDate: "2 days ago" },
  { id: "u17", name: "", email: "mark@acme.com", initials: "MA", role: "Viewer", roleColorClass: "bg-muted-foreground/30 text-muted-foreground", department: "—", authMethod: "—", hasSso: false, hasMfa: false, status: "pending", lastActive: "—", invitedDate: "5 days ago" },
  { id: "u18", name: "", email: "sam@acme.com", initials: "SA", role: "Manager", roleColorClass: "bg-success text-white", department: "Sales", authMethod: "—", hasSso: false, hasMfa: false, status: "pending", lastActive: "—", invitedDate: "1 day ago" },
  // Deactivated
  { id: "u19", name: "Tom Davis", email: "tom.d@acme.com", initials: "TD", role: "Employee", roleColorClass: "bg-muted-foreground/20 text-muted-foreground", department: "Marketing", authMethod: "Email", hasSso: false, hasMfa: false, status: "deactivated", lastActive: "Mar 15", deactivatedDate: "Mar 15", deactivatedBy: "sarah@acme.com" },
  { id: "u20", name: "Nina Tanaka", email: "nina@acme.com", initials: "NT", role: "Viewer", roleColorClass: "bg-muted-foreground/30 text-muted-foreground", department: "—", authMethod: "Email", hasSso: false, hasMfa: false, status: "deactivated", lastActive: "Feb 28", deactivatedDate: "Mar 1", deactivatedBy: "prashant@acme.com" },
];

export const ACTIVE_COUNT = MEMBERS.filter((m) => m.status === "active").length;
export const PENDING_COUNT = MEMBERS.filter((m) => m.status === "pending").length;
export const DEACTIVATED_COUNT = MEMBERS.filter((m) => m.status === "deactivated").length;
export const MFA_COUNT = MEMBERS.filter((m) => m.hasMfa && m.status === "active").length;

/* ── Roles ── */

export interface Role {
  id: string;
  name: string;
  colorClass: string;
  userCount: number;
  type: "system" | "custom";
  basedOn?: string;
  description: string;
  icon: string;
}

export const ROLES: Role[] = [
  { id: "r1", name: "Owner", colorClass: "bg-warning", userCount: 1, type: "system", description: "Full access to everything including billing, plan, and ownership transfer. One per organization.", icon: "👑" },
  { id: "r2", name: "Admin", colorClass: "bg-brand-purple", userCount: 2, type: "system", description: "Full platform access except billing and ownership. Can manage all users, roles, settings, and AI agents.", icon: "🟣" },
  { id: "r3", name: "HR Lead", colorClass: "bg-brand", userCount: 1, type: "system", description: "Full access to all HR operations: people, hiring, performance, compensation, compliance.", icon: "🔵" },
  { id: "r4", name: "HR Manager", colorClass: "bg-brand-teal", userCount: 3, type: "system", description: "Department-scoped HR access: people, hiring, leave approvals. No comp visibility.", icon: "🟢" },
  { id: "r5", name: "Recruiter", colorClass: "bg-destructive", userCount: 4, type: "system", description: "Hiring pipeline access only: candidates, jobs, interviews, offer generation.", icon: "🌹" },
  { id: "r6", name: "Manager", colorClass: "bg-success", userCount: 5, type: "system", description: "Team-scoped view: direct reports only. Can view profiles, submit reviews, approve leave.", icon: "🟢" },
  { id: "r7", name: "Employee", colorClass: "bg-muted-foreground", userCount: 0, type: "system", description: "Self-service only: own profile, own leave, own performance, company directory.", icon: "⚫" },
  { id: "r8", name: "Viewer", colorClass: "bg-muted-foreground/50", userCount: 2, type: "system", description: "Read-only across the platform. Can view dashboards, reports, and public directory.", icon: "👁️" },
  { id: "r9", name: "Comp Analyst", colorClass: "bg-info", userCount: 1, type: "custom", basedOn: "HR Lead", description: "HR Lead permissions plus compensation data access and pay equity reporting. No hiring access.", icon: "🟤" },
];

/* ── Permissions Matrix ── */

export interface PermissionGroup {
  category: string;
  permissions: { name: string; roles: Record<string, string> }[];
}

export const PERMISSION_MATRIX: PermissionGroup[] = [
  { category: "People & Directory", permissions: [
    { name: "View employee profiles", roles: { Owner: "✅", Admin: "✅", "HR Lead": "✅", "HR Manager": "🔵D", Recruiter: "—", Manager: "🔵R", Viewer: "👁️" } },
    { name: "Edit employee profiles", roles: { Owner: "✅", Admin: "✅", "HR Lead": "✅", "HR Manager": "🔵D", Recruiter: "—", Manager: "—", Viewer: "—" } },
    { name: "View org chart", roles: { Owner: "✅", Admin: "✅", "HR Lead": "✅", "HR Manager": "✅", Recruiter: "✅", Manager: "✅", Viewer: "✅" } },
    { name: "View compensation data", roles: { Owner: "✅", Admin: "✅", "HR Lead": "✅", "HR Manager": "—", Recruiter: "—", Manager: "—", Viewer: "—" } },
  ]},
  { category: "Hiring & Recruiting", permissions: [
    { name: "View job postings", roles: { Owner: "✅", Admin: "✅", "HR Lead": "✅", "HR Manager": "✅", Recruiter: "✅", Manager: "—", Viewer: "👁️" } },
    { name: "Create/edit jobs", roles: { Owner: "✅", Admin: "✅", "HR Lead": "✅", "HR Manager": "✅", Recruiter: "✅", Manager: "—", Viewer: "—" } },
    { name: "View candidates", roles: { Owner: "✅", Admin: "✅", "HR Lead": "✅", "HR Manager": "🔵D", Recruiter: "✅", Manager: "—", Viewer: "—" } },
    { name: "Generate offers", roles: { Owner: "✅", Admin: "✅", "HR Lead": "✅", "HR Manager": "—", Recruiter: "—", Manager: "—", Viewer: "—" } },
  ]},
  { category: "Performance", permissions: [
    { name: "Manage review cycles", roles: { Owner: "✅", Admin: "✅", "HR Lead": "✅", "HR Manager": "🔵D", Recruiter: "—", Manager: "—", Viewer: "—" } },
    { name: "View calibration data", roles: { Owner: "✅", Admin: "✅", "HR Lead": "✅", "HR Manager": "🔵D", Recruiter: "—", Manager: "—", Viewer: "—" } },
    { name: "Manage goals", roles: { Owner: "✅", Admin: "✅", "HR Lead": "✅", "HR Manager": "✅", Recruiter: "—", Manager: "🔵R", Viewer: "—" } },
  ]},
  { category: "Settings & Admin", permissions: [
    { name: "Manage users & roles", roles: { Owner: "✅", Admin: "✅", "HR Lead": "—", "HR Manager": "—", Recruiter: "—", Manager: "—", Viewer: "—" } },
    { name: "Manage billing", roles: { Owner: "✅", Admin: "—", "HR Lead": "—", "HR Manager": "—", Recruiter: "—", Manager: "—", Viewer: "—" } },
    { name: "Configure AI agents", roles: { Owner: "✅", Admin: "✅", "HR Lead": "—", "HR Manager": "—", Recruiter: "—", Manager: "—", Viewer: "—" } },
    { name: "Manage integrations", roles: { Owner: "✅", Admin: "✅", "HR Lead": "✅", "HR Manager": "—", Recruiter: "—", Manager: "—", Viewer: "—" } },
  ]},
];

export const MATRIX_ROLE_COLUMNS = ["Owner", "Admin", "HR Lead", "HR Manager", "Recruiter", "Manager", "Viewer"];

/* ── Activity Log ── */

export interface ActivityEntry {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: "login" | "role_change" | "invite" | "deactivate" | "settings" | "data_access";
}

export const ACTIVITY_LOG: ActivityEntry[] = [
  { id: "a1", user: "Prashant Singh", action: "Logged in via SSO", target: "—", timestamp: "Today 2:14 PM", type: "login" },
  { id: "a2", user: "Sarah Chen", action: "Changed role", target: "Mike Johnson → Comp Analyst", timestamp: "Today 1:45 PM", type: "role_change" },
  { id: "a3", user: "Prashant Singh", action: "Invited user", target: "sam@acme.com as Manager", timestamp: "Today 11:30 AM", type: "invite" },
  { id: "a4", user: "Sarah Chen", action: "Deactivated user", target: "Tom Davis", timestamp: "Mar 15, 3:20 PM", type: "deactivate" },
  { id: "a5", user: "Prashant Singh", action: "Updated SSO configuration", target: "Okta SAML", timestamp: "Mar 14, 10:00 AM", type: "settings" },
  { id: "a6", user: "Alex Rivera", action: "Exported employee data", target: "142 records", timestamp: "Mar 13, 4:15 PM", type: "data_access" },
  { id: "a7", user: "Meera Patel", action: "Created custom role", target: "Comp Analyst", timestamp: "Mar 12, 2:30 PM", type: "role_change" },
  { id: "a8", user: "Prashant Singh", action: "Enforced MFA policy", target: "All users", timestamp: "Mar 10, 9:00 AM", type: "settings" },
  { id: "a9", user: "Sarah Chen", action: "Invited user", target: "lisa.new@acme.com as HR Manager", timestamp: "Mar 8, 11:00 AM", type: "invite" },
  { id: "a10", user: "Prashant Singh", action: "Logged in via SSO", target: "—", timestamp: "Mar 7, 8:45 AM", type: "login" },
];

export const ACTIVITY_TYPE_CONFIG: Record<string, { icon: string; colorClass: string }> = {
  login: { icon: "🔑", colorClass: "text-success" },
  role_change: { icon: "🛡️", colorClass: "text-brand-purple" },
  invite: { icon: "📨", colorClass: "text-brand" },
  deactivate: { icon: "🚫", colorClass: "text-destructive" },
  settings: { icon: "⚙️", colorClass: "text-warning" },
  data_access: { icon: "📊", colorClass: "text-brand-teal" },
};

/* ── Status Config ── */

export const STATUS_CONFIG: Record<string, { label: string; dotClass: string }> = {
  active: { label: "Active", dotClass: "bg-success" },
  pending: { label: "Pending", dotClass: "bg-warning" },
  deactivated: { label: "Deactivated", dotClass: "bg-destructive" },
  suspended: { label: "Suspended", dotClass: "bg-destructive" },
};

/* ── Team Roles for Invite ── */

export const INVITE_ROLES = ROLES.filter((r) => r.name !== "Owner").map((r) => ({ value: r.name, label: r.name }));
