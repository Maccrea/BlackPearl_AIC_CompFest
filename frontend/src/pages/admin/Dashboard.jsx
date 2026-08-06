import React from "react";
import StatCards from "../../components/cards/StatCards.jsx"; 
import RecentAlerts from "../../components/cards/RecentAlerts.jsx";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-gray-400">Monitoring the entire Black Pearl AI system</p>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        
        <RecentAlerts />

        <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
          <h2 className="mb-4 text-lg font-bold text-white">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
              <div className="text-sm text-gray-400">API Connection</div>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Online
              </div>
            </div>
            <div className="flex items-center justify-between border-b border-[#1F2937] pb-4">
              <div className="text-sm text-gray-400">AI LLaMA 3 Engine</div>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Running
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">Supabase Database</div>
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Connected
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}