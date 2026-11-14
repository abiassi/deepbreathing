/**
 * Sound guide: a breath-shaped voice that makes every phase legible with eyes
 * closed.
 *
 * The legacy cues are 0.3 s blips at phase boundaries. Between two blips the
 * sound does not change, so a listener cannot tell an inhale from an exhale,
 * or how much of the phase is left. The sound guide plays for the whole phase:
 *
 * - Tone: three notes of the mode's key (root, fifth, octave). An inhale
 *   crossfades upward, an exhale crossfades downward. A hold keeps the note.
 * - Air: band-passed noise that swells and brightens on the inhale, then
 *   falls and darkens on the exhale.
 * - Marker: one soft chime at each phase start, on the note the voice holds.
 *
 * Every phase is scheduled once, at its start, from the known phase length.
 * The schedule uses only setValueAtTime and linearRampToValueAtTime, which
 * react-native-audio-api renders sample-accurately (see AudioPlatformAdapter).
 */
import { ModeName } from './modes';

export type GuidePhaseKind = 'inhale' | 'inhaleTopUp' | 'holdIn' | 'exhale' | 'holdOut';

/** Ladder position: 0 = root, 1 = fifth, 2 = octave. */
type LadderIndex = 0 | 1 | 2;
const LADDER_RATIOS: readonly [number, number, number] = [1, 1.5, 2];

export interface SoundGuideProfile {
  /** Peak gain of the tone at the default cue volume. */
  toneGain: number;
  /** Tone lowpass in Hz: closed at rest, open at the top of the breath. */
  toneLowpassHz: readonly [closed: number, open: number];
  /** Peak gain of the air layer on the inhale and on the exhale. */
  airInhaleGain: number;
  airExhaleGain: number;
  /** Bandpass centre of the air layer in Hz, at the bottom and top of the breath. */
  airBandHz: readonly [low: number, high: number];
  airQ: number;
  /** Tone level kept through a hold, as a fraction of the peak. */
  holdInLevel: number;
  holdOutLevel: number;
  /** Peak gain of the phase marker chime. */
  chimeGain: number;
}

const BASE_PROFILE: SoundGuideProfile = {
  toneGain: 0.15,
  toneLowpassHz: [700, 2400],
  airInhaleGain: 0.16,
  airExhaleGain: 0.2,
  airBandHz: [480, 1800],
  airQ: 0.9,
  holdInLevel: 0.68,
  holdOutLevel: 0.14,
  chimeGain: 0.085,
};

/**
 * One instrument, one articulation per mode. Each entry changes only what the
 * technique asks for; everything else stays on the base profile.
 */
const MODE_PROFILES: Partial<Record<ModeName, Partial<SoundGuideProfile>>> = {
  // Box: four equal sides. Clear tone, little air.
  [ModeName.Box]: { toneGain: 0.135, airInhaleGain: 0.1, airExhaleGain: 0.12 },
  // 4-7-8: a long, quieter hold and an audible mouth exhale.
  [ModeName.Relax]: { toneGain: 0.185, airInhaleGain: 0.18, airExhaleGain: 0.34, airBandHz: [500, 1700], holdInLevel: 0.58 },
  // Coherent: one continuous wave, no holds.
  [ModeName.Coherent]: { toneGain: 0.18, airInhaleGain: 0.24, airExhaleGain: 0.26, airBandHz: [450, 1900] },
  // Physiological sigh: two sips in, then a long audible sigh out.
  [ModeName.Sigh]: { toneGain: 0.13, airInhaleGain: 0.15, airExhaleGain: 0.28, airBandHz: [500, 2100] },
  // Ujjayi: throat friction leads, tone stays behind it.
  [ModeName.Ujjayi]: { toneGain: 0.08, airInhaleGain: 0.28, airExhaleGain: 0.32, airBandHz: [600, 1300], airQ: 1.4 },
  // Belly: darker and lower in the mix, almost no air.
  [ModeName.Belly]: { toneGain: 0.14, toneLowpassHz: [520, 1400], airInhaleGain: 0.09, airExhaleGain: 0.12, airBandHz: [360, 1100] },
  // Pursed lip: a short nasal inhale and a thin, long stream out.
  [ModeName.PursedLip]: { toneGain: 0.115, airInhaleGain: 0.12, airExhaleGain: 0.25, airBandHz: [900, 2200], airQ: 1.8 },
};

export function soundGuideProfileFor(mode: ModeName): SoundGuideProfile {
  return { ...BASE_PROFILE, ...MODE_PROFILES[mode] };
}

/**
 * Lowest note of the ladder. The drone roots sit at 87-165 Hz, below what a
 * phone speaker reproduces, so the ladder moves up by octaves into 247-494 Hz.
 */
export function ladderBaseHz(rootHz: number): number {
  let base = Math.max(20, rootHz);
  while (base < 247) base *= 2;
  while (base >= 494) base /= 2;
  return base;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

export interface GuideState {
  /** Ladder position, 0..2. */
  position: number;
  /** Tone level, 0..1 of the peak. */
  level: number;
  /** Air gain before volume. */
  air: number;
  /** Air band position, 0 = low edge, 1 = high edge. */
  band: number;
}

export const GUIDE_REST: GuideState = { position: 0, level: 0, air: 0, band: 0 };

export interface Breakpoint {
  /** Seconds from the phase start. */
  at: number;
  value: number;
}

export interface GuidePhasePlan {
  duration: number;
  /** Gain curve of each ladder note. */
  notes: readonly [Breakpoint[], Breakpoint[], Breakpoint[]];
  toneLowpassHz: Breakpoint[];
  airGain: Breakpoint[];
  airBandHz: Breakpoint[];
  marker: { ladderIndex: LadderIndex; gain: number; decaySeconds: number };
  /** State at each breakpoint. The next phase starts from the state it interrupts. */
  states: Array<GuideState & { at: number }>;
}

/** State of a plan at `seconds` after its start. Holds the last state past the end. */
export function guideStateAt(plan: Pick<GuidePhasePlan, 'states'>, seconds: number): GuideState {
  const { states } = plan;
  const last = states[states.length - 1];
  if (!last) return GUIDE_REST;
  const next = states.findIndex((state) => state.at >= seconds);
  if (next === -1) return last;
  const after = states[next];
  const before = states[next - 1];
  if (!before || after.at === before.at) return after;
  const amount = (seconds - before.at) / (after.at - before.at);
  return {
    position: lerp(before.position, after.position, amount),
    level: lerp(before.level, after.level, amount),
    air: lerp(before.air, after.air, amount),
    band: lerp(before.band, after.band, amount),
  };
}

export interface GuidePhaseRequest {
  kind: GuidePhaseKind;
  durationSeconds: number;
  from: GuideState;
  profile: SoundGuideProfile;
  /** True when a top-up inhale follows this inhale (physiological sigh). */
  topUpFollows?: boolean;
}

const smooth = (amount: number) => {
  const x = clamp01(amount);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
/** Equal-power weight of one ladder note at a ladder position. */
const noteWeight = (position: number, index: number) =>
  Math.cos((Math.PI / 2) * Math.min(1, Math.abs(position - index)));

const MIN_PHASE_SECONDS = 0.4;
/** Level a first inhale stops at when a top-up follows. The orb stops at 75 %. */
const TOP_UP_SHELF = 0.76;
/** Slow breathing of the tone during a full-lungs hold, so it is not a test tone. */
const HOLD_SWAY_SECONDS = 3.4;
const HOLD_SWAY_DEPTH = 0.07;

interface PhaseShape {
  /** Ladder position at phase progress 0..1. */
  position(progress: number): number;
  /** Tone level at phase progress 0..1 and elapsed seconds. */
  level(progress: number, seconds: number): number;
  /** Air gain as a fraction of the profile's inhale or exhale gain. */
  air(progress: number): number;
  airGain: number;
  /** Air band position, 0 = low edge, 1 = high edge. */
  band(progress: number): number;
  marker: GuidePhasePlan['marker'];
}

function shapeFor(request: GuidePhaseRequest): PhaseShape {
  const { kind, from, profile } = request;
  const duration = Math.max(MIN_PHASE_SECONDS, request.durationSeconds);
  const startPosition = Math.min(2, Math.max(0, from.position));
  const startLevel = clamp01(from.level);
  // A short phase gets a short, quiet marker so fast techniques do not clang.
  const brisk = duration < 1.2;
  const markerScale = brisk ? 0.5 : 1;
  const nearest = (position: number): LadderIndex => (position < 0.5 ? 0 : position < 1.5 ? 1 : 2);

  switch (kind) {
    case 'inhale': {
      const peak = request.topUpFollows ? TOP_UP_SHELF : 1;
      return {
        position: (p) => lerp(startPosition, 1, smooth((p - 0.08) / 0.8)),
        level: (p) => lerp(startLevel, peak, Math.sin((Math.PI / 2) * clamp01(p))),
        air: (p) => Math.sin((Math.PI / 2) * clamp01(p / 0.62)) * (p > 0.62 ? 1 - 0.55 * ((p - 0.62) / 0.38) ** 2 : 1),
        airGain: profile.airInhaleGain * (request.topUpFollows ? 0.85 : 1),
        band: (p) => smooth(p),
        marker: { ladderIndex: 0, gain: profile.chimeGain * markerScale, decaySeconds: brisk ? 0.5 : 1.3 },
      };
    }
    case 'inhaleTopUp': {
      // A short dip, then a second rise one step higher: two distinct sips.
      const dip = Math.min(startLevel, 0.52);
      return {
        position: (p) => lerp(startPosition, 2, smooth((p - 0.1) / 0.75)),
        level: (p) => (p < 0.14 ? lerp(startLevel, dip, p / 0.14) : lerp(dip, 1, Math.sin((Math.PI / 2) * ((p - 0.14) / 0.86)))),
        air: (p) => (p < 0.14 ? lerp(0.4, 0.2, p / 0.14) : lerp(0.2, 1, Math.sin((Math.PI / 2) * ((p - 0.14) / 0.86)))),
        airGain: profile.airInhaleGain,
        band: (p) => lerp(0.6, 1, smooth(p)),
        marker: { ladderIndex: 1, gain: profile.chimeGain * markerScale, decaySeconds: brisk ? 0.5 : 1.1 },
      };
    }
    case 'holdIn': {
      const settle = Math.min(0.35, 1.2 / duration);
      return {
        position: () => startPosition,
        level: (p, seconds) =>
          lerp(startLevel, profile.holdInLevel, smooth(p / settle)) *
          (1 + HOLD_SWAY_DEPTH * Math.sin((2 * Math.PI * seconds) / HOLD_SWAY_SECONDS) * smooth(p / settle)),
        air: (p) => lerp(0.45, 0.07, smooth(p / settle)),
        airGain: profile.airInhaleGain,
        band: () => 1,
        marker: { ladderIndex: nearest(startPosition), gain: profile.chimeGain * 0.5 * markerScale, decaySeconds: 0.8 },
      };
    }
    case 'exhale': {
      // A small lift marks the release, then the tone falls for the whole phase.
      const lift = Math.max(startLevel, 0.9);
      const floor = profile.holdOutLevel;
      return {
        position: (p) => lerp(startPosition, 0, smooth((p - 0.04) / 0.82)),
        level: (p) => (p < 0.1 ? lerp(startLevel, lift, p / 0.1) : lerp(floor, lift, Math.cos((Math.PI / 2) * ((p - 0.1) / 0.9)) ** 1.3)),
        air: (p) => (p < 0.14 ? lerp(0.1, 1, smooth(p / 0.14)) : lerp(0.05, 1, Math.cos((Math.PI / 2) * ((p - 0.14) / 0.86)) ** 1.6)),
        airGain: profile.airExhaleGain,
        band: (p) => 1 - smooth(p),
        marker: { ladderIndex: nearest(startPosition), gain: profile.chimeGain * markerScale, decaySeconds: brisk ? 0.5 : 1.3 },
      };
    }
    case 'holdOut': {
      return {
        position: () => startPosition,
        level: (p) => lerp(startLevel, profile.holdOutLevel * 0.8, smooth(p / 0.5)),
        air: (p) => lerp(0.05, 0.03, clamp01(p)),
        airGain: profile.airExhaleGain,
        band: () => 0,
        marker: { ladderIndex: nearest(startPosition), gain: profile.chimeGain * 0.45 * markerScale, decaySeconds: 0.8 },
      };
    }
    default: {
      const _exhaustive: never = kind;
      return _exhaustive;
    }
  }
}

/** Plans one phase. Pure: no audio nodes, so the palette is testable. */
export function planGuidePhase(request: GuidePhaseRequest): GuidePhasePlan {
  const duration = Math.max(MIN_PHASE_SECONDS, request.durationSeconds);
  const { profile } = request;
  const shape = shapeFor(request);
  const steps = Math.min(48, Math.max(6, Math.ceil(duration / 0.08)));

  const notes: [Breakpoint[], Breakpoint[], Breakpoint[]] = [[], [], []];
  const toneLowpassHz: Breakpoint[] = [];
  const airGain: Breakpoint[] = [];
  const airBandHz: Breakpoint[] = [];
  const states: GuidePhasePlan['states'] = [];
  // Air and band join the new shape over a short blend, so no curve steps.
  const blendSeconds = Math.min(0.3, duration * 0.25);

  for (let step = 0; step <= steps; step += 1) {
    const progress = step / steps;
    const at = progress * duration;
    const joined = smooth(at / blendSeconds);
    const position = shape.position(progress);
    const level = clamp01(shape.level(progress, at));
    const air = lerp(request.from.air, shape.airGain * clamp01(shape.air(progress)), joined);
    const band = lerp(request.from.band, clamp01(shape.band(progress)), joined);
    notes.forEach((curve, index) => {
      curve.push({ at, value: profile.toneGain * level * noteWeight(position, index) });
    });
    toneLowpassHz.push({ at, value: lerp(profile.toneLowpassHz[0], profile.toneLowpassHz[1], level) });
    airGain.push({ at, value: air });
    airBandHz.push({ at, value: lerp(profile.airBandHz[0], profile.airBandHz[1], band) });
    states.push({ at, position, level, air, band });
  }

  return { duration, notes, toneLowpassHz, airGain, airBandHz, marker: shape.marker, states };
}

export interface SoundGuideOptions {
  context: BaseAudioContext;
  /** Where the guide plays. The engine passes its master gain, so mute applies. */
  output: AudioNode;
  rootHz: number;
  profile: SoundGuideProfile;
  /** Looping noise for the air layer. */
  noiseBuffer: AudioBuffer;
  /** Shared reverb, or null where the platform has none. */
  reverb: ConvolverNode | null;
  /** Scales every gain; the engine passes cue volume relative to its default. */
  volume: () => number;
}

const FADE_IN_SECONDS = 0.5;
/**
 * Every phase is scheduled this far ahead of the context clock. The clock a
 * page reads lags the audio thread by a buffer or two; an event stamped "now"
 * is already in the past there, and the param jumps to catch up.
 */
const SCHEDULE_LEAD_SECONDS = 0.03;
/**
 * Every phase finishes its curves this long before its nominal end. The next
 * phase, which starts a frame early or late, then finds each param at rest on
 * its final value, and nothing in flight has to be cancelled.
 */
const PHASE_GUARD_SECONDS = 0.07;
const REVERB_SEND = 0.2;
const REVERB_LOWPASS_HZ = 2600;
const AIR_CEILING_HZ = 3200;
/**
 * Second sine of each note, 3 cents sharp, for a slow shimmer. Its level
 * bounds the depth: 0.16 against 0.76 moves the note by 3.7 dB at 0.6-0.9 Hz.
 * At 0.34 the same pair dipped by 12 dB and read as a tremolo.
 */
const CHORUS_RATIO = 2 ** (3 / 1200);

export class SoundGuide {
  private readonly context: BaseAudioContext;
  private readonly profile: SoundGuideProfile;
  private readonly volume: () => number;
  private readonly baseHz: number;
  private readonly sources: AudioScheduledSourceNode[] = [];
  private readonly nodes: AudioNode[] = [];
  private readonly noteGains: readonly [GainNode, GainNode, GainNode];
  private readonly toneLowpass: BiquadFilterNode;
  private readonly airGain: GainNode;
  private readonly airBand: BiquadFilterNode;
  /** Tone and air. Fades on release. */
  private readonly voiceBus: GainNode;
  /** Markers and the closing chord. Never faded, so the closing chord rings out. */
  private readonly markerBus: GainNode;
  private running: { plan: GuidePhasePlan; start: number; volume: number } | null = null;
  private reverbTail: { reverb: ConvolverNode; wetLowpass: BiquadFilterNode } | null = null;
  private released = false;

  constructor(options: SoundGuideOptions) {
    const { context, output } = options;
    this.context = context;
    this.profile = options.profile;
    this.volume = options.volume;
    this.baseHz = ladderBaseHz(options.rootHz);
    const now = context.currentTime;

    const mix = this.track(context.createGain());
    mix.connect(output);
    if (options.reverb) {
      const send = this.track(context.createGain());
      const wetLowpass = this.track(context.createBiquadFilter());
      send.gain.value = REVERB_SEND;
      wetLowpass.type = 'lowpass';
      wetLowpass.frequency.value = REVERB_LOWPASS_HZ;
      mix.connect(send);
      send.connect(options.reverb);
      options.reverb.connect(wetLowpass);
      wetLowpass.connect(output);
      this.reverbTail = { reverb: options.reverb, wetLowpass };
    }

    this.voiceBus = this.track(context.createGain());
    this.voiceBus.gain.setValueAtTime(0, now);
    this.voiceBus.gain.linearRampToValueAtTime(1, now + FADE_IN_SECONDS);
    this.voiceBus.connect(mix);
    this.markerBus = this.track(context.createGain());
    this.markerBus.connect(mix);

    this.toneLowpass = this.track(context.createBiquadFilter());
    this.toneLowpass.type = 'lowpass';
    this.toneLowpass.Q.value = 0.5;
    this.toneLowpass.frequency.value = this.profile.toneLowpassHz[0];
    this.toneLowpass.connect(this.voiceBus);

    const makeNote = (ratio: number): GainNode => {
      const gain = this.track(context.createGain());
      gain.gain.setValueAtTime(0, now);
      gain.connect(this.toneLowpass);
      const frequency = this.baseHz * ratio;
      // Fundamental, a slightly sharp twin, and a quiet octave for definition.
      const partials: ReadonlyArray<{ hz: number; level: number; type: OscillatorType }> = [
        { hz: frequency, level: 0.76, type: 'sine' },
        { hz: frequency * CHORUS_RATIO, level: 0.16, type: 'sine' },
        { hz: frequency * 2, level: 0.08, type: 'triangle' },
      ];
      partials.forEach((partial) => {
        const oscillator = context.createOscillator();
        const level = this.track(context.createGain());
        oscillator.type = partial.type;
        oscillator.frequency.value = partial.hz;
        level.gain.value = partial.level;
        oscillator.connect(level);
        level.connect(gain);
        oscillator.start(now);
        this.sources.push(oscillator);
      });
      return gain;
    };
    this.noteGains = [makeNote(LADDER_RATIOS[0]), makeNote(LADDER_RATIOS[1]), makeNote(LADDER_RATIOS[2])];

    const noise = context.createBufferSource();
    noise.buffer = options.noiseBuffer;
    noise.loop = true;
    this.airBand = this.track(context.createBiquadFilter());
    this.airBand.type = 'bandpass';
    this.airBand.Q.value = this.profile.airQ;
    this.airBand.frequency.value = this.profile.airBandHz[0];
    const airCeiling = this.track(context.createBiquadFilter());
    airCeiling.type = 'lowpass';
    airCeiling.frequency.value = AIR_CEILING_HZ;
    this.airGain = this.track(context.createGain());
    this.airGain.gain.setValueAtTime(0, now);
    noise.connect(this.airBand);
    this.airBand.connect(airCeiling);
    airCeiling.connect(this.airGain);
    this.airGain.connect(this.voiceBus);
    noise.start(now);
    this.sources.push(noise);
  }

  private track<T extends AudioNode>(node: T): T {
    this.nodes.push(node);
    return node;
  }

  /** Plays one phase for its whole length. Call at the phase start. */
  public playPhase(kind: GuidePhaseKind, durationSeconds: number, options: { topUpFollows?: boolean } = {}) {
    if (this.released) return;
    const start = this.context.currentTime + SCHEDULE_LEAD_SECONDS;
    // Start from where the voice really is. A phase that arrives early, after
    // a speed change, then continues from mid-curve instead of jumping.
    const from = this.running ? guideStateAt(this.running.plan, start - this.running.start) : GUIDE_REST;
    const plan = planGuidePhase({
      kind,
      durationSeconds: durationSeconds - PHASE_GUARD_SECONDS,
      from,
      profile: this.profile,
      topUpFollows: options.topUpFollows,
    });
    const volume = this.volume();

    plan.notes.forEach((curve, index) => this.schedule(this.noteGains[index].gain, curve, start, volume));
    this.schedule(this.airGain.gain, plan.airGain, start, volume);
    this.schedule(this.toneLowpass.frequency, plan.toneLowpassHz, start, 1);
    this.schedule(this.airBand.frequency, plan.airBandHz, start, 1);
    this.playChime({
      hz: this.baseHz * LADDER_RATIOS[plan.marker.ladderIndex] * 2,
      gain: plan.marker.gain * volume,
      decaySeconds: plan.marker.decaySeconds,
      at: start,
    });
    this.running = { plan, start, volume };
  }

  private schedule(param: AudioParam, curve: readonly Breakpoint[], start: number, scale: number) {
    const [first, ...rest] = curve;
    if (!first) return;
    // Normally nothing is in flight (see PHASE_GUARD_SECONDS). After a speed
    // change a ramp can be: hold it in place where the platform can, since a
    // plain cancel steps the param back to that ramp's start.
    if (typeof param.cancelAndHoldAtTime === 'function') param.cancelAndHoldAtTime(start);
    else param.cancelScheduledValues(start);
    param.setValueAtTime(first.value * scale, start);
    rest.forEach((point) => param.linearRampToValueAtTime(point.value * scale, start + point.at));
  }

  private playChime(chime: { hz: number; gain: number; decaySeconds: number; at: number }) {
    if (chime.gain <= 0) return;
    const { context } = this;
    const envelope = context.createGain();
    const attack = 0.018;
    envelope.gain.setValueAtTime(0, chime.at);
    envelope.gain.linearRampToValueAtTime(chime.gain, chime.at + attack);
    // Piecewise-linear decay that approximates an exponential bell tail.
    const end = chime.at + attack + chime.decaySeconds;
    envelope.gain.linearRampToValueAtTime(chime.gain * 0.36, chime.at + attack + chime.decaySeconds * 0.22);
    envelope.gain.linearRampToValueAtTime(chime.gain * 0.11, chime.at + attack + chime.decaySeconds * 0.5);
    envelope.gain.linearRampToValueAtTime(0, end);
    envelope.connect(this.markerBus);

    const partials: ReadonlyArray<{ ratio: number; level: number }> = [
      { ratio: 1, level: 0.86 },
      { ratio: 2, level: 0.14 },
    ];
    partials.forEach((partial) => {
      const oscillator = context.createOscillator();
      const level = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = chime.hz * partial.ratio;
      level.gain.value = partial.level;
      oscillator.connect(level);
      level.connect(envelope);
      oscillator.start(chime.at);
      oscillator.stop(end + 0.05);
    });
  }

  /**
   * Fades the voice out. With `closing`, a resolved root-fifth-octave chord
   * rings over the fade, so a completed session ends on a clear arrival.
   * Returns the seconds until the guide is silent and can be disposed.
   */
  public release(options: { seconds?: number; closing?: boolean } = {}): number {
    if (this.released) return 0;
    this.released = true;
    const seconds = Math.max(0.05, options.seconds ?? 0.5);
    const now = this.context.currentTime;
    // The bus owns the fade. The note and air curves keep running under it:
    // cancelling a ramp in flight would step the param back to the ramp's
    // start. Only the bus fade-in, in a session's first half second, can
    // still be in flight here.
    const busLevel = this.voiceBus.gain.value;
    this.voiceBus.gain.cancelScheduledValues(now);
    this.voiceBus.gain.setValueAtTime(busLevel, now);
    this.voiceBus.gain.linearRampToValueAtTime(0, now + seconds);
    this.sources.forEach((source) => {
      try {
        source.stop(now + seconds + 0.05);
      } catch {
        // Already stopped by an interrupted context.
      }
    });

    let tail = seconds + 0.1;
    if (options.closing) {
      const volume = this.volume();
      const chord: ReadonlyArray<{ ratio: number; delay: number; gain: number }> = [
        { ratio: LADDER_RATIOS[0], delay: 0.15, gain: 1 },
        { ratio: LADDER_RATIOS[1], delay: 0.5, gain: 0.8 },
        { ratio: LADDER_RATIOS[2], delay: 0.85, gain: 0.7 },
      ];
      const decaySeconds = 3;
      chord.forEach((note) => {
        this.playChime({
          hz: this.baseHz * note.ratio,
          gain: this.profile.chimeGain * 1.25 * note.gain * volume,
          decaySeconds,
          at: now + note.delay,
        });
      });
      tail = Math.max(tail, 0.85 + decaySeconds + 0.2);
    }
    // The reverb tail of the last sound needs a moment to ring out.
    return tail + (this.reverbTail ? 1.2 : 0);
  }

  /** Disconnects every node. Call once the time returned by release() has passed. */
  public dispose() {
    this.released = true;
    this.sources.forEach((source) => {
      try {
        source.stop();
      } catch {
        // Already stopped.
      }
    });
    if (this.reverbTail) {
      try {
        // Only this guide's return path. The convolver is shared with the cues.
        this.reverbTail.reverb.disconnect(this.reverbTail.wetLowpass);
      } catch {
        // Context already closed.
      }
    }
    this.nodes.forEach((node) => {
      try {
        node.disconnect();
      } catch {
        // Context already closed.
      }
    });
  }
}
