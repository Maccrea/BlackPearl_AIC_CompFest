import React, { useState, useEffect } from "react";
import {
  UploadCloud,
  Eye,
  Brain,
  X,
  FileSpreadsheet,
  Mic,
  Edit3,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KnowledgeAI() {
  const navigate = useNavigate();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [knowledgeCases, setKnowledgeCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8000/api/knowledge")
      .then((res) => res.json())
      .then((data) => {
        setKnowledgeCases(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="w-full max-w-full min-w-0 space-y-6 pb-10">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-white md:text-3xl">
            Knowledge AI
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Manage the AI knowledge base used to assist with machine diagnosis and troubleshooting processes.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D28D9] md:w-auto"
        >
          <UploadCloud size={18} />
          Upload Dataset
        </button>
      </div>

      <div className="rounded-2xl border border-[#7C3AED]/20 bg-[#7C3AED]/5 p-5 md:p-6">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A855F7]">
            <Brain size={24} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-white">
              Knowledge Extraction Pipeline
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-400">
              Upload datasets, engineer interview recordings, or manual inputs to add knowledge that the AI can utilize.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-[#A855F7]">
              <span className="rounded bg-[#7C3AED]/10 px-2 py-1">Raw Data / Audio</span>
              <span className="text-gray-500">→</span>
              <span className="rounded bg-[#7C3AED]/10 px-2 py-1">Extraction</span>
              <span className="text-gray-500">→</span>
              <span className="rounded bg-[#7C3AED]/10 px-2 py-1">Knowledge Base</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-2xl border border-[#1F2937] bg-[#121620]">
        <div className="mb-4 p-5 pb-0 md:p-6 md:pb-0">
          <h2 className="text-lg font-bold text-white">Knowledge Base</h2>
          <p className="mt-1 text-sm text-gray-400">
            List of processed knowledge available for the AI.
          </p>
        </div>

        <div className="block w-full max-w-full overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1F2937] text-gray-400">
                <th className="p-5 font-medium">Knowledge</th>
                <th className="p-5 font-medium">Category</th>
                <th className="p-5 font-medium">Created</th>
                <th className="p-5 font-medium">Confidence</th>
                <th className="p-5 font-medium">Status</th>
                <th className="p-5 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-sm text-gray-500">
                    <div className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#A855F7] border-t-transparent"></span>
                      Loading data from database...
                    </div>
                  </td>
                </tr>
              ) : knowledgeCases.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-sm text-gray-500">
                    Knowledge data is not available yet.
                  </td>
                </tr>
              ) : (
                knowledgeCases?.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#1F2937] transition-colors last:border-0 hover:bg-white/[0.02]"
                  >
                    <td className="p-5 font-medium text-white">
                      {item.title}
                    </td>
                    <td className="p-5 text-gray-300">{item.category}</td>
                    <td className="p-5 text-gray-300">{item.created?.split("T")[0]}</td>
                    <td className="p-5 font-semibold text-[#A855F7]">
                      {item.confidence}%
                    </td>
                    <td className="p-5">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <button
                        onClick={() => navigate(`/admin/knowledge-ai/${item.id}`)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#374151] bg-[#0B0E14] px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-gray-400 hover:text-white"
                      >
                        <Eye size={15} /> Detail
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#1F2937] bg-[#121620] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F2937] p-5 md:p-6">
              <div>
                <h2 className="text-xl font-bold text-white">Select Upload Type</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Choose the data format to add to the AI system.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-5 md:p-6">
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => navigate("/admin/knowledge-ai/upload-doc")}
                  className="group flex flex-col items-start gap-4 rounded-xl border border-[#1F2937] bg-[#0B0E14] p-5 text-left transition-all hover:border-blue-500/50 hover:bg-blue-500/5 sm:flex-row sm:items-center"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-transform group-hover:scale-110">
                    <FileSpreadsheet size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white">Upload Document / Dataset</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400">
                      Upload structured data in CSV, Excel (.xlsx), or JSON format.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/admin/knowledge-ai/upload-interview")}
                  className="group flex flex-col items-start gap-4 rounded-xl border border-[#1F2937] bg-[#0B0E14] p-5 text-left transition-all hover:border-[#A855F7]/50 hover:bg-[#A855F7]/5 sm:flex-row sm:items-center"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A855F7] transition-transform group-hover:scale-110">
                    <Mic size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white">Upload Interview Results</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400">
                      Upload engineer interview audio recordings for AI extraction.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/admin/knowledge-ai/upload-description")}
                  className="group flex flex-col items-start gap-4 rounded-xl border border-[#1F2937] bg-[#0B0E14] p-5 text-left transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 sm:flex-row sm:items-center"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-transform group-hover:scale-110">
                    <Edit3 size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-white">Write Manual Description</h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-400">
                      Directly type issues, symptoms, and technical solutions into the system.
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}