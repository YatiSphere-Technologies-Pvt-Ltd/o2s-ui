"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { LegalSubNav } from "@/components/legal/legal-sub-nav";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

export default function DataProtectionPage() {
  return (
    <motion.div {...fadeIn} className="space-y-6">
      <LegalSubNav activePage="dataProtection" />
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-destructive/10">
          <Lock className="size-5 text-destructive" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Data Protection</h1>
          <p className="text-sm text-muted-foreground">GDPR, DPDP Act and data privacy compliance</p>
        </div>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-muted-foreground text-sm">Coming soon</p>
      </div>
    </motion.div>
  );
}
