
import React, { useEffect, useState } from 'react';

interface CircleDisplayProps {
  duration: number;
  onComplete: () => void;
  circleProps: {
    x: number;
    y: number;
    radius: number;
  };
  isPenaltyMode?: boolean;
}

const CircleDisplay: React.FC<CircleDisplayProps> = ({ 
  duration, 
  onComplete, 
  circleProps,
  isPenaltyMode = false
}) => {
  // In penalty mode, force display time to 1 second regardless of settings
  const actualDuration = isPenaltyMode ? 1 : duration;
  const [countdown, setCountdown] = useState(actualDuration);
  const { x, y, radius } = circleProps;
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(onComplete, 250); // Small delay before transitioning
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [onComplete]);
  
  // Debug logging
  console.log('CircleDisplay - Target circle coordinates:', { x, y, radius });
  console.log('CircleDisplay - Window dimensions:', { width: window.innerWidth, height: window.innerHeight });
  
  return (
    <div className="absolute inset-0" style={{ paddingBottom: '64px' }}>
      <div 
        className="absolute animate-fade-in"
        style={{
          left: x - radius,
          top: y - radius,
          width: radius * 2,
          height: radius * 2,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: isPenaltyMode ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'
        }}
      />
      
      {/* Debug overlay to show exact center */}
      <div 
        className="absolute w-2 h-2 bg-red-500 rounded-full"
        style={{
          left: x - 4,
          top: y - 4,
          zIndex: 1000
        }}
      />
      
      <div className={`fixed top-6 inset-x-0 mx-auto w-fit ${isPenaltyMode ? 'bg-error' : 'bg-primary'} px-4 py-2 rounded-full backdrop-blur-sm`}>
        <span className="text-lg font-medium text-white">
          {isPenaltyMode ? 'PENALTY MODE: ' : 'Memorize: '}{countdown}
        </span>
      </div>
    </div>
  );
};

export default CircleDisplay;
