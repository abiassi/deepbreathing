/**
 * Sound guide: a breath-shaped voice that makes every phase legible with eyes
 * closed.
 *
 * The legacy cues are 0.3 s blips at phase boundaries. Between two blips the
 * sound does not change, so a listener cannot tell an inhale from an exhale,
 * or how much of the phase is left. The sound guide plays for the whole phase.
 *
 * One number drives it: how full the breath is.
 *
 * - Inhale fills. A low, warm note gets louder and rounder, and a second note
 *   joins above it. Everything reaches its peak on the last moment.
 * - Exhale empties. It is the inhale played backwards.
 * - A hold stands still: one level, nothing moves.
 * - Marker: two soft notes going up start an inhale, two going down start an
 *   exhale, and one bell starts a hold.
 *
 * Nothing glides and nothing sweeps. The first version used a pure sine that
 * rose from 330 to 494 Hz while it swelled, under a noise band that swept
 * from 450 to 1900 Hz. Listeners heard a mosquito and a zoom. The fill is now
 * carried by body: notes an octave lower, each with two soft harmonics, under
 * a lowpass that stays below 1.2 kHz.
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
  /** Peak gain of the root note at the default cue volume. */
  toneGain: number;
  /** Tone lowpass in Hz: closed at rest, open at the top of the breath. */
  toneLowpassHz: readonly [closed: number, open: number];
  /**
   * Peak gain of the air layer on the inhale and on the exhale. 0 on both
   * leaves the layer out: the mode then has no noise in its voice at all.
   */
  airInhaleGain: number;
  airExhaleGain: number;
  /** Bandpass centre of the air layer in Hz. Fixed: the band never sweeps. */
  airBandHz: number;
  airQ: number;
  /** Tone level kept through a hold, as a fraction of the peak. */
  holdInLevel: number;
  holdOutLevel: number;
  /** Peak gain of the phase marker. */
  chimeGain: number;
}

const BASE_PROFILE: SoundGuideProfile = {
  toneGain: 0.18,
  toneLowpassHz: [420, 1150],
  airInhaleGain: 0,
  airExhaleGain: 0,
  airBandHz: 420,
  airQ: 0.8,
  holdInLevel: 0.72,
  holdOutLevel: 0.18,
  chimeGain: 0.07,
};

/**
 * One instrument, one articulation per mode. Each entry changes only what the
 * technique asks for; everything else stays on the base profile.
 */
const MODE_PROFILES: Partial<Record<ModeName, Partial<SoundGuideProfile>>> = {
  // The tone gains differ only to land every mode at the same loudness
  // (-19.5 LUFS with the bed): short phases and low roots measure louder.
  [ModeName.Box]: { toneGain: 0.17 },
  // 4-7-8: a long, quieter hold.
  [ModeName.Relax]: { toneGain: 0.19, holdInLevel: 0.6 },
  [ModeName.Coherent]: { toneGain: 0.19 },
  [ModeName.Sigh]: { toneGain: 0.15 },
  // Ujjayi: the technique is a throat sound, so this mode alone keeps a faint,
  // dark breath of air under the tone. It does not sweep.
  [ModeName.Ujjayi]: { toneGain: 0.15, airInhaleGain: 0.05, airExhaleGain: 0.065 },
  // Belly: darker.
  [ModeName.Belly]: { toneGain: 0.17, toneLowpassHz: [360, 850] },
  [ModeName.PursedLip]: { toneGain: 0.145 },
};

export function soundGuideProfileFor(mode: ModeName): SoundGuideProfile {
  return { ...BASE_PROFILE, ...MODE_PROFILES[mode] };
}

/**
 * Lowest note of the ladder, moved by octaves into 123-247 Hz. That is a low,
 * comfortable register. A phone speaker does not play the fundamental; it
 * plays the note's second and third harmonic, at 247-741 Hz.
 */
export function ladderBaseHz(rootHz: number): number {
  let base = Math.max(20, rootHz);
  while (base < 123.5) base *= 2;
  while (base >= 247) base /= 2;
  return base;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

export interface GuideState {
  /** Ladder position, 0..2: how far the notes above the root have joined. */
  position: number;
  /** Tone level, 0..1 of the peak. Also how full the breath sounds. */
  level: number;
  /** Air gain before volume. */
  air: number;
}

export const GUIDE_REST: GuideState = { position: 0, level: 0, air: 0 };

export interface Breakpoint {
  /** Seconds from the phase start. */
  at: number;
  value: number;
}

export interface GuideMarker {
  /** Ladder notes, in the order they sound. Two notes make a rising or a falling pair. */
  notes: LadderIndex[];
  /** True for the hold bell: one note with a longer tail. */
  bell: boolean;
  gain: number;
  decaySeconds: number;
  /** Seconds between the two notes of a pair. */
  gapSeconds: number;
}

export interface GuidePhasePlan {
  duration: number;
  /** Gain curve of each ladder note: root, fifth, octave. */
  notes: readonly [Breakpoint[], Breakpoint[], Breakpoint[]];
  toneLowpassHz: Breakpoint[];
  airGain: Breakpoint[];
  marker: GuideMarker;
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
/**
 * Progress of a fill or an emptying. Close to a straight line, so the sound
 * keeps moving for the whole phase and its position tells how much is left.
 * The ends are eased a little so a turn is not a corner.
 */
const travel = (progress: number) => {
  const x = clamp01(progress);
  return 0.8 * x + 0.2 * smooth(x);
};
/**
 * Quietest level a moving voice is planned from: 15 dB under the peak. Lower,
 * and the first half of an inhale sits under the ambient bed.
 */
const LEVEL_FLOOR = 0.18;
/**
 * Level between two levels, even in decibels. An even change in gain sounds
 * like a jump at the quiet end and like nothing at the loud end.
 */
const levelBetween = (from: number, to: number, amount: number) => {
  const low = Math.max(from, LEVEL_FLOOR);
  const high = Math.max(to, LEVEL_FLOOR);
  return low * (high / low) ** clamp01(amount);
};
/**
 * Share of each ladder note at a ladder position. The root always sounds. The
 * fifth joins between positions 0 and 1, the octave between 1 and 2. A note
 * that joins adds body; no note ever replaces the root, so the voice never
 * thins out as it rises.
 */
const NOTE_LEVELS: readonly [number, number, number] = [1, 0.72, 0.5];
const noteWeight = (position: number, index: number) =>
  index === 0 ? NOTE_LEVELS[0] : NOTE_LEVELS[index] * Math.sin((Math.PI / 2) * clamp01(position - (index - 1)));

const MIN_PHASE_SECONDS = 0.4;
/** Level a first inhale stops at when a top-up follows. The orb stops at 75 %. */
const TOP_UP_SHELF = 0.62;
/** The second sip starts from a short dip, so it is heard as a new fill. */
const TOP_UP_DIP = 0.16;

interface PhaseShape {
  /** Ladder position at phase progress 0..1. */
  position(progress: number): number;
  /** Tone level at phase progress 0..1. */
  level(progress: number): number;
  /** Air gain as a fraction of the profile's inhale or exhale gain. */
  air(progress: number): number;
  airGain: number;
  marker: GuideMarker;
}

function shapeFor(request: GuidePhaseRequest): PhaseShape {
  const { kind, from, profile } = request;
  const duration = Math.max(MIN_PHASE_SECONDS, request.durationSeconds);
  const startPosition = Math.min(2, Math.max(0, from.position));
  const startLevel = clamp01(from.level);
  // A short phase gets a short, quiet marker so fast techniques do not clang.
  const brisk = duration < 1.2;
  const markerScale = brisk ? 0.6 : 1;
  const nearest = (position: number): LadderIndex => (position < 0.5 ? 0 : position < 1.5 ? 1 : 2);
  const startNote = nearest(startPosition);
  const pair = (notes: LadderIndex[], gain: number): GuideMarker => ({
    notes,
    bell: false,
    gain: profile.chimeGain * gain * markerScale,
    decaySeconds: brisk ? 0.24 : 0.38,
    gapSeconds: brisk ? 0.09 : 0.13,
  });
  const bell = (note: LadderIndex, gain: number): GuideMarker => ({
    notes: [note],
    bell: true,
    gain: profile.chimeGain * gain * markerScale,
    decaySeconds: brisk ? 0.5 : 1.1,
    gapSeconds: 0,
  });
  // A voice that starts below the floor (the first breath of a session) joins
  // the planned curve over the first tenth of the phase.
  const joinFrom = (planned: number, progress: number) => lerp(startLevel, planned, smooth(progress / 0.1));

  switch (kind) {
    case 'inhale': {
      const peak = request.topUpFollows ? TOP_UP_SHELF : 1;
      return {
        position: (p) => lerp(startPosition, 1, travel(p)),
        level: (p) => joinFrom(levelBetween(startLevel, peak, travel(p)), p),
        air: (p) => travel(p),
        airGain: profile.airInhaleGain * (request.topUpFollows ? 0.7 : 1),
        // Quiet: the voice is at its softest here.
        marker: pair([0, 1], 0.6),
      };
    }
    case 'inhaleTopUp': {
      // A short dip, then a second fill one step higher: two distinct sips.
      const dip = Math.max(LEVEL_FLOOR, startLevel * 0.5);
      const refill = (p: number) => clamp01((p - TOP_UP_DIP) / (1 - TOP_UP_DIP));
      return {
        position: (p) => lerp(startPosition, 2, travel(refill(p))),
        level: (p) =>
          p < TOP_UP_DIP ? lerp(startLevel, dip, smooth(p / TOP_UP_DIP)) : levelBetween(dip, 1, travel(refill(p))),
        air: (p) => (p < TOP_UP_DIP ? 0.3 : lerp(0.3, 1, travel(refill(p)))),
        airGain: profile.airInhaleGain,
        marker: pair([1, 2], 0.75),
      };
    }
    case 'holdIn': {
      const settle = Math.min(0.3, 0.9 / duration);
      return {
        position: () => startPosition,
        level: (p) => lerp(startLevel, Math.min(startLevel, profile.holdInLevel), smooth(p / settle)),
        air: () => 0,
        airGain: profile.airInhaleGain,
        marker: bell(startNote === 0 ? 1 : startNote, 0.8),
      };
    }
    case 'exhale': {
      // The inhale backwards: full at the first moment, then falling for the whole phase.
      return {
        position: (p) => lerp(startPosition, 0, travel(p)),
        level: (p) =>
          levelBetween(startLevel, profile.holdOutLevel, travel(p)) * (startLevel < LEVEL_FLOOR ? startLevel / LEVEL_FLOOR : 1),
        air: (p) => 1 - travel(p),
        airGain: profile.airExhaleGain,
        marker: pair([startNote === 0 ? 1 : startNote, 0], 0.8),
      };
    }
    case 'holdOut': {
      return {
        position: () => startPosition,
        level: (p) => lerp(startLevel, Math.min(startLevel, profile.holdOutLevel), smooth(p / 0.3)),
        air: () => 0,
        airGain: profile.airExhaleGain,
        marker: bell(0, 0.55),
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
  const steps = Math.min(40, Math.max(6, Math.ceil(duration / 0.1)));

  const notes: [Breakpoint[], Breakpoint[], Breakpoint[]] = [[], [], []];
  const toneLowpassHz: Breakpoint[] = [];
  const airGain: Breakpoint[] = [];
  const states: GuidePhasePlan['states'] = [];
  // Air joins the new shape over a short blend, so its curve does not step.
  const blendSeconds = Math.min(0.3, duration * 0.25);

  for (let step = 0; step <= steps; step += 1) {
    const progress = step / steps;
    const at = progress * duration;
    const position = shape.position(progress);
    const level = clamp01(shape.level(progress));
    const air = lerp(request.from.air, shape.airGain * clamp01(shape.air(progress)), smooth(at / blendSeconds));
    notes.forEach((curve, index) => {
      curve.push({ at, value: profile.toneGain * level * noteWeight(position, index) });
    });
    toneLowpassHz.push({ at, value: lerp(profile.toneLowpassHz[0], profile.toneLowpassHz[1], level) });
    airGain.push({ at, value: air });
    states.push({ at, position, level, air });
  }

  return { duration, notes, toneLowpassHz, airGain, marker: shape.marker, states };
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
/** The air layer of the first version reached 3.2 kHz and was heard as a whoosh. */
const AIR_CEILING_HZ = 900;
/**
 * Second sine of the root, 4 cents sharp, for a slow shimmer. Its level
 * bounds the depth: 0.1 against 0.8 moves the note by 2.2 dB at 0.3-0.6 Hz,
 * little enough for a hold to sound still.
 */
const CHORUS_RATIO = 2 ** (4 / 1200);
/**
 * One ladder note: a sine and two soft harmonics that give it body. The
 * harmonics sit under the tone lowpass, so they are faint while the breath is
 * empty and come forward as it fills. They are also what a small speaker
 * plays of the voice. At half these levels the voice measured 7 dB less
 * narrow-tone energy above 400 Hz, but in the drone modes its rise and fall
 * could no longer be read above 250 Hz (Box inhale +3.7 dB against +9.3 dB).
 */
const NOTE_PARTIALS: ReadonlyArray<{ ratio: number; level: number }> = [
  { ratio: 1, level: 0.8 },
  { ratio: 2, level: 0.42 },
  { ratio: 3, level: 0.2 },
];
const ROOT_TWIN_LEVEL = 0.1;
/** The notes that join sit a little to each side: the sound widens as it fills. */
const NOTE_PAN: readonly [number, number, number] = [0, -0.45, 0.45];

/** A bell: the note and a quiet octave. */
const BELL_PARTIALS: ReadonlyArray<{ ratio: number; level: number }> = [
  { ratio: 1, level: 0.86 },
  { ratio: 2, level: 0.14 },
];
/** One note of a marker pair: a plain sine, so two notes read as one gesture. */
const STEP_PARTIALS: ReadonlyArray<{ ratio: number; level: number }> = [{ ratio: 1, level: 1 }];
/** Markers and the closing chord sound one octave above the voice. */
const MARKER_OCTAVE = 2;
/** The closing chord keeps the level it was tuned at, whatever a mode's marker gain is. */
const CLOSING_CHORD_GAIN = 0.106;

export class SoundGuide {
  private readonly context: BaseAudioContext;
  private readonly profile: SoundGuideProfile;
  private readonly volume: () => number;
  private readonly baseHz: number;
  private readonly sources: AudioScheduledSourceNode[] = [];
  private readonly nodes: AudioNode[] = [];
  private readonly noteGains: readonly [GainNode, GainNode, GainNode];
  private readonly toneLowpass: BiquadFilterNode;
  /** Null when the mode's profile has no air. */
  private readonly airGain: GainNode | null = null;
  /** When the voice oscillators started. Markers start in phase with them. */
  private readonly voiceStart: number;
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

    this.voiceStart = now;
    const makeNote = (ratio: number, index: number): GainNode => {
      const gain = this.track(context.createGain());
      gain.gain.setValueAtTime(0, now);
      const pan = NOTE_PAN[index];
      if (pan !== 0 && typeof context.createStereoPanner === 'function') {
        const panner = this.track(context.createStereoPanner());
        panner.pan.value = pan;
        gain.connect(panner);
        panner.connect(this.toneLowpass);
      } else {
        gain.connect(this.toneLowpass);
      }
      const frequency = this.baseHz * ratio;
      const partials = index === 0 ? [...NOTE_PARTIALS, { ratio: CHORUS_RATIO, level: ROOT_TWIN_LEVEL }] : NOTE_PARTIALS;
      partials.forEach((partial) => {
        const oscillator = context.createOscillator();
        const level = this.track(context.createGain());
        oscillator.type = 'sine';
        oscillator.frequency.value = frequency * partial.ratio;
        level.gain.value = partial.level;
        oscillator.connect(level);
        level.connect(gain);
        oscillator.start(now);
        this.sources.push(oscillator);
      });
      return gain;
    };
    this.noteGains = [makeNote(LADDER_RATIOS[0], 0), makeNote(LADDER_RATIOS[1], 1), makeNote(LADDER_RATIOS[2], 2)];

    if (this.profile.airInhaleGain > 0 || this.profile.airExhaleGain > 0) {
      const noise = context.createBufferSource();
      noise.buffer = options.noiseBuffer;
      noise.loop = true;
      const airBand = this.track(context.createBiquadFilter());
      airBand.type = 'bandpass';
      airBand.Q.value = this.profile.airQ;
      airBand.frequency.value = this.profile.airBandHz;
      const airCeiling = this.track(context.createBiquadFilter());
      airCeiling.type = 'lowpass';
      airCeiling.frequency.value = AIR_CEILING_HZ;
      this.airGain = this.track(context.createGain());
      this.airGain.gain.setValueAtTime(0, now);
      noise.connect(airBand);
      airBand.connect(airCeiling);
      airCeiling.connect(this.airGain);
      this.airGain.connect(this.voiceBus);
      noise.start(now);
      this.sources.push(noise);
    }
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
    if (this.airGain) this.schedule(this.airGain.gain, plan.airGain, start, volume);
    this.schedule(this.toneLowpass.frequency, plan.toneLowpassHz, start, 1);
    this.playMarker(plan.marker, start, volume);
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

  /**
   * The next moment at or after `time` when every voice oscillator is back at
   * the phase it started with. The voice partials are multiples of half the
   * root, so that happens every two root periods (8-16 ms). A marker that
   * starts there adds to a voice partial of its own pitch. Started anywhere
   * else it could cancel that partial, and the marker would sound as a dip.
   */
  private inPhaseWithVoice(time: number): number {
    const period = 2 / this.baseHz;
    return this.voiceStart + Math.ceil((time - this.voiceStart) / period - 1e-9) * period;
  }

  private playMarker(marker: GuideMarker, start: number, volume: number) {
    marker.notes.forEach((note, index) => {
      this.playChime({
        hz: this.baseHz * MARKER_OCTAVE * LADDER_RATIOS[note],
        gain: marker.gain * volume,
        decaySeconds: marker.decaySeconds,
        at: this.inPhaseWithVoice(start + index * marker.gapSeconds),
        partials: marker.bell ? BELL_PARTIALS : STEP_PARTIALS,
      });
    });
  }

  private playChime(chime: {
    hz: number;
    gain: number;
    decaySeconds: number;
    at: number;
    partials: ReadonlyArray<{ ratio: number; level: number }>;
  }) {
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

    chime.partials.forEach((partial) => {
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
          // Same notes as the first version: 247-494 Hz for the root.
          hz: this.baseHz * MARKER_OCTAVE * note.ratio,
          gain: CLOSING_CHORD_GAIN * note.gain * volume,
          decaySeconds,
          at: now + note.delay,
          partials: BELL_PARTIALS,
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
