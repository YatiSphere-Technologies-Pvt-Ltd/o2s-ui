"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bot,
  Building2,
  Calendar,
  Check,
  Globe,
  Languages,
  MapPin,
  Paintbrush,
  RotateCcw,
  Shield,
  X,
} from "lucide-react";
import { useScreen } from "@/lib/screen-context";
import { useLeaveStore } from "@/lib/leave-store";
import {
  AVAILABLE_LANGUAGES,
  DEFAULT_TENANT_SETTINGS,
  type DataResidency,
  type TenantAgentAutonomy,
} from "@/components/leave/data";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const REGIONS: { value: DataResidency; label: string; description: string }[] = [
  { value: "IN",   label: "India (Mumbai)",   description: "DPDP-compliant. AWS ap-south-1 + Snowflake India + Twilio India." },
  { value: "EU",   label: "European Union",   description: "GDPR. AWS eu-central-1 + Snowflake EU. No cross-border transfers." },
  { value: "US",   label: "United States",    description: "AWS us-east-1 + Snowflake US. CCPA + SOC2 Type II." },
  { value: "UK",   label: "United Kingdom",   description: "UK GDPR. AWS eu-west-2 + dedicated UK sub-processors." },
  { value: "APAC", label: "APAC (Singapore)", description: "Singapore PDPA. AWS ap-southeast-1 multi-region failover." },
];

const AUTONOMY_LEVELS: { value: TenantAgentAutonomy; description: string }[] = [
  { value: "Manual",     description: "Agents only draft suggestions; humans decide every action." },
  { value: "Supervised", description: "Agents act for routine items but ask before anything reversible." },
  { value: "Autonomous", description: "Agents act independently; humans can audit and override after." },
];

export default function TenantSettingsPage() {
  const { setScreen } = useScreen();
  const { tenantSettings, updateTenantSettings, resetTenantSettings } = useLeaveStore();
  const [flash, setFlash] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);

  useEffect(() => {
    setScreen({ module: "Leave", page: "Tenant Settings" });
    return () => setScreen(null);
  }, [setScreen]);

  function flashOnce(msg: string) {
    setFlash(msg);
    window.setTimeout(() => setFlash(null), 2200);
  }

  function updateBranding<K extends keyof typeof tenantSettings.branding>(key: K, value: (typeof tenantSettings.branding)[K]) {
    updateTenantSettings({ branding: { ...tenantSettings.branding, [key]: value } });
  }

  function toggleLanguage(code: string) {
    const set = new Set(tenantSettings.languages.map((l) => l.code));
    if (set.has(code)) {
      // can't disable the default language
      if (code === tenantSettings.defaultLanguage) {
        flashOnce("Default language cannot be removed.");
        return;
      }
      const next = tenantSettings.languages.filter((l) => l.code !== code);
      updateTenantSettings({ languages: next });
      flashOnce(`Removed ${code}.`);
    } else {
      const lang = AVAILABLE_LANGUAGES.find((l) => l.code === code);
      if (!lang) return;
      updateTenantSettings({ languages: [...tenantSettings.languages, lang] });
      flashOnce(`Added ${lang.label}.`);
    }
  }

  function updateFiscal(startMonth: number) {
    const startYear = 2026;
    const endYear = startMonth === 1 ? startYear : startYear + 1;
    const label = `FY${startYear} (${MONTHS[startMonth - 1].slice(0, 3)} ${startYear} → ${MONTHS[startMonth === 1 ? 11 : startMonth - 2].slice(0, 3)} ${endYear})`;
    updateTenantSettings({
      fiscalYear: { startMonth, startDay: 1, label },
    });
    flashOnce(`Fiscal year now starts on ${MONTHS[startMonth - 1]} 1.`);
  }

  function updateResidency<K extends keyof typeof tenantSettings.residency>(
    key: K,
    value: (typeof tenantSettings.residency)[K],
  ) {
    updateTenantSettings({ residency: { ...tenantSettings.residency, [key]: value } });
  }

  function updateAgentDefaults<K extends keyof typeof tenantSettings.agentDefaults>(
    key: K,
    value: (typeof tenantSettings.agentDefaults)[K],
  ) {
    updateTenantSettings({ agentDefaults: { ...tenantSettings.agentDefaults, [key]: value } });
  }

  const isDirty = JSON.stringify(tenantSettings) !== JSON.stringify(DEFAULT_TENANT_SETTINGS);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex items-start justify-between gap-3 flex-wrap"
      >
        <div className="flex items-start gap-3">
          <Link
            href="/leave/hr"
            className="mt-1 p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Back"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Tenant Settings</h1>
            <p className="text-sm text-muted-foreground">
              Branding, languages, fiscal calendar, data residency, and tenant-wide agent autonomy defaults.
            </p>
          </div>
        </div>
        {isDirty && (
          <button
            onClick={() => setConfirmingReset(true)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            <RotateCcw className="size-3.5" />
            Reset to defaults
          </button>
        )}
      </motion.div>

      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="rounded-lg bg-success/10 border border-success/20 px-3 py-2 text-[12px] text-success flex items-center gap-2"
          >
            <Check className="size-3.5" />
            {flash}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Branding */}
      <section className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-lg bg-brand/10 text-brand flex items-center justify-center shrink-0">
            <Paintbrush className="size-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-foreground">Branding</h2>
            <p className="text-[12px] text-muted-foreground">Customer-facing identity on emails, PDFs, and the header chip.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Display name</span>
            <input
              value={tenantSettings.branding.displayName}
              onChange={(e) => updateBranding("displayName", e.target.value)}
              className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Legal name</span>
            <input
              value={tenantSettings.branding.legalName}
              onChange={(e) => updateBranding("legalName", e.target.value)}
              className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Primary color</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                value={tenantSettings.branding.primaryColor}
                onChange={(e) => updateBranding("primaryColor", e.target.value)}
                className="h-9 w-12 rounded-lg border border-input bg-card cursor-pointer"
              />
              <input
                value={tenantSettings.branding.primaryColor}
                onChange={(e) => updateBranding("primaryColor", e.target.value)}
                className="flex-1 h-9 px-2.5 rounded-lg border border-input bg-card text-sm font-mono text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Accent color</span>
            <div className="mt-1 flex items-center gap-2">
              <input
                type="color"
                value={tenantSettings.branding.accentColor}
                onChange={(e) => updateBranding("accentColor", e.target.value)}
                className="h-9 w-12 rounded-lg border border-input bg-card cursor-pointer"
              />
              <input
                value={tenantSettings.branding.accentColor}
                onChange={(e) => updateBranding("accentColor", e.target.value)}
                className="flex-1 h-9 px-2.5 rounded-lg border border-input bg-card text-sm font-mono text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
            </div>
          </label>
          <label className="block sm:col-span-2">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Support email (shown to employees)</span>
            <input
              value={tenantSettings.branding.supportEmail}
              onChange={(e) => updateBranding("supportEmail", e.target.value)}
              className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </label>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <div className="min-w-0">
            <p className="text-sm text-foreground">Show &quot;Powered by O2S&quot; footer</p>
            <p className="text-[11px] text-muted-foreground">Appears in transactional emails and exported PDFs.</p>
          </div>
          <Toggle
            value={tenantSettings.branding.poweredByVisible}
            onChange={(v) => updateBranding("poweredByVisible", v)}
            ariaLabel="Toggle Powered by O2S footer"
          />
        </div>

        {/* Live preview */}
        <div className="border-t border-border pt-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">Preview</p>
          <div
            className="rounded-lg border border-border p-3 flex items-center gap-3"
            style={{ background: `linear-gradient(135deg, ${tenantSettings.branding.primaryColor}15, ${tenantSettings.branding.accentColor}10)` }}
          >
            <div
              className="size-9 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: tenantSettings.branding.primaryColor }}
            >
              {tenantSettings.branding.displayName.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground truncate">{tenantSettings.branding.displayName}</p>
              <p className="text-[11px] text-muted-foreground truncate">{tenantSettings.branding.legalName}</p>
            </div>
            <span
              className="text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded text-white"
              style={{ background: tenantSettings.branding.accentColor }}
            >
              Active
            </span>
          </div>
        </div>
      </section>

      {/* Languages */}
      <section className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-lg bg-brand-teal/10 text-brand-teal flex items-center justify-center shrink-0">
            <Languages className="size-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-foreground">Languages</h2>
            <p className="text-[12px] text-muted-foreground">
              Locales available to employees. Default language is used for new users and system notifications.
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Default language</span>
            <select
              value={tenantSettings.defaultLanguage}
              onChange={(e) => updateTenantSettings({ defaultLanguage: e.target.value })}
              className="mt-1 w-full sm:max-w-xs h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {tenantSettings.languages.map((l) => (
                <option key={l.code} value={l.code}>{l.label}</option>
              ))}
            </select>
          </label>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">
              Available locales ({tenantSettings.languages.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AVAILABLE_LANGUAGES.map((l) => {
                const enabled = tenantSettings.languages.some((x) => x.code === l.code);
                const isDefault = l.code === tenantSettings.defaultLanguage;
                return (
                  <button
                    key={l.code}
                    onClick={() => toggleLanguage(l.code)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-colors ${
                      enabled
                        ? "border-brand bg-brand/5"
                        : "border-border bg-card hover:bg-surface-overlay"
                    }`}
                  >
                    <div
                      className={`size-4 rounded border flex items-center justify-center shrink-0 ${
                        enabled ? "bg-brand border-brand" : "border-border bg-card"
                      }`}
                    >
                      {enabled && <Check className="size-2.5 text-brand-foreground" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground truncate">{l.label}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{l.code}</p>
                    </div>
                    {isDefault && (
                      <span className="text-[9px] uppercase tracking-wider text-brand bg-brand/10 px-1.5 py-0.5 rounded">
                        Default
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Fiscal Year */}
      <section className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-lg bg-warning/10 text-warning flex items-center justify-center shrink-0">
            <Calendar className="size-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-foreground">Fiscal year</h2>
            <p className="text-[12px] text-muted-foreground">
              Drives accrual schedules, carry-forward windows, and liability dashboards.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Starts on</span>
            <select
              value={tenantSettings.fiscalYear.startMonth}
              onChange={(e) => updateFiscal(Number(e.target.value))}
              className="mt-1 h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>{m} 1</option>
              ))}
            </select>
          </label>
          <span className="text-[11px] text-muted-foreground">Current period: <strong className="text-foreground">{tenantSettings.fiscalYear.label}</strong></span>
        </div>
      </section>

      {/* Data residency */}
      <section className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-lg bg-brand-purple/10 text-brand-purple flex items-center justify-center shrink-0">
            <Globe className="size-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-foreground">Data residency</h2>
            <p className="text-[12px] text-muted-foreground">
              All employee data and audit logs are pinned to the selected region. Changing this is non-reversible without a migration ticket.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {REGIONS.map((r) => {
            const active = r.value === tenantSettings.residency.region;
            return (
              <button
                key={r.value}
                onClick={() => updateResidency("region", r.value)}
                className={`text-left p-3 rounded-lg border transition-colors ${
                  active ? "border-brand bg-brand/5" : "border-border bg-card hover:bg-surface-overlay"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className={`size-3.5 ${active ? "text-brand" : "text-muted-foreground"}`} />
                  <p className="text-sm font-medium text-foreground">{r.label}</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug mt-1">{r.description}</p>
              </button>
            );
          })}
        </div>

        <div className="space-y-2 border-t border-border pt-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-foreground">Allow cross-border transfers</p>
              <p className="text-[11px] text-muted-foreground">
                Permits exporting data outside the primary region under standard contractual clauses (SCCs).
              </p>
            </div>
            <Toggle
              value={tenantSettings.residency.crossBorderTransfers}
              onChange={(v) => updateResidency("crossBorderTransfers", v)}
              ariaLabel="Toggle cross-border transfers"
            />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-1.5">
              Sub-processors ({tenantSettings.residency.subProcessors.length})
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {tenantSettings.residency.subProcessors.map((sp) => (
                <li key={sp} className="text-[11px] px-2 py-1 rounded bg-secondary text-foreground inline-flex items-center gap-1">
                  <Building2 className="size-2.5 text-muted-foreground" />
                  {sp}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Agent autonomy defaults */}
      <section className="bg-card border border-border rounded-xl p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="size-9 rounded-lg bg-success/10 text-success flex items-center justify-center shrink-0">
            <Bot className="size-4" />
          </div>
          <div className="flex-1">
            <h2 className="text-base font-semibold text-foreground">Agent autonomy defaults</h2>
            <p className="text-[12px] text-muted-foreground">
              Sets the baseline behavior for every agent in the tenant. Individual agents can be configured down from these defaults but never above.
            </p>
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">
            Default autonomy for new agents
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {AUTONOMY_LEVELS.map((lvl) => {
              const active = lvl.value === tenantSettings.agentDefaults.defaultAutonomy;
              return (
                <button
                  key={lvl.value}
                  onClick={() => updateAgentDefaults("defaultAutonomy", lvl.value)}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    active ? "border-brand bg-brand/5" : "border-border bg-card hover:bg-surface-overlay"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">{lvl.value}</p>
                  <p className="text-[11px] text-muted-foreground leading-snug mt-0.5">{lvl.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold mb-2">
            Maximum autonomy a manager can grant (without HR co-sign)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {AUTONOMY_LEVELS.map((lvl) => {
              const active = lvl.value === tenantSettings.agentDefaults.managerMaxAutonomy;
              return (
                <button
                  key={lvl.value}
                  onClick={() => updateAgentDefaults("managerMaxAutonomy", lvl.value)}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    active ? "border-brand bg-brand/5" : "border-border bg-card hover:bg-surface-overlay"
                  }`}
                >
                  <p className="text-sm font-medium text-foreground">{lvl.value}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border pt-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-semibold">Default scope</span>
            <select
              value={tenantSettings.agentDefaults.defaultScope}
              onChange={(e) => updateAgentDefaults("defaultScope", e.target.value as "own_team" | "all")}
              className="mt-1 w-full h-9 px-2.5 rounded-lg border border-input bg-card text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="own_team">Own team only</option>
              <option value="all">All teams</option>
            </select>
          </label>
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-foreground">Shadow mode for first 30 days</p>
              <p className="text-[11px] text-muted-foreground">New agents draft actions but require human co-sign during their cool-in.</p>
            </div>
            <Toggle
              value={tenantSettings.agentDefaults.shadowModeOnFirstActivation}
              onChange={(v) => updateAgentDefaults("shadowModeOnFirstActivation", v)}
              ariaLabel="Toggle shadow mode"
            />
          </div>
        </div>
      </section>

      <p className="text-[11px] text-muted-foreground/60 flex items-start gap-2 pt-2">
        <Shield className="size-3 mt-0.5" />
        <span>
          Tenant-scope changes are durable and audited. Edits propagate within ~60 seconds via tenant config CDN.
        </span>
      </p>

      {/* Reset confirmation */}
      <AnimatePresence>
        {confirmingReset && (
          <ConfirmReset
            onClose={() => setConfirmingReset(false)}
            onConfirm={() => {
              resetTenantSettings();
              setConfirmingReset(false);
              flashOnce("Tenant settings reset to defaults.");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function Toggle({
  value,
  onChange,
  ariaLabel,
}: {
  value: boolean;
  onChange: (v: boolean) => void;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={ariaLabel}
      onClick={() => onChange(!value)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${value ? "bg-brand" : "bg-secondary"}`}
    >
      <span
        className={`absolute top-0.5 size-5 rounded-full bg-card shadow transition-all ${
          value ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  );
}

function ConfirmReset({ onClose, onConfirm }: { onClose: () => void; onConfirm: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-60 bg-foreground/30 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.18 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md min-w-80"
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">Reset to defaults?</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-surface-overlay transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="px-5 py-4">
          <p className="text-sm text-foreground">
            All branding, language, fiscal, residency, and agent-autonomy settings will revert to the platform baseline.
          </p>
          <p className="text-[11px] text-muted-foreground mt-2">This action is reversible — your previous values are not preserved.</p>
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-border">
          <button
            onClick={onClose}
            className="h-9 px-3 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-surface-overlay transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity"
          >
            <RotateCcw className="size-3.5" />
            Reset
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
