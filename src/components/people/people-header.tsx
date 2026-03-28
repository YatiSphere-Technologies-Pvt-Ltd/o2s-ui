"use client";

import { motion } from "framer-motion";
import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type PrimaryView = "directory" | "orgchart" | "analytics";

interface PeopleHeaderProps {
  primaryView: PrimaryView;
  onPrimaryViewChange: (view: PrimaryView) => void;
  totalCount: number;
}

const PRIMARY_TABS: { value: PrimaryView; label: string }[] = [
  { value: "directory", label: "Directory" },
  { value: "orgchart", label: "Org Chart" },
  { value: "analytics", label: "Analytics" },
];

export function PeopleHeader({
  primaryView,
  onPrimaryViewChange,
  totalCount,
}: PeopleHeaderProps) {
  return (
    <div className="w-full px-6 py-4 flex items-center justify-between">
      {/* Left */}
      <div>
        <h1 className="text-xl font-bold text-foreground">People</h1>
        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">{totalCount}</span>{" "}
          employees{" \u00B7 "}
          <span className="text-foreground font-semibold">8</span>{" "}
          departments{" \u00B7 "}
          <span className="text-foreground font-semibold">4</span> locations
        </p>
      </div>

      {/* Center — Segmented Pill Control */}
      <div className="flex items-center bg-background rounded-full p-1 border border-border">
        {PRIMARY_TABS.map((tab) => {
          const isActive = primaryView === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onPrimaryViewChange(tab.value)}
              className="relative px-4 py-1.5 text-sm font-medium rounded-full transition-colors"
            >
              {isActive && (
                <motion.span
                  layoutId="people-primary-tab"
                  className="absolute inset-0 bg-brand rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
                />
              )}
              <span
                className={`relative z-10 ${
                  isActive ? "text-white" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right */}
      <div className="flex gap-3">
        <Button
          size="sm"
          className="bg-brand text-white hover:bg-brand/90"
          aria-label="Add a new employee"
        >
          <Plus className="size-3.5" />
          Add Employee
        </Button>
        <Button
          size="sm"
          className="bg-brand-purple/10 border border-brand-purple/20 text-brand-purple hover:bg-brand-purple/20"
          aria-label="Open AI actions"
        >
          <Sparkles className="size-3.5" />
          AI Actions
        </Button>
      </div>
    </div>
  );
}
