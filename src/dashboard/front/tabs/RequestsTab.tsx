import { useEffect, useState } from "react";
import type { EventRow } from "../types/dashboard";
import SeverityBadge from "../components/SeverityBadge";
import { tableStyle, thStyle, tdStyle } from "../styles/tableStyles";

const API = "/api/dashboard";

export default function RequestsTab() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/events`);
        if (res.ok) setEvents(await res.json());
      } catch { /* silent */ }
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p style={{ color: "#505370" }}>Loading events…</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#e2e4eb" }}>All requests</h1>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Time</th>
            <th style={thStyle}>Method</th>
            <th style={thStyle}>Endpoint</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Status</th>
            <th style={{ ...thStyle, textAlign: "right" }}>Duration</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Classification</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Severity</th>
          </tr>
        </thead>
        <tbody>
          {events.map(ev => {
            const cls = ev.classifications?.[0];
            return (
              <tr key={ev.id}>
                <td style={tdStyle}>{new Date(ev.timestamp).toLocaleString()}</td>
                <td style={{
                  ...tdStyle, fontWeight: 600,
                  color: ev.method === "POST" ? "#f87171"
                       : ev.method === "GET"  ? "#4ade80"
                       : "#c9cbe0",
                }}>
                  {ev.method}
                </td>
                <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13, color: "#93c5fd" }}>
                  {ev.endpoint}
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{ev.statusCode}</td>
                <td style={{ ...tdStyle, textAlign: "right" }}>{ev.durationMs}ms</td>
                <td style={{ ...tdStyle, textAlign: "center", fontSize: 12 }}>
                  {cls?.category || "—"}
                </td>
                <td style={{ ...tdStyle, textAlign: "center" }}>
                  {cls ? <SeverityBadge severity={cls.severity} /> : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}