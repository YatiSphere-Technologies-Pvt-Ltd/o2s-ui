"use client";

import { useCallback, useMemo } from "react";
import {
  ADMIN_AUDIT,
  ADMIN_USERS,
  ALL_PERMISSIONS,
  BUILT_IN_GROUPS,
  BUILT_IN_ROLES,
  MODULES,
  MODULE_MAP,
  TENANT_ENTITLEMENTS,
  isPermissionEntitled,
  resolveEffectivePermissions,
  type AdminAuditEntry,
  type AdminRole,
  type AdminUser,
  type ModuleKey,
  type TenantEntitlement,
  type TierKey,
  type UserGroup,
  type UserStatus,
} from "@/components/admin/data";
import { useLocalStorage } from "@/lib/use-local-storage";

/**
 * Overlay shape: keeps the seed catalog immutable and stores deltas.
 */
interface AdminOverlay {
  /** Patches keyed by entitlement module key. */
  entitlementPatches: Record<string, Partial<TenantEntitlement>>;
  /** Custom roles created by tenant admins. */
  customRoles: AdminRole[];
  /** Permission patches per built-in role id. */
  rolePatches: Record<string, string[]>;
  /** Deleted role ids (built-ins are soft-hidden). */
  deletedRoleIds: string[];
  /** Custom groups. */
  customGroups: UserGroup[];
  /** Group patches keyed by group id. */
  groupPatches: Record<string, Partial<UserGroup>>;
  /** Deleted group ids. */
  deletedGroupIds: string[];
  /** Per-user mutations. */
  userPatches: Record<string, Partial<AdminUser>>;
  /** Newly invited users. */
  newUsers: AdminUser[];
  /** Audit entries the admin actions produced. */
  newAudit: AdminAuditEntry[];
}

const DEFAULT_OVERLAY: AdminOverlay = {
  entitlementPatches: {},
  customRoles: [],
  rolePatches: {},
  deletedRoleIds: [],
  customGroups: [],
  groupPatches: {},
  deletedGroupIds: [],
  userPatches: {},
  newUsers: [],
  newAudit: [],
};

function normalize(raw: Partial<AdminOverlay> | undefined | null): AdminOverlay {
  const r = raw ?? {};
  return {
    entitlementPatches: r.entitlementPatches ?? {},
    customRoles: r.customRoles ?? [],
    rolePatches: r.rolePatches ?? {},
    deletedRoleIds: r.deletedRoleIds ?? [],
    customGroups: r.customGroups ?? [],
    groupPatches: r.groupPatches ?? {},
    deletedGroupIds: r.deletedGroupIds ?? [],
    userPatches: r.userPatches ?? {},
    newUsers: r.newUsers ?? [],
    newAudit: r.newAudit ?? [],
  };
}

const TENANT_ADMIN_NAME = "Anita Verma";
const TENANT_ADMIN_ID = "u-anita";

export function useAdminStore() {
  const [raw, setRaw] = useLocalStorage<AdminOverlay>("o2s.adminOverlay", DEFAULT_OVERLAY);
  const overlay = useMemo(() => normalize(raw), [raw]);

  const setOverlay = useCallback(
    (v: AdminOverlay | ((prev: AdminOverlay) => AdminOverlay)) => {
      if (typeof v === "function") {
        setRaw((prev) => (v as (p: AdminOverlay) => AdminOverlay)(normalize(prev)));
      } else {
        setRaw(v);
      }
    },
    [setRaw],
  );

  function logAudit(entry: Omit<AdminAuditEntry, "id" | "whenISO" | "whenLabel" | "actorId" | "actorName">) {
    const now = new Date();
    const audit: AdminAuditEntry = {
      id: `aa-${now.getTime()}`,
      whenISO: now.toISOString(),
      whenLabel:
        now.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
        ", " +
        now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
      actorId: TENANT_ADMIN_ID,
      actorName: TENANT_ADMIN_NAME,
      ...entry,
    };
    return audit;
  }

  /* ── Entitlements ────────────────────────────────────── */

  const entitlements = useMemo<TenantEntitlement[]>(() => {
    return TENANT_ENTITLEMENTS.map((e) => {
      const p = overlay.entitlementPatches[e.module];
      return p ? { ...e, ...p } : e;
    });
  }, [overlay.entitlementPatches]);

  const ownsModule = useCallback(
    (m: ModuleKey) => entitlements.some((e) => e.module === m),
    [entitlements],
  );

  const tierOf = useCallback(
    (m: ModuleKey): TierKey | null => entitlements.find((e) => e.module === m)?.tier ?? null,
    [entitlements],
  );

  const setEntitlement = useCallback(
    (module: ModuleKey, patch: Partial<TenantEntitlement>) => {
      const before = entitlements.find((e) => e.module === module);
      const audit = logAudit({
        action: "entitlement_changed",
        summary: `${MODULE_MAP[module].label}: ${
          patch.tier ? `tier ${before?.tier ?? "—"} → ${patch.tier}` : "updated"
        }`,
        details: patch.tier && before ? [{ field: `${module}.tier`, before: before.tier, after: patch.tier }] : undefined,
      });
      setOverlay((prev) => ({
        ...prev,
        entitlementPatches: {
          ...prev.entitlementPatches,
          [module]: { ...(prev.entitlementPatches[module] ?? {}), ...patch },
        },
        newAudit: [audit, ...prev.newAudit],
      }));
    },
    [entitlements, setOverlay],
  );

  /* ── Roles ─────────────────────────────────────────── */

  const roles = useMemo<AdminRole[]>(() => {
    const deleted = new Set(overlay.deletedRoleIds);
    const out: AdminRole[] = [];
    for (const r of BUILT_IN_ROLES) {
      if (deleted.has(r.id)) continue;
      const patch = overlay.rolePatches[r.id];
      out.push(patch ? { ...r, permissions: patch } : r);
    }
    for (const r of overlay.customRoles) {
      if (deleted.has(r.id)) continue;
      const patch = overlay.rolePatches[r.id];
      out.push(patch ? { ...r, permissions: patch } : r);
    }
    return out;
  }, [overlay.rolePatches, overlay.customRoles, overlay.deletedRoleIds]);

  const findRole = useCallback((id: string) => roles.find((r) => r.id === id), [roles]);

  const togglePermissionOnRole = useCallback(
    (roleId: string, perm: string) => {
      setOverlay((prev) => {
        const all = [...BUILT_IN_ROLES, ...prev.customRoles];
        const role = all.find((r) => r.id === roleId);
        if (!role || role.id === "super_admin") return prev;
        const base = prev.rolePatches[roleId] ?? role.permissions;
        const next = base.includes(perm) ? base.filter((p) => p !== perm) : [...base, perm];
        const audit = logAudit({
          action: "role_updated",
          summary: `${base.includes(perm) ? "Revoked" : "Granted"} ${perm} on role ${role.name}.`,
        });
        return {
          ...prev,
          rolePatches: { ...prev.rolePatches, [roleId]: next },
          newAudit: [audit, ...prev.newAudit],
        };
      });
    },
    [setOverlay],
  );

  const resetRole = useCallback(
    (roleId: string) => {
      setOverlay((prev) => {
        const rolePatches = { ...prev.rolePatches };
        delete rolePatches[roleId];
        return { ...prev, rolePatches };
      });
    },
    [setOverlay],
  );

  const createRole = useCallback(
    (input: Omit<AdminRole, "id" | "builtIn" | "userCount">) => {
      const id = `custom-${Date.now()}`;
      const role: AdminRole = { ...input, id, builtIn: false, userCount: 0 };
      const audit = logAudit({
        action: "role_created",
        summary: `Created custom role ${role.name} (${role.permissions.length} permissions).`,
      });
      setOverlay((prev) => ({
        ...prev,
        customRoles: [...prev.customRoles, role],
        newAudit: [audit, ...prev.newAudit],
      }));
      return role;
    },
    [setOverlay],
  );

  const deleteRole = useCallback(
    (roleId: string) => {
      setOverlay((prev) => {
        const role = [...BUILT_IN_ROLES, ...prev.customRoles].find((r) => r.id === roleId);
        if (!role || role.id === "super_admin") return prev;
        const audit = logAudit({
          action: "role_deleted",
          summary: `Deleted role ${role.name}.`,
        });
        return {
          ...prev,
          customRoles: prev.customRoles.filter((r) => r.id !== roleId),
          deletedRoleIds: prev.deletedRoleIds.includes(roleId) ? prev.deletedRoleIds : [...prev.deletedRoleIds, roleId],
          newAudit: [audit, ...prev.newAudit],
        };
      });
    },
    [setOverlay],
  );

  /* ── Groups ─────────────────────────────────────────── */

  const groups = useMemo<UserGroup[]>(() => {
    const deleted = new Set(overlay.deletedGroupIds);
    const merged: UserGroup[] = [];
    for (const g of BUILT_IN_GROUPS) {
      if (deleted.has(g.id)) continue;
      const patch = overlay.groupPatches[g.id];
      merged.push(patch ? { ...g, ...patch } : g);
    }
    for (const g of overlay.customGroups) {
      if (deleted.has(g.id)) continue;
      const patch = overlay.groupPatches[g.id];
      merged.push(patch ? { ...g, ...patch } : g);
    }
    return merged;
  }, [overlay.groupPatches, overlay.customGroups, overlay.deletedGroupIds]);

  const findGroup = useCallback((id: string) => groups.find((g) => g.id === id), [groups]);

  const createGroup = useCallback(
    (input: Omit<UserGroup, "id">) => {
      const id = `g-custom-${Date.now()}`;
      const g: UserGroup = { ...input, id };
      const audit = logAudit({ action: "group_created", summary: `Created group ${g.name}.` });
      setOverlay((prev) => ({
        ...prev,
        customGroups: [...prev.customGroups, g],
        newAudit: [audit, ...prev.newAudit],
      }));
      return g;
    },
    [setOverlay],
  );

  const updateGroup = useCallback(
    (id: string, patch: Partial<UserGroup>) => {
      setOverlay((prev) => {
        const audit = logAudit({
          action: "group_updated",
          summary: `Updated group ${id}: ${Object.keys(patch).join(", ")}.`,
        });
        return {
          ...prev,
          groupPatches: { ...prev.groupPatches, [id]: { ...(prev.groupPatches[id] ?? {}), ...patch } },
          newAudit: [audit, ...prev.newAudit],
        };
      });
    },
    [setOverlay],
  );

  const deleteGroup = useCallback(
    (id: string) => {
      setOverlay((prev) => {
        const g = [...BUILT_IN_GROUPS, ...prev.customGroups].find((x) => x.id === id);
        if (!g) return prev;
        const audit = logAudit({ action: "group_deleted", summary: `Deleted group ${g.name}.` });
        return {
          ...prev,
          customGroups: prev.customGroups.filter((x) => x.id !== id),
          deletedGroupIds: prev.deletedGroupIds.includes(id) ? prev.deletedGroupIds : [...prev.deletedGroupIds, id],
          newAudit: [audit, ...prev.newAudit],
        };
      });
    },
    [setOverlay],
  );

  const toggleGroupMember = useCallback(
    (groupId: string, userId: string) => {
      setOverlay((prev) => {
        const g = [...BUILT_IN_GROUPS, ...prev.customGroups].find((x) => x.id === groupId);
        if (!g) return prev;
        const current = prev.groupPatches[groupId]?.memberIds ?? g.memberIds;
        const next = current.includes(userId) ? current.filter((u) => u !== userId) : [...current, userId];
        const audit = logAudit({
          action: current.includes(userId) ? "group_member_removed" : "group_member_added",
          summary: `${current.includes(userId) ? "Removed" : "Added"} ${userId} ${current.includes(userId) ? "from" : "to"} group ${g.name}.`,
        });
        return {
          ...prev,
          groupPatches: { ...prev.groupPatches, [groupId]: { ...(prev.groupPatches[groupId] ?? {}), memberIds: next } },
          newAudit: [audit, ...prev.newAudit],
        };
      });
    },
    [setOverlay],
  );

  /* ── Users ─────────────────────────────────────────── */

  const users = useMemo<AdminUser[]>(() => {
    const merged: AdminUser[] = [];
    for (const u of [...ADMIN_USERS, ...overlay.newUsers]) {
      const patch = overlay.userPatches[u.id];
      merged.push(patch ? { ...u, ...patch, roleIds: patch.roleIds ?? u.roleIds, directGrants: patch.directGrants ?? u.directGrants } : u);
    }
    return merged;
  }, [overlay.userPatches, overlay.newUsers]);

  const findUser = useCallback((id: string) => users.find((u) => u.id === id), [users]);

  const inviteUser = useCallback(
    (input: Omit<AdminUser, "id" | "status" | "lastActiveISO" | "joinedISO" | "mfaEnabled" | "ssoLinked">) => {
      const id = `u-new-${Date.now()}`;
      const u: AdminUser = {
        ...input,
        id,
        status: "invited",
        lastActiveISO: new Date().toISOString(),
        joinedISO: new Date().toISOString().slice(0, 10),
        mfaEnabled: false,
        ssoLinked: false,
      };
      const audit = logAudit({
        action: "user_invited",
        summary: `Invited ${u.name} (${u.email}).`,
      });
      setOverlay((prev) => ({
        ...prev,
        newUsers: [...prev.newUsers, u],
        newAudit: [audit, ...prev.newAudit],
      }));
      return u;
    },
    [setOverlay],
  );

  const setUserStatus = useCallback(
    (userId: string, status: UserStatus) => {
      setOverlay((prev) => {
        const u = users.find((x) => x.id === userId);
        if (!u) return prev;
        const audit = logAudit({
          action: status === "suspended" ? "user_suspended" : status === "offboarded" ? "user_offboarded" : "user_invited",
          summary: `${status === "suspended" ? "Suspended" : status === "offboarded" ? "Offboarded" : "Reactivated"} ${u.name}.`,
        });
        return {
          ...prev,
          userPatches: { ...prev.userPatches, [userId]: { ...(prev.userPatches[userId] ?? {}), status } },
          newAudit: [audit, ...prev.newAudit],
        };
      });
    },
    [setOverlay, users],
  );

  const toggleUserRole = useCallback(
    (userId: string, roleId: string) => {
      setOverlay((prev) => {
        const u = users.find((x) => x.id === userId);
        if (!u) return prev;
        const current = prev.userPatches[userId]?.roleIds ?? u.roleIds;
        const next = current.includes(roleId) ? current.filter((r) => r !== roleId) : [...current, roleId];
        const audit = logAudit({
          action: "user_role_changed",
          summary: `${current.includes(roleId) ? "Removed" : "Granted"} role ${roleId} ${current.includes(roleId) ? "from" : "to"} ${u.name}.`,
        });
        return {
          ...prev,
          userPatches: {
            ...prev.userPatches,
            [userId]: { ...(prev.userPatches[userId] ?? {}), roleIds: next },
          },
          newAudit: [audit, ...prev.newAudit],
        };
      });
    },
    [setOverlay, users],
  );

  const toggleUserDirectGrant = useCallback(
    (userId: string, perm: string) => {
      setOverlay((prev) => {
        const u = users.find((x) => x.id === userId);
        if (!u) return prev;
        const current = prev.userPatches[userId]?.directGrants ?? u.directGrants;
        const next = current.includes(perm) ? current.filter((p) => p !== perm) : [...current, perm];
        const audit = logAudit({
          action: current.includes(perm) ? "permission_revoked" : "permission_granted",
          summary: `${current.includes(perm) ? "Revoked" : "Granted"} direct permission '${perm}' ${current.includes(perm) ? "from" : "to"} ${u.name}.`,
        });
        return {
          ...prev,
          userPatches: {
            ...prev.userPatches,
            [userId]: { ...(prev.userPatches[userId] ?? {}), directGrants: next },
          },
          newAudit: [audit, ...prev.newAudit],
        };
      });
    },
    [setOverlay, users],
  );

  /* ── Effective permissions ─────────────────────────── */

  const effectiveFor = useCallback(
    (userId: string) => {
      const u = users.find((x) => x.id === userId);
      if (!u) return { permissions: [] as string[], sources: {} as Record<string, { kind: "role" | "group" | "direct"; sourceId: string; sourceLabel: string }[]> };
      return resolveEffectivePermissions(u, roles, groups);
    },
    [users, roles, groups],
  );

  const isPermitted = useCallback(
    (permKey: string, userId: string) => {
      if (!isPermissionEntitled(permKey, entitlements)) return false;
      const { permissions } = effectiveFor(userId);
      return permissions.includes(permKey);
    },
    [effectiveFor, entitlements],
  );

  /* ── Audit ────────────────────────────────────────── */

  const auditLog = useMemo<AdminAuditEntry[]>(() => {
    return [...overlay.newAudit, ...ADMIN_AUDIT].sort((a, b) => b.whenISO.localeCompare(a.whenISO));
  }, [overlay.newAudit]);

  /* ── Counters / dashboard helpers ────────────────── */

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status === "active").length;
    const invitedUsers = users.filter((u) => u.status === "invited").length;
    const suspendedUsers = users.filter((u) => u.status === "suspended").length;
    const ownedModuleCount = entitlements.length;
    const totalModuleCount = MODULES.length;
    const customRoleCount = roles.filter((r) => !r.builtIn).length;
    const groupCount = groups.length;
    return {
      totalUsers,
      activeUsers,
      invitedUsers,
      suspendedUsers,
      ownedModuleCount,
      totalModuleCount,
      customRoleCount,
      groupCount,
      totalPermissions: ALL_PERMISSIONS.length,
    };
  }, [users, entitlements, roles, groups]);

  return {
    /* entitlements */
    entitlements,
    ownsModule,
    tierOf,
    setEntitlement,
    /* roles */
    roles,
    findRole,
    togglePermissionOnRole,
    resetRole,
    createRole,
    deleteRole,
    /* groups */
    groups,
    findGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    toggleGroupMember,
    /* users */
    users,
    findUser,
    inviteUser,
    setUserStatus,
    toggleUserRole,
    toggleUserDirectGrant,
    /* resolver */
    effectiveFor,
    isPermitted,
    /* audit */
    auditLog,
    /* stats */
    stats,
  };
}
