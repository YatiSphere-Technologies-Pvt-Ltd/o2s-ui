"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, ShieldOff, Sparkles } from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useRBAC } from "@/lib/rbac";
import { MODULE_MAP, type ModuleKey } from "@/components/admin/data";

function NoAccessContent() {
  const { setScreen } = useScreen();
  const params = useSearchParams();
  const { isTenantAdmin, isSuperAdmin } = useRBAC();

  useEffect(() => {
    setScreen({ module: "Admin", page: "Access denied" });
    return () => setScreen(null);
  }, [setScreen]);

  const moduleKey = params.get("module") as ModuleKey | null;
  const perm = params.get("perm");
  const reason = params.get("reason"); // "not_owned" | "no_permission" | "tier_locked"

  const moduleDef = moduleKey ? MODULE_MAP[moduleKey] : null;

  const title =
    reason === "not_owned"
      ? "Module not entitled"
      : reason === "tier_locked"
      ? "Tier locked"
      : "Access denied";

  return (
    <div className="max-w-2xl mx-auto py-16 text-center space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="size-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mx-auto"
      >
        {reason === "not_owned" ? <ShieldOff className="size-8" /> : <Lock className="size-8" />}
      </motion.div>
      <div>
        <h1 className="text-2xl font-bold text-foreground tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
          {reason === "not_owned" && moduleDef && (
            <>
              Your tenant doesn&apos;t own the <strong>{moduleDef.label}</strong> module. Talk to your account team
              to add it.
            </>
          )}
          {reason === "tier_locked" && moduleDef && (
            <>
              <strong>{moduleDef.label}</strong> is enabled, but this feature requires a higher tier.
            </>
          )}
          {reason === "no_permission" && perm && (
            <>
              You don&apos;t have permission <code className="text-foreground font-mono">{perm}</code>. Ask your
              tenant admin to grant it.
            </>
          )}
          {!reason && "You don't have access to this resource."}
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 flex-wrap">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Back to home
        </Link>
        {(isTenantAdmin || isSuperAdmin) && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-brand text-brand-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <Sparkles className="size-3.5" />
            Open Admin
          </Link>
        )}
      </div>
    </div>
  );
}

export default function NoAccessPage() {
  return (
    <Suspense fallback={<div className="max-w-2xl mx-auto py-16 text-center text-sm text-muted-foreground">Loading…</div>}>
      <NoAccessContent />
    </Suspense>
  );
}
