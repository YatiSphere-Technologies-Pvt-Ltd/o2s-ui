"use client";

import { motion } from "framer-motion";
import { Clock, Layers, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: Clock,
    stat: "42",
    unit: "Days to Hire",
    description:
      "The average enterprise takes 42 days to fill a single position. Top candidates are gone in 10.",
  },
  {
    icon: Layers,
    stat: "6+",
    unit: "Tools Zero Intelligence",
    description:
      "Your ATS, HRIS, LMS, and payroll don't talk to each other. You're the integration layer.",
  },
  {
    icon: TrendingDown,
    stat: "53%",
    unit: "Of AI HR Deployments Fail",
    description:
      "Most AI HR tools are glorified chatbots. They automate the wrong things and create new problems.",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Problems() {
  return (
    <section id="product" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#EF4444] tracking-wider uppercase mb-3 block">
            The Problem
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#F1F5F9]">
            HR Is Broken.{" "}
            <span className="text-[#8892A8]">Your Tools Made It Worse.</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {problems.map((problem) => (
            <motion.div
              key={problem.stat}
              variants={item}
              whileHover={{ y: -4 }}
              className="relative group"
            >
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-linear-to-r from-[#EF4444] to-[#F59E0B] rounded-t-xl" />

              <div className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-8 h-full group-hover:bg-white/[0.06] group-hover:border-[#EF4444]/20 transition-all duration-300">
                <problem.icon className="size-6 text-[#EF4444] mb-4" />
                <div className="text-5xl font-bold bg-linear-to-r from-[#EF4444] to-[#F59E0B] bg-clip-text text-transparent mb-1">
                  {problem.stat}
                </div>
                <div className="text-sm font-medium text-[#8892A8] mb-4">
                  {problem.unit}
                </div>
                <p className="text-sm text-[#8892A8] leading-relaxed">
                  {problem.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
