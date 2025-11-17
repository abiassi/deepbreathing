import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const fontSans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const siteUrl = "https://deepbreathingexercises.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Box Breathing Visualizer – Deep Breathing Exercises",
    template: "%s | Deep Breathing Exercises"
  },
  description:
    "An ultra-simple box breathing visualizer with guided timing, tactile prompts, and accessibility-friendly controls.",
  openGraph: {
    title: "Box Breathing Visualizer",
    description: "Inhale 4, hold 4, exhale 4, hold 4—simple on-screen guide.",
    type: "website",
    url: siteUrl,
    siteName: "Deep Breathing Exercises"
  },
  twitter: {
    card: "summary",
    title: "Box Breathing Visualizer",
    description: "Guided 4x4x4x4 breathing visualizer with realtime cues.",
    creator: "@deepbreathing"
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
        {children}
      </body>
    </html>
  );
}
