
import { Point } from '@/types/shapes';
import { distance, angleBetween } from './shapeBaseUtils';
import { simplifyShape } from './shapeSimplification';

// Evaluate square shape quality
export const evaluateSquare = (points: Point[]): number => {
  // We need some minimum number of points to evaluate
  if (points.length < 4) return 0;
  
  // Simplify the drawn shape to find vertices
  const simplifiedPoints = simplifyShape(points, 4);
  
  // Calculate angles at each corner (should be 90° for a square)
  const angles = [];
  for (let i = 0; i < 4; i++) {
    const prev = simplifiedPoints[(i + 3) % 4];
    const curr = simplifiedPoints[i];
    const next = simplifiedPoints[(i + 1) % 4];
    
    const angle = angleBetween(prev, curr, next);
    angles.push(angle);
  }
  
  // A square has all angles equal to 90 degrees (π/2 radians)
  const idealAngle = Math.PI / 2;
  let angleDeviationScore = 0;
  
  for (const angle of angles) {
    angleDeviationScore += Math.abs(angle - idealAngle) / idealAngle;
  }
  
  angleDeviationScore = Math.max(0, 1 - (angleDeviationScore / 4));
  
  // Check if sides are equal length
  const sides = [];
  for (let i = 0; i < 4; i++) {
    const next = (i + 1) % 4;
    sides.push(distance(simplifiedPoints[i], simplifiedPoints[next]));
  }
  
  const avgSide = sides.reduce((sum, side) => sum + side, 0) / 4;
  let sideDeviationScore = 0;
  
  for (const side of sides) {
    sideDeviationScore += Math.abs(side - avgSide) / avgSide;
  }
  
  sideDeviationScore = Math.max(0, 1 - (sideDeviationScore / 4));
  
  // Check if shape is closed
  const closureScore = distance(points[0], points[points.length - 1]) < 
                      distance(points[0], points[Math.floor(points.length / 2)]) * 0.3 ? 1 : 0.5;
  
  // Final score combines angle accuracy, side equality, and closure
  const finalScore = (angleDeviationScore * 40 + sideDeviationScore * 40 + closureScore * 20) * 0.8; // 0.8 factor for higher difficulty
  
  return Math.min(100, Math.max(0, finalScore));
};
