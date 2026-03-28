"use client";

import { motion } from "framer-motion";
import { Plus, Eye, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CAMPAIGNS } from "@/components/legal/policies/data";

const fadeIn = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
};

const CAMPAIGN_STATUS_CONFIG: Record<
  string,
  { bgClass: string; textClass: string }
> = {
  sent: { bgClass: "bg-brand/10", textClass: "text-brand" },
  completed: { bgClass: "bg-success/10", textClass: "text-success" },
  draft: { bgClass: "bg-secondary", textClass: "text-muted-foreground" },
};

export function DistributionTab() {
  return (
    <motion.div {...fadeIn} className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {CAMPAIGNS.length} campaigns
        </div>
        <Button
          size="sm"
          className="bg-destructive text-white hover:bg-destructive/90"
        >
          <Plus className="size-3.5" />
          New Campaign
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {CAMPAIGNS.map((c) => {
          const cfg = CAMPAIGN_STATUS_CONFIG[c.status] ?? CAMPAIGN_STATUS_CONFIG.draft;
          const pending =
            c.progress.sent - c.progress.acknowledged - c.progress.overdue;
          const ackPct =
            c.progress.sent > 0
              ? Math.round((c.progress.acknowledged / c.progress.sent) * 100)
              : 0;

          return (
            <div
              key={c.id}
              className="bg-card border border-border rounded-xl p-5 space-y-4"
            >
              {/* Name + Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {c.name}
                  </h4>
                  <div className="text-[10px] text-muted-foreground mt-0.5 font-mono">
                    {c.id}
                  </div>
                </div>
                <span
                  className={`text-[10px] font-medium rounded-full px-2 py-0.5 ${cfg.bgClass} ${cfg.textClass}`}
                >
                  {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                </span>
              </div>

              {/* Dates */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Sent: {c.sentAt}</span>
                <span>Deadline: {c.deadline}</span>
              </div>

              {/* Policies */}
              <div className="flex flex-wrap gap-1">
                {c.policies.map((pol) => (
                  <span
                    key={pol}
                    className="text-[10px] bg-secondary text-muted-foreground rounded-full px-2 py-0.5"
                  >
                    {pol}
                  </span>
                ))}
              </div>

              {/* Recipients */}
              <div className="text-xs text-muted-foreground">
                {c.recipients} recipients
              </div>

              {/* Progress Bar */}
              <div className="space-y-1">
                <div className="h-2 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-success"
                    style={{ width: `${ackPct}%` }}
                  />
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {ackPct}% acknowledged
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span>
                  <span className="font-medium text-foreground">
                    {c.progress.sent}
                  </span>{" "}
                  sent
                </span>
                <span>
                  <span className="font-medium text-foreground">
                    {c.progress.opened}
                  </span>{" "}
                  opened
                </span>
                <span>
                  <span className="font-medium text-success">
                    {c.progress.acknowledged}
                  </span>{" "}
                  acknowledged
                </span>
                {c.progress.overdue > 0 && (
                  <span>
                    <span className="font-medium text-destructive">
                      {c.progress.overdue}
                    </span>{" "}
                    overdue
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" size="xs">
                  <Eye className="size-3" />
                  View Details
                </Button>
                {pending > 0 && c.status === "sent" && (
                  <Button variant="outline" size="xs">
                    <Bell className="size-3" />
                    Send Reminder to {pending} Pending
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
