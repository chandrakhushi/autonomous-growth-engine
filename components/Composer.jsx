"use client";

import { useState } from "react";
import { ArrowUp, PlusIcon } from "./icons";

export default function Composer({ onSend, disabled }) {
  const [value, setValue] = useState("");

  function submit() {
    const v = value.trim();
    if (!v || disabled) return;
    onSend(v);
    setValue("");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-5">
      <div className="flex items-end gap-2 rounded-2xl border border-border bg-panel p-2 shadow-lg focus-within:border-accent/60">
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sub hover:bg-panel2 hover:text-ink">
          <PlusIcon className="w-5 h-5" />
        </button>
        <textarea
          rows={1}
          value={value}
          disabled={disabled}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          placeholder="Ask the engine to analyze behavior (try: export, pricing, or SEO)…"
          className="max-h-40 flex-1 resize-none bg-transparent py-2 text-sm text-ink placeholder:text-sub focus:outline-none"
        />
        <button
          onClick={submit}
          disabled={disabled || !value.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-bg transition-opacity disabled:opacity-30"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-sub">
        The engine reads PostHog signals, forms an insight, generates a change, and ships it via Linear + GitHub.
      </p>
    </div>
  );
}
