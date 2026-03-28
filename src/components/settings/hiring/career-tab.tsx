"use client";

import { ExternalLink, Globe, Image, CheckCircle2 } from "lucide-react";

const CONTENT_SECTIONS = [
  { label: "Hero Banner", checked: true },
  { label: "About Us", checked: true },
  { label: "Open Positions", checked: true },
  { label: "Department Spotlight", checked: true },
  { label: "Benefits & Perks", checked: true },
  { label: "Testimonials", checked: true },
  { label: "Core Values", checked: false },
  { label: "Locations", checked: false },
  { label: "Hiring Process", checked: false },
  { label: "DEI Statement", checked: false },
];

const BRAND_COLORS = [
  "bg-brand",
  "bg-brand-purple",
  "bg-brand-teal",
  "bg-foreground",
];

export function CareerTab() {
  return (
    <div className="space-y-8">
      {/* ── Status Bar ── */}
      <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-success bg-success/10 rounded-full px-2.5 py-1">
            <CheckCircle2 className="size-3" />
            Live
          </span>
          <span className="text-sm text-foreground font-medium">careers.acmecorp.com</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Preview</span>
          <a
            href="#"
            className="inline-flex items-center gap-1 text-xs text-brand hover:underline"
          >
            <ExternalLink className="size-3" />
            Open
          </a>
        </div>
      </div>

      {/* ── Domain Settings ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Domain</h3>
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-3">
            <span
              className="size-4 rounded-full border-2 border-brand flex items-center justify-center shrink-0"
            >
              <span className="size-2 rounded-full bg-brand" />
            </span>
            <span className="text-sm text-foreground">O2S Hosted</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="size-4 rounded-full border-2 border-border shrink-0" />
            <span className="text-sm text-muted-foreground">Custom Domain</span>
          </div>
          <div className="pt-3 border-t border-border">
            <label className="text-xs font-medium text-muted-foreground">URL Format</label>
            <p className="text-sm text-foreground mt-0.5 font-mono bg-secondary rounded px-2 py-1 inline-block">
              acmecorp.o2s.careers
            </p>
          </div>
        </div>
      </section>

      {/* ── Branding ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Branding</h3>
        <div className="bg-card border border-border rounded-xl p-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Logo</label>
              <div className="h-20 rounded-lg border border-dashed border-border bg-secondary flex items-center justify-center">
                <Image className="size-5 text-muted-foreground" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">
                Hero Banner
              </label>
              <div className="h-20 rounded-lg border border-dashed border-border bg-secondary flex items-center justify-center">
                <Image className="size-5 text-muted-foreground" />
              </div>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground mb-2 block">
              Brand Colors
            </label>
            <div className="flex items-center gap-2">
              {BRAND_COLORS.map((color) => (
                <span key={color} className={`size-6 rounded ${color}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Content Sections ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Content Sections</h3>
        <div className="bg-card border border-border rounded-xl p-5 space-y-2">
          {CONTENT_SECTIONS.map((section) => (
            <label key={section.label} className="flex items-center gap-3 cursor-pointer">
              <span
                className={`size-4 rounded border flex items-center justify-center shrink-0 ${
                  section.checked
                    ? "bg-brand border-brand text-white"
                    : "border-border bg-background"
                }`}
              >
                {section.checked && (
                  <svg className="size-2.5" viewBox="0 0 10 8" fill="none">
                    <path
                      d="M1 4l2.5 2.5L9 1"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="text-sm text-foreground">{section.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* ── SEO ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          <Globe className="size-4 text-muted-foreground" />
          SEO
        </h3>
        <div className="bg-card border border-border rounded-xl p-5 space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Meta Title</label>
            <p className="text-sm text-foreground mt-0.5">Careers at Acme Corp — Join Our Team</p>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Meta Description</label>
            <p className="text-sm text-foreground mt-0.5">
              Explore open positions at Acme Corp. We&apos;re building the future of work with
              talented people from around the world.
            </p>
          </div>
        </div>
      </section>

      {/* ── Analytics ── */}
      <section className="space-y-4">
        <h3 className="text-sm font-semibold text-foreground">Analytics Tracking</h3>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                Google Analytics ID
              </label>
              <p className="text-sm text-foreground mt-0.5 font-mono">G-XXXXXXXXXX</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Facebook Pixel ID</label>
              <p className="text-sm text-foreground mt-0.5 font-mono">123456789012345</p>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">
                LinkedIn Insight Tag
              </label>
              <p className="text-sm text-foreground mt-0.5 font-mono">987654</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
