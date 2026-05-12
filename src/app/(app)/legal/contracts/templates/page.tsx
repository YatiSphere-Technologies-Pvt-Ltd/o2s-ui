"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ChevronRight, FileText, Sparkles, Users } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { CONTRACT_TYPE_LABEL, TEMPLATES } from "@/components/legal/clm/data";

export default function TemplatesIndexPage() {
  const { setScreen } = useScreen();
  useEffect(() => {
    setScreen({ module: "Legal", page: "Templates" });
    return () => setScreen(null);
  }, [setScreen]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
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
          <div className="size-10 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
            <FileText className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Contract templates</h1>
            <p className="text-sm text-muted-foreground">
              Versioned templates with jurisdiction variants. Self-serve where flagged.
            </p>
          </div>
        </div>
      </motion.div>

      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {TEMPLATES.map((t) => (
          <li key={t.id}>
            <Link
              href={`/legal/contracts/templates/${t.id}`}
              className="group block bg-card border border-border rounded-xl p-4 hover:border-border/80 transition-colors h-full"
            >
              <div className="flex items-start gap-3">
                <div className="size-9 rounded-lg bg-secondary text-foreground flex items-center justify-center shrink-0">
                  <FileText className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">v{t.versions[t.versions.length - 1].version}</span>
                    {t.selfServeAllowed && (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-brand/10 text-brand inline-flex items-center gap-1">
                        <Sparkles className="size-2.5" />
                        Self-serve
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{t.description}</p>
                  <div className="flex items-center gap-3 text-[10px] text-muted-foreground/70 mt-2 flex-wrap">
                    <span>{CONTRACT_TYPE_LABEL[t.type]}</span>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1"><Users className="size-2.5" /> {t.usageCount} contracts</span>
                    <span>·</span>
                    <span>{t.jurisdictionVariants.map((j) => j.jurisdiction).join(", ")}</span>
                  </div>
                </div>
                <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-foreground transition-colors" />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
