
import { calculateGeometricScore, GeometricSubscores } from './scoring/geometricScoring';
import { calculatePointToCircleDistance } from './pointCalculations';

interface Point {
  x: number;
  y: number;
}

interface Circle {
  x: number;
  y: number;
  radius: number;
}

// Calculate the accuracy of a drawn circle compared to a target circle
export const calculateAccuracy = (points: Point[], targetCircle: Circle, difficultyLevel: number = 50, isPenaltyMode: boolean = false): number => {
  if (points.length < 3) return 0;
  
  // Use the new geometric scoring system
  const geometricResult = calculateGeometricScore(points, targetCircle, difficultyLevel, isPenaltyMode);
  
  // Return the overall score from the geometric system
  return geometricResult.overallScore;
};

// Re-export functions from other modules for backwards compatibility
export { calculatePointToCircleDistance } from './pointCalculations';
export { generateRandomCirclePosition } from './circleGeneration';
export { smoothPoints } from './smoothingAlgorithms';

// Export the geometric scoring function for use in other components
export { calculateGeometricScore } from './scoring/geometricScoring';
export type { GeometricSubscores } from './scoring/geometricScoring';
