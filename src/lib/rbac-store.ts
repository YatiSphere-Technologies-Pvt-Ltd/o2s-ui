"use client";

import { useCallback, useMemo } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";
import {
  RBAC_ROLES,
  SEED_ASSIGNMENTS,
  assignmentApplies,
  effectivePermissions,
  roleById,
  type AssignmentScope,
  type RbacRole,
  type RoleAssignment,
  type RoleOwner,
} from "@/components/admin/rbac";
import { ADMIN_USERS } from "@/components/admin/data";

interface RbacAuditEntry {
  id: string;
  whenISO: string;
  whenLabel: string;
  actor: string;
  action:
    | "role_created"
    | "role_updated"
    | "role_deleted"
    | "assignment_created"
    | "assignment_removed";
  detail: string;
}

interface RbacOverlay {
  /** Custom roles authored by tenant admins. */
  customRoles: RbacRole[];
  /** Patches to built-in roles (rare, but supported). */
  rolePatches: Record<string, Partial<RbacRole>>;
  /** Soft-deleted built-in role ids. */
  hiddenRoleIds: string[];
  /** Net-new assignments added by admins. */
  addedAssignments: RoleAssignment[];
  /** Removed seed-assignment ids. */
  removedAssignmentIds: string[];
  audit: RbacAuditEntry[];
}

const DEFAULT_OVERLAY: RbacOverlay = {
  customRoles: [],
  rolePatches: {},
  hiddenRoleIds: [],
  addedAssignments: [],
  removedAssignmentIds: [],
  audit: [],
};

function normalize(raw: Partial<RbacOverlay> | null | undefined): RbacOverlay {
  const r = raw ?? {};
  return {
    customRoles:          r.customRoles          ?? [],
    rolePatches:          r.rolePatches          ?? {},
    hiddenRoleIds:        r.hiddenRoleIds        ?? [],
    addedAssignments:     r.addedAssignments     ?? [],
    removedAssignmentIds: r.removedAssignmentIds ?? [],
    audit:                r.audit                ?? [],
  };
}

const STORAGE_KEY = "o2s.rbac";

function logAudit(action: RbacAuditEntry["action"], detail: string, actor = "Anita Verma"): RbacAuditEntry {
  const now = new Date();
  return {
    id: `rb-${now.getTime()}-${Math.random().toString(36).slice(2, 6)}`,
    whenISO: now.toISOString(),
    whenLabel:
      now.toLocaleDateString("en-IN", { day: "numeric", month: "short" }) +
      ", " +
      now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }),
    actor,
    action,
    detail,
  };
}

export interface AssignmentRow extends RoleAssignment {
  /** Resolved role for convenience. */
  role: RbacRole;
  /** Resolved principal display label. */
  principalLabel: string;
}

export function useRbacStore() {
  const [rawOverlay, setRaw] = useLocalStorage<RbacOverlay>(STORAGE_KEY, DEFAULT_OVERLAY);
  const overlay = useMemo(() => normalize(rawOverlay), [rawOverlay]);

  const setOverlay = useCallback(
    (v: RbacOverlay | ((prev: RbacOverlay) => RbacOverlay)) => {
      if (typeof v === "function") {
        setRaw((prev) => (v as (p: RbacOverlay) => RbacOverlay)(normalize(prev)));
      } else {
        setRaw(v);
      }
    },
    [setRaw],
  );

  /* ── Roles ── */

  const roles = useMemo<RbacRole[]>(() => {
    const baseFiltered = RBAC_ROLES.filter((r) => !overlay.hiddenRoleIds.includes(r.id));
    const patched = baseFiltered.map((r) =>
      overlay.rolePatches[r.id] ? { ...r, ...overlay.rolePatches[r.id] } : r,
    );
    return [...patched, ...overlay.customRoles];
  }, [overlay.rolePatches, overlay.hiddenRoleIds, overlay.customRoles]);

  const resolveRole = useCallback(
    (id: string) => roles.find((r) => r.id === id) ?? roleById(id),
    [roles],
  );

  const cloneRole = useCallback(
    (sourceId: string, newName: string, ownerOverride?: RoleOwner): RbacRole | null => {
      const src = resolveRole(sourceId);
      if (!src) return null;
      const id = `custom.${Math.random().toString(36).slice(2, 8)}.${newName.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 20)}`;
      const role: RbacRole = {
        ...src,
        id,
        name: newName,
        description: `Custom role cloned from ${src.name}.`,
        builtIn: false,
        owner: ownerOverride ?? src.owner,
      };
      setOverlay((prev) => ({
        ...prev,
        customRoles: [...prev.customRoles, role],
        audit: [logAudit("role_created", `Cloned ${src.name} → ${newName}`), ...prev.audit],
      }));
      return role;
    },
    [resolveRole, setOverlay],
  );

  const updateRolePermissions = useCallback(
    (id: string, permissions: string[]) => {
      const role = resolveRole(id);
      if (!role) return;
      setOverlay((prev) => {
        // Custom roles: edit in-place. Built-ins: patch overlay.
        const isCustom = prev.customRoles.some((r) => r.id === id);
        if (isCustom) {
          return {
            ...prev,
            customRoles: prev.customRoles.map((r) => (r.id === id ? { ...r, permissions } : r)),
            audit: [logAudit("role_updated", `${role.name} permissions updated (${permissions.length})`), ...prev.audit],
          };
        }
        return {
          ...prev,
          rolePatches: { ...prev.rolePatches, [id]: { ...(prev.rolePatches[id] ?? {}), permissions } },
          audit: [logAudit("role_updated", `${role.name} permissions updated (${permissions.length})`), ...prev.audit],
        };
      });
    },
    [resolveRole, setOverlay],
  );

  const deleteRole = useCallback(
    (id: string) => {
      const role = resolveRole(id);
      if (!role) return;
      setOverlay((prev) => {
        if (role.builtIn) {
          return {
            ...prev,
            hiddenRoleIds: [...prev.hiddenRoleIds, id],
            audit: [logAudit("role_deleted", `Hid built-in role ${role.name}`), ...prev.audit],
          };
        }
        return {
          ...prev,
          customRoles: prev.customRoles.filter((r) => r.id !== id),
          audit: [logAudit("role_deleted", `Deleted custom role ${role.name}`), ...prev.audit],
        };
      });
    },
    [resolveRole, setOverlay],
  );

  /* ── Assignments ── */

  const assignments = useMemo<RoleAssignment[]>(() => {
    const base = SEED_ASSIGNMENTS.filter((a) => !overlay.removedAssignmentIds.includes(a.id));
    return [...base, ...overlay.addedAssignments];
  }, [overlay.removedAssignmentIds, overlay.addedAssignments]);

  const principalLabel = useCallback((kind: RoleAssignment["principalKind"], id: string) => {
    if (kind === "user") {
      return ADMIN_USERS.find((u) => u.id === id)?.name ?? id;
    }
    return id;
  }, []);

  const assignmentRows = useMemo<AssignmentRow[]>(() => {
    return assignments
      .map<AssignmentRow | null>((a) => {
        const role = resolveRole(a.roleId);
        if (!role) return null;
        return {
          ...a,
          role,
          principalLabel: principalLabel(a.principalKind, a.principalId),
        };
      })
      .filter((x): x is AssignmentRow => x !== null);
  }, [assignments, resolveRole, principalLabel]);

  const grantRole = useCallback(
    (params: {
      principalKind: RoleAssignment["principalKind"];
      principalId: string;
      roleId: string;
      scope: AssignmentScope;
      reason?: string;
      expiresAtISO?: string;
    }) => {
      const id = `ra-new-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const now = new Date();
      const assignment: RoleAssignment = {
        id,
        principalKind: params.principalKind,
        principalId: params.principalId,
        roleId: params.roleId,
        scope: params.scope,
        reason: params.reason,
        expiresAtISO: params.expiresAtISO,
        createdAtISO: now.toISOString(),
        createdBy: "u-anita",
      };
      setOverlay((prev) => ({
        ...prev,
        addedAssignments: [assignment, ...prev.addedAssignments],
        audit: [
          logAudit(
            "assignment_created",
            `Granted ${resolveRole(params.roleId)?.name ?? params.roleId} to ${principalLabel(params.principalKind, params.principalId)} on ${
              params.scope.kind === "tenant"
                ? "tenant"
                : params.scope.kind === "module"
                  ? `module:${params.scope.module}`
                  : `${params.scope.module}/${params.scope.recordId}`
            }`,
          ),
          ...prev.audit,
        ],
      }));
      return assignment;
    },
    [resolveRole, principalLabel, setOverlay],
  );

  const revokeAssignment = useCallback(
    (id: string) => {
      const a = assignments.find((x) => x.id === id);
      if (!a) return;
      setOverlay((prev) => {
        // If it's an overlay-added assignment, drop it; if it's a seed, mark removed.
        const isAdded = prev.addedAssignments.some((x) => x.id === id);
        return {
          ...prev,
          addedAssignments: isAdded ? prev.addedAssignments.filter((x) => x.id !== id) : prev.addedAssignments,
          removedAssignmentIds: !isAdded ? [...prev.removedAssignmentIds, id] : prev.removedAssignmentIds,
          audit: [
            logAudit(
              "assignment_removed",
              `Revoked ${resolveRole(a.roleId)?.name ?? a.roleId} from ${principalLabel(a.principalKind, a.principalId)}`,
            ),
            ...prev.audit,
          ],
        };
      });
    },
    [assignments, principalLabel, resolveRole, setOverlay],
  );

  /* ── Resolution ── */

  const effectiveFor = useCallback(
    (principalId: string, target: AssignmentScope = { kind: "tenant" }) => {
      const filtered = assignments.filter(
        (a) => a.principalKind === "user" && a.principalId === principalId,
      );
      return effectivePermissions(filtered, target, resolveRole);
    },
    [assignments, resolveRole],
  );

  const assignmentsForPrincipal = useCallback(
    (principalId: string) =>
      assignmentRows.filter(
        (a) => a.principalKind === "user" && a.principalId === principalId,
      ),
    [assignmentRows],
  );

  const assignmentsForScope = useCallback(
    (target: AssignmentScope) =>
      assignmentRows.filter((a) => assignmentApplies(a, target)),
    [assignmentRows],
  );

  /* ── Stats ── */

  const stats = useMemo(() => {
    const totalAssignments = assignments.length;
    const tenantScoped = assignments.filter((a) => a.scope.kind === "tenant").length;
    const moduleScoped = assignments.filter((a) => a.scope.kind === "module").length;
    const recordScoped = assignments.filter((a) => a.scope.kind === "record").length;
    const customRoleCount = roles.filter((r) => !r.builtIn).length;
    const principalsWithAccess = new Set(assignments.map((a) => a.principalId)).size;
    return {
      totalAssignments,
      tenantScoped,
      moduleScoped,
      recordScoped,
      customRoleCount,
      totalRoles: roles.length,
      principalsWithAccess,
    };
  }, [assignments, roles]);

  return {
    roles,
    resolveRole,
    cloneRole,
    updateRolePermissions,
    deleteRole,
    assignments,
    assignmentRows,
    grantRole,
    revokeAssignment,
    effectiveFor,
    assignmentsForPrincipal,
    assignmentsForScope,
    audit: overlay.audit,
    stats,
  };
}
