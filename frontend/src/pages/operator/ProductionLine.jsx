import React, { useMemo, useState, useEffect } from "react";
import {
  Settings,
  CheckCircle2,
  AlertTriangle,
  OctagonAlert,
  Factory,
  ChevronDown,
  Thermometer,
  Activity,
  Gauge,
  Zap,
  Search,
  Filter,
} from "lucide-react";

const STATUS_CONFIG = {
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

export default function ProductionDashboard() {
  const [machines, setMachines] = useState([]);
  const [selectedLine, setSelectedLine] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetch("black-pearl-aic-comp-fest-khpfq0lxl-maccreas-projects.vercel.app/api/machines")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const evaluatedData = data.map((machine) => {
            const temp = parseFloat(String(machine.temp).replace(/[^0-9.]/g, '')) || 25;
            const rpm = parseFloat(String(machine.rpm).replace(/[^0-9.]/g, '')) || 1450;
            const current = parseFloat(String(machine.current).replace(/[^0-9.]/g, '')) || 12.5;
            const vibration = parseFloat(String(machine.vibration).replace(/[^0-9.]/g, '')) || 2.1;
            
            let calcHealth = 100;
            if (temp >= 75) calcHealth -= 35;
            else if (temp >= 60) calcHealth -= 15;

            if (vibration >= 4.5) calcHealth -= 30;
            else if (vibration >= 3.0) calcHealth -= 15;

            if (rpm > 1550) calcHealth -= 10;
            if (current > 15) calcHealth -= 10;

            calcHealth = Math.max(0, calcHealth);

            const dbHealth = parseFloat(machine.health) || 100;
            const finalHealth = Math.min(calcHealth, dbHealth);
            
            let realStatus = "Healthy";
            
            if (temp >= 75 || finalHealth <= 40 || rpm > 1550 || vibration >= 4.5) {
              realStatus = "Critical";
            } else if (temp >= 60 || finalHealth <= 70 || rpm > 1500 || vibration >= 3.0) {
              realStatus = "Warning";
            }

            return { ...machine, health: finalHealth, status: realStatus };
          });

          setMachines(evaluatedData);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const PRODUCTION_LINES = useMemo(() => {
    const linesMap = new Map();
    machines.forEach((m) => {
      if (m.line && !linesMap.has(m.line)) {
        linesMap.set(m.line, { id: m.line, name: m.line, type: "Production Line" });
      }
    });
    return Array.from(linesMap.values());
  }, [machines]);

  const filteredMachines = useMemo(() => {
    return machines.filter((machine) => {
      const matchLine = selectedLine === "all" || machine.line === selectedLine;
      const matchStatus = statusFilter === "all" || machine.status?.toLowerCase() === statusFilter;
      const matchSearch =
        machine.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        machine.type?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchLine && matchStatus && matchSearch;
    });
  }, [machines, selectedLine, statusFilter, searchQuery]);

  const baseMachinesForCount = machines.filter(
    (m) => (selectedLine === "all" || m.line === selectedLine) &&
           (m.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
            m.type?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const statusCount = {
    all: baseMachinesForCount.length,
    healthy: baseMachinesForCount.filter((m) => m.status?.toLowerCase() === "healthy").length,
    warning: baseMachinesForCount.filter((m) => m.status?.toLowerCase() === "warning").length,
    critical: baseMachinesForCount.filter((m) => m.status?.toLowerCase() === "critical").length,
  };

  const visibleLines = useMemo(() => {
    const lines = selectedLine === "all" 
        ? PRODUCTION_LINES 
        : PRODUCTION_LINES.filter((l) => l.id === selectedLine);
        
    return lines.filter(line => 
      filteredMachines.some(m => m.line === line.id)
    );
  }, [selectedLine, filteredMachines, PRODUCTION_LINES]);

  return (
    <div className="space-y-6 pb-10">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Production Dashboard</h1>
          <p className="mt-1 text-[#9CA3AF]">
            Monitor the condition, parameters, and flow of all integrated production lines.
          </p>
        </div>

        <div className="relative w-full sm:w-[280px]">
          <select
            value={selectedLine}
            onChange={(e) => setSelectedLine(e.target.value)}
            className="w-full appearance-none rounded-xl border border-[#374151] bg-[#121620] px-4 py-3 pr-10 text-sm font-medium text-white outline-none transition focus:border-[#7C3AED]"
          >
            <option value="all">All Production Lines</option>
            {PRODUCTION_LINES.map((line) => (
              <option key={line.id} value={line.id}>{line.name}</option>
            ))}
          </select>
          <ChevronDown
            size={17}
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Healthy Machines"
          count={statusCount.healthy}
          icon={CheckCircle2}
          color="text-[#10B981]"
          border="border-[#10B981]/20"
          bg="bg-[#10B981]/10"
        />
        <SummaryCard
          label="Warning Machines"
          count={statusCount.warning}
          icon={AlertTriangle}
          color="text-[#F59E0B]"
          border="border-[#F59E0B]/20"
          bg="bg-[#F59E0B]/10"
        />
        <SummaryCard
          label="Critical Machines"
          count={statusCount.critical}
          icon={OctagonAlert}
          color="text-[#EF4444]"
          border="border-[#EF4444]/20"
          bg="bg-[#EF4444]/10"
        />
      </div>
      
      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 pr-2">
              <Filter size={18} className="text-[#A78BFA]" />
              <span className="text-sm font-semibold text-white">Filter:</span>
            </div>
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
              placeholder="Search machine name or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[#374151] bg-[#0B0E14] py-2.5 pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-[#6B7280] focus:border-[#7C3AED]"
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {visibleLines.length > 0 ? (
          visibleLines.map((line) => {
            const lineMachines = filteredMachines.filter((m) => m.line === line.id);

            return (
              <div key={line.id} className="space-y-4">
                <div className="flex items-center gap-4 border-b border-[#1F2937] pb-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#7C3AED]/10 text-[#A78BFA]">
                    <Factory size={23} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{line.name}</h2>
                    <p className="text-sm text-[#8B95A7]">
                      {line.type} • {lineMachines.length} Machines
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                  {lineMachines.map((machine) => (
                    <MachineDetailCard key={machine.id} machine={machine} />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-12 text-center mt-6">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1F2937]">
              <Search size={24} className="text-[#6B7280]" />
            </div>
            <h3 className="text-lg font-bold text-white">No machines found</h3>
            <p className="mt-2 text-sm text-[#8B95A7]">
              No machines match the current filter or search in this area.
            </p>
            <button
              onClick={() => {
                setStatusFilter("all");
                setSearchQuery("");
                setSelectedLine("all");
              }}
              className="mt-5 rounded-xl bg-[#7C3AED] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, count, icon: Icon, color, border, bg }) {
  return (
    <div className={`rounded-2xl border bg-[#121620] p-5 ${border} flex items-center justify-between`}>
      <div>
        <div className="text-sm text-[#8B95A7]">{label}</div>
        <div className={`mt-2 text-3xl font-bold ${color}`}>{count}</div>
      </div>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg}`}>
        <Icon size={24} className={color} />
      </div>
    </div>
  );
}

function FilterButton({ active, onClick, label, count, color }) {
  const colorConfig = {
    green: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30",
    yellow: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30",
    red: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30",
    default: "bg-[#7C3AED]/10 text-[#A78BFA] border-[#7C3AED]/30",
  };

  const activeStyle = color ? colorConfig[color] : colorConfig.default;

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

function MachineDetailCard({ machine }) {
  const config = STATUS_CONFIG[machine.status?.toLowerCase()] || STATUS_CONFIG.healthy;
  const StatusIcon = config.icon;

  return (
    <div className={`rounded-2xl border bg-[#121620] p-6 transition hover:bg-[#151A24] ${config.border}`}>
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1F2937] text-[#9CA3AF]">
            <Settings size={22} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{machine.name}</h2>
            <p className="mt-1 text-sm text-[#8B95A7]">{machine.type}</p>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${config.bg} ${config.color}`}>
          <StatusIcon size={15} />
          {config.label}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-2 2xl:grid-cols-4">
        <Parameter icon={Thermometer} label="Temp" value={machine.temp || "25°C"} />
        <Parameter icon={Gauge} label="RPM" value={machine.rpm || "1450"} />
        <Parameter icon={Zap} label="Current" value={machine.current ? `${machine.current} A` : "12.5 A"} />
        <Parameter icon={Activity} label="Vibration" value={machine.vibration ? `${machine.vibration} mm/s` : "2.1 mm/s"} />
      </div>

      {machine.health !== undefined && (
        <div className="mt-6 rounded-xl bg-[#0B0E14] p-4">
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-[#8B95A7]">Machine Health Indicator</span>
            <span className={`font-bold ${config.color}`}>{machine.health}%</span>
          </div>
          <div className="h-2.5 w-full rounded-full bg-[#1F2937] overflow-hidden">
            <div
              className={`h-full rounded-full ${
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
}

function Parameter({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-3 flex flex-col justify-center">
      <div className="flex items-center gap-1.5 text-[#8B95A7]">
        <Icon size={14} />
        <span className="text-xs">{label}</span>
      </div>
      <div className="mt-1.5 text-base font-bold text-white truncate">{value}</div>
    </div>
  );
}