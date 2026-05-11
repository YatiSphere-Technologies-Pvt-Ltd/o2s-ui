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
      { label: "Delivery home", href: "/delivery" },
      { label: "Agent tower", href: "/delivery/agents" },
    ],
  },
  {
    group: "Admin & Security",
    items: [
      { label: "Admin overview", href: "/admin" },
      { label: "Modules & entitlements", href: "/admin/modules" },
      { label: "Module catalog (Super Admin)", href: "/admin/modules/catalog" },
      { label: "Permission matrix", href: "/admin/permissions" },
      { label: "Roles", href: "/admin/roles" },
      { label: "Users", href: "/admin/users" },
      { label: "Groups", href: "/admin/groups" },
      { label: "Admin audit log", href: "/admin/audit" },
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
