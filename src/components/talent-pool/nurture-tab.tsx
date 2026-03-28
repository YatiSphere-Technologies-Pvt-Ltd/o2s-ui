"use client";

import { motion } from "framer-motion";
import { Plus, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NURTURE_CAMPAIGNS,
  CAMPAIGN_STATUS_CONFIG,
} from "@/components/talent-pool/data";

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function NurtureTab() {
  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-end">
        <Button className="gap-1.5 bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="size-4" />
          New Campaign
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">Campaign Name</th>
              <th className="px-3 py-3 font-medium">Pool</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 font-medium text-right">Sent</th>
              <th className="px-3 py-3 font-medium text-right">Opened</th>
              <th className="px-3 py-3 font-medium text-right">Replied</th>
              <th className="px-3 py-3 font-medium">Last Sent</th>
              <th className="w-10 px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {NURTURE_CAMPAIGNS.map((campaign, i) => {
              const statusCfg = CAMPAIGN_STATUS_CONFIG[campaign.status];
              const isDraft = campaign.status === "draft";

              return (
                <motion.tr
                  key={campaign.id}
                  custom={i}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  className={`border-b border-border last:border-b-0 hover:bg-surface-overlay transition-colors ${
                    isDraft ? "opacity-50" : ""
                  }`}
                >
                  {/* Campaign Name */}
                  <td className="px-4 py-3">
                    <span className="text-sm font-medium text-foreground">{campaign.name}</span>
                  </td>

                  {/* Pool */}
                  <td className="px-3 py-3">
                    <span className="text-xs text-muted-foreground">{campaign.pool}</span>
                  </td>

                  {/* Status */}
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`size-2 rounded-full ${statusCfg?.dotClass ?? "bg-muted-foreground"}`}
                      />
                      <span className={`text-xs font-medium ${statusCfg?.textClass ?? "text-muted-foreground"}`}>
                        {statusCfg?.label ?? campaign.status}
                      </span>
                    </div>
                  </td>

                  {/* Sent */}
                  <td className="px-3 py-3 text-right text-muted-foreground">
                    {campaign.sent}
                  </td>

                  {/* Opened */}
                  <td className="px-3 py-3 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-foreground">{campaign.opened}</span>
                      <span className="text-xs text-muted-foreground">{campaign.openRate}%</span>
                    </div>
                  </td>

                  {/* Replied */}
                  <td className="px-3 py-3 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-foreground">{campaign.replied}</span>
                      <span className="text-xs text-muted-foreground">{campaign.replyRate}%</span>
                    </div>
                  </td>

                  {/* Last Sent */}
                  <td className="px-3 py-3 text-muted-foreground">{campaign.lastSent}</td>

                  {/* Actions */}
                  <td className="px-3 py-3">
                    <button className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-surface-overlay hover:text-foreground transition-colors">
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
