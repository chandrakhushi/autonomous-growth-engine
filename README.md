# Autonomous Growth Engine

> A system that continuously learns from real user behavior and automatically generates and deploys onboarding, SEO, and pricing improvements—using real user identity to publish changes safely.

This is the **chat UI** for the hackathon project — a ChatGPT/Claude-style interface
that drives the core loop:

```
one signal  →  one insight  →  one generated asset  →  one deployed change
 (PostHog)      (the agent)       (code/content)         (Linear + GitHub)
```

## Run it

```bash
npm install
npm run dev      # http://localhost:3939
```

## What's in the UI

- **Chat thread** (like Claude/ChatGPT) where the agent run streams step-by-step.
- **Connectors panel** (bottom-left, like Claude Desktop) to toggle **PostHog**, **Linear**, and **GitHub**.
- **Three scenarios**, picked by keyword in your prompt:
  - `export` / `onboarding` → onboarding tooltip fix
  - `pricing` / `plan` → per-seat Team plan
  - `seo` / `search` → new SEO landing page
- Each run renders rich cards: **Signal → Insight → Generated asset (diff) → Linear ticket → GitHub PR**, then a ship summary.

## Demo connectors

Connectors and the Linear/GitHub actions are **simulated** for a reliable live demo —
no API keys required. The scripted runs live in [`lib/scenarios.js`](lib/scenarios.js).
To wire real APIs later, replace `pickScenario` output with live calls to the
PostHog query API, Linear GraphQL `issueCreate`, and the GitHub `pulls` API.

## Structure

| Path | Purpose |
|------|---------|
| `app/page.jsx` | Main chat page + run orchestration |
| `components/Sidebar.jsx` | Left rail + connectors |
| `components/ConnectorsPanel.jsx` | Claude-Desktop-style connector toggles |
| `components/Composer.jsx` | Chat input box |
| `components/RunMessage.jsx` | Streams the agent steps |
| `components/StepCard.jsx` | Signal / Insight / Asset / Ticket / PR cards |
| `lib/scenarios.js` | The scripted signal→ship runs |
