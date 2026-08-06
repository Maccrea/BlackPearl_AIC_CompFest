import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Brain,
  CheckCircle2,
  FileAudio,
  Search,
  Wrench,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function KnowledgeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [knowledge, setKnowledge] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`black-pearl-aic-comp-fest-khpfq0lxl-maccreas-projects.vercel.app/api/knowledge/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setKnowledge(data);
      })
      .catch((err) => {
        console.error("Detail error:", err);
        setError("Failed to load knowledge details");
      });
  }, [id]);

  if (error) {
    return <div className="mt-10 text-center text-red-500">{error}</div>;
  }

  if (!knowledge) {
    return <div className="mt-10 text-center text-gray-400">Loading detail data from database...</div>;
  }

  return (
    <div className="space-y-6">
      <button
        onClick={() => navigate("/admin/knowledge-ai")}
        className="flex items-center gap-2 text-sm text-gray-400 transition hover:text-white"
      >
        <ArrowLeft size={18} />
        Back to Knowledge AI
      </button>

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <h1 className="text-3xl font-bold text-white">
              {knowledge.title}
            </h1>
            <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
              {knowledge.status}
            </span>
          </div>
          <p className="text-gray-400">
            Knowledge extracted from engineer interviews and used as AI diagnostic references.
          </p>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">Knowledge ID</div>
          <div className="font-mono text-sm text-gray-300">#{knowledge.id}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5">
          <div className="text-xs text-gray-500">Knowledge Category</div>
          <div className="mt-2 text-lg font-bold text-white">
            {knowledge.category}
          </div>
        </div>

        <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5">
          <div className="text-xs text-gray-500">Created</div>
          <div className="mt-2 text-lg font-bold text-white">
            {knowledge.created}
          </div>
        </div>

        <div className="rounded-2xl border border-[#7C3AED]/30 bg-[#7C3AED]/5 p-5">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Brain size={16} className="text-[#A855F7]" />
            AI Confidence
          </div>
          <div className="mt-2 text-lg font-bold text-[#A855F7]">
            {knowledge.confidence}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-[#7C3AED]/30 bg-[#121620] p-6">
          <div className="mb-5 flex items-center gap-2">
            <Brain size={20} className="text-[#A855F7]" />
            <h2 className="text-lg font-bold text-white">AI Analysis</h2>
          </div>

          <div className="mb-5">
            <div className="text-xs text-gray-500">Predicted Root Cause</div>
            <div className="mt-2 text-lg font-bold text-white">
              {knowledge.prediction}
            </div>
          </div>

          <div>
            <div className="text-xs text-gray-500">Analysis</div>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              {knowledge.rootCause || "No root cause description available."}
            </p>
          </div>

          <div className="mt-6">
            <div className="mb-2 flex justify-between text-xs">
              <span className="text-gray-500">AI Confidence</span>
              <span className="font-bold text-green-400">
                {knowledge.confidence}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-[#1F2937]">
              <div
                className="h-2 rounded-full bg-green-500"
                style={{ width: `${knowledge.confidence}%` }}
              />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
          <div className="mb-5 flex items-center gap-2">
            <Search size={20} className="text-[#3B82F6]" />
            <h2 className="text-lg font-bold text-white">Detected Symptoms</h2>
          </div>

          <div className="space-y-3">
            {knowledge.symptoms && knowledge.symptoms.length > 0 ? (
              knowledge.symptoms.map((symptom, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-xl border border-[#1F2937] bg-[#0B0E14] p-3"
                >
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[#3B82F6]" />
                  <span className="text-sm text-gray-300">{symptom}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No symptoms recorded.</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-green-500/20 bg-[#121620] p-6">
        <div className="mb-5 flex items-center gap-2">
          <Wrench size={20} className="text-green-400" />
          <h2 className="text-lg font-bold text-white">Recommended Actions</h2>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {knowledge.recommendation && knowledge.recommendation.length > 0 ? (
            knowledge.recommendation.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-500/10 text-xs font-bold text-green-400">
                  {index + 1}
                </div>
                <span className="text-sm text-gray-300">{item}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No recommended actions available.</p>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A855F7]">
            <FileAudio size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Original Interview Transcript
            </h2>
            <p className="text-xs text-gray-500">
              Speech-to-Text results from the engineer interview
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-5">
          <p className="whitespace-pre-line text-sm leading-7 text-gray-300">
            {knowledge.transcript || "No audio transcript available for this case."}
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => navigate("/admin/knowledge-ai")}
          className="rounded-xl border border-[#374151] px-5 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
        >
          Back to Knowledge Base
        </button>
      </div>
    </div>
  );
}