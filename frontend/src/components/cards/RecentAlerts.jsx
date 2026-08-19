import React, { useState, useEffect } from "react";
import { AlertTriangle, Clock, Loader2 } from "lucide-react";

export default function RecentAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/machines")
      .then((res) => res.json())
      .then((data) => {
        const rawMachines = Array.isArray(data) ? data : (data.data || []);
        const generatedAlerts = [];
        
        rawMachines.forEach((machine) => {
          const temp = parseFloat(String(machine.temp).replace(/[^0-9.]/g, '')) || 25;
          const rpm = parseFloat(String(machine.rpm).replace(/[^0-9.]/g, '')) || 1450;
          const current = parseFloat(String(machine.current).replace(/[^0-9.]/g, '')) || 12.5;
          const vibration = parseFloat(String(machine.vibration).replace(/[^0-9.]/g, '')) || 2.1;

          let calcHealth = 100;
          if (temp >= 75) calcHealth -= 35;
          else if (temp >= 60) calcHealth -= 15;
          if (vibration >= 4.5) calcHealth -= 30;
          else if (vibration >= 3.0) calcHealth -= 15;
          if (rpm > 1550) calcHealth -= 10;
          if (current > 15) calcHealth -= 10;

          calcHealth = Math.max(0, calcHealth);
          const dbHealth = parseFloat(machine.health) || 100;
          const finalHealth = Math.min(calcHealth, dbHealth);

          let realStatus = "Healthy";
          let message = "";
          let level = "";

          if (temp >= 75 || finalHealth <= 40 || rpm > 1550 || vibration >= 4.5) {
            realStatus = "Critical";
            level = "critical";
            message = `Parameter bahaya! Suhu mencapai ${temp}°C dan getaran ${vibration} mm/s.`;
          } else if (temp >= 60 || finalHealth <= 70 || rpm > 1500 || vibration >= 3.0) {
            realStatus = "Warning";
            level = "warning";
            message = `Parameter mendekati batas ambang. Diperlukan inspeksi.`;
          }

          if (realStatus !== "Healthy") {
            generatedAlerts.push({
              id: machine.id,
              machine: machine.name,
              level: level,
              message: message,
              time: "Baru saja", 
            });
          }
        });
        
        setAlerts(generatedAlerts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch Recent Alerts:", err);
        setLoading(false);
      });
  }, []);

  const levelColor = {
    critical: {
      icon: "text-[#EF4444]",
      bg: "bg-[#EF4444]/10",
      text: "text-[#EF4444]",
    },
    warning: {
      icon: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/10",
      text: "text-[#F59E0B]",
    },
    maintenance: {
      icon: "text-[#3B82F6]",
      bg: "bg-[#3B82F6]/10",
      text: "text-[#3B82F6]",
    },
  };

  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
      <h3 className="mb-5 text-lg font-bold text-white">
        Recent Alerts
      </h3>

      {loading ? (
        <div className="flex items-center justify-center py-6 text-gray-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> 
          <span className="text-sm">Loading alerts...</span>
        </div>
      ) : alerts.length === 0 ? (
        <div className="rounded-xl border border-[#10B981]/20 bg-[#10B981]/5 p-4 text-center">
          <p className="text-sm text-[#10B981]">All machines are running normally. No alerts at this time.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
          {alerts.map((alert, index) => {
            const color = levelColor[alert.level];
            return (
              <div key={index} className="flex items-start gap-3">
                <div className={`mt-1 rounded-full p-1.5 ${color.bg} ${color.icon}`}>
                  {alert.level === "maintenance" ? <Clock size={16} /> : <AlertTriangle size={16} />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className={`text-[13px] font-bold ${color.text}`}>
                      {alert.machine}
                    </div>
                    <div className="text-[11px] text-[#8B95A7]">
                      {alert.time}
                    </div>
                  </div>
                  <div className="text-[12px] text-[#9CA3AF]">
                    {alert.message}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button className="mt-5 w-full text-[13px] font-medium text-[#7C3AED] hover:text-[#9F67FF]">
        View All Alerts →
      </button>
    </div>
  );
}