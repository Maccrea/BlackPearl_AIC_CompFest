import React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Activity,
  Gauge,
  Thermometer,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Brain,
  Wrench,
  Clock,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import dashboard from "../../mock/dashboard";

export default function MachineDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  const machine = dashboard.machines.find(
    (item) => String(item.id) === String(id)
  );

  if (!machine) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <h1 className="text-xl font-bold text-white">
          Machine Not Found
        </h1>

        <button
          onClick={() => navigate("/operator/machine-status")}
          className="mt-4 rounded-xl bg-[#7C3AED] px-4 py-2 text-sm text-white"
        >
          Back to Machine Status
        </button>
      </div>
    );
  }

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
      border: "border-[#EF4444]/30",
      icon: AlertTriangle,
    },
  };

  const config =
    statusConfig[machine.status] ||
    statusConfig.healthy;

  const StatusIcon = config.icon;

  const healthColor =
    machine.health >= 70
      ? "text-[#10B981]"
      : machine.health >= 40
      ? "text-[#F59E0B]"
      : "text-[#EF4444]";

  const healthBg =
    machine.health >= 70
      ? "bg-[#10B981]"
      : machine.health >= 40
      ? "bg-[#F59E0B]"
      : "bg-[#EF4444]";

  return (
    <div className="space-y-6">

      <div>
        <button
          onClick={() =>
            navigate("/operator/machine-status")
          }
          className="mb-5 flex items-center gap-2 text-sm text-[#9CA3AF] transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Machine Status
        </button>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">

          <div>
            <div className="flex flex-wrap items-center gap-3">

              <h1 className="text-3xl font-bold text-white">
                {machine.name}
              </h1>

              <span
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${config.bg} ${config.color}`}
              >
                <StatusIcon size={14} />
                {config.label}
              </span>

            </div>

            <p className="mt-2 text-[#9CA3AF]">
              {machine.type} • {machine.line}
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#8B95A7]">
            <Clock size={15} />
            Last maintenance: {machine.lastMaintenance}
          </div>

        </div>
      </div>


      {machine.status !== "healthy" && (
        <div
          className={`rounded-2xl border ${config.border} ${config.bg} p-5`}
        >
          <div className="flex items-start gap-3">

            <AlertTriangle
              size={21}
              className={`mt-0.5 ${config.color}`}
            />

            <div>
              <h3 className={`font-bold ${config.color}`}>
                {machine.status === "critical"
                  ? "Immediate Attention Required"
                  : "Machine Warning Detected"}
              </h3>

              <p className="mt-1 text-sm leading-6 text-[#D1D5DB]">
                {machine.status === "critical"
                  ? "Machine parameters indicate a critical condition and require immediate inspection."
                  : "Machine parameters show abnormal behavior. Further monitoring is recommended."}
              </p>
            </div>

          </div>
        </div>
      )}


      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <MetricCard
          icon={Thermometer}
          label="Temperature"
          value={`${machine.temperature}°C`}
          abnormal={machine.temperature > 75}
          threshold="75°C"
        />

        <MetricCard
          icon={Activity}
          label="Vibration"
          value={`${machine.vibration} mm/s`}
          abnormal={machine.vibration > 4.5}
          threshold="4.5 mm/s"
        />

        <MetricCard
          icon={Gauge}
          label="Speed"
          value={`${machine.rpm} RPM`}
          abnormal={machine.rpm > 1550}
          threshold="1550 RPM"
        />

        <MetricCard
          icon={Zap}
          label="Current"
          value={`${machine.current} A`}
          abnormal={machine.current > 15}
          threshold="15 A"
        />

      </div>


      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="font-bold text-white">
              Machine Health
            </h2>

            <p className="mt-1 text-xs text-[#8B95A7]">
              Overall machine condition based on current parameters.
            </p>
          </div>

          <span className={`text-2xl font-bold ${healthColor}`}>
            {machine.health}%
          </span>

        </div>

        <div className="h-3 overflow-hidden rounded-full bg-[#1F2937]">

          <div
            className={`h-full rounded-full ${healthBg}`}
            style={{
              width: `${machine.health}%`,
            }}
          />

        </div>

      </div>


      {machine.similarCase ? (
        <div className="rounded-2xl border border-[#7C3AED]/30 bg-[#121620] p-6">

          <div className="mb-5 flex items-start justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#7C3AED]/10">
                <Brain
                  size={21}
                  className="text-[#A855F7]"
                />
              </div>

              <div>
                <h2 className="font-bold text-white">
                  Similar Case Found
                </h2>

                <p className="mt-1 text-xs text-[#8B95A7]">
                  Existing case ditemukan di Knowledge Base.
                </p>
              </div>

            </div>

            <span className="rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-bold text-[#10B981]">
              {machine.confidence}% Match
            </span>

          </div>

          <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">

            <div className="text-xs text-[#8B95A7]">
              Predicted Condition
            </div>

            <div className="mt-1 text-lg font-bold text-white">
              {machine.prediction}
            </div>

          </div>

          <button
            onClick={() =>
              navigate("/operator/ai-analysis")
            }
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C3AED] py-3 text-sm font-semibold text-white transition hover:bg-[#6D28D9]"
          >
            View AI Analysis
            <ArrowRight size={16} />
          </button>

        </div>
      ) : (
        <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">

          <div className="flex items-center gap-3">

            <Brain
              size={22}
              className="text-[#A855F7]"
            />

            <div>
              <h2 className="font-bold text-white">
                AI Analysis Required
              </h2>

              <p className="mt-1 text-sm text-[#8B95A7]">
                No similar case ditemukan. Machine membutuhkan analisis AI lebih lanjut.
              </p>
            </div>

          </div>

          <button
            onClick={() =>
              navigate("/operator/ai-analysis")
            }
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#7C3AED]/40 bg-[#7C3AED]/10 py-3 text-sm font-semibold text-[#A78BFA] transition hover:bg-[#7C3AED]/20"
          >
            Run AI Analysis
            <ArrowRight size={16} />
          </button>

        </div>
      )}


      <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">

        <div className="mb-5 flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10B981]/10">
            <Wrench
              size={19}
              className="text-[#10B981]"
            />
          </div>

          <div>
            <h2 className="font-bold text-white">
              Maintenance Information
            </h2>

            <p className="mt-1 text-xs text-[#8B95A7]">
              Informasi pemeliharaan terakhir mesin.
            </p>
          </div>

        </div>

        <div className="rounded-xl border border-[#1F2937] bg-[#0B0E14] p-4">

          <div className="text-xs text-[#8B95A7]">
            Last Maintenance
          </div>

          <div className="mt-1 font-semibold text-white">
            {machine.lastMaintenance}
          </div>

        </div>

      </div>

    </div>
  );
}


function MetricCard({
  icon: Icon,
  label,
  value,
  abnormal,
  threshold,
}) {
  return (
    <div
      className={`rounded-2xl border p-5 ${
        abnormal
          ? "border-[#EF4444]/30 bg-[#EF4444]/5"
          : "border-[#1F2937] bg-[#121620]"
      }`}
    >

      <div className="flex items-center gap-2 text-[#8B95A7]">

        <Icon size={17} />

        <span className="text-xs">
          {label}
        </span>

      </div>

      <div
        className={`mt-3 text-2xl font-bold ${
          abnormal
            ? "text-[#EF4444]"
            : "text-white"
        }`}
      >
        {value}
      </div>

      <div
        className={`mt-1 text-[11px] ${
          abnormal
            ? "text-[#EF4444]"
            : "text-[#10B981]"
        }`}
      >
        {abnormal ? "↑ Above threshold" : "✓ Within normal range"}
      </div>

      <div className="mt-2 text-[10px] text-[#6B7280]">
        Threshold: {threshold}
      </div>

    </div>
  );
}