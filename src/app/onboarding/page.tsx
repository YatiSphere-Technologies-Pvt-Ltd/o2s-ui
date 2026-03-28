"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { O2sLogo } from "@/components/auth/o2s-logo";
import { Button } from "@/components/ui/button";
import { STEPS, PHASES } from "@/components/onboarding/data";
import type { OnboardingStep } from "@/components/onboarding/data";
import { StepSignup } from "@/components/onboarding/step-signup";
import { StepVerify } from "@/components/onboarding/step-verify";
import { StepCompany } from "@/components/onboarding/step-company";
import { StepWorkspace } from "@/components/onboarding/step-workspace";
import { StepStructure } from "@/components/onboarding/step-structure";
import { StepImport } from "@/components/onboarding/step-import";
import { StepIntegrations } from "@/components/onboarding/step-integrations";
import { StepAISetup } from "@/components/onboarding/step-ai-setup";
import { StepInvite } from "@/components/onboarding/step-invite";
import { StepLaunch } from "@/components/onboarding/step-launch";

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>(1);
  const [direction, setDirection] = useState(1);
  const [stepComplete, setStepComplete] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: true,   // skippable, default complete
    5: true,
    6: true,
    7: true,
    8: true,
    9: true,
    10: true,
  });

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentStep((prev) => {
      const next = (prev + 1) as OnboardingStep;
      return next <= 10 ? next : prev;
    });
  }, []);

  const goBack = useCallback(() => {
    setDirection(-1);
    setCurrentStep((prev) => {
      const back = (prev - 1) as OnboardingStep;
      return back >= 1 ? back : prev;
    });
  }, []);

  const setComplete = useCallback((step: number) => (complete: boolean) => {
    setStepComplete((prev) => ({ ...prev, [step]: complete }));
  }, []);

  const currentConfig = STEPS[currentStep - 1];
  const isFullScreen = currentStep <= 2;

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <StepSignup onNext={goNext} onBack={goBack} />;
      case 2: return <StepVerify onNext={goNext} onBack={goBack} />;
      case 3: return <StepCompany onNext={goNext} onBack={goBack} onComplete={setComplete(3)} />;
      case 4: return <StepWorkspace onNext={goNext} onBack={goBack} onComplete={setComplete(4)} />;
      case 5: return <StepStructure onNext={goNext} onBack={goBack} onComplete={setComplete(5)} />;
      case 6: return <StepImport onNext={goNext} onBack={goBack} onComplete={setComplete(6)} />;
      case 7: return <StepIntegrations onNext={goNext} onBack={goBack} onComplete={setComplete(7)} />;
      case 8: return <StepAISetup onNext={goNext} onBack={goBack} onComplete={setComplete(8)} />;
      case 9: return <StepInvite onNext={goNext} onBack={goBack} onComplete={setComplete(9)} />;
      case 10: return <StepLaunch onNext={goNext} onBack={goBack} />;
      default: return null;
    }
  };

  // Full-screen steps (1, 2) have no shell
  if (isFullScreen) {
    return (
      <div className="dark min-h-screen bg-background text-foreground">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
        >
          {renderStep()}
        </motion.div>
      </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen flex flex-col bg-background text-foreground">
      {/* Top bar */}
      <header className="h-14 bg-card border-b border-border flex items-center px-6">
        <div className="flex-1">
          <O2sLogo size="sm" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-muted-foreground">
            Step {currentStep} of 10
          </span>
        </div>
        <div className="flex-1 flex justify-end">
          <Link href="/">
            <Button variant="ghost" size="sm">Save &amp; Exit</Button>
          </Link>
        </div>
      </header>

      {/* Progress rail */}
      <div className="bg-card border-b border-border px-8 py-3">
        <div className="max-w-2xl mx-auto">
          {/* Dots and lines */}
          <div className="flex items-center justify-between">
            {STEPS.map((step, i) => {
              const isCompleted = i + 1 < currentStep;
              const isActive = i + 1 === currentStep;
              const isPending = i + 1 > currentStep;
              return (
                <div key={step.step} className="flex items-center">
                  {/* Dot */}
                  <div
                    className={`relative size-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isCompleted
                        ? "bg-success"
                        : isActive
                        ? "bg-brand-purple animate-pulse"
                        : "bg-secondary"
                    }`}
                  >
                    {isCompleted && <Check className="size-3 text-white" strokeWidth={3} />}
                    {isActive && <div className="size-2 rounded-full bg-white" />}
                  </div>
                  {/* Line */}
                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-0.5 w-4 sm:w-6 md:w-8 ${
                        isCompleted ? "bg-success" : "bg-border"
                      } transition-colors`}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {/* Phase labels */}
          <div className="flex justify-between mt-2">
            {PHASES.map((phase) => {
              const startIdx = phase.steps[0] - 1;
              const endIdx = phase.steps[phase.steps.length - 1] - 1;
              return (
                <div
                  key={phase.key}
                  className="text-[10px] text-muted-foreground uppercase tracking-wider"
                  style={{
                    marginLeft: startIdx === 0 ? 0 : undefined,
                    textAlign: startIdx === 0 ? "left" : endIdx === 9 ? "right" : "center",
                    flex: phase.steps.length,
                  }}
                >
                  {phase.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentStep}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      {currentStep < 10 && (
        <div className="border-t border-border bg-card">
          <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
            {currentStep > 2 ? (
              <Button variant="ghost" onClick={goBack}>Back</Button>
            ) : (
              <div />
            )}
            <div className="flex items-center gap-3">
              {currentConfig.skippable && (
                <Button variant="ghost" onClick={goNext} className="text-muted-foreground">
                  Skip
                </Button>
              )}
              <Button
                onClick={goNext}
                disabled={!stepComplete[currentStep]}
                className="bg-brand text-white hover:bg-brand/90 disabled:opacity-50"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
