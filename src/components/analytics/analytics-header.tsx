"use client";

import { motion } from "framer-motion";
import {
  CalendarDays,
  RefreshCw,
  Download,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AnalyticsTab } from "@/components/analytics/data";

const TABS: { value: AnalyticsTab; label: string }[] = [
  { value: "overview", label: "Overview" },
  { value: "recruiting", label: "Recruiting" },
  { value: "people", label: "People" },
  { value: "compensation", label: "Compensation" },
  { value: "dei", label: "DEI" },
  { value: "custom", label: "Custom" },
];

interface AnalyticsHeaderProps {
  activeTab: AnalyticsTab;
  onTabChange: (t: AnalyticsTab) => void;
  dateRange?: string;
  onDateRangeChange?: (d: string) => void;
}

export function AnalyticsHeader({ activeTab, onTabChange, dateRange = "Q1 2026" }: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Left — Title */}
      <h1 className="text-xl font-bold text-foreground">Analytics</h1>

      {/* Center — Tab Pills */}
      <div className="flex items-center bg-card rounded-lg p-1">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onTabChange(tab.value)}
              className={`relative px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                isActive
                  ? "text-white"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="analytics-tab-indicator"
                  className="absolute inset-0 bg-brand rounded-md"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <CalendarDays className="h-3.5 w-3.5" />
          {dateRange}
        </Button>

        <Button variant="outline" size="icon-sm">
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>

        <Button variant="outline" size="sm">
          <Download className="h-3.5 w-3.5" />
          Export
          <ChevronDown className="h-3 w-3 ml-1" />
        </Button>

        <Button variant="ghost" size="sm" className="text-brand-purple hover:text-brand-purple">
          <Sparkles className="h-3.5 w-3.5" />
          AI Actions
        </Button>
      </div>
    </div>
  );
}
