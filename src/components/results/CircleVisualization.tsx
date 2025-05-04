
import React from 'react';

interface CircleVisualizationProps {
  targetCircle: { x: number; y: number; radius: number };
  drawnPoints: { x: number; y: number }[];
  isGoodScore: boolean;
}

const CircleVisualization: React.FC<CircleVisualizationProps> = ({
  targetCircle,
  drawnPoints,
  isGoodScore
}) => {
  const containerSize = 200;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;
  
  const scaleFactor = (containerSize * 0.8) / (targetCircle.radius * 2);
  
  let sumX = 0, sumY = 0;
  drawnPoints.forEach(point => {
    sumX += point.x;
    sumY += point.y;
  });
  
  const drawnCenterX = drawnPoints.length ? sumX / drawnPoints.length : 0;
  const drawnCenterY = drawnPoints.length ? sumY / drawnPoints.length : 0;
  
  const transformedDrawnPoints = drawnPoints.map(point => ({
    x: centerX + (point.x - drawnCenterX) * scaleFactor,
    y: centerY + (point.y - drawnCenterY) * scaleFactor
  }));

  return (
    <div className="relative w-[200px] h-[200px] mx-auto my-6 rounded-full shadow-lg bg-gradient-to-br from-background to-muted/20">
      <div 
        className="absolute border-2 border-primary/50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" 
        style={{
          width: containerSize * 0.8,
          height: containerSize * 0.8,
          borderRadius: '50%',
        }} 
      />
      
      {drawnPoints.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <path
            d={transformedDrawnPoints.length > 0 ? 
              `M ${transformedDrawnPoints[0].x} ${transformedDrawnPoints[0].y} 
                ${transformedDrawnPoints.map(p => `L ${p.x} ${p.y}`).join(' ')}` : ''}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ 
              filter: "drop-shadow(0 0 2px hsla(var(--primary), 0.5))",
              strokeDasharray: "1, 0"
            }}
          />
        </svg>
      )}
      
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        {isGoodScore ? (
          <i className="ri-checkbox-circle-line text-5xl text-primary animate-pulse-slow" />
        ) : (
          <i className="ri-close-circle-line text-5xl text-muted-foreground" />
        )}
      </div>
    </div>
  );
};

export default CircleVisualization;
