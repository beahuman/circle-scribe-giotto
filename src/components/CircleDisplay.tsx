
import React, { useEffect, useState } from 'react';

interface CircleDisplayProps {
  duration: number;
  onComplete: () => void;
  circleProps: {
    x: number;
    y: number;
    radius: number;
  };
}

const CircleDisplay: React.FC<CircleDisplayProps> = ({ 
  duration, 
  onComplete, 
  circleProps 
}) => {
  const [countdown, setCountdown] = useState(duration);
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
    <div className="absolute inset-0 flex items-center justify-center">
      <div 
        className="absolute animate-fade-in"
        style={{
          left: x - radius,
          top: y - radius,
          width: radius * 2,
          height: radius * 2,
          borderRadius: '50%',
          border: '2px solid',
          borderColor: 'hsl(var(--primary))'
        }}
      />
      
      <div className="fixed top-6 inset-x-0 mx-auto w-fit bg-[#765ED8] px-4 py-2 rounded-full backdrop-blur-sm">
        <span className="text-lg font-medium text-white">Memorize: {countdown}</span>
      </div>
    </div>
  );
};

export default CircleDisplay;
