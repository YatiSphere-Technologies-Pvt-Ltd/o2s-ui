"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Crown, Layers, Lock } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useRBAC } from "@/lib/rbac";
import { MODULES, TIER_LABEL, type TierKey } from "@/components/admin/data";

const TIER_TINT: Record<TierKey, string> = {
  free: "bg-secondary text-muted-foreground",
  pro: "bg-brand/10 text-brand",
  enterprise: "bg-brand-purple/10 text-brand-purple",
};

export default function ModuleCatalogPage() {
  const { setScreen } = useScreen();
  const { isSuperAdmin } = useRBAC();

  useEffect(() => {
    setScreen({ module: "Admin", page: "Catalog" });
    return () => setScreen(null);
  }, [setScreen]);

  if (!isSuperAdmin) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center space-y-3">
        <Lock className="size-10 text-muted-foreground/40 mx-auto" />
        <h1 className="text-lg font-semibold text-foreground">Super Admin only</h1>
        <p className="text-sm text-muted-foreground">
          The SKU catalog is managed by the Yatisphere platform team. Tenant admins see entitlements at{" "}
          <Link href="/admin/modules" className="text-brand underline">
            /admin/modules
          </Link>
          .
        </p>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to Admin
        </Link>
      </div>
    );
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
          <Link
            href="/admin/modules"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight inline-flex items-center gap-2">
              <Layers className="size-5 text-destructive" />
              Module catalog
            </h1>
            <p className="text-sm text-muted-foreground">
              The platform-wide SKU catalog. Every module, tier, and feature flag.
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-[11px] font-medium">
          <Crown className="size-3" />
          Super Admin
        </span>
      </motion.div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-surface-overlay/40 border-b border-border">
            <tr className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
              <th className="text-left px-4 py-2.5 font-semibold">Module</th>
              <th className="text-left px-3 py-2.5 font-semibold">Tiers offered</th>
              <th className="text-right px-3 py-2.5 font-semibold">Feature flags</th>
            </tr>
          </thead>
          <tbody>
            {MODULES.map((m) => (
              <tr key={m.key} className="border-b border-border last:border-b-0 hover:bg-surface-overlay/30 transition-colors">
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-foreground">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">{m.blurb}</p>
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    {m.tiers.map((t) => (
                      <span key={t} className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${TIER_TINT[t]}`}>
                        {TIER_LABEL[t]}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-3 py-3 text-right tabular-nums text-foreground">{m.features.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MODULES.map((m) => (
          <div key={m.key} className="bg-card border border-border rounded-xl p-4">
            <h3 className="text-sm font-semibold text-foreground mb-2">{m.label}</h3>
            <ul className="space-y-1.5">
              {m.features.map((f) => (
                <li key={f.key} className="flex items-center gap-2 text-[12px]">
                  <code className="font-mono text-[10px] text-muted-foreground/70">{f.key}</code>
                  <span className="flex-1 text-foreground">{f.label}</span>
                  <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${TIER_TINT[f.minTier]}`}>
                    {TIER_LABEL[f.minTier]}+
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
