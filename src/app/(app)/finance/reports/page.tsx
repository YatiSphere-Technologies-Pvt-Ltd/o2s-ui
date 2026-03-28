"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";

export default function FinancialReportsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="size-5 text-[#38BDF8]" />
          <h1 className="text-xl font-bold text-foreground">Financial Reports</h1>
        </div>
        <p className="text-sm text-muted-foreground">Expense and budget analytics</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">Financial Reports coming soon.</p>
      </div>
    </motion.div>
  );
}
