"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Pencil, Eye, MoreHorizontal, Search, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EMAIL_TEMPLATES, EMAIL_CATEGORIES } from "@/components/settings/hiring/data";

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

function HighlightVariables({ text }: { text: string }) {
  const parts = text.split(/({{[^}]+}})/g);
  return (
    <>
      {parts.map((part, idx) =>
        part.startsWith("{{") ? (
          <span key={idx} className="text-brand-purple">
            {part}
          </span>
        ) : (
          <span key={idx}>{part}</span>
        )
      )}
    </>
  );
}

export function EmailsTab() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");

  const filtered = EMAIL_TEMPLATES.filter((tpl) => {
    const matchesCategory = activeCategory === "All" || tpl.category === activeCategory;
    const matchesSearch =
      search === "" ||
      tpl.name.toLowerCase().includes(search.toLowerCase()) ||
      tpl.subject.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <p className="text-sm text-muted-foreground max-w-xl">
          Manage email templates sent to candidates at each stage. Use variables and AI
          personalization to customize each message.
        </p>
        <Button size="sm">
          <Plus className="size-3.5" />
          New Template
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {EMAIL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? "bg-brand text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search templates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 w-48 rounded-lg border border-border bg-background pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((tpl, i) => (
          <motion.div
            key={tpl.id}
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardVariants}
            className="bg-card border border-border rounded-xl p-4"
          >
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-foreground">{tpl.name}</span>
              <span
                className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${tpl.categoryColorClass}`}
              >
                {tpl.category}
              </span>
            </div>

            <p className="text-xs text-muted-foreground font-mono mt-2 truncate">
              <HighlightVariables text={tpl.subject} />
            </p>

            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              {tpl.aiPersonalization && (
                <span className="flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-success inline-block" />
                  AI personalization
                </span>
              )}
              {tpl.autoSend && (
                <span className="flex items-center gap-1">
                  <Zap className="size-3 text-warning" />
                  Auto-send: {tpl.autoSendTrigger}
                </span>
              )}
            </div>

            <p className="text-[10px] text-muted-foreground mt-2">Edited {tpl.lastEdited}</p>

            <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-border">
              <Button variant="ghost" size="xs">
                <Pencil className="size-3" />
                Edit
              </Button>
              <Button variant="ghost" size="xs">
                <Eye className="size-3" />
                Preview
              </Button>
              <Button variant="ghost" size="icon-xs" className="ml-auto">
                <MoreHorizontal className="size-3.5" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
