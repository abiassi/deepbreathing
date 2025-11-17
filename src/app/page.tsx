import { BreathingVisualizer } from "@/components/breathing-visualizer";
import { JsonLd } from "@/components/seo/json-ld";

const baseUrl = "https://deepbreathingexercises.com";

const faqs = [
  {
    question: "How long should I practice box breathing?",
    answer: "Start with 2–5 minutes. Once it feels effortless, extend to ten minutes or repeat small sessions throughout the day."
  },
  {
    question: "When is the best time to use this technique?",
    answer: "Use it when you feel stress building. It's especially helpful before presentations, between meetings, prior to bed, or after intense workouts."
  },
  {
    question: "Can I change the timing?",
    answer: "Yes—adjust the slider between 3 and 8 seconds. The goal is control, not speed, so pick a pace that keeps your breathing smooth."
  }
];

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Box Breathing Visualizer",
  url: baseUrl,
  description:
    "Guided 4x4x4x4 breathing visualizer with tactile cues, slider controls, and accessibility-friendly instructions.",
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
  return (
    <main className="relative bg-background h-screen pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(255,166,120,0.35),_transparent_65%)] dark:bg-[radial-gradient(circle_at_top,_rgba(255,166,120,0.15),_transparent_65%)]" />
      <JsonLd data={[websiteSchema, faqSchema]} />
      <BreathingVisualizer />

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16 sm:px-6 lg:px-8">
        <section className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Deep breathing exercises</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold text-foreground sm:text-5xl">
            Calm your nervous system in four steady counts
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted-foreground">
            Press start, follow the expanding orb, and let the guided pacing move you into equilibrium. Built for focus,
            recovery, and high-stress moments when you need an anchor.
          </p>
        </section>

        <section className="grid gap-6 text-left lg:grid-cols-3">
          <div className="rounded-[32px] bg-card p-6 shadow-[0_25px_60px_rgba(255,170,130,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.3)]">
            <p className="text-sm uppercase tracking-wider text-primary">Evidence based</p>
            <h2 className="mt-2 text-2xl font-semibold text-card-foreground">Regulate vagal tone</h2>
            <p className="mt-3 text-muted-foreground">
              Box breathing activates the parasympathetic response, settling cortisol spikes and improving heart-rate
              variability within a few cycles.
            </p>
          </div>
          <div className="rounded-[32px] bg-card p-6 shadow-[0_25px_60px_rgba(255,170,130,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.3)]">
            <p className="text-sm uppercase tracking-wider text-primary">Thoughtful defaults</p>
            <p className="mt-3 text-muted-foreground">
              Accessible labels, keyboard shortcuts, and structured data keep the page lightweight yet indexable.
            </p>
          </div>
          <div className="rounded-[32px] bg-card p-6 shadow-[0_25px_60px_rgba(255,170,130,0.18)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.3)]">
            <p className="text-sm uppercase tracking-wider text-primary">Personal pace</p>
            <p className="mt-3 text-muted-foreground">
              Choose any cadence between 3–8 seconds per phase. Small adjustments create a quick drop in perceived stress.
            </p>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4 rounded-[40px] bg-card p-8 shadow-[0_25px_80px_rgba(255,170,130,0.2)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
            <h2 className="text-2xl font-semibold text-card-foreground">Practice cues</h2>
            <p className="text-muted-foreground">
              Sit upright, rest your tongue on the roof of your mouth, and exhale gently through the nose before the next
              inhale begins. If you feel dizzy, shorten each phase and return to natural breathing.
            </p>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Recommended reps</dt>
                <dd className="text-2xl font-semibold text-card-foreground">4–8 cycles</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Full cycle duration</dt>
                <dd className="text-2xl font-semibold text-card-foreground">16–32s</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Best moments</dt>
                <dd className="text-base text-muted-foreground">Before events, between tasks, bedtime wind-downs.</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Accessibility</dt>
                <dd className="text-base text-muted-foreground">Keyboard, screen readers, and light or dark modes.</dd>
              </div>
            </dl>
          </div>
          <div className="space-y-4 rounded-[40px] bg-card p-8 shadow-[0_25px_80px_rgba(255,170,130,0.2)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.3)]">
            <h2 className="text-2xl font-semibold text-card-foreground">FAQ</h2>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-2xl bg-muted p-4 shadow-inner">
                  <summary className="cursor-pointer list-none text-lg font-medium text-foreground">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
      <footer className="relative z-10 mx-auto w-full max-w-6xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <p className="text-xs text-muted-foreground">
          Created by{" "}
          <a
            href="https://abiassi.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground transition-colors"
          >
            Abiassi
          </a>
        </p>
      </footer>
    </main>
  );
}
