import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";

const siteUrl = "https://deepbreathingexercises.com";
const canonicalUrl = `${siteUrl}/about`;

export const metadata: Metadata = {
  title: "About Deep Breathing Exercises",
  description:
    "Deep Breathing Exercises is a free breathing visualizer and set of evidence-informed breathing guides for calm, focus, and sleep.",
  alternates: {
    canonical: canonicalUrl
  },
  openGraph: {
    title: "About Deep Breathing Exercises",
    description:
      "A free breathing visualizer and evidence-informed guides for calm, focus, and sleep.",
    url: canonicalUrl,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "About Deep Breathing Exercises",
    description:
      "A free breathing visualizer and evidence-informed guides for calm, focus, and sleep."
  }
};

export default function AboutPage() {
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
        name: "About",
        item: canonicalUrl
      }
    ]
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={breadcrumbSchema} />

      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-primary">DEEP BREATHING EXERCISES</p>
        <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">About</h1>
        <p className="text-lg text-muted-foreground">
          Deep Breathing Exercises is a free breathing visualizer and a set of evidence-informed guides for calm, focus,
          and sleep.
        </p>
      </header>

      <section className="mt-10 space-y-6 text-muted-foreground">
        <div className="glow-card rounded-[32px] border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold text-card-foreground">What this is</h2>
          <p className="mt-3">
            This site provides simple, guided breathing sessions (box breathing, 4-7-8, coherent breathing for HRV, and
            the physiological sigh) plus short guides explaining when to use each technique.
          </p>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold text-card-foreground">What this is not</h2>
          <p className="mt-3">
            This is not medical treatment. If you have a cardiopulmonary condition, are pregnant, or have a history of
            fainting, keep breathing gentle, avoid long breath holds, and consult a clinician for personalized advice.
          </p>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold text-card-foreground">Links</h2>
          <div className="mt-3 space-y-2 text-sm">
            <p>
              <Link href="/breathe" className="font-semibold text-primary hover:underline">
                Breathing techniques
              </Link>
            </p>
            <p>
              <Link href="/for" className="font-semibold text-primary hover:underline">
                Guides by goal
              </Link>
            </p>
            <p>
              <Link href="/privacy" className="font-semibold text-primary hover:underline">
                Privacy
              </Link>
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-muted/60 p-4 text-sm">
          <p className="text-card-foreground">Created by</p>
          <p className="mt-2">
            <a
              href="https://abiassi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:underline"
            >
              Abiassi
            </a>
            {" + "}
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
      </section>
    </main>
  );
}
