"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserCheck, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ONBOARDING_TABS,
  STATS,
  NEW_HIRES,
  type OnboardingTab,
} from "@/components/onboarding-hub/data";
import { ActiveTab } from "@/components/onboarding-hub/active-tab";
import { PreboardingTab } from "@/components/onboarding-hub/preboarding-tab";
import { TasksTab } from "@/components/onboarding-hub/tasks-tab";
import { SurveysTab } from "@/components/onboarding-hub/surveys-tab";
import { AnalyticsTab } from "@/components/onboarding-hub/analytics-tab";

const departments = Array.from(new Set(NEW_HIRES.map((h) => h.department)));
const statuses = ["All Status", "On Track", "At Risk"];

const fadeVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

export default function OnboardingHubPage() {
  const [activeTab, setActiveTab] = useState<OnboardingTab>("active");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [status, setStatus] = useState("All Status");

  const filteredHires = useMemo(() => {
    return NEW_HIRES.filter((h) => {
      const matchesSearch =
        !search ||
        h.name.toLowerCase().includes(search.toLowerCase()) ||
        h.role.toLowerCase().includes(search.toLowerCase());
      const matchesDept =
        department === "All Departments" || h.department === department;
      const matchesStatus =
        status === "All Status" ||
        (status === "At Risk" && h.atRisk) ||
        (status === "On Track" && !h.atRisk);
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [search, department, status]);

  function renderTab() {
    switch (activeTab) {
      case "active":
        return <ActiveTab hires={filteredHires} />;
      case "preboarding":
        return <PreboardingTab hires={filteredHires} />;
      case "timeline":
        return (
          <div className="flex items-center justify-center rounded-xl border border-border bg-card p-12 text-muted-foreground">
            Timeline view coming soon
          </div>
        );
      case "tasks":
        return <TasksTab />;
      case "surveys":
        return <SurveysTab />;
      case "analytics":
        return <AnalyticsTab />;
      default:
        return null;
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <UserCheck className="size-6 text-brand-teal" />
          <h1 className="text-2xl font-bold text-foreground">Onboarding</h1>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage new hire journeys from pre-boarding to graduation. AI handles
          the busywork.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="flex flex-wrap gap-6 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="size-2 rounded-full bg-brand-teal" />
          <span className="text-muted-foreground">Active:</span>
          <span className="font-semibold text-foreground">{STATS.active}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="size-2 rounded-full bg-info" />
          <span className="text-muted-foreground">Pre-boarding:</span>
          <span className="font-semibold text-foreground">
            {STATS.preboarding}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="size-2 rounded-full bg-success" />
          <span className="text-muted-foreground">Completed (Q1):</span>
          <span className="font-semibold text-foreground">
            {STATS.completedQ1}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="size-2 rounded-full bg-destructive animate-pulse" />
          <span className="text-muted-foreground">At Risk:</span>
          <span className="font-semibold text-destructive">
            {STATS.atRisk}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="size-2 rounded-full bg-brand-purple" />
          <span className="text-muted-foreground">Avg Ramp:</span>
          <span className="font-semibold text-foreground">
            {STATS.avgRamp}d
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search new hires..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 pl-9 pr-4 text-sm"
          />
        </div>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          <option>All Departments</option>
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-9 rounded-lg border border-border bg-card px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <Button className="bg-brand-teal text-white hover:bg-brand-teal/90">
          <Plus className="size-4" />
          New Hire
        </Button>
      </div>

      {/* Tab Pills */}
      <div className="flex flex-wrap gap-2">
        {ONBOARDING_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-brand-teal text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`ml-1 rounded-full px-1.5 text-[10px] font-bold ${
                  activeTab === tab.key
                    ? "bg-white/20 text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
