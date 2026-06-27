import { NextResponse } from "next/server";
import { BACKEND_URL, IDENTIFIER } from "@/lib/backend";

// POST /api/connections/:provider/link — proxies to the backend, returns { authUrl }
// (the Scalekit OAuth/magic link the user clicks to connect the provider).
export async function POST(req, { params }) {
  const provider = params.provider; // Next 14: sync params
  let body = {};
  try {
    body = await req.json();
  } catch {
    // empty body is fine
  }
  const identifier = body.identifier || IDENTIFIER;
  try {
    const r = await fetch(`${BACKEND_URL}/api/connections/${provider}/link`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
      cache: "no-store",
    });
    return NextResponse.json(await r.json(), { status: r.status });
  } catch {
    return NextResponse.json({ error: "backend_unreachable" }, { status: 502 });
  }
}
