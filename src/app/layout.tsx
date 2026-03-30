import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://o2s.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "O2S — The Organization Operating System | by Yatisphere",
    template: "%s | O2S by Yatisphere",
  },
  description:
    "AI-native HR automation platform by Yatisphere Technologies. Autonomous agents for recruiting, onboarding, compliance, and performance management.",
  keywords: [
    "HR automation",
    "AI recruiting",
    "talent acquisition",
    "ATS",
    "HRMS",
    "organization operating system",
    "AI agents",
    "hiring platform",
    "employee management",
    "performance management",
    "Yatisphere",
    "O2S",
  ],
  authors: [{ name: "Yatisphere Technologies", url: "https://yatisphere.com" }],
  creator: "Yatisphere Technologies",
  publisher: "Yatisphere Technologies",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "O2S — Organization Operating System",
    title: "O2S — The Organization Operating System",
    description:
      "AI-native HR automation platform. Autonomous agents for recruiting, onboarding, compliance, and performance management.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "O2S — The Organization Operating System by Yatisphere",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "O2S — The Organization Operating System",
    description:
      "AI-native HR automation platform with autonomous agents for the entire employee lifecycle.",
    images: ["/og-image.png"],
    creator: "@yatisphere",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${ibmPlexSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "O2S — Organization Operating System",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              description:
                "AI-native HR automation platform with autonomous agents for recruiting, onboarding, compliance, and performance management.",
              url: siteUrl,
              author: {
                "@type": "Organization",
                name: "Yatisphere Technologies",
                url: "https://yatisphere.com",
              },
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                description: "Free trial available",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "120",
                bestRating: "5",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
