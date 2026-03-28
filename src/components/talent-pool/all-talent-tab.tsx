"use client";

import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  POOL_CANDIDATES,
  SOURCE_CONFIG,
  ENGAGEMENT_CONFIG,
  STAGE_CONFIG,
  matchColor,
  matchLabel,
} from "@/components/talent-pool/data";

const rowVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.03, duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

export function AllTalentTab() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            <th className="w-10 px-4 py-3">
              <Checkbox />
            </th>
            <th className="px-3 py-3 font-medium">Candidate</th>
            <th className="px-3 py-3 font-medium">Company</th>
            <th className="px-3 py-3 font-medium">Source</th>
            <th className="px-3 py-3 font-medium">Engagement</th>
            <th className="px-3 py-3 font-medium">Stage</th>
            <th className="px-3 py-3 font-medium">AI Match</th>
            <th className="px-3 py-3 font-medium">Skills</th>
            <th className="w-10 px-3 py-3" />
          </tr>
        </thead>
        <tbody>
          {POOL_CANDIDATES.map((c, i) => {
            const source = SOURCE_CONFIG[c.source];
            const engagement = ENGAGEMENT_CONFIG[c.engagement];
            const stage = STAGE_CONFIG[c.stage];

            return (
              <motion.tr
                key={c.id}
                custom={i}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                className="border-b border-border last:border-b-0 hover:bg-surface-overlay transition-colors"
              >
                {/* Checkbox */}
                <td className="px-4 py-3">
                  <Checkbox />
                </td>

                {/* Candidate */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-purple/15 text-xs font-semibold text-brand-purple">
                      {c.initials}
                    </div>
                    <div>
                      <div className="font-medium text-foreground">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.role}</div>
                    </div>
                  </div>
                </td>

                {/* Company */}
                <td className="px-3 py-3 text-muted-foreground">{c.company}</td>

                {/* Source */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`size-2 rounded-full ${source?.dotClass ?? "bg-muted-foreground"}`} />
                    <span className="text-muted-foreground">{source?.label ?? c.source}</span>
                  </div>
                </td>

                {/* Engagement */}
                <td className="px-3 py-3">
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={`inline-flex w-fit items-center rounded-md px-1.5 py-0.5 text-xs font-medium ${engagement?.bgClass ?? "bg-secondary"} ${engagement?.colorClass ?? "text-muted-foreground"}`}
                    >
                      {engagement?.label ?? c.engagement}
                    </span>
                    <span className="text-xs text-muted-foreground">{c.lastContacted}</span>
                  </div>
                </td>

                {/* Stage */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`size-2 rounded-full ${stage?.dotClass ?? "bg-muted-foreground"}`} />
                    <span className="text-muted-foreground">{stage?.label ?? c.stage}</span>
                  </div>
                </td>

                {/* AI Match */}
                <td className="px-3 py-3">
                  {c.aiMatch !== null ? (
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-semibold ${matchColor(c.aiMatch)}`}>
                        {c.aiMatch}%
                      </span>
                      <span className="text-xs text-muted-foreground">{matchLabel(c.aiMatch)}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">--</span>
                  )}
                </td>

                {/* Skills */}
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1 flex-wrap">
                    {c.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-md bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </td>

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
  );
}
