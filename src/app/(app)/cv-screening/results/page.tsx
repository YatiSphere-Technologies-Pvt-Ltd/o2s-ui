"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { ResultsTab } from "@/components/cv-screening/results-tab";

export default function CVScreeningResultsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="size-5 text-brand-purple" />
          <h1 className="text-xl font-bold text-foreground">Analysis Results</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Detailed AI analysis of screened CVs with skill matching, scoring breakdown, and recommendations.
        </p>
      </div>
      <ResultsTab />
    </motion.div>
  );
}
