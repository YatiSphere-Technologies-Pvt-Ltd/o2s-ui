"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";

interface StepVerifyProps {
  onNext: () => void;
  onBack: () => void;
}

export function StepVerify({ onNext }: StepVerifyProps) {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(582); // 9:42 in seconds
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleComplete = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1000);
  }, [onNext]);

  useEffect(() => {
    if (code.every((d) => d !== "") && !loading) {
      handleComplete();
    }
  }, [code, loading, handleComplete]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const digit = value.slice(-1);
    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const newCode = [...code];
      for (let i = 0; i < pasted.length; i++) {
        newCode[i] = pasted[i];
      }
      setCode(newCode);
      const nextFocus = Math.min(pasted.length, 5);
      inputRefs.current[nextFocus]?.focus();
    }
  };

  const minutes = Math.floor(countdown / 60);
  const seconds = countdown % 60;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto text-center px-6">
        {/* Animated envelope */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-flex items-center justify-center size-20 rounded-2xl bg-brand-purple/10 mb-6"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: [0.4, 0, 0.6, 1] as const }}
          >
            <Mail className="size-12 text-brand-purple" />
          </motion.div>
        </motion.div>

        <h1 className="text-2xl font-bold text-foreground mb-2">Check your inbox</h1>
        <p className="text-muted-foreground mb-1">
          We sent a verification code to
        </p>
        <p className="text-foreground font-medium mb-8">jane@company.com</p>

        {/* Code inputs */}
        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="w-12 h-12 bg-card border border-border rounded-lg text-center text-lg font-bold font-mono text-foreground outline-none transition-colors focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          ))}
        </div>

        {loading && (
          <div className="flex justify-center mb-4">
            <motion.div
              className="size-5 border-2 border-brand/30 border-t-brand rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" as const }}
            />
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-2">
          Didn&apos;t get it?{" "}
          <button className="text-brand hover:underline">Resend code</button>
        </p>
        <p className="text-xs text-muted-foreground">
          Code expires in {minutes}:{seconds.toString().padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}
