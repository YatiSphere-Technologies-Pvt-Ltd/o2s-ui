"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

/* ── Small reusable pieces ── */

function SectionDivider() {
  return <div className="border-t border-border pt-6 mt-6" />;
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  );
}

function ThresholdRow({
  label,
  value,
  barColorClass,
}: {
  label: string;
  value: number;
  barColorClass: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-foreground w-28 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full rounded-full ${barColorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-xs font-mono text-foreground w-10 text-right">
        {value}%
      </span>
    </div>
  );
}

function CheckboxRow({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
}) {
  return (
    <label htmlFor={id} className="flex items-center gap-2.5 cursor-pointer">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(val) => onChange(val === true)}
      />
      <span className="text-sm text-foreground">{label}</span>
    </label>
  );
}

function RadioRow({
  name,
  value,
  selected,
  label,
  warning,
  onChange,
}: {
  name: string;
  value: string;
  selected: boolean;
  label: string;
  warning?: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex items-start gap-2.5 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="mt-0.5 accent-brand size-3.5"
      />
      <span className="text-sm text-foreground">
        {label}
        {warning && (
          <span className="text-destructive text-xs ml-1.5">{warning}</span>
        )}
      </span>
    </label>
  );
}

/* ── Main Component ── */

export function GlobalAISettings() {
  /* Human-in-the-Loop gates */
  const [gates, setGates] = useState({
    vpDecisions: true,
    financialDecisions: true,
    externalComms: true,
    dataDeletion: true,
    allActions: false,
  });

  /* AI Transparency - show reasoning to */
  const [showTo, setShowTo] = useState({
    admins: true,
    hiringManagers: true,
    recruiters: true,
    interviewers: false,
    candidates: false,
  });

  /* AI Badge visibility */
  const [badgeVisibility, setBadgeVisibility] = useState("show-all");

  /* Data & Privacy */
  const [dataPrivacy, setDataPrivacy] = useState({
    learnFromOrg: true,
    contributeAnonymized: false,
  });

  const toggleGate = (key: keyof typeof gates) =>
    setGates((p) => ({ ...p, [key]: !p[key] }));
  const toggleShowTo = (key: keyof typeof showTo) =>
    setShowTo((p) => ({ ...p, [key]: !p[key] }));
  const toggleData = (key: keyof typeof dataPrivacy) =>
    setDataPrivacy((p) => ({ ...p, [key]: !p[key] }));

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Global AI Settings
      </h2>

      {/* A) Confidence Thresholds */}
      <SectionTitle
        title="Default Confidence Thresholds"
        description="Agents inherit these unless overridden."
      />
      <div className="space-y-3">
        <ThresholdRow label="Auto-execute" value={85} barColorClass="bg-success" />
        <ThresholdRow label="Human review" value={60} barColorClass="bg-warning" />
        <ThresholdRow label="Auto-reject" value={30} barColorClass="bg-destructive" />
      </div>

      {/* B) Human-in-the-Loop Gates */}
      <SectionDivider />
      <SectionTitle
        title="Human-in-the-Loop Gates"
        description="Actions that always require human approval regardless of agent autonomy level."
      />
      <div className="space-y-3">
        <CheckboxRow
          id="gate-vp"
          label="VP+ role decisions require human approval"
          checked={gates.vpDecisions}
          onChange={() => toggleGate("vpDecisions")}
        />
        <CheckboxRow
          id="gate-financial"
          label="Financial decisions (offers, comp) require human"
          checked={gates.financialDecisions}
          onChange={() => toggleGate("financialDecisions")}
        />
        <CheckboxRow
          id="gate-external"
          label="External communications require human"
          checked={gates.externalComms}
          onChange={() => toggleGate("externalComms")}
        />
        <CheckboxRow
          id="gate-data"
          label="Data deletion/archival requires human"
          checked={gates.dataDeletion}
          onChange={() => toggleGate("dataDeletion")}
        />
        <CheckboxRow
          id="gate-all"
          label="All actions require human (override all autonomy)"
          checked={gates.allActions}
          onChange={() => toggleGate("allActions")}
        />
      </div>

      {/* C) AI Transparency */}
      <SectionDivider />
      <SectionTitle
        title="AI Transparency"
        description="Control how AI reasoning and badges are displayed."
      />

      <div className="space-y-4">
        <div>
          <p className="text-sm text-foreground font-medium mb-2">
            Show AI reasoning to:
          </p>
          <div className="space-y-2.5 ml-1">
            <CheckboxRow
              id="show-admins"
              label="Admins"
              checked={showTo.admins}
              onChange={() => toggleShowTo("admins")}
            />
            <CheckboxRow
              id="show-hm"
              label="Hiring Managers"
              checked={showTo.hiringManagers}
              onChange={() => toggleShowTo("hiringManagers")}
            />
            <CheckboxRow
              id="show-rec"
              label="Recruiters"
              checked={showTo.recruiters}
              onChange={() => toggleShowTo("recruiters")}
            />
            <CheckboxRow
              id="show-int"
              label="Interviewers"
              checked={showTo.interviewers}
              onChange={() => toggleShowTo("interviewers")}
            />
            <CheckboxRow
              id="show-cand"
              label="Candidates"
              checked={showTo.candidates}
              onChange={() => toggleShowTo("candidates")}
            />
          </div>
        </div>

        <div>
          <p className="text-sm text-foreground font-medium mb-2">
            AI badge visibility:
          </p>
          <div className="space-y-2.5 ml-1">
            <RadioRow
              name="badge-vis"
              value="show-all"
              selected={badgeVisibility === "show-all"}
              label="Show on all content"
              onChange={setBadgeVisibility}
            />
            <RadioRow
              name="badge-vis"
              value="internal-only"
              selected={badgeVisibility === "internal-only"}
              label="Internal users only"
              onChange={setBadgeVisibility}
            />
            <RadioRow
              name="badge-vis"
              value="hide-all"
              selected={badgeVisibility === "hide-all"}
              label="Hide all"
              warning="May violate EU AI Act"
              onChange={setBadgeVisibility}
            />
          </div>
        </div>
      </div>

      {/* D) Data & Privacy */}
      <SectionDivider />
      <SectionTitle
        title="Data & Privacy"
        description="Control how AI learns from your organization's data."
      />
      <div className="space-y-3">
        <div>
          <p className="text-sm text-foreground font-medium mb-2">
            AI learning:
          </p>
          <div className="space-y-2.5 ml-1">
            <CheckboxRow
              id="data-learn"
              label="Learn from org outcomes"
              checked={dataPrivacy.learnFromOrg}
              onChange={() => toggleData("learnFromOrg")}
            />
            <CheckboxRow
              id="data-contribute"
              label="Contribute anonymized data"
              checked={dataPrivacy.contributeAnonymized}
              onChange={() => toggleData("contributeAnonymized")}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3">
          <span className="text-sm text-foreground">
            Data retention for AI training:
          </span>
          <span className="text-sm font-medium text-foreground bg-secondary px-2 py-0.5 rounded">
            12 months
          </span>
        </div>
      </div>
    </div>
  );
}
