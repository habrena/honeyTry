import type { Tab } from "../types/dashboard";

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  selectedSessionId: string | null;
}

const NAV_ITEMS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "◉" },
  { id: "sessions", label: "All sessions", icon: "◎" },
  { id: "requests", label: "All requests", icon: "◈" },
];

export default function Sidebar({ activeTab, onTabChange, selectedSessionId }: SidebarProps) {
  return (
    <nav style={{
      width: 220, minWidth: 220, background: "#0b0d14",
      borderRight: "1px solid #1a1c2e", padding: "24px 0",
      display: "flex", flexDirection: "column",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 28px", borderBottom: "1px solid #1a1c2e" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: "#3b82f6",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, color: "#fff", fontWeight: 700,
          }}>
            H
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e4eb" }}>Honeypot</div>
            <div style={{ fontSize: 11, color: "#505370" }}>Monitoring</div>
          </div>
        </div>
      </div>

      {/* Navigation links */}
      <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8, border: "none",
              background: activeTab === item.id ? "#1a1d30" : "transparent",
              color: activeTab === item.id ? "#e2e4eb" : "#64678a",
              cursor: "pointer", fontSize: 14, fontWeight: 500,
              transition: "all .15s", textAlign: "left", width: "100%",
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}

        {/* Dynamic session detail tab */}
        {selectedSessionId && (
          <button
            onClick={() => onTabChange("session-detail")}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8, border: "none",
              background: activeTab === "session-detail" ? "#1a1d30" : "transparent",
              color: activeTab === "session-detail" ? "#e2e4eb" : "#64678a",
              cursor: "pointer", fontSize: 14, fontWeight: 500,
              transition: "all .15s", textAlign: "left", width: "100%",
            }}
          >
            <span style={{ fontSize: 16 }}>◆</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {selectedSessionId.slice(0, 8)}…
            </span>
          </button>
        )}
      </div>

      {/* Footer */}
      <div style={{ marginTop: "auto", padding: "16px 20px", borderTop: "1px solid #1a1c2e" }}>
        <div style={{ fontSize: 11, color: "#3a3d55" }}>
          Dashboard bound to 127.0.0.1
        </div>
      </div>
    </nav>
  );
}