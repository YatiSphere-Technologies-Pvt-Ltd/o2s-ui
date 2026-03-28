"use client";

import { motion } from "framer-motion";
import { History } from "lucide-react";
import { HistoryTab } from "@/components/cv-screening/history-tab";

export default function CVScreeningHistoryPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <History className="size-5 text-brand-purple" />
          <h1 className="text-xl font-bold text-foreground">Screening History</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Complete history of all CV screenings with scores, recommendations, and actions taken.
        </p>
      </div>
      <HistoryTab />
    </motion.div>
  );
}
