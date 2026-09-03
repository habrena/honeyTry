import type { InsightData, PathStat, IpStat, ChartPoint, TimeRange } from "../types/dashboard";
import Widget from "../components/Widget";
import InsightCard from "../components/InsightCard";
import BarChart from "../components/BarChart";
import SeverityBadge from "../components/SeverityBadge";
import { tableStyle, thStyle, tdStyle } from "../styles/tableStyles";

interface OverviewTabProps {
  insights: InsightData | null;
  pathStats: PathStat[];
  ipStats: IpStat[];
  chartData: ChartPoint[];
  timeRange: TimeRange;
  setTimeRange: (r: TimeRange) => void;
  visibleWidgets: Record<string, boolean>;
  expandedWidget: string | null;
  dismissWidget: (id: string) => void;
  toggleExpand: (id: string) => void;
  anyHidden: boolean;
  restoreAllWidgets: () => void;
  onIpClick: (ip: string) => void;
  onPathClick: (path: string) => void;
}

export default function OverviewTab({
  insights, pathStats, ipStats, chartData, timeRange, setTimeRange,
  visibleWidgets, expandedWidget, dismissWidget, toggleExpand,
  anyHidden, restoreAllWidgets, onIpClick, onPathClick,
}: OverviewTabProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

      {/* Page header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#e2e4eb" }}>Overview</h1>
        </div>
        {anyHidden && (
          <button onClick={restoreAllWidgets} style={{
            background: "none", border: "1px solid #2a2d42", borderRadius: 8,
            padding: "8px 14px", color: "#64678a", cursor: "pointer", fontSize: 13,
          }}>
            Restore hidden widgets
          </button>
        )}
      </div>

      {/* Insight cards */}
      {visibleWidgets.insights && insights && (
        <Widget id="insights" title="Key metrics" visible onDismiss={dismissWidget}
          onExpand={toggleExpand} expanded={expandedWidget === "insights"}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14 }}>
            <InsightCard label="Requests (24h)" value={insights.totalRequests24h} accent="#3b82f6" />
            <InsightCard label="Distinct IPs (24h)" value={insights.distinctIps24h} accent="#8b5cf6" />
            <InsightCard label="Active sessions" value={insights.activeSessions} accent="#06b6d4" />
            <InsightCard label="High severity" value={insights.highSeverityEvents} accent="#ef4444" />
            <InsightCard label="LLM analyses" value={insights.llmAnalyses} accent="#f59e0b" />
            <InsightCard label="Top attack type" value={insights.topAttackType || "—"} accent="#10b981" />
          </div>
        </Widget>
      )}

      {/* Request volume chart */}
      <Widget id="requestGraph" title="Request volume" visible={visibleWidgets.requestGraph}
        onDismiss={dismissWidget} onExpand={toggleExpand} expanded={expandedWidget === "requestGraph"}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 13, color: "#64678a" }}>Time range:</span>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            style={{
              background: "#1a1d30", border: "1px solid #2a2d42", borderRadius: 6,
              color: "#c9cbe0", padding: "6px 10px", fontSize: 13, cursor: "pointer",
            }}
          >
            <option value="24h">Last 24 hours</option>
            <option value="month">Last 30 days</option>
            <option value="year">Last 12 months</option>
          </select>
        </div>
        {chartData.length > 0
          ? <BarChart data={chartData} label="Number of requests" />
          : <div style={{ color: "#505370", fontSize: 13, padding: "32px 0", textAlign: "center" }}>
              No request data for this period
            </div>
        }
      </Widget>

      {/* Two-column: paths + IPs */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Most accessed paths */}
        <Widget id="topPaths" title="Most accessed paths" visible={visibleWidgets.topPaths}
          onDismiss={dismissWidget} onExpand={toggleExpand} expanded={expandedWidget === "topPaths"}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Path</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Requests</th>
                {expandedWidget === "topPaths" && (
                  <>
                    <th style={{ ...thStyle, textAlign: "right" }}>Unique IPs</th>
                    <th style={{ ...thStyle, textAlign: "center" }}>Severity</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {pathStats.length === 0 && (
                <tr><td colSpan={4} style={{ ...tdStyle, textAlign: "center", color: "#505370" }}>
                  No data yet
                </td></tr>
              )}
              {pathStats.map((p, i) => (
                <tr key={i} style={{ cursor: "pointer" }} onClick={() => onPathClick(p.path)}>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13, color: "#93c5fd" }}>
                    {p.path}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{p.count}</td>
                  {expandedWidget === "topPaths" && (
                    <>
                      <td style={{ ...tdStyle, textAlign: "right" }}>{p.uniqueIps}</td>
                      <td style={{ ...tdStyle, textAlign: "center" }}>
                        <SeverityBadge severity={p.topSeverity} />
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Widget>

        {/* IP addresses */}
        <Widget id="topIps" title="IP addresses" visible={visibleWidgets.topIps}
          onDismiss={dismissWidget} onExpand={toggleExpand} expanded={expandedWidget === "topIps"}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>IP address</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Requests</th>
                {expandedWidget === "topIps" && (
                  <>
                    <th style={{ ...thStyle, textAlign: "right" }}>Sessions</th>
                    <th style={thStyle}>Last seen</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {ipStats.length === 0 && (
                <tr><td colSpan={4} style={{ ...tdStyle, textAlign: "center", color: "#505370" }}>
                  No data yet
                </td></tr>
              )}
              {ipStats.map((ip, i) => (
                <tr key={i} style={{ cursor: "pointer" }} onClick={() => onIpClick(ip.ip)}>
                  <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 13, color: "#fbbf24" }}>
                    {ip.ip}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{ip.requestCount}</td>
                  {expandedWidget === "topIps" && (
                    <>
                      <td style={{ ...tdStyle, textAlign: "right" }}>{ip.sessionCount}</td>
                      <td style={tdStyle}>{new Date(ip.lastSeen).toLocaleString()}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </Widget>
      </div>
    </div>
  );
}