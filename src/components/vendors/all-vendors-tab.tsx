"use client";

import { useState } from "react";
import { LayoutGrid, Table2, MapPin, Phone, Mail, User, TrendingUp, TrendingDown, Minus, MoreHorizontal, Pencil, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  VENDORS,
  STATUS_CONFIG,
  TIER_CONFIG,
  perfBarColor,
  perfScoreColor,
  type Vendor,
} from "@/components/vendors/data";

type ViewMode = "cards" | "table";

function trendIcon(score: number) {
  if (score >= 70) return <TrendingUp className="size-3.5 text-success" />;
  if (score >= 50) return <Minus className="size-3.5 text-muted-foreground" />;
  return <TrendingDown className="size-3.5 text-destructive" />;
}

type AllVendorsTabProps = {
  onSelectVendor?: (vendor: Vendor) => void;
  onAutoSource?: (vendor: Vendor) => void;
};

function VendorCard({
  vendor,
  onSelectVendor,
  onAutoSource,
}: {
  vendor: Vendor;
  onSelectVendor?: (vendor: Vendor) => void;
  onAutoSource?: (vendor: Vendor) => void;
}) {
  const status = STATUS_CONFIG[vendor.status];
  const tier = TIER_CONFIG[vendor.tier];

  return (
    <div className="bg-card border border-border rounded-xl p-5 space-y-4">
      {/* Top row: ID + status + tier */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-muted-foreground">{vendor.id}</span>
          <span className="flex items-center gap-1.5">
            <span className={`size-1.5 rounded-full ${status.dotClass}`} />
            <span className={`text-xs font-medium ${status.textClass}`}>{status.label}</span>
          </span>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tier.bgClass} ${tier.colorClass}`}>
          {tier.icon} {tier.label}
        </span>
      </div>

      {/* Company name + type + location */}
      <div>
        <h3 className="font-semibold text-foreground">{vendor.companyName}</h3>
        <p className="text-sm text-muted-foreground">{vendor.type} &middot; {vendor.location}</p>
      </div>

      {/* Primary contact */}
      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><User className="size-3" />{vendor.primaryContact.name}</span>
        <span className="flex items-center gap-1"><Mail className="size-3" />{vendor.primaryContact.email}</span>
      </div>

      {/* Active work */}
      <div className="grid grid-cols-3 gap-3 py-3 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Assignments</p>
          <p className="text-sm font-semibold text-foreground">{vendor.activeAssignments}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Submissions</p>
          <p className="text-sm font-semibold text-foreground">{vendor.totalSubmissions}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">In Interviews</p>
          <p className="text-sm font-semibold text-foreground">
            {Math.round(vendor.totalSubmissions * vendor.submitToInterviewRate / 100)}
          </p>
        </div>
      </div>

      {/* Performance */}
      <div className="space-y-2 py-3 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Performance</span>
          <div className="flex items-center gap-1.5">
            <span className={`text-sm font-semibold ${perfScoreColor(vendor.performanceScore)}`}>
              {vendor.performanceScore}
            </span>
            {trendIcon(vendor.performanceScore)}
          </div>
        </div>
        <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
          <div
            className={`h-full rounded-full ${perfBarColor(vendor.performanceScore)} transition-all`}
            style={{ width: `${vendor.performanceScore}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Submit-to-Hire: {vendor.submitToHireRate}%</span>
          <span>{trendIcon(vendor.performanceScore)}</span>
        </div>
      </div>

      {/* Commercial */}
      <div className="grid grid-cols-2 gap-3 py-3 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">Fee Model</p>
          <p className="text-sm text-foreground">{vendor.feeModel} &middot; {vendor.defaultRate}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Fees</p>
          <p className="text-sm text-foreground">{vendor.totalFeesPaid} paid</p>
          {vendor.outstandingFees !== "₹0" && (
            <p className="text-xs text-warning">{vendor.outstandingFees} outstanding</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onSelectVendor?.(vendor)}>View Details</Button>
        <Button variant="outline" size="sm" onClick={() => onSelectVendor?.(vendor)}>
          <Pencil className="size-3 mr-1" />
          Edit
        </Button>
        <Button variant="outline" size="sm" onClick={() => onAutoSource?.(vendor)} className="flex items-center gap-1">
          <Sparkles className="size-3" />
        </Button>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function VendorTable({
  onSelectVendor,
  onAutoSource,
}: {
  onSelectVendor?: (vendor: Vendor) => void;
  onAutoSource?: (vendor: Vendor) => void;
}) {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">VND ID</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Company</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Type</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tier</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Active Assignments</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Submit&rarr;Hire Rate</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Fees YTD</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Performance</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {VENDORS.map((v) => {
              const status = STATUS_CONFIG[v.status];
              const tier = TIER_CONFIG[v.tier];
              return (
                <tr key={v.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{v.id}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{v.companyName}</td>
                  <td className="px-4 py-3 text-muted-foreground">{v.type}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${tier.bgClass} ${tier.colorClass}`}>
                      {tier.icon} {tier.label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5">
                      <span className={`size-1.5 rounded-full ${status.dotClass}`} />
                      <span className={`text-xs ${status.textClass}`}>{status.label}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">{v.activeAssignments}</td>
                  <td className="px-4 py-3">{v.submitToHireRate}%</td>
                  <td className="px-4 py-3">{v.totalFeesPaid}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={`h-full rounded-full ${perfBarColor(v.performanceScore)}`}
                          style={{ width: `${v.performanceScore}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${perfScoreColor(v.performanceScore)}`}>
                        {v.performanceScore}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="xs" onClick={() => onSelectVendor?.(v)}>View</Button>
                      <Button variant="ghost" size="xs" onClick={() => onSelectVendor?.(v)}>
                        <Pencil className="size-3 mr-0.5" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="xs" onClick={() => onAutoSource?.(v)}>
                        <Sparkles className="size-3 mr-0.5" />
                        Auto-Source
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function AllVendorsTab({ onSelectVendor, onAutoSource }: AllVendorsTabProps = {}) {
  const [view, setView] = useState<ViewMode>("cards");

  return (
    <div className="space-y-4">
      {/* View toggle */}
      <div className="flex items-center justify-end gap-1">
        <Button
          variant={view === "cards" ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => setView("cards")}
        >
          <LayoutGrid className="size-4" />
        </Button>
        <Button
          variant={view === "table" ? "secondary" : "ghost"}
          size="icon-sm"
          onClick={() => setView("table")}
        >
          <Table2 className="size-4" />
        </Button>
      </div>

      {view === "cards" ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {VENDORS.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} onSelectVendor={onSelectVendor} onAutoSource={onAutoSource} />
          ))}
        </div>
      ) : (
        <VendorTable onSelectVendor={onSelectVendor} onAutoSource={onAutoSource} />
      )}
    </div>
  );
}
