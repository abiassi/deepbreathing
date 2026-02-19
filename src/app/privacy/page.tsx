import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { createOgImagePath } from "@/lib/seo/og-image";

const siteUrl = "https://deepbreathingexercises.com";
const canonicalUrl = `${siteUrl}/privacy`;
const ogImageUrl = createOgImagePath("Privacy Policy");

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Deep Breathing Exercises. Learn what data we collect (if any), how it's used, and how to contact us.",
  alternates: {
    canonical: canonicalUrl
  },
  openGraph: {
    title: "Privacy Policy",
    description:
      "Privacy policy for Deep Breathing Exercises.",
    url: canonicalUrl,
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Privacy Policy"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy",
    description: "Privacy policy for Deep Breathing Exercises.",
    images: [ogImageUrl]
  }
};

export default function PrivacyPage() {
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Privacy",
        item: canonicalUrl
      }
    ]
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbSchema} />

      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-primary">DEEP BREATHING EXERCISES</p>
        <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">Privacy</h1>
        <p className="text-lg text-muted-foreground">
          We aim to keep this site simple and privacy-friendly.
        </p>
      </header>

      <section className="mt-10 space-y-6 text-muted-foreground">
        <div className="glow-card rounded-[32px] border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold text-card-foreground">What we collect</h2>
          <p className="mt-3">
            This site may use privacy-friendly analytics and performance monitoring (for example, Vercel Analytics and
            Vercel Speed Insights) to understand basic usage patterns and site performance. These tools typically collect
            aggregated technical information such as page views, device/browser details, and performance metrics.
          </p>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold text-card-foreground">What we do with it</h2>
          <p className="mt-3">
            We use this information to improve the breathing visualizer, fix bugs, and keep the site fast. We do not sell
            personal information.
          </p>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold text-card-foreground">Third-party links</h2>
          <p className="mt-3">
            Some pages link to external research or resources. Those sites have their own privacy policies.
          </p>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold text-card-foreground">Contact</h2>
          <p className="mt-3">
            If you have questions about privacy, you can reach the creators via:
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <a
                href="https://abiassi.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Abiassi
              </a>
            </p>
            <p>
              <a
                href="https://darkmatter.is/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                Darkmatter AI Labs
              </a>
            </p>
          </div>
          <div className="mt-4">
            <Link href="/" className="text-sm font-semibold text-primary hover:underline">
              Back to the visualizer →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
