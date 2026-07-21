import React from "react";
import { Lightbulb, ChevronRight } from "lucide-react";

export default function DailyTip() {
  return (
    <div className="flex cursor-pointer items-center justify-between rounded-xl border border-[#1F2937] bg-[#121620] px-5 py-4 transition-colors hover:bg-[#1A1F2D]">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#3B82F6]/10 text-[#3B82F6]">
          <Lightbulb size={20} />
        </div>
        <div>
          <div className="text-[14px] font-bold text-white">Tips Hari Ini</div>
          <div className="text-[12px] text-[#8B95A7]">
            Pastikan semua sensor dalam kondisi bersih untuk pembacaan yang akurat dan mencegah false alert.
          </div>
        </div>
      </div>
      <ChevronRight size={20} className="text-[#6B7280]" />
    </div>
  );
}