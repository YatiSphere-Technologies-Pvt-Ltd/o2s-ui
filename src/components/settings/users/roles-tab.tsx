"use client";

import { motion } from "framer-motion";
import { Copy, Pencil, Trash2, Eye } from "lucide-react";
import { ROLES, type Role } from "@/components/settings/users/data";
import { Button } from "@/components/ui/button";

const containerVariants = {
  animate: {
    transition: { staggerChildren: 0.04 },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export function RolesTab() {
  const systemRoles = ROLES.filter((r) => r.type === "system");
  const customRoles = ROLES.filter((r) => r.type === "custom");

  return (
    <div className="space-y-6">
      {/* ── System Roles ── */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          System Roles
        </h3>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {systemRoles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </motion.div>
      </div>

      {/* ── Custom Roles ── */}
      <div>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Custom Roles
        </h3>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {customRoles.map((role) => (
            <RoleCard key={role.id} role={role} />
          ))}
        </motion.div>

        <Button variant="ghost" className="mt-4 text-xs text-muted-foreground">
          + Create custom role
        </Button>
      </div>
    </div>
  );
}

function RoleCard({ role }: { role: Role }) {
  const isCustom = role.type === "custom";

  return (
    <motion.div
      variants={cardVariants}
      className="bg-card border border-border rounded-xl p-5 hover:shadow-lg transition-all"
    >
      {/* ── Header ── */}
      <div className="flex items-start gap-3">
        <span className="text-lg leading-none">{role.icon}</span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-foreground">
              {role.name}
            </span>
            <span className="text-[10px] bg-secondary px-1.5 rounded-full text-secondary-foreground">
              {role.userCount} user{role.userCount !== 1 ? "s" : ""}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {isCustom ? "Custom" : "System role"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Description ── */}
      <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
        {role.description}
      </p>

      {/* ── Based On (custom only) ── */}
      {isCustom && role.basedOn && (
        <p className="mt-1.5 text-[10px] text-muted-foreground/70">
          Based on: {role.basedOn}
        </p>
      )}

      {/* ── Actions ── */}
      <div className="border-t border-border mt-3 pt-3 flex items-center gap-3">
        {isCustom ? (
          <>
            <button className="flex items-center gap-1 text-xs font-medium text-brand hover:underline">
              <Pencil className="size-3" />
              Edit
            </button>
            <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
              <Copy className="size-3" />
              Duplicate
            </button>
            <button className="flex items-center gap-1 text-xs text-destructive hover:underline ml-auto">
              <Trash2 className="size-3" />
              Delete
            </button>
          </>
        ) : (
          <button className="flex items-center gap-1 text-xs font-medium text-brand hover:underline">
            <Eye className="size-3" />
            View perms
          </button>
        )}
      </div>
    </motion.div>
  );
}
