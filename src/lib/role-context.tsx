"use client";

import { createContext, useContext, useMemo } from "react";
import { CURRENT_USER, type Role } from "@/components/profile/data";
import { useLocalStorage } from "@/lib/use-local-storage";

interface RoleContextValue {
  activeRole: Role;
  setActiveRole: (r: Role) => void;
  availableRoles: Role[];
}

const RoleContext = createContext<RoleContextValue | null>(null);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [activeRole, setActiveRole] = useLocalStorage<Role>(
    "o2s.activeRole",
    CURRENT_USER.defaultRole,
  );

  const value = useMemo<RoleContextValue>(
    () => ({
      activeRole: CURRENT_USER.roles.includes(activeRole) ? activeRole : CURRENT_USER.defaultRole,
      setActiveRole: (r) => setActiveRole(r),
      availableRoles: CURRENT_USER.roles,
    }),
    [activeRole, setActiveRole],
  );

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used inside <RoleProvider>");
  return ctx;
}
