import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import StatCards from "../../components/cards/StatCards.jsx"; 

export default function Dashboard() {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/machines")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMachines(data);
        } else if (data && Array.isArray(data.data)) {
          setMachines(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch Dashboard data:", err));
  }, []);

  const recentAlerts = machines.filter(
    (m) => m.status?.toLowerCase() !== "healthy"
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-gray-400">Monitoring the entire Black Pearl AI system</p>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
          <h2 className="mb-4 text-lg font-bold text-white">Recent Alerts</h2>
          <div className="space-y-4">
            {recentAlerts.length === 0 ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-400">
                All machines are running normally. No alerts at this time.
              </div>
            ) : (
              recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start justify-between border-b border-[#1F2937] pb-4 last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <AlertCircle 
                      size={18} 
                      className={`mt-0.5 ${alert.status?.toLowerCase() === 'critical' ? 'text-red-400' : 'text-yellow-400'}`} 
                    />
                    <div>
                      <div className={`text-sm font-semibold ${alert.status?.toLowerCase() === 'critical' ? 'text-red-400' : 'text-yellow-400'}`}>
                        {alert.name}
                      </div>
                      <div className="mt-1 text-xs text-gray-400">
                        Line {alert.line || "-"} machine is experiencing issues. (Temp: {alert.temperature || "-"}°C)
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-gray-500">Active</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
          <h2 className="mb-4 text-lg font-bold text-white">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
              <div className="text-sm text-gray-400">API Connection</div>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Online
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
              <div className="text-sm text-gray-400">AI LLaMA 3 Engine</div>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Running
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">Supabase Database</div>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Connected
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}