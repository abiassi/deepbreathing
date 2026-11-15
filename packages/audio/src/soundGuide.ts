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
 * The third version makes the same voice less mechanical. Each note is three
 * voices a few cents apart that drift slowly. The fill follows a breath
 * curve: a quick start and a soft settle. The voice and the markers play
 * into a small warm room. No two breaths have exactly the same level.
 *
 * Every phase is scheduled once, at its start, from the known phase length.
 * The schedule uses only setValueAtTime and linearRampToValueAtTime, which
 * react-native-audio-api renders sample-accurately (see AudioPlatformAdapter).
 * A curve is a list of short straight ramps.
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
  chimeGain: 0.095,
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
  /** Level this breath fills to, 0..1 of the peak. Default 1. */
  peakLevel?: number;
  /** Scales the marker gain. Default 1. */
  markerVelocity?: number;
}

const smooth = (amount: number) => {
  const x = clamp01(amount);
  return x * x * x * (x * (x * 6 - 15) + 10);
};
/**
 * Progress of a fill, shaped like a breath in: a quick start, then a soft
 * settle into the peak. Almost half of the curve stays a straight line, so
 * the sound still moves on its last moment and its position tells how much
 * of the phase is left. A curve that goes flat near the top was heard, in
 * the first version, as the same bump on every phase.
 */
const fill = (progress: number) => {
  const x = clamp01(progress);
  return 0.45 * x + 0.55 * (1 - (1 - x) ** 1.8);
};
/** Progress of an emptying: the fill backwards. A soft start, then a quicker fall. */
const empty = (progress: number) => 1 - fill(1 - clamp01(progress));
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
 * How open the tone lowpass is at a level: 0 at the floor and below, 1 at
 * the peak, even in decibels. The filter then opens through the whole inhale
 * and not only near its end.
 */
const opening = (level: number) =>
  level <= LEVEL_FLOOR ? 0 : clamp01(Math.log(level / LEVEL_FLOOR) / Math.log(1 / LEVEL_FLOOR));
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
  const markerScale = (brisk ? 0.6 : 1) * (request.markerVelocity ?? 1);
  const breathPeak = clamp01(request.peakLevel ?? 1);
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
      const peak = (request.topUpFollows ? TOP_UP_SHELF : 1) * breathPeak;
      return {
        position: (p) => lerp(startPosition, 1, fill(p)),
        level: (p) => joinFrom(levelBetween(startLevel, peak, fill(p)), p),
        air: (p) => fill(p),
        airGain: profile.airInhaleGain * (request.topUpFollows ? 0.7 : 1),
        // Quieter than the others: the voice is at its softest here.
        marker: pair([0, 1], 0.7),
      };
    }
    case 'inhaleTopUp': {
      // A short dip, then a second fill one step higher: two distinct sips.
      const dip = Math.max(LEVEL_FLOOR, startLevel * 0.5);
      const refill = (p: number) => clamp01((p - TOP_UP_DIP) / (1 - TOP_UP_DIP));
      return {
        position: (p) => lerp(startPosition, 2, fill(refill(p))),
        level: (p) =>
          p < TOP_UP_DIP ? lerp(startLevel, dip, smooth(p / TOP_UP_DIP)) : levelBetween(dip, breathPeak, fill(refill(p))),
        air: (p) => (p < TOP_UP_DIP ? 0.3 : lerp(0.3, 1, fill(refill(p)))),
        airGain: profile.airInhaleGain,
        marker: pair([1, 2], 0.8),
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
        position: (p) => lerp(startPosition, 0, empty(p)),
        level: (p) =>
          levelBetween(startLevel, profile.holdOutLevel, empty(p)) * (startLevel < LEVEL_FLOOR ? startLevel / LEVEL_FLOOR : 1),
        air: (p) => 1 - empty(p),
        airGain: profile.airExhaleGain,
        // The loudest marker: the voice is at its fullest here.
        marker: pair([startNote === 0 ? 1 : startNote, 0], 1),
      };
    }
    case 'holdOut': {
      return {
        position: () => startPosition,
        level: (p) => lerp(startLevel, Math.min(startLevel, profile.holdOutLevel), smooth(p / 0.3)),
        air: () => 0,
        airGain: profile.airExhaleGain,
        marker: bell(0, 0.6),
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
    const [closedHz, openHz] = profile.toneLowpassHz;
    toneLowpassHz.push({ at, value: closedHz * (openHz / closedHz) ** opening(level) });
    airGain.push({ at, value: air });
    states.push({ at, position, level, air });
  }

  return { duration, notes, toneLowpassHz, airGain, marker: shape.marker, states };
}

/** A small seeded random source (mulberry32). Returns numbers in 0..1. */
function seededRandom(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let mixed = state;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

const ROOM_SECONDS = 1.1;
/** Time for the room to decay by 60 dB. */
const ROOM_DECAY_SECONDS = 0.85;
/** The room's highs die first: its noise is lowpassed from the first value down to the second. */
const ROOM_DAMPING_HZ: readonly [number, number] = [2600, 500];
/** First reflections, per ear: delay in ms and level. They give the room its size. */
const ROOM_REFLECTIONS: readonly [ReadonlyArray<readonly [number, number]>, ReadonlyArray<readonly [number, number]>] = [
  [[9, 0.9], [15, -0.7], [23, 0.55], [32, -0.4], [44, 0.3]],
  [[11, 0.9], [18, -0.7], [26, 0.55], [36, -0.4], [48, 0.3]],
];

/**
 * Impulse response of the guide's room, one array per ear: a few first
 * reflections, then a short, dark tail. It is made from a seeded random
 * source, so every session and every platform gets the same room.
 *
 * The response is scaled to an average gain of 1 between 120 Hz and 1 kHz,
 * where the voice is. Play it with `normalize = false`: the wet level is then
 * set by the send gain alone and does not depend on a platform's own scaling.
 */
export function roomImpulseResponse(sampleRate: number, seed = 0x0d0b): [Float32Array, Float32Array] {
  const random = seededRandom(seed);
  const length = Math.max(1, Math.floor(sampleRate * ROOM_SECONDS));
  const tailStart = Math.floor(sampleRate * 0.05);
  const decayPerSample = Math.log(1000) / (ROOM_DECAY_SECONDS * sampleRate);
  const channels = ROOM_REFLECTIONS.map((reflections) => {
    const data = new Float32Array(length);
    let lowpassed = 0;
    for (let index = tailStart; index < length; index += 1) {
      const progress = (index - tailStart) / (length - tailStart);
      const cutoff = ROOM_DAMPING_HZ[0] * (ROOM_DAMPING_HZ[1] / ROOM_DAMPING_HZ[0]) ** progress;
      lowpassed += (1 - Math.exp((-2 * Math.PI * cutoff) / sampleRate)) * (random() * 2 - 1 - lowpassed);
      // The tail fades in over 20 ms, so it does not start as a click.
      const fadeIn = Math.min(1, (index - tailStart) / (sampleRate * 0.02));
      data[index] = lowpassed * fadeIn * Math.exp(-decayPerSample * (index - tailStart)) * (1 - progress) ** 0.5;
    }
    let tailEnergy = 0;
    for (let index = 0; index < length; index += 1) tailEnergy += data[index] * data[index];
    // The reflections carry about a third of the energy of the tail.
    const reflectionScale = Math.sqrt(tailEnergy / 3 / reflections.reduce((sum, [, level]) => sum + level * level, 0));
    reflections.forEach(([milliseconds, level]) => {
      const at = Math.floor((milliseconds / 1000) * sampleRate);
      if (at < length) data[at] += level * reflectionScale;
    });
    return data;
  }) as [Float32Array, Float32Array];

  // Average power gain at 16 frequencies between 120 Hz and 1 kHz, both ears.
  let power = 0;
  const probes = 16;
  for (let probe = 0; probe < probes; probe += 1) {
    const step = (2 * Math.PI * 120 * (1000 / 120) ** (probe / (probes - 1))) / sampleRate;
    const coefficient = 2 * Math.cos(step);
    channels.forEach((data) => {
      // Goertzel: the response of the room at one frequency.
      let previous = 0;
      let beforePrevious = 0;
      for (let index = 0; index < length; index += 1) {
        const current = data[index] + coefficient * previous - beforePrevious;
        beforePrevious = previous;
        previous = current;
      }
      power += previous * previous + beforePrevious * beforePrevious - coefficient * previous * beforePrevious;
    });
  }
  const scale = power > 0 ? 1 / Math.sqrt(power / (probes * channels.length)) : 0;
  channels.forEach((data) => {
    for (let index = 0; index < length; index += 1) data[index] *= scale;
  });
  return channels;
}

export interface SoundGuideOptions {
  context: BaseAudioContext;
  /** Where the guide plays. The engine passes its master gain, so mute applies. */
  output: AudioNode;
  rootHz: number;
  profile: SoundGuideProfile;
  /** Looping noise for the air layer. */
  noiseBuffer: AudioBuffer;
  /** Long shared reverb for the closing chord, or null where the platform has none. */
  reverb: ConvolverNode | null;
  /** The small room of the voice and the markers (see roomImpulseResponse), or null. */
  room: ConvolverNode | null;
  /** Scales every gain; the engine passes cue volume relative to its default. */
  volume: () => number;
  /**
   * Seed of the breath-to-breath variation. The default plays the same
   * sequence in every session, so a recording can be repeated.
   */
  seed?: number;
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
/**
 * How far the voice and the markers sit over the tuned profile gains. The
 * second version was heard as "a bit too low versus the rest". The closing
 * chord does not get this gain: it keeps its level.
 */
const GUIDE_LEAD_GAIN = 1.3;
const REVERB_SEND = 0.2;
const REVERB_LOWPASS_HZ = 2600;
/** Share of the voice and the markers sent to the room. */
const ROOM_SEND = 0.25;
const ROOM_LOWPASS_HZ = 1800;
/** The air layer of the first version reached 3.2 kHz and was heard as a whoosh. */
const AIR_CEILING_HZ = 900;
/**
 * One ladder note is a fundamental and two soft harmonics that give it body.
 * The harmonics sit under the tone lowpass, so they are faint while the
 * breath is empty and come forward as it fills. They are also what a small
 * speaker plays of the voice. At half these levels the voice measured 7 dB
 * less narrow-tone energy above 400 Hz, but in the drone modes its rise and
 * fall could no longer be read above 250 Hz (Box inhale +3.7 dB against
 * +9.3 dB).
 */
const NOTE_PARTIALS: readonly number[] = [0.8, 0.42, 0.2];
/**
 * The notes that join above the root have softer harmonics. Their harmonics
 * are the highest partials of the voice (494 and 741 Hz in Coherent), and
 * the voice is now louder: this keeps the narrow-tone energy above 400 Hz
 * where the second version had it.
 */
const UPPER_NOTE_PARTIALS: readonly number[] = [0.8, 0.3, 0.1];
/**
 * The voices of one note: the centre voice, exactly in tune, and one voice to
 * each side of it. `cents` is the detune under the root; a higher note gets
 * less, so every note beats at about the same slow rate. With the drift, two
 * voices of the root are at most 11 cents apart. The fastest beat is on the
 * third harmonic of the highest note: about 4 Hz for the highest root. That
 * is a slow shimmer, far under a rate that is heard as a buzz.
 *
 * `level` bounds the depth. Two side voices at 0.16 move a note by 2.4 dB up
 * and 3.3 dB down at the very most, when both line up against the centre.
 */
const NOTE_VOICES: ReadonlyArray<{ cents: number; level: number; pan: number }> = [
  { cents: 0, level: 1, pan: 0 },
  { cents: 4.5, level: 0.16, pan: 0.3 },
  { cents: -3.5, level: 0.16, pan: -0.3 },
];
/** How far a side voice wanders from its detune, in cents. It moves to a new place over each phase. */
const VOICE_DRIFT_CENTS = 1.5;
/**
 * Share of the side voices kept through a hold. The voices beat slowly
 * against each other; at full level a held note moved by 2.4 dB, and a hold
 * has to sound still.
 */
const HOLD_CHORUS_LEVEL = 0.4;
const CHORUS_GLIDE_SECONDS = 0.9;
/** A breath fills to between this level and the peak: a spread of 2 dB. */
const BREATH_LEVEL_SPREAD_DB = 2;
/** A marker is up to this much louder or softer than its tuned gain. */
const MARKER_VELOCITY_SPREAD_DB = 1;
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

const decibels = (value: number) => 10 ** (value / 20);

/** One straight move of a value on the audio clock. */
interface Glide {
  from: number;
  to: number;
  start: number;
  seconds: number;
}
const glideAt = (glide: Glide, time: number) =>
  lerp(glide.from, glide.to, glide.seconds > 0 ? clamp01((time - glide.start) / glide.seconds) : 1);

interface DriftingVoice {
  detune: AudioParam;
  /** Detune this voice wanders around, in cents. */
  homeCents: number;
  glide: Glide;
}

export class SoundGuide {
  private readonly context: BaseAudioContext;
  private readonly profile: SoundGuideProfile;
  private readonly volume: () => number;
  private readonly random: () => number;
  private readonly baseHz: number;
  private readonly sources: AudioScheduledSourceNode[] = [];
  private readonly nodes: AudioNode[] = [];
  private readonly noteGains: readonly [GainNode, GainNode, GainNode];
  private readonly driftingVoices: DriftingVoice[] = [];
  /** Level of the side voices of each note. Lower through a hold. */
  private readonly chorusGains: GainNode[] = [];
  private chorusGlide: Glide = { from: 1, to: 1, start: 0, seconds: 0 };
  private readonly toneLowpass: BiquadFilterNode;
  /** Null when the mode's profile has no air. */
  private readonly airGain: GainNode | null = null;
  /** When the voice oscillators started. Markers start in phase with the centre voices. */
  private readonly voiceStart: number;
  /** Tone and air. Fades on release. */
  private readonly voiceBus: GainNode;
  /** Markers. Never faded. */
  private readonly markerBus: GainNode;
  /** The closing chord. Never faded, so it rings out, into the long reverb. */
  private readonly chordBus: GainNode;
  private running: { plan: GuidePhasePlan; start: number; volume: number } | null = null;
  /** Level the current breath fills to. Drawn once per breath, on its first inhale. */
  private breathPeak = 1;
  /** Each shared convolver with this guide's own return path. */
  private readonly returns: Array<{ convolver: ConvolverNode; wetLowpass: BiquadFilterNode }> = [];
  private released = false;

  constructor(options: SoundGuideOptions) {
    const { context, output } = options;
    this.context = context;
    this.profile = options.profile;
    this.volume = options.volume;
    this.random = seededRandom(options.seed ?? 0x5eed);
    this.baseHz = ladderBaseHz(options.rootHz);
    const now = context.currentTime;

    const sendTo = (source: AudioNode, convolver: ConvolverNode | null, amount: number, lowpassHz: number) => {
      if (!convolver) return;
      const send = this.track(context.createGain());
      const wetLowpass = this.track(context.createBiquadFilter());
      send.gain.value = amount;
      wetLowpass.type = 'lowpass';
      wetLowpass.frequency.value = lowpassHz;
      source.connect(send);
      send.connect(convolver);
      convolver.connect(wetLowpass);
      wetLowpass.connect(output);
      this.returns.push({ convolver, wetLowpass });
    };

    // The closing chord keeps the long reverb it was tuned with.
    this.chordBus = this.track(context.createGain());
    this.chordBus.connect(output);
    sendTo(this.chordBus, options.reverb, REVERB_SEND, REVERB_LOWPASS_HZ);

    // The voice and the markers decay into a small room.
    const mix = this.track(context.createGain());
    mix.connect(output);
    sendTo(mix, options.room, ROOM_SEND, ROOM_LOWPASS_HZ);

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

    // One wave holds the note and its harmonics, so one oscillator is one
    // voice and a detune moves every harmonic of that voice together.
    const waveOf = (partials: readonly number[]) =>
      context.createPeriodicWave(new Float32Array(partials.length + 1), new Float32Array([0, ...partials]), {
        disableNormalization: true,
      });
    const rootWave = waveOf(NOTE_PARTIALS);
    const upperWave = waveOf(UPPER_NOTE_PARTIALS);
    this.voiceStart = now;
    const makeNote = (ratio: number, index: number): GainNode => {
      const gain = this.track(context.createGain());
      gain.gain.setValueAtTime(0, now);
      gain.connect(this.toneLowpass);
      const chorus = this.track(context.createGain());
      chorus.gain.setValueAtTime(1, now);
      chorus.connect(gain);
      this.chorusGains.push(chorus);
      NOTE_VOICES.forEach((voice) => {
        const target = voice.cents === 0 ? gain : chorus;
        const oscillator = context.createOscillator();
        const level = this.track(context.createGain());
        oscillator.setPeriodicWave(index === 0 ? rootWave : upperWave);
        oscillator.frequency.value = this.baseHz * ratio;
        level.gain.value = voice.level;
        oscillator.connect(level);
        const pan = Math.max(-1, Math.min(1, NOTE_PAN[index] + voice.pan));
        if (pan !== 0 && typeof context.createStereoPanner === 'function') {
          const panner = this.track(context.createStereoPanner());
          panner.pan.value = pan;
          level.connect(panner);
          panner.connect(target);
        } else {
          level.connect(target);
        }
        if (voice.cents !== 0) {
          const homeCents = voice.cents / Math.sqrt(ratio);
          oscillator.detune.setValueAtTime(homeCents, now);
          this.driftingVoices.push({
            detune: oscillator.detune,
            homeCents,
            glide: { from: homeCents, to: homeCents, start: now, seconds: 0 },
          });
        }
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
    // No two breaths are the same size. The draws come from a seeded source
    // and always in this order, so a session can be repeated exactly.
    if (kind === 'inhale') this.breathPeak = decibels(-BREATH_LEVEL_SPREAD_DB * this.random());
    const markerVelocity = decibels(MARKER_VELOCITY_SPREAD_DB * (this.random() * 2 - 1));
    const plan = planGuidePhase({
      kind,
      durationSeconds: durationSeconds - PHASE_GUARD_SECONDS,
      from,
      profile: this.profile,
      topUpFollows: options.topUpFollows,
      peakLevel: this.breathPeak,
      markerVelocity,
    });
    const volume = this.volume() * GUIDE_LEAD_GAIN;

    plan.notes.forEach((curve, index) => this.schedule(this.noteGains[index].gain, curve, start, volume));
    if (this.airGain) this.schedule(this.airGain.gain, plan.airGain, start, volume);
    this.schedule(this.toneLowpass.frequency, plan.toneLowpassHz, start, 1);
    this.driftVoices(start, plan.duration);
    this.glideChorus(start, kind === 'holdIn' || kind === 'holdOut' ? HOLD_CHORUS_LEVEL : 1, plan.duration);
    this.playMarker(plan.marker, start, volume);
    this.running = { plan, start, volume };
  }

  /** Moves each side voice to a new detune near its home, over the whole phase. */
  private driftVoices(start: number, seconds: number) {
    this.driftingVoices.forEach((voice) => {
      const from = glideAt(voice.glide, start);
      const to = voice.homeCents + VOICE_DRIFT_CENTS * (this.random() * 2 - 1);
      this.schedule(voice.detune, [{ at: 0, value: from }, { at: seconds, value: to }], start, 1);
      voice.glide = { from, to, start, seconds };
    });
  }

  /** Brings the side voices of every note to `level`, early in the phase. */
  private glideChorus(start: number, level: number, phaseSeconds: number) {
    const from = glideAt(this.chorusGlide, start);
    const seconds = Math.min(CHORUS_GLIDE_SECONDS, phaseSeconds * 0.5);
    this.chorusGains.forEach((chorus) => {
      this.schedule(chorus.gain, [{ at: 0, value: from }, { at: seconds, value: level }], start, 1);
    });
    this.chorusGlide = { from, to: level, start, seconds };
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
   * The next moment at or after `time` when every centre voice is back at
   * the phase it started with. The centre partials are multiples of half the
   * root, so that happens every two root periods (8-16 ms). A marker that
   * starts there adds to a voice partial of its own pitch. Started anywhere
   * else it could cancel that partial, and the marker would sound as a dip.
   * The side voices are not locked; they are 16 dB under the centre voice.
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
        bus: this.markerBus,
      });
    });
  }

  private playChime(chime: {
    hz: number;
    gain: number;
    decaySeconds: number;
    at: number;
    partials: ReadonlyArray<{ ratio: number; level: number }>;
    bus: GainNode;
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
    envelope.connect(chime.bus);

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
          bus: this.chordBus,
        });
      });
      tail = Math.max(tail, 0.85 + decaySeconds + 0.2);
    }
    // The reverb tail of the last sound needs a moment to ring out.
    return tail + (this.returns.length > 0 ? 1.2 : 0);
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
    this.returns.forEach(({ convolver, wetLowpass }) => {
      try {
        // Only this guide's return path. The convolvers are shared and cached.
        convolver.disconnect(wetLowpass);
      } catch {
        // Context already closed.
      }
    });
    this.nodes.forEach((node) => {
      try {
        node.disconnect();
      } catch {
        // Context already closed.
      }
    });
  }
}
