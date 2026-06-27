"use client";

import { SignalCard, InsightCard, AssetCard, TicketCard, PrCard } from "./StepCard";
import { CheckIcon } from "./icons";

const CARD = {
  signal: SignalCard,
  insight: InsightCard,
  asset: AssetCard,
  ticket: TicketCard,
  pr: PrCard,
};

function Dots() {
  return (
    <span className="inline-flex gap-1">
      <span className="h-1.5 w-1.5 rounded-full bg-sub animate-blink" style={{ animationDelay: "0ms" }} />
      <span className="h-1.5 w-1.5 rounded-full bg-sub animate-blink" style={{ animationDelay: "150ms" }} />
      <span className="h-1.5 w-1.5 rounded-full bg-sub animate-blink" style={{ animationDelay: "300ms" }} />
    </span>
  );
}

export default function RunMessage({ steps }) {
  return (
    <div className="space-y-3">
      {steps.map((step) => {
        const Card = CARD[step.kind];
        return (
          <div key={step.id} className="space-y-2">
            <div className="flex items-center gap-2 text-[13px]">
              {step.done ? (
                <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Dots />
              )}
              <span className={step.done ? "text-sub" : "text-ink"}>{step.label}</span>
            </div>
            {step.done && Card && step.data && (
              <div className="pl-5">
                <Card data={step.data} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
