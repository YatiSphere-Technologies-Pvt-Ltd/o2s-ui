"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Scale, Plus, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalSubNav } from "@/components/legal/legal-sub-nav";
import { AllContractsTab } from "@/components/legal/all-contracts-tab";
import { TemplatesTab } from "@/components/legal/templates-tab";
import { ClausesTab } from "@/components/legal/clauses-tab";
import { SignaturesTab } from "@/components/legal/signatures-tab";
import { ContractsAnalyticsTab } from "@/components/legal/contracts-analytics-tab";
import {
  CONTRACT_TABS,
  LEGAL_KPIS,
  type ContractTab,
} from "@/components/legal/data";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

function TabContent({ tab }: { tab: ContractTab }) {
  switch (tab) {
    case "all":
      return <AllContractsTab />;
    case "templates":
      return <TemplatesTab />;
    case "clauses":
      return <ClausesTab />;
    case "signatures":
      return <SignaturesTab />;
    case "analytics":
      return <ContractsAnalyticsTab />;
  }
}

export default function ContractsPage() {
  const [activeTab, setActiveTab] = useState<ContractTab>("all");

  return (
    <div className="space-y-6">
      <LegalSubNav activePage="contracts" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10">
            <Scale className="size-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Contracts & Agreements</h1>
            <p className="text-sm text-muted-foreground">Manage employment contracts, NDAs, vendor agreements and more</p>
          </div>
        </div>
        <Button className="bg-destructive text-white hover:bg-destructive/90" size="sm">
          <Plus className="size-3.5" />
          New Contract
        </Button>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {LEGAL_KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-card border border-border rounded-xl px-4 py-3"
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{kpi.label}</div>
            <div className="text-lg font-bold text-foreground mt-0.5">{kpi.value}</div>
            {kpi.trend && (
              <div className={`flex items-center gap-1 text-[10px] mt-0.5 ${kpi.positive ? "text-success" : "text-destructive"}`}>
                {kpi.positive ? <TrendingUp className="size-2.5" /> : <TrendingDown className="size-2.5" />}
                {kpi.trend}
              </div>
            )}
            {kpi.subtext && (
              <div className={`text-[10px] mt-0.5 ${kpi.positive ? "text-success" : "text-warning"}`}>
                {kpi.subtext}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Tab Pills */}
      <div className="flex items-center gap-1">
        {CONTRACT_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm transition-colors ${
              activeTab === tab.key
                ? "bg-destructive/15 text-destructive font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                activeTab === tab.key
                  ? "bg-destructive/20 text-destructive"
                  : "bg-secondary text-muted-foreground"
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div key={activeTab} {...fadeIn}>
          <TabContent tab={activeTab} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
