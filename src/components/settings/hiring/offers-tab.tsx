"use client";

import { motion } from "framer-motion";
import {
  GripVertical,
  ArrowRight,
  Clock,
  AlertTriangle,
  Pencil,
  MoreHorizontal,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  OFFER_TEMPLATES,
  APPROVAL_RULES,
} from "@/components/settings/hiring/data";

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

const AI_OFFER_CHECKS = [
  { id: "suggest", label: "Suggest compensation range based on market data", checked: true },
  { id: "flag", label: "Flag outliers in offer amounts", checked: true },
  { id: "calc", label: "Calculate offer competitiveness score", checked: false },
  { id: "draft", label: "Auto-draft offer letters from template", checked: false },
];

export function OffersTab() {
  return (
    <div className="space-y-8">
      {/* ── Offer Templates ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Offer Templates</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {OFFER_TEMPLATES.map((tpl, i) => (
            <motion.div
              key={tpl.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-card border border-border rounded-xl p-5"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground">{tpl.name}</span>
                {tpl.isDefault && (
                  <span className="bg-warning/10 text-warning text-[10px] font-medium rounded px-1.5 py-0.5">
                    DEFAULT
                  </span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mt-1">{tpl.usedFor}</p>

              <div className="flex flex-wrap gap-1 mt-2">
                {tpl.includes.map((inc) => (
                  <span
                    key={inc}
                    className="text-[10px] bg-secondary text-muted-foreground rounded px-1.5 py-0.5"
                  >
                    {inc}
                  </span>
                ))}
              </div>

              <p className="text-[10px] text-muted-foreground mt-2">
                Last used {tpl.lastUsed} &middot; Used {tpl.usedCount} times
              </p>

              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border">
                <Button variant="ghost" size="xs">
                  <Pencil className="size-3" />
                  Edit
                </Button>
                <Button variant="ghost" size="icon-xs" className="ml-auto">
                  <MoreHorizontal className="size-3.5" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Approval Chains ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Approval Chains</h3>
        <div className="space-y-3">
          {APPROVAL_RULES.map((rule, i) => (
            <motion.div
              key={rule.id}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              className="bg-card border border-border rounded-xl p-4 flex items-start gap-3"
            >
              <GripVertical className="size-4 text-muted-foreground mt-0.5 shrink-0 cursor-grab" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{rule.name}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{rule.condition}</p>

                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {rule.approvers.map((approver, idx) => (
                    <span key={approver} className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-foreground bg-secondary rounded px-2 py-0.5">
                        {approver}
                      </span>
                      {idx < rule.approvers.length - 1 && (
                        <ArrowRight className="size-3 text-muted-foreground" />
                      )}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" />
                    {rule.timeout}
                  </span>
                  <span className="flex items-center gap-1">
                    <AlertTriangle className="size-3" />
                    {rule.escalation}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Offer Defaults ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Offer Defaults</h3>
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground">Validity Period</label>
              <p className="text-sm text-foreground mt-0.5">7 days</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                E-Signature Provider
              </label>
              <p className="text-sm text-foreground mt-0.5">DocuSign</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Currency</label>
              <p className="text-sm text-foreground mt-0.5">USD ($)</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Counter-offer Limit</label>
              <p className="text-sm text-foreground mt-0.5">2 rounds</p>
            </div>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground">Show total comp breakdown</span>
            <span className="inline-flex items-center gap-1.5 text-xs text-success font-medium">
              <span className="size-1.5 rounded-full bg-success" />
              Enabled
            </span>
          </div>
        </div>
      </section>

      {/* ── AI Offer Intelligence ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Sparkles className="size-4 text-brand-purple" />
          AI Offer Intelligence
        </h3>
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          {AI_OFFER_CHECKS.map((check) => (
            <label key={check.id} className="flex items-center gap-3 cursor-pointer">
              <span
                className={`size-4 rounded border flex items-center justify-center shrink-0 ${
                  check.checked
                    ? "bg-brand border-brand text-white"
                    : "border-border bg-background"
                }`}
              >
                {check.checked && (
                  <svg className="size-2.5" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4l2.5 2.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span className="text-sm text-foreground">{check.label}</span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
}
