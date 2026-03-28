"use client";
import { motion } from "framer-motion";
import { Palette } from "lucide-react";

export default function CustomSettingsPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, ease: "easeOut" as const }} className="space-y-6 max-w-4xl">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Palette className="size-5 text-brand" />
          <h1 className="text-xl font-bold text-foreground">Customization & Branding</h1>
        </div>
        <p className="text-sm text-muted-foreground">Customize your O2S experience with themes, branding, and custom fields.</p>
      </div>
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <p className="text-sm text-muted-foreground">Customization & branding settings will be available soon.</p>
      </div>
    </motion.div>
  );
}
