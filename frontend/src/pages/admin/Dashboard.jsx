import React, { useState, useEffect } from "react";
import { TrendingUp, AlertTriangle, AlertOctagon, Activity, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/machines")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMachines(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const normalCount = machines.filter((m) => m.status?.toLowerCase() === "healthy").length;
  const warningCount = machines.filter((m) => m.status?.toLowerCase() === "warning").length;
  const criticalCount = machines.filter((m) => m.status?.toLowerCase() === "critical").length;

  const recentAlerts = machines.filter((m) => m.status?.toLowerCase() !== "healthy");

  const averageHealth = machines.length > 0
    ? Math.round(machines.reduce((acc, curr) => acc + (curr.health || 0), 0) / machines.length)
    : 100;

  const efficiencyText = averageHealth >= 90 ? "Baik" : averageHealth >= 70 ? "Perlu Perhatian" : "Kritis";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-gray-400">Monitoring seluruh sistem Black Pearl AI</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="flex items-center gap-4 rounded-2xl border border-[#1F2937] bg-[#121620] p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{normalCount}</div>
            <div className="text-sm font-medium text-gray-400">Mesin Normal</div>
            <div className="text-xs text-gray-500">Tidak ada masalah</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#1F2937] bg-[#121620] p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-400">
            <AlertTriangle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{warningCount}</div>
            <div className="text-sm font-medium text-gray-400">Mesin Warning</div>
            <div className="text-xs text-gray-500">Perlu perhatian</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#1F2937] bg-[#121620] p-5 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10 text-red-400">
            <AlertOctagon size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{criticalCount}</div>
            <div className="text-sm font-medium text-gray-400">Mesin Critical</div>
            <div className="text-xs text-gray-500">Segera periksa</div>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-[#1F2937] bg-[#121620] p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
            <Activity size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-white">{averageHealth}%</div>
            <div className="text-sm font-medium text-gray-400">Efisiensi Line</div>
            <div className="text-xs text-gray-500">{efficiencyText}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
          <h2 className="mb-4 text-lg font-bold text-white">Recent Alerts</h2>
          <div className="space-y-4">
            {recentAlerts.length === 0 ? (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm text-emerald-400">
                Semua mesin berjalan normal. Tidak ada alert saat ini.
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
                        Mesin line {alert.line || "-"} mengalami masalah. (Suhu: {alert.temp || "-"})
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