"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 8,
    annualPrice: 6,
    description: "For growing teams getting started with AI hiring",
    features: [
      "Core hiring pipeline",
      "3 AI agents (Recruiter, Scheduling, Analytics)",
      "Basic analytics dashboard",
      "Google/Microsoft calendar sync",
      "Email support",
      "CSV data import",
    ],
    featured: false,
  },
  {
    name: "Professional",
    monthlyPrice: 18,
    annualPrice: 14,
    description: "For teams that want the full AI-native experience",
    features: [
      "Everything in Starter",
      "All 6 AI agents",
      "Onboarding + Employee Experience modules",
      "Advanced analytics + bias monitoring",
      "ATS migration (Greenhouse, Lever, Ashby)",
      "SSO (SAML/OIDC)",
      "Slack integration",
      "Priority support",
    ],
    featured: true,
    badge: "Most Popular",
  },
  {
    name: "Enterprise",
    monthlyPrice: 35,
    annualPrice: 28,
    description: "For organizations that need full platform + compliance",
    features: [
      "Everything in Professional",
      "Full platform (all modules)",
      "Compliance Engine + EU AI Act reporting",
      "Custom AI agent workflows",
      "SCIM provisioning",
      "Dedicated CSM + 99.9% SLA",
      "Audit export + data residency",
      "SOC 2 Type II report",
    ],
    featured: false,
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <span className="text-sm font-medium text-[#F59E0B] tracking-wider uppercase mb-3 block">
            Pricing
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#F1F5F9] mb-4">
            Simple Pricing, Transparent Value
          </h2>
          <p className="text-[#8892A8] max-w-xl mx-auto">
            No hidden fees. No per-seat gotchas. Just per-employee-per-month pricing that scales with you.
          </p>
        </motion.div>

        <div className="flex items-center justify-center gap-3 mb-12">
          <span
            className={cn(
              "text-sm transition-colors",
              !annual ? "text-[#F1F5F9]" : "text-[#8892A8]"
            )}
          >
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={cn(
              "relative w-12 h-6 rounded-full transition-colors",
              annual ? "bg-[#3B82F6]" : "bg-white/[0.12]"
            )}
            aria-label="Toggle annual billing"
          >
            <div
              className={cn(
                "absolute top-1 size-4 rounded-full bg-white transition-transform",
                annual ? "translate-x-7" : "translate-x-1"
              )}
            />
          </button>
          <span
            className={cn(
              "text-sm transition-colors",
              annual ? "text-[#F1F5F9]" : "text-[#8892A8]"
            )}
          >
            Annual{" "}
            <span className="text-[#10B981] text-xs font-medium">
              Save 20%
            </span>
          </span>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6 items-start"
        >
          {plans.map((plan) => (
            <motion.div
              key={plan.name}
              variants={item}
              whileHover={{ y: -4 }}
              className={cn(
                "relative rounded-xl border p-8 transition-all duration-300",
                plan.featured
                  ? "border-[#3B82F6]/40 bg-linear-to-b from-[#3B82F6]/[0.08] to-transparent scale-[1.02] shadow-[0_0_60px_rgba(59,130,246,0.12)]"
                  : "border-white/[0.08] bg-white/[0.04] hover:border-white/[0.12]"
              )}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-linear-to-r from-[#3B82F6] to-[#14B8A6] text-white text-xs font-medium px-3 py-1 rounded-full">
                  {plan.badge}
                </div>
              )}
              <h3 className="text-xl font-semibold text-[#F1F5F9] mb-1">
                {plan.name}
              </h3>
              <p className="text-sm text-[#8892A8] mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#F1F5F9]">
                  ${annual ? plan.annualPrice : plan.monthlyPrice}
                </span>
                <span className="text-[#8892A8] text-sm"> /employee/mo</span>
              </div>
              {plan.name === "Enterprise" ? (
                <a
                  href="https://yatisphere.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full justify-center border-0 mb-8",
                    "bg-white/[0.08] text-[#F1F5F9] hover:bg-white/[0.12]"
                  )}
                >
                  Contact Sales
                </a>
              ) : (
                <Link
                  href="/sign-up"
                  className={cn(
                    buttonVariants({ size: "lg" }),
                    "w-full justify-center border-0 mb-8",
                    plan.featured
                      ? "bg-linear-to-r from-[#3B82F6] to-[#14B8A6] text-white hover:opacity-90 shadow-[0_4px_20px_rgba(59,130,246,0.3)]"
                      : "bg-white/[0.08] text-[#F1F5F9] hover:bg-white/[0.12]"
                  )}
                >
                  Start Free Trial
                </Link>
              )}
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-[#8892A8]"
                  >
                    <Check className="size-4 text-[#10B981] shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
