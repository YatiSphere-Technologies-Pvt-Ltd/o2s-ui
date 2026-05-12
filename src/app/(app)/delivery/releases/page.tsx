"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  Package,
  Rocket,
  Sparkles,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useDeliveryStore } from "@/lib/delivery-store";
import {
  PROJECTS_MAP,
  RELEASE_STATUS_TINT,
  type Release,
  type ReleaseStatus,
} from "@/components/delivery/data";

export default function ReleasesPage() {
  const { setScreen } = useScreen();
  const { releases, updateRelease, workItems } = useDeliveryStore();
  const [statusFilter, setStatusFilter] = useState<ReleaseStatus | "all">("all");

  useEffect(() => {
    setScreen({ module: "Delivery", page: "Releases" });
    return () => setScreen(null);
  }, [setScreen]);

  const list = releases.filter((r) => statusFilter === "all" ? true : r.status === statusFilter);

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
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Releases</h1>
            <p className="text-sm text-muted-foreground">Release trains + feature-driven shipments. Auto-drafted notes from completed work.</p>
          </div>
        </div>
      </motion.div>

      <div className="flex items-center gap-1.5">
        {(["all", "planned", "in_progress", "shipped", "rolled_back"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`h-9 px-2.5 rounded-lg text-[11px] transition-colors ${
              statusFilter === s ? "bg-brand/10 text-brand border border-brand/30" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "all" ? "All" : s.replace("_", " ").charAt(0).toUpperCase() + s.replace("_", " ").slice(1)}
          </button>
        ))}
      </div>

      <ul className="space-y-3">
        {list.map((r) => (
          <ReleaseCard
            key={r.id}
            release={r}
            workTitles={r.workItemIds.map((wid) => workItems.find((w) => w.id === wid)?.title).filter(Boolean) as string[]}
            onStatus={(status) => updateRelease(r.id, { status })}
          />
        ))}
        {list.length === 0 && (
          <li className="text-sm text-muted-foreground italic text-center py-12">No releases match this filter.</li>
        )}
      </ul>
    </div>
  );
}

function ReleaseCard({
  release,
  workTitles,
  onStatus,
}: {
  release: Release;
  workTitles: string[];
  onStatus: (s: ReleaseStatus) => void;
}) {
  const project = PROJECTS_MAP[release.projectId];
  return (
    <li className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 flex items-start gap-3 flex-wrap">
        <div className="size-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
          <Rocket className="size-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-semibold text-foreground">{release.name}</p>
            <span className="text-[10px] uppercase tracking-wider bg-secondary text-foreground px-1.5 py-0.5 rounded">{release.version}</span>
            <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${RELEASE_STATUS_TINT[release.status]}`}>
              {release.status.replace("_", " ")}
            </span>
            <span className="text-[10px] uppercase tracking-wider bg-secondary text-muted-foreground px-1.5 py-0.5 rounded">{release.cadence.replace("_", " ")}</span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-1 inline-flex items-center gap-1.5">
            <Package className="size-3" />
            {project?.name}
            <span>·</span>
            <Calendar className="size-3" />
            Ship {release.shipDateISO}
          </p>
          {workTitles.length > 0 && (
            <ul className="mt-2 space-y-0.5">
              {workTitles.map((t, i) => (
                <li key={i} className="text-[12px] text-foreground flex items-start gap-2"><ChevronRight className="size-3 text-muted-foreground/40 mt-0.5" />{t}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {release.status === "planned" && (
            <button onClick={() => onStatus("in_progress")} className="h-8 px-2.5 rounded-lg bg-brand/10 text-brand text-[11px] hover:bg-brand/20 transition-colors">Start</button>
          )}
          {release.status === "in_progress" && (
            <>
              <button onClick={() => onStatus("shipped")} className="h-8 px-2.5 rounded-lg bg-success/10 text-success text-[11px] hover:bg-success/20 transition-colors">Mark shipped</button>
              <button onClick={() => onStatus("rolled_back")} className="h-8 px-2.5 rounded-lg bg-destructive/10 text-destructive text-[11px] hover:bg-destructive/20 transition-colors">Roll back</button>
            </>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="border-t border-border bg-surface-overlay/20 px-4 py-3">
        <div className="flex items-center gap-2 mb-1.5">
          <Sparkles className="size-3 text-brand-purple" />
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Auto-drafted release notes</p>
        </div>
        {release.draftNotes ? (
          <pre className="whitespace-pre-wrap text-[12px] text-foreground font-sans leading-relaxed">{release.draftNotes}</pre>
        ) : (
          <p className="text-[12px] text-muted-foreground italic">Notes will be drafted by the Status Drafter agent once the release enters &quot;in progress&quot;.</p>
        )}
      </div>
    </li>
  );
}
