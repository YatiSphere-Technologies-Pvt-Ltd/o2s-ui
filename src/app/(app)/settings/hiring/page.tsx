"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { HIRING_TABS } from "@/components/settings/hiring/data";
import type { HiringTab } from "@/components/settings/hiring/data";
import { PipelinesTab } from "@/components/settings/hiring/pipelines-tab";
import { ScorecardsTab } from "@/components/settings/hiring/scorecards-tab";
import { EmailsTab } from "@/components/settings/hiring/emails-tab";
import { OffersTab } from "@/components/settings/hiring/offers-tab";
import { SchedulingTab } from "@/components/settings/hiring/scheduling-tab";
import { CareerTab } from "@/components/settings/hiring/career-tab";
import { FormsTab } from "@/components/settings/hiring/forms-tab";

const TAB_COMPONENTS: Record<HiringTab, React.ComponentType> = {
  pipelines: PipelinesTab,
  scorecards: ScorecardsTab,
  emails: EmailsTab,
  offers: OffersTab,
  scheduling: SchedulingTab,
  career: CareerTab,
  forms: FormsTab,
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

export default function HiringSettingsPage() {
  const [activeTab, setActiveTab] = useState<HiringTab>("pipelines");

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-2.5">
          <Briefcase className="size-5 text-brand" />
          <h1 className="text-lg font-semibold text-foreground">Hiring Settings</h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Configure your hiring pipeline, templates, scheduling, and career page.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated 2 hours ago by Prashant Singh
        </p>
      </div>

      {/* ── Tab Pills ── */}
      <div className="flex overflow-x-auto gap-1.5 pb-1 -mb-1">
        {HIRING_TABS.map((tab) => (
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
