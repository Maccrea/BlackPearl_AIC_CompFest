import React, { useState, useEffect } from "react";
import { AlertTriangle, AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AttentionMachines() {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/machines")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMachines(data);
        } else if (data && Array.isArray(data.data)) {
          setMachines(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch Attention Machines data:", err);
        setLoading(false);
      });
  }, []);

  const attentionMachines = machines
    .filter((m) => m.status && m.status.toLowerCase() !== "healthy")
    .sort((a, b) => (a.status?.toLowerCase() === "critical" ? -1 : 1));

  return (
    <div className="flex flex-col rounded-2xl border border-[#1F2937] bg-[#121620] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Needs Attention</h3>
        {!loading && (
          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${attentionMachines.length > 0 ? "bg-[#EF4444]/10 text-[#EF4444]" : "bg-[#10B981]/10 text-[#10B981]"}`}>
            {attentionMachines.length} Machines
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1F2937] bg-[#0B0E14] py-10">
          <Loader2 className="mb-2 h-8 w-8 animate-spin text-gray-500" />
          <p className="text-sm font-medium text-[#9CA3AF]">Loading data...</p>
        </div>
      ) : attentionMachines.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1F2937] bg-[#0B0E14] py-10">
          <CheckCircle2 size={32} className="mb-2 text-[#10B981]" />
          <p className="text-sm font-medium text-[#9CA3AF]">All systems running normally</p>
        </div>
      ) : (
        <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pr-2 scrollbar-hide">
          {attentionMachines.map((machine) => (
            <CompactMachineCard
              key={machine.id}
              machine={machine}
              onClick={() => navigate(`/operator/machine-detail/${machine.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CompactMachineCard({ machine, onClick }) {
  const isCritical = machine.status?.toLowerCase() === "critical";
  const colors = isCritical
    ? { border: "border-[#EF4444]/30", bg: "bg-[#EF4444]/5", icon: "text-[#EF4444]" }
    : { border: "border-[#F59E0B]/30", bg: "bg-[#F59E0B]/5", icon: "text-[#F59E0B]" };

  return (
    <div
      onClick={onClick}
      className={`group cursor-pointer rounded-xl border ${colors.border} ${colors.bg} p-4 transition-all hover:-translate-y-0.5 hover:shadow-lg`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`mt-0.5 flex shrink-0 items-center justify-center ${colors.icon}`}>
            {isCritical ? <AlertTriangle size={18} /> : <AlertCircle size={18} />}
          </div>
          <div>
            <h4 className="font-bold text-white group-hover:text-white/90">{machine.name}</h4>
            <p className="text-xs text-[#8B95A7]">{machine.type} • {machine.line}</p>
          </div>
        </div>
        <ArrowRight size={16} className="text-[#4B5563] transition-colors group-hover:text-white" />
      </div>

      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="text-[#8B95A7]">Health Score</span>
        <span className={`font-bold ${colors.icon}`}>{machine.health}%</span>
      </div>
      <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#1F2937]">
        <div
          className={`h-full rounded-full ${isCritical ? "bg-[#EF4444]" : "bg-[#F59E0B]"}`}
          style={{ width: `${machine.health || 0}%` }}
        />
      </div>
    </div>
  );
}