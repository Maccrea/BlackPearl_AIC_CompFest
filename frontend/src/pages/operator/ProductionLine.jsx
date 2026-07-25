import React, { useMemo, useState } from "react";
import {
  ArrowRight,
  Settings,
  CheckCircle2,
  AlertTriangle,
  OctagonAlert,
  Factory,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboard from "../../mock/dashboard";

export default function ProductionLine() {
  const navigate = useNavigate();

  const machines = dashboard.machines || [];

  const [selectedLine, setSelectedLine] = useState("all");

  // Production line berdasarkan data yang ada di dashboard.js
  const productionLines = [
    {
      id: "Production Line A",
      name: "Production Line A",
      type: "Packaging",
    },
    {
      id: "Production Line B",
      name: "Production Line B",
      type: "Filling & Sealing",
    },
    {
      id: "Production Line C",
      name: "Production Line C",
      type: "Labeling",
    },
  ];

  const statusConfig = {
    healthy: {
      label: "Normal",
      color: "text-[#10B981]",
      bg: "bg-[#10B981]",
      softBg: "bg-[#10B981]/5",
      border: "border-[#10B981]/20",
      icon: CheckCircle2,
    },

    warning: {
      label: "Warning",
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]",
      softBg: "bg-[#F59E0B]/5",
      border: "border-[#F59E0B]/30",
      icon: AlertTriangle,
    },

    critical: {
      label: "Critical",
      color: "text-[#EF4444]",
      bg: "bg-[#EF4444]",
      softBg: "bg-[#EF4444]/5",
      border: "border-[#EF4444]/40",
      icon: OctagonAlert,
    },
  };

  // Filter production line
  const visibleLines = useMemo(() => {
    if (selectedLine === "all") {
      return productionLines;
    }

    return productionLines.filter(
      (line) => line.id === selectedLine
    );
  }, [selectedLine]);

  // Ambil mesin berdasarkan field "line"
  const getMachinesByLine = (lineName) => {
    return machines.filter(
      (machine) => machine.line === lineName
    );
  };

  const getStatusCount = (lineMachines, status) => {
    return lineMachines.filter(
      (machine) => machine.status === status
    ).length;
  };

  return (
    <div className="space-y-6">

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-white">
            Production Line
          </h1>

          <p className="mt-1 text-[#9CA3AF]">
            Monitor kondisi dan alur seluruh production line.
          </p>
        </div>

        <div className="relative w-full sm:w-[280px]">

          <select
            value={selectedLine}
            onChange={(e) => setSelectedLine(e.target.value)}
            className="w-full appearance-none rounded-xl border border-[#374151] bg-[#121620] px-4 py-3 pr-10 text-sm font-medium text-white outline-none transition focus:border-[#7C3AED]"
          >
            <option value="all">
              All Production Lines
            </option>

            {productionLines.map((line) => (
              <option
                key={line.id}
                value={line.id}
              >
                {line.name}
              </option>
            ))}
          </select>

          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
          />

        </div>

      </div>

      <div className="flex w-fit items-center gap-2 rounded-full bg-[#10B981]/10 px-3 py-1.5 text-xs font-semibold text-[#10B981]">

        <span className="h-2 w-2 animate-pulse rounded-full bg-[#10B981]" />

        Monitoring Active

      </div>


      <div className="space-y-6">

        {visibleLines.map((line) => {

          const lineMachines =
            getMachinesByLine(line.name);

          const healthyCount =
            getStatusCount(lineMachines, "healthy");

          const warningCount =
            getStatusCount(lineMachines, "warning");

          const criticalCount =
            getStatusCount(lineMachines, "critical");

          return (
            <div
              key={line.id}
              className="overflow-hidden rounded-2xl border border-[#1F2937] bg-[#121620]"
            >

              <div className="border-b border-[#1F2937] p-5 sm:p-6">

                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                  <div className="flex items-start gap-4">

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A78BFA]">
                      <Factory size={23} />
                    </div>

                    <div>

                      <h2 className="text-lg font-bold text-white">
                        {line.name}
                      </h2>

                      <p className="mt-1 text-sm text-[#8B95A7]">
                        {line.type}
                      </p>

                      <p className="mt-1 text-xs text-[#6B7280]">
                        {lineMachines.length} machine
                        {lineMachines.length !== 1 ? "s" : ""}
                      </p>

                    </div>

                  </div>

                  <div className="flex flex-wrap gap-2">

                    <StatusBadge
                      icon={CheckCircle2}
                      label={`${healthyCount} Normal`}
                      color="text-[#10B981]"
                      bg="bg-[#10B981]/10"
                    />

                    <StatusBadge
                      icon={AlertTriangle}
                      label={`${warningCount} Warning`}
                      color="text-[#F59E0B]"
                      bg="bg-[#F59E0B]/10"
                    />

                    <StatusBadge
                      icon={OctagonAlert}
                      label={`${criticalCount} Critical`}
                      color="text-[#EF4444]"
                      bg="bg-[#EF4444]/10"
                    />

                  </div>

                </div>

              </div>
              <div className="p-5 sm:p-6">

                {lineMachines.length === 0 ? (

                  <div className="rounded-xl border border-dashed border-[#374151] bg-[#0B0E14] p-8 text-center">

                    <Factory
                      size={28}
                      className="mx-auto text-[#4B5563]"
                    />

                    <p className="mt-3 text-sm text-[#8B95A7]">
                      Belum ada mesin yang terdaftar pada line ini.
                    </p>

                  </div>

                ) : (

                  <div className="overflow-x-auto pb-2 scrollbar-hide">

                    <div className="flex min-w-max items-center gap-3">

                      {lineMachines.map(
                        (machine, index) => {

                          const config =
                            statusConfig[
                              machine.status
                            ] ||
                            statusConfig.healthy;

                          const StatusIcon =
                            config.icon;

                          return (
                            <React.Fragment
                              key={machine.id}
                            >
                              <div
                                className={`w-[210px] shrink-0 rounded-2xl border p-4 transition-all hover:-translate-y-0.5 hover:bg-white/5 ${config.border} ${config.softBg}`}
                              >

                                <div className="mb-4 flex items-center justify-between">

                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1F2937] text-[#9CA3AF]">
                                    <Settings size={19} />
                                  </div>

                                  <StatusIcon
                                    size={18}
                                    className={config.color}
                                  />

                                </div>


                                <div className="truncate font-bold text-white">
                                  {machine.name}
                                </div>


                                <div className="mt-1 truncate text-xs text-[#8B95A7]">
                                  {machine.type || "Machine"}
                                </div>

                                <div
                                  className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold ${config.color}`}
                                >

                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${config.bg}`}
                                  />

                                  {config.label}

                                </div>

                                {machine.health !== undefined && (

                                  <div className="mt-4">

                                    <div className="mb-1 flex justify-between text-[11px]">

                                      <span className="text-[#8B95A7]">
                                        Health
                                      </span>

                                      <span
                                        className={config.color}
                                      >
                                        {machine.health}%
                                      </span>

                                    </div>


                                    <div className="h-1.5 rounded-full bg-[#1F2937]">

                                      <div
                                        className={`h-1.5 rounded-full ${config.bg}`}
                                        style={{
                                          width: `${machine.health}%`,
                                        }}
                                      />

                                    </div>

                                  </div>

                                )}

                              </div>


                              {index <
                                lineMachines.length - 1 && (

                                <ArrowRight
                                  size={20}
                                  className="shrink-0 text-[#374151]"
                                />

                              )}

                            </React.Fragment>
                          );
                        }
                      )}

                    </div>

                  </div>

                )}

                <div className="mt-5 flex justify-end border-t border-[#1F2937] pt-5">

                  <button
                    onClick={() =>
                      navigate(
                        "/operator/machine-status"
                      )
                    }
                    className="flex items-center gap-2 rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-2.5 text-sm font-medium text-[#9CA3AF] transition hover:border-[#7C3AED] hover:bg-[#7C3AED]/10 hover:text-white"
                  >

                    Lihat Semua Mesin

                    <ArrowRight size={16} />

                  </button>

                </div>

              </div>

            </div>
          );
        })}

      </div>


      <div>

        <div className="mb-4">

          <h2 className="text-lg font-bold text-white">
            Overall Machine Status
          </h2>

          <p className="mt-1 text-sm text-[#8B95A7]">
            Ringkasan kondisi mesin dari seluruh production line.
          </p>

        </div>


        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

          <SummaryCard
            label="Healthy Machines"
            count={
              machines.filter(
                (machine) =>
                  machine.status === "healthy"
              ).length
            }
            icon={CheckCircle2}
            color="text-[#10B981]"
            border="border-[#10B981]/20"
            bg="bg-[#10B981]/10"
          />


          <SummaryCard
            label="Warning Machines"
            count={
              machines.filter(
                (machine) =>
                  machine.status === "warning"
              ).length
            }
            icon={AlertTriangle}
            color="text-[#F59E0B]"
            border="border-[#F59E0B]/20"
            bg="bg-[#F59E0B]/10"
          />


          <SummaryCard
            label="Critical Machines"
            count={
              machines.filter(
                (machine) =>
                  machine.status === "critical"
              ).length
            }
            icon={OctagonAlert}
            color="text-[#EF4444]"
            border="border-[#EF4444]/20"
            bg="bg-[#EF4444]/10"
          />

        </div>

      </div>

    </div>
  );
}


function StatusBadge({
  icon: Icon,
  label,
  color,
  bg,
}) {
  return (
    <div
      className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${color} ${bg}`}
    >
      <Icon size={14} />
      {label}
    </div>
  );
}


function SummaryCard({
  label,
  count,
  icon: Icon,
  color,
  border,
  bg,
}) {
  return (
    <div
      className={`rounded-2xl border bg-[#121620] p-5 ${border}`}
    >

      <div className="flex items-center justify-between">

        <div>

          <div className="text-sm text-[#8B95A7]">
            {label}
          </div>

          <div
            className={`mt-2 text-3xl font-bold ${color}`}
          >
            {count}
          </div>

        </div>


        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${bg}`}
        >

          <Icon
            size={21}
            className={color}
          />

        </div>

      </div>

    </div>
  );
}