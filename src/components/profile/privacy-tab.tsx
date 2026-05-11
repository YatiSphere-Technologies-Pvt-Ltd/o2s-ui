"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Stethoscope, Bot, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_CONSENT, type AgentAutonomy, type ConsentPrefs } from "@/components/profile/data";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${
        checked ? "bg-brand" : "bg-secondary"
      }`}
      aria-pressed={checked}
    >
      <span
        className={`absolute top-0.5 left-0.5 size-4 rounded-full bg-white transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}

const AUTONOMY_DESC: Record<AgentAutonomy, string> = {
  Manual:     "Agents only act when you explicitly ask. Maximum control.",
  Supervised: "Agents propose; you approve before anything is sent or saved.",
  Autonomous: "Agents act on low-risk tasks without confirmation. Reviewable in activity log.",
};

export function PrivacyTab() {
  const [consent, setConsent] = useState<ConsentPrefs>(DEFAULT_CONSENT);

  const set = <K extends keyof ConsentPrefs>(key: K, value: ConsentPrefs[K]) =>
    setConsent((prev) => ({ ...prev, [key]: value }));

  return (
    <motion.div {...fadeIn} className="space-y-6">
      {/* Medical & health */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Stethoscope className="size-4 text-brand" />
          <h3 className="font-semibold text-sm text-foreground">Medical & Health Information</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm text-foreground">Share medical leave reason with manager</p>
              <p className="text-xs text-muted-foreground">
                If off, your manager sees only &ldquo;Medical leave&rdquo; without details. HR retains access for compliance.
              </p>
            </div>
            <Toggle
              checked={consent.shareMedicalLeaveDetails}
              onChange={(v) => set("shareMedicalLeaveDetails", v)}
            />
          </div>
          <div className="flex items-center justify-between gap-6">
            <div>
              <p className="text-sm text-foreground">Allow platform to store medical documents</p>
              <p className="text-xs text-muted-foreground">
                Required for medical-leave certificates &gt; 3 days in some jurisdictions. Stored encrypted.
              </p>
            </div>
            <Toggle
              checked={consent.storeHealthDocs}
              onChange={(v) => set("storeHealthDocs", v)}
            />
          </div>
        </div>
      </div>

      {/* Agent autonomy */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="size-4 text-brand-purple" />
          <h3 className="font-semibold text-sm text-foreground">Agent Autonomy</h3>
        </div>
        <p className="text-xs text-muted-foreground mb-4">
          How much initiative AI agents (Aurora and others) may take on your behalf.
        </p>
        <div className="space-y-2">
          {(["Manual", "Supervised", "Autonomous"] as AgentAutonomy[]).map((level) => {
            const active = consent.agentAutonomy === level;
            return (
              <button
                key={level}
                onClick={() => set("agentAutonomy", level)}
                className={`w-full text-left p-3 rounded-lg border transition-colors ${
                  active
                    ? "border-brand bg-brand/5"
                    : "border-border bg-surface-overlay/40 hover:bg-surface-overlay"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{level}</span>
                  <span
                    className={`size-3.5 rounded-full border-2 ${
                      active ? "border-brand bg-brand" : "border-border"
                    }`}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{AUTONOMY_DESC[level]}</p>
              </button>
            );
          })}
        </div>
        <div className="flex items-center justify-between gap-6 mt-4 pt-4 border-t border-border">
          <div>
            <p className="text-sm text-foreground">Agents may contact colleagues on my behalf</p>
            <p className="text-xs text-muted-foreground">
              E.g., asking a teammate for leave coverage. You see every message in your activity log.
            </p>
          </div>
          <Toggle
            checked={consent.agentMayContactColleagues}
            onChange={(v) => set("agentMayContactColleagues", v)}
          />
        </div>
      </div>

      {/* Wellbeing signals */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="size-4 text-destructive" />
          <h3 className="font-semibold text-sm text-foreground">Wellbeing Signals</h3>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-sm text-foreground">Include me in wellbeing aggregates</p>
            <p className="text-xs text-muted-foreground">
              Anonymous, aggregated signals (e.g. unused leave, late-night activity) help HR spot burnout risk.
              Your individual data is never surfaced.
            </p>
          </div>
          <Toggle
            checked={consent.shareWellbeingSignals}
            onChange={(v) => set("shareWellbeingSignals", v)}
          />
        </div>
      </div>

      {/* Legal footer */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <ShieldCheck className="size-4 text-success" />
          <h3 className="font-semibold text-sm text-foreground">Your Rights</h3>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          You can request a copy of all data we hold about you, withdraw any consent above, or have your
          data deleted. Some retention obligations may apply for tax and labor records.
        </p>
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="xs">Export my data</Button>
          <Button variant="outline" size="xs">Request deletion</Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button size="sm">Save Consent</Button>
      </div>
    </motion.div>
  );
}
