"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import {
  BarChart3,
  Building2,
  Users,
  CreditCard,
  Plug,
  Sparkles,
  Shield,
  Briefcase,
  UserCircle,
  Bell,
  Database,
  Code,
  Palette,
  ChevronDown,
} from "lucide-react";
import { SETTINGS_NAV } from "@/components/settings/data";
import type { LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  BarChart3,
  Building2,
  Users,
  CreditCard,
  Plug,
  Sparkles,
  Shield,
  Briefcase,
  UserCircle,
  Bell,
  Database,
  Code,
  Palette,
};

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const allItems = SETTINGS_NAV.flatMap((g) => g.items);
  const activeItem = allItems.find((item) => pathname.startsWith(item.href));

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)]">
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-border bg-card py-5 overflow-y-auto">
        <span className="text-xs uppercase tracking-wider text-muted-foreground mb-4 px-3 font-medium">
          Settings
        </span>

        {SETTINGS_NAV.map((group) => (
          <div key={group.label}>
            <span className="text-[10px] uppercase text-muted-foreground/60 px-3 mb-2 mt-4 block font-medium tracking-wider">
              {group.label}
            </span>
            <nav className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const Icon = ICON_MAP[item.icon];
                const active = pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                      active
                        ? "border-l-2 border-brand bg-brand/5 text-foreground font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-surface-overlay"
                    }`}
                  >
                    {Icon && <Icon className="size-4 shrink-0" />}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        ))}
      </aside>

      {/* ── Content Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile dropdown */}
        <div className="lg:hidden border-b border-border bg-card px-4 py-3">
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="flex items-center justify-between w-full text-sm font-medium text-foreground"
          >
            <span className="flex items-center gap-2">
              {activeItem && ICON_MAP[activeItem.icon] && (() => {
                const Icon = ICON_MAP[activeItem.icon];
                return <Icon className="size-4" />;
              })()}
              {activeItem?.label ?? "Settings"}
            </span>
            <ChevronDown
              className={`size-4 text-muted-foreground transition-transform ${
                mobileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {mobileOpen && (
            <nav className="mt-3 flex flex-col gap-0.5">
              {SETTINGS_NAV.map((group) => (
                <div key={group.label}>
                  <span className="text-[10px] uppercase text-muted-foreground/60 px-1 mb-1 mt-3 block font-medium tracking-wider">
                    {group.label}
                  </span>
                  {group.items.map((item) => {
                    const Icon = ICON_MAP[item.icon];
                    const active = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-2.5 px-2 py-2 text-sm rounded-md transition-colors ${
                          active
                            ? "bg-brand/5 text-foreground font-medium"
                            : "text-muted-foreground hover:text-foreground hover:bg-surface-overlay"
                        }`}
                      >
                        {Icon && <Icon className="size-4 shrink-0" />}
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </nav>
          )}
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</div>
      </div>
    </div>
  );
}
