"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const COMMANDS = [
  {
    group: "Navigation",
    items: [
      { label: "Home", href: "/dashboard" },
      { label: "Command Center", href: "/command-center" },
      { label: "Analytics", href: "/analytics" },
      { label: "People", href: "/people" },
      { label: "Performance", href: "/performance" },
      { label: "Goals & OKRs", href: "/goals" },
    ],
  },
  {
    group: "Leave Management",
    items: [
      { label: "My Leave", href: "/leave" },
      { label: "HR Overview (Leave)", href: "/leave/hr" },
      { label: "All Requests (HR)", href: "/leave/hr/requests" },
      { label: "Anomaly Review", href: "/leave/hr/anomalies" },
      { label: "Employee Directory", href: "/leave/hr/employees" },
      { label: "Agent control center", href: "/leave/hr/agents" },
      { label: "Compliance Watchdog", href: "/leave/hr/compliance" },
      { label: "Reports hub", href: "/leave/hr/reports" },
      { label: "Report builder", href: "/leave/hr/reports/builder" },
      { label: "Liability dashboard", href: "/leave/hr/reports/liability" },
      { label: "Compliance dashboard", href: "/leave/hr/reports/compliance" },
      { label: "Audit log", href: "/leave/hr/audit" },
      { label: "DSAR", href: "/leave/hr/dsar" },
      { label: "Scheduled exports", href: "/leave/hr/exports" },
      { label: "Roles & Permissions", href: "/leave/hr/roles" },
      { label: "Tenant settings", href: "/leave/hr/tenant" },
      { label: "Policy builder", href: "/leave/hr/policies" },
      { label: "Leave types library", href: "/leave/hr/policies/types" },
      { label: "Edge cases & empty states", href: "/leave/admin/edge-cases" },
      { label: "Manager Home (Leave)", href: "/leave/manager" },
      { label: "Wellbeing alerts", href: "/leave/manager/wellbeing" },
      { label: "Manager Reports", href: "/leave/manager/reports" },
      { label: "Delegation settings", href: "/leave/manager/delegation" },
      { label: "Leave History", href: "/leave/history" },
      { label: "New leave request", href: "/leave/request" },
      { label: "Leave Calendar", href: "/leave/calendar" },
      { label: "Team Capacity Heatmap", href: "/leave/team" },
      { label: "Leave Approvals", href: "/leave/approvals" },
      { label: "Leave Policies", href: "/leave/policies" },
      { label: "Leave Reports", href: "/leave/reports" },
    ],
  },
  {
    group: "Talent",
    items: [
      { label: "Pipeline", href: "/talent" },
      { label: "Requisitions", href: "/requisitions" },
      { label: "Jobs", href: "/jobs" },
      { label: "CV Screening", href: "/cv-screening" },
    ],
  },
  {
    group: "Delivery & PMO",
    items: [
      { label: "Portfolio overview", href: "/delivery" },
      { label: "Projects", href: "/delivery/projects" },
      { label: "Sprints", href: "/delivery/sprints" },
      { label: "Backlog", href: "/delivery/backlog" },
      { label: "Dependencies", href: "/delivery/dependencies" },
      { label: "Allocation matrix (spreadsheet)", href: "/delivery/allocation" },
      { label: "Capacity & skills", href: "/delivery/capacity" },
      { label: "Time tracking", href: "/delivery/time-tracking" },
      { label: "Releases", href: "/delivery/releases" },
      { label: "Project templates", href: "/delivery/templates" },
      { label: "Agent tower", href: "/delivery/agents" },
      { label: "Financials cockpit", href: "/delivery/financials" },
      { label: "Budgets", href: "/delivery/financials/budgets" },
      { label: "Rate cards", href: "/delivery/financials/rates" },
      { label: "Forecast & scenarios", href: "/delivery/financials/forecast" },
      { label: "Invoices", href: "/delivery/financials/invoices" },
      { label: "Procurement & vendors", href: "/delivery/financials/procurement" },
      { label: "Timesheet approvals", href: "/delivery/financials/approvals" },
    ],
  },
  {
    group: "Pre-Sales & Proposals",
    items: [
      { label: "Pre-Sales overview", href: "/presales" },
      { label: "Pre-Sales agent tower", href: "/presales/agents" },
      { label: "Pursuits", href: "/presales/pursuits" },
    ],
  },
  {
    group: "Legal & Legal Ops",
    items: [
      { label: "Legal overview", href: "/legal" },
      { label: "Legal agent tower", href: "/legal/agents" },
      // CLM
      { label: "Contracts repository", href: "/legal/contracts" },
      { label: "Templates", href: "/legal/contracts/templates" },
      { label: "Negotiation playbook", href: "/legal/contracts/playbooks" },
      { label: "Clause library", href: "/legal/contracts/clauses" },
      { label: "Review counterparty paper", href: "/legal/contracts/review" },
      { label: "New contract — authoring", href: "/legal/contracts/authoring" },
      { label: "Negotiation tracker", href: "/legal/contracts/negotiation" },
      { label: "Signatures hub", href: "/legal/contracts/signatures" },
      { label: "Obligation tracker", href: "/legal/obligations" },
      { label: "Renewal calendar", href: "/legal/renewals" },
      // Stubs
      { label: "Policies", href: "/legal/policies" },
      { label: "Compliance", href: "/legal/compliance" },
      { label: "Documents", href: "/legal/documents" },
      { label: "Cases", href: "/legal/cases" },
      { label: "Immigration", href: "/legal/immigration" },
      { label: "Data Protection", href: "/legal/data-protection" },
      { label: "Legal spend", href: "/legal/spend" },
    ],
  },
  {
    group: "Admin & Security",
    items: [
      { label: "Admin overview", href: "/admin" },
      { label: "Modules & entitlements", href: "/admin/modules" },
      { label: "Module catalog (Super Admin)", href: "/admin/modules/catalog" },
      { label: "Users", href: "/admin/users" },
      { label: "Groups", href: "/admin/groups" },
      // Azure-style RBAC
      { label: "RBAC · Roles", href: "/admin/rbac/roles" },
      { label: "RBAC · Role assignments", href: "/admin/rbac/assignments" },
      { label: "RBAC · My access", href: "/admin/rbac/my-access" },
      // Legacy
      { label: "Roles (legacy)", href: "/admin/roles" },
      { label: "Permission matrix", href: "/admin/permissions" },
      { label: "Admin audit log", href: "/admin/audit" },
    ],
  },
  {
    group: "Module access control",
    items: [
      { label: "Pre-Sales · Access", href: "/presales/access" },
      { label: "Legal · Access",      href: "/legal/access" },
      { label: "Delivery · Access",   href: "/delivery/access" },
      { label: "People · Access",     href: "/people/access" },
      { label: "Leave · Access",      href: "/leave/access" },
      { label: "Talent · Access",     href: "/talent/access" },
      { label: "Finance · Access",    href: "/finance/access" },
      { label: "IT · RBAC",           href: "/it/rbac" },
    ],
  },
  {
    group: "Profile",
    items: [
      { label: "My Profile", href: "/profile" },
      { label: "Preferences", href: "/profile?tab=preferences" },
      { label: "Security", href: "/profile?tab=security" },
      { label: "Privacy & Consent", href: "/profile?tab=privacy" },
      { label: "Notifications", href: "/profile?tab=notifications" },
    ],
  },
];

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex w-full h-9 items-center gap-2 rounded-full border border-border bg-background pl-3 pr-2 text-sm text-muted-foreground hover:bg-surface-overlay transition-colors"
      >
        <Search className="size-4 shrink-0" />
        <span className="flex-1 text-left">Search anything…</span>
        <kbd className="pointer-events-none hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-border bg-secondary px-1.5 font-mono text-[10px] font-medium">
          <span>⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to page, search records, ask Aurora…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {COMMANDS.map((g, idx) => (
            <React.Fragment key={g.group}>
              {idx > 0 && <CommandSeparator />}
              <CommandGroup heading={g.group}>
                {g.items.map((item) => (
                  <CommandItem
                    key={item.href}
                    onSelect={() => runCommand(() => router.push(item.href))}
                  >
                    {item.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </React.Fragment>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
