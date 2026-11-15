"use client";

export type ConversionVariant =
  | "control"
  | "social_stats"
  | "loss_aversion"
  | "loss_aversion_banner"
  | "keep_practice";

export const ACTIVE_CHALLENGER: ConversionVariant = "keep_practice";

/** 0 rolls every visitor back to control; 1 sends every visitor to ACTIVE_CHALLENGER. */
export const CHALLENGER_SHARE = 1;

/** Unused. ACTIVE_CHALLENGER and CHALLENGER_SHARE drive assignment. */
export const SOCIAL_STATS_SHARE = 1;

const VARIANT_KEY = "resonance_conversion_variant_v6";

function isVariant(v: unknown): v is ConversionVariant {
  return (
    v === "control" ||
    v === "social_stats" ||
    v === "loss_aversion" ||
    v === "loss_aversion_banner" ||
    v === "keep_practice"
  );
}

export function getConversionVariant(): ConversionVariant {
  if (typeof window === "undefined") return "control";
  try {
    const saved = localStorage.getItem(VARIANT_KEY);
    if (isVariant(saved)) return saved;
    const assigned: ConversionVariant =
      Math.random() < CHALLENGER_SHARE ? ACTIVE_CHALLENGER : "control";
    localStorage.setItem(VARIANT_KEY, assigned);
    return assigned;
  } catch {
    return "control";
  }
}

/**
 * Read-only lookup that never assigns a bucket. Use where we only want to
 * attach the already-assigned bucket to an event (e.g. signup_user_identified,
 * which can fire after an OAuth round-trip).
 */
export function readConversionVariant(): ConversionVariant {
  if (typeof window === "undefined") return "control";
  try {
    const saved = localStorage.getItem(VARIANT_KEY);
    return isVariant(saved) ? saved : "control";
  } catch {
    return "control";
  }
}

/**
 * Force-persist a variant bucket. Used to tag the non-blocking banner cohort
 * (`loss_aversion_banner`) so the existing funnel events — conversion_prompt_shown,
 * conversion_signup_completed, signup_user_identified — and the `conversion_variant`
 * GA4 user property all carry it, segmenting "saw + registered via the banner" from
 * the modal. Idempotent.
 */
export function setConversionVariant(v: ConversionVariant) {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(VARIANT_KEY) !== v) localStorage.setItem(VARIANT_KEY, v);
  } catch {
  }
}
