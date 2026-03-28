"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

export default function CourseCatalogPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" as const }}
      className="space-y-6"
    >
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="size-5 text-[#A3E635]" />
          <h1 className="text-xl font-bold text-foreground">Course Catalog</h1>
        </div>
        <p className="text-sm text-muted-foreground">Browse and enroll in courses</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">Course Catalog coming soon.</p>
      </div>
    </motion.div>
  );
}
