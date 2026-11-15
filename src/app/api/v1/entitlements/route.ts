import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { resolveEntitlement } from "@resonance/access-control";
import type { EntitlementsResponse } from "@resonance/api-contracts";
import type { ApiResponse } from "@resonance/api-contracts";

// Never prerendered at build time. These handlers read request state (session,
// database) and a build-time prerender attempt evaluates that state with no env
// configured, which crashed the static worker on deployments without secrets.
// Cacheability is expressed per-response via Cache-Control, not by prerendering.
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<ApiResponse<EntitlementsResponse>>> {
  const session = await auth.api.getSession({ headers: await headers() });

  const now = new Date().toISOString();

  if (!session) {
    const { snapshot } = resolveEntitlement({
      userId: null,
      plan: "free",
      effectiveAt: now,
    });
    return NextResponse.json({ data: snapshot, error: null });
  }

  const userId = session.user.id;

  const plan = "free" as const;

  const { snapshot } = resolveEntitlement({
    userId,
    plan,
    effectiveAt: now,
  });

  return NextResponse.json({ data: snapshot, error: null });
}
