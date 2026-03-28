"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Database, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  POOL_TABS,
  TOTAL_CANDIDATES,
  TOTAL_POOLS,
  ACTIVE_CAMPAIGNS,
  type PoolTab,
} from "@/components/talent-pool/data";
import { TASubNav } from "@/components/ta/ta-sub-nav";
import { AllTalentTab } from "@/components/talent-pool/all-talent-tab";
import { PoolsTab } from "@/components/talent-pool/pools-tab";
import { NurtureTab } from "@/components/talent-pool/nurture-tab";
import { AISourcingTab } from "@/components/talent-pool/ai-sourcing-tab";
import { PoolAnalyticsTab } from "@/components/talent-pool/pool-analytics-tab";

const tabContent: Record<PoolTab, React.ComponentType> = {
  all: AllTalentTab,
  pools: PoolsTab,
  nurture: NurtureTab,
  aiSourcing: AISourcingTab,
  analytics: PoolAnalyticsTab,
};

export default function TalentPoolPage() {
  const [activeTab, setActiveTab] = useState<PoolTab>("all");

  const ActiveComponent = tabContent[activeTab];

  return (
    <div className="flex flex-col gap-6">
      <TASubNav activePage="pool" />
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-purple/10">
            <Database className="size-5 text-brand-purple" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Talent Pool</h1>
            <p className="text-sm text-muted-foreground">
              {TOTAL_CANDIDATES} candidates &middot; {TOTAL_POOLS} pools &middot;{" "}
              {ACTIVE_CAMPAIGNS} campaigns
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="gap-1.5 text-muted-foreground">
            <Sparkles className="size-4" />
            AI Import
          </Button>
          <Button className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90">
            <Plus className="size-4" />
            New Pool
          </Button>
        </div>
      </div>

      {/* Tab Pills */}
      <div className="flex items-center gap-1 rounded-lg bg-secondary p-1">
        {POOL_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const }}
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
