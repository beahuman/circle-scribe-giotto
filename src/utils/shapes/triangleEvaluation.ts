
import { Point } from '@/types/shapes';
import { distance, angleBetween } from './shapeBaseUtils';
import { simplifyShape } from './shapeSimplification';

// Evaluate triangle shape quality
export const evaluateTriangle = (points: Point[]): number => {
  // We need some minimum number of points to evaluate
  if (points.length < 3) return 0;
  
  // Simplify the drawn shape to find vertices
  const simplifiedPoints = simplifyShape(points, 3);
  
  // Calculate angles of the triangle
  const angles = [];
  for (let i = 0; i < 3; i++) {
    const prev = simplifiedPoints[(i + 2) % 3];
    const curr = simplifiedPoints[i];
    const next = simplifiedPoints[(i + 1) % 3];
    
    const angle = angleBetween(prev, curr, next);
    angles.push(angle);
  }
  
  // An equilateral triangle has all angles equal to 60 degrees (π/3 radians)
  const idealAngle = Math.PI / 3;
  let angleDeviationScore = 0;
  
  for (const angle of angles) {
    angleDeviationScore += Math.abs(angle - idealAngle) / idealAngle;
  }
  
  angleDeviationScore = Math.max(0, 1 - (angleDeviationScore / 3));
  
  // Check if shape is closed
  const closureScore = distance(points[0], points[points.length - 1]) < 
                      distance(points[0], points[Math.floor(points.length / 2)]) * 0.3 ? 1 : 0.5;
  
  // Final score combines angle accuracy and closure
  const finalScore = (angleDeviationScore * 70 + closureScore * 30) * 0.8; // 0.8 factor for higher difficulty
  
  return Math.min(100, Math.max(0, finalScore));
};
