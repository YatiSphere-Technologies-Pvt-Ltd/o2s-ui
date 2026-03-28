"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Loader2, MailCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthCard } from "@/components/auth/auth-card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setError("");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
    }, 1500);
  };

  if (sent) {
    return (
      <AuthCard title="Check your email">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <div className="mx-auto size-16 rounded-full bg-success/10 flex items-center justify-center mb-2">
            <MailCheck className="size-8 text-success" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We&apos;ve sent a password reset link to{" "}
            <span className="text-foreground font-medium">{email}</span>.
            <br />
            Check your inbox and follow the instructions.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Didn&apos;t receive the email? Check spam or{" "}
            <button
              onClick={() => setSent(false)}
              className="text-brand hover:text-brand-teal transition-colors"
            >
              try again
            </button>
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-1.5 text-sm text-brand hover:text-brand-teal transition-colors mt-2"
          >
            <ArrowLeft className="size-3.5" />
            Back to sign in
          </Link>
        </motion.div>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Reset your password"
      description="Enter your email and we'll send you a reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            aria-invalid={!!error}
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-10 bg-linear-to-r from-brand to-brand-teal text-brand-foreground border-0 hover:opacity-90 shadow-[0_4px_20px_rgba(59,130,246,0.3)]"
          >
            {isLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </motion.div>
      </form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Remember your password?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-brand hover:text-brand-teal transition-colors"
        >
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
