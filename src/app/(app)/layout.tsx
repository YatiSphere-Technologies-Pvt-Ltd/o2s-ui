"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  House,
  Users,
  UserCircle,
  Briefcase,
  BarChart3,
  Settings,
  TrendingUp,
  Rocket,
  ChevronDown,
  Kanban,
  ScanSearch,
  Scale,
  Target,
  BookOpen,
  DollarSign,
  Monitor,
  Building,
  ShoppingCart,
  Megaphone,
  FileText,
  Sparkles,
  Shield,
  Plane,
} from "lucide-react";
import { O2sLogo } from "@/components/auth/o2s-logo";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/profile/user-menu";
import { TENANT_NAME, FISCAL_PERIOD, ROLE_META, type Role } from "@/components/profile/data";
import { AppShellProviders } from "@/components/layout/app-shell-providers";
import { useRole } from "@/lib/role-context";
import { useLocalStorage } from "@/lib/use-local-storage";
import { CommandMenu } from "@/components/command-palette/command-menu";
import { NotificationsBell } from "@/components/layout/notifications-bell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { AuroraFab } from "@/components/layout/aurora-fab";
import { useAdminStore } from "@/lib/admin-store";
import { useRBAC } from "@/lib/rbac";
import type { ModuleKey } from "@/components/admin/data";

/* ── Navigation Structure ── */

interface NavChild {
  label: string;
  href: string;
  roles?: Role[];
  module?: ModuleKey;
  /** When true, only show to tenant admins / super admins. */
  adminOnly?: boolean;
}

interface ChildSection {
  /** Section label (e.g. "Employee", "Manager", "HR"). */
  label: string;
  children: NavChild[];
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavChild[];
  /** Optional sub-section grouping when an item has many children. */
  sections?: ChildSection[];
  roles?: Role[];
  module?: ModuleKey;
  adminOnly?: boolean;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  accentClass: string;
}

const DEFAULT_EXPANDED: Record<string, boolean> = {
  Talent: false,
  "CV Screening": false,
  Leave: true,
  Delivery: true,
  Legal: false,
  Learning: false,
  Finance: false,
  IT: false,
  Facilities: false,
  Procurement: false,
  Engage: false,
  Knowledge: false,
  Admin: true,
};

function visibleForRole(roles: Role[] | undefined, active: Role): boolean {
  if (!roles || roles.length === 0) return true;
  return roles.includes(active);
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "OVERVIEW",
    accentClass: "border-warning",
    items: [
      { label: "Home", href: "/dashboard", icon: House },
      { label: "Command Center", href: "/command-center", icon: Kanban, roles: ["manager", "hr", "admin"] },
      { label: "Automation", href: "/automation", icon: Sparkles, roles: ["hr", "admin"] },
      { label: "Analytics", href: "/analytics", icon: BarChart3, roles: ["manager", "hr", "admin"] },
    ],
  },
  {
    label: "TALENT ACQUISITION",
    accentClass: "border-brand-purple",
    items: [
      {
        label: "Talent",
        href: "/talent",
        icon: Users,
        roles: ["manager", "hr", "admin"],
        module: "talent",
        children: [
          { label: "Pipeline", href: "/talent" },
          { label: "Requisitions", href: "/requisitions" },
          { label: "Talent Pool", href: "/talent-pool" },
          { label: "Vendors", href: "/vendors" },
          { label: "Interviews", href: "/interviews" },
          { label: "Interview Command", href: "/interview-command" },
          { label: "Interview Arena", href: "/interview-arena" },
          { label: "Panels", href: "/panels" },
          { label: "Candidates", href: "/candidates" },
        ],
      },
      { label: "Jobs", href: "/jobs", icon: Briefcase, roles: ["manager", "hr", "admin"], module: "talent" },
      {
        label: "CV Screening",
        href: "/cv-screening",
        icon: ScanSearch,
        roles: ["hr", "admin"],
        module: "talent",
        children: [
          { label: "Screen CVs", href: "/cv-screening" },
          { label: "Analysis Results", href: "/cv-screening/results" },
          { label: "Screening History", href: "/cv-screening/history" },
          { label: "Screening Config", href: "/cv-screening/config" },
        ],
      },
    ],
  },
  {
    label: "PEOPLE & HR",
    accentClass: "border-brand-teal",
    items: [
      { label: "People", href: "/people", icon: UserCircle, roles: ["manager", "hr", "admin"], module: "people" },
      { label: "People Command", href: "/people-command", icon: Shield, roles: ["hr", "admin"], module: "people" },
      {
        label: "Leave",
        href: "/leave",
        icon: Plane,
        module: "leave",
        sections: [
          {
            label: "Employee",
            children: [
              { label: "My Leave", href: "/leave" },
              { label: "New request", href: "/leave/request" },
              { label: "History", href: "/leave/history" },
              { label: "Calendar", href: "/leave/calendar" },
            ],
          },
          {
            label: "Manager",
            children: [
              { label: "Manager home", href: "/leave/manager", roles: ["manager", "hr", "admin"] },
              { label: "Team capacity", href: "/leave/team", roles: ["manager", "hr", "admin"] },
              { label: "Wellbeing alerts", href: "/leave/manager/wellbeing", roles: ["manager", "hr", "admin"] },
              { label: "Delegation", href: "/leave/manager/delegation", roles: ["manager", "hr", "admin"] },
              { label: "Manager reports", href: "/leave/manager/reports", roles: ["manager", "hr", "admin"] },
            ],
          },
          {
            label: "HR · Operations",
            children: [
              { label: "HR overview", href: "/leave/hr", roles: ["hr", "admin"] },
              { label: "All requests", href: "/leave/hr/requests", roles: ["hr", "admin"] },
              { label: "Anomalies", href: "/leave/hr/anomalies", roles: ["hr", "admin"] },
              { label: "Employees", href: "/leave/hr/employees", roles: ["hr", "admin"] },
            ],
          },
          {
            label: "HR · Policy",
            children: [
              { label: "Policy builder", href: "/leave/hr/policies", roles: ["hr", "admin"] },
              { label: "Types library", href: "/leave/hr/policies/types", roles: ["hr", "admin"] },
              { label: "Tenant settings", href: "/leave/hr/tenant", roles: ["hr", "admin"] },
            ],
          },
          {
            label: "HR · AI agents",
            children: [
              { label: "Agent control", href: "/leave/hr/agents", roles: ["hr", "admin"] },
            ],
          },
          {
            label: "HR · Reports",
            children: [
              { label: "Reports hub", href: "/leave/hr/reports", roles: ["hr", "admin"] },
              { label: "Liability", href: "/leave/hr/reports/liability", roles: ["hr", "admin"] },
              { label: "Compliance dashboard", href: "/leave/hr/reports/compliance", roles: ["hr", "admin"] },
            ],
          },
          {
            label: "HR · Compliance & audit",
            children: [
              { label: "Compliance watchdog", href: "/leave/hr/compliance", roles: ["hr", "admin"] },
              { label: "Audit log", href: "/leave/hr/audit", roles: ["hr", "admin"] },
              { label: "DSAR", href: "/leave/hr/dsar", roles: ["hr", "admin"] },
              { label: "Scheduled exports", href: "/leave/hr/exports", roles: ["hr", "admin"] },
            ],
          },
          {
            label: "Admin",
            children: [
              { label: "Edge cases", href: "/leave/admin/edge-cases", roles: ["hr", "admin"] },
            ],
          },
        ],
      },
      { label: "Onboarding", href: "/onboarding-hub", icon: Rocket, roles: ["hr", "admin"] },
      { label: "Performance", href: "/performance", icon: TrendingUp },
      { label: "Goals & OKRs", href: "/goals", icon: Target },
    ],
  },
  {
    label: "LEARNING",
    accentClass: "border-[#A3E635]",
    items: [
      {
        label: "Learning",
        href: "/learning/catalog",
        icon: BookOpen,
        module: "learning",
        children: [
          { label: "Catalog", href: "/learning/catalog" },
          { label: "My Learning", href: "/learning/my-learning" },
          { label: "Calendar", href: "/learning/calendar" },
          { label: "Certifications", href: "/learning/certifications" },
          { label: "Skills", href: "/learning/skills" },
        ],
      },
    ],
  },
  {
    label: "DELIVERY & PMO",
    accentClass: "border-warning",
    items: [
      {
        label: "Delivery",
        href: "/delivery",
        icon: Kanban,
        module: "delivery",
        sections: [
          {
            label: "Overview",
            children: [
              { label: "Module home", href: "/delivery" },
            ],
          },
          {
            label: "Agent tower",
            children: [
              { label: "Agent overview", href: "/delivery/agents" },
            ],
          },
        ],
      },
    ],
  },
  {
    label: "LEGAL & COMPLIANCE",
    accentClass: "border-destructive",
    items: [
      {
        label: "Legal",
        href: "/legal/contracts",
        icon: Scale,
        roles: ["hr", "admin"],
        module: "legal",
        children: [
          { label: "Contracts", href: "/legal/contracts" },
          { label: "Policies", href: "/legal/policies" },
          { label: "Compliance", href: "/legal/compliance" },
          { label: "Documents", href: "/legal/documents" },
          { label: "Cases", href: "/legal/cases" },
          { label: "Immigration", href: "/legal/immigration" },
          { label: "Data Protection", href: "/legal/data-protection" },
          { label: "Spend", href: "/legal/spend" },
        ],
      },
    ],
  },
  {
    label: "OPERATIONS",
    accentClass: "border-[#38BDF8]",
    items: [
      {
        label: "Finance",
        href: "/finance/expenses",
        icon: DollarSign,
        module: "finance",
        children: [
          { label: "Expenses", href: "/finance/expenses" },
          { label: "Travel", href: "/finance/travel" },
          { label: "Budgets", href: "/finance/budgets", roles: ["manager", "hr", "admin"] },
          { label: "Invoices", href: "/finance/invoices", roles: ["hr", "admin"] },
          { label: "Reports", href: "/finance/reports", roles: ["manager", "hr", "admin"] },
        ],
      },
      {
        label: "IT",
        href: "/it/helpdesk",
        icon: Monitor,
        module: "it",
        children: [
          { label: "Helpdesk", href: "/it/helpdesk" },
          { label: "Assets", href: "/it/assets", roles: ["hr", "admin"] },
          { label: "Licenses", href: "/it/licenses", roles: ["admin"] },
          { label: "Provisioning", href: "/it/provisioning", roles: ["admin"] },
          { label: "Access", href: "/it/access", roles: ["admin"] },
        ],
      },
      {
        label: "Facilities",
        href: "/facilities/desks",
        icon: Building,
        module: "facilities",
        children: [
          { label: "Desks", href: "/facilities/desks" },
          { label: "Rooms", href: "/facilities/rooms" },
          { label: "Visitors", href: "/facilities/visitors", roles: ["hr", "admin"] },
          { label: "Spaces", href: "/facilities/spaces", roles: ["hr", "admin"] },
        ],
      },
      {
        label: "Procurement",
        href: "/procurement/requests",
        icon: ShoppingCart,
        roles: ["manager", "hr", "admin"],
        module: "procurement",
        children: [
          { label: "Requests", href: "/procurement/requests" },
          { label: "Orders", href: "/procurement/orders" },
          { label: "Suppliers", href: "/procurement/suppliers", roles: ["hr", "admin"] },
          { label: "Receiving", href: "/procurement/receiving", roles: ["hr", "admin"] },
        ],
      },
    ],
  },
  {
    label: "ENGAGEMENT",
    accentClass: "border-success",
    items: [
      {
        label: "Engage",
        href: "/engage/feed",
        icon: Megaphone,
        module: "engage",
        children: [
          { label: "Feed", href: "/engage/feed" },
          { label: "Recognition", href: "/engage/recognition" },
          { label: "Surveys", href: "/engage/surveys" },
          { label: "Culture", href: "/engage/culture" },
        ],
      },
      {
        label: "Knowledge",
        href: "/knowledge/wiki",
        icon: FileText,
        module: "knowledge",
        children: [
          { label: "Wiki", href: "/knowledge/wiki" },
          { label: "SOPs", href: "/knowledge/sops" },
          { label: "Templates", href: "/knowledge/templates" },
        ],
      },
    ],
  },
  {
    label: "ADMIN & SECURITY",
    accentClass: "border-brand-purple",
    items: [
      {
        label: "Admin",
        href: "/admin",
        icon: Shield,
        adminOnly: true,
        sections: [
          {
            label: "Tenant",
            children: [
              { label: "Overview", href: "/admin" },
              { label: "Modules & entitlements", href: "/admin/modules" },
              { label: "Module catalog", href: "/admin/modules/catalog" },
            ],
          },
          {
            label: "Identity",
            children: [
              { label: "Users", href: "/admin/users" },
              { label: "Groups", href: "/admin/groups" },
            ],
          },
          {
            label: "Access control",
            children: [
              { label: "Permission matrix", href: "/admin/permissions" },
              { label: "Roles", href: "/admin/roles" },
            ],
          },
          {
            label: "Compliance",
            children: [
              { label: "Audit log", href: "/admin/audit" },
            ],
          },
        ],
      },
    ],
  },
];

const SYSTEM_NAV: NavItem = {
  label: "Settings",
  href: "/settings/org",
  icon: Settings,
  roles: ["admin"],
};

/* ── Check if any child route is active ── */

function childMatches(href: string, pathname: string): boolean {
  if (href === "/talent") return pathname === "/talent";
  if (href === "/cv-screening") return pathname === "/cv-screening";
  if (href === "/leave") return pathname === "/leave";
  if (href === "/leave/hr") return pathname === "/leave/hr";
  if (href === "/leave/hr/policies") return pathname === "/leave/hr/policies";
  if (href === "/leave/hr/reports") return pathname === "/leave/hr/reports";
  if (href === "/leave/manager") return pathname === "/leave/manager";
  if (href === "/admin") return pathname === "/admin";
  if (href === "/admin/modules") return pathname === "/admin/modules";
  if (href === "/delivery") return pathname === "/delivery";
  if (href === "/delivery/agents") return pathname === "/delivery/agents";
  return pathname.startsWith(href);
}

function isChildActive(item: NavItem, pathname: string): boolean {
  const children = collectChildren(item);
  return children.some((c) => childMatches(c.href, pathname));
}

function collectChildren(item: NavItem): NavChild[] {
  if (item.children) return item.children;
  if (item.sections) return item.sections.flatMap((s) => s.children);
  return [];
}

/* ── Layout Component ── */

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShellProviders>
      <AppShell>{children}</AppShell>
    </AppShellProviders>
  );
}

function AppShell({ children }: { children: React.ReactNode }) {
  const { activeRole } = useRole();
  const { ownsModule } = useAdminStore();
  const { isTenantAdmin, isSuperAdmin } = useRBAC();
  const [sidebarPinned, setSidebarPinned] = useLocalStorage<boolean>("o2s.sidebarPinned", false);
  const [sidebarHover, setSidebarHover] = useState(false);
  const sidebarExpanded = sidebarPinned || sidebarHover;
  const [expandedItems, setExpandedItems] = useLocalStorage<Record<string, boolean>>(
    "o2s.sidebarExpanded",
    DEFAULT_EXPANDED,
  );
  const pathname = usePathname();
  const activeMeta = ROLE_META[activeRole];

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    return childMatches(href, pathname);
  };

  /* Build the role + entitlement + admin filtered nav each render.
     Items are dropped when:
       - the persona doesn't satisfy item.roles[]
       - the tenant doesn't own item.module
       - item.adminOnly = true but persona isn't tenant- or super-admin
   */
  function passesGates(item: NavItem | NavChild): boolean {
    if ("roles" in item && !visibleForRole(item.roles, activeRole)) return false;
    if (item.module && !ownsModule(item.module)) return false;
    if (item.adminOnly && !isTenantAdmin && !isSuperAdmin) return false;
    return true;
  }

  const visibleGroups = NAV_GROUPS
    .map((group) => {
      const items = group.items
        .filter(passesGates)
        .map((item) => {
          if (item.sections) {
            const filteredSections = item.sections
              .map((s) => ({ ...s, children: s.children.filter(passesGates) }))
              .filter((s) => s.children.length > 0);
            if (filteredSections.length === 0) return null;
            return { ...item, sections: filteredSections };
          }
          if (item.children) {
            const kids = item.children.filter(passesGates);
            if (kids.length === 0) return null;
            return { ...item, children: kids };
          }
          return item;
        })
        .filter((x): x is NavItem => x !== null);
      return { ...group, items };
    })
    .filter((g) => g.items.length > 0);

  const showSettings = visibleForRole(SYSTEM_NAV.roles, activeRole);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Top Navigation Bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarPinned((prev) => !prev)}
            aria-label={sidebarPinned ? "Unpin sidebar" : "Pin sidebar"}
          >
            <Menu className="size-5" />
          </Button>
          <O2sLogo size="sm" />
          <div className="hidden md:flex items-center gap-2 pl-3 border-l border-border">
            <span className="text-xs font-medium text-foreground">{TENANT_NAME}</span>
            <span className={`text-[10px] rounded-full px-2 py-0.5 bg-secondary ${activeMeta.accent}`}>
              {activeMeta.label}
            </span>
          </div>
        </div>

        <div className="mx-auto w-full max-w-96">
          <CommandMenu />
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <NotificationsBell />
          <UserMenu />
        </div>
      </header>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed left-0 top-14 bottom-0 z-40 flex flex-col border-r border-border bg-card transition-all duration-200 ${
          sidebarExpanded ? "w-64" : "w-15"
        }`}
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
      >
        {/* Scroll area — must have min-h-0 so flex-1 actually constrains it */}
        <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain scrollbar-thin py-2">
          {visibleGroups.map((group) => (
            <div key={group.label} className="mt-3 first:mt-0">
              {/* Group header */}
              <div
                className={`px-4 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/50 transition-opacity duration-200 ${
                  sidebarExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden p-0"
                }`}
              >
                {group.label}
              </div>

              {/* Nav items */}
              <div className="flex flex-col gap-0.5 px-2">
                {group.items.map((item) => {
                  const hasKids = !!item.children || !!item.sections;
                  const itemActive = hasKids ? isChildActive(item, pathname) : isActive(item.href);
                  const expanded = expandedItems[item.label] ?? true;

                  return (
                    <div key={item.label}>
                      {/* Top-level row */}
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          className={`group relative flex h-9 flex-1 min-w-0 items-center gap-3 rounded-lg transition-colors ${
                            itemActive
                              ? `${group.accentClass} border-l-[3px] bg-surface-overlay text-foreground`
                              : "border-l-[3px] border-transparent text-muted-foreground hover:bg-surface-overlay hover:text-foreground"
                          }`}
                        >
                          <div className="flex w-13 shrink-0 items-center justify-center">
                            <item.icon className="size-4.5" />
                          </div>
                          <span
                            className={`flex-1 truncate text-sm font-medium transition-opacity duration-200 ${
                              sidebarExpanded ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            {item.label}
                          </span>
                        </Link>

                        {hasKids && sidebarExpanded && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleExpand(item.label);
                            }}
                            className="mr-1.5 flex size-6 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
                            aria-label={expanded ? "Collapse" : "Expand"}
                          >
                            <ChevronDown
                              className={`size-3.5 transition-transform duration-200 ${expanded ? "rotate-0" : "-rotate-90"}`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Expanded sub-tree */}
                      {hasKids && expanded && sidebarExpanded && (
                        <div className="ml-2 mt-0.5 mb-1 border-l border-border/60">
                          {/* Sub-sections (Leave, Admin) */}
                          {item.sections && (
                            <div className="flex flex-col gap-2 py-1.5">
                              {item.sections.map((sec) => (
                                <div key={sec.label}>
                                  <p className="pl-10 pr-2 pb-0.5 text-[9.5px] font-semibold uppercase tracking-wider text-muted-foreground/50">
                                    {sec.label}
                                  </p>
                                  <div className="flex flex-col">
                                    {sec.children.map((child) => {
                                      const subActive = isActive(child.href);
                                      return (
                                        <Link
                                          key={child.href}
                                          href={child.href}
                                          className={`flex h-7 items-center pl-10 pr-2 text-[12.5px] transition-colors rounded-r ${
                                            subActive
                                              ? "font-semibold text-foreground bg-surface-overlay"
                                              : "text-muted-foreground hover:text-foreground hover:bg-surface-overlay/60"
                                          }`}
                                        >
                                          <span className="truncate">{child.label}</span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Flat children (legacy) */}
                          {item.children && (
                            <div className="flex flex-col py-1">
                              {item.children.map((child) => {
                                const subActive = isActive(child.href);
                                return (
                                  <Link
                                    key={child.href}
                                    href={child.href}
                                    className={`flex h-7 items-center pl-10 pr-2 text-[12.5px] transition-colors rounded-r ${
                                      subActive
                                        ? "font-semibold text-foreground bg-surface-overlay"
                                        : "text-muted-foreground hover:text-foreground hover:bg-surface-overlay/60"
                                    }`}
                                  >
                                    <span className="truncate">{child.label}</span>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Settings (admin only) — inside scroll, above footer */}
          {showSettings && (
            <div className="mt-4">
              <div
                className={`px-4 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground/50 ${
                  sidebarExpanded ? "" : "opacity-0 h-0 overflow-hidden p-0"
                }`}
              >
                Platform
              </div>
              <div className="flex flex-col gap-0.5 px-2">
                <Link
                  href={SYSTEM_NAV.href}
                  className={`group relative flex h-9 items-center gap-3 rounded-lg transition-colors ${
                    pathname.startsWith("/settings")
                      ? "border-l-[3px] border-brand bg-surface-overlay text-foreground"
                      : "border-l-[3px] border-transparent text-muted-foreground hover:bg-surface-overlay hover:text-foreground"
                  }`}
                >
                  <div className="flex w-13 shrink-0 items-center justify-center">
                    <SYSTEM_NAV.icon className="size-4.5" />
                  </div>
                  <span
                    className={`flex-1 truncate text-sm font-medium transition-opacity duration-200 ${
                      sidebarExpanded ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    {SYSTEM_NAV.label}
                  </span>
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Sticky footer — outside the scroll area so it never moves */}
        <div className="shrink-0 border-t border-border px-2 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex w-13 shrink-0 items-center justify-center">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex size-2.5 rounded-full bg-success" />
              </span>
            </div>
            <span
              className={`whitespace-nowrap text-xs text-muted-foreground transition-opacity duration-200 ${
                sidebarExpanded ? "opacity-100" : "opacity-0"
              }`}
            >
              5 agents active
            </span>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <div className="flex w-13 shrink-0 items-center justify-center text-[10px] font-semibold text-muted-foreground/60">
              {FISCAL_PERIOD.split(" ")[1]}
            </div>
            <span
              className={`whitespace-nowrap text-[10px] uppercase tracking-wider text-muted-foreground/60 transition-opacity duration-200 ${
                sidebarExpanded ? "opacity-100" : "opacity-0"
              }`}
            >
              {FISCAL_PERIOD}
            </span>
          </div>
        </div>
      </aside>

      {/* ── Main Content Area ── */}
      <main
        className={`pt-14 transition-all duration-200 ${
          sidebarExpanded ? "ml-64" : "ml-15"
        }`}
      >
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-thin">
          {children}
        </div>
      </main>

      {/* Floating AI assistant */}
      <AuroraFab />
    </div>
  );
}
