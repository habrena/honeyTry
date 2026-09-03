import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Activity, Users, Download } from "lucide-react";
import router from "../routes/dashboardRoutes"

const DASHBOARD_API = "/api/dashboard";

interface Session {
  id: string;
  tokenId: string;
  cookieId: string;
  sourceIp: string;
  userAgent: string;
  firstSeen: string;
  lastSeen: string;
  lastAnalyzedAt: string | null;
  _count: { events: number };
}

export default function DashboardPanel(){

    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    useEffect(()=>{
        const fetchSessions= async ()=>{
            try{
                const res=await fetch(`${DASHBOARD_API}/sessions`);
                if(!res.ok) throw Error("Failed to fetch");

                const data=await res.json(); //await jer se ocekuje Promise
                setSessions(data);

            }catch(err){
                setError("Could not connect to dashboard API");
            }finally{
                setLoading(false)
            }
        }
        fetchSessions();
    }, []);

    if (loading) return <p>Loading sessions...</p>;
    if (error) return <p>{error}</p>;

    return(
        <div>
      <h1>Honeypot sessions</h1>
      {sessions.map((session) => (
        <div key={session.id}>
          <p>IP: {session.sourceIp}</p>
          <p>Events: {session._count.events}</p>
          <p>Last seen: {new Date(session.lastSeen).toLocaleString()}</p>
        </div>
      ))}
    </div>
    )
}
