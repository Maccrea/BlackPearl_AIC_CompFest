import React from "react";
import {
  ArrowRight,
  Activity,
  Gauge,
  Thermometer,
  Zap,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import dashboard from "../../mock/dashboard";

export default function MachineDetailCard({ machine = null, onClick = null }) {
  const navigate = useNavigate();

  const machineData = machine ||
    dashboard.machines.find(
      (item) => item.status === "critical"
    ) || dashboard.machines[0];

  if (!machineData) {
    return null;
  }

  const statusColors = {
    healthy: { border: "border-[#10B981]/30", bg: "bg-[#10B981]/5", badge: "bg-[#10B981]/10 text-[#10B981]" },
    warning: { border: "border-[#F59E0B]/30", bg: "bg-[#F59E0B]/5", badge: "bg-[#F59E0B]/10 text-[#F59E0B]" },
    critical: { border: "border-[#EF4444]/30", bg: "bg-[#EF4444]/5", badge: "bg-[#EF4444]/10 text-[#EF4444]" },
  };

  const colors = statusColors[machineData.status] || statusColors.healthy;

  const handleNavigate = () => {
    if (onClick) {
      onClick(machineData);
    } else {
      navigate(
        `/operator/machine-detail/${machineData.id}`
      );
    }
  };

  return (
    <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-5 shadow-[0_0_20px_rgba(239,68,68,0.05)]`}>

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

        <div className="flex items-start gap-3">

          <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${colors.badge}`}>
            {machineData.status === "critical" ? (
              <AlertTriangle size={21} />
            ) : machineData.status === "warning" ? (
              <AlertCircle size={21} />
            ) : (
              <CheckCircle2 size={21} />
            )}
          </div>

          <div>
            <h3 className="font-bold text-white">
              {machineData.name}
            </h3>

            <p className="mt-1 text-xs text-[#9CA3AF]">
              {machineData.type} • {machineData.line}
            </p>
          </div>

        </div>

        <span className={`w-fit rounded-full ${colors.badge} px-3 py-1 text-[10px] font-bold tracking-wide`}>
          {machineData.status.toUpperCase()}
        </span>

      </div>

      {machineData.status !== "healthy" && (
        <div className={`mb-5 rounded-xl border ${colors.border} ${colors.bg} p-3`}>

          <div className="flex items-center gap-2">

            <AlertTriangle
              size={16}
              className={`shrink-0 ${colors.badge.split(" ")[1]}`}
            />

            <p className="text-xs leading-5 text-[#FCA5A5]">
              {machineData.status === "critical"
                ? "Mesin membutuhkan perhatian segera. Parameter terdeteksi berada di atas batas normal."
                : "Mesin menunjukkan tanda-tanda abnormal. Monitoring diperlukan."}
            </p>

          </div>

        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

        <Parameter
          icon={Thermometer}
          label="Suhu Motor"
          value={`${machineData.temperature}°C`}
          threshold={75}
          actual={machineData.temperature}
        />

        <Parameter
          icon={Activity}
          label="Vibrasi"
          value={`${machineData.vibration} mm/s`}
          threshold={4.5}
          actual={machineData.vibration}
        />

        <Parameter
          icon={Gauge}
          label="Kecepatan"
          value={`${machineData.rpm} RPM`}
          threshold={1550}
          actual={machineData.rpm}
        />

        <Parameter
          icon={Zap}
          label="Arus Listrik"
          value={`${machineData.current} A`}
          threshold={15}
          actual={machineData.current}
        />

      </div>

      <div className="mt-5 rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">

        <div className="mb-2 flex items-center justify-between">

          <span className="text-xs text-[#9CA3AF]">
            Machine Health
          </span>

          <span className={`text-sm font-bold ${machineData.health > 70
              ? "text-[#10B981]"
              : machineData.health > 40
                ? "text-[#F59E0B]"
                : "text-[#EF4444]"
            }`}>
            {machineData.health}%
          </span>

        </div>

        <div className="h-2 overflow-hidden rounded-full bg-[#1F2937]">

          <div
            className={`h-full rounded-full ${machineData.health > 70
                ? "bg-[#10B981]"
                : machineData.health > 40
                  ? "bg-[#F59E0B]"
                  : "bg-[#EF4444]"
              }`}
            style={{
              width: `${machineData.health}%`,
            }}
          />

        </div>

      </div>

      <button
        onClick={handleNavigate}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#374151] bg-[#0B0E14] px-4 py-3 text-sm font-medium text-white transition hover:border-[#A855F7]/50 hover:bg-[#A855F7]/10"
      >
        Lihat Detail Mesin

        <ArrowRight size={16} />

      </button>

    </div>
  );
}

function Parameter({ icon: Icon, label, value, threshold, actual }) {
  const isAbnormal = actual > threshold;

  return (
    <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#8B95A7]">
          <Icon size={16} />
          <span className="text-xs">{label}</span>
        </div>
        {isAbnormal && (
          <span className="text-[10px] font-bold text-[#EF4444]">!</span>
        )}
      </div>

      <div className={`mt-2 text-xl font-bold ${isAbnormal ? "text-[#EF4444]" : "text-white"}`}>
        {value}
      </div>

      <div className={`mt-1 text-[10px] ${isAbnormal ? "text-[#EF4444]" : "text-[#10B981]"}`}>
        {isAbnormal ? "↑ " : "✓ "}
        Batas normal: {threshold}
      </div>

    </div>
  );
}