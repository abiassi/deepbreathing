
/**
 * A service to handle generative audio using the Web Audio API.
 * Creates oscillators for ambient drones, bells, pink noise, and binaural beats.
 * Includes 8D Spatial Panning.
 */
export class AudioService {
    private ctx: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    
    // Drone / Ambient with Spatial Panning
    private droneNodes: { osc: OscillatorNode, panner: PannerNode, gain: GainNode }[] = [];
    
    // Binaural Beats
    private binauralNodes: { osc: OscillatorNode, pan: StereoPannerNode, gain: GainNode }[] = [];

    // Pink Noise
    private noiseNode: { source: AudioBufferSourceNode, gain: GainNode } | null = null;

    private isMuted: boolean = false;
    private cueVolume: number = 0.5;
    private musicVolume: number = 0.3;
  
    constructor(options: { debug?: boolean } = {}) {}
  
    private initContext() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
      }
    }
  
    public async resume() {
      this.initContext();
      if (this.ctx?.state === 'suspended') {
        await this.ctx.resume();
      }
    }

    /**
     * Updates the 8D spatial position of the drones.
     * Rotates the sound source around the listener's head.
     * @param time Current time from animation loop
     */
    public updateSpatial(time: number) {
      if (!this.ctx || this.droneNodes.length === 0) return;

      // Rotate slowly: 1 full revolution every ~10 seconds
      const speed = 0.0005; 
      const x = Math.cos(time * speed);
      const z = Math.sin(time * speed);
      
      // Update panner positions
      this.droneNodes.forEach((node, index) => {
         // Offset each drone slightly so they don't all stack on one point
         const offset = index * (Math.PI / 2); 
         const px = Math.cos((time * speed) + offset);
         const pz = Math.sin((time * speed) + offset);
         
         // Standard Web Audio Panner coordinates
         node.panner.positionX.value = px * 2; // 2 meters radius
         node.panner.positionZ.value = pz * 2;
         node.panner.positionY.value = 0;
      });
    }
  
    public setVolume(cueVol: number, musicVol: number) {
      this.cueVolume = cueVol;
      this.musicVolume = musicVol;
      
      // Update active drones
      this.droneNodes.forEach(node => {
         if (this.ctx) {
             node.gain.gain.setTargetAtTime(this.isMuted ? 0 : this.musicVolume * 0.1, this.ctx.currentTime, 0.5);
         }
      });

      // Update binaural beats
      this.binauralNodes.forEach(node => {
        if (this.ctx) {
            // Binaural beats are usually subtle, keep around 5-10% volume
            node.gain.gain.setTargetAtTime(this.isMuted ? 0 : 0.05, this.ctx.currentTime, 0.5);
        }
      });

      // Update noise
      if (this.noiseNode && this.ctx) {
        this.noiseNode.gain.gain.setTargetAtTime(this.isMuted ? 0 : this.musicVolume * 0.15, this.ctx.currentTime, 0.5);
      }
    }
  
    public toggleMute(muted: boolean) {
      this.isMuted = muted;
      if (this.masterGain && this.ctx) {
         this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.ctx.currentTime, 0.1);
      }
    }
  
    public playCue(type: 'inhale' | 'exhale' | 'hold') {
      if (this.isMuted || !this.ctx || !this.masterGain) return;
  
      const t = this.ctx.currentTime;
      const baseFreq = type === 'inhale' ? 440 : (type === 'exhale' ? 392 : 523); 
      
      const harmonics = [1, 1.5, 2, 2.5];
      const gains = [0.6, 0.3, 0.2, 0.1];
  
      harmonics.forEach((h, i) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();
        
        osc.frequency.value = baseFreq * h;
        osc.type = 'sine';
        
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(gains[i] * this.cueVolume, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 3.5); 
  
        osc.connect(gain);
        gain.connect(this.masterGain!);
        
        osc.start(t);
        osc.stop(t + 4);
      });
    }

    public startBinaural(beatHz: number = 10) {
        this.stopBinaural();
        this.initContext();
        if (!this.ctx || !this.masterGain) return;

        const t = this.ctx.currentTime;
        const baseFreq = 200; // Carrier frequency

        // Left Channel
        const leftOsc = this.ctx.createOscillator();
        const leftPan = this.ctx.createStereoPanner();
        const leftGain = this.ctx.createGain();
        
        leftOsc.frequency.value = baseFreq;
        leftOsc.type = 'sine';
        leftPan.pan.value = -1; // Full Left
        leftGain.gain.setValueAtTime(0, t);
        leftGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.05, t + 2);

        leftOsc.connect(leftGain);
        leftGain.connect(leftPan);
        leftPan.connect(this.masterGain);
        leftOsc.start(t);

        // Right Channel
        const rightOsc = this.ctx.createOscillator();
        const rightPan = this.ctx.createStereoPanner();
        const rightGain = this.ctx.createGain();

        // The difference determines the brainwave entrainment (Alpha=10Hz, Delta=2Hz)
        rightOsc.frequency.value = baseFreq + beatHz;
        rightOsc.type = 'sine';
        rightPan.pan.value = 1; // Full Right
        rightGain.gain.setValueAtTime(0, t);
        rightGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.05, t + 2);

        rightOsc.connect(rightGain);
        rightGain.connect(rightPan);
        rightPan.connect(this.masterGain);
        rightOsc.start(t);

        this.binauralNodes.push({ osc: leftOsc, pan: leftPan, gain: leftGain });
        this.binauralNodes.push({ osc: rightOsc, pan: rightPan, gain: rightGain });
    }

    public stopBinaural() {
        if (this.ctx) {
            const t = this.ctx.currentTime;
            this.binauralNodes.forEach(node => {
                node.gain.gain.cancelScheduledValues(t);
                node.gain.gain.setValueAtTime(node.gain.gain.value, t);
                node.gain.gain.linearRampToValueAtTime(0, t + 1);
                node.osc.stop(t + 1.1);
            });
        }
        this.binauralNodes = [];
    }
  
    public startDrone(colorHex: string) {
      this.stopDrone();
      this.initContext();
      if (!this.ctx || !this.masterGain) return;
  
      let baseFreq = 110; // A2
      if (colorHex === '#e11d48') baseFreq = 130.81; // C3
      else if (colorHex === '#4f46e5') baseFreq = 146.83; // D3
      else if (colorHex === '#059669') baseFreq = 164.81; // E3
      else if (colorHex === '#0ea5e9') baseFreq = 174.61; // F3
  
      const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 1.01];
  
      freqs.forEach(f => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          // Add PannerNode for 8D Audio
          const panner = this.ctx!.createPanner();
          
          // HRTF is better for headphones 8D effect
          panner.panningModel = 'HRTF'; 
          panner.distanceModel = 'inverse';
          panner.refDistance = 1;
          panner.maxDistance = 10000;
          
          osc.frequency.value = f;
          osc.type = 'triangle';
  
          const t = this.ctx!.currentTime;
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(this.isMuted ? 0 : this.musicVolume * 0.1, t + 2);
  
          const lfo = this.ctx!.createOscillator();
          lfo.frequency.value = 0.1 + Math.random() * 0.2;
          const lfoGain = this.ctx!.createGain();
          lfoGain.gain.value = 0.05;
          lfo.connect(lfoGain);
          lfoGain.connect(gain.gain);
          lfo.start(t);
  
          // Connect: OSC -> GAIN -> PANNER -> MASTER
          osc.connect(gain);
          gain.connect(panner);
          panner.connect(this.masterGain!);
          
          osc.start(t);
  
          this.droneNodes.push({ osc, panner, gain });
      });
    }
  
    public stopDrone() {
        if (this.ctx) {
            const t = this.ctx.currentTime;
            this.droneNodes.forEach(node => {
                node.gain.gain.cancelScheduledValues(t);
                node.gain.gain.setValueAtTime(node.gain.gain.value, t);
                node.gain.gain.linearRampToValueAtTime(0, t + 1);
                node.osc.stop(t + 1.1);
            });
        }
        this.droneNodes = [];
    }

    public startPinkNoise() {
        this.stopPinkNoise();
        this.initContext();
        if (!this.ctx || !this.masterGain) return;

        const bufferSize = 2 * this.ctx.sampleRate; // 2 seconds buffer
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const output = buffer.getChannelData(0);

        // Pink Noise Generation (Paul Kellet's refined method)
        let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99886 * b0 + white * 0.0555179;
            b1 = 0.99332 * b1 + white * 0.0750759;
            b2 = 0.96900 * b2 + white * 0.1538520;
            b3 = 0.86650 * b3 + white * 0.3104856;
            b4 = 0.55000 * b4 + white * 0.5329522;
            b5 = -0.7616 * b5 - white * 0.0168980;
            output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
            output[i] *= 0.11; // Compensate for gain
            b6 = white * 0.115926;
        }

        const noiseSource = this.ctx.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;
        
        const noiseGain = this.ctx.createGain();
        const t = this.ctx.currentTime;
        
        noiseGain.gain.setValueAtTime(0, t);
        noiseGain.gain.linearRampToValueAtTime(this.isMuted ? 0 : this.musicVolume * 0.15, t + 2);

        noiseSource.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noiseSource.start(t);

        this.noiseNode = { source: noiseSource, gain: noiseGain };
    }

    public stopPinkNoise() {
        if (this.ctx && this.noiseNode) {
            const t = this.ctx.currentTime;
            this.noiseNode.gain.gain.cancelScheduledValues(t);
            this.noiseNode.gain.gain.setValueAtTime(this.noiseNode.gain.gain.value, t);
            this.noiseNode.gain.gain.linearRampToValueAtTime(0, t + 1);
            this.noiseNode.source.stop(t + 1.1);
            this.noiseNode = null;
        }
    }
}
