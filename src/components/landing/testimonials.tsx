"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "O2S cut our time-to-hire from 45 days to 18. The AI screening is shockingly accurate — and the fact that every decision is explainable means our legal team actually sleeps at night.",
    name: "Rachel Torres",
    title: "VP of People, ScaleAI (420 employees)",
    gradient: "from-[#3B82F6] to-[#14B8A6]",
  },
  {
    quote:
      "We replaced Greenhouse, Calendly, and two sourcing tools with O2S. One platform, one source of truth, and AI that actually understands our hiring bar. Implementation took 11 days.",
    name: "Marcus Chen",
    title: "Head of Talent, Meridian Labs (280 employees)",
    gradient: "from-[#8B5CF6] to-[#3B82F6]",
  },
  {
    quote:
      "The compliance dashboard alone justified the switch. With the EU AI Act deadline approaching, O2S gave us confidence that our AI hiring is auditable, explainable, and legally defensible.",
    name: "Dr. Anna Kowalski",
    title: "CHRO, Elysium Health (1,200 employees)",
    gradient: "from-[#14B8A6] to-[#10B981]",
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

export function Testimonials() {
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
          <span className="text-sm font-medium text-[#8B5CF6] tracking-wider uppercase mb-3 block">
            What Teams Are Saying
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-[#F1F5F9]">
            Built for People Who{" "}
            <span className="text-[#8892A8]">Build Teams</span>
          </h2>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              variants={item}
              whileHover={{ y: -4 }}
              className="bg-white/[0.04] border border-white/[0.08] rounded-xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-300 relative"
            >
              <Quote className="size-8 text-[#3B82F6]/20 mb-3" />

              <div className="border-l-2 border-[#3B82F6] pl-4 mb-6">
                <p className="text-[15px] text-[#F1F5F9] leading-[1.7] italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "size-10 rounded-full flex items-center justify-center text-sm font-bold text-white bg-linear-to-br",
                    t.gradient
                  )}
                >
                  {t.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#F1F5F9]">
                    {t.name}
                  </p>
                  <p className="text-xs text-[#8892A8]">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
