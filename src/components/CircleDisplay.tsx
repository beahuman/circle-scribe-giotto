
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
  
  return (
    <div className="absolute inset-0 pb-16"> {/* Account for bottom nav */}
      <div 
        className="absolute animate-fade-in"
        style={{
          left: x - radius,
          top: y - radius,
          width: radius * 2,
          height: radius * 2,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: isPenaltyMode ? 'rgb(239, 68, 68)' : 'hsl(var(--primary))'
        }}
      />
      
      <div className={`fixed top-6 inset-x-0 mx-auto w-fit ${isPenaltyMode ? 'bg-red-500' : 'bg-[#765ED8]'} px-4 py-2 rounded-full backdrop-blur-sm`}>
        <span className="text-lg font-medium text-white">
          {isPenaltyMode ? 'PENALTY MODE: ' : 'Memorize: '}{countdown}
        </span>
      </div>
    </div>
  );
};

export default CircleDisplay;
