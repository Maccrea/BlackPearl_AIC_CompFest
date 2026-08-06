import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  AlertTriangle,
  OctagonAlert,
  Activity,
} from "lucide-react";

export default function StatCards() {
  const [machines, setMachines] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/machines")
      .then((res) => res.json())
      .then((data) => {
        const rawMachines = Array.isArray(data) ? data : (data.data || []);
        
        const evaluatedData = rawMachines.map((machine) => {
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
          if (temp >= 75 || finalHealth <= 40 || rpm > 1550 || vibration >= 4.5) {
            realStatus = "Critical";
          } else if (temp >= 60 || finalHealth <= 70 || rpm > 1500 || vibration >= 3.0) {
            realStatus = "Warning";
          }

          return {
            ...machine,
            health: finalHealth,
            status: realStatus
          };
        });

        setMachines(evaluatedData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch StatCards data:", err);
        setIsLoading(false);
      });
  }, []);

  const normalCount = machines.filter(
    (m) => m.status?.toLowerCase() === "healthy"
  ).length;
  
  const warningCount = machines.filter(
    (m) => m.status?.toLowerCase() === "warning"
  ).length;
  
  const criticalCount = machines.filter(
    (m) => m.status?.toLowerCase() === "critical"
  ).length;

  const averageHealth =
    machines.length > 0
      ? Math.round(
          machines.reduce((acc, curr) => acc + (curr.health || 0), 0) /
            machines.length
        )
      : 100;

  const efficiencyText =
    averageHealth >= 90
      ? "Good"
      : averageHealth >= 70
      ? "Needs Attention"
      : "Critical";

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex items-center gap-4 rounded-2xl border border-[#1F2937] bg-[#121620] p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <TrendingUp size={24} />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">
            {isLoading ? "..." : normalCount}
          </div>
          <div className="text-sm font-medium text-gray-400">Normal Machines</div>
          <div className="text-xs text-gray-500">No issues detected</div>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-[#1F2937] bg-[#121620] p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-yellow-500/10 text-yellow-400">
          <AlertTriangle size={24} />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">
            {isLoading ? "..." : warningCount}
          </div>
          <div className="text-sm font-medium text-gray-400">Warning Machines</div>
          <div className="text-xs text-gray-500">Requires attention</div>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-[#1F2937] bg-[#121620] p-5 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-400">
          <OctagonAlert size={24} />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">
            {isLoading ? "..." : criticalCount}
          </div>
          <div className="text-sm font-medium text-gray-400">Critical Machines</div>
          <div className="text-xs text-gray-500">Inspect immediately</div>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-[#1F2937] bg-[#121620] p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
          <Activity size={24} />
        </div>
        <div>
          <div className="text-2xl font-bold text-white">
            {isLoading ? "..." : `${averageHealth}%`}
          </div>
          <div className="text-sm font-medium text-gray-400">Line Efficiency</div>
          <div className="text-xs text-gray-500">{efficiencyText}</div>
        </div>
      </div>
    </div>
  );
}