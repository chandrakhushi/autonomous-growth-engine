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

## Deploy to Render

The app is Render-ready: it binds to `$PORT`, pins Node 20, and ships a
[`render.yaml`](render.yaml) blueprint. The repo must live on the GitHub account
your Render is connected to (your **personal** GitHub).

**1. Create the repo on your personal GitHub** (github.com → New repository →
`autonomous-growth-engine`, empty, no README).

**2. Push from this folder** (replace `<you>` with your personal username):

```bash
cd ~/Desktop/autonomous-growth-engine
git remote add origin https://github.com/<you>/autonomous-growth-engine.git
git branch -M main
git push -u origin main
```

> The terminal here is signed into the *work* GitHub account. When `git push`
> prompts, authenticate as your **personal** account (use a personal access
> token as the password, or `gh auth login` as the personal account first).

**3. Deploy on Render** (one of two ways):

- *Blueprint (uses `render.yaml`):* Render dashboard → **New → Blueprint** →
  pick the repo → it reads `render.yaml` and provisions the web service.
- *Manual:* **New → Web Service** → pick the repo →
  Build `npm install && npm run build`, Start `npm start`, Health check `/api/run`.

Render injects `$PORT` automatically. First deploy takes ~2–3 min; you get a
`https://autonomous-growth-engine.onrender.com` URL.

> Plan is set to `starter` in `render.yaml` (no cold starts — good for a live
> demo, covered by your credits). Change to `free` to spend nothing.

## Integration seam (for teammates)

The UI never talks to PostHog/Linear/GitHub directly — it calls **one endpoint**:

```
POST /api/run   { "prompt": string }
  -> { mode, area, signal, insight, asset, ticket, pr, summary }
```

See [`app/api/run/route.js`](app/api/run/route.js). To go live, replace the
scripted body with real calls (PostHog query → insight → asset → Linear
`issueCreate` → GitHub `pulls`), pulling connection tokens from the
Scalekit-backed layer. Flip `mode` to `"live"`. **No UI changes needed.**

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
