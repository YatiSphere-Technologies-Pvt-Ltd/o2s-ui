"use client";

import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

export default function AccessManagementPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="size-5 text-[#FB923C]" />
          <h1 className="text-xl font-bold text-foreground">Access Management</h1>
        </div>
        <p className="text-sm text-muted-foreground">System access requests and reviews</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">Access Management coming soon.</p>
      </div>
    </motion.div>
  );
}
