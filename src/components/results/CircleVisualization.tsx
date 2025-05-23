
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
  
  // Calculate smoothness of the stroke by analyzing angle changes
  const calculateSmoothness = (points: {x: number, y: number}[]): number => {
    if (points.length < 3) return 1;
    
    let totalAngleChange = 0;
    for (let i = 1; i < points.length - 1; i++) {
      const prevVector = {
        x: points[i].x - points[i-1].x,
        y: points[i].y - points[i-1].y
      };
      const nextVector = {
        x: points[i+1].x - points[i].x,
        y: points[i+1].y - points[i].y
      };
      
      const prevMag = Math.sqrt(prevVector.x * prevVector.x + prevVector.y * prevVector.y);
      const nextMag = Math.sqrt(nextVector.x * nextVector.x + nextVector.y * nextVector.y);
      
      if (prevMag === 0 || nextMag === 0) continue;
      
      const dotProduct = (prevVector.x * nextVector.x + prevVector.y * nextVector.y) / (prevMag * nextMag);
      const angleChange = Math.acos(Math.max(-1, Math.min(1, dotProduct)));
      totalAngleChange += angleChange;
    }
    
    // Normalize and invert so 1 = smooth, 0 = jagged
    const normalizedSmoothness = Math.max(0, 1 - (totalAngleChange / (points.length * 0.5)));
    return normalizedSmoothness;
  };
  
  const smoothness = calculateSmoothness(transformedDrawnPoints);
  
  // Visual feedback based on stroke quality
  const getStrokeStyles = () => {
    if (isGoodScore) {
      return {
        stroke: "hsl(var(--primary))",
        strokeWidth: "2.5",
        filter: "drop-shadow(0 0 3px hsla(var(--primary), 0.6))",
        strokeDasharray: smoothness > 0.8 ? "1, 0" : "1, 0", // Solid line for smooth strokes
        animation: smoothness > 0.8 ? "dashOffset 1.5s ease-in-out" : "none"
      };
    } else {
      return {
        stroke: smoothness < 0.4 ? "hsl(var(--destructive))" : "hsl(var(--primary) / 0.7)",
        strokeWidth: "2.5",
        filter: smoothness < 0.4 ? "none" : "drop-shadow(0 0 2px hsla(var(--primary), 0.5))",
        strokeDasharray: smoothness < 0.4 ? "4, 2" : "1, 0", // Dashed line for jagged strokes
        animation: smoothness < 0.4 ? "shake 0.5s ease-in-out" : "none"
      };
    }
  };
  
  const strokeStyles = getStrokeStyles();

  return (
    <div className="relative w-[200px] h-[200px] mx-auto my-6 rounded-full shadow-lg bg-gradient-to-br from-background to-muted/20">
      {/* Target circle outline */}
      <div 
        className="absolute border-2 border-primary/50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse-slow" 
        style={{
          width: containerSize * 0.8,
          height: containerSize * 0.8,
          borderRadius: '50%',
        }} 
      />
      
      {/* User's drawn circle path */}
      {drawnPoints.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <style>
            {`
              @keyframes dashOffset {
                0% {
                  stroke-dashoffset: ${transformedDrawnPoints.length * 2};
                }
                100% {
                  stroke-dashoffset: 0;
                }
              }
              
              @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20% { transform: translateX(-1px); }
                40% { transform: translateX(1px); }
                60% { transform: translateX(-1px); }
                80% { transform: translateX(1px); }
              }
            `}
          </style>
          <path
            d={transformedDrawnPoints.length > 0 ? 
              `M ${transformedDrawnPoints[0].x} ${transformedDrawnPoints[0].y} 
                ${transformedDrawnPoints.map(p => `L ${p.x} ${p.y}`).join(' ')}` : ''}
            fill="none"
            stroke={strokeStyles.stroke}
            strokeWidth={strokeStyles.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ 
              filter: strokeStyles.filter,
              strokeDasharray: strokeStyles.strokeDasharray,
              animation: strokeStyles.animation
            }}
          />
        </svg>
      )}
      
      {/* Pass/fail icon in the center */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
        {isGoodScore ? (
          <i className={`ri-checkbox-circle-line text-4xl text-primary ${smoothness > 0.8 ? 'animate-bounce-slow' : 'animate-pulse-slow'}`} />
        ) : (
          <i className={`ri-close-circle-line text-4xl ${smoothness < 0.4 ? 'text-destructive' : 'text-muted-foreground'}`} />
        )}
      </div>
    </div>
  );
};

export default CircleVisualization;
