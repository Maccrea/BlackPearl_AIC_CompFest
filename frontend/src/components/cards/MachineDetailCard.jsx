import React from "react";

export default function MachineDetailCard() {
  return (
    <div className="rounded-2xl border border-[#EF4444]/30 bg-[#121620] p-6 shadow-[0_0_15px_rgba(239,68,68,0.05)]">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Mesin E - Labeling</h3>
        <span className="rounded-md bg-[#EF4444] px-2 py-0.5 text-[10px] font-bold text-white">CRITICAL</span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <div className="text-[12px] text-[#9CA3AF]">Suhu Motor</div>
          <div className="text-2xl font-bold text-[#EF4444]">92°C</div>
          <div className="text-[10px] text-[#EF4444]">↑ Batas: 75°C</div>
        </div>
        <div>
          <div className="text-[12px] text-[#9CA3AF]">Vibrasi</div>
          <div className="text-2xl font-bold text-[#EF4444]">8.2 <span className="text-sm">mm/s</span></div>
          <div className="text-[10px] text-[#EF4444]">↑ Batas: 4.5</div>
        </div>
        <div>
          <div className="text-[12px] text-[#9CA3AF]">Kecepatan</div>
          <div className="text-xl font-bold text-white">1200 <span className="text-sm">RPM</span></div>
          <div className="text-[10px] text-[#10B981]">Normal</div>
        </div>
        <div>
          <div className="text-[12px] text-[#9CA3AF]">Arus Listrik</div>
          <div className="text-xl font-bold text-white">18.5 <span className="text-sm">A</span></div>
          <div className="text-[10px] text-[#10B981]">Normal</div>
        </div>
      </div>

      <div className="mb-4 h-24 w-full rounded-lg border border-[#1F2937] bg-gradient-to-t from-[#EF4444]/10 to-transparent p-2 flex items-end">
        <svg viewBox="0 0 100 30" className="w-full stroke-[#EF4444] stroke-2 fill-none">
          <path d="M0 25 L10 24 L20 20 L30 22 L40 15 L50 18 L60 10 L70 12 L80 5 L90 8 L100 2" />
        </svg>
      </div>

      <button className="w-full rounded-xl border border-[#374151] bg-transparent py-2.5 text-[13px] font-medium text-white transition-colors hover:bg-[#1F2937]">
        Lihat Detail Mesin →
      </button>
    </div>
  );
}