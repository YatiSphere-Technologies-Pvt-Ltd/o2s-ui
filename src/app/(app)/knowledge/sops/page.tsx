"use client";

import { motion } from "framer-motion";
import { FileText } from "lucide-react";

export default function SOPsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <FileText className="size-5 text-info" />
          <h1 className="text-xl font-bold text-foreground">SOPs</h1>
        </div>
        <p className="text-sm text-muted-foreground">Standard operating procedures</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">SOPs coming soon.</p>
      </div>
    </motion.div>
  );
}
