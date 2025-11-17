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
    <main className="relative overflow-hidden bg-background pb-20">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-0 h-64 bg-[radial-gradient(circle_at_top,_rgba(77,195,255,0.25),_transparent_60%)]" />
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-16 sm:px-6 lg:px-8">
        <JsonLd data={[websiteSchema, faqSchema]} />

        <BreathingVisualizer />

        <section className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Deep breathing exercises</p>
          <h1 className="mt-4 text-balance text-4xl font-semibold text-white sm:text-5xl">
            Calm your nervous system in four steady counts
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted-foreground">
            Press start, follow the expanding orb, and let the guided pacing move you into equilibrium. Built for focus,
            recovery, and high-stress moments when you need an anchor.
          </p>
        </section>

        <section className="grid gap-8 rounded-3xl border border-border/60 bg-card/50 p-8 lg:grid-cols-3">
          <div>
            <p className="text-sm uppercase tracking-wider text-primary">Evidence based</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">Regulate vagal tone</h2>
            <p className="mt-3 text-muted-foreground">
              Box breathing activates the parasympathetic response, settling cortisol spikes and improving heart-rate
              variability within a few cycles.
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wider text-primary">Thoughtful defaults</p>
            <p className="mt-3 text-muted-foreground">
              Accessible labels, keyboard shortcuts, and structured data make the page indexable, shareable, and ready for
              mobile-focused routines.
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-wider text-primary">Personal pace</p>
            <p className="mt-3 text-muted-foreground">
              Choose any cadence between 3–8 seconds per phase. Small adjustments create a noticeable shift in perceived
              stress when practiced consistently.
            </p>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Practice cues</h2>
            <p className="text-muted-foreground">
              Sit upright, rest your tongue on the roof of your mouth, and exhale gently through the nose before the next
              inhale begins. If you feel dizzy, shorten each phase and return to natural breathing.
            </p>
            <dl className="grid gap-4 rounded-2xl border border-border/70 bg-card/70 p-6 sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Recommended reps</dt>
                <dd className="text-2xl font-semibold text-white">4–8 cycles</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Full cycle duration</dt>
                <dd className="text-2xl font-semibold text-white">16–32s</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Best moments</dt>
                <dd className="text-base text-muted-foreground">Before events, between tasks, bedtime winds-down.</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Accessibility</dt>
                <dd className="text-base text-muted-foreground">Works with keyboard, screen readers, light & dark mode.</dd>
              </div>
            </dl>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">FAQ</h2>
            <div className="space-y-4 rounded-2xl border border-border/70 bg-background/80 p-6">
              {faqs.map((faq) => (
                <details key={faq.question} className="group rounded-xl border border-border/60 bg-card/40 p-4">
                  <summary className="cursor-pointer list-none text-lg font-medium text-white">
                    {faq.question}
                  </summary>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
