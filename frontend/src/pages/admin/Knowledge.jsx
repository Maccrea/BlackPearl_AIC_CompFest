import React from "react";
import { UploadCloud, Eye, Brain } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function KnowledgeAI() {
  const navigate = useNavigate();

  const knowledgeCases = [
    {
      id: 1,
      title: "Motor Overheating",
      category: "Motor & Cooling System",
      created: "20 Jul 2026",
      status: "Active",
      confidence: 94,
    },
    {
      id: 2,
      title: "Excessive Machine Vibration",
      category: "Machine Vibration",
      created: "18 Jul 2026",
      status: "Active",
      confidence: 91,
    },
  ];

  return (
    <div className="space-y-6">

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Knowledge AI
          </h1>

          <p className="mt-1 text-gray-400">
            Kelola knowledge base AI yang digunakan untuk membantu proses
            diagnosis dan troubleshooting mesin.
          </p>
        </div>

        <button
          onClick={() => navigate("/admin/knowledge-ai/upload")}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#7C3AED] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
        >
          <UploadCloud size={18} />
          Upload Interview
        </button>

      </div>


      <div className="rounded-2xl border border-[#7C3AED]/20 bg-[#7C3AED]/5 p-5">

        <div className="flex items-start gap-4">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A855F7]">
            <Brain size={22} />
          </div>

          <div>

            <h2 className="font-semibold text-white">
              Knowledge Extraction Pipeline
            </h2>

            <p className="mt-1 text-sm leading-6 text-gray-400">
              Upload rekaman interview engineer untuk mengubah percakapan
              menjadi knowledge yang dapat digunakan AI.
            </p>

            <div className="mt-3 text-xs font-medium text-[#A855F7]">
              Audio Interview
              <span className="mx-2 text-gray-600">→</span>
              Speech-to-Text
              <span className="mx-2 text-gray-600">→</span>
              Knowledge Extraction
              <span className="mx-2 text-gray-600">→</span>
              Knowledge Base
            </div>

          </div>

        </div>

      </div>


      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">

        <div className="mb-5">

          <h2 className="text-lg font-bold text-white">
            Knowledge Base
          </h2>

          <p className="mt-1 text-sm text-gray-400">
            Daftar knowledge yang telah diproses dan tersedia untuk AI.
          </p>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full text-left text-sm">

            <thead>

              <tr className="border-b border-[#1F2937] text-gray-400">

                <th className="pb-4 font-medium">
                  Knowledge
                </th>

                <th className="pb-4 font-medium">
                  Category
                </th>

                <th className="pb-4 font-medium">
                  Created
                </th>

                <th className="pb-4 font-medium">
                  Confidence
                </th>

                <th className="pb-4 font-medium">
                  Status
                </th>

                <th className="pb-4 text-right font-medium">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {knowledgeCases.map((item) => (

                <tr
                  key={item.id}
                  className="border-b border-[#1F2937] last:border-0"
                >

                  <td className="py-4 font-medium text-white">
                    {item.title}
                  </td>

                  <td className="py-4 text-gray-300">
                    {item.category}
                  </td>

                  <td className="py-4 text-gray-300">
                    {item.created}
                  </td>

                  <td className="py-4 font-semibold text-[#A855F7]">
                    {item.confidence}%
                  </td>

                  <td className="py-4">

                    <span className="rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
                      {item.status}
                    </span>

                  </td>

                  <td className="py-4 text-right">

                    <button
                      onClick={() =>
                        navigate(`/admin/knowledge-ai/${item.id}`)
                      }
                      className="inline-flex items-center gap-2 rounded-lg border border-[#374151] px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
                    >

                      <Eye size={15} />

                      Detail

                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}