import type { Session } from "../types/dashboard";
import { tableStyle, thStyle, tdStyle } from "../styles/tableStyles";

interface SessionsTabProps {
  sessions: Session[];
  onSelect: (id: string) => void;
}

export default function SessionsTab({ sessions, onSelect }: SessionsTabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#e2e4eb" }}>All sessions</h1>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Session ID</th>
            <th style={thStyle}>IP</th>
            <th style={thStyle}>Token</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Events</th>
            <th style={thStyle}>First seen</th>
            <th style={thStyle}>Last seen</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => (
            <tr
              key={s.id}
              onClick={() => onSelect(s.id)}
              style={{ cursor: "pointer", transition: "background .1s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#1a1d30")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13, color: "#93c5fd" }}>
                {s.id.slice(0, 12)}…
              </td>
              <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13 }}>{s.sourceIp}</td>
              <td style={tdStyle}>{s.tokenId}</td>
              <td style={{ ...tdStyle, textAlign: "right", fontWeight: 600 }}>{s._count.events}</td>
              <td style={tdStyle}>{new Date(s.firstSeen).toLocaleString()}</td>
              <td style={tdStyle}>{new Date(s.lastSeen).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}