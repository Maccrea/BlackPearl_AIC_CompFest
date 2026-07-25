import React, { useState } from "react";
import {
  Brain,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import dashboard from "../../mock/dashboard";

export default function Recommendation() {
  const analysis = dashboard.anomalyAnalysis;
  const [selectedActions, setSelectedActions] = useState([]);

  if (!analysis) {
    return (
      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-8">
        <p className="text-[#9CA3AF]">
          Belum ada rekomendasi AI.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          AI Recommendation
        </h1>

        <p className="mt-1 text-[#9CA3AF]">
          Rekomendasi tindakan berdasarkan analisis AI untuk mesin {analysis.machineName}
        </p>
      </div>

      {/* AI Prediction Summary */}
      <div className="rounded-2xl border border-[#7C3AED]/30 bg-[#121620] p-6">

        <div className="flex items-center gap-3 mb-4">

          <div className="rounded-xl bg-[#7C3AED]/10 p-3 text-[#A855F7]">
            <Brain size={22} />
          </div>

          <div>
            <div className="text-xs text-[#8B95A7]">
              AI Prediction
            </div>

            <div className="mt-1 text-xl font-bold text-white">
              {analysis.aiPrediction}
            </div>
          </div>

        </div>

        <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">

          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-[#8B95A7]">
              AI Confidence Level
            </span>
            <span className="text-sm font-bold text-[#A855F7]">
              {analysis.aiConfidence}%
            </span>
          </div>

          <div className="h-2 rounded-full bg-[#1F2937]">
            <div
              className="h-2 rounded-full bg-[#A855F7]"
              style={{
                width: `${analysis.aiConfidence}%`,
              }}
            />
          </div>

        </div>

      </div>

      {/* Detected Issues */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">

        <h2 className="mb-4 text-lg font-bold text-white">
          Detected Issues
        </h2>

        <div className="space-y-2">
          {analysis.detectedAnomalies.map((anomaly, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-xl border border-[#EF4444]/20 bg-[#EF4444]/5 p-3"
            >
              <AlertTriangle size={18} className="text-[#EF4444] shrink-0" />
              <span className="text-sm text-white">
                {anomaly.parameter}: {anomaly.value}{anomaly.unit} (threshold: {anomaly.threshold}{anomaly.unit})
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* Recommended Actions */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">

        <div className="mb-6 flex items-center gap-3">

          <div className="rounded-xl bg-[#10B981]/10 p-3 text-[#10B981]">
            <Wrench size={22} />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              Recommended Actions
            </h2>

            <p className="text-sm text-[#8B95A7]">
              Langkah-langkah yang disarankan oleh AI untuk menangani kondisi mesin
            </p>
          </div>

        </div>

        <div className="space-y-3">

          {analysis.detectedAnomalies.map((anomaly, index) => (
            <ActionCard
              key={index}
              index={index}
              anomaly={anomaly}
              isSelected={selectedActions.includes(index)}
              onToggle={() => {
                if (selectedActions.includes(index)) {
                  setSelectedActions(selectedActions.filter((i) => i !== index));
                } else {
                  setSelectedActions([...selectedActions, index]);
                }
              }}
            />
          ))}

        </div>

      </div>

      {/* Important Note */}
      <div className="rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/5 p-6">

        <div className="flex items-start gap-4">

          <div className="rounded-xl bg-[#F59E0B]/10 p-3 text-[#F59E0B]">
            <AlertTriangle size={22} />
          </div>

          <div>
            <h3 className="font-bold text-white">
              Validasi Engineer Diperlukan
            </h3>

            <p className="mt-1 text-sm text-[#8B95A7]">
              Rekomendasi ini belum pernah dilakukan sebelumnya dan memerlukan persetujuan dari engineer berpengalaman sebelum diterapkan ke mesin.
            </p>

          </div>

        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">

        <button className="flex-1 rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 font-semibold text-white transition hover:border-[#7C3AED] hover:bg-[#7C3AED]/10">
          Back
        </button>

        <button className="flex-1 rounded-xl bg-[#7C3AED] px-4 py-3 font-semibold text-white transition hover:bg-[#7C3AED]/90 flex items-center justify-center gap-2">
          Lanjut ke Engineer Validation
          <ArrowRight size={16} />
        </button>

      </div>

    </div>
  );
}

/* ============ Action Card Component ============ */
function ActionCard({ index, anomaly, isSelected, onToggle }) {
  const getTitle = (param) => {
    const titles = {
      "Temperature": "Periksa Sistem Pendingin",
      "Vibration": "Inspeksi Bearing & Keselarasan",
      "Current": "Periksa Beban Motor",
    };
    return titles[param] || `Periksa ${param}`;
  };

  const getDescription = (param, anomaly) => {
    const descriptions = {
      "Temperature": `Motor temperature mencapai ${anomaly.value}°C (batas normal: ${anomaly.threshold}°C). Pastikan sistem pendingin berfungsi dengan baik.`,
      "Vibration": `Getaran mesin mencapai ${anomaly.value}mm/s (batas normal: ${anomaly.threshold}mm/s). Periksa keselarasan dan kondisi bearing.`,
      "Current": `Arus listrik mencapai ${anomaly.value}A (batas normal: ${anomaly.threshold}A). Periksa beban motor dan kabel listrik.`,
    };
    return descriptions[param] || `Parameter ${param} menunjukkan nilai abnormal: ${anomaly.value}${anomaly.unit}`;
  };

  return (
    <div
      onClick={onToggle}
      className={`cursor-pointer rounded-xl border p-4 transition ${
        isSelected
          ? "border-[#7C3AED]/40 bg-[#7C3AED]/10"
          : "border-[#1F2937] bg-[#0B0E14]"
      }`}
    >

      <div className="flex items-start gap-4">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#A855F7]/20 text-xs font-bold text-[#A855F7]">
          {index + 1}
        </div>

        <div className="flex-1">

          <div className="font-semibold text-white">
            {getTitle(anomaly.parameter)}
          </div>

          <div className="mt-1 text-sm text-[#8B95A7]">
            {getDescription(anomaly.parameter, anomaly)}
          </div>

        </div>

        <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition ${
          isSelected
            ? "bg-[#7C3AED] text-white"
            : "border border-[#374151] bg-[#0B0E14]"
        }`}>
          {isSelected && (
            <CheckCircle2 size={18} />
          )}
        </div>

      </div>

    </div>
  );
}