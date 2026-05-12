"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  Construction,
  FileText,
  Megaphone,
  Plus,
  ShieldCheck,
  Shuffle,
  Sparkles,
  UserPlus,
  X,
  Zap,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import {
  DOC_KIND_LABEL,
  METHODOLOGY_LABEL,
  TEMPLATES,
  type ProjectTemplate,
} from "@/components/delivery/data";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Construction,
  Sparkles,
  UserPlus,
  Megaphone,
  Shuffle,
  ShieldCheck,
};

const TONE_TINT: Record<ProjectTemplate["tone"], string> = {
  brand: "bg-brand/10 text-brand",
  "brand-purple": "bg-brand-purple/10 text-brand-purple",
  "brand-teal": "bg-brand-teal/10 text-brand-teal",
  warning: "bg-warning/10 text-warning",
  success: "bg-success/10 text-success",
  destructive: "bg-destructive/10 text-destructive",
  gray: "bg-secondary text-muted-foreground",
};

export default function TemplatesPage() {
  const { setScreen } = useScreen();
  const [picked, setPicked] = useState<ProjectTemplate | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Templates" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link href="/delivery" className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Project templates</h1>
            <p className="text-sm text-muted-foreground">One-click project spawn. Each template seeds charter, epics, and artifact placeholders.</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-lg bg-success/10 border border-success/20 px-3 py-2 text-[12px] text-success flex items-center gap-2"
          >
            <Check className="size-3.5" />
            {flash}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {TEMPLATES.map((t) => {
          const Icon = ICON_MAP[t.iconName] ?? Sparkles;
          return (
            <button
              key={t.id}
              onClick={() => setPicked(t)}
              className="text-left bg-card border border-border rounded-xl p-4 hover:border-border/80 hover:bg-surface-overlay/30 transition-colors"
            >
              <div className="flex items-start gap-3">
                <div className={`size-10 rounded-lg flex items-center justify-center shrink-0 ${TONE_TINT[t.tone]}`}>
                  <Icon className="size-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">{t.description}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-3 text-[10px] text-muted-foreground border-t border-border pt-2">
                <span>{METHODOLOGY_LABEL[t.methodology]}</span>
                <span>·</span>
                <span>{t.produces.epics.length} epics</span>
                <span>·</span>
                <span>{t.produces.artifacts.length} artifacts</span>
              </div>
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {picked && (
          <TemplatePreviewModal
            template={picked}
            onClose={() => setPicked(null)}
            onSpawn={() => {
              flashOnce(`Project spawned from "${picked.name}" template (prototype).`);
              setPicked(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TemplatePreviewModal({
  template,
  onClose,
  onSpawn,
}: {
  template: ProjectTemplate;
  onClose: () => void;
  onSpawn: () => void;
}) {
  const Icon = ICON_MAP[template.iconName] ?? Sparkles;
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 bg-foreground/30 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-xl min-w-80 max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`size-9 rounded-lg flex items-center justify-center ${TONE_TINT[template.tone]}`}>
              <Icon className="size-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">{template.name}</h3>
              <p className="text-[11px] text-muted-foreground">{METHODOLOGY_LABEL[template.methodology]} · 1-click spawn</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors">
            <X className="size-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-thin">
          <p className="text-sm text-foreground leading-relaxed">{template.description}</p>
          <section>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5 inline-flex items-center gap-1.5"><FileText className="size-3" />Charter fields</p>
            <ul className="grid grid-cols-2 gap-1">
              {template.produces.charterFields.map((f) => (
                <li key={f} className="text-[12px] text-foreground inline-flex items-center gap-1.5"><Check className="size-3 text-success" />{f}</li>
              ))}
            </ul>
          </section>
          <section>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Seeded epics ({template.produces.epics.length})</p>
            <ol className="space-y-0.5">
              {template.produces.epics.map((e, i) => (
                <li key={i} className="text-[12px] text-foreground"><span className="text-muted-foreground tabular-nums">{i + 1}.</span> {e}</li>
              ))}
            </ol>
          </section>
          <section>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Artifact placeholders</p>
            <div className="flex flex-wrap gap-1.5">
              {template.produces.artifacts.map((a) => (
                <span key={a} className="text-[11px] px-2 py-1 rounded-full bg-secondary text-foreground">{DOC_KIND_LABEL[a]}</span>
              ))}
            </div>
          </section>
          {template.produces.sprints && (
            <section>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold inline-flex items-center gap-1.5"><Zap className="size-3" />Auto-plans {template.produces.sprints} sprints</p>
            </section>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button onClick={onClose} className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">
            Cancel
          </button>
          <button
            onClick={onSpawn}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Plus className="size-3.5" />
            Spawn project
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
