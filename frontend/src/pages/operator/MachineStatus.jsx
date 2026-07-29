import React, { useMemo, useState, useEffect } from "react";
import {
  Thermometer,
  Activity,
  Gauge,
  Zap,
  CheckCircle2,
  AlertTriangle,
  OctagonAlert,
  Search,
  Filter,
} from "lucide-react";

export default function MachineStatus() {
  const [machines, setMachines] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/machines")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMachines(data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const statusConfig = {
    healthy: {
      label: "Normal",
      color: "text-[#10B981]",
      bg: "bg-[#10B981]/10",
      border: "border-[#10B981]/30",
      icon: CheckCircle2,
    },
    warning: {
      label: "Warning",
      color: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/10",
      border: "border-[#F59E0B]/30",
      icon: AlertTriangle,
    },
    critical: {
      label: "Critical",
      color: "text-[#EF4444]",
      bg: "bg-[#EF4444]/10",
      border: "border-[#EF4444]/40",
      icon: OctagonAlert,
    },
  };

  const filteredMachines = useMemo(() => {
    return machines.filter((machine) => {
      const matchesStatus =
        statusFilter === "all" ||
        machine.status?.toLowerCase() === statusFilter;

      const search = searchQuery.toLowerCase();

      const matchesSearch =
        machine.name?.toLowerCase().includes(search) ||
        machine.type?.toLowerCase().includes(search) ||
        machine.line?.toLowerCase().includes(search);

      return matchesStatus && matchesSearch;
    });
  }, [machines, statusFilter, searchQuery]);

  const statusCount = {
    all: machines.length,
    healthy: machines.filter(
      (machine) => machine.status?.toLowerCase() === "healthy"
    ).length,
    warning: machines.filter(
      (machine) => machine.status?.toLowerCase() === "warning"
    ).length,
    critical: machines.filter(
      (machine) => machine.status?.toLowerCase() === "critical"
    ).length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Machine Status
        </h1>
        <p className="mt-1 text-[#9CA3AF]">
          Monitoring kondisi dan parameter operasional seluruh mesin.
        </p>
      </div>
      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5">
        <div className="mb-4 flex items-center gap-2">
          <Filter size={18} className="text-[#A78BFA]" />
          <h2 className="text-sm font-semibold text-white">
            Filter Mesin
          </h2>
        </div>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <FilterButton
              active={statusFilter === "all"}
              onClick={() => setStatusFilter("all")}
              label="All"
              count={statusCount.all}
            />
            <FilterButton
              active={statusFilter === "healthy"}
              onClick={() => setStatusFilter("healthy")}
              label="Normal"
              count={statusCount.healthy}
              color="green"
            />
            <FilterButton
              active={statusFilter === "warning"}
              onClick={() => setStatusFilter("warning")}
              label="Warning"
              count={statusCount.warning}
              color="yellow"
            />
            <FilterButton
              active={statusFilter === "critical"}
              onClick={() => setStatusFilter("critical")}
              label="Critical"
              count={statusCount.critical}
              color="red"
            />
          </div>
          <div className="relative w-full lg:w-72">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Cari mesin..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-[#6B7280] focus:border-[#7C3AED]"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#9CA3AF]">
            Menampilkan <span className="font-semibold text-white">{filteredMachines.length}</span> dari <span className="font-semibold text-white">{machines.length}</span> mesin
          </p>
        </div>
        {(statusFilter !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setStatusFilter("all");
              setSearchQuery("");
            }}
            className="text-sm text-[#A78BFA] transition hover:text-[#C4B5FD]"
          >
            Reset Filter
          </button>
        )}
      </div>
      {filteredMachines.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {filteredMachines.map((machine) => {
            const config = statusConfig[machine.status?.toLowerCase()] || statusConfig.healthy;
            const StatusIcon = config.icon;
            return (
              <div key={machine.id} className={`rounded-2xl border bg-[#121620] p-6 transition hover:bg-[#151A24] ${config.border}`}>
                <div className="mb-6 flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-white">{machine.name}</h2>
                    <p className="mt-1 text-sm text-[#8B95A7]">{machine.type}</p>
                    {machine.line && <p className="mt-1 text-xs text-[#6B7280]">{machine.line}</p>}
                  </div>
                  <div className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${config.bg} ${config.color}`}>
                    <StatusIcon size={15} />
                    {config.label}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Parameter icon={Thermometer} label="Temperature" value={machine.temp || "-"} />
                  <Parameter icon={Gauge} label="RPM" value={machine.rpm || "-"} />
                  <Parameter icon={Zap} label="Current" value={machine.current ? `${machine.current} A` : "-"} />
                  <Parameter icon={Activity} label="Vibration" value={machine.vibration ? `${machine.vibration} mm/s` : "-"} />
                </div>
                {machine.health !== undefined && (
                  <div className="mt-5">
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-[#8B95A7]">Machine Health</span>
                      <span className={`font-bold ${config.color}`}>{machine.health}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#1F2937]">
                      <div
                        className={`h-2 rounded-full ${
                          machine.status?.toLowerCase() === "critical"
                            ? "bg-[#EF4444]"
                            : machine.status?.toLowerCase() === "warning"
                            ? "bg-[#F59E0B]"
                            : "bg-[#10B981]"
                        }`}
                        style={{ width: `${machine.health}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-12 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1F2937]">
            <Search size={24} className="text-[#6B7280]" />
          </div>
          <h3 className="text-lg font-bold text-white">Mesin tidak ditemukan</h3>
          <p className="mt-2 text-sm text-[#8B95A7]">Tidak ada mesin yang sesuai dengan filter atau pencarian.</p>
          <button
            onClick={() => {
              setStatusFilter("all");
              setSearchQuery("");
            }}
            className="mt-5 rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
}

function FilterButton({ active, onClick, label, count, color }) {
  const colorConfig = {
    green: { active: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30" },
    yellow: { active: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30" },
    red: { active: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30" },
  };

  const activeStyle = color
    ? colorConfig[color]?.active
    : "bg-[#7C3AED]/10 text-[#A78BFA] border-[#7C3AED]/30";

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-medium transition ${
        active
          ? activeStyle
          : "border-[#374151] bg-[#0B0E14] text-[#9CA3AF] hover:border-[#4B5563] hover:text-white"
      }`}
    >
      {label}
      <span className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-white/10" : "bg-[#1F2937]"}`}>
        {count}
      </span>
    </button>
  );
}

function Parameter({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">
      <div className="flex items-center gap-2 text-[#8B95A7]">
        <Icon size={16} />
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-2 text-lg font-bold text-white">{value}</div>
    </div>
  );
}