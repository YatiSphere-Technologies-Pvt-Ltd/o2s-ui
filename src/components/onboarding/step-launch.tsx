"use client";

import { motion } from "framer-motion";
import { Check, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ACTIVATION_CHECKLIST } from "@/components/onboarding/data";

interface StepLaunchProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepLaunch({}: StepLaunchProps) {
  return (
    <div className="text-center space-y-8">
      {/* Animated checkmark */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 12, delay: 0.1 }}
        className="inline-flex items-center justify-center size-20 rounded-full bg-success mx-auto"
      >
        <Check className="size-10 text-white" strokeWidth={3} />
      </motion.div>

      <div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
          className="text-3xl font-bold text-foreground"
        >
          You&apos;re all set!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, ease: [0.4, 0, 0.2, 1] as const }}
          className="text-muted-foreground mt-2"
        >
          Your O2S workspace is ready.
        </motion.p>
      </div>

      {/* Stats row */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-sm text-muted-foreground"
      >
        142 employees imported &middot; 5 agents active &middot; 2 integrations connected
      </motion.p>

      {/* Activation checklist */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, ease: [0.4, 0, 0.2, 1] as const }}
        className="max-w-sm mx-auto text-left"
      >
        <h3 className="text-sm font-medium text-foreground mb-3">Activation Checklist</h3>
        <div className="space-y-2">
          {ACTIVATION_CHECKLIST.map((item) => (
            <div key={item.id} className="flex items-center gap-2.5">
              {item.completed ? (
                <div className="size-5 rounded-full bg-success/10 flex items-center justify-center shrink-0">
                  <Check className="size-3 text-success" />
                </div>
              ) : (
                <Circle className="size-5 text-muted-foreground shrink-0" />
              )}
              <span className={`text-sm ${item.completed ? "text-foreground" : "text-muted-foreground"}`}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Go to Dashboard */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, ease: [0.4, 0, 0.2, 1] as const }}
      >
        <Button
          onClick={() => { window.location.href = "/dashboard"; }}
          className="h-10 px-6 bg-brand text-white hover:bg-brand/90"
        >
          Go to Dashboard
        </Button>
      </motion.div>
    </div>
  );
}
