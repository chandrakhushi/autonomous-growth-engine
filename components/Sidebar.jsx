"use client";

import ConnectorsPanel from "./ConnectorsPanel";
import { GrowthBars } from "./icons";

const HISTORY = [
  { label: "Export discoverability loop", active: true },
  { label: "Pricing page team buyers" },
  { label: "SEO: import-limits page" },
  { label: "Weekly growth digest" },
];

export default function Sidebar({ onNew }) {
  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-bg">
      <div className="flex items-center gap-2 px-4 py-4">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-onaccent">
          <GrowthBars className="h-5 w-5" />
        </span>
        <div className="leading-tight">
          <p className="text-sm font-semibold text-ink">Growth Engine</p>
          <p className="text-[10px] text-sub">autonomous · self-improving</p>
        </div>
      </div>

      <div className="px-3">
        <button
          onClick={onNew}
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-panel px-3 py-2 text-sm text-ink hover:bg-panel2"
        >
          <span className="text-base leading-none">+</span> New analysis
        </button>
      </div>

      <nav className="mt-4 flex-1 space-y-0.5 overflow-y-auto px-3">
        <p className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-sub">
          Recent loops
        </p>
        {HISTORY.map((h, i) => (
          <button
            key={i}
            className={`block w-full truncate rounded-lg px-2 py-2 text-left text-sm hover:bg-panel ${
              h.active ? "bg-panel text-ink" : "text-sub"
            }`}
          >
            {h.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <ConnectorsPanel />
      </div>
    </aside>
  );
}
