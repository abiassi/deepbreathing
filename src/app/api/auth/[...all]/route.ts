import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = handler.GET;

// Wrap POST to catch and log errors
export async function POST(request: Request) {
  try {
    return await handler.POST(request);
  } catch (error) {
    console.error("[auth] POST error:", error);
    return new Response(
      JSON.stringify({ error: "Internal auth error", message: String(error) }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
