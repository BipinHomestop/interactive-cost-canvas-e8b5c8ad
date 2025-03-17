
import { CostCalculator } from "@/components/CostCalculator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

const Embed = () => {
  const isMobile = useIsMobile();
  const [height, setHeight] = useState(0);
  
  // Send message to parent window when calculator loads
  useEffect(() => {
    // Only run in iframe context
    if (window.self !== window.top) {
      window.parent.postMessage({ type: 'calculator:loaded' }, '*');
      
      // Calculate initial height
      const calculateHeight = () => {
        return document.body.scrollHeight;
      };
      
      // Initial height calculation and notification
      setHeight(calculateHeight());
      window.parent.postMessage({ 
        type: 'calculator:resize',
        height: calculateHeight()
      }, '*');
      
      // Listen for resize events and notify parent
      const handleResize = () => {
        const newHeight = calculateHeight();
        setHeight(newHeight);
        window.parent.postMessage({ 
          type: 'calculator:resize',
          height: newHeight
        }, '*');
      };
      
      // Set up resize observer for content changes
      const resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      
      // Observe the body element for size changes
      resizeObserver.observe(document.body);
      
      // Also listen for window resize events
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        resizeObserver.disconnect();
      };
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
