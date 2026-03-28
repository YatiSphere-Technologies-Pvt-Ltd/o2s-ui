"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Shield, Eye, EyeOff } from "lucide-react";
import { O2sLogo } from "@/components/auth/o2s-logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StepSignupProps {
  onNext: () => void;
  onBack: () => void;
}

function getPasswordStrength(pw: string): number {
  if (!pw) return 0;
  if (pw.length < 8) return 1;
  const hasNumber = /\d/.test(pw);
  const hasMixed = /[a-z]/.test(pw) && /[A-Z]/.test(pw) && /\d/.test(pw) && /[^a-zA-Z\d]/.test(pw);
  if (pw.length >= 12 && hasMixed) return 4;
  if (pw.length >= 8 && hasNumber) return 3;
  return 2;
}

const strengthColors = ["", "bg-destructive", "bg-warning", "bg-brand", "bg-success"];
const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

export function StepSignup({ onNext }: StepSignupProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name || !password || strength < 2) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-16 py-12">
        <div className="max-w-md mx-auto w-full">
          <O2sLogo size="md" className="mb-8" />
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Start running your people ops with AI
          </h1>
          <p className="text-muted-foreground mb-8">
            Set up in under 5 minutes. No credit card required.
          </p>

          {/* SSO Buttons */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border border-border bg-card text-sm font-medium text-foreground cursor-pointer hover:bg-secondary transition-colors">
              <svg className="size-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </div>
            <div className="flex-1 flex items-center justify-center gap-2 h-10 rounded-lg border border-border bg-card text-sm font-medium text-foreground cursor-pointer hover:bg-secondary transition-colors">
              <svg className="size-4" viewBox="0 0 23 23"><path fill="#f35325" d="M1 1h10v10H1z"/><path fill="#81bc06" d="M12 1h10v10H12z"/><path fill="#05a6f0" d="M1 12h10v10H1z"/><path fill="#ffba08" d="M12 12h10v10H12z"/></svg>
              Microsoft
            </div>
          </div>

          {/* Divider */}
          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Jane Smith"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Work Email</Label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {/* Password strength meter */}
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((seg) => (
                      <div
                        key={seg}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          seg <= strength ? strengthColors[strength] : "bg-secondary"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    {strengthLabels[strength]}
                  </p>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !name || strength < 2}
              className="w-full h-10 bg-brand text-white hover:bg-brand/90"
            >
              {loading ? (
                <motion.div
                  className="size-4 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" as const }}
                />
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground mt-6 text-center">
            Already have an account?{" "}
            <span className="text-brand cursor-pointer hover:underline">Sign in</span>
          </p>
          <p className="text-[11px] text-muted-foreground mt-3 text-center">
            By creating an account you agree to our{" "}
            <span className="underline cursor-pointer">Terms of Service</span>{" "}
            and{" "}
            <span className="underline cursor-pointer">Privacy Policy</span>
          </p>
        </div>
      </div>

      {/* Right panel */}
      <div className="hidden lg:flex w-1/2 bg-card relative overflow-hidden items-center justify-center border-l border-border">
        <div className="relative w-80 h-96">
          {/* Floating feature cards */}
          <motion.div
            className="absolute top-0 left-0 bg-background border border-border rounded-xl p-4 shadow-lg w-56"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ease: [0.4, 0, 0.2, 1] as const }}
            style={{ transform: "rotate(-3deg)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="size-6 rounded-md bg-brand/10 flex items-center justify-center">
                <div className="size-3 rounded-sm bg-brand" />
              </div>
              <span className="text-xs font-medium text-foreground">Dashboard Widget</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-secondary w-full" />
              <div className="h-2 rounded-full bg-secondary w-3/4" />
            </div>
          </motion.div>

          <motion.div
            className="absolute top-20 right-0 bg-background border border-border rounded-xl p-4 shadow-lg w-48"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ease: [0.4, 0, 0.2, 1] as const }}
            style={{ transform: "rotate(2deg)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="size-6 rounded-md bg-brand-purple/10 flex items-center justify-center">
                <div className="size-3 rounded-sm bg-brand-purple" />
              </div>
              <span className="text-xs font-medium text-foreground">AI Chat</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-secondary w-full" />
              <div className="h-2 rounded-full bg-secondary w-1/2" />
            </div>
          </motion.div>

          <motion.div
            className="absolute top-48 left-4 bg-background border border-border rounded-xl p-4 shadow-lg w-52"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, ease: [0.4, 0, 0.2, 1] as const }}
            style={{ transform: "rotate(-1deg)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="size-6 rounded-md bg-brand-teal/10 flex items-center justify-center">
                <div className="size-3 rounded-sm bg-brand-teal" />
              </div>
              <span className="text-xs font-medium text-foreground">Org Chart</span>
            </div>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="size-6 rounded-full bg-secondary" />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="absolute bottom-4 right-2 bg-background border border-border rounded-xl p-4 shadow-lg w-44"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, ease: [0.4, 0, 0.2, 1] as const }}
            style={{ transform: "rotate(3deg)" }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="size-6 rounded-md bg-success/10 flex items-center justify-center">
                <div className="size-3 rounded-sm bg-success" />
              </div>
              <span className="text-xs font-medium text-foreground">Pipeline</span>
            </div>
            <div className="h-2 rounded-full bg-secondary w-full" />
          </motion.div>
        </div>

        {/* Trust badges */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-6">
          {[
            { icon: Shield, label: "SOC 2" },
            { icon: Shield, label: "GDPR" },
            { icon: Lock, label: "256-bit" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-muted-foreground">
              <Icon className="size-3.5" />
              <span className="text-[11px]">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
