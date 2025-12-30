Goal (incl. success criteria):
- Produce a complete document mapping the breathing visualizer logic (3 modes) into an Expo RN app, with pre-recorded audio and future login; include native feature ideas.

Constraints/Assumptions:
- Use existing workspace at /Users/abi/Sites/deepbreathing.
- Network access restricted; request approval if needed.
- Keep ledger short; facts only.

Key decisions:
- Scope starts with breathing visualizer only (3 modes); account/login later.
- Audio uses pre-recorded loops and cues; plan on expo-audio (expo-av deprecated).
- v1 stack: Expo managed + TypeScript + expo-router; reanimated for orb; expo-haptics; AsyncStorage; community slider; optional keep-awake.

State:
- Done: Initialized continuity ledger; inspected project structure; confirmed initial scope/audio approach; captured feedback on expo-audio and v1 stack; drafted v1 plan document.
- Now: Share the document and confirm remaining preferences.
- Next: If approved, scaffold the Expo app and start porting core modules.

Done:
- Created CONTINUITY.md.
- Identified current stack: Next.js 13 app router with Tailwind; main breathing visualizer in src/components/resonance; separate Vite app in resonance---breathing-visualizer.
- Noted RN-incompatible pieces: Web Audio in audioService; canvas-based particle background.
- Confirmed: build new Expo app starting with breathing visualizer (3 modes), pre-recorded audio, login later.
- Reviewed phase/state machine and timing logic in Resonance for reference mapping.
- Noted persistence uses localStorage and haptics uses navigator.vibrate (to map to AsyncStorage/expo-haptics).
- Incorporated feedback on expo-audio deprecation of expo-av and suggested v1 stack.
- Drafted Expo breathing visualizer plan document.

Now:
- Share the document and confirm remaining preferences.

Next:
- If approved, scaffold the Expo app and start porting core modules.

Open questions (UNCONFIRMED if needed):
- Which styling system do you prefer (NativeWind vs StyleSheet vs Tamagui)?
- Preferred visuals approach (Reanimated-only gradients vs Skia vs Lottie)?
- Do you already have audio loop/cue assets or should we stub placeholders?

Working set (files/ids/commands):
- CONTINUITY.md
- src/components/resonance/types.ts
- docs/expo-breathing-visualizer-plan.md
- package.json
- src/components/breathing-visualizer.tsx
- src/components/resonance/Resonance.tsx
- src/components/resonance/components/Visualizer.tsx
- src/components/resonance/components/ParticleBackground.tsx
- src/components/resonance/services/audioService.ts
- src/components/resonance/constants.ts
- resonance---breathing-visualizer/package.json
