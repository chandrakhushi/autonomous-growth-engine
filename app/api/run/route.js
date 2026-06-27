import { NextResponse } from "next/server";
import { pickScenario } from "@/lib/scenarios";
import { BACKEND_URL } from "@/lib/backend";

// POST /api/run
// Proxies to the backend agent microservice (the real Scalekit-connected
// signal -> insight -> asset -> ticket -> PR loop). If the backend is
// unreachable, falls back to a scripted scenario so the demo never breaks.
// Response shape is identical either way: { mode, area, signal, insight, asset,
// ticket, pr, summary }.
export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch {
    // empty/invalid body is fine
  }

  try {
    const r = await fetch(`${BACKEND_URL}/api/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (r.ok) return NextResponse.json(await r.json());
  } catch {
    // backend unreachable — fall through to the scripted fallback
  }

  const prompt = typeof body.prompt === "string" ? body.prompt : "";
  const scenario = pickScenario(prompt);
  const summary = `Shipped 1 change for the ${scenario.insight.area} loop — ${scenario.ticket.id} filed and PR #${scenario.pr.number} opened. ${scenario.insight.impact}.`;

  return NextResponse.json({
    mode: "simulated",
    area: scenario.insight.area,
    signal: scenario.signal,
    insight: scenario.insight,
    asset: scenario.asset,
    ticket: scenario.ticket,
    pr: scenario.pr,
    summary,
  });
}

export async function GET() {
  return NextResponse.json({
    service: "autonomous-growth-engine",
    endpoint: "POST /api/run",
    status: "ok",
  });
}
