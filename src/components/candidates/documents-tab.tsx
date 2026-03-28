"use client";

import { Upload, Download, Eye, FileText } from "lucide-react";
import { DOCUMENTS } from "@/components/candidates/data";
import { Button } from "@/components/ui/button";

export function DocumentsTab() {
  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center">
        <Upload className="size-8 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground mb-2">
          Drag and drop files here, or
        </p>
        <Button variant="outline" className="text-sm">
          Choose Files
        </Button>
      </div>

      {/* Documents Grid */}
      <div className="space-y-3">
        {DOCUMENTS.map((doc) => (
          <div
            key={doc.id}
            className="bg-card border border-border rounded-xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-lg bg-surface-raised flex items-center justify-center">
                <FileText className="size-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font-semibold">{doc.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${doc.statusColorClass}`}
                  >
                    {doc.status}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {doc.uploadedDate}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {doc.size}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {doc.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon-sm">
                <Download className="size-4" />
              </Button>
              <Button variant="ghost" size="icon-sm">
                <Eye className="size-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
