import { Canvas, Circle, LinearGradient, Rect, Path, vec } from '@shopify/react-native-skia';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BreathingPhase,
  DEFAULT_SPEED_MULTIPLIER,
  MAX_SPEED_MULTIPLIER,
  MIN_SPEED_MULTIPLIER,
  ModeName,
  BREATHING_PATTERNS,
  getPhaseVisualState,
  updatePhase,
} from '@resonance/engine';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, Switch, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { playCue } from '@/lib/audio';
import { createModeTheme } from '@/lib/theme';

const MODE_LIST = [ModeName.Box, ModeName.Relax, ModeName.Coherent] as const;
const DURATION_OPTIONS: Array<{ label: string; value: number | null }> = [
  { label: 'Open', value: null },
  { label: '1 min', value: 60 },
  { label: '2 min', value: 120 },
  { label: '5 min', value: 300 },
  { label: '10 min', value: 600 },
];

const STORAGE_KEYS = {
  settings: 'resonance_settings',
  stats: 'resonance_stats',
};

const KeepAwakeGuard = () => {
  useKeepAwake('resonance-session');
  return null;
};

type Particle = {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  alpha: number;
};

const SPEED_PER_SECOND = 60;

const createParticle = (width: number, height: number): Particle => ({
  x: Math.random() * width,
  y: Math.random() * height,
  size: Math.random() * 3 + 1.2,
  speedX: Math.random() * 0.5 - 0.25,
  speedY: Math.random() * 0.5 - 0.25,
  alpha: Math.random() * 0.5 + 0.1,
});

const resetParticleToEdge = (particle: Particle, width: number, height: number) => {
  const edge = Math.floor(Math.random() * 4);
  if (edge === 0) {
    particle.x = Math.random() * width;
    particle.y = 0;
  } else if (edge === 1) {
    particle.x = width;
    particle.y = Math.random() * height;
  } else if (edge === 2) {
    particle.x = Math.random() * width;
    particle.y = height;
  } else {
    particle.x = 0;
    particle.y = Math.random() * height;
  }
  particle.alpha = 0;
};

const resetParticleToCenter = (particle: Particle, width: number, height: number) => {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 50;
  particle.x = width / 2 + Math.cos(angle) * radius;
  particle.y = height / 2 + Math.sin(angle) * radius;
  particle.alpha = 0;
};

const updateParticle = (
  particle: Particle,
  radialSpeed: number,
  driftSpeed: number,
  deltaSeconds: number,
  width: number,
  height: number
) => {
  if (particle.alpha < 0.6) {
    particle.alpha += 0.01;
  }

  const cx = width / 2;
  const cy = height / 2;
  const dx = particle.x - cx;
  const dy = particle.y - cy;
  const dist = Math.hypot(dx, dy);

  if (dist > 0.1) {
    const uX = dx / dist;
    const uY = dy / dist;
    const radialStep = radialSpeed * deltaSeconds;
    particle.x += uX * radialStep;
    particle.y += uY * radialStep;
  }

  const driftStep = driftSpeed * deltaSeconds;
  particle.x += particle.speedX * driftStep;
  particle.y += particle.speedY * driftStep;

  if (radialSpeed < -1 && dist < 30) {
    resetParticleToEdge(particle, width, height);
    return;
  }

  if (radialSpeed > 1 && (particle.x < 0 || particle.x > width || particle.y < 0 || particle.y > height)) {
    resetParticleToCenter(particle, width, height);
    return;
  }

  if (particle.x < 0) particle.x = width;
  if (particle.x > width) particle.x = 0;
  if (particle.y < 0) particle.y = height;
  if (particle.y > height) particle.y = 0;
};

const toRgba = (hex: string, alpha: number) => {
  const sanitized = hex.replace('#', '');
  const bigint = parseInt(sanitized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const blobSize = Math.min(width - 72, 320);
  const blobCanvasPadding = 72;
  const blobCanvasSize = blobSize + blobCanvasPadding * 2;

  const [mode, setMode] = useState<ModeName>(ModeName.Box);
  const [phase, setPhase] = useState<BreathingPhase>(BreathingPhase.Idle);
  const [scale, setScale] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(DEFAULT_SPEED_MULTIPLIER);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [muted, setMuted] = useState(false);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [keepAwakeEnabled, setKeepAwakeEnabled] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);
  const [statsLoaded, setStatsLoaded] = useState(false);
  const [, setParticleFrame] = useState(0);

  const phaseRef = useRef(phase);
  const phaseStartRef = useRef<number | null>(null);
  const sessionStartRef = useRef<number | null>(null);
  const sessionSecondsRef = useRef(0);
  const isRunningRef = useRef(isRunning);
  const speedMultiplierRef = useRef(speedMultiplier);
  const particlesRef = useRef<Particle[]>([]);
  const particleBoundsRef = useRef({ width: 0, height: 0 });
  const lastParticleTimeRef = useRef(0);
  const particleAnimationRef = useRef<number | null>(null);
  const smoothedRadialSpeedRef = useRef(0);
  const smoothedDriftSpeedRef = useRef(0.2 * SPEED_PER_SECOND);

  const pattern = useMemo(() => BREATHING_PATTERNS[mode], [mode]);
  const theme = useMemo(() => createModeTheme(pattern.color), [pattern.color]);
  const speedOptions = useMemo(
    () => [MIN_SPEED_MULTIPLIER, 0.75, 1, 1.25, MAX_SPEED_MULTIPLIER],
    []
  );

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    speedMultiplierRef.current = speedMultiplier;
  }, [speedMultiplier]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const rawSettings = await AsyncStorage.getItem(STORAGE_KEYS.settings);
        if (rawSettings && !cancelled) {
          const parsed = JSON.parse(rawSettings);
          if (parsed.mode && Object.values(ModeName).includes(parsed.mode)) {
            setMode(parsed.mode);
          }
          if (typeof parsed.speedMultiplier === 'number') {
            setSpeedMultiplier(parsed.speedMultiplier);
          }
          if (parsed.selectedDuration === null || typeof parsed.selectedDuration === 'number') {
            setSelectedDuration(parsed.selectedDuration);
          }
          if (typeof parsed.muted === 'boolean') {
            setMuted(parsed.muted);
          }
          if (typeof parsed.hapticsEnabled === 'boolean') {
            setHapticsEnabled(parsed.hapticsEnabled);
          }
          if (typeof parsed.keepAwakeEnabled === 'boolean') {
            setKeepAwakeEnabled(parsed.keepAwakeEnabled);
          }
        }
      } finally {
        if (!cancelled) {
          setSettingsLoaded(true);
        }
      }

      try {
        const rawStats = await AsyncStorage.getItem(STORAGE_KEYS.stats);
        if (rawStats && !cancelled) {
          const parsed = JSON.parse(rawStats);
          if (typeof parsed.totalMinutes === 'number') {
            setTotalMinutes(parsed.totalMinutes);
          }
          if (typeof parsed.sessionsCompleted === 'number') {
            setSessionsCompleted(parsed.sessionsCompleted);
          }
        }
      } finally {
        if (!cancelled) {
          setStatsLoaded(true);
        }
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!settingsLoaded) return;
    const payload = JSON.stringify({
      mode,
      speedMultiplier,
      selectedDuration,
      muted,
      hapticsEnabled,
      keepAwakeEnabled,
    });
    void AsyncStorage.setItem(STORAGE_KEYS.settings, payload);
  }, [mode, speedMultiplier, selectedDuration, muted, hapticsEnabled, keepAwakeEnabled, settingsLoaded]);

  useEffect(() => {
    if (!statsLoaded) return;
    const payload = JSON.stringify({
      totalMinutes,
      sessionsCompleted,
    });
    void AsyncStorage.setItem(STORAGE_KEYS.stats, payload);
  }, [totalMinutes, sessionsCompleted, statsLoaded]);

  const stopSession = useCallback((completed: boolean) => {
    setIsRunning(false);
    phaseRef.current = BreathingPhase.Idle;
    setPhase(BreathingPhase.Idle);
    setScale(0);
    phaseStartRef.current = null;
    sessionStartRef.current = null;

    const seconds = sessionSecondsRef.current;
    if (seconds > 0) {
      setTotalMinutes((prev) => Number((prev + seconds / 60).toFixed(2)));
      if (completed) {
        setSessionsCompleted((prev) => prev + 1);
      }
    }

    sessionSecondsRef.current = 0;
    setSessionSeconds(0);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    let rafId = 0;

    const tick = (time: number) => {
      if (!isRunningRef.current) {
        return;
      }

      if (!phaseStartRef.current) {
        phaseStartRef.current = time;
      }
      if (!sessionStartRef.current) {
        sessionStartRef.current = time;
      }

      const elapsedMs = time - phaseStartRef.current;
      const currentPhase = phaseRef.current;

      const visual = getPhaseVisualState(currentPhase, elapsedMs, pattern, speedMultiplier);
      setScale(visual.scale);

      const elapsedSeconds = Math.floor((time - sessionStartRef.current) / 1000);
      if (elapsedSeconds !== sessionSecondsRef.current) {
        sessionSecondsRef.current = elapsedSeconds;
        setSessionSeconds(elapsedSeconds);
      }

      if (selectedDuration && elapsedSeconds >= selectedDuration) {
        stopSession(true);
        return;
      }

      const update = updatePhase({
        phase: currentPhase,
        elapsedMs,
        pattern,
        speedMultiplier,
      });

      if (update.phaseComplete) {
        phaseRef.current = update.phase;
        setPhase(update.phase);
        phaseStartRef.current = time;

        if (!muted) {
          if (update.phase === BreathingPhase.Inhale) {
            void playCue('inhale');
          } else if (update.phase === BreathingPhase.Exhale) {
            void playCue('exhale');
          } else if (
            update.phase === BreathingPhase.HoldIn ||
            update.phase === BreathingPhase.HoldOut
          ) {
            void playCue('hold');
          }
        }

        if (hapticsEnabled) {
          if (update.phase === BreathingPhase.Inhale) {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          } else if (update.phase === BreathingPhase.Exhale) {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          } else if (
            update.phase === BreathingPhase.HoldIn ||
            update.phase === BreathingPhase.HoldOut
          ) {
            void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
          }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isRunning, muted, hapticsEnabled, pattern, selectedDuration, speedMultiplier, stopSession]);

  const handleStart = () => {
    sessionStartRef.current = null;
    sessionSecondsRef.current = 0;
    setSessionSeconds(0);
    phaseStartRef.current = null;
    phaseRef.current = BreathingPhase.Inhale;
    setPhase(BreathingPhase.Inhale);
    setScale(0);
    setIsRunning(true);
  };

  const handleStop = () => {
    stopSession(false);
  };

  const handleModeChange = (nextMode: ModeName) => {
    setMode(nextMode);
    if (isRunning) {
      stopSession(false);
    }
  };

  const handleDurationChange = (value: number | null) => {
    setSelectedDuration(value);
    if (isRunning && value !== null && sessionSecondsRef.current >= value) {
      stopSession(true);
    }
  };

  const resetStats = () => {
    setTotalMinutes(0);
    setSessionsCompleted(0);
  };

  const radius = blobSize * (0.22 + 0.28 * scale);
  const ringColor = toRgba(pattern.color, 0.45);
  const wobblePhase = useMemo(() => scale * 2.4, [scale]);
  const instruction = (() => {
    switch (phase) {
      case BreathingPhase.Inhale:
        return 'Inhale';
      case BreathingPhase.Inhale2:
        return 'Inhale again';
      case BreathingPhase.HoldIn:
      case BreathingPhase.HoldOut:
        return 'Hold';
      case BreathingPhase.Exhale:
        return 'Exhale';
      default:
        return 'Ready';
    }
  })();

  const remainingSeconds =
    selectedDuration === null ? null : Math.max(selectedDuration - sessionSeconds, 0);

  const buildBlobPath = (
    baseRadius: number,
    wobbleA: number,
    wobbleB: number,
    phaseOffset: number,
    scaleOffset: number,
  ) => {
    const points = 32;
    const cx = blobCanvasSize / 2;
    const cy = blobCanvasSize / 2;
    let path = '';
    for (let i = 0; i < points; i += 1) {
      const t = (i / points) * Math.PI * 2;
      const wobble =
        Math.sin(t * 2 + scale * (2.2 + scaleOffset) + phaseOffset) * wobbleA +
        Math.sin(t * 4 - scale * 1.8 + phaseOffset * 0.7) * wobbleB;
      const r = baseRadius * (1 + wobble);
      const x = cx + r * Math.cos(t);
      const y = cy + r * Math.sin(t);
      path += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
    }
    return `${path}Z`;
  };

  const blobPath = useMemo(
    () => buildBlobPath(radius * 0.995, 0.015, 0.008, wobblePhase, 0),
    [blobCanvasSize, radius, scale, wobblePhase],
  );
  const ringPath = useMemo(
    () => buildBlobPath(radius * 1.07, 0.02, 0.012, wobblePhase + 0.4, 0.6),
    [blobCanvasSize, radius, scale, wobblePhase],
  );

  useEffect(() => {
    if (width === 0 || height === 0) return;
    const previous = particleBoundsRef.current;
    if (previous.width !== width || previous.height !== height || particlesRef.current.length === 0) {
      particleBoundsRef.current = { width, height };
      const count = width < 390 ? 80 : 110;
      particlesRef.current = Array.from({ length: count }, () => createParticle(width, height));
      lastParticleTimeRef.current = 0;
    }
  }, [width, height]);

  useEffect(() => {
    const tick = (timestamp: number) => {
      const w = particleBoundsRef.current.width || width;
      const h = particleBoundsRef.current.height || height;
      if (w > 0 && h > 0 && particlesRef.current.length > 0) {
        const deltaSeconds = lastParticleTimeRef.current
          ? Math.min(Math.max((timestamp - lastParticleTimeRef.current) / 1000, 0), 0.05)
          : 0.016;
        lastParticleTimeRef.current = timestamp;

        let targetRadialSpeed = 0;
        let targetDriftSpeed = 0.35 * SPEED_PER_SECOND;

        if (phaseRef.current === BreathingPhase.Inhale) {
          targetRadialSpeed = -3.8 * SPEED_PER_SECOND;
          targetDriftSpeed = 0.55 * SPEED_PER_SECOND;
        } else if (phaseRef.current === BreathingPhase.Exhale) {
          targetRadialSpeed = 1.8 * SPEED_PER_SECOND;
          targetDriftSpeed = 0.55 * SPEED_PER_SECOND;
        } else if (
          phaseRef.current === BreathingPhase.HoldIn ||
          phaseRef.current === BreathingPhase.HoldOut
        ) {
          targetRadialSpeed = 0;
          targetDriftSpeed = 0.6 * SPEED_PER_SECOND;
        }

        targetRadialSpeed *= speedMultiplierRef.current;

        smoothedRadialSpeedRef.current +=
          (targetRadialSpeed - smoothedRadialSpeedRef.current) * 0.06;
        smoothedDriftSpeedRef.current +=
          (targetDriftSpeed - smoothedDriftSpeedRef.current) * 0.06;

        particlesRef.current.forEach((particle) => {
          updateParticle(
            particle,
            smoothedRadialSpeedRef.current,
            smoothedDriftSpeedRef.current,
            deltaSeconds,
            w,
            h,
          );
        });

        setParticleFrame((value) => (value + 1) % 100000);
      }

      particleAnimationRef.current = requestAnimationFrame(tick);
    };

    particleAnimationRef.current = requestAnimationFrame(tick);

    return () => {
      if (particleAnimationRef.current) {
        cancelAnimationFrame(particleAnimationRef.current);
      }
    };
  }, [height, width]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: theme.backgroundFrom }}>
      {keepAwakeEnabled && isRunning ? <KeepAwakeGuard /> : null}

      <View className="flex-1">
        <Canvas
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          pointerEvents="none"
        >
          <Rect x={0} y={0} width={width} height={height}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(width, height)}
              colors={[theme.backgroundFrom, theme.backgroundTo]}
            />
          </Rect>
          {particlesRef.current.map((particle, index) => (
            <Circle
              key={`bg-particle-${index}`}
              cx={particle.x}
              cy={particle.y}
              r={particle.size}
              color={toRgba(theme.particle, Math.min(particle.alpha, 0.7))}
            />
          ))}
        </Canvas>
        <View className="flex-1 items-center justify-center px-6">
          <Pressable
            onPress={isRunning ? handleStop : handleStart}
            className="items-center justify-center"
            style={{ width: blobCanvasSize, height: blobCanvasSize }}
          >
            <Canvas style={{ width: blobCanvasSize, height: blobCanvasSize }}>
              <Path path={blobPath} color={pattern.color} />
              <Path path={ringPath} color={ringColor} style="stroke" strokeWidth={4} />
            </Canvas>
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text className="text-2xl font-semibold" style={{ color: theme.onAccent }}>
                {instruction}
              </Text>
              {remainingSeconds === null ? null : (
                <Text className="mt-1 text-xs uppercase tracking-widest" style={{ color: theme.onAccent }}>
                  {`Remaining ${formatTime(remainingSeconds)}`}
                </Text>
              )}
              <Text
                className="mt-2 text-[10px] uppercase tracking-[0.3em]"
                style={{ color: theme.onAccent }}
              >
                {isRunning ? 'Tap to pause' : 'Tap to start'}
              </Text>
            </View>
          </Pressable>
        </View>

        <View
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 20,
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={() => setSettingsOpen(true)}
            className="items-center rounded-full px-5 py-2"
            style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.surfaceBorder }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 999,
                backgroundColor: theme.surfaceBorder,
              }}
            />
          </Pressable>
        </View>
      </View>

      <Modal transparent visible={settingsOpen} animationType="slide">
        <View className="flex-1 justify-end bg-black/30">
          <Pressable
            onPress={() => setSettingsOpen(false)}
            style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
          />
          <View
            className="w-full rounded-t-3xl p-5"
            style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.surfaceBorder }}
          >
            <View className="items-center">
              <View
                style={{
                  width: 44,
                  height: 4,
                  borderRadius: 999,
                  backgroundColor: theme.surfaceBorder,
                }}
              />
            </View>
            <View className="mt-4 flex-row items-center justify-between">
              <Text className="text-lg font-semibold" style={{ color: theme.text }}>
                Settings
              </Text>
              <Pressable onPress={() => setSettingsOpen(false)}>
                <Text className="text-sm" style={{ color: theme.muted }}>
                  Close
                </Text>
              </Pressable>
            </View>

            <View className="mt-5">
              <Text className="mb-2 text-xs uppercase tracking-widest" style={{ color: theme.muted }}>
                Mode
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {MODE_LIST.map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => handleModeChange(item)}
                    className="rounded-full px-3 py-2"
                    style={{
                      backgroundColor: item === mode ? theme.accent : theme.surfaceAlt,
                      borderWidth: item === mode ? 0 : 1,
                      borderColor: theme.surfaceBorder,
                    }}
                  >
                    <Text
                      className="text-xs"
                      style={{ color: item === mode ? theme.onAccent : theme.text }}
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View className="mt-5">
              <Text className="mb-2 text-xs uppercase tracking-widest" style={{ color: theme.muted }}>
                Session Length
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {DURATION_OPTIONS.map((option) => {
                  const active = option.value === selectedDuration;
                  return (
                    <Pressable
                      key={option.label}
                      onPress={() => handleDurationChange(option.value)}
                      className="rounded-full px-3 py-1"
                      style={{
                        backgroundColor: active ? theme.accent : theme.surfaceAlt,
                        borderWidth: active ? 0 : 1,
                        borderColor: theme.surfaceBorder,
                      }}
                    >
                      <Text className="text-xs" style={{ color: active ? theme.onAccent : theme.text }}>
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="mt-5">
              <Text className="mb-2 text-xs uppercase tracking-widest" style={{ color: theme.muted }}>
                Speed
              </Text>
              <View className="flex-row gap-2">
                {speedOptions.map((value) => {
                  const active = value === speedMultiplier;
                  return (
                    <Pressable
                      key={value}
                      onPress={() => setSpeedMultiplier(value)}
                      className="rounded-full px-3 py-1"
                      style={{
                        backgroundColor: active ? theme.accent : theme.surfaceAlt,
                        borderWidth: active ? 0 : 1,
                        borderColor: theme.surfaceBorder,
                      }}
                    >
                      <Text className="text-xs" style={{ color: active ? theme.onAccent : theme.text }}>
                        {value.toFixed(2).replace(/\\.00$/, '')}x
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View className="mt-5">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm" style={{ color: theme.text }}>
                  Sound
                </Text>
                <Switch value={!muted} onValueChange={(value) => setMuted(!value)} />
              </View>
              <View className="mt-3 flex-row items-center justify-between">
                <Text className="text-sm" style={{ color: theme.text }}>
                  Haptics
                </Text>
                <Switch value={hapticsEnabled} onValueChange={setHapticsEnabled} />
              </View>
              <View className="mt-3 flex-row items-center justify-between">
                <Text className="text-sm" style={{ color: theme.text }}>
                  Keep Awake
                </Text>
                <Switch value={keepAwakeEnabled} onValueChange={setKeepAwakeEnabled} />
              </View>
            </View>

            <Pressable
              onPress={resetStats}
              className="mt-5 rounded-full px-4 py-2"
              style={{ backgroundColor: theme.surfaceAlt, borderWidth: 1, borderColor: theme.surfaceBorder }}
            >
              <Text className="text-center text-sm" style={{ color: theme.text }}>
                Reset Stats
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
