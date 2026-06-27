import { PostHogIcon, LinearIcon, GitHubIcon, SparkIcon, CheckIcon } from "./icons";

function Badge({ children, color = "border" }) {
  const map = {
    border: "bg-panel2 text-sub border-border",
    high: "bg-red-500/10 text-red-300 border-red-500/30",
    medium: "bg-amber-500/10 text-amber-300 border-amber-500/30",
    green: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
    linear: "bg-linear/15 text-indigo-300 border-linear/40",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium ${map[color] || map.border}`}>
      {children}
    </span>
  );
}

function CardShell({ icon, label, accent, children }) {
  return (
    <div className="animate-fadein rounded-xl border border-border bg-panel overflow-hidden">
      <div className="flex items-center gap-2 border-b border-border px-3.5 py-2.5">
        <span className={accent}>{icon}</span>
        <span className="text-xs font-semibold uppercase tracking-wide text-sub">{label}</span>
      </div>
      <div className="px-3.5 py-3">{children}</div>
    </div>
  );
}

export function SignalCard({ data }) {
  return (
    <CardShell icon={<PostHogIcon className="w-4 h-4" />} label="Signal · PostHog" accent="text-amber-400">
      <div className="mb-2.5 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">{data.title}</p>
        <span className="text-[11px] text-sub">{data.window}</span>
      </div>
      <div className="space-y-1.5">
        {data.events.map((e, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg bg-panel2 px-3 py-2">
            <Badge>{e.type}</Badge>
            <span className="flex-1 truncate text-sm text-ink">{e.text}</span>
            <span className="text-sm font-semibold text-ink">{e.count}</span>
            <span className="w-12 text-right text-[11px] text-emerald-400">{e.trend}</span>
          </div>
        ))}
      </div>
    </CardShell>
  );
}

export function InsightCard({ data }) {
  return (
    <CardShell icon={<SparkIcon className="w-4 h-4" />} label="Insight" accent="text-accent">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <p className="text-base font-semibold text-ink">{data.headline}</p>
        <Badge color="linear">{data.area}</Badge>
        <Badge color="green">{Math.round(data.confidence * 100)}% confidence</Badge>
      </div>
      <p className="text-sm leading-relaxed text-sub">{data.body}</p>
      <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
        <CheckIcon className="w-4 h-4 text-emerald-400" />
        <span className="text-sm text-emerald-200">{data.impact}</span>
      </div>
    </CardShell>
  );
}

export function AssetCard({ data }) {
  return (
    <CardShell icon={<SparkIcon className="w-4 h-4" />} label="Generated asset" accent="text-accent">
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-medium text-ink">{data.kind}</p>
        <code className="rounded bg-panel2 px-2 py-0.5 text-[11px] text-sub">{data.filename}</code>
      </div>
      <pre className="overflow-x-auto rounded-lg border border-border bg-[#0b0b0d] p-3 text-[12px] leading-relaxed">
        <code>
          {data.diff.split("\n").map((line, i) => {
            const add = line.startsWith("+");
            const del = line.startsWith("-");
            return (
              <div
                key={i}
                className={
                  add ? "bg-emerald-500/10 text-emerald-300" : del ? "bg-red-500/10 text-red-300" : "text-sub"
                }
              >
                {line || " "}
              </div>
            );
          })}
        </code>
      </pre>
    </CardShell>
  );
}

export function TicketCard({ data }) {
  return (
    <CardShell icon={<LinearIcon className="w-4 h-4" />} label="Linear · ticket filed" accent="text-indigo-400">
      <div className="flex items-start gap-3">
        <div className="flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span className="font-mono text-sm font-semibold text-indigo-300">{data.id}</span>
            <Badge color={data.priority === "High" ? "high" : "medium"}>{data.priority}</Badge>
          </div>
          <p className="text-sm text-ink">{data.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge>{data.team}</Badge>
            {data.labels.map((l) => (
              <Badge key={l}>{l}</Badge>
            ))}
          </div>
        </div>
      </div>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-linear/40 bg-linear/10 px-3 py-1.5 text-xs font-medium text-indigo-200 hover:bg-linear/20"
      >
        <LinearIcon className="w-3.5 h-3.5" /> Open in Linear
      </a>
    </CardShell>
  );
}

export function PrCard({ data }) {
  const checkColor = data.checks === "passing" ? "green" : "medium";
  return (
    <CardShell icon={<GitHubIcon className="w-4 h-4" />} label="GitHub · pull request opened" accent="text-ink">
      <div className="mb-1 flex items-center gap-2">
        <span className="font-mono text-sm font-semibold text-ink">#{data.number}</span>
        <span className="text-xs text-sub">{data.repo}</span>
      </div>
      <p className="text-sm text-ink">{data.title}</p>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[12px] text-sub">
        <span className="font-mono">
          <span className="text-emerald-400">+{data.additions}</span>{" "}
          <span className="text-red-400">−{data.deletions}</span> · {data.files} file{data.files > 1 ? "s" : ""}
        </span>
        <code className="rounded bg-panel2 px-1.5 py-0.5">{data.branch}</code>
        <Badge color={checkColor}>checks {data.checks}</Badge>
      </div>
      <a
        href="#"
        onClick={(e) => e.preventDefault()}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel2 px-3 py-1.5 text-xs font-medium text-ink hover:bg-border"
      >
        <GitHubIcon className="w-3.5 h-3.5" /> Review PR
      </a>
    </CardShell>
  );
}
