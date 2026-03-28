"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { TEAM_ROLES } from "@/components/onboarding/data";

interface StepInviteProps {
  onNext: () => void;
  onBack: () => void;
  onComplete: (complete: boolean) => void;
}

interface InviteRow {
  email: string;
  role: string;
}

export function StepInvite({ onComplete }: StepInviteProps) {
  const [rows, setRows] = useState<InviteRow[]>([
    { email: "", role: "admin" },
    { email: "", role: "hr_manager" },
    { email: "", role: "viewer" },
  ]);
  const [bulkEmails, setBulkEmails] = useState("");
  const [showBulk, setShowBulk] = useState(false);

  useEffect(() => {
    onComplete(true);
  }, [onComplete]);

  const updateRow = (index: number, field: keyof InviteRow, value: string) => {
    setRows((prev) => prev.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  };

  const addRow = () => {
    setRows((prev) => [...prev, { email: "", role: "viewer" }]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Invite Your Team</h2>
        <p className="text-sm text-muted-foreground">Bring your team onboard to start collaborating.</p>
      </div>

      {/* Email rows */}
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex-1">
              {i === 0 && <Label className="mb-1.5">Email</Label>}
              <Input
                type="email"
                placeholder="colleague@company.com"
                value={row.email}
                onChange={(e) => updateRow(i, "email", e.target.value)}
              />
            </div>
            <div className="w-40">
              {i === 0 && <Label className="mb-1.5">Role</Label>}
              <select
                value={row.role}
                onChange={(e) => updateRow(i, "role", e.target.value)}
                className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {TEAM_ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        <Button variant="ghost" size="sm" onClick={addRow} className="text-brand">
          <Plus className="size-3.5 mr-1" /> Add another
        </Button>
      </div>

      {/* Bulk invite */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => setShowBulk(!showBulk)}
          className="text-sm text-brand hover:underline"
        >
          {showBulk ? "Hide" : "Show"} bulk invite
        </button>
        {showBulk && (
          <div className="space-y-1.5">
            <Label>Paste multiple emails (one per line)</Label>
            <Textarea
              placeholder={"jane@company.com\nalex@company.com\nmaria@company.com"}
              value={bulkEmails}
              onChange={(e) => setBulkEmails(e.target.value)}
              className="min-h-24"
            />
          </div>
        )}
      </div>

      {/* Skip note */}
      <p className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3">
        You can always invite more people from Settings &rarr; Users &amp; Roles.
      </p>
    </div>
  );
}
