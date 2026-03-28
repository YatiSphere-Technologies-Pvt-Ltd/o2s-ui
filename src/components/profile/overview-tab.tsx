"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CURRENT_USER, type UserProfile } from "@/components/profile/data";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as const },
};

interface InfoFieldProps {
  label: string;
  value: string;
}

function InfoField({ label, value }: InfoFieldProps) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

interface EditFieldProps {
  label: string;
  value: string;
  field: keyof UserProfile;
  onChange: (field: keyof UserProfile, value: string) => void;
}

function EditField({ label, value, field, onChange }: EditFieldProps) {
  return (
    <div>
      <label className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
        {label}
      </label>
      <Input
        value={value}
        onChange={(e) => onChange(field, e.target.value)}
        className="text-sm"
      />
    </div>
  );
}

const CONNECTED_ACCOUNTS = [
  { name: "Google Workspace", detail: "Connected as prashant@latentbridge.com", connected: true },
  { name: "Slack", detail: "Connected", connected: true },
  { name: "LinkedIn", detail: "Not connected", connected: false },
  { name: "GitHub", detail: "Not connected", connected: false },
] as const;

export function OverviewTab() {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...CURRENT_USER });

  const handleChange = (field: keyof UserProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...CURRENT_USER });
    setEditing(false);
  };

  const fields: { label: string; field: keyof UserProfile }[] = [
    { label: "First Name", field: "firstName" },
    { label: "Last Name", field: "lastName" },
    { label: "Email", field: "email" },
    { label: "Phone", field: "phone" },
    { label: "Title", field: "title" },
    { label: "Department", field: "department" },
    { label: "Team", field: "team" },
    { label: "Location", field: "location" },
    { label: "Timezone", field: "timezone" },
    { label: "Pronouns", field: "pronouns" },
    { label: "LinkedIn", field: "linkedIn" },
    { label: "Language", field: "language" },
  ];

  return (
    <motion.div {...fadeIn} className="space-y-6">
      {/* Personal Information */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm text-foreground">Personal Information</h3>
          {!editing && (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
          )}
        </div>

        {editing ? (
          <>
            <div className="grid grid-cols-2 gap-4">
              {fields.map((f) => (
                <EditField
                  key={f.field}
                  label={f.label}
                  value={form[f.field]}
                  field={f.field}
                  onChange={handleChange}
                />
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" size="sm" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {fields.map((f) => (
              <InfoField key={f.field} label={f.label} value={form[f.field]} />
            ))}
          </div>
        )}
      </div>

      {/* Bio */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-3">Bio</h3>
        {editing ? (
          <Textarea
            value={form.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
            className="text-sm"
            rows={3}
          />
        ) : (
          <p className="text-sm text-muted-foreground leading-relaxed">{form.bio}</p>
        )}
      </div>

      {/* Role & Permissions */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-3">Role &amp; Permissions</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground font-medium">Role:</span>
            <span className="text-[10px] bg-brand-purple/10 text-brand-purple rounded-full px-2 py-0.5">
              {CURRENT_USER.role}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            As an Owner, you have complete control over the organization including settings, billing, users, and all data.
          </p>
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Permissions:</strong> Full access to all settings, users, billing, and data
          </p>
          <a
            href="/settings/users"
            className="inline-flex items-center gap-1 text-xs text-brand hover:underline mt-1"
          >
            View full permissions
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-semibold text-sm text-foreground mb-3">Connected Accounts</h3>
        <div className="space-y-3">
          {CONNECTED_ACCOUNTS.map((account) => (
            <div key={account.name} className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground font-medium">{account.name}</p>
                <p className="text-xs text-muted-foreground">{account.detail}</p>
              </div>
              {account.connected ? (
                <span className="text-[10px] bg-success/10 text-success rounded-full px-2 py-0.5">
                  Connected
                </span>
              ) : (
                <Button variant="outline" size="xs">
                  Connect
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
