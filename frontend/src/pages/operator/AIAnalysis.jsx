import React, { useState } from "react";
import {
  Brain,
  AlertTriangle,
  Thermometer,
  Activity,
  Zap,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  TrendingDown,
  Award,
} from "lucide-react";
import dashboard from "../../mock/dashboard";

export default function AIAnalysis() {
  const analysis = dashboard.anomalyAnalysis;
  const similarCase = dashboard.similarCaseMatch;
  const machine = dashboard.machines.find((m) => m.id === analysis.machineId);

  if (!analysis || !machine) {
    return (
      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-8">
        <p className="text-[#9CA3AF]">
          Belum ada data analisis AI.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          AI Analysis
        </h1>
        <p className="mt-1 text-[#9CA3AF]">
          Analisis AI untuk mesin yang mengalami anomali
        </p>
      </div>

      {/* Anomaly Alert */}
      <AnomalyAlert analysis={analysis} machine={machine} />

      {/* Detected Anomalies */}
      <DetectedAnomalies analysis={analysis} />

      {/* AI Prediction */}
      <AIPrediction analysis={analysis} />

      {/* Main Flow - Similar Case vs New Recommendation */}
      {similarCase.found ? (
        <SimilarCaseFound similarCase={similarCase} />
      ) : (
        <NewRecommendation analysis={analysis} />
      )}

    </div>
  );
}

/* ============ Anomaly Alert Component ============ */
function AnomalyAlert({ analysis, machine }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-[#EF4444]/30 bg-[#EF4444]/5 p-6">
      <div className="rounded-xl bg-[#EF4444]/10 p-3 text-[#EF4444]">
        <AlertTriangle size={24} />
      </div>

      <div>
        <div className="text-sm font-semibold text-[#EF4444]">
          Anomaly Detected
        </div>

        <div className="mt-1 text-xl font-bold text-white">
          {machine.name} - {analysis.aiPrediction}
        </div>

        <p className="mt-2 text-sm text-[#9CA3AF]">
          AI mendeteksi kondisi abnormal pada mesin berdasarkan parameter operasional yang melebihi batas normal.
        </p>

        <div className="mt-2 text-xs text-[#8B95A7]">
          Waktu deteksi: {analysis.timestamp}
        </div>
      </div>
    </div>
  );
}

/* ============ Detected Anomalies Component ============ */
function DetectedAnomalies({ analysis }) {
  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
      <h2 className="mb-5 text-lg font-bold text-white">
        Detected Anomalies
      </h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {analysis.detectedAnomalies.map((anomaly, idx) => (
          <AnomalyMetric key={idx} anomaly={anomaly} />
        ))}
      </div>
    </div>
  );
}

function AnomalyMetric({ anomaly }) {
  const isAbnormal = anomaly.status !== "normal";
  const getIcon = () => {
    if (anomaly.parameter === "Temperature") return Thermometer;
    if (anomaly.parameter === "Vibration") return Activity;
    if (anomaly.parameter === "Current") return Zap;
    return CheckCircle2;
  };

  const Icon = getIcon();

  return (
    <div className={`rounded-2xl border p-4 ${
      isAbnormal
        ? "border-[#EF4444]/30 bg-[#EF4444]/5"
        : "border-[#10B981]/30 bg-[#10B981]/5"
    }`}>
      <div className="flex items-start justify-between">
        <Icon size={20} className={isAbnormal ? "text-[#EF4444]" : "text-[#10B981]"} />
        <span className={`text-[10px] font-bold rounded px-2 py-1 ${
          isAbnormal
            ? "bg-[#EF4444]/20 text-[#EF4444]"
            : "bg-[#10B981]/20 text-[#10B981]"
        }`}>
          {isAbnormal ? "CRITICAL" : "OK"}
        </span>
      </div>

      <div className="mt-3">
        <div className="text-xs text-[#8B95A7]">
          {anomaly.parameter}
        </div>
        <div className={`mt-1 text-xl font-bold ${isAbnormal ? "text-[#EF4444]" : "text-white"}`}>
          {anomaly.value}{anomaly.unit}
        </div>
        <div className="mt-1 text-[10px] text-[#6B7280]">
          Threshold: {anomaly.threshold}{anomaly.unit}
        </div>
      </div>
    </div>
  );
}

/* ============ AI Prediction Component ============ */
function AIPrediction({ analysis }) {
  return (
    <div className="rounded-2xl border border-[#7C3AED]/30 bg-[#121620] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-xl bg-[#7C3AED]/10 p-3 text-[#A855F7]">
          <Brain size={22} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-white">
            AI Diagnosis
          </h2>
          <p className="text-xs text-[#8B95A7]">
            Predicted machine condition
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-5">
        <div className="text-xs text-[#8B95A7]">
          Prediction
        </div>

        <div className="mt-2 text-2xl font-bold text-white">
          {analysis.aiPrediction}
        </div>

        <div className="mt-5">
          <div className="mb-2 flex justify-between text-xs">
            <span className="text-[#8B95A7]">
              AI Confidence
            </span>
            <span className="font-bold text-[#10B981]">
              {analysis.aiConfidence}%
            </span>
          </div>

          <div className="h-2 rounded-full bg-[#1F2937]">
            <div
              className="h-2 rounded-full bg-[#10B981]"
              style={{
                width: `${analysis.aiConfidence}%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ Similar Case Found Component ============ */
function SimilarCaseFound({ similarCase }) {
  return (
    <div className="space-y-6">
      {/* Match Score */}
      <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-[#10B981]/10 p-3 text-[#10B981]">
            <Award size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Similar Case Found
            </h2>
            <p className="text-xs text-[#8B95A7]">
              Sistem menemukan kasus historis yang serupa
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[#10B981]/20 bg-[#0B0E14] p-4">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm text-[#8B95A7]">Similarity Score</span>
            <span className="text-2xl font-bold text-[#10B981]">
              {similarCase.similarityScore}%
            </span>
          </div>

          <div className="h-2 rounded-full bg-[#1F2937]">
            <div
              className="h-2 rounded-full bg-[#10B981]"
              style={{
                width: `${similarCase.similarityScore}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Historical Case Details */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
        <h3 className="mb-4 text-lg font-bold text-white">
          Historical Case Details
        </h3>

        <div className="space-y-4">
          <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">
            <div className="text-xs text-[#8B95A7]">Case ID</div>
            <div className="mt-1 font-mono text-sm font-bold text-white">
              {similarCase.caseId}
            </div>
          </div>

          <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">
            <div className="text-xs text-[#8B95A7]">Case Title</div>
            <div className="mt-1 text-sm font-bold text-white">
              {similarCase.caseTitle}
            </div>
          </div>

          <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">
            <div className="text-xs text-[#8B95A7]">Matched Symptoms</div>
            <ul className="mt-2 space-y-1">
              {similarCase.matchedSymptoms.map((symptom, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-white">
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-[#10B981]" />
                  {symptom}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">
            <div className="text-xs text-[#8B95A7]">Root Cause</div>
            <div className="mt-1 text-sm font-bold text-[#10B981]">
              {similarCase.rootCause}
            </div>
          </div>

          <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">
            <div className="text-xs text-[#8B95A7]">Previous Successful Solution</div>
            <ol className="mt-2 space-y-2">
              {similarCase.previousSolution.map((solution, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-white">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#10B981]/20 text-xs font-bold text-[#10B981]">
                    {idx + 1}
                  </span>
                  {solution}
                </li>
              ))}
            </ol>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">
              <div className="text-xs text-[#8B95A7]">Result</div>
              <div className="mt-1 inline-flex items-center gap-1.5 text-sm font-bold text-[#10B981]">
                <CheckCircle2 size={14} />
                {similarCase.result}
              </div>
            </div>

            <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">
              <div className="text-xs text-[#8B95A7]">Engineer</div>
              <div className="mt-1 text-sm font-bold text-white">
                {similarCase.engineer}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex gap-3">
        <button className="flex-1 rounded-xl border border-[#10B981]/30 bg-[#10B981]/10 px-4 py-3 font-semibold text-[#10B981] transition hover:bg-[#10B981]/20">
          Follow This Solution
        </button>
        <button className="flex-1 rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 font-semibold text-white transition hover:border-[#7C3AED] hover:bg-[#7C3AED]/10">
          Need AI Recommendation
        </button>
      </div>
    </div>
  );
}

/* ============ New Recommendation Component (Similar Case Not Found) ============ */
function NewRecommendation({ analysis }) {
  return (
    <div className="space-y-6">
      {/* No Similar Case Alert */}
      <div className="rounded-2xl border border-[#F59E0B]/30 bg-[#F59E0B]/5 p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-xl bg-[#F59E0B]/10 p-3 text-[#F59E0B]">
            <Lightbulb size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              No Similar Case Found
            </h2>
            <p className="text-xs text-[#8B95A7]">
              AI akan memberikan rekomendasi baru berdasarkan analisis parameter
            </p>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
        <h3 className="mb-4 text-lg font-bold text-white">
          AI Recommended Actions
        </h3>

        <div className="space-y-3">
          {analysis.detectedAnomalies.map((anomaly, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#A855F7]/20 text-xs font-bold text-[#A855F7]">
                {idx + 1}
              </div>

              <div>
                <div className="font-semibold text-white">
                  {getRecommendationTitle(anomaly.parameter)}
                </div>
                <div className="mt-1 text-sm text-[#8B95A7]">
                  {getRecommendationDescription(anomaly)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confidence Note */}
      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
        <div className="flex items-center gap-2 text-sm">
          <AlertTriangle size={18} className="text-[#F59E0B]" />
          <div>
            <p className="font-semibold text-white">
              Rekomendasi belum divalidasi
            </p>
            <p className="mt-1 text-sm text-[#8B95A7]">
              Rekomendasi ini masih merupakan prediksi AI dan memerlukan validasi dari engineer sebelum diterapkan. Silakan lanjutkan ke proses validasi.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button className="flex-1 rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 font-semibold text-white transition hover:border-[#7C3AED] hover:bg-[#7C3AED]/10">
          Request Engineer Validation
        </button>
        <button className="flex-1 rounded-xl bg-[#7C3AED] px-4 py-3 font-semibold text-white transition hover:bg-[#7C3AED]/90">
          Proceed to Validation
          <ArrowRight size={16} className="ml-2 inline" />
        </button>
      </div>
    </div>
  );
}

/* ============ Helper Functions ============ */
function getRecommendationTitle(parameter) {
  const titles = {
    "Temperature": "Check Cooling System",
    "Vibration": "Inspect Bearing & Alignment",
    "Current": "Check Motor Load",
  };
  return titles[parameter] || `Check ${parameter}`;
}

function getRecommendationDescription(anomaly) {
  const descriptions = {
    "Temperature": `Motor temperature mencapai ${anomaly.value}°C (threshold: ${anomaly.threshold}°C). Periksa sistem pendingin dan pastikan fan bekerja dengan baik.`,
    "Vibration": `Getaran mesin mencapai ${anomaly.value}mm/s (threshold: ${anomaly.threshold}mm/s). Periksa keselarasan dan kondisi bearing.`,
    "Current": `Arus listrik mencapai ${anomaly.value}A (threshold: ${anomaly.threshold}A). Periksa beban motor dan kabelnya.`,
  };
  return descriptions[anomaly.parameter] || `Parameter ${anomaly.parameter} menunjukkan nilai abnormal.`;
}