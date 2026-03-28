"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, Search, Users, Star, Zap } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const candidates = [
  {
    column: "Applied",
    count: 24,
    color: "#3B82F6",
    cards: [
      { name: "Sarah Chen", role: "Sr. Engineer", score: 92, badge: "AI Match" },
      { name: "James Wilson", role: "Product Lead", score: 88, badge: "Referred" },
    ],
  },
  {
    column: "Screening",
    count: 12,
    color: "#14B8A6",
    cards: [
      { name: "Maria Garcia", role: "Designer", score: 95, badge: "Top Pick" },
      { name: "Alex Kim", role: "Data Scientist", score: 90, badge: "AI Match" },
    ],
  },
  {
    column: "Interview",
    count: 8,
    color: "#8B5CF6",
    cards: [
      { name: "David Park", role: "Eng Manager", score: 94, badge: "Fast Track" },
    ],
  },
  {
    column: "Offer",
    count: 3,
    color: "#10B981",
    cards: [
      { name: "Emily Zhang", role: "Staff Engineer", score: 97, badge: "Star" },
    ],
  },
];

const trustedLogos = [
  "ScaleAI",
  "Meridian Labs",
  "Elysium Health",
  "CloudNative",
  "NovaStar",
  "Quantum Systems",
  "Vertex Finance",
  "Athena Health",
];

function CandidateCard({
  name,
  role,
  score,
  badge,
}: {
  name: string;
  role: string;
  score: number;
  badge: string;
}) {
  return (
    <div className="bg-[#0E0E18] rounded-lg p-3 border border-white/[0.06] hover:border-white/[0.12] transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <div className="size-7 rounded-full bg-linear-to-br from-[#3B82F6] to-[#14B8A6] flex items-center justify-center text-[10px] font-bold text-white">
          {name.split(" ").map((n) => n[0]).join("")}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-[#F1F5F9] truncate">{name}</p>
          <p className="text-[10px] text-[#8892A8] truncate">{role}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-12 bg-[#16162A] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-linear-to-r from-[#3B82F6] to-[#14B8A6]"
              style={{ width: `${score}%` }}
            />
          </div>
          <span className="text-[10px] text-[#8892A8]">{score}%</span>
        </div>
        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#3B82F6]/10 text-[#3B82F6] font-medium">
          {badge}
        </span>
      </div>
    </div>
  );
}

function DotGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.15]">
      <svg width="100%" height="100%">
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#8892A8" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative pt-32 pb-10 overflow-hidden">
      <DotGrid />

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#3B82F6]/[0.07] rounded-full blur-[120px]" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-[#14B8A6]/[0.05] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm mb-8"
        >
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10B981] opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-[#10B981]" />
          </span>
          <span className="text-[#8892A8]">
            Now in Public Beta — EU AI Act Compliant
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-[#F1F5F9] mb-6 leading-[1.1]"
        >
          The Operating System Your{" "}
          <span className="bg-linear-to-r from-[#3B82F6] via-[#14B8A6] to-[#3B82F6] bg-[length:200%_auto] bg-clip-text text-transparent animate-[gradient-shift_3s_ease-in-out_infinite]">
            Organization Deserves
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg md:text-xl text-[#8892A8] max-w-2xl mx-auto mb-10"
        >
          AI agents that don&apos;t just assist your HR team — they hire, onboard,
          and manage talent autonomously. Compliant by design. Intelligent by
          nature. Built by Yatisphere.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-linear-to-r from-[#3B82F6] to-[#14B8A6] text-white border-0 px-6 h-12 text-base gap-2 hover:opacity-90 shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.5)] transition-shadow"
            )}
          >
            Start Free Trial <ArrowRight className="size-4" />
          </Link>
          <Link
            href="#product"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "border-white/[0.12] bg-white/[0.04] text-[#F1F5F9] px-6 h-12 text-base gap-2 hover:bg-white/[0.08]"
            )}
          >
            <Play className="size-4" /> Watch Demo
          </Link>
        </motion.div>

        {/* Dashboard Mockup with float + glow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative max-w-5xl mx-auto"
        >
          <div className="absolute -inset-4 bg-linear-to-r from-[#3B82F6]/20 to-[#14B8A6]/20 rounded-2xl blur-2xl opacity-50" />

          <div
            className="relative rounded-xl border border-white/[0.08] bg-[#0E0E18] overflow-hidden shadow-2xl"
            style={{ animation: "float 6s ease-in-out infinite, glow 4s ease-in-out infinite" }}
          >
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06] bg-[#07070D]">
              <div className="flex gap-1.5">
                <div className="size-3 rounded-full bg-[#EF4444]/60" />
                <div className="size-3 rounded-full bg-[#F59E0B]/60" />
                <div className="size-3 rounded-full bg-[#10B981]/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-[#16162A] rounded-md px-4 py-1 text-xs text-[#8892A8] flex items-center gap-2">
                  <Search className="size-3" />
                  app.o2s.ai/hiring-pipeline
                </div>
              </div>
            </div>

            <div className="flex">
              <div className="hidden sm:flex w-48 border-r border-white/[0.06] bg-[#07070D] p-4 flex-col gap-3">
                <div className="flex items-center gap-2 text-xs text-[#F1F5F9] font-medium px-2 py-1.5 rounded bg-white/[0.04]">
                  <Users className="size-3.5" /> Hiring Pipeline
                </div>
                <div className="flex items-center gap-2 text-xs text-[#8892A8] px-2 py-1.5">
                  <Star className="size-3.5" /> Talent Pool
                </div>
                <div className="flex items-center gap-2 text-xs text-[#8892A8] px-2 py-1.5">
                  <Zap className="size-3.5" /> AI Insights
                </div>
              </div>

              <div className="flex-1 p-4 overflow-x-auto scrollbar-thin">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 min-w-[500px]">
                  {candidates.map((col) => (
                    <div key={col.column}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className="size-2 rounded-full"
                            style={{ backgroundColor: col.color }}
                          />
                          <span className="text-xs font-medium text-[#F1F5F9]">
                            {col.column}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#8892A8] bg-white/[0.04] px-1.5 py-0.5 rounded">
                          {col.count}
                        </span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {col.cards.map((card) => (
                          <CandidateCard key={card.name} {...card} />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trusted By Logo Ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="mt-16 pt-10 border-t border-white/[0.06]"
        >
          <p className="text-xs text-[#8892A8] uppercase tracking-widest font-medium mb-6">
            Trusted by forward-thinking teams
          </p>
          <div className="relative overflow-hidden max-w-3xl mx-auto">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-[#07070D] to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-[#07070D] to-transparent z-10" />

            <div className="flex animate-[ticker_20s_linear_infinite]" style={{ width: "max-content" }}>
              {[...trustedLogos, ...trustedLogos].map((logo, i) => (
                <div
                  key={`${logo}-${i}`}
                  className="flex items-center justify-center px-8 py-2"
                >
                  <span className="text-sm font-semibold text-[#8892A8]/50 whitespace-nowrap">
                    {logo}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
