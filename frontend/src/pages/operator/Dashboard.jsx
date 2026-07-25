import StatCards from "../../components/cards/StatCards.jsx"; 
import ProductionLine from "../../components/cards/ProductionLine.jsx";
import RecentAlerts from "../../components/cards/RecentAlerts.jsx";
import AiAnalysisProgress from "../../components/ai/AiAnalysisProgress.jsx";
import MachineDetailCard from "../../components/cards/MachineDetailCard.jsx";
import AiRecommendation from "../../components/ai/AiRecommendation.jsx";

export default function OperatorDashboard() {
  return (
    <div className="flex flex-col gap-6 pb-10">
      
      <StatCards />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ProductionLine />
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <RecentAlerts />
            <AiAnalysisProgress />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:col-span-1">
          <MachineDetailCard />
          {/* <AiRecommendation /> */}
        </div>
      </div>

      {/* <DailyTip /> */}

    </div>
  );
}
