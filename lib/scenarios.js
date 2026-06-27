// Scripted agent runs. Each scenario is: one signal -> one insight -> one asset
// -> one Linear ticket -> one GitHub PR. This is the MVP loop, kept deliberately
// small (the whole point of the project is depth on one loop, not breadth).

export const SCENARIOS = {
  export: {
    trigger: ["export", "data", "onboarding"],
    signal: {
      title: "PostHog signal detected",
      source: "posthog",
      window: "last 24h · 1,204 sessions",
      events: [
        { type: "search_query", text: '"how to export data"', count: 47, trend: "+38%" },
        { type: "page_dropoff", text: "/dashboard → exit", count: 23, trend: "+12%" },
        { type: "feature_confusion", text: "Export button hovered, not clicked", count: 31, trend: "+51%" },
      ],
    },
    insight: {
      headline: "Users can't find data export",
      confidence: 0.86,
      area: "Onboarding",
      body:
        "47 users searched for export and 31 hovered the Export button without clicking. The control is below the fold on /dashboard and lacks a label. This is the single largest friction cluster this week.",
      impact: "Est. +6.2% activation on the dashboard funnel",
    },
    asset: {
      kind: "Onboarding tooltip + relocated CTA",
      filename: "components/ExportButton.tsx",
      language: "tsx",
      diff: `   <div className="dashboard-actions">
+    <Tooltip content="Export your data as CSV or JSON">
       <button
         className="export-btn"
+        aria-label="Export data"
+        data-onboarding="export"
         onClick={openExportModal}
       >
-        <DownloadIcon />
+        <DownloadIcon /> Export
       </button>
+    </Tooltip>
   </div>`,
    },
    ticket: {
      id: "GRW-204",
      title: "Surface data export on dashboard (high search + confusion signal)",
      priority: "High",
      team: "Growth",
      labels: ["onboarding", "auto-generated", "posthog"],
    },
    pr: {
      number: 482,
      branch: "growth/export-discoverability",
      repo: "acme/web-app",
      title: "feat(onboarding): label + tooltip on dashboard Export CTA",
      additions: 7,
      deletions: 2,
      files: 1,
      checks: "passing",
    },
  },

  pricing: {
    trigger: ["pricing", "price", "upgrade", "plan"],
    signal: {
      title: "PostHog signal detected",
      source: "posthog",
      window: "last 7d · 6,820 sessions",
      events: [
        { type: "page_dropoff", text: "/pricing → exit (no scroll)", count: 188, trend: "+22%" },
        { type: "search_query", text: '"team pricing" / "per seat"', count: 64, trend: "+44%" },
        { type: "feature_confusion", text: "Toggle monthly/annual clicked 3+ times", count: 41, trend: "+19%" },
      ],
    },
    insight: {
      headline: "Pricing page loses team buyers",
      confidence: 0.79,
      area: "Pricing",
      body:
        "Team buyers search for per-seat pricing but the page leads with a personal plan and a confusing billing toggle. 188 exits with no scroll suggests the value prop never lands for this segment.",
      impact: "Est. +3.4% pricing→checkout conversion",
    },
    asset: {
      kind: "Per-seat plan card + clearer toggle copy",
      filename: "app/pricing/plans.ts",
      language: "ts",
      diff: ` export const plans = [
   { id: "pro", name: "Pro", price: 20, unit: "mo" },
+  {
+    id: "team",
+    name: "Team",
+    price: 16,
+    unit: "seat/mo",
+    badge: "Most popular for teams",
+    highlight: true,
+  },
 ];`,
    },
    ticket: {
      id: "GRW-205",
      title: "Add per-seat Team plan + fix billing toggle copy",
      priority: "High",
      team: "Growth",
      labels: ["pricing", "auto-generated", "posthog"],
    },
    pr: {
      number: 483,
      branch: "growth/team-pricing-card",
      repo: "acme/web-app",
      title: "feat(pricing): introduce per-seat Team plan",
      additions: 11,
      deletions: 1,
      files: 2,
      checks: "passing",
    },
  },

  seo: {
    trigger: ["seo", "search", "traffic", "blog"],
    signal: {
      title: "PostHog + Search Console signal",
      source: "posthog",
      window: "last 30d · organic landing pages",
      events: [
        { type: "search_query", text: 'Internal: "csv import limits"', count: 92, trend: "+61%" },
        { type: "page_dropoff", text: "/docs (no matching page)", count: 77, trend: "+28%" },
        { type: "feature_confusion", text: "404 on /import-limits", count: 18, trend: "new" },
      ],
    },
    insight: {
      headline: "High-intent query has no landing page",
      confidence: 0.82,
      area: "SEO",
      body:
        "92 internal searches and a recurring 404 for import limits show real demand with no page to capture it. A focused doc/landing page should rank and reduce support load.",
      impact: "Est. +1.9k monthly organic sessions",
    },
    asset: {
      kind: "New SEO landing page (MDX)",
      filename: "content/import-limits.mdx",
      language: "md",
      diff: `+---
+title: "CSV Import Limits & How to Raise Them"
+description: "File size, row caps, and rate limits for CSV import — and how to increase them."
+slug: import-limits
+---
+
+# CSV Import Limits
+
+Your plan controls how much you can import at once...`,
    },
    ticket: {
      id: "GRW-206",
      title: "Publish 'CSV Import Limits' landing page (unmet search demand)",
      priority: "Medium",
      team: "Growth",
      labels: ["seo", "auto-generated", "posthog"],
    },
    pr: {
      number: 484,
      branch: "growth/seo-import-limits",
      repo: "acme/web-app",
      title: "feat(seo): add import-limits landing page",
      additions: 38,
      deletions: 0,
      files: 1,
      checks: "running",
    },
  },
};

export function pickScenario(text) {
  const t = (text || "").toLowerCase();
  for (const key of Object.keys(SCENARIOS)) {
    if (SCENARIOS[key].trigger.some((w) => t.includes(w))) return SCENARIOS[key];
  }
  // default: rotate to export loop
  return SCENARIOS.export;
}
