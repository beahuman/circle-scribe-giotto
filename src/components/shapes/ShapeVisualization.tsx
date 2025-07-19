
import React from 'react';
import { Point, TargetShape } from '@/types/shapes';

interface ShapeVisualizationProps {
  points: Point[];
  isPassing: boolean;
}

const ShapeVisualization: React.FC<ShapeVisualizationProps> = ({ points, isPassing }) => {
  // Calculate the visualization container size
  const containerSize = 200;
  const centerX = containerSize / 2;
  const centerY = containerSize / 2;
  
  // Find bounds of drawn shape
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  points.forEach(point => {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  });
  
  // Calculate scale factor to fit in container
  const drawnWidth = maxX - minX;
  const drawnHeight = maxY - minY;
  const drawnCenterX = minX + drawnWidth / 2;
  const drawnCenterY = minY + drawnHeight / 2;
  
  const scaleFactor = Math.min(
    (containerSize * 0.8) / (drawnWidth || 1), 
    (containerSize * 0.8) / (drawnHeight || 1)
  );
  
  const transformedDrawnPoints = points.map(point => ({
    x: centerX + (point.x - drawnCenterX) * scaleFactor,
    y: centerY + (point.y - drawnCenterY) * scaleFactor
  }));

  return (
    <div className="relative w-[200px] h-[200px] mx-auto my-6 rounded-lg bg-gradient-to-br from-background to-muted/20">
      <div className="absolute inset-0 flex items-center justify-center">
        <svg className="w-full h-full pointer-events-none">
          <path
            d={transformedDrawnPoints.length > 0 ? 
              `M ${transformedDrawnPoints[0].x} ${transformedDrawnPoints[0].y} 
               ${transformedDrawnPoints.map(p => `L ${p.x} ${p.y}`).join(' ')}` : ''}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        
        {isPassing && (
          <div className="absolute bg-green-500/20 w-10 h-10 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
              <path d="M20 6L9 17l-5-5"/>
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShapeVisualization;
