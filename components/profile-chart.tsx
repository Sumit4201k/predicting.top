export function ProfileChart({
  data
}: {
  data: Array<{ label: string; value: number }>;
}) {
  const width = 1000;
  const height = 280;
  const paddingLeft = 80;
  const paddingRight = 40;
  const paddingTop = 40;
  const paddingBottom = 40;

  const min = Math.min(...data.map((point) => point.value));
  const max = Math.max(...data.map((point) => point.value));
  const range = Math.max(max - min, 1);

  const points = data
    .map((point, index) => {
      const x = (index / Math.max(data.length - 1, 1)) * (width - paddingLeft - paddingRight) + paddingLeft;
      const y = height - ((point.value - min) / range) * (height - paddingTop - paddingBottom) - paddingBottom;
      return `${x},${y}`;
    })
    .join(" ");

  // Grid line helper
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  const formatYLabel = (val: number) => {
    if (val >= 1000000) return `+$${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `+$${(val / 1000).toFixed(0)}K`;
    return `+$${val}`;
  };

  return (
    <div className="panel chart-panel" style={{
      padding: "20px",
      borderRadius: "12px",
      background: "rgba(255, 255, 255, 0.02)",
      border: "1px solid var(--border)",
      marginBottom: "20px",
      fontFamily: "Inter, sans-serif"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
        <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#ffffff" }}>P&amp;L History</h3>
        <span style={{ color: "var(--muted)", cursor: "help", fontSize: "0.85rem" }}>ⓘ</span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" style={{ width: "100%", height: "auto" }}>
        {/* Horizontal Dotted Grid Lines & Y Axis Labels */}
        {gridLines.map((ratio, idx) => {
          const y = height - ratio * (height - paddingTop - paddingBottom) - paddingBottom;
          const val = min + ratio * range;
          return (
            <g key={idx}>
              <line
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              <text
                x={paddingLeft - 10}
                y={y + 4}
                fill="var(--muted)"
                fontSize="12"
                fontWeight="500"
                textAnchor="end"
              >
                {formatYLabel(val)}
              </text>
            </g>
          );
        })}

        {/* Chart Line */}
        <polyline fill="none" stroke="#2ee68b" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" points={points} />
      </svg>
      <div className="chart-labels" style={{
        display: "flex",
        justifyContent: "space-between",
        paddingLeft: `${paddingLeft}px`,
        paddingRight: `${paddingRight}px`,
        marginTop: "8px",
        fontSize: "0.8rem",
        color: "var(--muted)"
      }}>
        {data.map((point) => (
          <span key={point.label}>{point.label}</span>
        ))}
      </div>
    </div>
  );
}
