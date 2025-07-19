
import { Point } from '@/types/shapes';
import { distance } from './shapeBaseUtils';

// Evaluate straightness of a line
export const evaluateLine = (points: Point[]): number => {
  // If too few points, can't evaluate
  if (points.length < 2) return 0;
  
  // Get start and end points
  const start = points[0];
  const end = points[points.length - 1];
  
  // Calculate theoretical straight line distance
  const lineLength = distance(start, end);
  
  // Calculate sum of all segment lengths in the drawn line
  let totalLength = 0;
  for (let i = 1; i < points.length; i++) {
    totalLength += distance(points[i-1], points[i]);
  }
  
  // Calculate straightness score (ratio of direct distance to total drawn distance)
  // A perfectly straight line would have a ratio of 1 (100%)
  const straightness = lineLength / totalLength;
  
  // Calculate deviation from straight line
  let totalDeviation = 0;
  for (let i = 1; i < points.length - 1; i++) {
    // Calculate distance from point to line formed by start and end points
    const lineParam = ((points[i].x - start.x) * (end.x - start.x) + 
                      (points[i].y - start.y) * (end.y - start.y)) / 
                      (Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    
    const closestPoint = {
      x: start.x + lineParam * (end.x - start.x),
      y: start.y + lineParam * (end.y - start.y)
    };
    
    totalDeviation += distance(points[i], closestPoint) / lineLength;
  }
  
  const deviationScore = Math.max(0, 1 - totalDeviation);
  
  // Combine scores 
  const finalScore = (straightness * 60 + deviationScore * 40) * 0.8; // 0.8 factor for higher difficulty
  
  // Return score as percentage (0-100)
  return Math.min(100, Math.max(0, finalScore));
};
