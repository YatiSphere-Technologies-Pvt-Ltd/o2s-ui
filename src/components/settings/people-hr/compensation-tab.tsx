"use client";

import { Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ENG_IC_PAY_BANDS,
  ENG_MGMT_PAY_BANDS,
  EQUITY_TIERS,
  BENEFITS_PACKAGES,
} from "@/components/settings/people-hr/data";
import type { PayBand } from "@/components/settings/people-hr/data";

function PayBandTable({
  title,
  bands,
}: {
  title: string;
  bands: PayBand[];
}) {
  return (
    <div>
      <h4 className="text-xs font-medium text-muted-foreground mb-2">
        {title}
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                Level
              </th>
              <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                Title
              </th>
              <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground text-right">
                Min
              </th>
              <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground text-right">
                Mid
              </th>
              <th className="pb-2 text-xs font-medium text-muted-foreground text-right">
                Max
              </th>
            </tr>
          </thead>
          <tbody>
            {bands.map((band) => (
              <tr
                key={band.level}
                className="border-b border-border/50 last:border-0"
              >
                <td className="py-1.5 pr-4 font-mono text-foreground">
                  {band.level}
                </td>
                <td className="py-1.5 pr-4 text-foreground">{band.title}</td>
                <td className="py-1.5 pr-4 text-right font-mono text-muted-foreground">
                  {band.min}
                </td>
                <td className="py-1.5 pr-4 text-right font-mono text-muted-foreground">
                  {band.mid}
                </td>
                <td className="py-1.5 text-right font-mono text-muted-foreground">
                  {band.max}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CompensationTab() {
  return (
    <div className="space-y-5">
      {/* ── Pay Bands ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Pay Bands</h3>
          <Button size="sm" variant="outline">
            <Plus className="size-3.5" />
            Add Role Family Bands
          </Button>
        </div>
        <div className="space-y-5">
          <PayBandTable title="Engineering — IC Track" bands={ENG_IC_PAY_BANDS} />
          <PayBandTable title="Engineering — Management Track" bands={ENG_MGMT_PAY_BANDS} />
        </div>
      </div>

      {/* ── Equity Tiers ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Equity Tiers
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Level
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Range
                </th>
                <th className="pb-2 pr-4 text-xs font-medium text-muted-foreground">
                  Vesting
                </th>
                <th className="pb-2 text-xs font-medium text-muted-foreground">
                  Refresh
                </th>
              </tr>
            </thead>
            <tbody>
              {EQUITY_TIERS.map((tier) => (
                <tr
                  key={tier.level}
                  className="border-b border-border/50 last:border-0"
                >
                  <td className="py-1.5 pr-4 font-mono text-foreground">
                    {tier.level}
                  </td>
                  <td className="py-1.5 pr-4 font-mono text-muted-foreground">
                    {tier.range}
                  </td>
                  <td className="py-1.5 pr-4 text-muted-foreground">
                    {tier.vesting}
                  </td>
                  <td className="py-1.5 text-muted-foreground">
                    {tier.refresh}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Benefits Packages ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Benefits Packages
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS_PACKAGES.map((pkg) => (
            <div
              key={pkg.name}
              className="border border-border rounded-lg p-3"
            >
              <p className="text-sm font-medium text-foreground">{pkg.name}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Eligible: {pkg.eligible}
              </p>
              <p className="text-xs text-muted-foreground">
                Cost: <span className="font-mono">{pkg.cost}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Enrolled: <span className="font-mono">{pkg.enrolled}</span>
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {pkg.items.map((item) => (
                  <Badge key={item} variant="secondary">
                    {item}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Pay Equity — AI Analysis ── */}
      <div className="bg-brand-purple/5 border-l-[3px] border-brand-purple p-3 rounded-r-lg">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="size-3.5 text-brand-purple" />
          <p className="text-xs font-medium text-foreground">
            Pay Equity — AI Analysis
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Last audit: No statistically significant pay gaps detected across
          gender or ethnicity within same level/role. Next scheduled audit: Q2
          2026.
        </p>
      </div>

      {/* ── Comp Review Settings ── */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Comp Review Settings
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Review cycle</span>
            <span className="text-foreground">Annual (Q1)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Budget allocation</span>
            <span className="text-foreground">Pool-based</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Merit pool</span>
            <span className="font-mono text-foreground">4%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Promotion pool</span>
            <span className="font-mono text-foreground">2%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Market adjustment pool</span>
            <span className="font-mono text-foreground">1%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
