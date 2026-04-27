"use client";

import Resonance from "@/components/resonance/Resonance";
import { ModeName } from "@/components/resonance/constants";

export function BreathingVisualizer() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  return (
    <section className="relative isolate flex min-h-[60vh] w-full bg-transparent lg:min-h-screen">
      <div className="relative w-full">
        <Resonance
          apiKey={apiKey}
          className="min-h-[60vh] w-full overflow-hidden lg:min-h-screen"
          defaultMode={ModeName.Box}
        />
      </div>
    </section>
  );
}
