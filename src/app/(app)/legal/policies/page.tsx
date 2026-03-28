"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalSubNav } from "@/components/legal/legal-sub-nav";
import {
  POLICY_KPIS,
  POLICY_TABS,
  type PolicyTab,
} from "@/components/legal/policies/data";
import { AllPoliciesTab } from "@/components/legal/policies/all-policies-tab";
import { HandbookTab } from "@/components/legal/policies/handbook-tab";
import { AcknowledgmentsTab } from "@/components/legal/policies/acknowledgments-tab";
import { DistributionTab } from "@/components/legal/policies/distribution-tab";
import { PolicyAnalyticsTab } from "@/components/legal/policies/policy-analytics-tab";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

const tabVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

function TabContent({ tab }: { tab: PolicyTab }) {
  switch (tab) {
    case "all":
      return <AllPoliciesTab />;
    case "handbook":
      return <HandbookTab />;
    case "acknowledgments":
      return <AcknowledgmentsTab />;
    case "distribution":
      return <DistributionTab />;
    case "analytics":
      return <PolicyAnalyticsTab />;
  }
}

export default function PoliciesPage() {
  const [activeTab, setActiveTab] = useState<PolicyTab>("all");

  return (
    <motion.div {...fadeIn} className="space-y-6">
      <LegalSubNav activePage="policies" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10">
            <BookOpen className="size-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Policy Hub</h1>
            <p className="text-sm text-muted-foreground">
              Company policies, handbooks, and acknowledgments
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            <Plus className="size-3.5" />
            New Policy
          </Button>
          <Button variant="outline" size="sm">
            <Send className="size-3.5" />
            Distribute
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {POLICY_KPIS.map((kpi) => {
          const isOverdue =
            kpi.label === "Overdue Ack." && Number(kpi.value) > 0;
          return (
            <div
              key={kpi.label}
              className={`bg-card border border-border rounded-xl p-4 ${
                isOverdue ? "bg-destructive/5" : ""
              }`}
            >
              <div className="text-xs text-muted-foreground">{kpi.label}</div>
              <div className="text-lg font-bold text-foreground mt-1">
                {kpi.value}
              </div>
              {kpi.subtext && (
                <div className="text-[10px] text-muted-foreground mt-0.5">
                  {kpi.subtext}
                </div>
              )}
              {kpi.trend && (
                <div
                  className={`text-[10px] mt-0.5 ${
                    kpi.positive ? "text-success" : "text-destructive"
                  }`}
                >
                  {kpi.trend}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tab Pills */}
      <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5 w-fit">
        {POLICY_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === tab.key
                ? "bg-card text-foreground font-medium shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="ml-1.5 text-[10px] text-muted-foreground">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} {...tabVariants}>
          <TabContent tab={activeTab} />
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
