"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="dark min-h-screen flex items-center justify-center bg-[#07070D] text-[#F1F5F9] px-6">
      <div className="text-center max-w-md">
        <div className="inline-flex items-baseline gap-[3px] font-bold text-4xl mb-8">
          <span>O</span>
          <span className="relative inline-flex items-center justify-center font-black rounded-md bg-gradient-to-r from-[#3B82F6] to-[#14B8A6] text-white text-xs px-2 py-[2px] leading-none -top-3.5">
            2
          </span>
          <span>S</span>
        </div>
        <h1 className="text-4xl font-bold text-[#EF4444] mb-4">Something went wrong</h1>
        <p className="text-sm text-[#8892A8] mb-8">
          An unexpected error occurred. Our team has been notified.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#14B8A6] text-white text-sm font-semibold hover:opacity-90 transition-opacity cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
