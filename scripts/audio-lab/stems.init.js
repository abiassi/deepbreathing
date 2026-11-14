// Audio lab stems. Registered as an agent-browser init script, never shipped.
//
// Records one layer of the real engine alone. Add `&labsolo=<stem>[,<stem>]`
// to the page URL. Every sound source the engine creates is named from the
// function that created it; a source outside the solo set is never connected,
// so it makes no sound. The rest of the graph, the master chain included, is
// the real one.
//
// Stems: tone, air, marker, chord (the closing chord), noisebed, drone, sub,
// binaural, envelope, cue. `window.__dbeStems.seen` counts the sources of
// each stem, so a capture can prove that the stem it asked for existed.
(() => {
  if (window.__dbeStems) return;
  const solo = (new URLSearchParams(location.search).get('labsolo') || '')
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);
  const state = { solo, seen: {}, muted: {} };
  window.__dbeStems = state;
  if (!solo.length) return;

  // First match wins. The names are function names in packages/audio.
  const rules = [
    [/release/, /playChime/, 'chord'],
    [/playChime|playMarker/, null, 'marker'],
    [/startBinaural/, null, 'binaural'],
    [/startDrone/, null, 'drone'],
    [/startSubBass/, null, 'sub'],
    [/startPinkNoise/, null, 'noisebed'],
    [/startPhaseEnvelope/, null, 'envelope'],
    [/playCue|playCompletionCue/, null, 'cue'],
  ];
  const stemOf = (stack, kind) => {
    for (const [first, second, name] of rules) {
      if (first.test(stack) && (!second || second.test(stack))) return name;
    }
    if (/SoundGuide/.test(stack)) return kind === 'buffer' ? 'air' : 'tone';
    return 'other';
  };

  const silent = new WeakSet();
  const wrap = (method, kind) => {
    const real = BaseAudioContext.prototype[method];
    BaseAudioContext.prototype[method] = function create(...args) {
      const node = real.apply(this, args);
      const stem = stemOf(String(new Error().stack), kind);
      state.seen[stem] = (state.seen[stem] || 0) + 1;
      if (!solo.includes(stem)) {
        silent.add(node);
        state.muted[stem] = (state.muted[stem] || 0) + 1;
      }
      return node;
    };
  };
  wrap('createOscillator', 'oscillator');
  wrap('createBufferSource', 'buffer');

  const realConnect = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function connect(target, ...rest) {
    if (silent.has(this)) return target instanceof AudioNode ? target : undefined;
    return realConnect.call(this, target, ...rest);
  };
})();
