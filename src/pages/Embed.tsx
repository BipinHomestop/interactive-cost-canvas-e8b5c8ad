
import { CostCalculator } from "@/components/CostCalculator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect } from "react";

const Embed = () => {
  const isMobile = useIsMobile();
  
  // Send message to parent window when calculator loads
  useEffect(() => {
    // Only run in iframe context
    if (window.self !== window.top) {
      window.parent.postMessage({ type: 'calculator:loaded' }, '*');
      
      // Listen for resize events and notify parent
      const handleResize = () => {
        window.parent.postMessage({ 
          type: 'calculator:resize',
          height: document.body.scrollHeight
        }, '*');
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);
  
  return (
    <div className="h-full flex flex-col bg-card-DEFAULT overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <CostCalculator embeddedMode={true} />
      </div>
    </div>
  );
};

export default Embed;
