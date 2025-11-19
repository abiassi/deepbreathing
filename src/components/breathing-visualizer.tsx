"use client";

import Resonance from "@/components/resonance/Resonance";

export function BreathingVisualizer() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  return (
    <section className="relative isolate flex w-full justify-center bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative w-full max-w-6xl">
        <Resonance
          apiKey={apiKey}
          className="min-h-[720px] w-full overflow-hidden rounded-[48px] border border-white/40 bg-white/70 shadow-[0_40px_120px_rgba(15,23,42,0.25)] backdrop-blur-2xl"
        />
      </div>
    </section>
  );
}
