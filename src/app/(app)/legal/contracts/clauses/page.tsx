"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Filter as FilterIcon, Search } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { CLAUSE_LIBRARY, RISK_TINT, type ClauseLibraryEntry } from "@/components/legal/clm/data";

type CategoryFilter = ClauseLibraryEntry["category"] | "all";

const CATEGORIES: CategoryFilter[] = ["all", "Confidentiality", "Liability", "Indemnity", "IP", "Data", "Term", "Payment", "Termination", "Governing law", "Warranties", "Insurance", "Non-solicit"];

export default function ClausesPage() {
  const { setScreen } = useScreen();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");

  useEffect(() => {
    setScreen({ module: "Legal", page: "Clause library" });
    return () => setScreen(null);
  }, [setScreen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CLAUSE_LIBRARY.filter((c) => {
      if (category !== "all" && c.category !== category) return false;
      if (!q) return true;
      return (
        c.title.toLowerCase().includes(q) ||
        c.shortName.includes(q) ||
        c.approvedLanguage.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start gap-3"
      >
        <Link
          href="/legal/contracts"
          className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
          aria-label="Back"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div className="flex items-start gap-3">
          <div className="size-10 rounded-lg bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0">
            <BookOpen className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Clause library</h1>
            <p className="text-sm text-muted-foreground">
              Pre-approved language. Use as building blocks for templates and authored drafts.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clause, language…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <FilterIcon className="size-3.5 text-muted-foreground" />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as CategoryFilter)}
          className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>
          ))}
        </select>
      </div>

      <ul className="space-y-2">
        {filtered.map((c) => (
          <li key={c.id} className="bg-card border border-border rounded-xl p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <code className="text-[10px] font-mono text-muted-foreground/60">{c.id}</code>
              <p className="text-sm font-medium text-foreground">{c.title}</p>
              <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded font-medium ${RISK_TINT[c.riskLevel]}`}>
                {c.riskLevel}
              </span>
              <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">
                {c.category}
              </span>
              <span className="text-[11px] text-muted-foreground ml-auto">
                {c.usedInTemplates} templates · {c.usedInContracts} contracts
              </span>
            </div>
            <p className="text-[12px] text-foreground mt-2 italic leading-snug">{c.approvedLanguage}</p>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground/70 mt-2 flex-wrap">
              <span>Owner: {c.ownerTeam}</span>
              <span>·</span>
              <span>Jurisdictions: {c.jurisdictions.join(", ")}</span>
              <span>·</span>
              <span>Updated {c.lastUpdated}</span>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="text-center text-sm text-muted-foreground italic py-12">No clauses match.</li>
        )}
      </ul>
    </div>
  );
}
