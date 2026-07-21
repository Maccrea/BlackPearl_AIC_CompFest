import React from "react";
import { AlertTriangle, Clock } from "lucide-react";
import dashboard from "../../mock/dashboard";

export default function RecentAlerts() {

  const alerts = dashboard.alerts;

  const levelColor = {
    critical: {
      icon: "text-[#EF4444]",
      bg: "bg-[#EF4444]/10",
      text: "text-[#EF4444]",
    },
    warning: {
      icon: "text-[#F59E0B]",
      bg: "bg-[#F59E0B]/10",
      text: "text-[#F59E0B]",
    },
    maintenance: {
      icon: "text-[#3B82F6]",
      bg: "bg-[#3B82F6]/10",
      text: "text-[#3B82F6]",
    },
  };

  return (
    <div className="rounded-2xl border border-[#1F2937] bg-[#121620] p-6">

      <h3 className="mb-5 text-lg font-bold text-white">
        Recent Alerts
      </h3>

      <div className="flex flex-col gap-4">

        {alerts.map((alert) => {

          const color = levelColor[alert.level];

          return (
            <div
              key={alert.id}
              className="flex items-start gap-3"
            >

              <div
                className={`mt-1 rounded-full p-1.5 ${color.bg} ${color.icon}`}
              >

                {alert.level === "maintenance"
                  ? <Clock size={16} />
                  : <AlertTriangle size={16} />
                }

              </div>

              <div className="flex-1">

                <div className="flex items-center justify-between">

                  <div
                    className={`text-[13px] font-bold ${color.text}`}
                  >
                    {alert.machine}
                  </div>

                  <div className="text-[11px] text-[#8B95A7]">
                    {alert.time}
                  </div>

                </div>

                <div className="text-[12px] text-[#9CA3AF]">

                  {alert.message}

                </div>

              </div>

            </div>
          );

        })}

      </div>

      <button
        className="mt-5 w-full text-[13px] font-medium text-[#7C3AED] hover:text-[#9F67FF]"
      >
        View All Alerts →
      </button>

    </div>
  );
}