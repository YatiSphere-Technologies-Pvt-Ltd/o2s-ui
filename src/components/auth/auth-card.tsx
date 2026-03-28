"use client";

import { motion } from "framer-motion";
import { O2sLogo } from "./o2s-logo";

export function AuthCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="mb-8 text-center">
        <div className="flex justify-center mb-6">
          <O2sLogo size="md" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-8">
        {children}
      </div>
    </motion.div>
  );
}
