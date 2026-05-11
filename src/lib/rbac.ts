"use client";

import { useCallback, useMemo } from "react";
import { useAdminStore } from "@/lib/admin-store";
import { useRole } from "@/lib/role-context";
import {
  TIER_RANK,
  type ModuleKey,
  type TierKey,
} from "@/components/admin/data";

/**
 * "Current user" in the prototype is the persona toggled in the user menu.
 * We map the legacy persona name to a representative seeded user.
 */
const PERSONA_TO_USER_ID: Record<string, string> = {
  admin:    "u-prashant", // super_admin
  hr:       "u-anita",    // tenant_admin + hr_ops
  manager:  "u-rajiv",    // manager + delivery_manager
  employee: "u-priya",    // employee + engineer
};

export function useRBAC() {
  const { activeRole } = useRole();
  const store = useAdminStore();
  const currentUserId = PERSONA_TO_USER_ID[activeRole] ?? "u-priya";

  const effective = useMemo(() => store.effectiveFor(currentUserId), [store, currentUserId]);

  const hasPermission = useCallback(
    (permKey: string) => store.isPermitted(permKey, currentUserId),
    [store, currentUserId],
  );

  const hasAnyPermission = useCallback(
    (perms: string[]) => perms.some((p) => hasPermission(p)),
    [hasPermission],
  );

  const ownsModule = useCallback((m: ModuleKey) => store.ownsModule(m), [store]);

  const tierOf = useCallback((m: ModuleKey) => store.tierOf(m), [store]);

  const tierAtLeast = useCallback(
    (m: ModuleKey, min: TierKey) => {
      const t = store.tierOf(m);
      if (!t) return false;
      return TIER_RANK[t] >= TIER_RANK[min];
    },
    [store],
  );

  const isSuperAdmin = useMemo(
    () => effective.permissions.includes("platform.entitlements.write"),
    [effective.permissions],
  );

  const isTenantAdmin = useMemo(
    () => effective.permissions.includes("platform.admin"),
    [effective.permissions],
  );

  return {
    currentUserId,
    effectivePermissions: effective.permissions,
    permissionSources: effective.sources,
    hasPermission,
    hasAnyPermission,
    ownsModule,
    tierOf,
    tierAtLeast,
    isSuperAdmin,
    isTenantAdmin,
  };
}
