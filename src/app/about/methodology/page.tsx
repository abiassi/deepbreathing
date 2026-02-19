import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { createOgImagePath } from "@/lib/seo/og-image";

const siteUrl = "https://deepbreathingexercises.com";
const canonicalUrl = `${siteUrl}/about/methodology`;
const ogImageUrl = createOgImagePath("Our Content Methodology");

export const metadata: Metadata = {
  title: "Our Content Methodology — Evidence-Based Breathing Guides",
  description:
    "How we create evidence-based breathing guides. Our editorial process, research standards, and commitment to accuracy.",
  alternates: {
    canonical: canonicalUrl
  },
  openGraph: {
    title: "Our Content Methodology",
    description:
      "How we create evidence-based breathing guides. Our editorial process and research standards.",
    url: canonicalUrl,
    type: "website",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Our Content Methodology"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Content Methodology",
    description:
      "How we create evidence-based breathing guides. Our editorial process and research standards.",
    images: [ogImageUrl]
  }
};

export default function MethodologyPage() {
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
        name: "Methodology",
        item: canonicalUrl
      }
    ]
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Our Content Methodology",
    description: "How we create evidence-based breathing guides with research-backed information.",
    author: {
      "@type": "Organization",
      name: "Deep Breathing Exercises",
      url: siteUrl
    },
    publisher: {
      "@type": "Organization",
      name: "Deep Breathing Exercises",
      url: siteUrl
    },
    datePublished: "2026-01-27",
    dateModified: "2026-01-27",
    mainEntityOfPage: canonicalUrl
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={[breadcrumbSchema, articleSchema]} />

      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-primary">ABOUT</p>
        <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">Our Content Methodology</h1>
        <p className="text-lg text-muted-foreground">
          How we create evidence-based breathing guides you can trust.
        </p>
        <p className="text-xs text-muted-foreground">Last updated: January 27, 2026</p>
      </header>

      <section className="mt-10 space-y-8 text-muted-foreground">
        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">Our commitment</h2>
          <p className="mt-4">
            Deep Breathing Exercises provides free, evidence-informed breathing techniques and guides.
            We believe accurate health information should be accessible to everyone. Our content aims
            to be helpful, accurate, and transparent about what research does and doesn&apos;t support.
          </p>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">Research standards</h2>
          <div className="mt-4 space-y-4">
            <p>Our content is informed by:</p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Peer-reviewed research:</strong> We prioritize
                  systematic reviews, meta-analyses, and randomized controlled trials from journals indexed
                  in PubMed and PsycINFO.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Established protocols:</strong> We reference
                  techniques from recognized researchers like Dr. Andrew Weil (4-7-8 breathing), Dr. Andrew
                  Huberman (physiological sigh), and Mark Divine (box breathing).
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Clinical guidelines:</strong> We align with
                  guidance from organizations like the American Heart Association, Sleep Foundation, and
                  Cleveland Clinic where applicable.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">Editorial process</h2>
          <div className="mt-4 space-y-4">
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">1</span>
                <div>
                  <strong className="text-card-foreground">Research phase</strong>
                  <p className="mt-1 text-sm">We review scientific literature, identify consensus findings,
                  and note areas of ongoing research or uncertainty.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">2</span>
                <div>
                  <strong className="text-card-foreground">Content creation</strong>
                  <p className="mt-1 text-sm">We write clear, accessible content that explains techniques,
                  benefits, and appropriate use cases—always grounded in research.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">3</span>
                <div>
                  <strong className="text-card-foreground">Accuracy review</strong>
                  <p className="mt-1 text-sm">Content is reviewed for accuracy, clarity, and appropriate
                  safety disclaimers before publication.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">4</span>
                <div>
                  <strong className="text-card-foreground">Ongoing updates</strong>
                  <p className="mt-1 text-sm">We regularly review and update content as new research emerges.
                  All pages display their last update date.</p>
                </div>
              </li>
            </ol>
          </div>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">What we include</h2>
          <div className="mt-4 space-y-4">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Source citations:</strong> Each technique page
                  includes references to supporting research with links to PubMed or original sources.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Safety information:</strong> We include appropriate
                  cautions, contraindications, and recommendations to consult healthcare providers when relevant.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Last updated dates:</strong> Every page displays
                  when it was last reviewed and updated.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Evidence levels:</strong> We distinguish between
                  well-established findings (multiple RCTs) and emerging research (preliminary studies).
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">What we don&apos;t do</h2>
          <div className="mt-4 space-y-4">
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-muted-foreground">✗</span>
                <span>We don&apos;t provide medical diagnoses or treatment recommendations.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-muted-foreground">✗</span>
                <span>We don&apos;t claim breathing techniques can cure diseases or replace medical treatment.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-muted-foreground">✗</span>
                <span>We don&apos;t overstate research findings or present preliminary studies as established fact.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-muted-foreground">✗</span>
                <span>We don&apos;t recommend techniques for conditions where research doesn&apos;t support their use.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">Our team</h2>
          <div className="mt-4 space-y-4">
            <p>
              Deep Breathing Exercises is created by{" "}
              <a href="https://abiassi.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Abiassi
              </a>
              {" "}and{" "}
              <a href="https://darkmatter.is/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Darkmatter AI Labs
              </a>. Our content is informed by consultation with breathing practitioners, review of
              scientific literature, and feedback from users.
            </p>
            <p className="text-sm">
              We&apos;re not medical professionals. This site is for educational purposes and should
              complement—not replace—professional healthcare advice.
            </p>
          </div>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">Feedback</h2>
          <p className="mt-4">
            Found an error or have suggestions? We welcome corrections and feedback. Contact us
            at{" "}
            <a href="mailto:hello@darkmatter.is" className="text-primary hover:underline">
              hello@darkmatter.is
            </a>.
          </p>
        </div>
      </section>

      <footer className="mt-12 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
        <Link href="/about" className="underline underline-offset-2 transition-colors hover:text-foreground">
          About
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
