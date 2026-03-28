"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AGENTS,
  ACTIVE_AGENT_COUNT,
  TOTAL_AGENT_COUNT,
  TOTAL_ACTIONS_MTD,
} from "@/components/settings/ai-data";

const usageLimit = 15_000;
const usagePercent = (TOTAL_ACTIONS_MTD / usageLimit) * 100;

export function GlobalStatusBar() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="relative bg-brand-purple/[0.04] border border-brand-purple/20 rounded-xl overflow-hidden">
      {/* Top gradient border */}
      <div className="h-[2px] bg-linear-to-r from-brand-purple via-info to-brand" />

      <div className="p-5 space-y-4">
        {/* Row 1: System status */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
          <span className="flex items-center gap-2 font-medium text-foreground">
            <span className="size-2 rounded-full bg-success inline-block" />
            System Status: Operational
          </span>
          <span className="text-muted-foreground">
            {ACTIVE_AGENT_COUNT}/{TOTAL_AGENT_COUNT} agents active
          </span>
          <span className="text-muted-foreground">
            {TOTAL_ACTIONS_MTD.toLocaleString()} actions MTD
          </span>
        </div>

        {/* Row 2: Agent pills */}
        <div className="flex flex-wrap gap-1.5">
          {AGENTS.map((agent) => {
            const isActive = agent.status === "active";
            return (
              <span
                key={agent.id}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive
                    ? "bg-success/10 text-success"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {agent.abbr}
              </span>
            );
          })}
        </div>

        {/* Row 3: Last action */}
        <p className="text-xs text-muted-foreground">
          Last AI action: 3 min ago &mdash; Recruiter Agent screened 4
          applications
        </p>

        {/* Row 4: Usage bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              AI usage: {TOTAL_ACTIONS_MTD.toLocaleString()} /{" "}
              {usageLimit.toLocaleString()} actions ({usagePercent.toFixed(1)}%)
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-brand-purple"
              initial={{ width: 0 }}
              animate={{ width: mounted ? `${usagePercent}%` : 0 }}
              transition={{ duration: 0.8, ease: "easeOut" as const }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
