"use client";

import { Nav } from "@/components/landing/nav";
import { Hero } from "@/components/landing/hero";
import { Problems } from "@/components/landing/problems";
import { Agents } from "@/components/landing/agents";
import { Features } from "@/components/landing/features";
import { Metrics } from "@/components/landing/metrics";
import { Pricing } from "@/components/landing/pricing";
import { Testimonials } from "@/components/landing/testimonials";
import { Compliance } from "@/components/landing/compliance";
import { CtaSection } from "@/components/landing/cta-section";
import { Footer } from "@/components/landing/footer";

export default function Home() {
  return (
    <div className="dark min-h-screen bg-[#07070D] text-[#F1F5F9]">
      <Nav />
      <Hero />
      <Problems />
      <Agents />
      <Features />
      <Metrics />
      <Pricing />
      <Testimonials />
      <Compliance />
      <CtaSection />
      <Footer />
    </div>
  );
}
