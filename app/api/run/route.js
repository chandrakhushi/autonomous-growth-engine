import { NextResponse } from "next/server";
import { pickScenario } from "@/lib/scenarios";

// POST /api/run
// Request:  { "prompt": "analyze onboarding friction around export" }
// Response: { area, signal, insight, asset, ticket, pr, summary }
//
// This is the single integration seam for the team. Today it resolves a
// scripted scenario (reliable for demos, no keys needed). To make it live,
// replace the body below with real calls:
//   1. signal  -> PostHog query API (events in the last window)
//   2. insight -> LLM/heuristic over the events
//   3. asset   -> generated code/content diff
//   4. ticket  -> Linear GraphQL `issueCreate`
//   5. pr      -> GitHub `POST /repos/{owner}/{repo}/pulls`
// Auth/connection tokens are expected to come from the Scalekit-backed
// connection layer (teammates) via env vars or a per-request header.
export async function POST(req) {
  let body = {};
  try {
    body = await req.json();
  } catch {
    // empty/invalid body is fine — we fall back to the default scenario
  }

  const prompt = typeof body.prompt === "string" ? body.prompt : "";
  const scenario = pickScenario(prompt);

  const summary = `Shipped 1 change for the ${scenario.insight.area} loop — ${scenario.ticket.id} filed and PR #${scenario.pr.number} opened. ${scenario.insight.impact}.`;

  return NextResponse.json({
    mode: "simulated", // teammates flip this to "live" when real connectors are wired
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
