import { useEffect, useState, useCallback } from "react";

// Types
import type {
  Tab, TimeRange, Session, EventRow,
  InsightData, PathStat, IpStat, ChartPoint,
} from "./types/dashboard";

// Layout
import Sidebar from "./components/Sidebar";

// Tabs
import OverviewTab from "./tabs/OverviewTab";
import SessionsTab from "./tabs/SessionsTab";
import RequestsTab from "./tabs/RequestsTab";
import SessionDetailTab from "./tabs/SessionDetailTab";

const API = "/api/dashboard";

export default function DashboardPanel() {
  // ── Navigation ──────────────────────────────────────
  const [tab, setTab] = useState<Tab>("overview");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  // ── Data ────────────────────────────────────────────
  const [sessions, setSessions] = useState<Session[]>([]);
  const [sessionEvents, setSessionEvents] = useState<EventRow[]>([]);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [pathStats, setPathStats] = useState<PathStat[]>([]);
  const [ipStats, setIpStats] = useState<IpStat[]>([]);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");

  // ── UI state ────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visibleWidgets, setVisibleWidgets] = useState<Record<string, boolean>>({
    insights: true, requestGraph: true, topPaths: true, topIps: true,
  });
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);

  // ── Widget controls ─────────────────────────────────
  const dismissWidget = useCallback((id: string) => {
    setVisibleWidgets(prev => ({ ...prev, [id]: false }));
    if (expandedWidget === id) setExpandedWidget(null);
  }, [expandedWidget]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedWidget(prev => prev === id ? null : id);
  }, []);

  const restoreAllWidgets = () => {
    setVisibleWidgets({ insights: true, requestGraph: true, topPaths: true, topIps: true });
  };

  // ── Data fetching ───────────────────────────────────

  // Initial load: sessions + overview data
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [sessRes, insightRes, pathRes, ipRes] = await Promise.all([
          fetch(`${API}/sessions`),
          fetch(`${API}/insights`),
          fetch(`${API}/top-paths`),
          fetch(`${API}/top-ips`),
        ]);
        if (sessRes.ok) setSessions(await sessRes.json());
        if (insightRes.ok) setInsights(await insightRes.json());
        if (pathRes.ok) setPathStats(await pathRes.json());
        if (ipRes.ok) setIpStats(await ipRes.json());
      } catch {
        setError("Cannot reach dashboard API");
      }
      setLoading(false);
    };
    load();
  }, []);

  // Chart data when time range changes
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API}/request-chart?range=${timeRange}`);
        if (res.ok) setChartData(await res.json());
      } catch { /* silent */ }
    };
    load();
  }, [timeRange]);

  // Session detail events
  useEffect(() => {
    if (!selectedSessionId) return;
    setSessionEvents([]);
    setEventsLoading(true);
    const load = async () => {
      try {
        const res = await fetch(`${API}/sessions/${selectedSessionId}/events`);
        if (res.ok) setSessionEvents(await res.json());
      } catch { /* silent */ }
      setEventsLoading(false);
    };
    load();
  }, [selectedSessionId]);

  // ── Navigation helpers ──────────────────────────────
  const openSession = (id: string) => {
    setSelectedSessionId(id);
    setTab("session-detail");
  };

  const anyHidden = Object.values(visibleWidgets).some(v => !v);

  // ── Render ──────────────────────────────────────────
  return (
    <div style={{
      display: "flex", minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, sans-serif",
      background: "#0f1117", color: "#c9cbe0",
    }}>
      <Sidebar
        activeTab={tab}
        onTabChange={setTab}
        selectedSessionId={selectedSessionId}
      />

      <main style={{ flex: 1, padding: "28px 32px", overflow: "auto" }}>
        {loading && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
            <div style={{ color: "#505370", fontSize: 15 }}>Loading…</div>
          </div>
        )}

        {error && (
          <div style={{
            padding: "16px 20px", borderRadius: 10, marginBottom: 24,
            background: "#2d0a0a", border: "1px solid #991b1b",
            color: "#f87171", fontSize: 14,
          }}>
            {error}
          </div>
        )}

        {!loading && !error && tab === "overview" && (
          <OverviewTab
            insights={insights}
            pathStats={pathStats}
            ipStats={ipStats}
            chartData={chartData}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            visibleWidgets={visibleWidgets}
            expandedWidget={expandedWidget}
            dismissWidget={dismissWidget}
            toggleExpand={toggleExpand}
            anyHidden={anyHidden}
            restoreAllWidgets={restoreAllWidgets}
            onIpClick={() => setTab("sessions")}
            onPathClick={() => setTab("requests")}
          />
        )}

        {!loading && !error && tab === "sessions" && (
          <SessionsTab sessions={sessions} onSelect={openSession} />
        )}

        {!loading && !error && tab === "requests" && (
          <RequestsTab />
        )}

        {!loading && !error && tab === "session-detail" && selectedSessionId && (
          <SessionDetailTab
            sessionId={selectedSessionId}
            session={sessions.find(s => s.id === selectedSessionId) || null}
            events={sessionEvents}
            eventsLoading={eventsLoading}
          />
        )}
      </main>
    </div>
  );
}