import type { Metadata } from "next";

import { EmbedGenerator } from "./embed-generator";

const siteUrl = "https://deepbreathingexercises.com";

export const metadata: Metadata = {
  title: "Embed a Breathing Exercise on Your Website — Free Widget",
  description:
    "Add a free interactive breathing exercise widget to your website. Choose from 12 patterns including box breathing, 4-7-8, and coherent breathing. Copy the embed code and paste it into your HTML.",
  robots: { index: true, follow: true },
  alternates: { canonical: `${siteUrl}/embed` },
  openGraph: { url: `${siteUrl}/embed` },
};

export default function EmbedLandingPage() {
  return <EmbedGenerator />;
}
