"use client";

import {
  Zap,
  Shield,
  BarChart3,
  Globe,
  HardDrive,
  Headphones,
} from "lucide-react";
import { ADD_ONS, formatCurrency } from "@/components/settings/data";
import { Button } from "@/components/ui/button";
import type { LucideIcon } from "lucide-react";

const ADDON_ICONS: Record<string, LucideIcon> = {
  Zap,
  Shield,
  BarChart3,
  Globe,
  HardDrive,
  Headphones,
};

export function AddOnsSection() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-4">Add-Ons</h2>

      <div className="flex overflow-x-auto gap-4 pb-2 scrollbar-thin">
        {ADD_ONS.map((addon) => {
          const Icon = ADDON_ICONS[addon.icon];

          return (
            <div
              key={addon.id}
              className="min-w-[220px] bg-card border border-border rounded-xl p-4 hover:-translate-y-0.5 transition-transform flex flex-col gap-3 shrink-0"
            >
              {/* Icon */}
              <div className="flex items-center justify-center size-10 rounded-lg bg-secondary">
                {Icon && <Icon className="size-5 text-foreground" />}
              </div>

              {/* Name + description */}
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {addon.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {addon.description}
                </p>
              </div>

              {/* Price */}
              <p className="text-sm font-bold text-foreground">
                {formatCurrency(addon.price)}
                <span className="text-xs text-muted-foreground font-normal">
                  /{addon.billingCycle}
                </span>
              </p>

              {/* Status / action */}
              <div className="mt-auto">
                {addon.active ? (
                  <div className="flex items-center justify-between">
                    <span className="bg-success/10 text-success text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                      Active
                    </span>
                    <Button
                      variant="ghost"
                      className="text-xs text-destructive h-auto p-0"
                    >
                      Remove
                    </Button>
                  </div>
                ) : addon.includedIn === "enterprise" ? (
                  <span className="text-muted-foreground/60 text-[10px]">
                    Included in Enterprise
                  </span>
                ) : (
                  <Button
                    variant="ghost"
                    className="text-xs text-brand h-auto p-0"
                  >
                    Add to Plan
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
