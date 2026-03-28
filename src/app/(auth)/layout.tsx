"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Users,
  BarChart3,
  Shield,
  Briefcase,
  BookOpen,
  Scale,
  Target,
  Rocket,
  Building2,
  CheckCircle2,
} from "lucide-react";
import { O2sLogo } from "@/components/auth/o2s-logo";

/* ── Platform Modules — what O2S actually does ── */

const modules = [
  { icon: Users, label: "Talent Acquisition", desc: "Hire smarter with AI-powered pipelines", color: "text-brand-purple", bg: "bg-brand-purple/10" },
  { icon: Briefcase, label: "People & HR", desc: "Employee lifecycle, leave, compensation", color: "text-brand-teal", bg: "bg-brand-teal/10" },
  { icon: Target, label: "Performance", desc: "Reviews, goals, calibration, feedback", color: "text-warning", bg: "bg-warning/10" },
  { icon: BookOpen, label: "Learning", desc: "Courses, certifications, skill matrices", color: "text-[#A3E635]", bg: "bg-[#A3E635]/10" },
  { icon: Scale, label: "Legal & Compliance", desc: "Contracts, policies, regulatory filings", color: "text-destructive", bg: "bg-destructive/10" },
  { icon: Building2, label: "Operations", desc: "Finance, IT, facilities, procurement", color: "text-brand", bg: "bg-brand/10" },
];

/* ── Testimonials ── */

const testimonials = [
  { quote: "O2S replaced 6 disconnected tools with one platform. Our HR team went from firefighting to strategic planning.", author: "Meera Krishnan", role: "VP People, Series B SaaS", avatar: "MK" },
  { quote: "From requisition to onboarding in a single flow. We reduced our time-to-hire by 40% in the first quarter.", author: "Anil Sharma", role: "Head of Talent, Fintech", avatar: "AS" },
  { quote: "The compliance dashboard alone justified the switch. Zero missed filings across 3 countries since day one.", author: "Priya Desai", role: "General Counsel, Enterprise", avatar: "PD" },
];

/* ── Animated counter ── */

function AnimatedNumber({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame: number;
    const duration = 1500;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * value));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <>{count}{suffix}</>;
}

/* ── Main Layout ── */

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [activeModule, setActiveModule] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTestimonialIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveModule((prev) => (prev + 1) % modules.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[testimonialIndex];

  return (
    <div className="dark min-h-screen flex bg-background text-foreground">
      {/* ── Left Panel ── */}
      <div className="hidden lg:flex w-1/2 flex-col relative overflow-hidden border-r border-border">
        {/* Animated gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-linear-to-br from-brand/[0.03] via-transparent to-brand-purple/[0.03]" />
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" as const }}
            className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-brand/[0.05] rounded-full blur-[140px]"
          />
          <motion.div
            animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" as const }}
            className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-brand-teal/[0.04] rounded-full blur-[120px]"
          />
        </div>

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.025]">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="auth-grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#8892A8" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#auth-grid)" />
          </svg>
        </div>

        {/* Content */}
        <div className="relative flex flex-col h-full p-10 xl:p-14">

          {/* Top — Logo */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <O2sLogo size="lg" showTagline />
          </motion.div>

          {/* Middle — Main content */}
          <div className="flex-1 flex flex-col justify-center max-w-[440px] space-y-10">

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" as const }}
            >
              <h2 className="text-3xl xl:text-[2.5rem] font-bold text-foreground leading-[1.12] tracking-tight">
                One platform for{" "}
                <span className="bg-linear-to-r from-brand via-brand-teal to-brand-purple bg-clip-text text-transparent">
                  everything
                </span>
                {" "}your org needs
              </h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed mt-4">
                Hiring, people ops, performance, learning, compliance, and operations — unified in one intelligent workspace.
              </p>
            </motion.div>

            {/* Stats — animated counters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" as const }}
              className="grid grid-cols-3 gap-4"
            >
              {[
                { value: 76, suffix: "+", label: "Modules & pages" },
                { value: 40, suffix: "%", label: "Faster operations" },
                { value: 100, suffix: "%", label: "Audit-ready" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl xl:text-3xl font-bold bg-linear-to-r from-brand to-brand-teal bg-clip-text text-transparent">
                    <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </motion.div>

            {/* Module showcase — rotating highlight */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" as const }}
              className="space-y-3"
            >
              <div className="text-[10px] text-muted-foreground/50 uppercase tracking-widest font-semibold">Platform modules</div>
              <div className="grid grid-cols-2 gap-2">
                {modules.map((mod, i) => {
                  const isActive = i === activeModule;
                  return (
                    <motion.div
                      key={mod.label}
                      onMouseEnter={() => setActiveModule(i)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg cursor-default transition-all duration-300 ${
                        isActive
                          ? "bg-card/60 border border-border/60 shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
                          : "border border-transparent"
                      }`}
                    >
                      <div className={`size-8 rounded-lg ${isActive ? mod.bg : "bg-secondary/50"} flex items-center justify-center transition-colors duration-300`}>
                        <mod.icon className={`size-4 transition-colors duration-300 ${isActive ? mod.color : "text-muted-foreground/40"}`} />
                      </div>
                      <div className="min-w-0">
                        <div className={`text-xs font-medium transition-colors duration-300 ${isActive ? "text-foreground" : "text-muted-foreground/60"}`}>
                          {mod.label}
                        </div>
                        {isActive && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="text-[10px] text-muted-foreground leading-snug mt-0.5"
                          >
                            {mod.desc}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55, ease: "easeOut" as const }}
              className="bg-card/30 backdrop-blur-sm border border-border/30 rounded-xl p-5"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={testimonialIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3, ease: "easeOut" as const }}
                >
                  <p className="text-[13px] text-foreground/75 leading-relaxed">
                    &ldquo;{currentTestimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="size-8 rounded-full bg-brand/10 flex items-center justify-center text-[10px] font-bold text-brand">
                      {currentTestimonial.avatar}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-foreground">{currentTestimonial.author}</div>
                      <div className="text-[10px] text-muted-foreground">{currentTestimonial.role}</div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="flex gap-1.5 mt-4">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonialIndex(i)}
                    className={`h-1 rounded-full transition-all duration-300 ${
                      i === testimonialIndex ? "w-5 bg-brand" : "w-1.5 bg-border"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom — Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex items-center justify-between"
          >
            <div className="text-[10px] text-muted-foreground/25">
              &copy; {new Date().getFullYear()}{" "}
              <Link href="https://yatisphere.com" target="_blank" className="hover:text-muted-foreground/40 transition-colors">
                Yatisphere Technologies
              </Link>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[10px] text-muted-foreground/25 hover:text-muted-foreground/40 transition-colors"
            >
              Back to home
              <ArrowRight className="size-2.5" />
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center px-6 py-12">
        {children}
      </div>
    </div>
  );
}
