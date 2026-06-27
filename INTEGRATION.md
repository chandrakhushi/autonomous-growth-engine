# Integration Guide

This app is the **chat UI + agent-run orchestration** for the Autonomous Growth
Engine. It's built so the three partner systems plug into well-marked seams with
**no UI rewrites**. Hackathon stack: **Scalekit** (connectors/auth), **Actian**
(history database), **Render** (hosting), with **PostHog** as the behavioral signal source.

```
 Teammates' website  →  PostHog (events)  →  insight  →  asset  →  Linear ticket + GitHub PR
                              │                                          │
                              └──────────  Actian DB (past encounters) ──┘
                        connectors authorized via Scalekit
```

## The one seam that matters: `POST /api/run`

File: [`app/api/run/route.js`](app/api/run/route.js)

```
POST /api/run   { "prompt": string }
  -> { mode, area, signal, insight, asset, ticket, pr, summary }
```

Today it returns a **scripted** scenario (`lib/scenarios.js`, `mode: "simulated"`).
Going live = replacing the body with real calls. Nothing in the UI changes.

| Step in the response | Replace with | Owner |
|----------------------|--------------|-------|
| `signal`  | Real **PostHog** query (events in the window) | PostHog |
| `insight` | LLM/heuristic over the events → headline + impact | (agent) |
| `asset`   | Generated code/content diff | (agent) |
| `ticket`  | **Linear** `issueCreate` (GraphQL) → real ticket id/url | Scalekit-authorized Linear |
| `pr`      | **GitHub** `POST /repos/{owner}/{repo}/pulls` → real PR | Scalekit-authorized GitHub |

Connector tokens (Linear/GitHub) should come from the **Scalekit** connection
layer — either injected as request context or fetched server-side by connection id.

## Seam 2 — Scalekit connectors (the bottom-left panel)

File: [`components/ConnectorsPanel.jsx`](components/ConnectorsPanel.jsx)

Right now the toggles are local state. To make them real:
- On mount, fetch connection status from Scalekit (which connectors are authorized).
- "Add connector" / toggling on → kick off the Scalekit OAuth/connect flow.
- Pass the resulting connection id(s) to `/api/run` so the backend can act as the user.

## Seam 3 — Actian history ("Recent loops")

File: [`components/Sidebar.jsx`](components/Sidebar.jsx) (the hardcoded `HISTORY` array)

Each completed run should be persisted to **Actian** and listed here as "past
encounters." Suggested shape:
- `POST /api/history` — save a finished run (`{prompt, area, ticket, pr, summary, ts}`).
- `GET /api/history` — list past runs for the sidebar; clicking one re-renders it.

Add these as new route files under `app/api/history/` when the Actian connection
string is available (store it as a Render env var, e.g. `ACTIAN_CONNECTION`).

## Render env vars to add when going live

Set these in the Render dashboard (Environment tab) — never commit them:

```
ANTHROPIC_API_KEY      # if the insight/asset step uses Claude
SCALEKIT_*             # Scalekit client/env credentials
ACTIAN_CONNECTION      # Actian history DB
# Linear/GitHub tokens come via Scalekit, not direct env vars (preferred)
```

## What's done vs pending

- [x] Chat UI, connectors panel, light/dark theme
- [x] `/api/run` seam + simulated runs (reliable demo with zero keys)
- [x] Deployed to Render
- [ ] PostHog real signals (waiting on teammates' website)
- [ ] Scalekit connector auth
- [ ] Actian history persistence
- [ ] Real Linear/GitHub actions
