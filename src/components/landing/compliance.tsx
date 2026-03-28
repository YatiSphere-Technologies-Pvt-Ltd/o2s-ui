"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, FileCheck, Scale, Server } from "lucide-react";

const badges = [
  { icon: Shield, label: "SOC 2", sublabel: "Type II" },
  { icon: Lock, label: "GDPR", sublabel: "Compliant" },
  { icon: Scale, label: "EU AI Act", sublabel: "Certified" },
  { icon: FileCheck, label: "EEOC", sublabel: "Compliant" },
  { icon: Eye, label: "CCPA", sublabel: "Compliant" },
  { icon: Server, label: "ISO 27001", sublabel: "Certified" },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const badgeItem = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
};

export function Compliance() {
  return (
    <section id="security" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#10B981] tracking-wider uppercase mb-3 block">
            Trust & Security
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#F1F5F9] mb-4">
            Enterprise-Grade Security{" "}
            <span className="text-[#8892A8]">& Compliance</span>
          </h2>
          <p className="text-[#8892A8] max-w-xl mx-auto">
            The most compliant AI HR platform on the market. Built for regulated industries from day one.
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-16"
        >
          {badges.map((badge) => (
            <motion.div
              key={badge.label}
              variants={badgeItem}
              whileHover={{ scale: 1.05 }}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl px-5 py-4 flex items-center gap-3 hover:bg-white/[0.06] hover:border-[#10B981]/20 transition-all duration-300 cursor-default"
            >
              <badge.icon className="size-5 text-[#10B981]" />
              <div className="text-left">
                <div className="text-sm font-semibold text-[#F1F5F9]">
                  {badge.label}
                </div>
                <div className="text-[10px] text-[#8892A8]">
                  {badge.sublabel}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-8 hover:bg-white/[0.06] hover:border-[#3B82F6]/20 transition-all duration-300"
          >
            <Lock className="size-8 text-[#3B82F6] mb-4" />
            <h3 className="text-xl font-semibold text-[#F1F5F9] mb-3">
              Your Data, Your Rules
            </h3>
            <p className="text-sm text-[#8892A8] leading-relaxed">
              Tenant-level data isolation with dedicated encryption keys. Choose your data residency (US, EU, APAC). Complete data portability with one-click export. Right to erasure across all data stores. No cross-tenant data sharing without explicit consent.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            whileHover={{ y: -4 }}
            className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-8 hover:bg-white/[0.06] hover:border-[#14B8A6]/20 transition-all duration-300"
          >
            <Eye className="size-8 text-[#14B8A6] mb-4" />
            <h3 className="text-xl font-semibold text-[#F1F5F9] mb-3">
              AI You Can Trust
            </h3>
            <p className="text-sm text-[#8892A8] leading-relaxed">
              Every AI recommendation includes a natural language explanation. Real-time bias monitoring with four-fifths rule compliance. One-click human override on any AI decision. Immutable audit trail with 7-year retention. Automated EU AI Act conformity documentation.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
