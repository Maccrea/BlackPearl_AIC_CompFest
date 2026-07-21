import StatCards from "../../components/cards/StatCards";
import RecentAlerts from "../../components/cards/RecentAlerts";

export default function Dashboard() {
  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-sm text-gray-400 mt-1">
          Monitoring seluruh sistem Black Pearl AI
        </p>
      </div>

      <StatCards />

      <div className="grid grid-cols-2 gap-6">

        <RecentAlerts />

        <div className="rounded-2xl bg-[#121620] border border-[#1F2937] p-6">

          <h3 className="font-bold text-white mb-5">
            System Status
          </h3>

          <div className="space-y-4">

            <div className="flex justify-between">
              <span className="text-gray-400">
                API
              </span>

              <span className="text-green-400">
                Online
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">
                AI Engine
              </span>

              <span className="text-green-400">
                Running
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">
                Database
              </span>

              <span className="text-green-400">
                Connected
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-400">
                MQTT
              </span>

              <span className="text-yellow-400">
                Delay 120 ms
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}