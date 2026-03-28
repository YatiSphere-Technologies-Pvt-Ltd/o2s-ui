"use client";

import { motion } from "framer-motion";
import {
  ACTIVITY_LOG,
  ACTIVITY_TYPE_CONFIG,
} from "@/components/settings/users/data";

const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.03 },
  },
};

const rowVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function ActivityTab() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-muted-foreground">
              <th className="w-10 px-3 py-2.5" />
              <th className="text-left px-3 py-2.5 font-medium">User</th>
              <th className="text-left px-3 py-2.5 font-medium">Action</th>
              <th className="text-left px-3 py-2.5 font-medium hidden md:table-cell">
                Target
              </th>
              <th className="text-left px-3 py-2.5 font-medium">Timestamp</th>
            </tr>
          </thead>
          <motion.tbody
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {ACTIVITY_LOG.map((entry) => {
              const config = ACTIVITY_TYPE_CONFIG[entry.type];
              return (
                <motion.tr
                  key={entry.id}
                  variants={rowVariants}
                  className="border-b border-border last:border-b-0 hover:bg-surface-overlay transition-colors"
                >
                  <td className="px-3 py-2.5 text-center">
                    <span className="text-sm" role="img" aria-label={entry.type}>
                      {config.icon}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-sm font-medium text-foreground">
                      {entry.user}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-xs text-muted-foreground">
                      {entry.action}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 hidden md:table-cell">
                    <span className="text-xs text-muted-foreground">
                      {entry.target}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {entry.timestamp}
                    </span>
                  </td>
                </motion.tr>
              );
            })}
          </motion.tbody>
        </table>
      </div>
    </div>
  );
}
