"use client";

import { motion } from "framer-motion";
import { Laptop } from "lucide-react";

export default function ITAssetsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Laptop className="size-5 text-[#FB923C]" />
          <h1 className="text-xl font-bold text-foreground">IT Assets</h1>
        </div>
        <p className="text-sm text-muted-foreground">Hardware inventory and lifecycle</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">IT Assets coming soon.</p>
      </div>
    </motion.div>
  );
}
