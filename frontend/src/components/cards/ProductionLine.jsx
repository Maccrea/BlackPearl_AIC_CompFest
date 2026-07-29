import React from "react";
import {
  ArrowRight,
  Factory,
  CheckCircle2,
  AlertTriangle,
  OctagonAlert,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboard from "../../mock/dashboard";

export default function ProductionLine() {
  const navigate = useNavigate();

  const machines = dashboard.machines || [];

  const productionLines = [
    ...new Set(
      machines
        .map((machine) => machine.line)
        .filter(Boolean)
    ),
  ];

  const getMachinesByLine = (line) =>
    machines.filter((machine) => machine.line === line);

  const getStatusCount = (lineMachines, status) =>
    lineMachines.filter(
      (machine) => machine.status === status
    ).length;

  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">
      <div className="mb-5 flex items-center justify-between">

        <div>
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold text-white">
              Production Lines
            </h3>

            <span className="flex items-center gap-1.5 rounded-full bg-[#10B981]/10 px-2.5 py-1 text-xs font-medium text-[#10B981]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#10B981]" />
              Live
            </span>
          </div>

          <p className="mt-1 text-sm text-[#8B95A7]">
            Kondisi production line saat ini.
          </p>
        </div>

        <button
          onClick={() => navigate("/operator/production-line")}
          className="flex items-center gap-1.5 text-sm font-medium text-[#9CA3AF] transition hover:text-white"
        >
          Lihat Semua
          <ArrowRight size={16} />
        </button>

      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        {productionLines.map((line) => {

          const lineMachines = getMachinesByLine(line);

          const healthyCount = getStatusCount(
            lineMachines,
            "healthy"
          );

          const warningCount = getStatusCount(
            lineMachines,
            "warning"
          );

          const criticalCount = getStatusCount(
            lineMachines,
            "critical"
          );

          const hasCritical = criticalCount > 0;
          const hasWarning = warningCount > 0;

          // Tentukan status keseluruhan line
          const lineStatus = hasCritical
            ? "critical"
            : hasWarning
            ? "warning"
            : "healthy";

          const statusConfig = {
            healthy: {
              label: "All Systems Normal",
              color: "text-[#10B981]",
              bg: "bg-[#10B981]/10",
              border: "border-[#10B981]/20",
              icon: CheckCircle2,
            },

            warning: {
              label: "Warning Detected",
              color: "text-[#F59E0B]",
              bg: "bg-[#F59E0B]/10",
              border: "border-[#F59E0B]/20",
              icon: AlertTriangle,
            },

            critical: {
              label: "Critical Issue",
              color: "text-[#EF4444]",
              bg: "bg-[#EF4444]/10",
              border: "border-[#EF4444]/20",
              icon: OctagonAlert,
            },
          };

          const config = statusConfig[lineStatus];

          const StatusIcon = config.icon;

          return (
            <div
              key={line}
              className={`rounded-xl border ${config.border} bg-[#0B0E14] p-5 transition hover:bg-white/[0.03]`}
            >

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#7C3AED]/10 text-[#A78BFA]">
                    <Factory size={20} />
                  </div>

                  <div>
                    <h4 className="font-bold text-white">
                      {line}
                    </h4>

                    <p className="mt-1 text-xs text-[#6B7280]">
                      {lineMachines.length} machines
                    </p>
                  </div>

                </div>

                <StatusIcon
                  size={18}
                  className={config.color}
                />

              </div>
              <div
                className={`mt-5 flex items-center gap-2 rounded-lg ${config.bg} px-3 py-2.5`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    lineStatus === "critical"
                      ? "bg-[#EF4444]"
                      : lineStatus === "warning"
                      ? "bg-[#F59E0B]"
                      : "bg-[#10B981]"
                  }`}
                />

                <span
                  className={`text-xs font-medium ${config.color}`}
                >
                  {config.label}
                </span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs">

                {healthyCount > 0 && (
                  <span className="text-[#10B981]">
                    {healthyCount} Normal
                  </span>
                )}

                {warningCount > 0 && (
                  <span className="text-[#F59E0B]">
                    {warningCount} Warning
                  </span>
                )}

                {criticalCount > 0 && (
                  <span className="text-[#EF4444]">
                    {criticalCount} Critical
                  </span>
                )}

              </div>


              <button
                onClick={() =>
                  navigate(
                    `/operator/production-line?line=${encodeURIComponent(line)}`
                  )
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg border border-[#374151] bg-[#121620] px-4 py-2.5 text-xs font-medium text-[#9CA3AF] transition hover:border-[#7C3AED]/50 hover:bg-[#7C3AED]/10 hover:text-white"
              >
                Lihat Detail Line
                <ArrowRight size={15} />
              </button>

            </div>
          );
        })}

      </div>

    </div>
  );
}