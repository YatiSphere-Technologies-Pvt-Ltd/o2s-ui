"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Table2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ENGAGEMENTS,
  ENGAGEMENT_STATUS_CONFIG,
  budgetBarColor,
  type Engagement,
} from "@/components/legal/spend/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

function FeeTypeBadge({ fee }: { fee: string }) {
  const colorMap: Record<string, string> = {
    Hourly: "text-brand bg-brand/10",
    "Fixed Fee": "text-brand-teal bg-brand-teal/10",
    Blended: "text-brand-purple bg-brand-purple/10",
  };
  const cls = colorMap[fee] ?? "text-muted-foreground bg-secondary";
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-md ${cls}`}>
      {fee}
    </span>
  );
}

function EngagementRow({ eng }: { eng: Engagement }) {
  const status = ENGAGEMENT_STATUS_CONFIG[eng.status];
  const barColor = budgetBarColor(eng.budgetUtilization);
  const isOver90 = eng.budgetUtilization >= 90;
  const isCompleted = eng.status === "completed";

  return (
    <tr
      className={`border-b border-border hover:bg-secondary/40 transition-colors ${
        isOver90 ? "border-l-[2px] border-l-warning" : ""
      } ${isCompleted ? "text-muted-foreground/60" : ""}`}
    >
      <td className="px-3 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
        {eng.engagementNumber}
      </td>
      <td className="px-3 py-3">
        <div className="text-sm font-medium text-foreground">{eng.title}</div>
        <div className="text-xs text-muted-foreground">{eng.firmName}</div>
      </td>
      <td className="px-3 py-3">
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground">
          {eng.practiceArea}
        </span>
      </td>
      <td className="px-3 py-3">
        <FeeTypeBadge fee={eng.feeArrangement} />
      </td>
      <td className="px-3 py-3 font-mono text-sm text-foreground whitespace-nowrap">
        {eng.budget}
      </td>
      <td className="px-3 py-3 min-w-32">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${barColor}`}
              style={{ width: `${Math.min(eng.budgetUtilization, 100)}%` }}
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground w-8 text-right">
            {eng.budgetUtilization}%
          </span>
        </div>
      </td>
      <td className="px-3 py-3">
        <span className="flex items-center gap-1.5 text-xs whitespace-nowrap">
          <span className={`size-1.5 rounded-full ${status.dotClass}`} />
          <span className={status.textClass}>{status.label}</span>
        </span>
      </td>
      <td className="px-3 py-3 text-xs text-muted-foreground whitespace-nowrap">
        {eng.leadPartner}
      </td>
      <td className="px-3 py-3">
        <Button variant="outline" size="xs">
          View
        </Button>
      </td>
    </tr>
  );
}

function EngagementCard({ eng }: { eng: Engagement }) {
  const status = ENGAGEMENT_STATUS_CONFIG[eng.status];
  const barColor = budgetBarColor(eng.budgetUtilization);

  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-mono text-[10px] text-muted-foreground">
            {eng.engagementNumber}
          </div>
          <h3 className="font-semibold text-sm text-foreground truncate">
            {eng.title}
          </h3>
          <div className="text-xs text-muted-foreground">{eng.firmName}</div>
        </div>
        <span className="flex items-center gap-1.5 text-xs shrink-0">
          <span className={`size-1.5 rounded-full ${status.dotClass}`} />
          <span className={status.textClass}>{status.label}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground">
          {eng.practiceArea}
        </span>
        <FeeTypeBadge fee={eng.feeArrangement} />
      </div>
      <div>
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>Budget: {eng.budget}</span>
          <span>{eng.budgetUtilization}%</span>
        </div>
        <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${barColor}`}
            style={{ width: `${Math.min(eng.budgetUtilization, 100)}%` }}
          />
        </div>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Briefcase className="size-3" />
        {eng.leadPartner}
      </div>
      <div className="pt-2 border-t border-border">
        <Button variant="outline" size="xs">
          View Details
        </Button>
      </div>
    </div>
  );
}

export function EngagementsTab() {
  const [view, setView] = useState<"table" | "cards">("table");

  return (
    <motion.div {...fadeIn} className="space-y-4">
      {/* Toggle */}
      <div className="flex items-center justify-end gap-1">
        <Button
          variant={view === "table" ? "secondary" : "ghost"}
          size="icon-xs"
          onClick={() => setView("table")}
        >
          <Table2 className="size-3.5" />
        </Button>
        <Button
          variant={view === "cards" ? "secondary" : "ghost"}
          size="icon-xs"
          onClick={() => setView("cards")}
        >
          <LayoutGrid className="size-3.5" />
        </Button>
      </div>

      {view === "table" ? (
        <div className="overflow-x-auto bg-card border border-border rounded-xl">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                <th className="px-3 py-2.5 font-medium">Engagement #</th>
                <th className="px-3 py-2.5 font-medium">Title</th>
                <th className="px-3 py-2.5 font-medium">Practice Area</th>
                <th className="px-3 py-2.5 font-medium">Fee Type</th>
                <th className="px-3 py-2.5 font-medium">Budget</th>
                <th className="px-3 py-2.5 font-medium">Spend / Budget</th>
                <th className="px-3 py-2.5 font-medium">Status</th>
                <th className="px-3 py-2.5 font-medium">Lead Partner</th>
                <th className="px-3 py-2.5 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ENGAGEMENTS.map((eng) => (
                <EngagementRow key={eng.id} eng={eng} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ENGAGEMENTS.map((eng) => (
            <EngagementCard key={eng.id} eng={eng} />
          ))}
        </div>
      )}
    </motion.div>
  );
}
