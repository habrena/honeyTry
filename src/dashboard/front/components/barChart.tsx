import type { ChartPoint } from "../types/dashboard";

interface BarChartProps {
  data: ChartPoint[];
  label: string;
}

export default function BarChart({ data, label }: BarChartProps) {
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ fontSize: 12, color: "#64678a", marginBottom: 4 }}>{label}</span>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 160 }}>
        {data.map((d, i) => (
          <div key={i} style={{
            flex: 1, display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "flex-end", height: "100%",
          }}>
            <div style={{
              width: "100%", maxWidth: 32, borderRadius: "4px 4px 0 0",
              background: "linear-gradient(to top, #3b82f6, #60a5fa)",
              height: `${(d.value / max) * 100}%`,
              minHeight: d.value > 0 ? 4 : 0,
              transition: "height .3s",
            }} />
            <span style={{
              fontSize: 10, color: "#505370", marginTop: 6,
              transform: "rotate(-45deg)", transformOrigin: "top left",
              whiteSpace: "nowrap", maxWidth: 50, overflow: "hidden",
              textOverflow: "ellipsis",
            }}>
              {d.key}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}