"use client";

import { motion } from "framer-motion";
import { PiggyBank } from "lucide-react";

export default function BudgetsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <PiggyBank className="size-5 text-[#38BDF8]" />
          <h1 className="text-xl font-bold text-foreground">Budgets</h1>
        </div>
        <p className="text-sm text-muted-foreground">Cost center and department budgets</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">Budgets coming soon.</p>
      </div>
    </motion.div>
  );
}
