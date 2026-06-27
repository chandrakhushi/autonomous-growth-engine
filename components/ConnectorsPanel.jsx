"use client";

import { useState, useEffect, useCallback } from "react";
import { LinearIcon, GitHubIcon, PostHogIcon, CheckIcon } from "./icons";

const CONNECTORS = [
  { id: "posthog", name: "PostHog", desc: "Product analytics — event signals", icon: PostHogIcon, color: "text-amber-400" },
  { id: "linear", name: "Linear", desc: "File tickets for generated work", icon: LinearIcon, color: "text-indigo-400" },
  { id: "github", name: "GitHub", desc: "Open PRs with the generated change", icon: GitHubIcon, color: "text-ink" },
];

const IDENTIFIER = "demo";

export default function ConnectorsPanel() {
  const [open, setOpen] = useState(false);
  // status: { posthog: "ACTIVE" | "PENDING" | "NOT_CONNECTED" | "ERROR" }
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch(`/api/connections/status?identifier=${IDENTIFIER}`, { cache: "no-store" });
      const d = await r.json();
      setStatus(d.connections || {});
    } catch {
      setStatus({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);
  // Re-check whenever the panel opens (e.g. after returning from the OAuth tab).
  useEffect(() => { if (open) refresh(); }, [open, refresh]);

  async function connect(id) {
    setConnecting(id);
    setError(null);
    try {
      const r = await fetch(`/api/connections/${id}/link`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: IDENTIFIER }),
      });
      const d = await r.json();
      if (d.authUrl) window.open(d.authUrl, "_blank", "noopener,noreferrer");
      else setError(d.message || d.error || "Could not start the connect flow.");
    } catch {
      setError("Could not reach the backend.");
    } finally {
      setConnecting(null);
    }
  }

  const isOn = (id) => status[id] === "ACTIVE";
  const haveStatus = Object.keys(status).length > 0;
  const connectedCount = CONNECTORS.filter((c) => isOn(c.id)).length;

  return (
    <div className="relative">
      {open && (
        <div className="absolute bottom-12 left-0 w-72 animate-fadein rounded-xl border border-border bg-panel p-2 shadow-2xl">
          <p className="px-2 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-sub">
            Connectors{loading ? " · …" : ""}
          </p>
          {CONNECTORS.map((c) => {
            const Icon = c.icon;
            const on = isOn(c.id);
            const pending = status[c.id] === "PENDING";
            const sub = on
              ? c.desc
              : pending
              ? "Pending — click to finish"
              : connecting === c.id
              ? "Opening connect link…"
              : "Click to connect";
            return (
              <button
                key={c.id}
                onClick={() => (on ? null : connect(c.id))}
                className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left hover:bg-panel2"
              >
                <span className={`${c.color}`}>
                  <Icon className="w-5 h-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-ink">{c.name}</span>
                  <span className="block text-[11px] text-sub">{sub}</span>
                </span>
                <span
                  className={`flex h-5 w-9 items-center rounded-full px-0.5 transition-colors ${
                    on ? "bg-emerald-500/80" : "bg-border"
                  }`}
                >
                  <span
                    className={`h-4 w-4 rounded-full bg-white transition-transform ${on ? "translate-x-4" : ""}`}
                  />
                </span>
              </button>
            );
          })}
          {error && (
            <p className="mt-1 px-2 py-1.5 text-[11px] text-red-400">{error}</p>
          )}
          <div className="mt-1 border-t border-border px-2 pt-2">
            <button
              onClick={refresh}
              className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-sub hover:bg-panel2 hover:text-ink"
            >
              ↻ Refresh status
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-panel2 px-3 py-2 text-left hover:bg-border"
      >
        <span className="flex -space-x-1.5">
          {CONNECTORS.map((c) => {
            const Icon = c.icon;
            const on = isOn(c.id);
            return (
              <span
                key={c.id}
                className={`flex h-6 w-6 items-center justify-center rounded-full border border-bg bg-panel ${c.color} ${
                  haveStatus && !on ? "opacity-40" : ""
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </span>
            );
          })}
        </span>
        <span className="flex-1 text-xs text-sub">
          {haveStatus ? `${connectedCount} connector${connectedCount !== 1 ? "s" : ""} connected` : "Connectors"}
        </span>
        <CheckIcon className="w-4 h-4 text-emerald-400" />
      </button>
    </div>
  );
}
