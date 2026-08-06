import React from "react";

export default function Settings() {
  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-bold text-white">
          Settings
        </h1>
        <p className="mt-1 text-gray-400">
          Atur konfigurasi sistem dan preferensi aplikasi.
        </p>
      </div>

      <div className="space-y-5 rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
        
        <div>
          <label className="text-sm font-medium text-gray-400">
            Company Name
          </label>
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-[#1F2937] bg-[#0F172A] p-3 text-white transition-colors focus:border-[#3B82F6] focus:outline-none"
            defaultValue="tanya SEPUH"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-400">
            API Endpoint
          </label>
          <input
            type="text"
            className="mt-2 w-full rounded-xl border border-[#1F2937] bg-[#0F172A] p-3 text-white transition-colors focus:border-[#3B82F6] focus:outline-none"
            defaultValue="black-pearl-aic-comp-fest-khpfq0lxl-maccreas-projects.vercel.app/api"
          />
        </div>

        <div className="pt-2">
          <button className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
            Save Changes
          </button>
        </div>

      </div>
      
    </div>
  );
}