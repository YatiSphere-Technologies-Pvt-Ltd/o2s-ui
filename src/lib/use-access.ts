"use client";

import { useCallback } from "react";
import { useRbacStore } from "@/lib/rbac-store";
import { CURRENT_USER } from "@/components/profile/data";
import type { AssignmentScope } from "@/components/admin/rbac";

/**
 * Permission check against the Azure-style RBAC model.
 *
 * - The "current user" id resolves from CURRENT_USER. The legacy profile
 *   uses `u-001`; the admin RBAC dataset uses `u-prashant` (same human).
 *   Bridge them here so `useAccess` always resolves to the admin id.
 * - New surfaces should gate on `can(permKey, scope?)`. Older surfaces
 *   still use `useRole()` from role-context; both coexist.
 * - Pass scope: { kind: "module", module: "presales" } to ask "can this
 *   user do X in Pre-Sales?". Without a scope we test at tenant level.
 */
const LEGACY_USER_ID_MAP: Record<string, string> = {
  "u-001": "u-prashant",
};

export function useAccess() {
  const rbac = useRbacStore();
  const principalId = LEGACY_USER_ID_MAP[CURRENT_USER.id] ?? CURRENT_USER.id;

  const can = useCallback(
    (permKey: string, scope: AssignmentScope = { kind: "tenant" }) => {
      return rbac.effectiveFor(principalId, scope).perms.has(permKey);
    },
    [rbac, principalId],
  );

  const myAssignments = rbac.assignmentsForPrincipal(principalId);

  const canAny = useCallback(
    (permKeys: string[], scope: AssignmentScope = { kind: "tenant" }) => {
      const perms = rbac.effectiveFor(principalId, scope).perms;
      return permKeys.some((k) => perms.has(k));
    },
    [rbac, principalId],
  );

  return {
    principalId,
    can,
    canAny,
    myAssignments,
    /** Direct access to the store for advanced use. */
    rbac,
  };
}
