interface MetaCardProps {
  label: string;
  value: string;
}

export default function MetaCard({ label, value }: MetaCardProps) {
  return (
    <div style={{
      padding: "14px 16px", borderRadius: 8,
      background: "#161822", border: "1px solid #1e2035",
    }}>
      <div style={{ fontSize: 11, color: "#505370", marginBottom: 4 }}>{label}</div>
      <div style={{
        fontSize: 13, color: "#c9cbe0", wordBreak: "break-all",
        fontFamily: label === "User agent" ? "inherit" : "monospace",
      }}>
        {value}
      </div>
    </div>
  );
}