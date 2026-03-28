"use client";

import { motion } from "framer-motion";
import { Settings2 } from "lucide-react";
import { ScreeningSettingsTab } from "@/components/cv-screening/screening-settings-tab";

export default function CVScreeningConfigPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Settings2 className="size-5 text-brand-purple" />
          <h1 className="text-xl font-bold text-foreground">Screening Configuration</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Configure auto-screening rules, scoring weights, bias safeguards, and AI model settings.
        </p>
      </div>
      <ScreeningSettingsTab />
    </motion.div>
  );
}
