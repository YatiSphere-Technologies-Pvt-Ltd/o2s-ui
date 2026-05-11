"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  User,
  Settings2,
  Bell,
  Keyboard,
  HelpCircle,
  LogOut,
  Check,
  UserCog,
} from "lucide-react";
import { CURRENT_USER, ROLE_META, type Role } from "@/components/profile/data";
import { useRole } from "@/lib/role-context";

export function UserMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { activeRole, setActiveRole, availableRoles } = useRole();
  const activeMeta = ROLE_META[activeRole];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const menuItems = [
    { label: "My Profile", href: "/profile", icon: User },
    { label: "Preferences", href: "/profile?tab=preferences", icon: Settings2 },
    { label: "Notifications", href: "/profile?tab=notifications", icon: Bell },
  ] as const;

  const secondaryItems = [
    { label: "Keyboard Shortcuts", icon: Keyboard },
    { label: "Help & Support", icon: HelpCircle },
  ] as const;

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 cursor-pointer"
      >
        <div className="flex size-8 items-center justify-center rounded-full bg-brand-purple text-xs font-bold text-white">
          {CURRENT_USER.initials}
        </div>
        <span className="hidden text-sm font-medium text-foreground lg:inline">
          {CURRENT_USER.firstName}
        </span>
        <ChevronDown
          className={`hidden size-3.5 text-muted-foreground transition-transform duration-200 lg:inline ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] as const }}
            style={{ transformOrigin: "top right" }}
            className="absolute right-0 top-12 w-72 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-purple text-sm font-bold text-white">
                  {CURRENT_USER.initials}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">
                    {CURRENT_USER.firstName} {CURRENT_USER.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {CURRENT_USER.email}
                  </p>
                </div>
                <span className={`ml-auto text-[10px] bg-secondary rounded-full px-2 py-0.5 whitespace-nowrap ${activeMeta.accent}`}>
                  {activeMeta.label}
                </span>
              </div>
            </div>

            {/* Role / Persona switcher */}
            {availableRoles.length > 1 && (
              <div className="px-3 py-3 border-b border-border">
                <div className="flex items-center gap-2 mb-2 text-[10px] uppercase tracking-wider text-muted-foreground/60">
                  <UserCog className="size-3" />
                  Switch persona
                </div>
                <div className="space-y-1">
                  {availableRoles.map((r: Role) => {
                    const meta = ROLE_META[r];
                    const isActive = r === activeRole;
                    return (
                      <button
                        key={r}
                        onClick={() => {
                          setActiveRole(r);
                          setOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-2 py-1.5 rounded-md text-left transition-colors ${
                          isActive
                            ? "bg-surface-overlay"
                            : "hover:bg-surface-overlay/60"
                        }`}
                      >
                        <span className={`size-1.5 rounded-full bg-current ${meta.accent}`} />
                        <span className="flex-1 min-w-0">
                          <span className={`block text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                            {meta.label}
                          </span>
                          <span className="block text-[10px] text-muted-foreground/60 truncate">
                            {meta.description}
                          </span>
                        </span>
                        {isActive && <Check className="size-3.5 text-brand shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation items */}
            <div className="py-1">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-overlay cursor-pointer transition-colors"
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}

              <div className="border-t border-border my-1" />

              {secondaryItems.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-surface-overlay cursor-pointer transition-colors"
                >
                  <item.icon className="size-4" />
                  {item.label}
                </div>
              ))}

              <div className="border-t border-border my-1" />

              <button
                onClick={() => {
                  setOpen(false);
                  window.location.href = "/sign-in";
                }}
                className="flex w-full items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 cursor-pointer transition-colors"
              >
                <LogOut className="size-4" />
                Sign Out
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
