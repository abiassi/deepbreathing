# Borrowable Features from `deep-breathing-v2`

Notes captured from `/Users/abi/Sites/deep-breathing-v2` so we can port upgrades incrementally. Each section lists what the feature does, where to study it, and concrete steps to replicate in this project.

---

## 1. Pattern Library & Settings Drawer
- **What**: Multiple breathing presets (Box, 4‑7‑8, Coherent) defined via metadata, surfaced in a slide-in settings drawer with pace slider, audio toggles, and Zen mode toggle.
- **References**: `deep-breathing-v2/components/BreathingVisualizer.tsx:10-175, 242-421`
- **Adoption steps**:
  1. Create a `PATTERNS` map with shared phase definitions and instructions.
  2. Lift local state for `mode`, `baseDuration`, `isSidebarOpen`, `isZenMode`.
  3. Implement drawer UI (Headless UI or custom) triggered by settings button; include pace slider + preset buttons.
  4. Persist selected mode and base duration via our storage helper.

## 2. Smart Intention Personalization
- **What**: Textarea where user describes their current state; Gemini chooses mode, duration, color, and plays a spoken intro before starting session.
- **References**: `deep-breathing-v2/components/BreathingVisualizer.tsx:70-147`
- **Adoption steps**:
  1. Add intention state (`intentionText`, `isProcessingIntention`, `intentionFeedback`).
  2. Wire Gemini call (or placeholder) that returns `{ mode, baseDuration, themeColor, introMessage }`.
  3. Update UI/theme state and optionally trigger session start once the synthesized intro finishes.
  4. Provide graceful error handling + disabled button states for clarity.

## 3. Audio Engine & Generative Ambient Track
- **What**: Consolidated hook manages mute state, cue volume, bell toggles, generative chord playback, and Gemini-powered TTS intro.
- **References**: `deep-breathing-v2/hooks/useAudioEngine.ts:1-289`, `deep-breathing-v2/utils/storage.ts:1-33`
- **Adoption steps**:
  1. Port `useAudioEngine` (trim pieces we don’t need initially) and integrate with existing audio cues.
  2. Expose controls in the settings drawer: master mute, cue slider, bells toggle, ambient music controls.
  3. Persist user preferences in localStorage.
  4. Optional stretch: enable “Generate Ambient Track” to color-sync visuals and audio.

## 4. Sensory Layer: Particles, Background, Haptics
- **What**: Animated gradient blobs, a physics-based particle canvas that responds to inhale/exhale, and navigator vibration cues per phase.
- **References**: `deep-breathing-v2/components/AnimatedBackground.tsx`, `deep-breathing-v2/components/ParticleOverlay.tsx:1-166`, `deep-breathing-v2/components/BreathingVisualizer.tsx:86-175`
- **Adoption steps**:
  1. Add full-screen `AnimatedBackground` component beneath main content.
  2. Overlay `ParticleOverlay` tied to phase label and theme color.
  3. Add `triggerHaptic` helper and call it inside the phase timer effect (opt-in for users who allow vibration).
  4. Ensure reduced-motion users can disable these effects (respect `prefers-reduced-motion` or offer toggle).

## 5. Interaction Model & Accessibility Enhancements
- **What**: Floating controls (Zen toggle, Play/Pause, Settings), keyboard shortcuts (Space = play/pause, M = mute), and session time tracking.
- **References**: `deep-breathing-v2/components/BreathingVisualizer.tsx:183-240, 242-288`
- **Adoption steps**:
  1. Mirror floating control layout so core actions stay centered even as drawer exists.
  2. Add keyboard event listeners for play/pause + mute (respect focusable inputs).
  3. Track cumulative mindful minutes for gentle habit reinforcement (persist via storage).

## 6. Expanded Info Section
- **What**: Below-the-fold marketing/education section with benefits, cues, stats, and FAQ content.
- **References**: `deep-breathing-v2/components/InfoSection.tsx:4-119`
- **Adoption steps**:
  1. Port structure or adapt copy to match our tone, keeping three-card features + two-column practice guide.
  2. Ensure typography tokens match our current tailwind theme.
  3. Update any metadata/OG image copy to reflect richer content once added.

---

### Suggested Implementation Order
1. **Pattern Library & Drawer** – unlocks most other features.
2. **Audio Engine Integration** – required for AI features and better UX.
3. **Smart Intention Personalization** – builds on the settings groundwork.
4. **Sensory Layer (background, particles, haptics)** – visual delight pass.
5. **Accessibility & Shortcuts** – small lift, big impact.
6. **Info Section Refresh** – polish for the marketing surface.

Each step can be shipped independently; keep this doc updated as we port features.
