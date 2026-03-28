"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { PERF_SETTINGS_TABS } from "@/components/settings/performance/data";
import type { PerfSettingsTab } from "@/components/settings/performance/data";
import { CyclesTab } from "@/components/settings/performance/cycles-tab";
import { RatingsTab } from "@/components/settings/performance/ratings-tab";
import { CompetenciesTab } from "@/components/settings/performance/competencies-tab";
import { CalibrationTab } from "@/components/settings/performance/calibration-tab";
import { GoalsTab } from "@/components/settings/performance/goals-tab";
import { PrivacyTab } from "@/components/settings/performance/privacy-tab";
import { AutomationTab } from "@/components/settings/performance/automation-tab";
import { AiAgentTab } from "@/components/settings/performance/ai-agent-tab";

const TAB_COMPONENTS: Record<PerfSettingsTab, React.ComponentType> = {
  cycles: CyclesTab,
  ratings: RatingsTab,
  competencies: CompetenciesTab,
  calibration: CalibrationTab,
  goals: GoalsTab,
  privacy: PrivacyTab,
  automation: AutomationTab,
  aiAgent: AiAgentTab,
};

const tabContentVariants = {
  enter: { opacity: 0, y: 8 },
  center: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: { duration: 0.15, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function PerformanceSettingsPage() {
  const [activeTab, setActiveTab] = useState<PerfSettingsTab>("cycles");

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-2.5">
          <BarChart3 className="size-5 text-brand" />
          <h1 className="text-lg font-semibold text-foreground">
            Performance &amp; Appraisal Settings
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Configure review cycles, rating scales, competency frameworks, calibration rules, and AI
          agent behavior.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated 1 day ago by Prashant Singh
        </p>
      </div>

      {/* ── Tab Pills ── */}
      <div className="flex overflow-x-auto gap-1.5 pb-1 -mb-1">
        {PERF_SETTINGS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors shrink-0 ${
              activeTab === tab.key
                ? "bg-brand text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab Content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabContentVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          <ActiveComponent />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
