"use client";

import { useState } from "react";
import { LinearIcon, GitHubIcon, PostHogIcon, CheckIcon } from "./icons";

const CONNECTORS = [
  {
    id: "posthog",
    name: "PostHog",
    desc: "Product analytics — event signals",
    icon: PostHogIcon,
    color: "text-amber-400",
    defaultOn: true,
  },
  {
    id: "linear",
    name: "Linear",
    desc: "File tickets for generated work",
    icon: LinearIcon,
    color: "text-indigo-400",
    defaultOn: true,
  },
  {
    id: "github",
    name: "GitHub",
    desc: "Open PRs with the generated change",
    icon: GitHubIcon,
    color: "text-ink",
    defaultOn: true,
  },
];

export default function ConnectorsPanel() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(
    Object.fromEntries(CONNECTORS.map((c) => [c.id, c.defaultOn]))
  );
  const connectedCount = Object.values(state).filter(Boolean).length;

  return (
    <div className="relative">
      {open && (
        <div className="absolute bottom-12 left-0 w-72 animate-fadein rounded-xl border border-border bg-panel p-2 shadow-2xl">
          <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-sub">
            Connectors
          </p>
          {CONNECTORS.map((c) => {
            const Icon = c.icon;
            const on = state[c.id];
            return (
              <button
                key={c.id}
                onClick={() => setState((s) => ({ ...s, [c.id]: !s[c.id] }))}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-panel2"
              >
                <span className={`${c.color}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">{c.name}</span>
                  <span className="block text-[11px] text-sub">{c.desc}</span>
                </span>
                <span
                  className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${
                    on ? "bg-emerald-500/80" : "bg-border"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${
                      on ? "translate-x-4" : ""
                    }`}
                  />
                </span>
              </button>
            );
          })}
          <div className="mt-1 border-t border-border px-2 pt-2">
            <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-sub hover:bg-panel2 hover:text-ink">
              + Add connector
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-panel2 px-3 py-2 text-left hover:bg-border"
      >
        <span className="flex -space-x-1.5">
          {CONNECTORS.filter((c) => state[c.id]).map((c) => {
            const Icon = c.icon;
            return (
              <span
                key={c.id}
                className={`flex h-6 w-6 items-center justify-center rounded-full border border-bg bg-panel ${c.color}`}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
            );
          })}
        </span>
        <span className="flex-1 text-xs text-sub">
          {connectedCount} connector{connectedCount !== 1 ? "s" : ""} active
        </span>
        <CheckIcon className="w-4 h-4 text-emerald-400" />
      </button>
    </div>
  );
}
