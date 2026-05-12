"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Sparkles, TriangleAlert, XCircle } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { PLAYBOOK, clauseById } from "@/components/legal/clm/data";

export default function PlaybooksPage() {
  const { setScreen } = useScreen();
  useEffect(() => {
    setScreen({ module: "Legal", page: "Playbook" });
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
          <div className="size-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Negotiation playbook</h1>
            <p className="text-sm text-muted-foreground">
              Ideal / acceptable / unacceptable positions per clause, with approval thresholds and rationale.
            </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-3">
        {PLAYBOOK.map((p) => {
          const ideal = p.ideal.clauseId ? clauseById(p.ideal.clauseId) : undefined;
          return (
            <article key={p.id} className="bg-card border border-border rounded-xl overflow-hidden">
              <header className="px-4 py-2.5 bg-surface-overlay/40 border-b border-border flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-foreground">{p.clauseTopic}</p>
                <code className="text-[10px] font-mono text-muted-foreground/60">{p.id}</code>
                <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground ml-auto">
                  Approver: {p.approvalThreshold.replace(/_/g, " ")}
                </span>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-3">
                <PositionCell
                  icon={CheckCircle2}
                  tone="success"
                  label="Ideal"
                  text={p.ideal.summary}
                  hint={ideal ? `Clause ${ideal.id}` : undefined}
                />
                <PositionCell
                  icon={TriangleAlert}
                  tone="warning"
                  label={`Acceptable (${p.acceptable.length})`}
                  text={p.acceptable.map((a) => a.summary).join(" · ") || "—"}
                  border
                />
                <PositionCell
                  icon={XCircle}
                  tone="destructive"
                  label="Unacceptable"
                  text={p.unacceptable.summary}
                  border
                />
              </div>
              <p className="px-4 py-2.5 text-[11px] text-muted-foreground border-t border-border">
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mr-2">Rationale</span>
                {p.rationale}
              </p>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function PositionCell({
  icon: Icon,
  tone,
  label,
  text,
  hint,
  border,
}: {
  icon: React.ComponentType<{ className?: string }>;
  tone: "success" | "warning" | "destructive";
  label: string;
  text: string;
  hint?: string;
  border?: boolean;
}) {
  const toneClass =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-destructive";
  return (
    <div className={`p-3 ${border ? "md:border-l border-border" : ""}`}>
      <div className={`flex items-center gap-1.5 ${toneClass}`}>
        <Icon className="size-3.5" />
        <p className="text-[10px] uppercase tracking-wider font-semibold">{label}</p>
      </div>
      <p className="text-[12px] text-foreground mt-1.5 leading-snug">{text}</p>
      {hint && <p className="text-[10px] text-muted-foreground/70 mt-1">{hint}</p>}
    </div>
  );
}
