import React from "react";

export default function KnowledgeAI() {
  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-white">
          Knowledge AI
        </h1>
        <p className="mt-1 text-gray-400">
          Kelola knowledge base AI untuk diagnosis mesin.
        </p>
      </div>

      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-400">
              <th className="pb-4 font-medium">Case</th>
              <th className="pb-4 font-medium">Machine</th>
              <th className="pb-4 font-medium">Created</th>
              <th className="pb-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-[#1F2937]">
              <td className="py-4 font-medium text-white">
                Overheating Motor
              </td>
              <td className="py-4 text-gray-300">
                Machine E
              </td>
              <td className="py-4 text-gray-300">
                20 Jul 2026
              </td>
              <td className="py-4 font-semibold text-green-400">
                Active
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
    </div>
  );
}