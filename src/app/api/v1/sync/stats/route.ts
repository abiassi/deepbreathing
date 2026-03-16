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

  // Only update if client total >= server total (monotonic, no data loss)
  await pool.query(
    `INSERT INTO user_stats (user_id, total_minutes, sessions_completed, updated_at)
     VALUES ($1, $2, $3, now())
     ON CONFLICT (user_id) DO UPDATE SET
       total_minutes = GREATEST(user_stats.total_minutes, EXCLUDED.total_minutes),
       sessions_completed = GREATEST(user_stats.sessions_completed, EXCLUDED.sessions_completed),
       updated_at = now()`,
    [userId, body.totalMinutes ?? 0, body.sessionsCompleted ?? 0]
  );

  return NextResponse.json({ ok: true });
}
