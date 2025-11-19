"use client";

import Resonance from "@/components/resonance/Resonance";

export function BreathingVisualizer() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  return (
    <section className="relative isolate flex min-h-screen w-full bg-transparent">
      <div className="relative w-full">
        <Resonance
          apiKey={apiKey}
          className="min-h-screen w-full overflow-hidden"
        />
      </div>
    </section>
  );
}
