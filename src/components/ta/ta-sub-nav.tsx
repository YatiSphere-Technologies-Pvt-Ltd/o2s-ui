"use client";

import Link from "next/link";
import { TA_SUB_NAV, type TAPage } from "@/components/ta/journey-data";

interface TASubNavProps {
  activePage: TAPage;
}

export function TASubNav({ activePage }: TASubNavProps) {
  return (
    <div className="flex items-center gap-1 border-b border-border pb-3 mb-6">
      {TA_SUB_NAV.map((item) => (
        <Link
          key={item.key}
          href={item.href}
          className={
            activePage === item.key
              ? "bg-brand-purple/15 text-brand-purple font-medium rounded-lg px-3 py-1.5 text-sm transition-colors"
              : "text-muted-foreground hover:text-foreground px-3 py-1.5 text-sm transition-colors"
          }
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
