"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Crown, KeyRound, ShieldCheck } from "lucide-react";
import {
  MEMBERS,
  STATUS_CONFIG,
  INVITE_ROLES,
  type Member,
} from "@/components/settings/users/data";
import { Checkbox } from "@/components/ui/checkbox";

const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.03 },
  },
};

const rowVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

interface MembersTabProps {
  searchQuery: string;
}

export function MembersTab({ searchQuery }: MembersTabProps) {
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const uniqueRoles = Array.from(new Set(MEMBERS.map((m) => m.role)));
  const uniqueStatuses = Array.from(new Set(MEMBERS.map((m) => m.status)));

  let filtered = MEMBERS.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q);
    const matchesRole = roleFilter === "all" || m.role === roleFilter;
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (sortBy === "name") {
    filtered = [...filtered].sort((a, b) =>
      (a.name || a.email).localeCompare(b.name || b.email)
    );
  } else if (sortBy === "role") {
    filtered = [...filtered].sort((a, b) => a.role.localeCompare(b.role));
  } else if (sortBy === "status") {
    filtered = [...filtered].sort((a, b) => a.status.localeCompare(b.status));
  }

  return (
    <div className="space-y-3">
      {/* ── Filter Row ── */}
      <div className="flex items-center gap-2 flex-wrap">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="text-xs bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground outline-none focus:border-ring"
        >
          <option value="all">All Roles</option>
          {uniqueRoles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground outline-none focus:border-ring"
        >
          <option value="all">All Status</option>
          {uniqueStatuses.map((s) => (
            <option key={s} value={s}>
              {STATUS_CONFIG[s]?.label ?? s}
            </option>
          ))}
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="text-xs bg-card border border-border rounded-lg px-2.5 py-1.5 text-foreground outline-none focus:border-ring"
        >
          <option value="name">Sort: Name</option>
          <option value="role">Sort: Role</option>
          <option value="status">Sort: Status</option>
        </select>

        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} member{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Table ── */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="w-10 px-3 py-2.5">
                  <Checkbox />
                </th>
                <th className="text-left px-3 py-2.5 font-medium">User</th>
                <th className="text-left px-3 py-2.5 font-medium">Role</th>
                <th className="text-left px-3 py-2.5 font-medium hidden md:table-cell">
                  Department
                </th>
                <th className="text-left px-3 py-2.5 font-medium hidden lg:table-cell">
                  Auth
                </th>
                <th className="text-left px-3 py-2.5 font-medium">Status</th>
                <th className="text-left px-3 py-2.5 font-medium hidden lg:table-cell">
                  Details
                </th>
              </tr>
            </thead>
            <motion.tbody
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              {filtered.map((member) => (
                <MemberRow key={member.id} member={member} />
              ))}
            </motion.tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No members match your filters.
          </p>
        )}
      </div>
    </div>
  );
}

function MemberRow({ member }: { member: Member }) {
  const statusCfg = STATUS_CONFIG[member.status];
  const isDeactivated = member.status === "deactivated";
  const isPending = member.status === "pending";

  return (
    <motion.tr
      variants={rowVariants}
      className={`border-b border-border last:border-b-0 hover:bg-surface-overlay transition-colors ${
        isDeactivated ? "opacity-60" : ""
      }`}
    >
      {/* Checkbox */}
      <td className="px-3 py-2.5">
        <Checkbox />
      </td>

      {/* User */}
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div
              className={`flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${member.roleColorClass}`}
            >
              {member.initials}
            </div>
            {member.isOwner && (
              <Crown className="absolute -top-1 -right-1 size-3 text-warning" />
            )}
          </div>
          <div className="min-w-0">
            {isPending ? (
              <span className="font-mono text-[10px] text-muted-foreground">
                {member.email}
              </span>
            ) : (
              <>
                <p className="text-sm font-medium text-foreground truncate">
                  {member.name}
                </p>
                <p className="font-mono text-[10px] text-muted-foreground truncate">
                  {member.email}
                </p>
              </>
            )}
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="px-3 py-2.5">
        <span
          className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-medium ${member.roleColorClass}`}
        >
          {member.role}
        </span>
      </td>

      {/* Department */}
      <td className="px-3 py-2.5 hidden md:table-cell">
        <span className="text-xs text-muted-foreground">
          {member.department}
        </span>
      </td>

      {/* Auth */}
      <td className="px-3 py-2.5 hidden lg:table-cell">
        <div className="flex items-center gap-1.5">
          {member.hasSso && <KeyRound className="size-3.5 text-brand" />}
          {member.hasMfa && <ShieldCheck className="size-3.5 text-success" />}
          {!member.hasSso && !member.hasMfa && (
            <span className="text-[10px] text-muted-foreground/50">—</span>
          )}
        </div>
      </td>

      {/* Status */}
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-1.5">
          <span
            className={`size-1.5 rounded-full shrink-0 ${statusCfg.dotClass}`}
          />
          <span className="text-xs text-muted-foreground">
            {statusCfg.label}
          </span>
        </div>
      </td>

      {/* Details */}
      <td className="px-3 py-2.5 hidden lg:table-cell">
        {isPending && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground">
              Invited {member.invitedDate}
            </span>
            <button className="text-[10px] font-medium text-brand hover:underline">
              Resend
            </button>
            <button className="text-[10px] font-medium text-destructive hover:underline">
              Revoke
            </button>
          </div>
        )}
        {isDeactivated && (
          <div className="text-[10px] text-muted-foreground">
            <span>Deactivated {member.deactivatedDate}</span>
            {member.deactivatedBy && (
              <span> by {member.deactivatedBy}</span>
            )}
          </div>
        )}
        {!isPending && !isDeactivated && (
          <span className="text-[10px] text-muted-foreground">
            {member.lastActive}
          </span>
        )}
      </td>
    </motion.tr>
  );
}
