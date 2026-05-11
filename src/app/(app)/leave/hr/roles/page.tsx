"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * The Leave-only Roles & Permissions page has moved into the global
 * /admin/permissions matrix. We keep this route as a permanent redirect
 * so existing bookmarks and links keep working.
 */
export default function LeaveRolesRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin/permissions?module=leave");
  }, [router]);
  return (
    <div className="max-w-2xl mx-auto py-16 text-center text-sm text-muted-foreground">
      Redirecting to the new Admin &amp; Security permission matrix…
    </div>
  );
}
