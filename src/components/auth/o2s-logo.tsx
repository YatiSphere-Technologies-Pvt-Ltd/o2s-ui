import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * O2S Brand Wordmark
 *
 * The "2" is rendered as a superscript inside a gradient pill,
 * creating a distinctive chemical-formula-style identity:  O²S
 *
 * Sizes: sm (nav), md (auth cards), lg (auth panel hero)
 */
export function O2sLogo({
  size = "md",
  showTagline = false,
  className,
}: {
  size?: "sm" | "md" | "lg";
  showTagline?: boolean;
  className?: string;
}) {
  const config = {
    sm: { text: "text-lg", pill: "text-[9px] px-1 py-[1px] -top-2", gap: "gap-[2px]" },
    md: { text: "text-2xl", pill: "text-[10px] px-1.5 py-[2px] -top-2.5", gap: "gap-[3px]" },
    lg: { text: "text-4xl", pill: "text-xs px-2 py-[2px] -top-3.5", gap: "gap-1" },
  }[size];

  return (
    <div className={cn("flex flex-col", className)}>
      <Link href="/" className={cn("inline-flex items-baseline font-bold tracking-tight text-foreground", config.gap)}>
        <span className={config.text}>O</span>
        <span className="relative">
          <span
            className={cn(
              "relative inline-flex items-center justify-center font-black rounded-md bg-linear-to-r from-brand to-brand-teal text-white leading-none",
              config.pill
            )}
          >
            2
          </span>
        </span>
        <span className={config.text}>S</span>
      </Link>
      {showTagline && (
        <span className="text-[11px] text-muted-foreground/60 mt-1.5">
          A product by{" "}
          <a
            href="https://yatisphere.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-muted-foreground transition-colors"
          >
            Yatisphere Technologies
          </a>
        </span>
      )}
    </div>
  );
}
