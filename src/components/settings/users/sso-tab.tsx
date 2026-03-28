"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, KeyRound, ShieldCheck, RefreshCw } from "lucide-react";
import { ACTIVE_COUNT, MFA_COUNT } from "@/components/settings/users/data";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const mfaPercent = Math.round((MFA_COUNT / ACTIVE_COUNT) * 100);

export function SsoTab() {
  const [mfaPolicy, setMfaPolicy] = useState<"required" | "optional">(
    "required"
  );
  const [authApp, setAuthApp] = useState(true);
  const [securityKey, setSecurityKey] = useState(true);
  const [smsAuth, setSmsAuth] = useState(false);
  const [disableEmail, setDisableEmail] = useState(false);

  return (
    <motion.div
      className="space-y-4"
      initial="initial"
      animate="animate"
      variants={{ animate: { transition: { staggerChildren: 0.08 } } }}
    >
      {/* ── SAML SSO ── */}
      <motion.div
        variants={fadeIn}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <Shield className="size-5 text-brand mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground">
                SAML SSO
              </h3>
              <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium bg-success/10 text-success">
                Connected — Okta
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Single Sign-On via SAML 2.0
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Users via SSO</span>
            <p className="text-foreground font-medium mt-0.5">
              14/{ACTIVE_COUNT} active users
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Last sync</span>
            <p className="text-foreground font-medium mt-0.5">
              Today, 2:00 PM
            </p>
          </div>
          <div>
            <span className="text-muted-foreground">Provider</span>
            <p className="text-foreground font-medium mt-0.5">Okta (SAML 2.0)</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button variant="outline" size="sm" className="text-xs">
            <RefreshCw className="size-3" />
            Sync Now
          </Button>
          <Button variant="outline" size="sm" className="text-xs">
            Configure
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="text-xs ml-auto"
          >
            Disconnect
          </Button>
        </div>
      </motion.div>

      {/* ── Email/Password ── */}
      <motion.div
        variants={fadeIn}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <KeyRound className="size-5 text-brand mt-0.5 shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-semibold text-foreground">
                Email/Password
              </h3>
              <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-medium bg-brand/10 text-brand">
                Enabled
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Traditional email and password authentication
            </p>
          </div>
        </div>

        <div className="space-y-2 text-xs text-muted-foreground">
          <h4 className="text-foreground font-medium text-xs">
            Password Policy
          </h4>
          <ul className="space-y-1 list-disc list-inside">
            <li>Minimum 12 characters</li>
            <li>Requires special characters</li>
            <li>90-day expiry</li>
          </ul>
        </div>

        <div className="mt-4 flex items-start gap-2">
          <Checkbox
            checked={disableEmail}
            onCheckedChange={(val) => setDisableEmail(val === true)}
            className="mt-0.5"
          />
          <div>
            <label className="text-xs font-medium text-foreground cursor-pointer">
              Disable email/password login
            </label>
            <p className="text-[10px] text-warning mt-0.5">
              Warning: Users without SSO access will be locked out.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── MFA ── */}
      <motion.div
        variants={fadeIn}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-start gap-3 mb-4">
          <ShieldCheck className="size-5 text-success mt-0.5 shrink-0" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">
              Multi-Factor Authentication
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Additional verification for all sign-ins
            </p>
          </div>
        </div>

        {/* MFA Policy */}
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-medium text-foreground">MFA Policy</h4>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="radio"
                name="mfa-policy"
                checked={mfaPolicy === "required"}
                onChange={() => setMfaPolicy("required")}
                className="accent-brand"
              />
              <span className="text-foreground">Required for all users</span>
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                type="radio"
                name="mfa-policy"
                checked={mfaPolicy === "optional"}
                onChange={() => setMfaPolicy("optional")}
                className="accent-brand"
              />
              <span className="text-foreground">Optional</span>
            </label>
          </div>
        </div>

        {/* Allowed Methods */}
        <div className="space-y-2 mb-4">
          <h4 className="text-xs font-medium text-foreground">
            Allowed Methods
          </h4>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <Checkbox
                checked={authApp}
                onCheckedChange={(val) => setAuthApp(val === true)}
              />
              <span className="text-foreground">Authenticator app (TOTP)</span>
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <Checkbox
                checked={securityKey}
                onCheckedChange={(val) => setSecurityKey(val === true)}
              />
              <span className="text-foreground">Security key (WebAuthn)</span>
            </label>
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <Checkbox
                checked={smsAuth}
                onCheckedChange={(val) => setSmsAuth(val === true)}
              />
              <span className="text-muted-foreground">SMS (not recommended)</span>
            </label>
          </div>
        </div>

        {/* Enrollment Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Enrollment progress</span>
            <span className="text-foreground font-medium">
              {MFA_COUNT}/{ACTIVE_COUNT} enrolled ({mfaPercent}%)
            </span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className="h-full rounded-full bg-success transition-all"
              style={{ width: `${mfaPercent}%` }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
