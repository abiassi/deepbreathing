import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Script from "next/script";
import "./globals.css";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const siteUrl = "https://deepbreathingexercises.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Interactive Breathing Visualizer – Deep Breathing Exercises",
    template: "%s | Deep Breathing Exercises"
  },
  description:
    "Interactive breathing visualizer with adjustable pacing, tactile prompts, and calm-focused cues so you can downshift anytime.",
  openGraph: {
    title: "Interactive Breathing Visualizer",
    description:
      "Adjustable breaths, holds, and cues that keep your breathing slow and steady—anytime, anywhere.",
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
    title: "Interactive Breathing Visualizer",
    description:
      "Guided interactive breathing with adjustable timing and tactile cues, designed for calm anywhere.",
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
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
