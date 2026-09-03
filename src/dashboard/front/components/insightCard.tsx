interface InsightCardProps {
  label: string;
  value: string | number;
  accent: string;
}

export default function InsightCard({ label, value, accent }: InsightCardProps) {
  return (
    <div style={{
      flex: "1 1 160px", minWidth: 150, padding: "18px 20px", borderRadius: 10,
      background: `${accent}10`, border: `1px solid ${accent}30`,
      display: "flex", flexDirection: "column", gap: 6,
    }}>
      <span style={{ fontSize: 13, color: "#8b8ea8", fontWeight: 500 }}>{label}</span>
      <span style={{ fontSize: 28, fontWeight: 700, color: accent, lineHeight: 1 }}>
        {value}
      </span>
    </div>
  );
}