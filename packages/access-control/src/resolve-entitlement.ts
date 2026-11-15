/**
 * Rules:
 *  - No session (guest)      → plan "free", capabilities [] (empty = gated)
 *  - Authenticated, no sub   → plan "free", capabilities from PLAN_CAPABILITIES.free
 *  - Authenticated, pro sub  → plan "pro",  capabilities from PLAN_CAPABILITIES.pro
 *
 * Why guests get plan:"free" with empty capabilities: EntitlementSnapshot.plan
 * is typed as Plan ("free"|"pro") with no "guest" variant. Empty capabilities
 * let the app distinguish guest-free from authenticated-free without a schema
 * change, and getFeatureAccess() blocks guests via the UserState guard.
 */

import { capabilitiesForPlan } from "./index";
import type { EntitlementSnapshot } from "@resonance/domain";

export interface ResolveEntitlementInput {
  userId: string | null;
  /**
   * The resolved plan for this user.
   * - Pass "free"  for authenticated users with no active subscription.
   * - Pass "pro"   for users with an active entitlement.
   * When userId is null (guest) this value is ignored.
   */
  plan: "free" | "pro";
  /**
   * The ISO-8601 timestamp to stamp as effectiveAt.
   * Injected rather than derived from Date.now() so callers and tests can
   * produce stable, deterministic snapshots.
   */
  effectiveAt: string;
}

export interface EntitlementResult {
  snapshot: EntitlementSnapshot;
  userState: "guest" | "authenticated_free" | "authenticated_pro";
}

export function resolveEntitlement(input: ResolveEntitlementInput): EntitlementResult {
  const { userId, plan, effectiveAt } = input;

  if (userId === null) {
    return {
      snapshot: {
        userId: "guest",
        plan: "free",
        capabilities: [],
        effectiveAt,
        expiresAt: null,
      },
      userState: "guest",
    };
  }

  const capabilities = capabilitiesForPlan(plan);

  return {
    snapshot: {
      userId,
      plan,
      capabilities,
      effectiveAt,
      expiresAt: null,
    },
    userState: plan === "pro" ? "authenticated_pro" : "authenticated_free",
  };
}
