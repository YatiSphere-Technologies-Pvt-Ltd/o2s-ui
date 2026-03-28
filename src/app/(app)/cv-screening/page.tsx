"use client";

import { ScanSearch } from "lucide-react";
import { motion } from "framer-motion";
import { UploadTab } from "@/components/cv-screening/upload-tab";

export default function CVScreeningPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ScanSearch className="size-6 text-brand-purple" />
          <h1 className="text-xl font-bold text-foreground">AI CV Screening</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Upload CVs for AI-powered analysis. Get detailed skill matching, experience scoring, and fit assessment.
        </p>
      </div>

      {/* Stats Bar */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-6 text-sm">
        <div><span className="font-semibold text-foreground">3</span> <span className="text-muted-foreground">CVs screened today</span></div>
        <div><span className="font-semibold text-foreground">92%</span> <span className="text-muted-foreground">avg confidence</span></div>
        <div><span className="font-semibold text-success">2</span> <span className="text-muted-foreground">strong matches found</span></div>
      </div>

      {/* Upload Interface */}
      <UploadTab />
    </motion.div>
  );
}
