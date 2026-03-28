"use client";

import { motion } from "framer-motion";
import { Smile } from "lucide-react";

export default function CulturePage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Smile className="size-5 text-success" />
          <h1 className="text-xl font-bold text-foreground">Culture</h1>
        </div>
        <p className="text-sm text-muted-foreground">Culture metrics and initiatives</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">Culture coming soon.</p>
      </div>
    </motion.div>
  );
}
