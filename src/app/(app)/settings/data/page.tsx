"use client";
import { motion } from "framer-motion";
import { Database } from "lucide-react";

export default function DataSettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" as const }} className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Database className="size-5 text-brand" />
          <h1 className="text-xl font-bold text-foreground">Data & Import/Export</h1>
        </div>
        <p className="text-sm text-muted-foreground">Import data, export records, and manage data pipelines.</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">Data & import/export settings will be available soon.</p>
      </div>
    </motion.div>
  );
}
