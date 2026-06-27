"use client";

import { useEffect, useRef, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Composer from "@/components/Composer";
import RunMessage from "@/components/RunMessage";
import { SparkIcon, PostHogIcon, LinearIcon, GitHubIcon } from "@/components/icons";
import ThemeToggle from "@/components/ThemeToggle";

const STEP_PLAN = [
  { kind: "signal", label: "Reading PostHog events…", doneLabel: "Pulled behavioral signals from PostHog", delay: 900 },
  { kind: "insight", label: "Clustering friction and forming an insight…", doneLabel: "Formed insight", delay: 1100 },
  { kind: "asset", label: "Generating the change…", doneLabel: "Generated asset", delay: 1200 },
  { kind: "ticket", label: "Filing a ticket in Linear…", doneLabel: "Filed Linear ticket", delay: 900 },
  { kind: "pr", label: "Opening a pull request on GitHub…", doneLabel: "Opened GitHub pull request", delay: 1000 },
];

const SUGGESTIONS = [
  { icon: PostHogIcon, color: "text-amber-400", title: "Fix an onboarding gap", prompt: "Analyze onboarding friction around data export" },
  { icon: LinearIcon, color: "text-indigo-400", title: "Improve pricing conversion", prompt: "Why are team buyers dropping off the pricing page?" },
  { icon: GitHubIcon, color: "text-ink", title: "Capture SEO demand", prompt: "Find unmet search demand and create an SEO page" },
];

let _id = 0;
const uid = () => `m${++_id}`;

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [running, setRunning] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function runScenario(text) {
    setRunning(true);
    const msgId = uid();
    setMessages((m) => [...m, { id: msgId, role: "assistant", steps: [] }]);

    // Ask the backend (the integration seam) for this run's data.
    let scenario;
    try {
      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      scenario = await res.json();
    } catch (e) {
      setMessages((m) =>
        m.map((msg) =>
          msg.id === msgId
            ? { ...msg, summary: "Could not reach the engine backend (/api/run). Is the server running?" }
            : msg
        )
      );
      setRunning(false);
      return;
    }

    for (const plan of STEP_PLAN) {
      const stepId = uid();
      // add the step in "thinking" state
      setMessages((m) =>
        m.map((msg) =>
          msg.id === msgId
            ? { ...msg, steps: [...msg.steps, { id: stepId, kind: plan.kind, label: plan.label, done: false }] }
            : msg
        )
      );
      await wait(plan.delay);
      // resolve it with data
      setMessages((m) =>
        m.map((msg) =>
          msg.id === msgId
            ? {
                ...msg,
                steps: msg.steps.map((s) =>
                  s.id === stepId ? { ...s, done: true, label: plan.doneLabel, data: scenario[plan.kind] } : s
                ),
              }
            : msg
        )
      );
    }

    // closing summary
    setMessages((m) =>
      m.map((msg) =>
        msg.id === msgId
          ? { ...msg, summary: scenario.summary }
          : msg
      )
    );
    setRunning(false);
  }

  function handleSend(text) {
    setMessages((m) => [...m, { id: uid(), role: "user", text }]);
    runScenario(text);
  }

  const empty = messages.length === 0;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-ink">
      <Sidebar onNew={() => setMessages([])} />

      <main className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-blink" />
            <span className="text-sm text-sub">Autonomous Growth Engine</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-border bg-panel px-2.5 py-1 text-[11px] text-sub">
              signal → insight → asset → ship
            </span>
            <ThemeToggle />
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {empty ? (
            <EmptyState onPick={handleSend} />
          ) : (
            <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
              {messages.map((msg) =>
                msg.role === "user" ? (
                  <div key={msg.id} className="flex justify-end">
                    <div className="max-w-[80%] rounded-2xl rounded-br-md bg-panel2 px-4 py-2.5 text-sm text-ink">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div key={msg.id} className="flex gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-accent text-onaccent">
                      <SparkIcon className="w-4 h-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <RunMessage steps={msg.steps} />
                      {msg.summary && (
                        <div className="mt-3 animate-fadein rounded-xl border px-4 py-3 text-sm" style={{ borderColor: "var(--success-border)", background: "var(--success-bg)", color: "var(--success-text)" }}>
                          {msg.summary}
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        <Composer onSend={handleSend} disabled={running} />
      </main>
    </div>
  );
}

function EmptyState({ onPick }) {
  return (
    <div className="bg-grid flex h-full flex-col items-center justify-center px-4">
      <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-onaccent">
        <SparkIcon className="w-7 h-7" />
      </span>
      <h1 className="text-center text-2xl font-semibold text-ink">Autonomous Growth Engine</h1>
      <p className="mt-2 max-w-xl text-center text-sm text-sub">
        I learn from real user behavior and automatically generate and ship onboarding, SEO, and pricing
        improvements — filing the ticket and opening the PR for you.
      </p>
      <div className="mt-8 grid w-full max-w-2xl gap-3 sm:grid-cols-3">
        {SUGGESTIONS.map((s, i) => {
          const Icon = s.icon;
          return (
            <button
              key={i}
              onClick={() => onPick(s.prompt)}
              className="group rounded-xl border border-border bg-panel p-4 text-left transition-colors hover:border-accent/50 hover:bg-panel2"
            >
              <span className={`mb-3 inline-flex ${s.color}`}>
                <Icon className="w-5 h-5" />
              </span>
              <p className="text-sm font-medium text-ink">{s.title}</p>
              <p className="mt-1 text-xs text-sub">{s.prompt}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
