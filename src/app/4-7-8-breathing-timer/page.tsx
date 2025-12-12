import type { Metadata } from "next";
import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";

const siteUrl = "https://deepbreathingexercises.com";
const canonicalUrl = `${siteUrl}/4-7-8-breathing-timer`;

export const metadata: Metadata = {
  title: "4-7-8 Breathing Timer — Free 4-7-8 Breathing App (No Download)",
  description:
    "A free 4-7-8 breathing timer (Dr. Weil's method). Run the 4-7-8 breathing app in your browser—no download, no signup. Start in seconds.",
  alternates: {
    canonical: canonicalUrl
  },
  openGraph: {
    title: "4-7-8 Breathing Timer (Free)",
    description:
      "A free 4-7-8 breathing timer (Dr. Weil's method). Run it in your browser—no download and no signup.",
    url: canonicalUrl,
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "4-7-8 Breathing Timer (Free)",
    description:
      "A free 4-7-8 breathing timer (Dr. Weil's method). Run it in your browser—no download and no signup."
  }
};

export default function FourSevenEightBreathingTimerMoneyPage() {
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
        name: "4-7-8 Breathing Timer",
        item: canonicalUrl
      }
    ]
  };

  const appSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "4-7-8 Breathing Timer",
    applicationCategory: "HealthApplication",
    operatingSystem: "Web",
    url: canonicalUrl,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is 4-7-8 breathing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "4-7-8 breathing is a breathing technique popularized by Dr. Andrew Weil that follows a specific pattern: inhale for 4 counts, hold for 7 counts, exhale for 8 counts. The extended exhale activates the parasympathetic nervous system, promoting relaxation and calm."
        }
      },
      {
        "@type": "Question",
        name: "Is 4-7-8 breathing good for sleep?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, 4-7-8 breathing is particularly effective for sleep. The long exhale helps activate the body's relaxation response, slowing heart rate and calming the nervous system. Many people use it as part of their bedtime routine to fall asleep faster."
        }
      },
      {
        "@type": "Question",
        name: "How many times should I do 4-7-8 breathing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dr. Weil recommends starting with 4 breath cycles (about 1 minute) twice daily, then gradually increasing to 8 cycles as you get comfortable. For sleep, practice 4-8 cycles when you get into bed. Avoid doing more than 8 cycles in one sitting when you're just starting out."
        }
      },
      {
        "@type": "Question",
        name: "Can 4-7-8 breathing help with anxiety?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, 4-7-8 breathing can help reduce anxiety. The extended exhale and breath hold stimulate the vagus nerve, which triggers the relaxation response. Many people find it helpful during anxious moments or panic attacks."
        }
      },
      {
        "@type": "Question",
        name: "What if I can't hold my breath for 7 counts?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If holding for 7 counts feels uncomfortable, modify the pattern while keeping the ratio similar. Try 2-3.5-4 or 3-5.25-6 (half or three-quarters of the original). The key is maintaining the exhale-emphasis pattern. Comfort should always come first—never strain."
        }
      },
      {
        "@type": "Question",
        name: "When is the best time to do 4-7-8 breathing?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "4-7-8 breathing works best when you need to calm down: before bed, during stressful moments, after a difficult day, or before anxiety-inducing situations. Many people use it at night for sleep, but it's also effective for managing daytime stress and nervous energy."
        }
      }
    ]
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <JsonLd data={[breadcrumbSchema, appSchema, faqSchema]} />

      <header className="space-y-4">
        <p className="text-xs uppercase tracking-[0.35em] text-primary">DEEP BREATHING EXERCISES</p>
        <h1 className="text-4xl font-semibold text-foreground sm:text-5xl">4-7-8 breathing timer</h1>
        <p className="max-w-2xl text-lg text-muted-foreground">
          A free 4-7-8 breathing app (Dr. Andrew Weil&apos;s method) you can run right now in your browser. Press Start, follow
          the visual pacing, and adjust the counts if you need a gentler version.
        </p>
      </header>

      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="glow-card rounded-[32px] border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold text-card-foreground">Start the timer</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Press Start and breathe with the animation. You can adjust pacing, sound, and haptics.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link href="/breathe/4-7-8" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
              Open 4-7-8 timer
            </Link>
            <Link href="/breathing-app" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-card-foreground">
              See the full app
            </Link>
          </div>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-6">
          <h2 className="text-2xl font-semibold text-card-foreground">Suggested settings</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The classic 4-7-8 includes a hold. If holding feels uncomfortable, modify it.
          </p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>Classic: 4 in / 7 hold / 8 out</li>
            <li>Gentler: 4 in / 4 hold / 6–8 out</li>
            <li>No-hold option: 4 in / 6–8 out</li>
            <li>If you feel light-headed: make breaths smaller and quieter, and shorten or remove the hold</li>
          </ul>
          <div className="mt-5">
            <Link href="/breathe/4-7-8#how-to" className="text-sm font-semibold text-primary hover:underline">
              Step-by-step instructions →
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-12 space-y-6">
        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">What is 4-7-8 breathing?</h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <p>
              4-7-8 breathing is a powerful relaxation technique developed and popularized by Dr. Andrew Weil, a Harvard-trained
              physician and pioneer in integrative medicine. The method follows a simple but specific pattern: inhale through
              your nose for 4 counts, hold your breath for 7 counts, then exhale completely through your mouth for 8 counts.
            </p>
            <p>
              What makes 4-7-8 breathing unique is its emphasis on the exhale. The 8-count exhale is twice as long as the
              inhale, creating an exhale-dominant pattern that actively engages the parasympathetic nervous system—your body&apos;s
              built-in relaxation mechanism. This makes it particularly effective for sleep and anxiety relief.
            </p>
            <p>
              Dr. Weil calls 4-7-8 breathing a &ldquo;natural tranquilizer for the nervous system.&rdquo; Unlike pharmaceutical
              tranquilizers that can lose effectiveness over time, 4-7-8 breathing actually becomes more powerful with practice.
              The technique is based on pranayama, an ancient yogic practice of breath control, but adapted for modern use
              without any spiritual or cultural requirements.
            </p>
          </div>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">Benefits of 4-7-8 breathing</h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <p>4-7-8 breathing offers several research-supported benefits, particularly for relaxation and sleep:</p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Helps you fall asleep faster:</strong> The extended exhale and breath
                  hold trigger your body&apos;s natural sleep mechanisms. Many practitioners report falling asleep within minutes of
                  starting the technique.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Reduces anxiety and panic:</strong> The breath hold increases CO₂
                  levels slightly, which paradoxically calms anxiety and helps interrupt panic spirals. The counting also gives
                  your mind something to focus on besides anxious thoughts.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Lowers blood pressure:</strong> Regular practice has been shown to
                  reduce both systolic and diastolic blood pressure by activating the parasympathetic nervous system.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Reduces anger and frustration:</strong> The forced slow breathing
                  creates a pause between stimulus and response, giving you space to respond thoughtfully rather than react
                  emotionally.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Calms nervous energy:</strong> The technique is particularly useful
                  before public speaking, medical procedures, difficult conversations, or other anxiety-inducing events.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Helps with cravings:</strong> The breath hold and focus can help you
                  ride out cravings for food, nicotine, or other substances by creating a gap between urge and action.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">How 4-7-8 breathing works</h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <p>
              4-7-8 breathing works through several interconnected physiological mechanisms. The most important is the
              activation of your vagus nerve—the main nerve of your parasympathetic nervous system. The vagus nerve runs from
              your brainstem down through your chest and abdomen, and it acts like a brake pedal for your stress response.
            </p>
            <p>
              The extended exhale (8 counts) is the key. When you exhale slowly and completely, you stimulate pressure receptors
              in your lungs and chest that signal the vagus nerve to activate. This triggers a cascade of calming effects:
              slowed heart rate, lowered blood pressure, relaxed muscles, and reduced cortisol (stress hormone) production.
            </p>
            <p>
              The 7-count breath hold also plays an important role. Holding your breath after inhaling allows oxygen to fully
              saturate your blood and reach your tissues. More importantly, the hold causes a slight buildup of carbon dioxide
              (CO₂) in your bloodstream. While we typically think of CO₂ as waste, moderate increases actually have a calming
              effect on the nervous system and improve oxygen delivery to your cells—a phenomenon called the Bohr effect.
            </p>
            <p>
              The counting itself provides a cognitive anchor. When you&apos;re anxious, stressed, or unable to sleep, your mind is
              usually racing with thoughts. The simple act of counting gives your conscious mind a single point of focus,
              interrupting rumination and worry patterns.
            </p>
            <p>
              Research has shown that techniques emphasizing longer exhales can shift your autonomic nervous system balance
              toward parasympathetic dominance, increase heart rate variability (a marker of resilience), and even influence
              brainwave patterns toward more relaxed alpha and theta states.
            </p>
          </div>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">When to use 4-7-8 breathing</h2>
          <div className="mt-4 space-y-4 text-muted-foreground">
            <p>4-7-8 breathing is most effective in situations where you need to activate your relaxation response:</p>
            <ul className="space-y-3">
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Before bed (insomnia relief):</strong> The most popular use case.
                  Practice 4-8 breath cycles when you get into bed. Many people report falling asleep before completing all
                  cycles.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">During anxiety or panic attacks:</strong> When you feel panic rising,
                  4-7-8 breathing can help break the cycle. The breath hold is particularly effective for calming acute anxiety.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">After a stressful day:</strong> Use 4-7-8 as a transition ritual when
                  you get home from work to help you leave the day&apos;s stress behind.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Before stressful events:</strong> Practice 4-8 cycles before job
                  interviews, presentations, medical procedures, difficult conversations, or any anxiety-inducing situation.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">When you wake up at night:</strong> If you wake up at 3 AM with racing
                  thoughts, 4-7-8 breathing can help you fall back asleep without reaching for your phone or medication.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">Managing anger:</strong> When you feel anger rising, excuse yourself
                  and practice a few cycles. The forced pause helps prevent reactive, regrettable responses.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">•</span>
                <span>
                  <strong className="text-card-foreground">During cravings:</strong> When cravings hit (food, nicotine, etc.),
                  use 4 cycles to create space between the urge and the action.
                </span>
              </li>
            </ul>
            <p className="mt-4">
              <strong className="text-card-foreground">Important note:</strong> While 4-7-8 is generally calming, some people
              find breath holds energizing or uncomfortable. If it doesn&apos;t feel right, try removing the hold or using a
              different technique like coherent breathing instead.
            </p>
          </div>
        </div>

        <div className="glow-card rounded-[32px] border border-border bg-card p-8">
          <h2 className="text-2xl font-semibold text-card-foreground">Frequently asked questions</h2>
          <div className="mt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">What is 4-7-8 breathing?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                4-7-8 breathing is a breathing technique popularized by Dr. Andrew Weil that follows a specific pattern: inhale
                for 4 counts, hold for 7 counts, exhale for 8 counts. The extended exhale activates the parasympathetic nervous
                system, promoting relaxation and calm.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Is 4-7-8 breathing good for sleep?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Yes, 4-7-8 breathing is particularly effective for sleep. The long exhale helps activate the body&apos;s relaxation
                response, slowing heart rate and calming the nervous system. Many people use it as part of their bedtime routine
                to fall asleep faster.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">How many times should I do 4-7-8 breathing?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Dr. Weil recommends starting with 4 breath cycles (about 1 minute) twice daily, then gradually increasing to 8
                cycles as you get comfortable. For sleep, practice 4-8 cycles when you get into bed. Avoid doing more than 8
                cycles in one sitting when you&apos;re just starting out.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">Can 4-7-8 breathing help with anxiety?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Yes, 4-7-8 breathing can help reduce anxiety. The extended exhale and breath hold stimulate the vagus nerve,
                which triggers the relaxation response. Many people find it helpful during anxious moments or panic attacks.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">What if I can&apos;t hold my breath for 7 counts?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                If holding for 7 counts feels uncomfortable, modify the pattern while keeping the ratio similar. Try 2-3.5-4 or
                3-5.25-6 (half or three-quarters of the original). The key is maintaining the exhale-emphasis pattern. Comfort
                should always come first—never strain.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-card-foreground">When is the best time to do 4-7-8 breathing?</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                4-7-8 breathing works best when you need to calm down: before bed, during stressful moments, after a difficult
                day, or before anxiety-inducing situations. Many people use it at night for sleep, but it&apos;s also effective for
                managing daytime stress and nervous energy.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-3">
        <div className="glow-card rounded-[32px] border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-card-foreground">Great for wind-down</h2>
          <p className="mt-2 text-sm text-muted-foreground">Exhale-emphasis often feels calming before bed or after stress.</p>
        </div>
        <div className="glow-card rounded-[32px] border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-card-foreground">Adjustable</h2>
          <p className="mt-2 text-sm text-muted-foreground">Treat the counts as a starting point—comfort comes first.</p>
        </div>
        <div className="glow-card rounded-[32px] border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-card-foreground">No download</h2>
          <p className="mt-2 text-sm text-muted-foreground">Runs on mobile and desktop with nothing to install.</p>
        </div>
      </section>

      <section className="mt-12 glow-card rounded-[32px] border border-border bg-card p-6">
        <h2 className="text-2xl font-semibold text-card-foreground">More breathing apps</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Prefer a structured reset or HRV-focused pacing? Try box breathing or coherent breathing.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/box-breathing-app" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-card-foreground">
            Box breathing app
          </Link>
          <Link href="/coherent-breathing-app" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-card-foreground">
            Coherent (HRV) breathing
          </Link>
          <Link href="/breathe" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-card-foreground">
            Browse techniques
          </Link>
        </div>
      </section>

      <footer className="mt-12 rounded-[32px] border border-border bg-card p-6 text-center">
        <p className="text-xs text-muted-foreground">
          Stop if dizzy, tingly, or chest‑tight. Resume later with shorter, easier breaths.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
          <Link href="/breathe" className="underline underline-offset-2 transition-colors hover:text-foreground">
            Techniques
          </Link>
          <Link href="/for" className="underline underline-offset-2 transition-colors hover:text-foreground">
            Guides
          </Link>
          <Link href="/breathing-app" className="underline underline-offset-2 transition-colors hover:text-foreground">
            App
          </Link>
          <Link href="/about" className="underline underline-offset-2 transition-colors hover:text-foreground">
            About
          </Link>
          <Link href="/privacy" className="underline underline-offset-2 transition-colors hover:text-foreground">
            Privacy
          </Link>
        </div>
      </footer>
    </main>
  );
}
