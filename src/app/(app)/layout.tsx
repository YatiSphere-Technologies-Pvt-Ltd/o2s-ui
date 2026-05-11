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

/* ── Navigation Structure ── */

interface NavChild {
  label: string;
  href: string;
  roles?: Role[];
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: NavChild[];
  roles?: Role[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
  accentClass: string;
}

const DEFAULT_EXPANDED: Record<string, boolean> = {
  Talent: true,
  "CV Screening": true,
  Leave: true,
  Legal: true,
  Learning: true,
  Finance: true,
  IT: true,
  Facilities: true,
  Procurement: true,
  Engage: true,
  Knowledge: true,
};

function visibleForRole(roles: Role[] | undefined, active: Role): boolean {
  if (!roles || roles.length === 0) return true;
  return roles.includes(active);
}

function filterChildren(item: NavItem, active: Role): NavChild[] | undefined {
  if (!item.children) return undefined;
  const filtered = item.children.filter((c) => visibleForRole(c.roles, active));
  return filtered.length > 0 ? filtered : undefined;
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
      { label: "Jobs", href: "/jobs", icon: Briefcase, roles: ["manager", "hr", "admin"] },
      {
        label: "CV Screening",
        href: "/cv-screening",
        icon: ScanSearch,
        roles: ["hr", "admin"],
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
      { label: "People", href: "/people", icon: UserCircle, roles: ["manager", "hr", "admin"] },
      { label: "People Command", href: "/people-command", icon: Shield, roles: ["hr", "admin"] },
      {
        label: "Leave",
        href: "/leave",
        icon: Plane,
        children: [
          { label: "My Leave", href: "/leave" },
          { label: "HR Overview", href: "/leave/hr", roles: ["hr", "admin"] },
          { label: "All Requests", href: "/leave/hr/requests", roles: ["hr", "admin"] },
          { label: "Anomalies", href: "/leave/hr/anomalies", roles: ["hr", "admin"] },
          { label: "Employees", href: "/leave/hr/employees", roles: ["hr", "admin"] },
          { label: "Agent control", href: "/leave/hr/agents", roles: ["hr", "admin"] },
          { label: "Compliance", href: "/leave/hr/compliance", roles: ["hr", "admin"] },
          { label: "Reports", href: "/leave/hr/reports", roles: ["hr", "admin"] },
          { label: "Liability", href: "/leave/hr/reports/liability", roles: ["hr", "admin"] },
          { label: "Compliance dashboard", href: "/leave/hr/reports/compliance", roles: ["hr", "admin"] },
          { label: "Audit log", href: "/leave/hr/audit", roles: ["hr", "admin"] },
          { label: "DSAR", href: "/leave/hr/dsar", roles: ["hr", "admin"] },
          { label: "Scheduled exports", href: "/leave/hr/exports", roles: ["hr", "admin"] },
          { label: "Roles & Permissions", href: "/leave/hr/roles", roles: ["hr", "admin"] },
          { label: "Tenant settings", href: "/leave/hr/tenant", roles: ["hr", "admin"] },
          { label: "Policy builder", href: "/leave/hr/policies", roles: ["hr", "admin"] },
          { label: "Types library", href: "/leave/hr/policies/types", roles: ["hr", "admin"] },
          { label: "Edge cases", href: "/leave/admin/edge-cases", roles: ["hr", "admin"] },
          { label: "Manager Home", href: "/leave/manager", roles: ["manager", "hr", "admin"] },
          { label: "Wellbeing alerts", href: "/leave/manager/wellbeing", roles: ["manager", "hr", "admin"] },
          { label: "Manager Reports", href: "/leave/manager/reports", roles: ["manager", "hr", "admin"] },
          { label: "Delegation", href: "/leave/manager/delegation", roles: ["manager", "hr", "admin"] },
          { label: "History", href: "/leave/history" },
          { label: "Calendar", href: "/leave/calendar" },
          { label: "Team Capacity", href: "/leave/team", roles: ["manager", "hr", "admin"] },
          { label: "Approvals", href: "/leave/approvals", roles: ["manager", "hr", "admin"] },
          { label: "Policies", href: "/leave/policies", roles: ["hr", "admin"] },
          { label: "Balances & Accruals", href: "/leave/balances", roles: ["hr", "admin"] },
          { label: "Reports", href: "/leave/reports", roles: ["hr", "admin"] },
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
    label: "LEGAL & COMPLIANCE",
    accentClass: "border-destructive",
    items: [
      {
        label: "Legal",
        href: "/legal/contracts",
        icon: Scale,
        roles: ["hr", "admin"],
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
        children: [
          { label: "Wiki", href: "/knowledge/wiki" },
          { label: "SOPs", href: "/knowledge/sops" },
          { label: "Templates", href: "/knowledge/templates" },
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

function isChildActive(item: NavItem, pathname: string): boolean {
  if (!item.children) return false;
  return item.children.some((c) => {
    if (c.href === "/talent") return pathname === "/talent";
    if (c.href === "/cv-screening") return pathname === "/cv-screening";
    return pathname.startsWith(c.href);
  });
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
    if (href === "/talent") return pathname === "/talent";
    if (href === "/leave") return pathname === "/leave";
    if (href === "/leave/hr/policies") return pathname === "/leave/hr/policies";
    return pathname.startsWith(href);
  };

  /* Build the role-filtered nav each render. Items whose own roles[] excludes activeRole
     are hidden. Items with children get a filtered child list; if no children remain
     and the item has no standalone destination, it's hidden. */
  const visibleGroups = NAV_GROUPS
    .map((group) => {
      const items = group.items
        .filter((item) => visibleForRole(item.roles, activeRole))
        .map((item) => {
          if (!item.children) return item;
          const kids = filterChildren(item, activeRole);
          if (!kids) return null;
          return { ...item, children: kids };
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
          sidebarExpanded ? "w-60" : "w-15"
        }`}
        onMouseEnter={() => setSidebarHover(true)}
        onMouseLeave={() => setSidebarHover(false)}
      >
        <nav className="flex flex-1 flex-col overflow-y-auto py-3 scrollbar-thin">
          {visibleGroups.map((group) => (
            <div key={group.label} className="mt-4 first:mt-1">
              {/* Section Header */}
              <div
                className={`px-4 pb-2 text-[10px] font-semibold uppercase tracking-[0.05em] text-muted-foreground/50 transition-opacity duration-200 ${
                  sidebarExpanded ? "opacity-100" : "opacity-0 h-0 overflow-hidden pb-0"
                }`}
              >
                {group.label}
              </div>

              {/* Nav Items */}
              <div className="flex flex-col gap-0.5 px-2">
                {group.items.map((item) => {
                  const hasChildren = !!item.children;
                  const itemActive = hasChildren
                    ? isChildActive(item, pathname)
                    : isActive(item.href);

                  return (
                    <div key={item.label}>
                      {/* Main nav item */}
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          className={`group relative flex h-9 flex-1 items-center gap-3 rounded-lg transition-colors ${
                            itemActive
                              ? `${group.accentClass} border-l-[3px] bg-surface-overlay text-foreground`
                              : "border-l-[3px] border-transparent text-muted-foreground hover:bg-surface-overlay hover:text-foreground"
                          }`}
                        >
                          <div className="flex w-13 shrink-0 items-center justify-center">
                            <item.icon className="size-4.5" />
                          </div>
                          <span
                            className={`whitespace-nowrap text-sm font-medium transition-opacity duration-200 ${
                              sidebarExpanded ? "opacity-100" : "opacity-0"
                            }`}
                          >
                            {item.label}
                          </span>
                        </Link>

                        {/* Expand chevron for items with children */}
                        {hasChildren && sidebarExpanded && (
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              toggleExpand(item.label);
                            }}
                            className="mr-2 flex size-6 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                          >
                            <ChevronDown
                              className={`size-3.5 transition-transform duration-200 ${
                                expandedItems[item.label] ? "rotate-0" : "-rotate-90"
                              }`}
                            />
                          </button>
                        )}
                      </div>

                      {/* Sub-navigation children */}
                      {hasChildren && expandedItems[item.label] && sidebarExpanded && (
                        <div className="ml-2 flex flex-col gap-0.5 py-1">
                          {item.children!.map((child) => {
                            const subActive = isActive(child.href);
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`flex h-8 items-center rounded-md pl-13 text-[13px] transition-colors ${
                                  subActive
                                    ? "font-medium text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Separator */}
          <div className="mx-3 my-3 border-t border-border" />

          {/* System: Settings (admin only) */}
          {showSettings && (
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
                  className={`whitespace-nowrap text-sm font-medium transition-opacity duration-200 ${
                    sidebarExpanded ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {SYSTEM_NAV.label}
                </span>
              </Link>
            </div>
          )}

          {/* Sidebar footer: fiscal period + agent activity */}
          <div className="mt-auto flex flex-col gap-2 px-2 pb-3 pt-3">
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
            <div className="flex items-center gap-3">
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
        </nav>
      </aside>

      {/* ── Main Content Area ── */}
      <main
        className={`pt-14 transition-all duration-200 ${
          sidebarExpanded ? "ml-60" : "ml-15"
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
