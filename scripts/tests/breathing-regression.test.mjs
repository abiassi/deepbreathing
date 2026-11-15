import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const MOBILE = path.join(ROOT, "apps/mobile/src/components/breathing-web");
const DESKTOP = path.join(ROOT, "src/components/resonance");

const read = (p) => fs.readFileSync(path.join(ROOT, p), "utf8");

const sharedPacing = read("packages/domain/src/pacing.ts");

const exp = read("apps/mobile/src/components/breathing-web/BreathingExperience.tsx");
const paceCss = read("apps/mobile/src/components/breathing-web/styles/source.css");
const pb = read("apps/mobile/src/components/breathing-web/components/ParticleBackground.tsx");
const viz = read("apps/mobile/src/components/breathing-web/components/Visualizer.tsx");
const pacing = read("apps/mobile/src/components/breathing-web/pacing.ts");

test("mobile: speed slider — LEFT = slower, RIGHT = faster, default centered", () => {
  assert.match(sharedPacing, /multiplierToSlider = /);
  assert.match(sharedPacing, /sliderToMultiplier = /);
  assert.match(sharedPacing, /SLIDER_MID = 1\.25/, "centered default position value");
  assert.match(sharedPacing, /return m >= 1 \? 2 - 0\.75 \* m : 2\.75 - 1\.5 \* m;/, "left=slow, right=fast map");
  assert.match(sharedPacing, /speedOf = \(multiplier: number\): number => 1 \/ multiplier/, "display speed is the inverse of the duration multiplier");
  assert.match(pacing, /from '@resonance\/domain'/, "mobile pacing re-exports from domain");
  // the slider input uses the mapping and a 0.05 step so the default centers
  assert.match(exp, /const sliderValue = multiplierToSlider\(value\);/);
  assert.match(exp, /value=\{sliderValue\}/);
  assert.match(exp, /onChange=\{\(e\) => \{\s*onInteract\?\.\(\);\s*onChange\(sliderToMultiplier\(parseFloat\(e\.target\.value\)\)\);/s,
    "slider changes still map position back to the shared multiplier");
  assert.match(exp, /step=\{String\(SLIDER_STEP\)\}/);
});

test("mobile: ONE speed measure — no per-phase sliders, no toggle pill", () => {
  assert.match(exp, /const \[speedMultiplier, setSpeedMultiplier\] = useState/);
  assert.doesNotMatch(exp, /paceOpen/, "pace toggle state must not return");
  assert.doesNotMatch(exp, /Adjust breath pace/, "toggle pill button must not return");
  assert.match(exp, /\{isRunning && \(/, "bare slider is limited to active playback");
  assert.match(exp, /<PaceSlider\n\s+value=\{speedMultiplier\}/, "pace panel/slider binds the single measure");
  assert.match(exp, /minimal/, "bare (label-less) slider mode exists");
});

test("mobile: speed scales every phase duration (animation + cues)", () => {
  assert.match(sharedPacing, /phaseDurationMs/);
  assert.match(sharedPacing, /\(pattern\.inhale \* speed\) \* 1000/);
  assert.match(sharedPacing, /\(pattern\.holdIn \* speed\) \* 1000/);
  assert.match(sharedPacing, /\(pattern\.exhale \* speed\) \* 1000/);
  assert.match(sharedPacing, /\(pattern\.holdOut \* speed\) \* 1000/);
  // The animation loop resolves the duration for whichever phase is current,
  // then advances every elapsed boundary from its absolute phase start. This
  // keeps a stalled/suspended frame on the same speed-scaled wall-clock
  // schedule instead of assuming the phase is always Inhale or resetting the
  // anchor to the late frame's `time`.
  assert.match(exp, /phaseDurationMs\(currentPhase, pattern, speedMultiplier\)/,
    "catch-up duration uses the current phase and speed multiplier");
  assert.match(exp, /while \(\s*currentPhaseDuration > 0 &&\s*time - currentPhaseStart >= currentPhaseDuration/s,
    "catch-up walks every elapsed phase boundary");
  assert.match(exp, /currentPhaseStart \+= currentPhaseDuration/,
    "phase boundaries stay anchored to the prior absolute start");
  assert.match(exp, /currentPhase = nextBreathingPhase\(currentPhase, pattern\)/,
    "catch-up follows the pattern's phase order");
  assert.match(exp, /phaseStartRef\.current = currentPhaseStart/,
    "phase clock remains wall-clock anchored after catch-up");
});

test("mobile: live speed change mid-phase is progress-preserving (no orb jump)", () => {
  assert.match(sharedPacing, /remapPhaseStartMs/);
  assert.match(sharedPacing, /progressFraction = Math\.min\(elapsed \/ prevPhaseDurationMs, 1\)/);
  assert.match(sharedPacing, /nowMs - progressFraction \* newDuration/);
  assert.match(exp, /phaseStartRef\.current = remapPhaseStartMs\(/);
});

test("mobile: session clock is WALL-CLOCK — duration never scales with speed", () => {
  assert.match(exp, /sessionClockStartRef\.current = Date\.now\(\) - \(sessionSeconds \* 1000\)/);
  assert.match(exp, /Math\.floor\(\(Date\.now\(\) - sessionClockStartRef\.current\) \/ 1000\)/);
  assert.match(exp, /sessionSeconds >= selectedDuration/);
  const stopLine = exp.split("\n").find((l) => /sessionSeconds >= selectedDuration/.test(l));
  assert.ok(stopLine, "auto-stop condition exists");
  assert.doesNotMatch(stopLine, /speedMultiplier/, "30s stays 30s regardless of pace");
});

test("mobile: particles idle-float — no outward expulsion, no pile, no center rake", () => {
  const idleIdx = pb.indexOf("// Idle: pure float");
  assert.ok(idleIdx >= 0, "idle branch documented");
  const idleBlock = pb.slice(idleIdx, idleIdx + 500);
  assert.match(idleBlock, /targetRadialSpeed = 0/, "idle radial must be 0 (float, not expulsion)");
  assert.match(pb, /prevPhaseRef\.current !== BreathingPhase\.Idle && currentPhase === BreathingPhase\.Idle/);
  assert.match(pb, /pullingBall/);
  assert.doesNotMatch(pb, /ORB_PULL_ACCEL/, "attraction toward the ball must not return");
  assert.match(pb, /orb\.vx \* wake/, "wake-only drag coupling");
});

test("mobile: particle update() signature and call site stay aligned", () => {
  // Regression for the dt/radial/drift argument swap that froze the field.
  const sigIdx = pb.indexOf("update(");
  const sig = pb.slice(sigIdx, sigIdx + 160);
  assert.match(sig, /radialSpeed: number,/, "first param radialSpeed");
  assert.match(sig, /driftSpeed: number,/, "second param driftSpeed");
  assert.match(sig, /deltaTime: number,/, "third param deltaTime");
  assert.match(pb, /p\.update\(smoothedRadialSpeedRef\.current, smoothedDriftSpeedRef\.current, deltaSeconds/,
    "call site passes (radial, drift, deltaSeconds)");
});

test("mobile: play triangle keeps the sharp-desktop geometry with subtle radius", () => {
  assert.match(viz, /points="6 3 20 12 6 21 6 3"/, "raw polygon, immune to lucide bumps");
  assert.match(viz, /strokeLinejoin="round"/, "subtle ~1-unit corner radius");
  assert.doesNotMatch(viz, /from 'lucide-react'[^;]*Play/, "lucide Play import must not return");
});

test("mobile: outer ring follows the ball slowly and returns slower", () => {
  assert.match(exp, /chaseRing/);
  assert.match(exp, /ringTargetRef\.current = \{ x: dx, y: dy \}/, "ring chases the ball while pulled");
  assert.match(exp, /ringTargetRef\.current = \{ x: 0, y: 0 \}/, "ring returns home on release");
  assert.match(exp, /rate = target\.x === 0 && target\.y === 0 \? 2\.2 : 4\.5/, "slower return than follow");
  assert.match(exp, /ringRef=\{ringLayerRef\}/, "ring layer wired into the visualizer");
});

test("mobile: pace slider emits haptic ticks on position change", () => {
  assert.match(exp, /'pace_haptic'/);
  assert.match(exp, /pace_haptic/, "pace_haptic event name appears in BreathingExperience");
  assert.match(exp, /paceHapticLastPosRef/, "tracks last emitted slider position");
  assert.match(exp, /paceHapticLastTimeRef/, "throttles to ~1 per 35 ms");
  assert.match(exp, /SLIDER_STEP/, "step threshold guard present");
  assert.match(exp, /navigator\.vibrate\?\.\(5\)/, "web vibrate fallback (gentle 5ms)");
});

test("mobile: pace bar reveals on start, auto-hides, and unmounts on pause", () => {
  assert.match(exp, /const \[paceBarVisible, setPaceBarVisible\] = useState\(false\)/,
    "bar starts hidden before a session");
  assert.match(exp, /const PACE_BAR_HIDE_DELAY_MS = 5000/,
    "running-session reveal window is five seconds");
  assert.match(exp, /setPaceBarVisible\(false\)/,
    "timeout hides the bar");
  assert.match(exp, /paceBarIsVisible = isRunning && paceBarVisible/,
    "visibility is limited to an actively running session");
  assert.match(exp, /\{isRunning && \(\s*<div\s*data-pace-bar/s,
    "pause, stop, and completion unmount the floating control");
  assert.match(exp, /translate-y-full/, "hidden bar slides fully below the viewport");
  assert.match(exp, /data-pace-bar/, "floating control has a stable smoke-test hook");
  assert.match(exp, /tabIndex=\{visible \? 0 : -1\}/,
    "hidden slider is removed from the tab order");
  assert.match(exp, /aria-hidden=\{visible \? undefined : true\}/,
    "hidden slider is removed from the accessibility tree");
  assert.match(exp, /onPointerDown=\{onInteract\}/, "pointer interaction reveals/resets the bar");
  assert.match(exp, /onFocus=\{onInteract\}/, "keyboard focus reveals/resets the bar");
  assert.match(paceCss, /\.pace-bar\s*\{[^}]*transition:/,
    "bar transition is defined in the source stylesheet");
  assert.match(paceCss, /prefers-reduced-motion:[^}]*\.pace-bar[^}]*transition:\s*none/s,
    "reduced motion removes the bar transition");
});

test("mobile: hidden hold-phase tap reveals pace bar without pausing", () => {
  const clickIdx = exp.indexOf("const handleTogglePlay = useCallback");
  assert.ok(clickIdx >= 0, "orb toggle handler exists");
  const clickBlock = exp.slice(clickIdx, clickIdx + 2200);
  const suppressIdx = clickBlock.indexOf("if (suppressClickRef.current)");
  const revealIdx = clickBlock.indexOf("revealPaceBar(true)");
  assert.ok(suppressIdx >= 0 && revealIdx > suppressIdx,
    "drag click suppression is consumed before the reveal branch");
  assert.match(clickBlock, /isRunning\s*&&\s*!paceBarVisible/,
    "reveal branch only applies to a hidden running bar");
  assert.match(clickBlock, /BreathingPhase\.HoldIn\s*\|\|\s*phase\s*===\s*BreathingPhase\.HoldOut/,
    "hold-phase tap is the reveal cue");
  assert.match(clickBlock, /\n\s*return;\n\s*\}\n\s*const audio/,
    "reveal cue returns before normal pause handling");
});

test("mobile: index.tsx handles pace_haptic with Haptics.selectionAsync", () => {
  const idx = read("apps/mobile/src/app/index.tsx");
  assert.match(idx, /'pace_haptic'/);
  assert.match(idx, /Haptics\.selectionAsync\(\)\.catch/, "dispatches selection haptic for pace ticks");
});

test("mobile: session-progress dot rides the ring with angle math (cos/sin)", () => {
  assert.match(viz, /sessionProgress/, "Visualizer accepts sessionProgress prop");
  assert.match(viz, /Math\.sin\(dotAngle\)/, "dot angle uses sin for x position");
  assert.match(viz, /Math\.cos\(dotAngle\)/, "dot angle uses cos for y position");
  assert.match(viz, /showDot/, "dot visibility gated on showDot");
  assert.match(viz, /Session-progress dot/, "dot element documented inside ring layer");
  assert.match(exp, /setSessionProgress/, "sessionProgress set in animate loop");
  assert.match(exp, /Date\.now\(\) - sessionClockStartRef\.current/, "wall-clock elapsed time");
  assert.match(exp, /selectedDuration/, "progress fraction uses selectedDuration");
  assert.match(exp, /progress=\{0\}/, "progress prop pinned to 0");
});


test("mobile: changing the duration while paused restarts the session clock", () => {
  assert.match(exp, /Changing the session length while a session is PAUSED restarts the clock/, "reset effect documented");
  assert.match(exp, /sessionClockStartRef\.current = 0;/, "clock anchor reset");
  assert.match(exp, /setSessionProgress\(0\);/, "ring dot returns to the top");
  assert.match(exp, /setSessionId\(null\);/, "next start begins a fresh session");
  assert.match(exp, /\}, \[selectedDuration\]\);/, "effect keyed on duration change");
});

test("mobile: persisted presets are committed before writeback is enabled", () => {
  const savedPresetIdx = exp.indexOf("setModePresets(presets)");
  const hydrationCommitIdx = exp.indexOf("if (mounted) storageHydratedRef.current = true;");
  assert.ok(savedPresetIdx >= 0, "initial mode presets are hydrated");
  assert.ok(hydrationCommitIdx > savedPresetIdx,
    "hydration marker is set after saved presets have been enqueued");
  assert.match(exp, /if \(storageHydratedRef\.current\) return;/,
    "initial hydration is one-shot after the committed render");
  assert.match(exp, /if \(!storageHydratedRef\.current\) return;[\s\S]*setModePresets/s,
    "mode preset writeback remains gated on the hydration marker");
});

test("mobile: Dynamic Type scales rem controls at the document root and restores host styles", () => {
  assert.match(exp, /const resolvedFontScale = Math\.min\(2, Math\.max\(1,/,
    "native font scale is clamped");
  assert.match(exp, /typeof document === 'undefined' \|\| resolvedFontScale <= 1/,
    "default scale leaves the host document untouched");
  assert.match(exp, /const root = document\.documentElement/,
    "scale is applied to the rem reference element");
  assert.match(exp, /root\.style\.fontSize = `\$\{resolvedFontScale \* 100\}%`/,
    "rem-based Tailwind controls grow with Dynamic Type");
  assert.match(exp, /const previousFontSize = root\.style\.fontSize/,
    "the host root font size is captured");
  assert.match(exp, /root\.style\.fontSize = previousFontSize/,
    "host root font size is restored on cleanup");
  assert.doesNotMatch(paceCss, /\[data-large-text='true'\]\s*\{\s*font-size:/,
    "a descendant font-size rule must not pretend to scale rem units");
});

test("mobile: Wim Hof completion commits the session exactly once", () => {
  assert.match(exp, /const protocolCompletionHandledRef = useRef\(false\)/,
    "protocol completion has an idempotence guard");
  assert.match(exp, /protocolCompletionHandledRef\.current = false/,
    "new Wim Hof sessions reset the completion guard");
  assert.match(exp, /endSession\('completed', completedSeconds, true\)/,
    "ProtocolComplete calls the shared endSession path");
  assert.equal(
    (exp.match(/endSession\('completed', completedSeconds, true\)/g) ?? []).length,
    1,
    "the protocol completion endSession call is singular",
  );
  assert.match(exp, /if \(!protocolCompletionHandledRef\.current\) \{\s*requestRef\.current = requestAnimationFrame\(animateProtocol\);/s,
    "no animation frame is scheduled after the terminal commit");
  assert.match(exp, /if \(protocolCompletionHandledRef\.current && isProtocolMode\) return;/,
    "duration auto-stop cannot double-commit a completed protocol");
});

const resonance = read("src/components/resonance/Resonance.tsx");
const desktopPb = read("src/components/resonance/components/ParticleBackground.tsx");

test("desktop: single speed slider — LEFT = slower, RIGHT = faster, default centered", () => {
  assert.match(resonance, /const \[speedMultiplier, setSpeedMultiplier\] = useState/);
  assert.match(resonance, /type="range"/);
  assert.match(resonance, /import \{ multiplierToSlider, sliderToMultiplier, speedOf \} from '@resonance\/domain'/,
    "desktop imports slider and display-speed fns from shared domain package");
  assert.match(resonance, /value=\{multiplierToSlider\(speedMultiplier\)\}/);
  assert.match(resonance, /onChange=\{\(e\) => setSpeedMultiplier\(sliderToMultiplier\(parseFloat\(e\.target\.value\)\)\)/);
  assert.match(resonance, /step="0\.05"/, "0.05 step keeps the centered default on-grid");
  assert.match(resonance, /ui\.speed_multiplier.*speedOf\(speedMultiplier\)\.toFixed\(1\)/,
    "desktop displays speedOf so the label preserves slow-left/fast-right semantics");
  assert.match(sharedPacing, /multiplierToSlider = /, "shared source defines multiplierToSlider");
  assert.match(sharedPacing, /sliderToMultiplier = /, "shared source defines sliderToMultiplier");
});

test("desktop: speed scales the animation phases", () => {
  assert.match(resonance, /const inhaleDur = pattern\.inhale \* speedMultiplier \* 1000/);
  assert.match(resonance, /const exhaleDur = pattern\.exhale \* speedMultiplier \* 1000/);
});

test("desktop: session clock is wall-clock", () => {
  assert.match(resonance, /setSessionSeconds\(s => \{\s*const next = s \+ 1;/,
    "timer increments 1s per tick");
  const stopLine = resonance.split("\n").find((l) => /sessionSeconds >= selectedDuration/.test(l));
  assert.ok(stopLine, "auto-stop condition exists");
  assert.doesNotMatch(stopLine, /speedMultiplier/, "30s stays 30s regardless of pace");
});

test("mobile: ParticleBackground respects prefers-reduced-motion", () => {
  assert.match(pb, /matchMedia\('\(prefers-reduced-motion:\s*reduce\)'\)/,
    "ParticleBackground must query prefers-reduced-motion");
  assert.match(pb, /!reducedMotion\s*&&\s*pointer\.active/,
    "interaction field must be gated on reducedMotion");
  assert.match(pb, /if\s*\(!reducedMotion\s*&&\s*orb\s*!=\s*null\)\s*\{/,
    "orb interaction block must be gated on reducedMotion");
  assert.match(pb, /data-reduced-motion/,
    "canvas must set data-reduced-motion attribute");
  assert.match(pb, /reducedMotionRef\.current\s*\?\s*Math\.floor\(baseCount\s*\/\s*2\)/,
    "particle count must be halved when reduced motion is active");
});

test("mobile: ParticleBackground has idle-pause mechanism for battery", () => {
  assert.match(pb, /lastActivityTimeRef/,
    "must track last activity time for idle detection");
  assert.match(pb, /idlePausedRef/,
    "must have an idle-paused flag");
  assert.match(pb, /cancelAnimationFrame/,
    "must cancel animation frames on cleanup");
  assert.match(pb, /BreathingPhase\.Idle\s*&&\s*Date\.now\(\)\s*-\s*lastActivityTimeRef\.current\s*>\s*4000/,
    "must pause rAF when Idle and inactive for ~4s");
  assert.match(pb, /idlePausedRef\.current\s*=\s*false/,
    "must clear idle-paused flag on resume");
  assert.match(pb, /animateRef\.current\s*=\s*animate/,
    "animate function must be stored in a ref for cross-effect restart");
});

test("desktop: particle update() signature and call site stay aligned", () => {
  const sigIdx = desktopPb.indexOf("update(");
  const sig = desktopPb.slice(sigIdx, sigIdx + 160);
  assert.match(sig, /radialSpeed: number,/, "first param radialSpeed");
  assert.match(sig, /driftSpeed: number,/, "second param driftSpeed");
  assert.match(sig, /deltaTime: number,/, "third param deltaTime");
  // Call site spans multiple lines; assert arg order in the call block.
  const callIdx = desktopPb.indexOf("p.update(");
  const call = desktopPb.slice(callIdx, callIdx + 160);
  const first = call.indexOf("smoothedRadialSpeedRef.current");
  const second = call.indexOf("smoothedDriftSpeedRef.current");
  const third = call.indexOf("deltaSeconds");
  assert.ok(first >= 0 && second > first && third > second,
    "call site passes (radial, drift, deltaSeconds) in order");
});
