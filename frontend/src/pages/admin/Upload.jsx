import React from "react";
import { UploadCloud } from "lucide-react";

export default function UploadData() {
  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-white">
          Upload Dataset
        </h1>
        <p className="mt-1 text-gray-400">
          Unggah file dataset untuk memperbarui knowledge base AI.
        </p>
      </div>

      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-8 text-center">
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#4B5563] bg-white/5 py-16 transition-colors hover:border-[#3B82F6] hover:bg-white/10">
          
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
            <UploadCloud size={32} />
          </div>
          
          <h2 className="text-xl font-bold text-white">
            Drag & Drop Dataset
          </h2>
          <p className="mt-2 text-sm text-gray-400">
            Mendukung format CSV, Excel, atau JSON
          </p>
          
          <button className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Choose File
          </button>
          
        </div>
      </div>
      
    </div>
  );
}