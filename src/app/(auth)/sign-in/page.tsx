"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, Eye, EyeOff, ArrowRight, Sparkles, Mail, Lock } from "lucide-react";
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

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, delay, ease: "easeOut" as const },
});

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [focused, setFocused] = useState<string | null>(null);

  const validate = () => {
    const errs: typeof errors = {};
    if (!email) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errs.email = "Enter a valid email address";
    if (!password) errs.password = "Password is required";
    else if (password.length < 8)
      errs.password = "Password must be at least 8 characters";
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

  return (
    <div className="w-full max-w-[420px] mx-auto">
      {/* Logo — visible only on mobile (desktop has it in the layout's left panel) */}
      <motion.div {...fadeUp(0)} className="text-center mb-10 lg:hidden">
        <div className="inline-flex items-baseline gap-[3px] font-bold text-2xl text-foreground">
          <span>O</span>
          <span className="relative inline-flex items-center justify-center font-black rounded-md bg-linear-to-r from-brand to-brand-teal text-white text-[10px] px-1.5 py-[2px] leading-none -top-2.5">2</span>
          <span>S</span>
        </div>
      </motion.div>

      {/* Heading */}
      <motion.div {...fadeUp(0.05)} className="mb-8">
        <h1 className="text-2xl xl:text-3xl font-bold text-foreground tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Sign in to continue to your workspace
        </p>
      </motion.div>

      {/* SSO Buttons — modern card style */}
      <motion.div {...fadeUp(0.1)} className="grid grid-cols-2 gap-3 mb-6">
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

      {/* Enterprise SSO — full width, subtle */}
      <motion.div {...fadeUp(0.15)} className="mb-6">
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
      <motion.div {...fadeUp(0.2)} className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-[11px] text-muted-foreground/60 uppercase tracking-wider font-medium">
          or with email
        </span>
        <div className="flex-1 h-px bg-border" />
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email Field */}
        <motion.div {...fadeUp(0.25)}>
          <div
            className={`relative rounded-xl border transition-all duration-200 ${
              errors.email
                ? "border-destructive bg-destructive/5"
                : focused === "email"
                ? "border-brand bg-brand/[0.03] shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"
                : "border-border bg-card hover:border-border"
            }`}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Mail className={`size-4 transition-colors ${focused === "email" ? "text-brand" : "text-muted-foreground/40"}`} />
            </div>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
              }}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className="w-full h-12 bg-transparent pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none rounded-xl"
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive mt-1.5 ml-1">{errors.email}</p>
          )}
        </motion.div>

        {/* Password Field */}
        <motion.div {...fadeUp(0.3)}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs text-muted-foreground/60 font-medium uppercase tracking-wider ml-1">Password</span>
            <Link
              href="/forgot-password"
              className="text-xs text-brand/80 hover:text-brand transition-colors font-medium"
            >
              Forgot?
            </Link>
          </div>
          <div
            className={`relative rounded-xl border transition-all duration-200 ${
              errors.password
                ? "border-destructive bg-destructive/5"
                : focused === "password"
                ? "border-brand bg-brand/[0.03] shadow-[0_0_0_3px_rgba(59,130,246,0.08)]"
                : "border-border bg-card hover:border-border"
            }`}
          >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <Lock className={`size-4 transition-colors ${focused === "password" ? "text-brand" : "text-muted-foreground/40"}`} />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
              }}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              className="w-full h-12 bg-transparent pl-11 pr-12 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none rounded-xl"
              autoComplete="current-password"
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
          {errors.password && (
            <p className="text-xs text-destructive mt-1.5 ml-1">{errors.password}</p>
          )}
        </motion.div>

        {/* Remember me */}
        <motion.div {...fadeUp(0.35)} className="flex items-center gap-2.5">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(v) => setRememberMe(v === true)}
          />
          <Label htmlFor="remember" className="text-xs text-muted-foreground cursor-pointer">
            Keep me signed in for 30 days
          </Label>
        </motion.div>

        {/* Submit Button */}
        <motion.div {...fadeUp(0.4)}>
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 rounded-xl bg-linear-to-r from-brand to-brand-teal text-white font-semibold text-sm border-0 hover:opacity-90 shadow-[0_4px_24px_rgba(59,130,246,0.25)] hover:shadow-[0_6px_32px_rgba(59,130,246,0.35)] transition-all duration-300 group"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <>
                Sign In
                <ArrowRight className="size-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </Button>
        </motion.div>
      </form>

      {/* Footer */}
      <motion.div {...fadeUp(0.45)} className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          New to O2S?{" "}
          <Link
            href="/sign-up"
            className="font-semibold text-foreground hover:text-brand transition-colors"
          >
            Create an account
          </Link>
        </p>
      </motion.div>

      {/* Trust badges */}
      <motion.div {...fadeUp(0.5)} className="mt-8 flex items-center justify-center gap-6">
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
