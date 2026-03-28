"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-[#3B82F6]/[0.1] via-transparent to-[#14B8A6]/[0.1]" />
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3B82F6]/[0.08] rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-[#F1F5F9] mb-6">
            Ready to Build Your{" "}
            <span className="bg-linear-to-r from-[#3B82F6] to-[#14B8A6] bg-clip-text text-transparent">
              Intelligent HR Stack
            </span>
            ?
          </h2>
          <p className="text-lg text-[#8892A8] mb-10 max-w-2xl mx-auto">
            Join forward-thinking teams replacing guesswork with intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-linear-to-r from-[#3B82F6] to-[#14B8A6] text-white border-0 px-8 h-12 text-base gap-2 hover:opacity-90 shadow-[0_4px_20px_rgba(59,130,246,0.3)] hover:shadow-[0_6px_30px_rgba(59,130,246,0.5)] transition-shadow"
              )}
            >
              Start Free Trial — No Credit Card <ArrowRight className="size-4" />
            </Link>
            <a
              href="https://yatisphere.com/contact"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "border-white/[0.12] bg-white/[0.04] text-[#F1F5F9] px-8 h-12 text-base hover:bg-white/[0.08]"
              )}
            >
              Talk to an Architect
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
