import {
  TrendingUp,
  AlertTriangle,
  OctagonAlert,
  Activity,
} from "lucide-react";

import dashboard from "../../mock/dashboard";

export default function StatCards() {
  const { summary } = dashboard;

  const cards = [
    {
      title: "Mesin Normal",
      value: summary.healthy,
      desc: "Tidak ada masalah",
      color: "#10B981",
      bg: "bg-[#10B981]/10",
      border: "border-[#1F2937]",
      icon: TrendingUp,
    },
    {
      title: "Mesin Warning",
      value: summary.warning,
      desc: "Perlu perhatian",
      color: "#F59E0B",
      bg: "bg-[#F59E0B]/10",
      border: "border-[#1F2937]",
      icon: AlertTriangle,
    },
    {
      title: "Mesin Critical",
      value: summary.critical,
      desc: "Segera periksa",
      color: "#EF4444",
      bg: "bg-[#EF4444]/10",
      border: "border-[#EF4444]/30",
      icon: OctagonAlert,
    },
    {
      title: "Efisiensi Line",
      value: `${summary.efficiency}%`,
      desc: "Baik",
      color: "#3B82F6",
      bg: "bg-[#3B82F6]/10",
      border: "border-[#1F2937]",
      icon: Activity,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className={`flex items-center gap-4 rounded-2xl border ${card.border} bg-[#121620] p-5`}
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full ${card.bg}`}
              style={{ color: card.color }}
            >
              <Icon size={28} />
            </div>

            <div>
              <div
                className="text-3xl font-bold"
                style={{ color: card.color }}
              >
                {card.value}
              </div>

              <div className="text-sm font-semibold text-white">
                {card.title}
              </div>

              <div className="text-xs text-[#8B95A7]">
                {card.desc}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}