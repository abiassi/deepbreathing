# Expo Breathing Visualizer Plan (v1)

## Goals and scope
- New Expo managed app focused on the breathing visualizer only.
- Modes: Box, 4-7-8 Relax, Coherent.
- Audio uses pre-recorded loops and short cues.
- Account/login later (not in v1).
- Keep UI dumb by isolating session logic in hooks and services.

## Critical notes (feedback folded in)
- expo-av audio APIs are deprecated; use expo-audio.
- Verify the exact expo-audio API in the target Expo SDK before coding.
- create-expo-app does not always include expo-router by default; pick a router template explicitly.
- setTimeout-driven phase transitions can drift; use wall-clock timing or reschedule based on expected end times.
- Pause on background in v1 (no background audio/session yet).

## Recommended v1 stack
- Expo managed (CNG) + TypeScript.
- expo-router (single screen now, scales later).
- react-native-reanimated for orb scaling.
- expo-audio for ambient loop + cues.
- expo-haptics for phase-change haptics.
- @react-native-async-storage/async-storage for persistence.
- @react-native-community/slider for speed control.
- expo-keep-awake optional (only while running).

## Reference sources in current web app
- src/components/resonance/types.ts
- src/components/resonance/constants.ts
- src/components/resonance/Resonance.tsx
- src/components/resonance/components/Visualizer.tsx

## Core model (shared, no RN imports)
Files:
- src/breathing/types.ts
- src/breathing/patterns.ts

Types:
- ModeName: "Box Breathing", "4-7-8 Relax", "Coherent Breathing"
- BreathingPhase: Ready, Inhale, HoldIn, Exhale, HoldOut
- BreathingPattern: inhale, holdIn, exhale, holdOut (seconds) + color

Patterns:
- Box: 4 / 4 / 4 / 4, color #e11d48
- Relax: 4 / 7 / 8 / 0, color #4f46e5
- Coherent: 5.5 / 0 / 5.5 / 0, color #059669
- speed: min 0.5, max 2.0, default 1.0

## Breathing engine hook
File:
- src/breathing/useBreathingSession.ts

Inputs:
- mode, speedMultiplier, selectedDurationSec, muted

Outputs:
- state: phase, isRunning, sessionSeconds, themeColor
- actions: start(), pause(), resume(), stop()
- animation: scaleSharedValue (Reanimated)

State machine (v1):
- Ready -> Inhale -> HoldIn (if > 0) -> Exhale -> HoldOut (if > 0) -> Inhale ...

Timing approach:
- Use setTimeout for phase transitions.
- Track phaseStartMs and expectedEndMs to avoid drift.
- Use a 1s interval for sessionSeconds, or derive from Date.now.

Animation:
- Inhale: scale 0 -> 1 withTiming(duration).
- Hold: keep constant.
- Exhale: scale 1 -> 0 withTiming(duration).

Rules:
- Changing mode while running: stop(), then switch mode.
- Changing speed while running: apply next phase (v1).
- App background/inactive: pause() (v1).

## Audio (expo-audio)
File:
- src/breathing/useBreathingAudio.ts

Behavior:
- One ambient loop per mode.
- Three cues: inhale, exhale, hold.
- On start: play ambient loop for mode (looping on).
- On phase change: seek cue to 0 then play.
- On stop: pause/unload ambient and cues.
- Respect muted in all cases.

Notes:
- expo-audio does not auto-reset playback position; always seek before re-play.
- Confirm audio session configuration in the target SDK.
- Disable mic permission if any config plugin requests it.

Assets:
- assets/audio/loops/box_loop.mp3
- assets/audio/loops/relax_loop.mp3
- assets/audio/loops/coherent_loop.mp3
- assets/audio/cues/inhale.wav
- assets/audio/cues/exhale.wav
- assets/audio/cues/hold.wav

## Haptics
File:
- src/breathing/useBreathingHaptics.ts

Mappings:
- Inhale: light impact.
- Hold: double-tap (two impacts with short delay).
- Exhale: heavy impact.

## Persistence (AsyncStorage)
File:
- src/breathing/storage.ts

Persist:
- last mode
- speedMultiplier
- selectedDurationSec
- muted
- optional: totalMinutes

## UI (single screen)
File:
- app/index.tsx (expo-router)

Layout:
- Top: mode selector (3 buttons).
- Center: orb visual + phase label.
- Bottom: start/pause/resume, stop, duration chips (Off/1/3/5/10), speed slider, mute.

Accessibility:
- Button labels for start/pause/stop.
- Support large text and minimum touch sizes.

## App lifecycle
- Use AppState to pause when backgrounded.
- Optional: enable keep-awake during running sessions only.

## Setup and config
- Use create-expo-app with a router template.
- Configure app.json/app.config.js early:
  - ios.bundleIdentifier
  - android.package
  - name, icons, splash
- Add reanimated babel plugin if required by the chosen template.

## QA checklist (v1)
- start/pause/resume/stop
- duration auto-stop
- mode change while running
- speed change mid-session
- mute toggle mid-session
- background pause
- no timer drift over 5-10 minutes

## Native ideas (later)
- Notifications and daily reminders.
- Widgets / Live Activities.
- HealthKit / Google Fit minutes.
- Watch companion quick sessions.
- Voice prompts and accessibility enhancements.

## Open questions
- Styling system: NativeWind vs StyleSheet vs Tamagui?
- Visuals: Reanimated-only gradients vs Skia vs Lottie?
- Audio assets: do you have loops/cues or should we stub placeholders?
