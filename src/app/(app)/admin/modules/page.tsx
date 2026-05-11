"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  Check,
  Layers,
  Lock,
  Package,
  ShieldOff,
  Sparkles,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAdminStore } from "@/lib/admin-store";
import { useRBAC } from "@/lib/rbac";
import {
  MODULES,
  TIER_LABEL,
  TIER_RANK,
  type ModuleKey,
  type TierKey,
} from "@/components/admin/data";

export default function ModulesEntitlementsPage() {
  const { setScreen } = useScreen();
  const { entitlements, setEntitlement } = useAdminStore();
  const { isSuperAdmin } = useRBAC();
  const [editing, setEditing] = useState<ModuleKey | null>(null);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setScreen({ module: "Admin", page: "Modules" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link
            href="/admin"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Modules &amp; entitlements</h1>
            <p className="text-sm text-muted-foreground">
              What this tenant owns. Tier gates feature availability inside each module.
            </p>
          </div>
        </div>
        {isSuperAdmin && (
          <Link
            href="/admin/modules/catalog"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            <Layers className="size-3.5" />
            Catalog
            <ArrowRight className="size-3.5" />
          </Link>
        )}
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

      {/* Modules grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MODULES.map((m) => {
          const ent = entitlements.find((e) => e.module === m.key);
          const isOwned = !!ent;
          return (
            <div
              key={m.key}
              className={`bg-card border rounded-xl p-4 transition-colors ${
                isOwned ? "border-border" : "border-border opacity-70"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Package className={`size-4 ${m.accent}`} />
                    <h3 className="text-sm font-semibold text-foreground">{m.label}</h3>
                    {ent ? (
                      <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${tierTint(ent.tier)}`}>
                        {TIER_LABEL[ent.tier]}
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground inline-flex items-center gap-1">
                        <ShieldOff className="size-2.5" />
                        Not owned
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{m.blurb}</p>
                </div>
                {isSuperAdmin && (
                  <button
                    onClick={() => setEditing(m.key)}
                    className="text-[11px] text-brand hover:underline shrink-0"
                  >
                    Edit
                  </button>
                )}
              </div>

              {ent && (
                <div className="mt-3 border-t border-border pt-3 grid grid-cols-2 gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Users className="size-3" />
                    {ent.seats.toLocaleString("en-IN")} seats
                  </span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <CalendarIcon className="size-3" />
                    Expires {ent.expiresOn}
                  </span>
                </div>
              )}

              {/* Features */}
              <div className="mt-3 border-t border-border pt-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Features</p>
                <ul className="space-y-1">
                  {m.features.map((f) => {
                    const tierOk = ent && TIER_RANK[ent.tier] >= TIER_RANK[f.minTier];
                    return (
                      <li key={f.key} className="flex items-center gap-2 text-[11px]">
                        {tierOk ? (
                          <Check className="size-3 text-success shrink-0" />
                        ) : (
                          <Lock className="size-3 text-muted-foreground/40 shrink-0" />
                        )}
                        <span className={tierOk ? "text-foreground" : "text-muted-foreground/60"}>{f.label}</span>
                        {!tierOk && (
                          <span className="ml-auto text-[9px] uppercase tracking-wider text-muted-foreground/70">
                            {TIER_LABEL[f.minTier]}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-[11px] text-muted-foreground/60 flex items-start gap-2 pt-2">
        <Sparkles className="size-3 mt-0.5" />
        <span>
          Entitlements affect what shows in the sidebar and which permissions can be granted. Tenant Admins can&apos;t
          change entitlements — only Super Admin (your platform team) can.
        </span>
      </p>

      <AnimatePresence>
        {editing && isSuperAdmin && (
          <EditEntitlementModal
            module={editing}
            onClose={() => setEditing(null)}
            onSave={(patch) => {
              setEntitlement(editing, patch);
              setEditing(null);
              flashOnce(`Updated ${MODULES.find((m) => m.key === editing)?.label}.`);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function tierTint(tier: string) {
  if (tier === "enterprise") return "bg-brand-purple/10 text-brand-purple";
  if (tier === "pro")        return "bg-brand/10 text-brand";
  return "bg-secondary text-muted-foreground";
}

function EditEntitlementModal({
  module,
  onClose,
  onSave,
}: {
  module: ModuleKey;
  onClose: () => void;
  onSave: (patch: { tier?: TierKey; seats?: number; expiresOn?: string }) => void;
}) {
  const { entitlements } = useAdminStore();
  const m = MODULES.find((x) => x.key === module);
  const ent = entitlements.find((e) => e.module === module);
  const [tier, setTier] = useState<TierKey>(ent?.tier ?? m?.tiers[0] ?? "free");
  const [seats, setSeats] = useState<number>(ent?.seats ?? 100);
  const [expires, setExpires] = useState<string>(ent?.expiresOn ?? "2027-04-01");

  if (!m) return null;

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
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md min-w-80"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <div>
            <h3 className="text-base font-semibold text-foreground">Edit entitlement</h3>
            <p className="text-[11px] text-muted-foreground">{m.label}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">Tier</p>
            <div className="grid grid-cols-3 gap-2">
              {m.tiers.map((t) => (
                <button
                  key={t}
                  onClick={() => setTier(t)}
                  className={`p-2.5 rounded-lg border text-sm font-medium transition-colors ${
                    tier === t ? "border-brand bg-brand/5 text-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-surface-overlay"
                  }`}
                >
                  {TIER_LABEL[t]}
                </button>
              ))}
            </div>
          </div>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Seats</span>
            <input
              type="number"
              min={1}
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
              className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Expires on</span>
            <input
              type="date"
              value={expires}
              onChange={(e) => setExpires(e.target.value)}
              className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>

          <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-[11px] text-foreground flex items-start gap-2">
            <Zap className="size-3 mt-0.5 text-warning shrink-0" />
            <span>Changing the tier may revoke permissions on this module immediately. Users will see the new state on next request.</span>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button
            onClick={onClose}
            className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ tier, seats, expiresOn: expires })}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Check className="size-3.5" />
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
