"use client";

import { useState, useEffect } from "react";
import { Sparkles, LayoutTemplate, PenLine, FolderOpen, Building2, Globe, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TECH_DEPARTMENTS, DEFAULT_LOCATIONS } from "@/components/onboarding/data";

interface StepStructureProps {
  onNext: () => void;
  onBack: () => void;
  onComplete: (complete: boolean) => void;
}

interface Department {
  name: string;
  children: string[];
}

interface Location {
  city: string;
  country: string;
  type: "Headquarters" | "Remote" | "Office";
}

const METHODS = [
  { id: "ai", label: "AI Detect", icon: Sparkles, bg: "bg-brand-purple/10", text: "text-brand-purple" },
  { id: "template", label: "Industry Template", icon: LayoutTemplate, bg: "bg-brand/10", text: "text-brand" },
  { id: "manual", label: "Manual", icon: PenLine, bg: "bg-brand-teal/10", text: "text-brand-teal" },
] as const;

export function StepStructure({ onComplete }: StepStructureProps) {
  const [method, setMethod] = useState<string>("template");
  const [departments, setDepartments] = useState<Department[]>(
    TECH_DEPARTMENTS.map((d) => ({ ...d, children: [...d.children] }))
  );
  const [locations, setLocations] = useState<Location[]>(
    DEFAULT_LOCATIONS.map((l) => ({ ...l }))
  );

  useEffect(() => {
    onComplete(true);
  }, [onComplete]);

  const removeDept = (index: number) => {
    setDepartments((prev) => prev.filter((_, i) => i !== index));
  };

  const removeChild = (deptIndex: number, childIndex: number) => {
    setDepartments((prev) =>
      prev.map((dept, i) =>
        i === deptIndex
          ? { ...dept, children: dept.children.filter((_, ci) => ci !== childIndex) }
          : dept
      )
    );
  };

  const addDepartment = () => {
    setDepartments((prev) => [...prev, { name: "New Department", children: [] }]);
  };

  const addLocation = () => {
    setLocations((prev) => [...prev, { city: "New York", country: "US", type: "Office" }]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Org Structure</h2>
        <p className="text-sm text-muted-foreground">Set up departments and locations for your organization.</p>
      </div>

      {/* Setup method cards */}
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
              <div className={`inline-flex items-center justify-center size-10 rounded-lg ${m.bg} mb-2`}>
                <Icon className={`size-5 ${m.text}`} />
              </div>
              <div className="text-sm font-medium text-foreground">{m.label}</div>
            </button>
          );
        })}
      </div>

      {/* Department tree */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Departments</h3>
        <div className="space-y-1">
          {departments.map((dept, di) => (
            <div key={di}>
              <div className="flex items-center gap-2 py-1.5 px-2 rounded-md hover:bg-secondary/50 group">
                <FolderOpen className="size-4 text-muted-foreground" />
                <span className="text-sm text-foreground flex-1">{dept.name}</span>
                <button
                  type="button"
                  onClick={() => removeDept(di)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
              </div>
              {dept.children.length > 0 && (
                <div className="ml-4 pl-3 border-l-2 border-border space-y-0.5">
                  {dept.children.map((child, ci) => (
                    <div key={ci} className="flex items-center gap-2 py-1 px-2 rounded-md hover:bg-secondary/50 group">
                      <FolderOpen className="size-3.5 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground flex-1">{child}</span>
                      <button
                        type="button"
                        onClick={() => removeChild(di, ci)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={addDepartment} className="text-brand">
          + Add department
        </Button>
      </div>

      {/* Locations */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-foreground">Locations</h3>
        <div className="flex flex-wrap gap-3">
          {locations.map((loc, i) => (
            <div key={i} className="bg-card border border-border rounded-lg px-3 py-2 flex items-center gap-2">
              {loc.type === "Remote" ? (
                <Globe className="size-4 text-muted-foreground" />
              ) : (
                <Building2 className="size-4 text-muted-foreground" />
              )}
              <div>
                <span className="text-sm text-foreground">{loc.city}</span>
                <span className="text-xs text-muted-foreground ml-1">{loc.country}</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-secondary text-muted-foreground">
                {loc.type}
              </span>
            </div>
          ))}
        </div>
        <Button variant="ghost" size="sm" onClick={addLocation} className="text-brand">
          + Add location
        </Button>
      </div>
    </div>
  );
}
