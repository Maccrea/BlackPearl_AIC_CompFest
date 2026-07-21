import React from "react";
import { ArrowRight, Settings } from "lucide-react";
import dashboard from "../../mock/dashboard";

export default function ProductionLine() {

  const machines = dashboard.machines;
  const statusColor = {
    healthy: "text-[#10B981]",
    warning: "text-[#F59E0B]",
    critical: "text-[#EF4444]",
  };

  const statusBg = {
    healthy: "bg-[#10B981]",
    warning: "bg-[#F59E0B]",
    critical: "bg-[#EF4444]",
  };

  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-white">Line Produksi</h3>
          <span className="flex items-center gap-1 rounded-full bg-[#10B981]/10 px-2.5 py-0.5 text-xs font-medium text-[#10B981]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]"></span>
            Live
          </span>
        </div>
        <button className="text-[13px] text-[#9CA3AF] transition-colors hover:text-white">
          Lihat Semua Mesin
        </button>
      </div>

      <div className="flex items-center justify-between overflow-x-auto pb-4 scrollbar-hide">
        {machines.map((machine, index) => (
          <React.Fragment key={machine.name}>
            <div
              className={`flex min-w-[100px] flex-col items-center gap-2 rounded-xl border ${machine.status === "critical"
                  ? "border-[#EF4444] bg-[#EF4444]/5"
                  : "border-transparent"
                } p-2 transition-all hover:bg-[#1A1F2D]`}
            >              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#1F2937]/50 text-[#8B95A7]">
                <Settings size={28} />
              </div>
              <div className="text-center">
                <div className="text-[13px] font-bold text-white">{machine.name}</div>
                <div className="text-[11px] text-[#8B95A7]">{machine.type}</div>
                <div className={`mt-1 flex items-center justify-center gap-1 text-[11px] font-medium ${statusColor[machine.status]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${statusBg[machine.status]}`} />  {machine.status}
                </div>
              </div>
            </div>
            {index !== machines.length - 1 && (
              <ArrowRight
                size={16}
                className={`shrink-0 ${machine.status === "critical"
                    ? "text-[#EF4444]"
                    : "text-[#374151]"
                  }`}
              />
            )}          </React.Fragment>
        ))}
      </div>
    </div>
  );
}