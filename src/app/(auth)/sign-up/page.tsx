"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, ArrowRight, Sparkles, Mail, Lock, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg className="size-5" viewBox="0 0 23 23">
      <rect x="1" y="1" width="10" height="10" fill="#F25022" />
      <rect x="12" y="1" width="10" height="10" fill="#7FBA00" />
      <rect x="1" y="12" width="10" height="10" fill="#00A4EF" />
      <rect x="12" y="12" width="10" height="10" fill="#FFB900" />
    </svg>
  );
}

/* ── Password Strength ── */

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Number", met: /\d/.test(password) },
    { label: "Special character", met: /[^A-Za-z0-9]/.test(password) },
  ];
  const strength = checks.filter((c) => c.met).length;

  if (password.length === 0) return null;

  const barColors = ["bg-destructive", "bg-warning", "bg-warning", "bg-success"];
  const barColor = strength > 0 ? barColors[strength - 1] : "bg-secondary";

  return (
    <div className="space-y-2 mt-2">
      {/* Strength bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i < strength ? barColor : "bg-secondary"
            }`}
          />
        ))}
      </div>
      {/* Checklist */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5">
            <div className={`size-3 rounded-full flex items-center justify-center transition-colors ${check.met ? "bg-success" : "bg-secondary"}`}>
              {check.met && <Check className="size-2 text-white" />}
            </div>
            <span className={`text-[10px] transition-colors ${check.met ? "text-success" : "text-muted-foreground/50"}`}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: "easeOut" as const },
});

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState<string | null>(null);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = "Full name is required";
    if (!email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    else if (password.length < 8)
      errs.password = "Password must be at least 8 characters";
    if (password !== confirmPassword)
      errs.confirmPassword = "Passwords do not match";
    if (!acceptTerms) errs.terms = "You must accept the terms";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      window.location.href = "/dashboard";
    }, 2000);
  };

  const clearError = (field: string) => {
    if (errors[field]) setErrors((p) => ({ ...p, [field]: "" }));
  };

  const inputClass = (field: string, hasError: boolean) =>
    `relative rounded-xl border transition-all duration-200 ${
      hasError
        ? "border-destructive bg-destructive/5"
        : focused === field
        ? "border-brand bg-brand/[0.03] shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"
        : "border-border bg-card hover:border-border"
    }`;

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Mobile logo */}
      <motion.div {...fadeUp(0)} className="text-center mb-8 lg:hidden">
        <div className="inline-flex items-baseline gap-0.75 font-bold text-2xl text-foreground">
          <span>O</span>
          <span className="relative inline-flex items-center justify-center font-black rounded-md bg-linear-to-r from-brand to-brand-teal text-white text-[10px] px-1.5 py-0.5 leading-none -top-2.5">2</span>
          <span>S</span>
        </div>
      </motion.div>

      {/* Heading */}
      <motion.div {...fadeUp(0.05)} className="mb-8">
        <h1 className="text-2xl xl:text-3xl font-bold text-foreground tracking-tight">
          Create your account
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Start your 14-day free trial — no credit card required
        </p>
      </motion.div>

      {/* SSO Buttons */}
      <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 gap-3 mb-4">
        <button
          type="button"
          onClick={() => alert("SSO login will be configured in Settings → Integrations → Identity & SSO")}
          className="group flex items-center justify-center gap-2.5 h-12 rounded-xl border border-border bg-card hover:bg-surface-overlay hover:border-border transition-all duration-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
        >
          <GoogleIcon />
          <span className="text-sm font-medium text-foreground">Google</span>
        </button>
        <button
          type="button"
          onClick={() => alert("SSO login will be configured in Settings → Integrations → Identity & SSO")}
          className="group flex items-center justify-center gap-2.5 h-12 rounded-xl border border-border bg-card hover:bg-surface-overlay hover:border-border transition-all duration-200 hover:shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
        >
          <MicrosoftIcon />
          <span className="text-sm font-medium text-foreground">Microsoft</span>
        </button>
      </motion.div>

      {/* Enterprise SSO */}
      <motion.div {...fadeUp(0.12)} className="mb-6">
        <button
          type="button"
          onClick={() => alert("SSO login will be configured in Settings → Integrations → Identity & SSO")}
          className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-border/50 bg-transparent text-muted-foreground hover:text-foreground hover:border-border text-xs font-medium transition-all duration-200"
        >
          <Sparkles className="size-3.5" />
          Enterprise SSO (SAML / OIDC)
        </button>
      </motion.div>

      {/* Divider */}
      <motion.div {...fadeUp(0.15)} className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[11px] text-muted-foreground/60 uppercase tracking-wider font-medium">or with email</span>
        <div className="flex-1 h-px bg-border" />
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <motion.div {...fadeUp(0.2)}>
          <div className={inputClass("name", !!errors.name)}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <User className={`size-4 transition-colors ${focused === "name" ? "text-brand" : "text-muted-foreground/40"}`} />
            </div>
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(e) => { setName(e.target.value); clearError("name"); }}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
              className="w-full h-12 bg-transparent pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none rounded-xl"
              autoComplete="name"
            />
          </div>
          {errors.name && <p className="text-xs text-destructive mt-1.5 ml-1">{errors.name}</p>}
        </motion.div>

        {/* Work Email */}
        <motion.div {...fadeUp(0.25)}>
          <div className={inputClass("email", !!errors.email)}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Mail className={`size-4 transition-colors ${focused === "email" ? "text-brand" : "text-muted-foreground/40"}`} />
            </div>
            <input
              type="email"
              placeholder="Work email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className="w-full h-12 bg-transparent pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none rounded-xl"
              autoComplete="email"
            />
          </div>
          {errors.email && <p className="text-xs text-destructive mt-1.5 ml-1">{errors.email}</p>}
        </motion.div>

        {/* Password */}
        <motion.div {...fadeUp(0.3)}>
          <div className={inputClass("password", !!errors.password)}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Lock className={`size-4 transition-colors ${focused === "password" ? "text-brand" : "text-muted-foreground/40"}`} />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create a password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              className="w-full h-12 bg-transparent pl-11 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none rounded-xl"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          <PasswordStrength password={password} />
          {errors.password && <p className="text-xs text-destructive mt-1.5 ml-1">{errors.password}</p>}
        </motion.div>

        {/* Confirm Password */}
        <motion.div {...fadeUp(0.35)}>
          <div className={inputClass("confirmPassword", !!errors.confirmPassword)}>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Lock className={`size-4 transition-colors ${focused === "confirmPassword" ? "text-brand" : "text-muted-foreground/40"}`} />
            </div>
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); clearError("confirmPassword"); }}
              onFocus={() => setFocused("confirmPassword")}
              onBlur={() => setFocused(null)}
              className="w-full h-12 bg-transparent pl-11 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none rounded-xl"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {/* Match indicator */}
          {confirmPassword.length > 0 && (
            <div className="flex items-center gap-1.5 mt-1.5 ml-1">
              <div className={`size-3 rounded-full flex items-center justify-center ${password === confirmPassword ? "bg-success" : "bg-destructive"}`}>
                {password === confirmPassword && <Check className="size-2 text-white" />}
              </div>
              <span className={`text-[10px] ${password === confirmPassword ? "text-success" : "text-destructive"}`}>
                {password === confirmPassword ? "Passwords match" : "Passwords don't match"}
              </span>
            </div>
          )}
          {errors.confirmPassword && <p className="text-xs text-destructive mt-1.5 ml-1">{errors.confirmPassword}</p>}
        </motion.div>

        {/* Terms */}
        <motion.div {...fadeUp(0.4)} className="space-y-1">
          <div className="flex items-start gap-2.5">
            <Checkbox
              id="terms"
              checked={acceptTerms}
              onCheckedChange={(v) => { setAcceptTerms(v === true); clearError("terms"); }}
              className="mt-0.5"
            />
            <Label htmlFor="terms" className="text-xs text-muted-foreground cursor-pointer leading-relaxed">
              I agree to the{" "}
              <a href="#" className="text-foreground hover:text-brand transition-colors font-medium">Terms of Service</a>
              {" "}and{" "}
              <a href="#" className="text-foreground hover:text-brand transition-colors font-medium">Privacy Policy</a>
            </Label>
          </div>
          {errors.terms && <p className="text-xs text-destructive pl-6">{errors.terms}</p>}
        </motion.div>

        {/* Submit */}
        <motion.div {...fadeUp(0.45)}>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-linear-to-r from-brand to-brand-teal text-white font-semibold text-sm border-0 hover:opacity-90 shadow-[0_4px_24px_rgba(59,130,246,0.25)] hover:shadow-[0_6px_32px_rgba(59,130,246,0.35)] transition-all duration-300 group"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                Create Account
                <ArrowRight className="size-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </motion.div>
      </form>

      {/* Footer */}
      <motion.div {...fadeUp(0.5)} className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-foreground hover:text-brand transition-colors">
            Sign in
          </Link>
        </p>
      </motion.div>

      {/* Trust badges */}
      <motion.div {...fadeUp(0.55)} className="mt-6 flex items-center justify-center gap-6">
        <div className="flex items-center gap-1.5 text-muted-foreground/30">
          <Lock className="size-3" />
          <span className="text-[10px]">256-bit SSL</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground/30">
          <span className="text-[10px]">SOC 2 Type II</span>
        </div>
        <div className="flex items-center gap-1.5 text-muted-foreground/30">
          <span className="text-[10px]">GDPR</span>
        </div>
      </motion.div>
    </div>
  );
}
