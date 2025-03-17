
import { CostCalculator } from "@/components/CostCalculator";
import { useIsMobile } from "@/hooks/use-mobile";

const Embed = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="h-full flex flex-col bg-card-DEFAULT overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <CostCalculator embeddedMode={true} />
      </div>
    </div>
  );
};

export default Embed;
