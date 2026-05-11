"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Filter as FilterIcon,
  History,
  Search,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useAdminStore } from "@/lib/admin-store";

const ACTION_LABEL: Record<string, string> = {
  role_created: "Role created",
  role_updated: "Role updated",
  role_deleted: "Role deleted",
  user_invited: "User invited",
  user_suspended: "User suspended",
  user_offboarded: "User offboarded",
  user_role_changed: "User role changed",
  group_created: "Group created",
  group_updated: "Group updated",
  group_deleted: "Group deleted",
  group_member_added: "Group member added",
  group_member_removed: "Group member removed",
  permission_granted: "Permission granted",
  permission_revoked: "Permission revoked",
  entitlement_changed: "Entitlement changed",
};

const ACTION_TINT: Record<string, string> = {
  role_created: "bg-success/10 text-success",
  role_updated: "bg-brand/10 text-brand",
  role_deleted: "bg-destructive/10 text-destructive",
  user_invited: "bg-success/10 text-success",
  user_suspended: "bg-warning/10 text-warning",
  user_offboarded: "bg-destructive/10 text-destructive",
  user_role_changed: "bg-brand/10 text-brand",
  group_created: "bg-success/10 text-success",
  group_updated: "bg-brand/10 text-brand",
  group_deleted: "bg-destructive/10 text-destructive",
  group_member_added: "bg-success/10 text-success",
  group_member_removed: "bg-warning/10 text-warning",
  permission_granted: "bg-success/10 text-success",
  permission_revoked: "bg-warning/10 text-warning",
  entitlement_changed: "bg-brand-purple/10 text-brand-purple",
};

export default function AdminAuditPage() {
  const { setScreen } = useScreen();
  const { auditLog } = useAdminStore();
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");

  useEffect(() => {
    setScreen({ module: "Admin", page: "Audit" });
    return () => setScreen(null);
  }, [setScreen]);

  const actionTypes = useMemo(() => Array.from(new Set(auditLog.map((a) => a.action))), [auditLog]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return auditLog.filter((a) => {
      if (actionFilter !== "all" && a.action !== actionFilter) return false;
      if (!q) return true;
      return (
        a.summary.toLowerCase().includes(q) ||
        a.actorName.toLowerCase().includes(q) ||
        a.action.toLowerCase().includes(q)
      );
    });
  }, [auditLog, query, actionFilter]);

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
            href="/admin"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight inline-flex items-center gap-2">
              <History className="size-5 text-muted-foreground" />
              Admin audit log
            </h1>
            <p className="text-sm text-muted-foreground">
              Every entitlement, role, user, group, and permission change. Append-only.
            </p>
          </div>
        </div>
        <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors">
          <Download className="size-3.5" />
          Export CSV
        </button>
      </motion.div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-44 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search summary, actor, action…"
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-input bg-card text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <FilterIcon className="size-3.5 text-muted-foreground" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="h-9 px-2.5 rounded-lg border border-input bg-card text-xs text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option value="all">All actions</option>
            {actionTypes.map((a) => (
              <option key={a} value={a}>{ACTION_LABEL[a] ?? a}</option>
            ))}
          </select>
        </div>
      </div>

      <ul className="bg-card border border-border rounded-xl overflow-hidden">
        {filtered.map((a) => (
          <li key={a.id} className="px-4 py-3 border-b border-border last:border-b-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className={`text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${ACTION_TINT[a.action] ?? "bg-secondary text-muted-foreground"}`}>
                    {ACTION_LABEL[a.action] ?? a.action}
                  </span>
                  <span className="text-[11px] text-muted-foreground">{a.whenLabel}</span>
                  <span className="text-[11px] text-muted-foreground">·</span>
                  <span className="text-[11px] text-foreground">{a.actorName}</span>
                </div>
                <p className="text-sm text-foreground">{a.summary}</p>
                {a.details && a.details.length > 0 && (
                  <ul className="mt-1.5 space-y-1">
                    {a.details.map((d, i) => (
                      <li key={i} className="text-[11px] flex items-center gap-2">
                        <code className="font-mono text-muted-foreground/70 min-w-30 truncate">{d.field}</code>
                        <span className="text-destructive line-through truncate">{d.before}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-success truncate">{d.after}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-4 py-12 text-center text-sm text-muted-foreground italic">No matching audit entries.</li>
        )}
      </ul>
    </div>
  );
}
