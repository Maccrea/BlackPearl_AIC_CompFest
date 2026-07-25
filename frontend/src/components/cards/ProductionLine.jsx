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

  // Ambil semua production line secara otomatis dari data mesin
  const productionLines = [
    ...new Set(
      machines
        .map((machine) => machine.line)
        .filter(Boolean)
    ),
  ];

  const getMachinesByLine = (line) => {
    return machines.filter(
      (machine) => machine.line === line
    );
  };

  const getStatusCount = (lineMachines, status) => {
    return lineMachines.filter(
      (machine) => machine.status === status
    ).length;
  };

  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

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
            Ringkasan kondisi seluruh production line.
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/operator/production-line")
          }
          className="flex w-fit items-center gap-2 text-sm font-medium text-[#9CA3AF] transition-colors hover:text-white"
        >
          Lihat Semua Line
          <ArrowRight size={16} />
        </button>

      </div>


      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">

        {productionLines.map((line) => {

          const lineMachines =
            getMachinesByLine(line);

          const healthyCount =
            getStatusCount(
              lineMachines,
              "healthy"
            );

          const warningCount =
            getStatusCount(
              lineMachines,
              "warning"
            );

          const criticalCount =
            getStatusCount(
              lineMachines,
              "critical"
            );

          const hasCritical =
            criticalCount > 0;

          const hasWarning =
            warningCount > 0;

          return (
            <div
              key={line}
              className={`rounded-2xl border p-5 transition-all hover:-translate-y-0.5 hover:bg-white/5 ${
                hasCritical
                  ? "border-[#EF4444]/40 bg-[#EF4444]/5"
                  : hasWarning
                  ? "border-[#F59E0B]/30 bg-[#F59E0B]/5"
                  : "border-[#1F2937] bg-[#0B0E14]"
              }`}
            >

              <div className="flex items-start justify-between">

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A78BFA]">
                    <Factory size={21} />
                  </div>

                  <div>
                    <h4 className="font-bold text-white">
                      {line}
                    </h4>

                    <p className="mt-1 text-xs text-[#8B95A7]">
                      {lineMachines.length} machines
                    </p>
                  </div>

                </div>

                {hasCritical ? (
                  <OctagonAlert
                    size={19}
                    className="text-[#EF4444]"
                  />
                ) : hasWarning ? (
                  <AlertTriangle
                    size={19}
                    className="text-[#F59E0B]"
                  />
                ) : (
                  <CheckCircle2
                    size={19}
                    className="text-[#10B981]"
                  />
                )}

              </div>

              <div className="mt-5 space-y-2">

                {lineMachines.map((machine) => (

                  <div
                    key={machine.id}
                    className="flex items-center justify-between rounded-lg border border-[#1F2937] bg-[#121620] px-3 py-2.5"
                  >

                    <div className="min-w-0">

                      <div className="truncate text-sm font-medium text-white">
                        {machine.name}
                      </div>

                      <div className="mt-0.5 text-[11px] text-[#6B7280]">
                        {machine.type}
                      </div>

                    </div>

                    <StatusDot
                      status={machine.status}
                    />

                  </div>

                ))}

              </div>

              <div className="mt-4 flex flex-wrap gap-2">

                <StatusBadge
                  icon={CheckCircle2}
                  count={healthyCount}
                  label="Normal"
                  color="text-[#10B981]"
                  bg="bg-[#10B981]/10"
                />

                <StatusBadge
                  icon={AlertTriangle}
                  count={warningCount}
                  label="Warning"
                  color="text-[#F59E0B]"
                  bg="bg-[#F59E0B]/10"
                />

                <StatusBadge
                  icon={OctagonAlert}
                  count={criticalCount}
                  label="Critical"
                  color="text-[#EF4444]"
                  bg="bg-[#EF4444]/10"
                />

              </div>


              {/* View Detail */}
              <button
                onClick={() =>
                  navigate(
                    `/operator/production-line?line=${encodeURIComponent(line)}`
                  )
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#374151] bg-[#121620] px-4 py-2.5 text-sm font-medium text-[#9CA3AF] transition hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 hover:text-white"
              >
                Lihat Detail Line
                <ArrowRight size={16} />
              </button>

            </div>
          );
        })}

      </div>

    </div>
  );
}

function StatusDot({ status }) {

  const statusConfig = {
    healthy: {
      color: "bg-[#10B981]",
      label: "Normal",
    },

    warning: {
      color: "bg-[#F59E0B]",
      label: "Warning",
    },

    critical: {
      color: "bg-[#EF4444]",
      label: "Critical",
    },
  };

  const config =
    statusConfig[status] ||
    statusConfig.healthy;

  return (
    <div className="flex items-center gap-1.5">

      <span
        className={`h-2 w-2 rounded-full ${config.color}`}
      />

      <span className="text-[11px] text-[#8B95A7]">
        {config.label}
      </span>

    </div>
  );
}


function StatusBadge({
  icon: Icon,
  count,
  label,
  color,
  bg,
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${color} ${bg}`}
    >

      <Icon size={13} />

      {count} {label}

    </div>
  );
}