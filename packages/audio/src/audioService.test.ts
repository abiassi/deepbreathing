import { afterEach, describe, expect, it, vi } from 'vitest';

import { AudioService } from './audioService';
import { ModeName } from './modes';
import {
  GUIDE_REST,
  guideStateAt,
  ladderBaseHz,
  planGuidePhase,
  soundGuideProfileFor,
  type GuidePhaseKind,
  type GuidePhasePlan,
  type GuideState,
} from './soundGuide';

class FakeParam {
  value = 0;

  setValueAtTime(value: number) { this.value = value; return this; }
  linearRampToValueAtTime(value: number) { this.value = value; return this; }
  exponentialRampToValueAtTime(value: number) { this.value = value; return this; }
  setTargetAtTime(value: number) { this.value = value; return this; }
  cancelScheduledValues() { return this; }
}

class FakeNode {
  readonly disconnectCalls: unknown[] = [];
  readonly connections: unknown[] = [];

  constructor(readonly context: FakeContext) {}

  connect(destination: unknown) {
    this.connections.push(destination);
    return destination;
  }

  disconnect(destination?: unknown) {
    this.disconnectCalls.push(destination);
  }
}

class FakeSource extends FakeNode {
  // This is deliberately RNAA-shaped: no addEventListener, only onEnded.
  onEnded: ((event?: unknown) => void) | null = null;
  readonly stopCalls: number[] = [];
  started = false;
  buffer: unknown = null;
  loop = false;

  start(when = 0) {
    this.started = true;
    this.stopCalls.push(when);
  }

  stop(when = 0) {
    this.stopCalls.push(when);
  }
}

class FakeOscillator extends FakeSource {
  readonly frequency = new FakeParam();
  readonly detune = new FakeParam();
  type: OscillatorType = 'sine';
}

class FakeGain extends FakeNode {
  readonly gain = new FakeParam();
}

class FakeFilter extends FakeNode {
  readonly frequency = new FakeParam();
  readonly Q = new FakeParam();
  type: BiquadFilterType = 'lowpass';
}

class FakePanner extends FakeNode {
  readonly pan = new FakeParam();
}

class FakeAnalyser extends FakeNode {
  fftSize = 1024;
  readonly frequencyBinCount = 512;
  getFloatFrequencyData() {}
  getFloatTimeDomainData() {}
}

class FakeWaveShaper extends FakeNode {
  curve: Float32Array | null = null;
  oversample: OverSampleType = 'none';
}

class FakeConvolver extends FakeNode {
  buffer: unknown = null;
}

class FakeBuffer {
  readonly numberOfChannels: number;

  constructor(
    readonly sampleRate: number,
    readonly length: number,
    numberOfChannels: number,
  ) {
    this.numberOfChannels = numberOfChannels;
  }

  getChannelData() {
    return new Float32Array(this.length);
  }
}

class FakeContext {
  state: AudioContextState | 'interrupted' = 'running';
  readonly currentTime = 0;
  readonly sampleRate = 44100;
  readonly destination: FakeNode;
  readonly createdNodes: FakeNode[] = [];
  readonly sources: FakeSource[] = [];
  resolveResume: (() => void) | null = null;

  constructor() {
    this.destination = this.make(new FakeNode(this));
  }

  private make<T extends FakeNode>(node: T) {
    this.createdNodes.push(node);
    if (node instanceof FakeSource) this.sources.push(node);
    return node;
  }

  createGain() { return this.make(new FakeGain(this)); }
  createBiquadFilter() { return this.make(new FakeFilter(this)); }
  createOscillator() { return this.make(new FakeOscillator(this)); }
  createStereoPanner() { return this.make(new FakePanner(this)); }
  createAnalyser() { return this.make(new FakeAnalyser(this)); }
  createWaveShaper() { return this.make(new FakeWaveShaper(this)); }
  createConvolver() { return this.make(new FakeConvolver(this)); }
  createBufferSource() { return this.make(new FakeSource(this)); }
  createBuffer(numberOfChannels: number, length: number, sampleRate: number) {
    return new FakeBuffer(sampleRate, length, numberOfChannels);
  }

  resume() {
    return new Promise<void>((resolve) => {
      this.resolveResume = () => {
        this.state = 'running';
        resolve();
      };
    });
  }

  suspend() {
    this.state = 'suspended';
    return Promise.resolve();
  }

  close() {
    this.state = 'closed';
    return Promise.resolve();
  }
}

function createService(context: FakeContext) {
  return new AudioService({
    platform: {
      createContext: () => context as unknown as AudioContext,
    },
  });
}

afterEach(() => {
  vi.useRealTimers();
});
describe('AudioService lifecycle safety', () => {
  it('does not resurrect a drone after stop while context startup is awaited', async () => {
    const context = new FakeContext();
    context.state = 'suspended';
    const service = createService(context);

    const startup = service.startDrone('#e11d48');
    await Promise.resolve();
    service.stopDrone();
    context.resolveResume?.();

    await startup;

    expect((service as unknown as { droneNodes: unknown[] }).droneNodes).toHaveLength(0);
    expect(context.sources.filter((source) => source.started)).toHaveLength(0);
  });

  it('cleans every phase-cue source and graph edge through RNAA onEnded', async () => {
    const context = new FakeContext();
    const service = createService(context);
    await service.startDrone('#e11d48');

    const sourceStart = context.sources.length;
    const nodeStart = context.createdNodes.length;
    service.setBreathingMode(ModeName.Box);
    service.playCue('inhale', '#e11d48');

    const cueSources = context.sources.slice(sourceStart);
    const cueNodes = context.createdNodes.slice(nodeStart);
    expect(cueSources).toHaveLength(2);
    expect((service as unknown as { activeCueBuses: Set<unknown> }).activeCueBuses.size).toBe(1);

    cueSources[0].onEnded?.();
    expect((service as unknown as { activeCueBuses: Set<unknown> }).activeCueBuses.size).toBe(1);
    cueSources[1].onEnded?.();

    expect((service as unknown as { activeCueBuses: Set<unknown> }).activeCueBuses.size).toBe(0);
    expect(cueNodes.every((node) => node.disconnectCalls.length > 0)).toBe(true);
  });

  it('keeps cached reverb fan-out intact while removing each cue send', async () => {
    const context = new FakeContext();
    const service = createService(context);
    await service.startDrone('#e11d48');

    const firstCueSourceStart = context.sources.length;
    service.playCue('inhale', '#e11d48');
    const firstCueSources = context.sources.slice(firstCueSourceStart);

    const secondCueSourceStart = context.sources.length;
    service.playCue('inhale', '#e11d48');
    const secondCueSources = context.sources.slice(secondCueSourceStart);

    firstCueSources.forEach((source) => source.onEnded?.());
    secondCueSources.forEach((source) => source.onEnded?.());

    const reverb = [...(service as unknown as {
      cueReverbCache: Map<string, FakeConvolver>;
    }).cueReverbCache.values()][0];
    expect(reverb).toBeDefined();
    expect(reverb.disconnectCalls.length).toBeGreaterThan(0);
    expect(reverb.disconnectCalls.every((destination) => destination !== undefined)).toBe(true);
  });

  it('bounds completion-cue graph lifetime when ended is interrupted', async () => {
    vi.useFakeTimers();
    const context = new FakeContext();
    const service = createService(context);
    await service.startDrone('#e11d48');

    service.playCompletionCue();
    expect((service as unknown as { activeCueBuses: Set<unknown> }).activeCueBuses.size).toBe(1);

    vi.advanceTimersByTime(1200);

    expect((service as unknown as { activeCueBuses: Set<unknown> }).activeCueBuses.size).toBe(0);
  });
});

describe('sound guide phase plan', () => {
  const profile = soundGuideProfileFor(ModeName.Box);
  const first = <T,>(items: T[]) => items[0];
  const last = <T,>(items: T[]) => items[items.length - 1];
  const endOf = (plan: GuidePhasePlan): GuideState => guideStateAt(plan, plan.duration);
  /** Plays phases back to back, each from the state the previous one ended in. */
  const play = (phases: Array<{ kind: GuidePhaseKind; seconds: number; topUpFollows?: boolean }>) => {
    let from = GUIDE_REST;
    return phases.map((phase) => {
      const plan = planGuidePhase({
        kind: phase.kind,
        durationSeconds: phase.seconds,
        from,
        profile,
        topUpFollows: phase.topUpFollows,
      });
      from = endOf(plan);
      return plan;
    });
  };

  it('rises through the inhale and falls through the exhale', () => {
    const [inhale, exhale] = play([
      { kind: 'inhale', seconds: 5.5 },
      { kind: 'exhale', seconds: 5.5 },
    ]);

    // Inhale: silence to the fifth at full level, air opening.
    expect(first(inhale.states)).toMatchObject({ position: 0, level: 0 });
    expect(endOf(inhale).position).toBeCloseTo(1, 5);
    expect(endOf(inhale).level).toBeCloseTo(1, 5);
    expect(last(inhale.airBandHz).value).toBeGreaterThan(first(inhale.airBandHz).value);
    expect(last(inhale.notes[1]).value).toBeGreaterThan(last(inhale.notes[0]).value);

    // Exhale: back to the root, near silence, air closing.
    expect(endOf(exhale).position).toBeCloseTo(0, 5);
    expect(endOf(exhale).level).toBeLessThan(0.2);
    expect(last(exhale.airBandHz).value).toBeLessThan(first(exhale.airBandHz).value);
    expect(last(exhale.notes[0]).value).toBeGreaterThan(last(exhale.notes[1]).value);
  });

  it('tells a full-lungs hold from an empty-lungs hold', () => {
    const [, holdIn, , holdOut] = play([
      { kind: 'inhale', seconds: 4 },
      { kind: 'holdIn', seconds: 4 },
      { kind: 'exhale', seconds: 4 },
      { kind: 'holdOut', seconds: 4 },
    ]);

    expect(endOf(holdIn).position).toBeCloseTo(1, 5);
    expect(endOf(holdOut).position).toBeCloseTo(0, 5);
    // The held fifth stays clearly audible; the empty hold is close to rest.
    expect(endOf(holdIn).level).toBeGreaterThan(0.5);
    expect(endOf(holdOut).level).toBeLessThan(0.2);
    expect(endOf(holdIn).level).toBeGreaterThan(endOf(holdOut).level * 3);
  });

  it('plays the double inhale as two rising steps, then one fall', () => {
    const [inhale, topUp, exhale] = play([
      { kind: 'inhale', seconds: 2.5, topUpFollows: true },
      { kind: 'inhaleTopUp', seconds: 1.5 },
      { kind: 'exhale', seconds: 6 },
    ]);

    // First sip stops short of the peak, on the fifth.
    expect(endOf(inhale).position).toBeCloseTo(1, 5);
    expect(endOf(inhale).level).toBeLessThan(0.9);
    // Second sip dips, then reaches the octave at full level.
    const dip = Math.min(...topUp.states.map((state) => state.level));
    expect(dip).toBeLessThan(endOf(inhale).level - 0.15);
    expect(endOf(topUp).position).toBeCloseTo(2, 5);
    expect(endOf(topUp).level).toBeCloseTo(1, 5);
    // The two sips are marked on different notes.
    expect(topUp.marker.ladderIndex).toBeGreaterThan(inhale.marker.ladderIndex);
    // The sigh falls all the way from the octave to the root.
    expect(first(exhale.states).position).toBeCloseTo(2, 5);
    expect(endOf(exhale).position).toBeCloseTo(0, 5);
  });

  it('never steps a curve at a phase boundary', () => {
    const plans = play([
      { kind: 'inhale', seconds: 2.5, topUpFollows: true },
      { kind: 'inhaleTopUp', seconds: 1.5 },
      { kind: 'holdIn', seconds: 4 },
      { kind: 'exhale', seconds: 6 },
      { kind: 'holdOut', seconds: 1 },
      { kind: 'inhale', seconds: 4 },
    ]);

    plans.slice(1).forEach((plan, index) => {
      const previous = plans[index];
      plan.notes.forEach((curve, note) => {
        expect(first(curve).value).toBeCloseTo(last(previous.notes[note]).value, 6);
      });
      expect(first(plan.airGain).value).toBeCloseTo(last(previous.airGain).value, 6);
      expect(first(plan.airBandHz).value).toBeCloseTo(last(previous.airBandHz).value, 6);
      expect(first(plan.toneLowpassHz).value).toBeCloseTo(last(previous.toneLowpassHz).value, 6);
    });
  });

  it('continues from mid-curve when the next phase arrives early', () => {
    const inhale = planGuidePhase({ kind: 'inhale', durationSeconds: 4, from: GUIDE_REST, profile });
    const interrupted = guideStateAt(inhale, 2);
    const exhale = planGuidePhase({ kind: 'exhale', durationSeconds: 4, from: interrupted, profile });

    expect(interrupted.level).toBeGreaterThan(0);
    expect(interrupted.level).toBeLessThan(1);
    expect(first(exhale.states).level).toBeCloseTo(interrupted.level, 6);
    expect(first(exhale.states).position).toBeCloseTo(interrupted.position, 6);
  });

  it('keeps every mode inside one loudness budget', () => {
    const peaks = Object.values(ModeName).map((mode) => {
      const modeProfile = soundGuideProfileFor(mode);
      const plan = planGuidePhase({ kind: 'inhale', durationSeconds: 4, from: GUIDE_REST, profile: modeProfile });
      const tone = Math.max(...plan.notes.flatMap((curve) => curve.map((point) => point.value)));
      const air = Math.max(...plan.airGain.map((point) => point.value));
      return { tone, air };
    });

    peaks.forEach(({ tone, air }) => {
      expect(tone).toBeGreaterThan(0.05);
      expect(tone).toBeLessThanOrEqual(0.2);
      expect(air).toBeLessThanOrEqual(0.4);
    });
  });

  it('puts the ladder where a phone speaker can play it', () => {
    // Every drone root in the engine, 87 Hz (Sigh) to 165 Hz (Coherent).
    [87.31, 110, 130.81, 146.83, 164.81].forEach((root) => {
      const base = ladderBaseHz(root);
      expect(base).toBeGreaterThanOrEqual(247);
      expect(base).toBeLessThan(494);
      expect(Math.log2(base / root) % 1).toBeCloseTo(0, 6);
    });
  });
});

describe('sound guide lifecycle', () => {
  const guideOf = (service: AudioService) =>
    (service as unknown as { soundGuide: unknown }).soundGuide;

  it('does not resurrect the guide after stop while context startup is awaited', async () => {
    const context = new FakeContext();
    context.state = 'suspended';
    const service = createService(context);

    const startup = service.startSoundGuide('#e11d48');
    await Promise.resolve();
    service.stopSoundGuide();
    context.resolveResume?.();
    await startup;

    expect(guideOf(service)).toBeNull();
    expect(context.sources.filter((source) => source.started)).toHaveLength(0);
  });

  it('stops every source and disconnects every node after the release tail', async () => {
    vi.useFakeTimers();
    const context = new FakeContext();
    const service = createService(context);
    service.setBreathingMode(ModeName.Sigh);

    const nodeStart = context.createdNodes.length;
    await service.startSoundGuide('#0ea5e9');
    service.playGuidePhase('inhale', 2.5, { topUpFollows: true });
    const guideSources = context.sources.filter((source) => source.started);
    // Three notes of three oscillators, the air noise, and a two-partial chime.
    expect(guideSources).toHaveLength(12);

    service.stopSoundGuide({ seconds: 1.6, closing: true });
    expect(guideOf(service)).toBeNull();
    vi.advanceTimersByTime(8000);

    const guideNodes = context.createdNodes
      .slice(nodeStart)
      .filter((node) => !(node instanceof FakeSource) && !(node instanceof FakeConvolver));
    expect(guideSources.every((source) => source.stopCalls.length > 1)).toBe(true);
    expect(guideNodes.filter((node) => node instanceof FakeFilter).every((node) => node.disconnectCalls.length > 0)).toBe(true);
    // The shared reverb is only detached from this guide's return path.
    const reverb = [...(service as unknown as {
      cueReverbCache: Map<string, FakeConvolver>;
    }).cueReverbCache.values()][0];
    expect(reverb.disconnectCalls.every((destination) => destination !== undefined)).toBe(true);
  });

  it('plays nothing while the guide is off', async () => {
    const context = new FakeContext();
    const service = createService(context);
    await service.startDrone('#e11d48');

    const sourceStart = context.sources.length;
    service.playGuidePhase('inhale', 4);

    expect(context.sources.slice(sourceStart)).toHaveLength(0);
  });
});
