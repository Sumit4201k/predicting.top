import { formatPercent } from "@/lib/utils";

export function MetricGrid({
  metrics
}: {
  metrics: Array<{ label: string; value: string; tone?: "positive" | "negative" | "warning" }>;
}) {
  return (
    <div className="metric-grid">
      {metrics.map((metric) => (
        <div key={metric.label} className="panel metric-card">
          <span className="muted">{metric.label}</span>
          <strong className={metric.tone}>{metric.value}</strong>
        </div>
      ))}
    </div>
  );
}

export function defaultProfileMetrics(profile: {
  smartScore: number;
  winRate: number;
  sharpe: number;
  maxDrawdown: number;
  profitFactor: number;
  consistency: number;
}) {
  return [
    { label: "Smart Score", value: profile.smartScore.toFixed(1), tone: "positive" as const },
    { label: "Win Rate", value: formatPercent(profile.winRate), tone: "positive" as const },
    { label: "Sharpe", value: profile.sharpe.toFixed(2), tone: "positive" as const },
    { label: "Max Drawdown", value: formatPercent(profile.maxDrawdown), tone: "warning" as const },
    { label: "Profit Factor", value: profile.profitFactor.toFixed(2), tone: "positive" as const },
    { label: "Consistency", value: formatPercent(profile.consistency, 0), tone: "positive" as const }
  ];
}
