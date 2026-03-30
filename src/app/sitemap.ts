import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://o2s.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Public marketing pages
  const publicRoutes = [
    { url: "", priority: 1.0, changeFrequency: "weekly" as const },
    { url: "/sign-in", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/sign-up", priority: 0.6, changeFrequency: "monthly" as const },
  ];

  // App pages (for authenticated crawling / prerendering)
  const appRoutes = [
    // Overview
    { url: "/dashboard", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/command-center", priority: 0.9, changeFrequency: "daily" as const },
    { url: "/automation", priority: 0.8, changeFrequency: "weekly" as const },
    { url: "/analytics", priority: 0.7, changeFrequency: "daily" as const },

    // Talent Acquisition
    { url: "/talent", priority: 0.8, changeFrequency: "daily" as const },
    { url: "/jobs", priority: 0.8, changeFrequency: "daily" as const },
    { url: "/candidates", priority: 0.8, changeFrequency: "daily" as const },
    { url: "/requisitions", priority: 0.7, changeFrequency: "daily" as const },
    { url: "/interviews", priority: 0.7, changeFrequency: "daily" as const },
    { url: "/interview-command", priority: 0.7, changeFrequency: "daily" as const },
    { url: "/interview-arena", priority: 0.7, changeFrequency: "daily" as const },
    { url: "/panels", priority: 0.6, changeFrequency: "weekly" as const },
    { url: "/talent-pool", priority: 0.6, changeFrequency: "weekly" as const },
    { url: "/vendors", priority: 0.5, changeFrequency: "weekly" as const },
    { url: "/cv-screening", priority: 0.6, changeFrequency: "weekly" as const },

    // People & HR
    { url: "/people", priority: 0.8, changeFrequency: "daily" as const },
    { url: "/people-command", priority: 0.8, changeFrequency: "daily" as const },
    { url: "/onboarding-hub", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/performance", priority: 0.7, changeFrequency: "weekly" as const },
    { url: "/goals", priority: 0.6, changeFrequency: "weekly" as const },

    // Settings
    { url: "/settings/org", priority: 0.4, changeFrequency: "monthly" as const },
    { url: "/settings/users", priority: 0.4, changeFrequency: "monthly" as const },
    { url: "/settings/ai", priority: 0.5, changeFrequency: "monthly" as const },
    { url: "/settings/integrations", priority: 0.4, changeFrequency: "monthly" as const },
    { url: "/settings/security", priority: 0.4, changeFrequency: "monthly" as const },
  ];

  return [...publicRoutes, ...appRoutes].map((route) => ({
    url: `${siteUrl}${route.url}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
