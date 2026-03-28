"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  INTERVIEW_TABS,
  INTERVIEW_COUNTS,
  type InterviewTab,
} from "@/components/interviews/data";
import { TASubNav } from "@/components/ta/ta-sub-nav";
import { ScheduleTab } from "@/components/interviews/schedule-tab";
import { FeedbackTab } from "@/components/interviews/feedback-tab";
import { KitsTab } from "@/components/interviews/kits-tab";
import { DebriefsTab } from "@/components/interviews/debriefs-tab";
import { InterviewersTab } from "@/components/interviews/interviewers-tab";
import { InterviewAnalyticsTab } from "@/components/interviews/interview-analytics-tab";

const tabContent: Record<InterviewTab, React.ComponentType> = {
  schedule: ScheduleTab,
  feedback: FeedbackTab,
  kits: KitsTab,
  debriefs: DebriefsTab,
  interviewers: InterviewersTab,
  analytics: InterviewAnalyticsTab,
};

export default function InterviewsPage() {
  const [activeTab, setActiveTab] = useState<InterviewTab>("schedule");

  const ActiveComponent = tabContent[activeTab];

  return (
    <div className="flex flex-col gap-6">
      <TASubNav activePage="interviews" />
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand/10">
            <Calendar className="size-5 text-brand" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Interview Management
            </h1>
            <p className="text-sm text-muted-foreground">
              {INTERVIEW_COUNTS.upcoming} upcoming &middot;{" "}
              {INTERVIEW_COUNTS.completed} completed &middot;{" "}
              {INTERVIEW_COUNTS.pendingDebriefs} pending debriefs
            </p>
          </div>
        </div>
        <Button className="gap-1.5 bg-brand-purple text-white hover:bg-brand-purple/90">
          <Sparkles className="size-4" />
          AI Schedule
        </Button>
      </div>

      {/* Tab Pills */}
      <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-secondary p-1">
        {INTERVIEW_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`relative whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
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
