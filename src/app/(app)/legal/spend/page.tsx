"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LegalSubNav } from "@/components/legal/legal-sub-nav";
import {
  SPEND_KPIS,
  SPEND_TABS,
  type SpendTab,
} from "@/components/legal/spend/data";
import { FirmsTab } from "@/components/legal/spend/firms-tab";
import { EngagementsTab } from "@/components/legal/spend/engagements-tab";
import { InvoicesTab } from "@/components/legal/spend/invoices-tab";
import { BudgetTab } from "@/components/legal/spend/budget-tab";
import { SpendAnalyticsTab } from "@/components/legal/spend/spend-analytics-tab";

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

function TabContent({ tab }: { tab: SpendTab }) {
  switch (tab) {
    case "firms":
      return <FirmsTab />;
    case "engagements":
      return <EngagementsTab />;
    case "invoices":
      return <InvoicesTab />;
    case "budget":
      return <BudgetTab />;
    case "analytics":
      return <SpendAnalyticsTab />;
  }
}

export default function LegalSpendPage() {
  const [activeTab, setActiveTab] = useState<SpendTab>("firms");

  return (
    <motion.div {...fadeIn} className="space-y-6">
      <LegalSubNav activePage="spend" />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10">
            <DollarSign className="size-5 text-destructive" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Outside Counsel &amp; Legal Spend
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage law firm relationships, engagements, invoices, and legal
              budget
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="bg-destructive text-white hover:bg-destructive/90"
            size="sm"
          >
            <Plus className="size-3.5 mr-1" />
            Add Firm
          </Button>
          <Button variant="outline" size="sm">
            <Plus className="size-3.5 mr-1" />
            Engagement
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SPEND_KPIS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="text-xs text-muted-foreground">{kpi.label}</div>
            <div className="font-bold text-lg text-foreground mt-1">
              {kpi.value}
            </div>
            <div
              className={`text-[10px] mt-0.5 ${
                kpi.positive ? "text-success" : "text-warning"
              }`}
            >
              {kpi.subtext}
            </div>
          </div>
        ))}
      </div>

      {/* Tab Pills */}
      <div className="flex items-center gap-1 bg-secondary rounded-lg p-0.5 w-fit">
        {SPEND_TABS.map((tab) => (
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
              <span className="ml-1.5 inline-flex items-center justify-center min-w-4 h-4 text-[10px] font-medium rounded-full bg-destructive/10 text-destructive px-1">
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
