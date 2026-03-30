"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Search,
  Bell,
  House,
  Users,
  UserCircle,
  Briefcase,
  BarChart3,
  Settings,
  TrendingUp,
  UserCheck,
  Rocket,
  ChevronDown,
  Kanban,
  ClipboardList,
  Database,
  CalendarCheck,
  Contact,
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
} from "lucide-react";
import { O2sLogo } from "@/components/auth/o2s-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserMenu } from "@/components/profile/user-menu";

/* ── Navigation Structure ── */

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { label: string; href: string }[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
  accentClass: string;
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: "OVERVIEW",
    accentClass: "border-warning",
    items: [
      { label: "Home", href: "/dashboard", icon: House },
      { label: "Command Center", href: "/command-center", icon: Kanban },
      { label: "Automation", href: "/automation", icon: Sparkles },
      { label: "Analytics", href: "/analytics", icon: BarChart3 },
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
      { label: "Jobs", href: "/jobs", icon: Briefcase },
      {
        label: "CV Screening",
        href: "/cv-screening",
        icon: ScanSearch,
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
      { label: "People", href: "/people", icon: UserCircle },
      { label: "People Command", href: "/people-command", icon: Shield },
      { label: "Onboarding", href: "/onboarding-hub", icon: Rocket },
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
          { label: "Budgets", href: "/finance/budgets" },
          { label: "Invoices", href: "/finance/invoices" },
          { label: "Reports", href: "/finance/reports" },
        ],
      },
      {
        label: "IT",
        href: "/it/helpdesk",
        icon: Monitor,
        children: [
          { label: "Helpdesk", href: "/it/helpdesk" },
          { label: "Assets", href: "/it/assets" },
          { label: "Licenses", href: "/it/licenses" },
          { label: "Provisioning", href: "/it/provisioning" },
          { label: "Access", href: "/it/access" },
        ],
      },
      {
        label: "Facilities",
        href: "/facilities/desks",
        icon: Building,
        children: [
          { label: "Desks", href: "/facilities/desks" },
          { label: "Rooms", href: "/facilities/rooms" },
          { label: "Visitors", href: "/facilities/visitors" },
          { label: "Spaces", href: "/facilities/spaces" },
        ],
      },
      {
        label: "Procurement",
        href: "/procurement/requests",
        icon: ShoppingCart,
        children: [
          { label: "Requests", href: "/procurement/requests" },
          { label: "Orders", href: "/procurement/orders" },
          { label: "Suppliers", href: "/procurement/suppliers" },
          { label: "Receiving", href: "/procurement/receiving" },
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
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({ Talent: true, "CV Screening": true, Legal: true, Learning: true, Finance: true, IT: true, Facilities: true, Procurement: true, Engage: true, Knowledge: true });
  const pathname = usePathname();

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/talent") return pathname === "/talent";
    return pathname.startsWith(href);
  };

  const isGroupActive = (group: NavGroup) => {
    return group.items.some((item) => {
      if (item.children) return isChildActive(item, pathname);
      return isActive(item.href);
    });
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {/* ── Top Navigation Bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center border-b border-border bg-card px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarExpanded((prev) => !prev)}
            aria-label="Toggle sidebar"
          >
            <Menu className="size-5" />
          </Button>
          <O2sLogo size="sm" />
        </div>

        <div className="mx-auto w-full max-w-96">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search anything... ⌘K"
              className="h-9 w-full rounded-full border-border bg-background pl-9 pr-4 text-sm placeholder:text-muted-foreground focus-visible:ring-brand"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
            <Bell className="size-5" />
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-destructive" />
          </Button>
          <UserMenu />
        </div>
      </header>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed left-0 top-14 bottom-0 z-40 flex flex-col border-r border-border bg-card transition-all duration-200 ${
          sidebarExpanded ? "w-60" : "w-[60px]"
        }`}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        <nav className="flex flex-1 flex-col overflow-y-auto py-3 scrollbar-thin">
          {NAV_GROUPS.map((group) => (
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

          {/* System: Settings */}
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

          {/* AI Agent Status Footer */}
          <div className="mt-auto flex items-center gap-3 px-2 pb-3 pt-3">
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
        </nav>
      </aside>

      {/* ── Main Content Area ── */}
      <main
        className={`pt-14 transition-all duration-200 ${
          sidebarExpanded ? "ml-60" : "ml-[60px]"
        }`}
      >
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 scrollbar-thin">
          {children}
        </div>
      </main>
    </div>
  );
}
