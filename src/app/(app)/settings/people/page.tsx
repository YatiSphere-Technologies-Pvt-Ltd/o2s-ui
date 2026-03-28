"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { UserCircle } from "lucide-react";
import { PEOPLE_HR_TABS } from "@/components/settings/people-hr/data";
import type { PeopleHRTab } from "@/components/settings/people-hr/data";
import { ProfilesTab } from "@/components/settings/people-hr/profiles-tab";
import { OrgStructureTab } from "@/components/settings/people-hr/org-structure-tab";
import { LeaveTab } from "@/components/settings/people-hr/leave-tab";
import { CompensationTab } from "@/components/settings/people-hr/compensation-tab";
import { OnboardingTab } from "@/components/settings/people-hr/onboarding-tab";
import { OffboardingTab } from "@/components/settings/people-hr/offboarding-tab";
import { DocumentsTab } from "@/components/settings/people-hr/documents-tab";
import { SelfServiceTab } from "@/components/settings/people-hr/self-service-tab";

const TAB_COMPONENTS: Record<PeopleHRTab, React.ComponentType> = {
  profiles: ProfilesTab,
  orgStructure: OrgStructureTab,
  leave: LeaveTab,
  compensation: CompensationTab,
  onboarding: OnboardingTab,
  offboarding: OffboardingTab,
  documents: DocumentsTab,
  selfService: SelfServiceTab,
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

export default function PeopleSettingsPage() {
  const [activeTab, setActiveTab] = useState<PeopleHRTab>("profiles");

  const ActiveComponent = TAB_COMPONENTS[activeTab];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Header ── */}
      <div>
        <div className="flex items-center gap-2.5">
          <UserCircle className="size-5 text-brand" />
          <h1 className="text-lg font-semibold text-foreground">
            People &amp; HR Settings
          </h1>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Configure employee lifecycle, leave policies, compensation, org
          structure, and offboarding.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Last updated 3 hours ago by Meera Patel
        </p>
      </div>

      {/* ── Tab Pills ── */}
      <div className="flex overflow-x-auto gap-1.5 pb-1 -mb-1">
        {PEOPLE_HR_TABS.map((tab) => (
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
