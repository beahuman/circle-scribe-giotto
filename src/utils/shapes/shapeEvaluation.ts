
import { ShapeType, Point } from '@/types/shapes';
import { distance } from './shapeBaseUtils';
import { simplifyShape } from './shapeSimplification';
import { evaluateLine } from './lineEvaluation';
import { evaluateTriangle } from './triangleEvaluation';
import { evaluateSquare } from './squareEvaluation';

// Evaluate how well a drawn shape matches a target shape
export const evaluateShape = (
  drawnPoints: Point[],
  targetPoints: Point[],
  shapeType: ShapeType
): number => {
  // Need minimum points for comparison
  if (drawnPoints.length < 2) return 0;
  
  // Special case for line
  if (shapeType === 'line') {
    return evaluateLine(drawnPoints);
  }
  
  // For more complex shapes (triangle, square)
  switch (shapeType) {
    case 'triangle': 
      return evaluateTriangle(drawnPoints);
    case 'square':
      return evaluateSquare(drawnPoints);
    default:
      return 0;
  }
};
