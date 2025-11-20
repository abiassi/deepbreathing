/**
 * Generative audio engine for Resonance.
 * - Drone pads move through an 8D panner.
 * - Pink noise beds emulate rain.
 * - Phase cues shift timbre based on the active color theme.
 * - Binaural beats accept adaptive entrainment frequencies.
 */
type CueType = 'inhale' | 'exhale' | 'hold';

interface CueProfile {
  oscType: OscillatorType;
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  pitchShift: number;
  detune: number;
  harmonics: number[];
}

export class AudioService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private debug = false;
  private mediaUnlocking: Promise<void> | null = null;
  private mediaUnlocked = false;

  private droneNodes: { osc: OscillatorNode; panner: PannerNode; gain: GainNode }[] = [];
  private binauralNodes: { osc: OscillatorNode; pan: StereoPannerNode; gain: GainNode }[] = [];
  private noiseNode: { source: AudioBufferSourceNode; gain: GainNode } | null = null;

  private isMuted = false;
  private cueVolume = 0.5;
  private musicVolume = 0.3;
  private themeColor = '#4f46e5';

  constructor(options: { debug?: boolean } = {}) {
    this.debug = Boolean(options.debug);
  }

  private log(...args: unknown[]) {
    if (this.debug) {
      // eslint-disable-next-line no-console
      console.log('[AudioService]', ...args);
    }
  }

  private async unlockWithMediaElement() {
    if (this.mediaUnlocked || typeof window === 'undefined') return;
    if (this.mediaUnlocking) return this.mediaUnlocking;

    const src =
      'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=';

    this.mediaUnlocking = (async () => {
      try {
        const el = document.createElement('audio');
        el.src = src;
        el.loop = false;
        el.autoplay = false;
        (el as any).playsInline = true;
        el.setAttribute('playsinline', 'true');
        el.muted = true; // muted to satisfy autoplay but still trigger the unlock
        el.volume = 0.0001;
        el.load();
        await el.play();
        el.pause();
        el.currentTime = 0;
        this.mediaUnlocked = true;
        this.log('Media element unlock success');
      } catch (error) {
        this.log('Media element unlock failed', error);
      } finally {
        this.mediaUnlocking = null;
      }
    })();

    return this.mediaUnlocking;
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtor = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtor) return;
      try {
        this.ctx = new AudioCtor({ latencyHint: 'playback' });
      } catch {
        this.ctx = new AudioCtor();
      }
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
      if (this.debug && this.ctx) {
        this.ctx.onstatechange = () => {
          this.log('statechange', this.ctx?.state);
        };
        this.log('AudioContext created', { state: this.ctx.state });
      }
    }
  }

  /**
   * Ensure the AudioContext is present and running.
   * Handles Safari's "interrupted" state and recreates the context if it was closed.
   */
  private async ensureContextReady() {
    this.log('ensureContextReady:begin');
    this.initContext();
    if (!this.ctx) return false;

    // Fire-and-forget media element unlock; don't let a blocked play promise stall resume.
    const unlockPromise = this.unlockWithMediaElement();
    if (unlockPromise) {
      unlockPromise
        .catch((error) => this.log('Media unlock error (non-blocking)', error));
    }

    // Recreate if the context was closed by the browser.
    const state = (this.ctx.state as AudioContextState | 'interrupted');
    if (state === 'closed') {
      this.ctx = null;
      this.masterGain = null;
      this.initContext();
      if (!this.ctx) return false;
    }

    if (!this.masterGain && this.ctx) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.connect(this.ctx.destination);
    }

    const readyState = (this.ctx.state as AudioContextState | 'interrupted');
    if (readyState === 'suspended' || readyState === 'interrupted') {
      try {
        this.log('Attempting ctx.resume()', { state: this.ctx.state });
        await this.ctx.resume();
        // Some mobile browsers need a beat before the context actually unlocks
        if (this.ctx.state === 'suspended') {
          await new Promise(resolve => setTimeout(resolve, 120));
          await this.ctx.resume();
        }
        if (this.ctx.state === 'suspended') {
          this.log('AudioContext still suspended after resume; recreating');
          try {
            await this.ctx.close();
          } catch (error) {
            this.log('ctx.close failed (can ignore)', error);
          }
          this.ctx = null;
          this.masterGain = null;
          this.initContext();
          if (this.ctx) {
            try {
              await this.ctx.resume();
            } catch (error) {
              this.log('Recreated ctx resume failed', error);
            }
          }
        }
      } catch (error) {
        console.warn('AudioContext resume failed:', error);
        return false;
      }
    }

    if (this.masterGain && this.ctx && this.masterGain.context !== this.ctx) {
      this.masterGain.disconnect();
      this.masterGain.connect(this.ctx.destination);
    }

    this.log('ensureContextReady:end', { state: this.ctx.state });
    return this.ctx.state === 'running';
  }

  public async resume() {
    const ready = await this.ensureContextReady();

    // Mobile browsers require explicit resume after user interaction
    if (ready) {
      this.playSilentUnlock();
    }

    return ready;
  }

  private playSilentUnlock() {
    if (!this.ctx) return;
    const destination = this.masterGain ?? this.ctx.destination;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      osc.connect(gain);
      gain.connect(destination);
      const endTime = now + 0.02;
      osc.start(now);
      osc.stop(endTime);
      this.log('playSilentUnlock fired');
      const cleanup = () => {
        osc.disconnect();
        gain.disconnect();
        osc.removeEventListener('ended', cleanup);
      };
      osc.addEventListener('ended', cleanup);
    } catch (error) {
      console.warn('Silent unlock failed:', error);
    }
  }

  public setThemeColor(colorHex: string) {
    if (!colorHex) return;
    this.themeColor = colorHex;
  }

  /**
   * Slowly rotate drone sources around the listener (8D audio).
   */
  public updateSpatial(time: number) {
    if (!this.ctx || this.droneNodes.length === 0) return;
    const speed = 0.0005;

    this.droneNodes.forEach((node, index) => {
      const offset = index * (Math.PI / 2);
      const px = Math.cos(time * speed + offset) * 2;
      const pz = Math.sin(time * speed + offset) * 2;
      node.panner.positionX.value = px;
      node.panner.positionZ.value = pz;
      node.panner.positionY.value = 0;
    });
  }

  public setVolume(cueVol: number, musicVol: number) {
    this.cueVolume = cueVol;
    this.musicVolume = musicVol;

    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    this.droneNodes.forEach((node) =>
      node.gain.gain.setTargetAtTime(this.isMuted ? 0 : this.musicVolume * 0.1, now, 0.5)
    );
    this.binauralNodes.forEach((node) =>
      node.gain.gain.setTargetAtTime(this.isMuted ? 0 : 0.05, now, 0.5)
    );
    if (this.noiseNode) {
      this.noiseNode.gain.gain.setTargetAtTime(this.isMuted ? 0 : this.musicVolume * 0.15, now, 0.5);
    }
  }

  public toggleMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.1);
    }
  }

  /**
   * Breathing cues now adapt oscillator types/envelopes to the color palette.
   */
  public playCue(type: CueType, colorHex?: string) {
    if (this.isMuted || !this.ctx || !this.masterGain) {
      // If context is suspended, try to resume
      if (this.ctx?.state === 'suspended') {
        this.ctx.resume().catch(console.warn);
      }
      return;
    }

    if (this.ctx.state !== 'running') {
      void this.resume();
      return;
    }

    const theme = colorHex || this.themeColor;
    const profile = this.getCueProfile(theme);
    const t = this.ctx.currentTime;
    const baseFreq = this.getCueFrequency(type, profile.pitchShift);

    profile.harmonics.forEach((amp, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.frequency.value = baseFreq * (1 + index * 0.45);
      osc.type = profile.oscType;
      if (profile.detune !== 0) {
        osc.detune.value = profile.detune * (index + 1);
      }

      const attackEnd = t + profile.attack;
      const decayEnd = attackEnd + profile.decay;
      const releaseEnd = decayEnd + profile.release;

      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(amp * this.cueVolume, attackEnd);
      gain.gain.linearRampToValueAtTime(profile.sustain * amp * this.cueVolume, decayEnd);
      gain.gain.exponentialRampToValueAtTime(0.0001, releaseEnd);

      osc.connect(gain);
      gain.connect(this.masterGain!);

      osc.start(t);
      osc.stop(releaseEnd + 0.05);
    });
  }

  public async startBinaural(beatHz: number = 10) {
    this.stopBinaural();
    const ready = await this.ensureContextReady();
    if (!ready || !this.ctx || !this.masterGain) return;

    const t = this.ctx.currentTime;
    const baseFreq = 200;

    const makeChannel = (panValue: number, detune: number) => {
      const osc = this.ctx!.createOscillator();
      const pan = this.ctx!.createStereoPanner();
      const gain = this.ctx!.createGain();

      osc.frequency.value = baseFreq + detune;
      osc.type = 'sine';
      pan.pan.value = panValue;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.05, t + 2);

      osc.connect(gain);
      gain.connect(pan);
      pan.connect(this.masterGain!);
      osc.start(t);

      this.binauralNodes.push({ osc, pan, gain });
    };

    makeChannel(-1, 0);
    makeChannel(1, beatHz);
  }

  public stopBinaural() {
    if (!this.ctx) {
      this.binauralNodes = [];
      return;
    }
    const t = this.ctx.currentTime;
    this.binauralNodes.forEach((node) => {
      node.gain.gain.cancelScheduledValues(t);
      node.gain.gain.setValueAtTime(node.gain.gain.value, t);
      node.gain.gain.linearRampToValueAtTime(0, t + 1);
      node.osc.stop(t + 1.1);
    });
    this.binauralNodes = [];
  }

  public async startDrone(colorHex: string) {
    this.stopDrone();
    const ready = await this.ensureContextReady();
    if (!ready || !this.ctx || !this.masterGain) return;

    this.themeColor = colorHex || this.themeColor;
    const profile = this.getCueProfile(this.themeColor);
    const baseFreq = this.getDroneRootFrequency(colorHex);
    const partials = [1, 1.5, 2, 0.99];

    partials.forEach((ratio, index) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      const panner = this.ctx!.createPanner();

      panner.panningModel = 'HRTF';
      panner.distanceModel = 'inverse';
      panner.refDistance = 2;
      osc.frequency.value = baseFreq * ratio;
      osc.type = profile.oscType === 'triangle' ? 'triangle' : 'sine';
      osc.detune.value = profile.detune * (index + 0.5);

      const t = this.ctx!.currentTime;
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(this.isMuted ? 0 : this.musicVolume * 0.3, t + 2);

      const lfo = this.ctx!.createOscillator();
      const lfoGain = this.ctx!.createGain();
      lfo.frequency.value = 0.08 + Math.random() * 0.12;
      lfoGain.gain.value = 0.05;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);
      lfo.start(t);

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(this.masterGain!);

      osc.start(t);
      this.droneNodes.push({ osc, panner, gain });
    });
  }

  public stopDrone() {
    if (!this.ctx) {
      this.droneNodes = [];
      return;
    }
    const t = this.ctx.currentTime;
    this.droneNodes.forEach((node) => {
      node.gain.gain.cancelScheduledValues(t);
      node.gain.gain.setValueAtTime(node.gain.gain.value, t);
      node.gain.gain.linearRampToValueAtTime(0, t + 1);
      node.osc.stop(t + 1.1);
    });
    this.droneNodes = [];
  }

  public async startPinkNoise() {
    this.stopPinkNoise();
    const ready = await this.ensureContextReady();
    if (!ready || !this.ctx || !this.masterGain) return;

    const buffer = this.generatePinkNoiseBuffer();
    if (!buffer) return;

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const gain = this.ctx.createGain();
    const t = this.ctx.currentTime;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(this.isMuted ? 0 : this.musicVolume * 0.25, t + 2);

    source.connect(gain);
    gain.connect(this.masterGain);
    source.start(t);

    this.noiseNode = { source, gain };
  }

  public stopPinkNoise() {
    if (!this.ctx || !this.noiseNode) {
      this.noiseNode = null;
      return;
    }
    const t = this.ctx.currentTime;
    this.noiseNode.gain.gain.cancelScheduledValues(t);
    this.noiseNode.gain.gain.setValueAtTime(this.noiseNode.gain.gain.value, t);
    this.noiseNode.gain.gain.linearRampToValueAtTime(0, t + 1);
    this.noiseNode.source.stop(t + 1.1);
    this.noiseNode = null;
  }

  public getDebugState() {
    return {
      ctx: {
        state: this.ctx?.state,
        sampleRate: this.ctx?.sampleRate,
        currentTime: this.ctx?.currentTime
      },
      nodes: {
        drone: this.droneNodes.length,
        binaural: this.binauralNodes.length,
        noise: Boolean(this.noiseNode)
      },
      gain: {
        master: this.masterGain?.gain.value,
        cueVolume: this.cueVolume,
        musicVolume: this.musicVolume,
        muted: this.isMuted
      },
      themeColor: this.themeColor
    };
  }

  private generatePinkNoiseBuffer() {
    if (!this.ctx) return null;
    const bufferSize = 4 * this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }

    return buffer;
  }

  private getCueFrequency(type: CueType, pitchShift: number) {
    const base = type === 'inhale' ? 440 : type === 'exhale' ? 392 : 523;
    return base * pitchShift;
  }

  private getDroneRootFrequency(colorHex: string) {
    const mapping: Record<string, number> = {
      '#e11d48': 130.81,
      '#4f46e5': 146.83,
      '#059669': 164.81,
      '#0ea5e9': 174.61
    };
    const key = colorHex?.toLowerCase();
    return mapping[key] ?? 110;
  }

  private getCueProfile(colorHex: string): CueProfile {
    const metrics = this.getColorMetrics(colorHex);
    const warm = metrics.hue < 80 || metrics.hue > 300;
    const airy = metrics.luminance > 0.55;

    return {
      oscType: warm ? 'triangle' : 'sine',
      attack: airy ? 0.05 : 0.08,
      decay: airy ? 0.4 : 0.8,
      sustain: airy ? 0.65 : 0.45,
      release: warm ? 2.6 : 1.6,
      pitchShift: airy ? 1.03 : 0.96,
      detune: warm ? 12 : -6,
      harmonics: warm ? [0.55, 0.3, 0.15, 0.08] : [0.6, 0.25, 0.12]
    };
  }

  private getColorMetrics(colorHex: string) {
    const { r, g, b } = this.hexToRgb(colorHex);
    const { h } = this.rgbToHsl(r, g, b);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return { hue: h, luminance: Math.min(Math.max(luminance, 0), 1) };
  }

  private hexToRgb(hex: string) {
    let sanitized = hex.replace('#', '');
    if (sanitized.length === 3) {
      sanitized = sanitized.split('').map((c) => c + c).join('');
    }
    const int = parseInt(sanitized, 16);
    return {
      r: (int >> 16) & 255,
      g: (int >> 8) & 255,
      b: int & 255
    };
  }

  private rgbToHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        default:
          h = (r - g) / d + 4;
      }
      h /= 6;
    }

    return { h: h * 360, s, l };
  }
}
