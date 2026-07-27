import StatCards from "../../components/cards/StatCards.jsx"; 
import ProductionLine from "../../components/cards/ProductionLine.jsx";
import RecentAlerts from "../../components/cards/RecentAlerts.jsx";
import AiAnalysisProgress from "../../components/ai/AiAnalysisProgress.jsx";
import AttentionMachines from "../../components/cards/AttentionMachines.jsx"; // Pengganti MachineDetailCard

export default function OperatorDashboard() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      
      <StatCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ProductionLine />
          <AiAnalysisProgress />
        </div>

        <div className="flex flex-col gap-6  lg:col-span-1">
          <AttentionMachines />
          
        </div>

      </div>
    </div>
  );
}