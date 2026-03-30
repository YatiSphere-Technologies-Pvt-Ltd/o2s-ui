import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://o2s.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/command-center",
          "/automation",
          "/talent",
          "/jobs",
          "/candidates",
          "/requisitions",
          "/interviews",
          "/interview-command",
          "/interview-arena",
          "/panels",
          "/talent-pool",
          "/vendors",
          "/cv-screening",
          "/people",
          "/people-command",
          "/onboarding-hub",
          "/performance",
          "/goals",
          "/settings/",
          "/profile",
          "/chat",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/settings/", "/profile", "/chat"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
