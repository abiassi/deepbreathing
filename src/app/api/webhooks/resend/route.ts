import { Webhook } from "svix";
import { Pool } from "pg";
import { NextRequest, NextResponse } from "next/server";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

type ResendEvent = {
  type: "email.bounced" | "email.complained";
  data: { to: string[] };
};

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  if (!secret) return NextResponse.json({ error: "not configured" }, { status: 500 });

  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "missing svix headers" }, { status: 400 });
  }

  const body = await req.text();
  let event: ResendEvent;
  try {
    event = new Webhook(secret).verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ResendEvent;
  } catch {
    return NextResponse.json({ error: "invalid signature" }, { status: 401 });
  }

  if (event.type === "email.bounced" || event.type === "email.complained") {
    const email = event.data.to?.[0]?.toLowerCase();
    if (email) {
      const reason = event.type === "email.bounced" ? "bounce" : "complaint";
      await pool.query(
        `INSERT INTO email_suppressions (email, reason, created_at)
         VALUES ($1, $2, NOW())
         ON CONFLICT (email) DO UPDATE SET reason = $2, created_at = NOW()`,
        [email, reason]
      );
      console.log(`[resend-webhook] suppressed ${email} reason=${reason}`);
    }
  }

  return NextResponse.json({ received: true });
}
