import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { createOgImagePath } from "@/lib/seo/og-image";

const siteUrl = "https://deepbreathingexercises.com";
const canonicalUrl = `${siteUrl}/about/abi`;
const ogImageUrl = createOgImagePath("About Abi Abiassi");

export const metadata: Metadata = {
  title: "About Abi Abiassi, Founder of Deep Breathing Exercises",
  description:
    "Abi Abiassi built Deep Breathing Exercises as a free visualizer for breathing techniques he uses daily. Photographer, founder, breathwork practitioner.",
  alternates: {
    canonical: canonicalUrl
  },
  authors: [{ name: "Abi Abiassi", url: canonicalUrl }],
  openGraph: {
    title: "About Abi Abiassi, Founder of Deep Breathing Exercises",
    description:
      "Built this site as a free visualizer for the breathing techniques I use daily. Photographer, founder.",
    url: canonicalUrl,
    type: "profile",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "About Abi Abiassi"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "About Abi Abiassi",
    description:
      "Built this site as a free visualizer for the breathing techniques I use daily.",
    creator: "@abiassi_",
    images: [ogImageUrl]
  }
};

export default function AbiAboutPage() {
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
        item: `${siteUrl}/about`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Abi Abiassi",
        item: canonicalUrl
      }
    ]
  };

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${canonicalUrl}#person`,
    name: "Abi Abiassi",
    url: canonicalUrl,
    jobTitle: "Founder, Deep Breathing Exercises",
    description:
      "Founder of Deep Breathing Exercises. Photographer. Built the site as a free visualizer for the breathing techniques he uses daily.",
    knowsAbout: [
      "Breathing exercises",
      "Breathwork",
      "Pranayama",
      "Box breathing",
      "4-7-8 breathing",
      "Coherent breathing",
      "Physiological sigh",
      "Wim Hof Method",
      "Stress regulation"
    ],
    sameAs: [
      "https://abiassi.com",
      "https://www.linkedin.com/in/abiabiassi/",
      "https://x.com/abiassi_"
    ],
    worksFor: {
      "@type": "Organization",
      name: "Deep Breathing Exercises",
      url: siteUrl
    }
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={[breadcrumbSchema, personSchema]} />

      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-primary">DEEP BREATHING EXERCISES</p>
        <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">About Abi</h1>
        <p className="text-lg text-muted-foreground">
          Founder. Photographer. Built this site for the breathing techniques I use every day.
        </p>
      </header>

      <section className="mt-10 space-y-6 text-muted-foreground">
        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <p>
            I grew up in a family of meditation practitioners. It wasn&apos;t until later in life that I
            started being more intentional about breathwork. Once I did, I realized how useful these
            practices were on a day-to-day basis. They&apos;ve been invaluable in furthering my
            photography work too.
          </p>
          <p className="mt-4">
            I started researching and structuring them for myself, and figured a visualizer to guide
            you through any of them would be more useful than wading through endless YouTube videos
            and not-so-clear websites.
          </p>
          <p className="mt-4">
            Hope this site is as useful to you as it has been to me.
          </p>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">Find me elsewhere</h2>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href="https://abiassi.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                abiassi.com (photography &amp; personal site) →
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/abiabiassi/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                LinkedIn →
              </a>
            </li>
            <li>
              <a
                href="https://x.com/abiassi_"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                X / Twitter (@abiassi_) →
              </a>
            </li>
          </ul>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">How this site is made</h2>
          <p className="mt-3 text-sm">
            Each technique page names the practitioner or tradition it comes from, and links out
            to the peer-reviewed research that informs the claims. I&apos;m not a clinician. If you
            have a medical condition, please talk to your doctor before adopting a new breathing
            practice.
          </p>
          <p className="mt-3 text-sm">
            <Link href="/about/editorial-policy" className="font-semibold text-primary hover:underline">
              Read our editorial policy →
            </Link>
          </p>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">Get in touch</h2>
          <p className="mt-3 text-sm">
            Found an error? Have a feature request? Send me a note at{" "}
            <a href="mailto:hello@darkmatter.is" className="text-primary hover:underline">
              hello@darkmatter.is
            </a>
            . It goes straight to me.
          </p>
        </div>
      </section>

      <footer className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <Link href="/about" className="underline underline-offset-2 transition-colors hover:text-foreground">
          About
        </Link>
        <Link href="/about/editorial-policy" className="underline underline-offset-2 transition-colors hover:text-foreground">
          Editorial policy
        </Link>
        <Link href="/breathe" className="underline underline-offset-2 transition-colors hover:text-foreground">
          Techniques
        </Link>
        <Link href="/for" className="underline underline-offset-2 transition-colors hover:text-foreground">
          Guides
        </Link>
        <Link href="/privacy" className="underline underline-offset-2 transition-colors hover:text-foreground">
          Privacy
        </Link>
      </footer>
    </main>
  );
}
