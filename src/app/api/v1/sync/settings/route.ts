import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { pool } from "@/lib/db";
import { headers } from "next/headers";

export async function PUT(request: NextRequest) {
  const session = await auth.api.getSession({ headers: headers() });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const userId = session.user.id;

  await pool.query(
    `INSERT INTO user_settings (user_id, mode, speed_multiplier, selected_duration, muted, theme, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, now())
     ON CONFLICT (user_id) DO UPDATE SET
       mode = EXCLUDED.mode,
       speed_multiplier = EXCLUDED.speed_multiplier,
       selected_duration = EXCLUDED.selected_duration,
       muted = EXCLUDED.muted,
       theme = EXCLUDED.theme,
       updated_at = now()`,
    [
      userId,
      body.mode ?? "Box Breathing",
      body.speedMultiplier ?? 1.0,
      body.selectedDuration ?? null,
      body.muted ?? false,
      body.theme ?? "system",
    ]
  );

  return NextResponse.json({ ok: true });
}
