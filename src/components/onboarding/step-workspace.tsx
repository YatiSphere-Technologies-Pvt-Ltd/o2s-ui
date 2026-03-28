"use client";

import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND_COLORS } from "@/components/onboarding/data";

interface StepWorkspaceProps {
  onNext: () => void;
  onBack: () => void;
  onComplete: (complete: boolean) => void;
}

export function StepWorkspace({ onComplete }: StepWorkspaceProps) {
  const [subdomain, setSubdomain] = useState("acme");
  const [selectedColor, setSelectedColor] = useState(BRAND_COLORS[0]);
  const [hexInput, setHexInput] = useState(BRAND_COLORS[0]);

  useEffect(() => {
    onComplete(true);
  }, [onComplete]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    setHexInput(color);
  };

  const handleHexChange = (val: string) => {
    setHexInput(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) {
      setSelectedColor(val);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Customize Your Workspace</h2>
        <p className="text-sm text-muted-foreground">Make O2S feel like home with your brand.</p>
      </div>

      {/* Subdomain */}
      <div className="space-y-1.5">
        <Label htmlFor="subdomain">Workspace URL</Label>
        <div className="flex items-center">
          <Input
            id="subdomain"
            value={subdomain}
            onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
            className="rounded-r-none"
          />
          <div className="h-8 flex items-center px-3 bg-secondary border border-l-0 border-input rounded-r-lg text-sm text-muted-foreground">
            .o2s.app
          </div>
        </div>
        {subdomain && (
          <p className="text-xs text-success flex items-center gap-1">
            Available &#10003;
          </p>
        )}
      </div>

      {/* Logo upload */}
      <div className="space-y-1.5">
        <Label>Company Logo</Label>
        <div className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-brand/30 transition-colors">
          <Upload className="size-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            Drop your logo here or <span className="text-brand">browse</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">SVG, PNG, or JPG up to 2MB</p>
        </div>
      </div>

      {/* Brand color picker */}
      <div className="space-y-2">
        <Label>Brand Color</Label>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            {BRAND_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => handleColorSelect(color)}
                className={`w-8 h-8 rounded-full cursor-pointer transition-all ${
                  selectedColor === color ? "ring-2 ring-white ring-offset-2 ring-offset-background scale-110" : ""
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <Input
            value={hexInput}
            onChange={(e) => handleHexChange(e.target.value)}
            className="w-24 text-xs font-mono"
            placeholder="#3B82F6"
          />
        </div>
      </div>

      {/* Live preview */}
      <div className="space-y-1.5">
        <Label>Preview</Label>
        <div className="bg-card rounded-xl p-4 border border-border">
          <div className="flex gap-3">
            {/* Mini sidebar mock */}
            <div className="w-40 bg-background rounded-lg p-3 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="size-5 rounded-md" style={{ backgroundColor: selectedColor }} />
                <span className="text-xs font-medium text-foreground">{subdomain || "acme"}</span>
              </div>
              {["Dashboard", "People", "Jobs", "AI Agents"].map((item, i) => (
                <div
                  key={item}
                  className={`text-xs px-2 py-1.5 rounded-md ${
                    i === 0 ? "text-white font-medium" : "text-muted-foreground"
                  }`}
                  style={i === 0 ? { backgroundColor: selectedColor } : undefined}
                >
                  {item}
                </div>
              ))}
            </div>
            {/* Content mock */}
            <div className="flex-1 bg-background rounded-lg p-3 space-y-2">
              <div className="h-3 rounded-full w-1/3" style={{ backgroundColor: selectedColor, opacity: 0.3 }} />
              <div className="h-2 rounded-full bg-secondary w-full" />
              <div className="h-2 rounded-full bg-secondary w-3/4" />
              <div className="h-2 rounded-full bg-secondary w-1/2" />
              <div className="mt-3 h-6 rounded-md w-20 text-[10px] text-white flex items-center justify-center font-medium" style={{ backgroundColor: selectedColor }}>
                Button
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
