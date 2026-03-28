"use client";

import Link from "next/link";
import { LEGAL_SUB_NAV, type LegalPage } from "@/components/legal/data";

interface LegalSubNavProps {
  activePage: LegalPage;
}

export function LegalSubNav({ activePage }: LegalSubNavProps) {
  return (
    <div className="flex items-center gap-1 border-b border-border pb-3 mb-6">
      {LEGAL_SUB_NAV.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={
            activePage === item.key
              ? "bg-destructive/15 text-destructive font-medium rounded-lg px-3 py-1.5 text-sm transition-colors"
              : "text-muted-foreground hover:text-foreground px-3 py-1.5 text-sm transition-colors"
          }
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
