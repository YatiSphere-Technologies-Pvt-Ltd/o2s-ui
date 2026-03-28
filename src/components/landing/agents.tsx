"use client";

import { motion } from "framer-motion";
import {
  Search,
  Calendar,
  Rocket,
  MessageSquare,
  BarChart3,
  Shield,
} from "lucide-react";

const agents = [
  {
    icon: Search,
    title: "Recruiter Agent",
    description:
      "Sources, screens, and ranks candidates across every job board. Writes outreach that actually gets replies.",
    color: "#3B82F6",
    phase: "Active",
  },
  {
    icon: Calendar,
    title: "Scheduling Agent",
    description:
      "Coordinates multi-panel interviews across time zones. Handles reschedules without the email chains.",
    color: "#14B8A6",
    phase: "Active",
  },
  {
    icon: Rocket,
    title: "Onboarding Agent",
    description:
      "Creates personalized 90-day plans, provisions accounts, assigns mentors, and tracks completion.",
    color: "#10B981",
    phase: "Active",
  },
  {
    icon: MessageSquare,
    title: "Policy Agent",
    description:
      "Answers employee questions instantly with source citations. Learns your handbook and updates in real-time.",
    color: "#8B5CF6",
    phase: "Beta",
  },
  {
    icon: BarChart3,
    title: "Performance Agent",
    description:
      "Continuous feedback loops, goal tracking, and review generation. No more annual review surprises.",
    color: "#F59E0B",
    phase: "Beta",
  },
  {
    icon: Shield,
    title: "Compliance Agent",
    description:
      "Monitors regulatory changes, audits processes, and flags risks before they become liabilities.",
    color: "#EF4444",
    phase: "Coming Soon",
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function Agents() {
  return (
    <section className="py-24 bg-[#0E0E18]/50">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium text-[#3B82F6] tracking-wider uppercase mb-3 block">
            Meet Your AI Workforce
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#F1F5F9]">
            AI Agents That{" "}
            <span className="text-[#8892A8]">Actually Work</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {agents.map((agent) => (
            <motion.div
              key={agent.title}
              variants={item}
              whileHover={{ y: -6 }}
              className="group relative"
            >
              <div
                className="bg-white/[0.04] border rounded-xl p-6 h-full transition-all duration-300 group-hover:bg-white/[0.06]"
                style={{
                  borderColor: `color-mix(in srgb, ${agent.color} 20%, rgba(255,255,255,0.08))`,
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{
                    boxShadow: `0 8px 40px ${agent.color}15`,
                  }}
                />

                <div className="relative flex items-start justify-between mb-4">
                  <div
                    className="size-10 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `${agent.color}15` }}
                  >
                    <agent.icon
                      className="size-5"
                      style={{ color: agent.color }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-medium px-2 py-1 rounded-full"
                    style={{
                      backgroundColor: `${agent.color}15`,
                      color: agent.color,
                    }}
                  >
                    {agent.phase}
                  </span>
                </div>
                <h3 className="relative text-lg font-semibold text-[#F1F5F9] mb-2">
                  {agent.title}
                </h3>
                <p className="relative text-sm text-[#8892A8] leading-relaxed">
                  {agent.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
