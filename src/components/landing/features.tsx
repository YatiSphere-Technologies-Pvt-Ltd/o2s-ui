"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Gauge, FileSearch, Check } from "lucide-react";

const scoreData = [
  { name: "Sarah Kim", initials: "SK", role: "Sr. Software Engineer", score: 92, color: "#10B981" },
  { name: "Alex Rivera", initials: "AR", role: "Product Manager", score: 88, color: "#10B981" },
  { name: "David Chen", initials: "DC", role: "Backend Engineer", score: 76, color: "#F59E0B" },
  { name: "Lin Zhang", initials: "LZ", role: "ML Engineer", score: 85, color: "#10B981" },
];

const explainabilityBars = [
  { label: "Skill Match", value: 96, color: "#10B981" },
  { label: "Experience Relevance", value: 91, color: "#10B981" },
  { label: "Trajectory Signal", value: 88, color: "#14B8A6" },
  { label: "Culture Indicators", value: 84, color: "#14B8A6" },
];

const auditBadges = [
  { label: "BIAS CHECK", status: "PASS", color: "#10B981" },
  { label: "CONFIDENCE", status: "HIGH", color: "#3B82F6" },
  { label: "AUDIT", status: "LOGGED", color: "#8B5CF6" },
];

const featureList1 = [
  "AI candidate matching with fit scores (0-100)",
  "Automated bias-free screening with four-fifths rule monitoring",
  "One-click interview scheduling across all participants",
  "Compensation benchmarking with market data",
];

const featureList2 = [
  "Natural language explanations for every AI recommendation",
  "One-click human override with audit trail",
  "Real-time bias monitoring dashboard",
  "Automated regulatory reporting (EEOC, NYC LL144, EU AI Act)",
];

function ScoreVisualization() {
  return (
    <div className="bg-[#0E0E18] rounded-xl border border-white/[0.08] p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <h4 className="text-sm font-medium text-[#F1F5F9]">
            Candidate Rankings
          </h4>
          <span className="text-xs text-[#8892A8]">AI Confidence: High</span>
        </div>
        <div className="space-y-4">
          {scoreData.map((candidate, i) => (
            <motion.div
              key={candidate.name}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              className="flex items-center gap-3"
            >
              <div className="size-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 bg-linear-to-br from-[#3B82F6] to-[#8B5CF6]">
                {candidate.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div>
                    <span className="text-xs font-medium text-[#F1F5F9]">{candidate.name}</span>
                    <span className="text-[10px] text-[#8892A8] ml-2">{candidate.role}</span>
                  </div>
                  <span className="text-sm font-bold" style={{ color: candidate.color }}>
                    {candidate.score}
                  </span>
                </div>
                <div className="h-1.5 bg-[#16162A] rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${candidate.score}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 + i * 0.12 }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: candidate.color }}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExplainabilityVisualization() {
  return (
    <div className="bg-[#0E0E18] rounded-xl border border-white/[0.08] overflow-hidden relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.06)_0%,transparent_70%)] pointer-events-none" />
      <div className="relative p-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold text-[#3B82F6]">
            Why this candidate scored 92/100
          </h4>
          <FileSearch className="size-4 text-[#8892A8]" />
        </div>
        <div className="space-y-3 mb-6">
          {explainabilityBars.map((bar, i) => (
            <motion.div
              key={bar.label}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-[#8892A8]">{bar.label}</span>
                <span className="text-xs font-bold" style={{ color: bar.color }}>
                  {bar.value}%
                </span>
              </div>
              <div className="h-1 bg-[#16162A] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${bar.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: bar.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="flex gap-2">
          {auditBadges.map((badge) => (
            <div
              key={badge.label}
              className="flex-1 rounded-lg p-2.5 text-center border"
              style={{
                backgroundColor: `${badge.color}08`,
                borderColor: `${badge.color}33`,
              }}
            >
              <div className="text-[9px] font-bold" style={{ color: badge.color }}>
                {badge.label}
              </div>
              <div className="text-lg font-black" style={{ color: badge.color }}>
                {badge.status}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Features() {
  return (
    <section id="features" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#14B8A6] tracking-wider uppercase mb-3 block">
            Features
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#F1F5F9]">
            Built Different.{" "}
            <span className="text-[#8892A8]">On Purpose.</span>
          </h2>
        </motion.div>

        {/* Feature Row 1 */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 text-sm text-[#3B82F6] font-medium mb-4">
              <Gauge className="size-4" />
              Hire in Days, Not Months
            </div>
            <div className="text-5xl font-black bg-linear-to-r from-[#3B82F6] to-[#14B8A6] bg-clip-text text-transparent mb-2">
              35%
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#F1F5F9] mb-4">
              Faster Time-to-Hire
            </h3>
            <p className="text-[#8892A8] leading-relaxed mb-6">
              AI agents screen candidates in minutes with explainable scoring, find optimal interview slots across teams, and generate competitive offers — all while maintaining compliance.
            </p>
            <ul className="space-y-2.5">
              {featureList1.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[#8892A8]">
                  <div className="size-5 rounded-full bg-[#10B981]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="size-3 text-[#10B981]" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ScoreVisualization />
          </motion.div>
        </div>

        {/* Feature Row 2 (reversed) */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <ExplainabilityVisualization />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="order-1 lg:order-2"
          >
            <div className="inline-flex items-center gap-2 text-sm text-[#8B5CF6] font-medium mb-4">
              <ShieldCheck className="size-4" />
              Every Decision, Explained
            </div>
            <div className="text-5xl font-black bg-linear-to-r from-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent mb-2">
              100%
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#F1F5F9] mb-4">
              Explainable AI
            </h3>
            <p className="text-[#8892A8] leading-relaxed mb-6">
              The EU AI Act classifies HR AI as high-risk. O2S is the only platform built for compliance from day one — with explainability, audit trails, and bias monitoring as first-class features.
            </p>
            <ul className="space-y-2.5">
              {featureList2.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-[#8892A8]">
                  <div className="size-5 rounded-full bg-[#10B981]/15 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="size-3 text-[#10B981]" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
