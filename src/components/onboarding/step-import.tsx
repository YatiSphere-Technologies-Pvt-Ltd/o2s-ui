"use client";

import { useState, useEffect } from "react";
import { FileSpreadsheet, Link2, UserPlus, Upload, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CSV_COLUMN_MAP, CSV_PREVIEW } from "@/components/onboarding/data";

interface StepImportProps {
  onNext: () => void;
  onBack: () => void;
  onComplete: (complete: boolean) => void;
}

const METHODS = [
  { id: "csv", label: "CSV / Excel", icon: FileSpreadsheet },
  { id: "hris", label: "HRIS Sync", icon: Link2 },
  { id: "manual", label: "Manual Entry", icon: UserPlus },
] as const;

const statusBadge: Record<string, { bg: string; text: string; label: string }> = {
  mapped: { bg: "bg-success/10", text: "text-success", label: "Mapped" },
  review: { bg: "bg-warning/10", text: "text-warning", label: "Review" },
  auto: { bg: "bg-brand/10", text: "text-brand", label: "Auto" },
  skipped: { bg: "bg-secondary", text: "text-muted-foreground", label: "Skipped" },
};

export function StepImport({ onComplete }: StepImportProps) {
  const [method, setMethod] = useState<string>("csv");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  useEffect(() => {
    onComplete(true);
  }, [onComplete]);

  const simulateUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Import People</h2>
        <p className="text-sm text-muted-foreground">Add your employee directory to get started.</p>
      </div>

      {/* Method selection */}
      <div className="grid grid-cols-3 gap-3">
        {METHODS.map((m) => {
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={`bg-card border rounded-xl p-4 text-center cursor-pointer transition-all ${
                method === m.id ? "border-brand bg-brand/5" : "border-border hover:border-brand/30"
              }`}
            >
              <Icon className={`size-6 mx-auto mb-2 ${method === m.id ? "text-brand" : "text-muted-foreground"}`} />
              <div className="text-sm font-medium text-foreground">{m.label}</div>
            </button>
          );
        })}
      </div>

      {/* CSV view */}
      {method === "csv" && !uploaded && (
        <div className="space-y-4">
          {/* Drop zone */}
          <button
            type="button"
            onClick={simulateUpload}
            className="w-full border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-brand/30 transition-colors"
          >
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <div className="size-8 border-2 border-brand/30 border-t-brand rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Uploading...</p>
              </div>
            ) : (
              <>
                <Upload className="size-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Drop your CSV or Excel file here, or <span className="text-brand">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">.csv, .xlsx up to 10MB</p>
              </>
            )}
          </button>
          <button type="button" className="flex items-center gap-1.5 text-sm text-brand hover:underline">
            <Download className="size-3.5" /> Download template
          </button>
        </div>
      )}

      {method === "csv" && uploaded && (
        <div className="space-y-4">
          {/* File info */}
          <div className="bg-card border border-border rounded-lg p-3 flex items-center gap-3">
            <div className="size-8 rounded-md bg-success/10 flex items-center justify-center">
              <Check className="size-4 text-success" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">employees.csv</p>
              <p className="text-xs text-muted-foreground">142 rows detected</p>
            </div>
          </div>

          {/* Column mapping */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Column Mapping</h3>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">CSV Column</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">O2S Field</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {CSV_COLUMN_MAP.map((col) => {
                    const badge = statusBadge[col.status];
                    return (
                      <tr key={col.source} className="border-b border-border last:border-0">
                        <td className="px-3 py-2 text-foreground font-mono text-xs">{col.source}</td>
                        <td className="px-3 py-2 text-foreground">{col.target}</td>
                        <td className="px-3 py-2">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">Preview</h3>
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Email</th>
                    <th className="text-left px-3 py-2 text-xs font-medium text-muted-foreground">Dept</th>
                  </tr>
                </thead>
                <tbody>
                  {CSV_PREVIEW.map((row) => (
                    <tr key={row.email} className="border-b border-border last:border-0">
                      <td className="px-3 py-2 text-foreground">{row.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.email}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.dept}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Button className="bg-brand text-white hover:bg-brand/90">
            Import 142 employees
          </Button>
        </div>
      )}

      {method === "hris" && (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <Link2 className="size-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">HRIS sync will be available after setup. Connect in Integrations.</p>
        </div>
      )}

      {method === "manual" && (
        <div className="bg-card border border-border rounded-xl p-8 text-center">
          <UserPlus className="size-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">You can add employees manually from the People section after setup.</p>
        </div>
      )}
    </div>
  );
}
