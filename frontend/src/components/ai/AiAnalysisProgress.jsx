import React from "react";
import { Brain, CheckCircle2 } from "lucide-react";

export default function AiAnalysisProgress() {
  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
      <h3 className="mb-5 text-lg font-bold text-white">AI Analysis Progress</h3>
      
      <div className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-900/40 text-[#A855F7] shadow-[0_0_20px_rgba(168,85,247,0.2)]">
          <Brain size={32} />
        </div>
        <div className="flex-1">
          <div className="text-[13px] font-bold text-white">Menganalisis anomali pada Mesin E</div>
          <div className="text-[11px] text-[#8B95A7]">Mohon tunggu sebentar...</div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 flex-1 rounded-full bg-[#1F2937]">
              <div className="h-1.5 w-[76%] rounded-full bg-[#A855F7]"></div>
            </div>
            <span className="text-[11px] font-bold text-white">76%</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between px-2 text-center text-[10px] font-medium text-[#8B95A7]">
        <div className="flex flex-col items-center gap-1 text-[#10B981]">
          <CheckCircle2 size={16} /><span>Baca Sensor</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[#10B981]">
          <CheckCircle2 size={16} /><span>Deteksi Anomali</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-[#A855F7]">
          <div className="flex h-4 w-4 items-center justify-center rounded-full bg-[#A855F7] text-white">3</div>
          <span>Cari Kasus Mirip</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-50">
          <div className="flex h-4 w-4 items-center justify-center rounded-full border border-[#8B95A7]">4</div>
          <span>Prediksi Penyebab</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-50">
          <div className="flex h-4 w-4 items-center justify-center rounded-full border border-[#8B95A7]">5</div>
          <span>Rekomendasi</span>
        </div>
      </div>
    </div>
  );
}