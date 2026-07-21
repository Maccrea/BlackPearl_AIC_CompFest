import React from "react";
import dashboard from "../../mock/dashboard";

export default function MachineManagement() {
  return (
    <div className="space-y-6">
      
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-white">
          Machine Management
        </h1>
        <p className="mt-1 text-gray-400">
          Pantau status dan kondisi seluruh mesin di line produksi.
        </p>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden rounded-2xl border border-[#1F2937] bg-[#121620]">
        <table className="w-full text-left text-sm">
          
          <thead className="bg-[#1A1F2D]">
            <tr className="border-b border-[#1F2937] text-gray-400">
              <th className="p-4 font-medium">Machine</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Temperature</th>
              <th className="p-4 font-medium">Health</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-[#1F2937]">
            {dashboard.machines.map((machine) => (
              <tr 
                key={machine.id} 
                className="transition-colors hover:bg-white/5"
              >
                <td className="p-4 font-medium text-white">
                  {machine.name}
                </td>
                <td className="p-4 text-gray-300 capitalize">
                  {machine.status}
                </td>
                <td className="p-4 text-gray-300">
                  {machine.temperature}°C
                </td>
                <td className="p-4 text-gray-300">
                  {machine.health}%
                </td>
              </tr>
            ))}
          </tbody>
          
        </table>
      </div>
      
    </div>
  );
}