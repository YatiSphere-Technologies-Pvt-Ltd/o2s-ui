import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
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
        <h1 className="text-6xl font-bold text-[#3B82F6] mb-4">404</h1>
        <h2 className="text-xl font-semibold mb-2">Page not found</h2>
        <p className="text-sm text-[#8892A8] mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-10 px-6 rounded-xl bg-gradient-to-r from-[#3B82F6] to-[#14B8A6] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Back to Home
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center h-10 px-6 rounded-xl border border-[rgba(255,255,255,0.08)] text-sm font-medium text-[#8892A8] hover:text-white hover:border-[rgba(255,255,255,0.15)] transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
