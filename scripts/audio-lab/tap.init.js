// Audio lab tap. Registered as an agent-browser init script, never shipped.
//
// Reroutes every connection to an AudioContext's destination through a tap
// gain, and records the tap as 32-bit float PCM on the audio thread. The
// recording is what the real engine sends to the speakers: after the master
// compressor, limiter and trim.
(() => {
  if (window.__dbeTap) return;
  const RealContext = window.AudioContext || window.webkitAudioContext;
  if (!RealContext) return;

  const tap = {
    sampleRate: 0,
    frames: 0,
    left: [],
    right: [],
    ready: false,
    mode: 'none',
    startedEpochMs: 0,
    marks: [],
  };
  window.__dbeTap = tap;

  const workletSource = `
    class DbeTap extends AudioWorkletProcessor {
      process(inputs) {
        const input = inputs[0];
        if (input && input[0]) {
          const left = input[0].slice();
          const right = (input[1] || input[0]).slice();
          this.port.postMessage([left, right], [left.buffer, right.buffer]);
        }
        return true;
      }
    }
    registerProcessor('dbe-tap', DbeTap);
  `;

  const tapNodes = new WeakMap();
  const realConnect = AudioNode.prototype.connect;
  const realDisconnect = AudioNode.prototype.disconnect;

  const push = (left, right) => {
    if (!tap.startedEpochMs) tap.startedEpochMs = performance.timeOrigin + performance.now();
    tap.left.push(left);
    tap.right.push(right);
    tap.frames += left.length;
  };

  const tapFor = (context) => {
    let node = tapNodes.get(context);
    if (node) return node;
    node = context.createGain();
    tapNodes.set(context, node);
    realConnect.call(node, context.destination);
    tap.sampleRate = context.sampleRate;

    const url = URL.createObjectURL(new Blob([workletSource], { type: 'application/javascript' }));
    context.audioWorklet
      .addModule(url)
      .then(() => {
        const recorder = new AudioWorkletNode(context, 'dbe-tap', {
          numberOfInputs: 1,
          numberOfOutputs: 0,
          channelCount: 2,
          channelCountMode: 'explicit',
          channelInterpretation: 'speakers',
        });
        recorder.port.onmessage = (event) => push(event.data[0], event.data[1]);
        realConnect.call(node, recorder);
        tap.mode = 'worklet';
        tap.ready = true;
      })
      .catch((error) => {
        tap.mode = `failed: ${error}`;
      });
    return node;
  };

  AudioNode.prototype.connect = function connect(target, ...rest) {
    if (target instanceof AudioDestinationNode && target.context instanceof RealContext) {
      realConnect.call(this, tapFor(target.context), ...rest);
      return target;
    }
    return realConnect.call(this, target, ...rest);
  };

  AudioNode.prototype.disconnect = function disconnect(target, ...rest) {
    if (target instanceof AudioDestinationNode && tapNodes.has(target.context)) {
      return realDisconnect.call(this, tapNodes.get(target.context), ...rest);
    }
    return realDisconnect.call(this, target, ...rest);
  };

  tap.mark = (label) => {
    tap.marks.push({ label, frame: tap.frames, epochMs: performance.timeOrigin + performance.now() });
  };

  tap.reset = () => {
    tap.left = [];
    tap.right = [];
    tap.frames = 0;
    tap.startedEpochMs = 0;
    tap.marks = [];
  };

  // 32-bit float WAV, so the analysis sees samples above full scale.
  tap.toWav = () => {
    const frames = tap.frames;
    const bytes = new ArrayBuffer(44 + frames * 8);
    const view = new DataView(bytes);
    const text = (offset, value) => {
      for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i));
    };
    text(0, 'RIFF');
    view.setUint32(4, 36 + frames * 8, true);
    text(8, 'WAVE');
    text(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 3, true);
    view.setUint16(22, 2, true);
    view.setUint32(24, tap.sampleRate, true);
    view.setUint32(28, tap.sampleRate * 8, true);
    view.setUint16(32, 8, true);
    view.setUint16(34, 32, true);
    text(36, 'data');
    view.setUint32(40, frames * 8, true);
    const samples = new Float32Array(bytes, 44, frames * 2);
    let offset = 0;
    for (let block = 0; block < tap.left.length; block += 1) {
      const left = tap.left[block];
      const right = tap.right[block];
      for (let i = 0; i < left.length; i += 1) {
        samples[offset] = left[i];
        samples[offset + 1] = right[i];
        offset += 2;
      }
    }
    return bytes;
  };

  tap.upload = async (url) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/octet-stream' },
      body: tap.toWav(),
    });
    return JSON.stringify({
      status: response.status,
      frames: tap.frames,
      sampleRate: tap.sampleRate,
      seconds: tap.frames / tap.sampleRate,
      marks: tap.marks,
      startedEpochMs: tap.startedEpochMs,
    });
  };
})();
