"use client";

import { motion } from "framer-motion";
import {
  Plus,
  ClipboardList,
  FileBarChart,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickAction {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant: "brand" | "outline" | "ai";
  badge?: string;
}

const actions: QuickAction[] = [
  { label: "Post New Role", icon: Plus, variant: "brand" },
  { label: "Review Candidates", icon: ClipboardList, variant: "outline", badge: "8" },
  { label: "Generate Report", icon: FileBarChart, variant: "outline" },
  { label: "Ask O2S", icon: Sparkles, variant: "ai" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
};

export function QuickActions() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex flex-wrap items-center gap-3"
    >
      {actions.map((action) => (
        <motion.div key={action.label} variants={item}>
          {action.variant === "brand" && (
            <Button
              className="h-9 gap-2 rounded-full bg-brand px-4 text-white hover:bg-brand/90 hover:scale-[1.02] transition-all"
            >
              <action.icon className="size-4" />
              {action.label}
            </Button>
          )}

          {action.variant === "outline" && (
            <Button
              variant="outline"
              className="relative h-9 gap-2 rounded-full border-border bg-surface-overlay px-4 hover:scale-[1.02] transition-all"
            >
              <action.icon className="size-4" />
              {action.label}
              {action.badge && (
                <span className="ml-1 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
                  {action.badge}
                </span>
              )}
            </Button>
          )}

          {action.variant === "ai" && (
            <Button
              variant="outline"
              className="h-9 gap-2 rounded-full border-brand-purple/30 bg-brand-purple/10 px-4 hover:bg-brand-purple/20 hover:scale-[1.02] transition-all"
            >
              <Sparkles className="size-4 text-brand-purple" />
              <span className="text-brand-purple">{action.label}</span>
            </Button>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
