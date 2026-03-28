"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { O2sLogo } from "@/components/auth/o2s-logo";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Security", href: "#security" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);

    const sections = navLinks.map((l) => l.href.replace("#", ""));
    let current = "";
    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 120) {
          current = id;
        }
      }
    }
    setActiveSection(current);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[#07070D]/80 backdrop-blur-xl border-b border-white/[0.08]"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-2.5">
          <O2sLogo size="sm" />
          <span className="hidden sm:inline text-[10px] text-muted-foreground/50 font-medium border-l border-border pl-2.5">
            by Yatisphere
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={cn(
                "relative text-sm font-medium transition-colors py-1",
                activeSection === link.href.replace("#", "")
                  ? "text-[#F1F5F9]"
                  : "text-[#8892A8] hover:text-[#F1F5F9]"
              )}
            >
              {link.label}
              {activeSection === link.href.replace("#", "") && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-linear-to-r from-[#3B82F6] to-[#14B8A6] rounded-full"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "text-[#8892A8] hover:text-[#F1F5F9] hover:bg-white/[0.04]"
            )}
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className={cn(
              buttonVariants({ size: "sm" }),
              "bg-linear-to-r from-[#3B82F6] to-[#14B8A6] text-white hover:opacity-90 border-0"
            )}
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden text-[#F1F5F9] p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0E0E18] border-b border-white/[0.08] overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "text-sm transition-colors",
                    activeSection === link.href.replace("#", "")
                      ? "text-[#F1F5F9] font-medium"
                      : "text-[#8892A8] hover:text-[#F1F5F9]"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.08]">
                <Link
                  href="/sign-in"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "sm" }),
                    "text-[#8892A8] hover:text-[#F1F5F9] justify-center"
                  )}
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "bg-linear-to-r from-[#3B82F6] to-[#14B8A6] text-white border-0 justify-center"
                  )}
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
