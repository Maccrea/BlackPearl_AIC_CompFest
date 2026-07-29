import React from "react";
import { AlertTriangle, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboard from "../../mock/dashboard";

export default function AttentionMachines() {
  const navigate = useNavigate();

  const attentionMachines = dashboard.machines
    .filter((m) => m.status !== "healthy")
    .sort((a, b) => (a.status === "critical" ? -1 : 1)); 

  return (
    <div className="flex flex-col rounded-2xl border border-[#1F2937] bg-[#121620] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Needs Attention</h3>
        <span className="rounded-full bg-[#EF4444]/10 px-2.5 py-1 text-xs font-bold text-[#EF4444]">
          {attentionMachines.length} Mesin
        </span>
      </div>

      {attentionMachines.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1F2937] bg-[#0B0E14] py-10">
          <CheckCircle2 size={32} className="mb-2 text-[#10B981]" />
          <p className="text-sm font-medium text-[#9CA3AF]">Semua sistem berjalan normal</p>
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
  const isCritical = machine.status === "critical";
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
            <h4 className="font-bold text-white group-hover:text-white/90">
              {machine.name}
            </h4>
            <p className="text-xs text-[#8B95A7]">
              {machine.type} • {machine.line}
            </p>
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
          style={{ width: `${machine.health}%` }}
        />
      </div>
    </div>
  );
}