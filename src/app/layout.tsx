import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";
import { SeasonalBanner } from "@/components/home/seasonal-banner";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const siteUrl = "https://deepbreathingexercises.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free Breathing Visualizer: Calm Anxiety in 60 Seconds",
    template: "%s | Deep Breathing Exercises"
  },
  description:
    "Calm anxiety in 60 seconds with our free breathing visualizer. Box breathing, 4-7-8, physiological sigh—all free, no signup. Used by 10,000+ people. Try now.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: "/android-chrome-192x192.png"
      },
      {
        rel: "android-chrome-512x512",
        url: "/android-chrome-512x512.png"
      }
    ]
  },
  manifest: "/site.webmanifest",
  openGraph: {
    title: "Free Breathing Visualizer: Calm Anxiety in 60 Seconds",
    description:
      "Calm anxiety in 60 seconds with our free breathing visualizer. Box breathing, 4-7-8, physiological sigh. No signup required.",
    type: "website",
    url: siteUrl,
    siteName: "Deep Breathing Exercises",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Interactive breathing orb expanding against a coral gradient"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Free Breathing Visualizer: Calm Anxiety in 60 Seconds",
    description:
      "Calm anxiety in 60 seconds with our free breathing visualizer. Box breathing, 4-7-8, physiological sigh. Try now—no signup.",
    creator: "@deepbreathing",
    images: ["/og-image.png"]
  },
  alternates: {
    canonical: siteUrl
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.variable} min-h-screen bg-background text-foreground`}>
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
        <Script id="resonance-theme-init" strategy="beforeInteractive">
          {`(function(){try{var storageKey='resonance_theme';var root=document.documentElement;var stored=localStorage.getItem(storageKey);var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var theme=stored&&stored!=='system'?stored:(prefersDark?'dark':'light');if(theme==='dark'){root.classList.add('dark');}else{root.classList.remove('dark');}root.dataset.theme=theme;}catch(_e){}})();`}
        </Script>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7GG9WVNBBP"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-7GG9WVNBBP');`}
        </Script>
        <SeasonalBanner />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
