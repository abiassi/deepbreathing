import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const ALLOWED_ORIGINS = [
  "https://deepbreathingexercises.com",
  "https://origin.deepbreathingexercises.com",
  "http://localhost:3000",
];

function withCors(response: Response, origin: string | null) {
  const allowedOrigin = ALLOWED_ORIGINS.find((o) => o === origin);
  if (!allowedOrigin) return response;

  const headers = new Headers(response.headers);
  headers.set("Access-Control-Allow-Origin", allowedOrigin);
  headers.set("Access-Control-Allow-Credentials", "true");
  headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  headers.set("Access-Control-Allow-Headers", "Content-Type");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

const handler = toNextJsHandler(auth);

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  const response = await handler.GET(request);
  return withCors(response, origin);
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  try {
    const response = await handler.POST(request);
    return withCors(response, origin);
  } catch (error) {
    console.error("[auth] POST error:", error);
    return withCors(
      new Response(
        JSON.stringify({ error: "Internal auth error", message: String(error) }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      ),
      origin
    );
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return withCors(new Response(null, { status: 204 }), origin);
}
