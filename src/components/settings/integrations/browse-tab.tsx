"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AVAILABLE_INTEGRATIONS,
  COMING_SOON_INTEGRATIONS,
  RECOMMENDED,
  CATEGORIES,
  CATEGORY_LABELS,
  formatPopularity,
  type Integration,
  type IntegrationCategory,
} from "@/components/settings/integrations/data";

const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

interface BrowseTabProps {
  searchQuery: string;
}

export function BrowseTab({ searchQuery }: BrowseTabProps) {
  const [activeCategory, setActiveCategory] = useState<
    IntegrationCategory | "all"
  >("all");

  const allBrowsable = [
    ...AVAILABLE_INTEGRATIONS,
    ...COMING_SOON_INTEGRATIONS,
  ];

  const filtered = allBrowsable.filter((i) => {
    const matchesSearch = i.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || i.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* ── Recommended Section ── */}
      <div className="rounded-xl border border-brand-purple/20 bg-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="size-4 text-brand-purple" />
          <h3 className="text-sm font-semibold text-foreground">
            Recommended for You
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {RECOMMENDED.map((rec) => (
            <div
              key={rec.id}
              className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
            >
              <div
                className="flex size-9 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
                style={{ backgroundColor: rec.logoColor }}
              >
                {rec.logoInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">
                  {rec.name}
                </p>
                <p className="text-xs text-success">{rec.uplift}</p>
              </div>
              <Button variant="ghost" size="xs">
                Connect
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ── Category Pills ── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeCategory === cat.key
                ? "bg-brand text-white"
                : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Integration Grid ── */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {filtered.map((integration) => (
          <BrowseCard key={integration.id} integration={integration} />
        ))}
      </motion.div>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No integrations match your search.
        </p>
      )}
    </div>
  );
}

function BrowseCard({ integration }: { integration: Integration }) {
  const isComingSoon = integration.status === "coming_soon";

  return (
    <motion.div
      variants={cardVariants}
      className="bg-card border border-border rounded-xl p-5 hover:-translate-y-0.5 transition-all"
    >
      {/* ── Top Row ── */}
      <div className="flex items-start gap-3">
        <div
          className="flex size-10 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
          style={{ backgroundColor: integration.logoColor }}
        >
          {integration.logoInitial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-foreground truncate">
              {integration.name}
            </span>
            {integration.isFeatured && (
              <Star className="size-3 fill-warning text-warning shrink-0" />
            )}
          </div>
          <span className="text-[10px] text-muted-foreground">
            {CATEGORY_LABELS[integration.category]}
          </span>
        </div>
      </div>

      {/* ── Description ── */}
      <p className="mt-2.5 text-xs text-muted-foreground line-clamp-2">
        {integration.description}
      </p>

      {/* ── Meta ── */}
      <div className="mt-2 flex items-center gap-2">
        {integration.popularity && (
          <span className="text-[10px] text-muted-foreground">
            {formatPopularity(integration.popularity)}
          </span>
        )}
        {integration.isAiEnhanced && (
          <span className="inline-flex items-center gap-0.5 text-[10px] text-success">
            <Sparkles className="size-2.5" />
            AI Enhanced
          </span>
        )}
      </div>

      {/* ── Action ── */}
      <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
        {isComingSoon ? (
          <>
            <span className="inline-flex items-center rounded-md bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
              Coming {integration.expectedDate}
            </span>
            <button className="text-xs font-medium text-muted-foreground hover:text-foreground">
              Notify Me
            </button>
          </>
        ) : (
          <button className="text-xs font-medium text-brand hover:underline">
            Connect
          </button>
        )}
      </div>
    </motion.div>
  );
}
