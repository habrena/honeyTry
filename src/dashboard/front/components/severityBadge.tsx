function severityColor(s: string) {
  switch (s?.toLowerCase()) {
    case "critical": return { bg: "#2d0a0a", text: "#f87171", border: "#991b1b" };
    case "high":     return { bg: "#2d1608", text: "#fb923c", border: "#9a3412" };
    case "medium":   return { bg: "#2d2305", text: "#facc15", border: "#854d0e" };
    case "low":      return { bg: "#0a2d1a", text: "#4ade80", border: "#166534" };
    default:         return { bg: "#1a1a2e", text: "#94a3b8", border: "#334155" };
  }
}

export default function SeverityBadge({ severity }: { severity: string }) {
  const c = severityColor(severity);
  return (
    <span style={{
      display: "inline-block", padding: "2px 10px", borderRadius: 4,
      fontSize: 12, fontWeight: 500, letterSpacing: 0.3,
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {severity || "—"}
    </span>
  );
}