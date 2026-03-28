"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AnalyticsHeader } from "@/components/analytics/analytics-header";
import { AIInsightsBar } from "@/components/analytics/ai-insights-bar";
import { KPIRow } from "@/components/analytics/kpi-row";
import { OverviewCharts } from "@/components/analytics/overview-charts";
import { RecruitingCharts } from "@/components/analytics/recruiting-charts";
import { PeopleCharts } from "@/components/analytics/people-charts";
import { CompensationCharts } from "@/components/analytics/compensation-charts";
import { DEICharts } from "@/components/analytics/dei-charts";
import { CustomReports } from "@/components/analytics/custom-reports";
import { AINarrativeReport } from "@/components/analytics/ai-narrative-report";
import {
  type AnalyticsTab,
  OVERVIEW_KPIS,
  RECRUITING_KPIS,
  PEOPLE_KPIS,
  COMP_KPIS,
  DEI_KPIS,
} from "@/components/analytics/data";

const tabMotion = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.25, ease: "easeInOut" as const },
};

function getKPIsForTab(tab: AnalyticsTab) {
  switch (tab) {
    case "overview":
      return OVERVIEW_KPIS;
    case "recruiting":
      return RECRUITING_KPIS;
    case "people":
      return PEOPLE_KPIS;
    case "compensation":
      return COMP_KPIS;
    case "dei":
      return DEI_KPIS;
    case "custom":
      return OVERVIEW_KPIS;
  }
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<AnalyticsTab>("overview");
  const [dateRange, setDateRange] = useState("Q1 2026");

  const currentKPIs = getKPIsForTab(activeTab);

  return (
    <div className="h-full overflow-y-auto">
      <AnalyticsHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />
      <div className="px-6 space-y-6 pb-12">
        <AIInsightsBar />
        <KPIRow kpis={currentKPIs} />
        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <motion.div key="overview" {...tabMotion} className="space-y-6">
              <OverviewCharts />
              <AINarrativeReport />
            </motion.div>
          )}
          {activeTab === "recruiting" && (
            <motion.div key="recruiting" {...tabMotion} className="space-y-6">
              <RecruitingCharts />
            </motion.div>
          )}
          {activeTab === "people" && (
            <motion.div key="people" {...tabMotion} className="space-y-6">
              <PeopleCharts />
            </motion.div>
          )}
          {activeTab === "compensation" && (
            <motion.div key="comp" {...tabMotion} className="space-y-6">
              <CompensationCharts />
            </motion.div>
          )}
          {activeTab === "dei" && (
            <motion.div key="dei" {...tabMotion} className="space-y-6">
              <DEICharts />
            </motion.div>
          )}
          {activeTab === "custom" && (
            <motion.div key="custom" {...tabMotion} className="space-y-6">
              <CustomReports />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
