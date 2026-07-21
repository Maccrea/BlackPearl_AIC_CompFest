import React from "react";
import { Brain } from "lucide-react";
import dashboard from "../../mock/dashboard";

export default function AiRecommendation() {
  const analysis = dashboard.analysis;

  return (
    <div className="rounded-2xl border border-[#7C3AED]/30 bg-[#121620] p-6 shadow-[0_0_15px_rgba(124,58,237,0.05)]">
      
      <div className="mb-5 flex items-center gap-2">
        <Brain size={20} className="text-[#A855F7]" />
        <h3 className="text-lg font-bold text-white">
          AI Recommendation
        </h3>
      </div>

      <div className="mb-5">
        <div className="text-xs text-[#9CA3AF]">Machine</div>
        <div className="font-semibold text-white">
          {analysis.machine}
        </div>
      </div>

      <div className="mb-5">
        <div className="text-xs text-[#9CA3AF]">Predicted Root Cause</div>
        <div className="font-bold text-white">
          {analysis.prediction}
        </div>
      </div>

      <div className="mb-5">
        <div className="mb-2 text-xs text-[#9CA3AF]">Recommended Action</div>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-white">
          {analysis.recommendation.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs">
          <span className="text-[#9CA3AF]">AI Confidence</span>
          <span className="font-bold text-[#10B981]">
            {analysis.confidence}%
          </span>
        </div>
        <div className="h-2 rounded-full bg-[#1F2937]">
          <div
            className="h-2 rounded-full bg-[#10B981]"
            style={{
              width: `${analysis.confidence}%`,
            }}
          />
        </div>
      </div>

      <button className="w-full rounded-xl bg-[#7C3AED] py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9]">
        View Full Analysis →
      </button>

    </div>
  );
}