import { NextResponse } from "next/server";
import { BACKEND_URL, IDENTIFIER } from "@/lib/backend";

// GET /api/connections/status — proxies the backend's connector status so the
// ConnectorsPanel can show ACTIVE / PENDING / NOT_CONNECTED. Same-origin (no CORS).
export async function GET(req) {
  const identifier = new URL(req.url).searchParams.get("identifier") || IDENTIFIER;
  try {
    const r = await fetch(
      `${BACKEND_URL}/api/connections/status?identifier=${encodeURIComponent(identifier)}`,
      { cache: "no-store" }
    );
    if (r.ok) return NextResponse.json(await r.json());
  } catch {
    // backend unreachable — fall through
  }
  return NextResponse.json({ identifier, connections: {} });
}
