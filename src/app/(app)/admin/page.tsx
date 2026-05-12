"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  ChevronRight,
  Crown,
  Database,
  FileLock2,
  History,
  Layers,
  Lock,
  Package,
  Shield,
  UserCheck,
  Users,
  UsersRound,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAdminStore } from "@/lib/admin-store";
import { useRBAC } from "@/lib/rbac";
import { MODULES, TIER_LABEL } from "@/components/admin/data";

export default function AdminOverviewPage() {
  const { setScreen } = useScreen();
  const { stats, entitlements, auditLog } = useAdminStore();
  const { isSuperAdmin, isTenantAdmin } = useRBAC();

  useEffect(() => {
    setScreen({ module: "Admin", page: "Overview" });
    return () => setScreen(null);
  }, [setScreen]);

  const recentAudit = auditLog.slice(0, 5);

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
          <div className="size-10 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
            <Shield className="size-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Admin &amp; Security</h1>
            <p className="text-sm text-muted-foreground">
              Modules, users, roles, groups, audit. Centralised RBAC for every module this tenant owns.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSuperAdmin && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-destructive/10 text-destructive text-[11px] font-medium">
              <Crown className="size-3" />
              Super Admin
            </span>
          )}
          {isTenantAdmin && !isSuperAdmin && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-purple/10 text-brand-purple text-[11px] font-medium">
              <Lock className="size-3" />
              Tenant Admin
            </span>
          )}
        </div>
      </motion.div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard
          icon={Package}
          label="Modules entitled"
          value={`${stats.ownedModuleCount} / ${stats.totalModuleCount}`}
          accent="text-brand-purple"
          tint="bg-brand-purple/10"
          href="/admin/modules"
        />
        <StatCard
          icon={Users}
          label="Users"
          value={stats.totalUsers.toLocaleString("en-IN")}
          sub={`${stats.activeUsers} active · ${stats.invitedUsers} invited`}
          accent="text-brand"
          tint="bg-brand/10"
          href="/admin/users"
        />
        <StatCard
          icon={UserCheck}
          label="Roles"
          value={stats.customRoleCount > 0 ? `${stats.customRoleCount} custom` : "Built-ins only"}
          sub={`${stats.totalPermissions} fine-grained permissions`}
          accent="text-warning"
          tint="bg-warning/10"
          href="/admin/roles"
        />
        <StatCard
          icon={UsersRound}
          label="Groups"
          value={stats.groupCount.toString()}
          sub="Permission collections"
          accent="text-success"
          tint="bg-success/10"
          href="/admin/groups"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick actions */}
        <section className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Quick actions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ActionTile
              href="/admin/modules"
              icon={Package}
              title="Modules &amp; entitlements"
              description="See what your tenant has purchased and at which tier."
              accent="bg-brand-purple/10 text-brand-purple"
            />
            {isSuperAdmin && (
              <ActionTile
                href="/admin/modules/catalog"
                icon={Layers}
                title="Module catalog"
                description="The SKU catalog: modules, tiers, features. Super Admin only."
                accent="bg-destructive/10 text-destructive"
              />
            )}
            <ActionTile
              href="/admin/permissions"
              icon={FileLock2}
              title="Permission matrix"
              description="Every permission across every module, grouped by module."
              accent="bg-warning/10 text-warning"
            />
            <ActionTile
              href="/admin/rbac/roles"
              icon={UserCheck}
              title="RBAC · Roles"
              description="Azure-style per-module role catalog. Clone built-ins to mint custom roles."
              accent="bg-brand-purple/10 text-brand-purple"
            />
            <ActionTile
              href="/admin/rbac/assignments"
              icon={FileLock2}
              title="RBAC · Assignments"
              description="Every principal × role × scope. Grant at tenant, module, or single record."
              accent="bg-brand-teal/10 text-brand-teal"
            />
            <ActionTile
              href="/admin/rbac/my-access"
              icon={UserCheck}
              title="RBAC · My access"
              description="What you can do, and where. Useful for any user."
              accent="bg-success/10 text-success"
            />
            <ActionTile
              href="/admin/users"
              icon={Users}
              title="Users"
              description="Invite, suspend, change roles. See effective permissions."
              accent="bg-brand/10 text-brand"
            />
            <ActionTile
              href="/admin/groups"
              icon={UsersRound}
              title="Groups"
              description="Permission collections (e.g. APAC Engineering, On-call rota)."
              accent="bg-success/10 text-success"
            />
            <ActionTile
              href="/admin/audit"
              icon={History}
              title="Admin audit"
              description="Every entitlement, role, group, and user change. Immutable."
              accent="bg-secondary text-muted-foreground"
            />
          </div>
        </section>

        {/* Entitlements at a glance + recent audit */}
        <section className="space-y-4">
          <div>
            <h2 className="text-base font-semibold text-foreground mb-2">Entitlements at a glance</h2>
            <ul className="bg-card border border-border rounded-xl overflow-hidden">
              {MODULES.map((m) => {
                const ent = entitlements.find((e) => e.module === m.key);
                return (
                  <li
                    key={m.key}
                    className="px-3 py-2.5 border-b border-border last:border-b-0 flex items-center justify-between gap-2"
                  >
                    <span className="text-sm text-foreground truncate">{m.label}</span>
                    {ent ? (
                      <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${tierTint(ent.tier)}`}>
                        {TIER_LABEL[ent.tier]}
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 px-1.5 py-0.5 rounded bg-secondary">
                        Not owned
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-base font-semibold text-foreground inline-flex items-center gap-2">
                <Bell className="size-4 text-muted-foreground" />
                Recent admin actions
              </h2>
              <Link
                href="/admin/audit"
                className="text-[11px] text-brand hover:underline inline-flex items-center gap-1"
              >
                See all
                <ArrowRight className="size-3" />
              </Link>
            </div>
            <ul className="bg-card border border-border rounded-xl overflow-hidden">
              {recentAudit.map((a) => (
                <li key={a.id} className="px-3 py-2.5 border-b border-border last:border-b-0">
                  <p className="text-[12px] text-foreground leading-snug">{a.summary}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {a.actorName} · {a.whenLabel}
                  </p>
                </li>
              ))}
              {recentAudit.length === 0 && (
                <li className="px-3 py-6 text-center text-[12px] text-muted-foreground italic">No recent admin actions.</li>
              )}
            </ul>
          </div>
        </section>
      </div>

      <p className="text-[11px] text-muted-foreground/60 flex items-start gap-2 pt-2">
        <Database className="size-3 mt-0.5" />
        <span>
          Permissions resolve as <em>(roles + group memberships + direct grants)</em>, then filtered through the
          tenant entitlement gate. Changes are durable and auditable.
        </span>
      </p>
    </div>
  );
}

function tierTint(tier: string) {
  if (tier === "enterprise") return "bg-brand-purple/10 text-brand-purple";
  if (tier === "pro")        return "bg-brand/10 text-brand";
  return "bg-secondary text-muted-foreground";
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  tint,
  href,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub?: string;
  accent: string;
  tint: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-card border border-border rounded-xl p-4 hover:border-border/80 hover:bg-surface-overlay/30 transition-colors block"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className={`size-7 rounded-md ${tint} ${accent} flex items-center justify-center`}>
          <Icon className="size-3.5" />
        </div>
        <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">{label}</p>
      </div>
      <p className="text-xl font-bold text-foreground tabular-nums">{value}</p>
      {sub && <p className="text-[10px] text-muted-foreground/70 mt-0.5">{sub}</p>}
    </Link>
  );
}

function ActionTile({
  href,
  icon: Icon,
  title,
  description,
  accent,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <Link
      href={href}
      className="bg-card border border-border rounded-xl p-4 hover:border-border/80 hover:bg-surface-overlay/30 transition-colors flex items-start gap-3 group"
    >
      <div className={`size-9 rounded-lg flex items-center justify-center shrink-0 ${accent}`}>
        <Icon className="size-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{description}</p>
      </div>
      <ChevronRight className="size-4 text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0 mt-1" />
    </Link>
  );
}
