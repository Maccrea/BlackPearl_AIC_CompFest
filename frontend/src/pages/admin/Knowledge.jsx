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
        console.error("Gagal fetch knowledge:", err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white sm:text-3xl">
            Knowledge AI
          </h1>
          <p className="mt-1 text-sm text-gray-400 sm:text-base">
            Kelola knowledge base AI yang digunakan untuk membantu proses
            diagnosis dan troubleshooting mesin.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9] sm:w-auto"
        >
          <UploadCloud size={18} />
          Upload Dataset
        </button>
      </div>

      <div className="rounded-2xl border border-[#7C3AED]/20 bg-[#7C3AED]/5 p-5 sm:p-6">
        <div className="flex flex-col items-start gap-4 sm:flex-row">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A855F7]">
            <Brain size={24} />
          </div>
          <div>
            <h2 className="font-semibold text-white">
              Knowledge Extraction Pipeline
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Upload dataset, rekaman interview engineer, atau input manual
              untuk menambah knowledge yang dapat digunakan AI.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-medium text-[#A855F7]">
              <span>Raw Data / Audio</span>
              <span className="text-gray-600">→</span>
              <span>Extraction</span>
              <span className="text-gray-600">→</span>
              <span>Knowledge Base</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-bold text-white">Knowledge Base</h2>
          <p className="mt-1 text-sm text-gray-400">
            Daftar knowledge yang telah diproses dan tersedia untuk AI.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-[#1F2937] text-gray-400">
                <th className="px-4 pb-4 font-medium first:pl-0">Knowledge</th>
                <th className="px-4 pb-4 font-medium">Category</th>
                <th className="px-4 pb-4 font-medium">Created</th>
                <th className="px-4 pb-4 font-medium">Confidence</th>
                <th className="px-4 pb-4 font-medium">Status</th>
                <th className="pb-4 text-right font-medium pr-0">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-4 px-4 text-center text-gray-400">
                    Memuat data dari database...
                  </td>
                </tr>
              ) : knowledgeCases.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-4 px-4 text-center text-gray-400">
                    Data Knowledge belum tersedia.
                  </td>
                </tr>
              ) : (
                knowledgeCases.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#1F2937] last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 px-4 font-medium text-white first:pl-0">
                      {item.title}
                    </td>
                    <td className="py-4 px-4 text-gray-300">{item.category}</td>
                    <td className="py-4 px-4 text-gray-300">{item.created}</td>
                    <td className="py-4 px-4 font-semibold text-[#A855F7]">
                      {item.confidence}%
                    </td>
                    <td className="py-4 px-4">
                      <span className="rounded-full bg-green-500/10 px-3 py-1.5 text-xs font-semibold text-green-400">
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 text-right pr-0">
                      <button
                        onClick={() => navigate(`/admin/knowledge-ai/${item.id}`)}
                        className="inline-flex items-center gap-2 rounded-lg border border-[#374151] bg-[#0B0E14] px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-[#1F2937] bg-[#121620] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#1F2937] p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-white">
                  Pilih Tipe Upload
                </h2>
                <p className="mt-1 text-sm text-gray-400">
                  Format data untuk ditambahkan ke Knowledge AI.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-[#1F2937] hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto p-5 sm:p-6">
              <div className="grid grid-cols-1 gap-4">
                <button
                  onClick={() => navigate("/admin/knowledge-ai/upload-doc")}
                  className="group flex flex-col items-start gap-4 rounded-xl border border-[#1F2937] bg-[#0B0E14] p-5 text-left transition-all hover:border-blue-500/50 hover:bg-blue-500/5 sm:flex-row sm:items-center"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-transform group-hover:scale-110">
                    <FileSpreadsheet size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">
                      Upload Dokumen / Dataset
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      Unggah data terstruktur dalam format CSV, Excel (.xlsx),
                      atau JSON.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() =>
                    navigate("/admin/knowledge-ai/upload-interview")
                  }
                  className="group flex flex-col items-start gap-4 rounded-xl border border-[#1F2937] bg-[#0B0E14] p-5 text-left transition-all hover:border-[#A855F7]/50 hover:bg-[#A855F7]/5 sm:flex-row sm:items-center"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A855F7] transition-transform group-hover:scale-110">
                    <Mic size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">
                      Upload Hasil Interview
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      Unggah rekaman audio wawancara dengan Engineer untuk
                      diekstrak AI.
                    </p>
                  </div>
                </button>

                <button
                  onClick={() =>
                    navigate("/admin/knowledge-ai/upload-description")
                  }
                  className="group flex flex-col items-start gap-4 rounded-xl border border-[#1F2937] bg-[#0B0E14] p-5 text-left transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 sm:flex-row sm:items-center"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 transition-transform group-hover:scale-110">
                    <Edit3 size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">
                      Tulis Deskripsi Manual
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-gray-400">
                      Ketik langsung masalah, gejala, dan solusi teknis ke dalam
                      sistem.
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