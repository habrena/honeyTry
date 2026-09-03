import type { Session, EventRow } from "../types/dashboard";
import MetaCard from "../components/MetaCard";
import SeverityBadge from "../components/SeverityBadge";
import { tableStyle, thStyle, tdStyle } from "../styles/tableStyles";

interface SessionDetailTabProps {
  sessionId: string;
  session: Session | null;
  events: EventRow[];
  eventsLoading: boolean;
}

export default function SessionDetailTab({ sessionId, session, events, eventsLoading }: SessionDetailTabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#e2e4eb" }}>
          Session detail
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: "#505370", fontFamily: "monospace" }}>
          {sessionId}
        </p>
      </div>

      {/* Session metadata cards */}
      {session && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
        }}>
          <MetaCard label="Source IP" value={session.sourceIp} />
          <MetaCard label="Token" value={session.tokenId} />
          <MetaCard label="Total events" value={String(session._count.events)} />
          <MetaCard label="First seen" value={new Date(session.firstSeen).toLocaleString()} />
          <MetaCard label="Last seen" value={new Date(session.lastSeen).toLocaleString()} />
          <MetaCard label="User agent" value={session.userAgent} />
        </div>
      )}

      {/* Event timeline */}
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: "#e2e4eb", margin: "0 0 14px" }}>
          Event timeline
        </h2>

        {eventsLoading && (
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "32px 0", justifyContent: "center",
          }}>
            <div style={{
              width: 16, height: 16, borderRadius: "50%",
              border: "2px solid #2a2d42", borderTopColor: "#3b82f6",
              animation: "spin .6s linear infinite",
            }} />
            <span style={{ color: "#505370", fontSize: 14 }}>Loading events…</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {!eventsLoading && events.length === 0 && (
          <div style={{ padding: "32px 0", textAlign: "center", color: "#505370", fontSize: 14 }}>
            No events recorded for this session
          </div>
        )}

        {!eventsLoading && events.length > 0 && (
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>Time</th>
              <th style={thStyle}>Method</th>
              <th style={thStyle}>Endpoint</th>
              <th style={{ ...thStyle, textAlign: "right" }}>Status</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Classification</th>
              <th style={{ ...thStyle, textAlign: "center" }}>Severity</th>
              <th style={thStyle}>Explanation</th>
            </tr>
          </thead>
          <tbody>
            {events.map(ev => {
              const cls = ev.classifications?.[0];
              return (
                <tr key={ev.id}>
                  <td style={tdStyle}>{new Date(ev.timestamp).toLocaleTimeString()}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{ev.method}</td>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13, color: "#93c5fd" }}>
                    {ev.endpoint}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{ev.statusCode}</td>
                  <td style={{ ...tdStyle, textAlign: "center", fontSize: 12 }}>
                    {cls?.category || "—"}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>
                    {cls ? <SeverityBadge severity={cls.severity} /> : "—"}
                  </td>
                  <td style={{ ...tdStyle, fontSize: 12, color: "#8b8ea8", maxWidth: 300 }}>
                    {cls?.explanation || ""}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}