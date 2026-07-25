import React, { useState } from "react";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboard from "../../mock/dashboard";

export default function Validation() {
  const navigate = useNavigate();

  const [validationStatus, setValidationStatus] = useState("pending");
  const [engineerNote, setEngineerNote] = useState("");
  const [selectedDecision, setSelectedDecision] = useState(null);
  const [knowledgeSaved, setKnowledgeSaved] = useState(false);

  const analysis = dashboard.anomalyAnalysis;

  const machine = dashboard.machines.find(
    (m) => m.id === analysis?.machineId
  );

  if (!analysis || !machine) {
    return (
      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-8">
        <p className="text-[#9CA3AF]">Belum ada data validasi.</p>
      </div>
    );
  }

  const handleApprove = () => {
    setValidationStatus("approved");
    setSelectedDecision("approved");
  };

  const handleReject = () => {
    setSelectedDecision("rejected");
  };

  const handleSubmitCorrection = () => {
    if (!engineerNote.trim()) return;
    setValidationStatus("corrected");
  };

  const handleSaveToKnowledge = () => {
    setKnowledgeSaved(true);
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Engineer Validation</h1>
          <p className="mt-1 text-[#9CA3AF]">
            Proses validasi engineer terhadap rekomendasi AI untuk mesin{" "}
            <span className="font-semibold text-white">{machine.name}</span>
          </p>
        </div>

        <button
          onClick={handleBack}
          className="flex w-fit items-center gap-2 rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-2.5 text-sm font-medium text-[#9CA3AF] transition hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 hover:text-white"
        >
          <ArrowLeft size={16} />
          Kembali
        </button>
      </div>

      <ValidationStatusCard
        validationStatus={validationStatus}
        knowledgeSaved={knowledgeSaved}
      />

      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-[#7C3AED]/10 p-3 text-[#A855F7]">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              AI Analysis Summary
            </h2>
            <p className="text-sm text-[#8B95A7]">
              Detail analisis dan rekomendasi dari AI yang memerlukan validasi
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Info label="Machine" value={machine.name} />
          <Info label="Machine Type" value={machine.type} />
          <Info label="Production Line" value={machine.line} />
          <Info label="Detected Issue" value={analysis.aiPrediction} />
          <Info
            label="AI Confidence"
            value={`${analysis.aiConfidence}%`}
            color="text-[#A855F7]"
          />
          <Info
            label="Status"
            value={machine.status.toUpperCase()}
            color="text-[#EF4444]"
          />
        </div>

        <div className="mt-6 rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">
          <div className="mb-3 text-sm font-semibold text-white">
            Detected Anomalies
          </div>
          <div className="space-y-2">
            {analysis.detectedAnomalies.map((anomaly, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg bg-[#EF4444]/5 p-3"
              >
                <span className="text-sm text-white">
                  {anomaly.parameter}: {anomaly.value}
                  {anomaly.unit}
                </span>
                <span className="text-xs font-bold text-[#EF4444]">
                  ↑ {anomaly.threshold}
                  {anomaly.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {validationStatus === "pending" && (
        <ValidationDecisionSection
          onApprove={handleApprove}
          onReject={handleReject}
          selectedDecision={selectedDecision}
          engineerNote={engineerNote}
          setEngineerNote={setEngineerNote}
          onSubmitCorrection={handleSubmitCorrection}
        />
      )}

      {validationStatus === "approved" && (
        <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-[#10B981]/10 p-3 text-[#10B981]">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">
                Rekomendasi Disetujui
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#8B95A7]">
                Rekomendasi AI telah divalidasi dan disetujui oleh engineer.
                Solusi ini dapat disimpan ke Knowledge Base dan digunakan sebagai
                referensi untuk kasus serupa di masa depan.
              </p>
              {!knowledgeSaved && (
                <button
                  onClick={handleSaveToKnowledge}
                  className="mt-4 rounded-xl bg-[#10B981] px-4 py-2.5 font-semibold text-white transition hover:bg-[#10B981]/90"
                >
                  Simpan ke Knowledge Base
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {validationStatus === "corrected" && !knowledgeSaved && (
        <div className="rounded-2xl border border-[#7C3AED]/30 bg-[#7C3AED]/5 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-[#7C3AED]/10 p-3 text-[#A855F7]">
              <ShieldCheck size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">
                Koreksi Engineer Tercatat
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#8B95A7]">
                Koreksi dari engineer telah berhasil dicatat. Simpan koreksi
                ini ke Knowledge Base agar dapat digunakan sebagai referensi
                untuk kasus serupa di masa mendatang.
              </p>
              <div className="mt-4 rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">
                <div className="text-xs font-medium text-[#8B95A7]">
                  Engineer Note
                </div>
                <div className="mt-2 text-sm leading-6 text-white">
                  {engineerNote}
                </div>
              </div>
              <button
                onClick={handleSaveToKnowledge}
                className="mt-4 rounded-xl bg-[#7C3AED] px-4 py-2.5 font-semibold text-white transition hover:bg-[#6D28D9]"
              >
                Simpan Koreksi ke Knowledge Base
              </button>
            </div>
          </div>
        </div>
      )}

      {knowledgeSaved && (
        <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/5 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-xl bg-[#10B981]/10 p-3 text-[#10B981]">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white">
                Knowledge Berhasil Disimpan
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#8B95A7]">
                {validationStatus === "approved"
                  ? "Rekomendasi AI yang telah divalidasi engineer berhasil disimpan ke Knowledge Base."
                  : "Koreksi engineer telah berhasil disimpan ke Knowledge Base."}
              </p>
              <p className="mt-2 text-sm leading-6 text-[#6B7280]">
                Knowledge ini dapat digunakan sebagai referensi untuk membantu
                AI menganalisis kasus serupa di masa mendatang.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  onClick={handleBack}
                  className="rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-2.5 font-semibold text-white transition hover:border-[#7C3AED] hover:bg-[#7C3AED]/10"
                >
                  Kembali
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ValidationStatusCard({ validationStatus, knowledgeSaved }) {
  const statusConfig = {
    pending: {
      icon: Clock,
      title: "Menunggu Validasi Engineer",
      color: "text-[#F59E0B]",
      bgColor: "bg-[#F59E0B]/10",
      borderColor: "border-[#F59E0B]/30",
    },
    approved: {
      icon: CheckCircle2,
      title: "Disetujui oleh Engineer",
      color: "text-[#10B981]",
      bgColor: "bg-[#10B981]/5",
      borderColor: "border-[#10B981]/30",
    },
    corrected: {
      icon: ShieldCheck,
      title: "Koreksi Engineer Tercatat",
      color: "text-[#7C3AED]",
      bgColor: "bg-[#7C3AED]/5",
      borderColor: "border-[#7C3AED]/30",
    },
  };

  const savedConfig = {
    icon: CheckCircle2,
    title: "Knowledge Berhasil Disimpan",
    color: "text-[#10B981]",
    bgColor: "bg-[#10B981]/5",
    borderColor: "border-[#10B981]/30",
  };

  const config = knowledgeSaved
    ? savedConfig
    : statusConfig[validationStatus] || statusConfig.pending;

  const Icon = config.icon;

  return (
    <div
      className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-6`}
    >
      <div className="flex items-center gap-4">
        <div className={`rounded-xl ${config.bgColor} p-3 ${config.color}`}>
          <Icon size={24} />
        </div>
        <div>
          <div className={`text-sm font-semibold ${config.color}`}>
            Validation Status
          </div>
          <div className="mt-1 text-xl font-bold text-white">
            {config.title}
          </div>
        </div>
      </div>
    </div>
  );
}

function ValidationDecisionSection({
  onApprove,
  onReject,
  selectedDecision,
  engineerNote,
  setEngineerNote,
  onSubmitCorrection,
}) {
  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
      <h2 className="mb-6 text-lg font-bold text-white">Engineer Decision</h2>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          onClick={onApprove}
          className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-semibold transition ${
            selectedDecision === "approved"
              ? "border-[#10B981] bg-[#10B981]/10 text-[#10B981]"
              : "border-[#374151] bg-[#0B0E14] text-white hover:border-[#10B981]/50 hover:bg-[#10B981]/10"
          }`}
        >
          <CheckCircle2 size={18} />
          Setujui Rekomendasi
        </button>

        <button
          onClick={onReject}
          className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 font-semibold transition ${
            selectedDecision === "rejected"
              ? "border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]"
              : "border-[#374151] bg-[#0B0E14] text-white hover:border-[#EF4444]/50 hover:bg-[#EF4444]/10"
          }`}
        >
          <XCircle size={18} />
          Berikan Koreksi
        </button>
      </div>

      {selectedDecision === "rejected" && (
        <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">
          <label className="mb-2 block text-sm font-semibold text-white">
            Engineer Correction / Notes
          </label>
          <textarea
            value={engineerNote}
            onChange={(e) => setEngineerNote(e.target.value)}
            placeholder="Masukkan koreksi atau catatan engineering Anda di sini..."
            className="w-full resize-none rounded-lg border border-[#374151] bg-[#0B0E14] p-3 text-sm text-white placeholder-[#6B7280] outline-none transition focus:border-[#7C3AED]"
            rows={4}
          />
          <div className="mt-3 text-xs leading-5 text-[#8B95A7]">
            Berikan penjelasan detail tentang apa yang salah dengan rekomendasi
            AI dan solusi yang benar menurut Anda.
          </div>
          <button
            onClick={onSubmitCorrection}
            disabled={!engineerNote.trim()}
            className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-4 py-2.5 font-semibold text-white transition hover:bg-[#6D28D9] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={16} />
            Simpan Koreksi
          </button>
        </div>
      )}
    </div>
  );
}

function Info({ label, value, color = "text-white" }) {
  return (
    <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">
      <div className="text-xs text-[#8B95A7]">{label}</div>
      <div className={`mt-2 text-sm font-bold ${color}`}>{value}</div>
    </div>
  );
}