import { PostHogIcon, LinearIcon, GitHubIcon, SparkIcon, CheckIcon } from "./icons";

function Badge({ children, color = "border" }) {
  const styleMap = {
    high: { background: "var(--danger-bg)", color: "var(--danger-text)", borderColor: "var(--danger-text)" },
    medium: { background: "var(--warn-bg)", color: "var(--warn-text)", borderColor: "var(--warn-text)" },
    green: { background: "var(--success-bg)", color: "var(--success-text)", borderColor: "var(--success-border)" },
    linear: { background: "var(--linear-bg)", color: "var(--linear-text)", borderColor: "var(--linear-text)" },
  };
  const base = "inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-medium";
  if (color === "border" || !styleMap[color]) {
    return <span className={`${base} bg-panel2 text-sub border-border`}>{children}</span>;
  }
  return (
    <span className={base} style={styleMap[color]}>
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
            <span className="w-12 text-right text-[11px]" style={{ color: "var(--success-text)" }}>{e.trend}</span>
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
      <div
        className="mt-3 flex items-center gap-2 rounded-lg border px-3 py-2"
        style={{ borderColor: "var(--success-border)", background: "var(--success-bg)", color: "var(--success-text)" }}
      >
        <CheckIcon className="w-4 h-4" />
        <span className="text-sm">{data.impact}</span>
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
      <pre className="overflow-x-auto rounded-lg border border-border bg-code p-3 text-[12px] leading-relaxed">
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
            <span className="font-mono text-sm font-semibold" style={{ color: "var(--linear-text)" }}>{data.id}</span>
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
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium"
        style={{ borderColor: "var(--linear-text)", background: "var(--linear-bg)", color: "var(--linear-text)" }}
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
