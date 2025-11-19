"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { BreathingVisualizer } from "@/components/breathing-visualizer";
import { FadingHeroTitle } from "@/components/breathe/fading-hero-title";
import { JsonLd } from "@/components/seo/json-ld";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const baseUrl = "https://deepbreathingexercises.com";

const faqs = [
  {
    question: "How long should I practice?",
    answer: "Start with 60–120 s. If it's still easy and helpful, extend to 3–5 min. For HRV‑focused training, 5–10 min most days."
  },
  {
    question: "When's the best time?",
    answer: "Before a meeting or workout, between blocks of deep work, or before bed. Use physiological sighs for urgent spikes of stress."
  },
  {
    question: "Can I change the timing?",
    answer: "Yes. That's the point. Use 3–8 s per phase. If holds feel uncomfortable, remove them and keep an even inhale/exhale."
  },
  {
    question: "What if I feel light‑headed?",
    answer: "You're likely over‑breathing. Make breaths smaller and quieter, shorten phases, or pause and breathe normally."
  },
  {
    question: "Is this medical treatment?",
    answer: "No. It's a self‑regulation tool. If you have a cardiopulmonary condition, are pregnant, or have fainting history, avoid long holds and keep everything gentle."
  }
];

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Deep Breathing Exercises",
  url: baseUrl,
  description:
    "Guided breathing visualizer with adjustable pacing. Visual pacing that helps your body downshift—anytime, anywhere.",
  potentialAction: {
    "@type": "SearchAction",
    target: `${baseUrl}/?q={search_term_string}`,
    "query-input": "required name=search_term_string"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer
    }
  }))
};

export default function HomePage() {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const handleRunState = (event: Event) => {
      const custom = event as CustomEvent<{ running: boolean }>;
      setRunning(Boolean(custom.detail?.running));
    };

    window.addEventListener("resonance:run-state", handleRunState);
    return () => window.removeEventListener("resonance:run-state", handleRunState);
  }, []);

  const handleStartSession = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('resonance:start'));
    }
  };

  const heroHeader = (
    <div className="space-y-6">
      <FadingHeroTitle
        label="DEEP BREATHING EXERCISES"
        title="Calm, on demand"
        subtitle="Visual breathing exercise that helps your body downshift. Anytime, anywhere."
      />
      <div className={cn(
        "flex flex-wrap gap-4 transition-all duration-500",
        running ? "opacity-0 translate-y-2 pointer-events-none" : "opacity-100 translate-y-0"
      )}>
        <Button onClick={handleStartSession} type="button" size="lg">
          Start session
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="#mode-picker">Pick a mode</a>
        </Button>
      </div>
    </div>
  );

  return (
    <main className="bg-transparent pb-20">
      <JsonLd data={[websiteSchema, faqSchema]} />

      <section className="relative isolate min-h-screen w-full text-foreground">
        <BreathingVisualizer />
        <div className="absolute inset-y-0 left-0 z-30 hidden w-full max-w-xl px-6 py-20 lg:flex lg:flex-col lg:justify-center">
          {heroHeader}
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="lg:hidden">{heroHeader}</div>
      </section>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16 sm:px-6 lg:px-8">
        <section className="text-center">
          <h2 className="text-3xl font-semibold text-card-foreground">Precision breathwork.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted-foreground">
            Press Start and follow the orb through inhale, pause, exhale, pause. The cadence is adjustable. Sessions are short. Effects are tangible.
          </p>
        </section>

        <section className="grid gap-6 text-left lg:grid-cols-3">
          <div className="rounded-[32px] bg-card p-6 shadow-[0_25px_60px_rgba(255,170,130,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.3)]">
            <p className="text-sm uppercase tracking-wider text-primary">Calm by design</p>
            <p className="mt-3 text-muted-foreground">
              Slow, even breathing often increases vagally mediated HRV and lowers perceived stress during practice.
            </p>
          </div>
          <div className="rounded-[32px] bg-card p-6 shadow-[0_25px_60px_rgba(255,170,130,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.3)]">
            <p className="text-sm uppercase tracking-wider text-primary">Built for real life</p>
            <p className="mt-3 text-muted-foreground">
              Short sets (1–5 min) before meetings, between tasks, or at lights‑out.
            </p>
          </div>
          <div className="rounded-[32px] bg-card p-6 shadow-[0_25px_60px_rgba(255,170,130,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.3)]">
            <p className="text-sm uppercase tracking-wider text-primary">Your pace</p>
            <p className="mt-3 text-muted-foreground">
              Choose 3–8 seconds per phase. Smaller, quieter breaths beat "big" breaths.
            </p>
          </div>
        </section>

        <section id="mode-picker" className="rounded-[48px] bg-card/80 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
          <div>
            <h2 className="text-3xl font-semibold text-card-foreground">Pick a mode</h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <Link
              href="/breathe/box"
              className="group rounded-3xl border border-border/70 bg-card/80 p-5 transition hover:-translate-y-1 hover:bg-card dark:border-border/50 dark:bg-card/40 dark:hover:bg-card/60"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary">/box</p>
              <h3 className="mt-3 text-2xl font-semibold text-card-foreground">Box Breathing (4‑4‑4‑4)</h3>
              <p className="mt-2 text-sm text-muted-foreground">Equal counts to steady arousal and sharpen focus.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                Start session →
              </span>
            </Link>
            <Link
              href="/breathe/4-7-8"
              className="group rounded-3xl border border-border/70 bg-card/80 p-5 transition hover:-translate-y-1 hover:bg-card dark:border-border/50 dark:bg-card/40 dark:hover:bg-card/60"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary">/4-7-8</p>
              <h3 className="mt-3 text-2xl font-semibold text-card-foreground">4‑7‑8 Breathing</h3>
              <p className="mt-2 text-sm text-muted-foreground">Long‑exhale cadence to downshift quickly.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                Start session →
              </span>
            </Link>
            <Link
              href="/breathe/coherent"
              className="group rounded-3xl border border-border/70 bg-card/80 p-5 transition hover:-translate-y-1 hover:bg-card dark:border-border/50 dark:bg-card/40 dark:hover:bg-card/60"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary">/coherent</p>
              <h3 className="mt-3 text-2xl font-semibold text-card-foreground">Coherent Breathing</h3>
              <p className="mt-2 text-sm text-muted-foreground">Equal in/out near 0.1 Hz to amplify HRV.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                Start session →
              </span>
            </Link>
            <Link
              href="/breathe/physiological-sigh"
              className="group rounded-3xl border border-border/70 bg-card/80 p-5 transition hover:-translate-y-1 hover:bg-card dark:border-border/50 dark:bg-card/40 dark:hover:bg-card/60"
            >
              <p className="text-xs uppercase tracking-[0.3em] text-primary">/physiological-sigh</p>
              <h3 className="mt-3 text-2xl font-semibold text-card-foreground">Physiological Sigh</h3>
              <p className="mt-2 text-sm text-muted-foreground">Double inhale, long exhale—rapid reset.</p>
              <span className="mt-4 inline-flex items-center text-sm font-semibold text-primary">
                Start session →
              </span>
            </Link>
          </div>
        </section>

        <section className="rounded-[48px] bg-card/80 p-8 shadow-[0_30px_90px_rgba(15,23,42,0.12)]">
          <h2 className="text-3xl font-semibold text-card-foreground">One minute to steady</h2>
          <ul className="mt-6 space-y-3 text-muted-foreground">
            <li>• Sit tall. Shoulders soft. Tongue to roof of mouth.</li>
            <li>• Inhale gently through the nose; exhale quietly (nose or pursed lips).</li>
            <li>• Keep it easy. If dizzy, shorten phases or pause.</li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild variant="outline">
              <Link href="/breathe/box">60 s / 3–3–3–3</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/breathe/box">2 min / 4–4–4–4</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/breathe/box">3 min / 5–5 (no holds)</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/breathe/physiological-sigh">3 cycles / physiological sigh</Link>
            </Button>
          </div>
        </section>

        <section className="rounded-[32px] bg-card p-6 shadow-[0_25px_60px_rgba(255,170,130,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.3)]">
          <h2 className="text-2xl font-semibold text-card-foreground">Dial it in</h2>
          <p className="mt-3 text-muted-foreground">
            Slide between 3–8 s per phase. Start small. Smooth &gt; deep. If holds feel edgy, skip them and keep an even inhale/exhale.
          </p>
        </section>

        <section className="space-y-4 rounded-[40px] bg-card p-8 shadow-[0_25px_80px_rgba(255,170,130,0.2)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
          <h2 className="text-2xl font-semibold text-card-foreground">Practice cues</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Breathe nasal and quiet; feel low belly rise.</li>
            <li>• Exhale ends softly—don't squeeze empty.</li>
            <li>• Shoulders stay down; jaw unclenched.</li>
          </ul>
        </section>

        <section className="space-y-4 rounded-[40px] bg-card p-8 shadow-[0_25px_80px_rgba(255,170,130,0.2)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
          <h2 className="text-2xl font-semibold text-card-foreground">How long?</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Quick reset: 1–2 minutes (4–8 cycles).</li>
            <li>• Deeper shift: 3–5 minutes.</li>
            <li>• Training effect (HRV focus): 5–10 minutes at an easy, equal in/out pace.</li>
          </ul>
          <p className="mt-4 text-sm text-muted-foreground">
            Full cycle duration at 4‑4‑4‑4: ~16 s (≈3.75 bpm).
          </p>
        </section>

        <section className="rounded-[32px] bg-card p-6 shadow-[0_25px_60px_rgba(255,170,130,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.3)]">
          <h2 className="text-2xl font-semibold text-card-foreground mb-4">Best moments</h2>
          <p className="text-muted-foreground">
            Before events • between tasks • post‑conflict • bedtime wind‑down • in‑flight
          </p>
        </section>

        <section className="space-y-4 rounded-[40px] bg-card p-8 shadow-[0_25px_80px_rgba(255,170,130,0.2)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
          <h2 className="text-2xl font-semibold text-card-foreground">Why it works</h2>
          <ul className="space-y-2 text-muted-foreground">
            <li>• Slow breathing can increase vagally mediated HRV during sessions.</li>
            <li>• Exhale‑emphasized or 0.1 Hz pacing often feels calmer within minutes.</li>
            <li>• Consistency matters; short daily sessions beat rare long ones.</li>
          </ul>
          {/* <p className="mt-4">
            <Link href="/evidence" className="text-sm font-semibold text-primary underline-offset-2 hover:underline">
              How we evaluate the research
            </Link>
          </p> */}
        </section>

        <section className="space-y-4 rounded-[40px] bg-card p-8 shadow-[0_25px_80px_rgba(255,170,130,0.2)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
          <h2 className="text-2xl font-semibold text-card-foreground">FAQ</h2>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-2xl bg-muted p-4">
                <summary className="cursor-pointer text-lg font-medium text-foreground">{faq.question}</summary>
                <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
      <footer className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="mb-4 text-xs text-muted-foreground">
          Stop if dizzy, tingly, or chest‑tight. Resume later with shorter, easier breaths. Skip prolonged holds during pregnancy or if advised by your clinician.
        </p>
        <p className="text-xs text-muted-foreground">
          Keyboard controls and screen‑reader labels available in Settings. Created by{" "}
          <span className="underline">
            <a
              href="https://abiassi.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Abiassi
            </a>
          </span>
          {" + "}
          <span className="underline">
            <a
              href="https://darkmatter.is/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Darkmatter AI Labs
            </a>
          </span>
        </p>
      </footer>
    </main>
  );
}
