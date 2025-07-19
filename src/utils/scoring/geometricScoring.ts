
import { Point } from '@/types/shapes';
import { calculatePointToCircleDistance } from '@/utils/circleUtils';

export interface GeometricSubscores {
  strokeDeviation: number;      // 0-100: How well the stroke follows the circle path
  angularSmoothness: number;    // 0-100: How smooth the angular changes are
  completionOffset: number;     // 0-100: How well the start and end points align
  overallScore: number;         // 0-100: Weighted combination of all subscores
}

export interface ScoringThresholds {
  deviation: {
    excellent: number;    // < 5% of radius
    good: number;        // < 10% of radius
    poor: number;        // < 20% of radius
  };
  smoothness: {
    excellent: number;    // < 15 degrees average angle change
    good: number;        // < 30 degrees average angle change
    poor: number;        // < 45 degrees average angle change
  };
  completion: {
    excellent: number;    // < 5% of radius gap
    good: number;        // < 10% of radius gap
    poor: number;        // < 20% of radius gap
  };
}

const DEFAULT_THRESHOLDS: ScoringThresholds = {
  deviation: { excellent: 0.05, good: 0.10, poor: 0.20 },
  smoothness: { excellent: 15, good: 30, poor: 45 },
  completion: { excellent: 0.05, good: 0.10, poor: 0.20 }
};

// Calculate stroke deviation score
export const calculateStrokeDeviation = (
  points: Point[], 
  targetCircle: { x: number; y: number; radius: number },
  thresholds: ScoringThresholds['deviation'] = DEFAULT_THRESHOLDS.deviation
): number => {
  if (points.length < 2) return 0;

  let totalDeviation = 0;
  
  for (const point of points) {
    const distanceToCenter = calculatePointToCircleDistance(point, targetCircle);
    const deviation = Math.abs(distanceToCenter - targetCircle.radius);
    const normalizedDeviation = deviation / targetCircle.radius;
    totalDeviation += normalizedDeviation;
  }
  
  const averageDeviation = totalDeviation / points.length;
  
  // Convert to score (0-100)
  if (averageDeviation <= thresholds.excellent) {
    return 100;
  } else if (averageDeviation <= thresholds.good) {
    // Linear interpolation between 100 and 80
    const ratio = (averageDeviation - thresholds.excellent) / (thresholds.good - thresholds.excellent);
    return 100 - (ratio * 20);
  } else if (averageDeviation <= thresholds.poor) {
    // Linear interpolation between 80 and 50
    const ratio = (averageDeviation - thresholds.good) / (thresholds.poor - thresholds.good);
    return 80 - (ratio * 30);
  } else {
    // Poor performance, scale down to 0
    const excessRatio = Math.min(1, (averageDeviation - thresholds.poor) / thresholds.poor);
    return Math.max(0, 50 - (excessRatio * 50));
  }
};

// Calculate angular smoothness score
export const calculateAngularSmoothness = (
  points: Point[],
  thresholds: ScoringThresholds['smoothness'] = DEFAULT_THRESHOLDS.smoothness
): number => {
  if (points.length < 3) return 100; // Perfect if too few points to measure

  let totalAngleChange = 0;
  let angleChangeCount = 0;
  
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    // Calculate vectors
    const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
    const v2 = { x: next.x - curr.x, y: next.y - curr.y };
    
    // Calculate magnitudes
    const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
    const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
    
    if (mag1 > 0 && mag2 > 0) {
      // Calculate angle between vectors
      const dot = (v1.x * v2.x + v1.y * v2.y) / (mag1 * mag2);
      const angle = Math.acos(Math.max(-1, Math.min(1, dot)));
      const angleInDegrees = (angle * 180) / Math.PI;
      
      totalAngleChange += angleInDegrees;
      angleChangeCount++;
    }
  }
  
  if (angleChangeCount === 0) return 100;
  
  const averageAngleChange = totalAngleChange / angleChangeCount;
  
  // Convert to score (0-100)
  if (averageAngleChange <= thresholds.excellent) {
    return 100;
  } else if (averageAngleChange <= thresholds.good) {
    // Linear interpolation between 100 and 75
    const ratio = (averageAngleChange - thresholds.excellent) / (thresholds.good - thresholds.excellent);
    return 100 - (ratio * 25);
  } else if (averageAngleChange <= thresholds.poor) {
    // Linear interpolation between 75 and 40
    const ratio = (averageAngleChange - thresholds.good) / (thresholds.poor - thresholds.good);
    return 75 - (ratio * 35);
  } else {
    // Poor performance, scale down to 0
    const excessRatio = Math.min(1, (averageAngleChange - thresholds.poor) / thresholds.poor);
    return Math.max(0, 40 - (excessRatio * 40));
  }
};

// Calculate completion offset score
export const calculateCompletionOffset = (
  points: Point[],
  targetCircle: { x: number; y: number; radius: number },
  thresholds: ScoringThresholds['completion'] = DEFAULT_THRESHOLDS.completion
): number => {
  if (points.length < 2) return 0;
  
  const startPoint = points[0];
  const endPoint = points[points.length - 1];
  
  // Calculate gap distance
  const gapDistance = Math.sqrt(
    Math.pow(endPoint.x - startPoint.x, 2) + 
    Math.pow(endPoint.y - startPoint.y, 2)
  );
  
  const normalizedGap = gapDistance / targetCircle.radius;
  
  // Convert to score (0-100)
  if (normalizedGap <= thresholds.excellent) {
    return 100;
  } else if (normalizedGap <= thresholds.good) {
    // Linear interpolation between 100 and 85
    const ratio = (normalizedGap - thresholds.excellent) / (thresholds.good - thresholds.excellent);
    return 100 - (ratio * 15);
  } else if (normalizedGap <= thresholds.poor) {
    // Linear interpolation between 85 and 60
    const ratio = (normalizedGap - thresholds.good) / (thresholds.poor - thresholds.good);
    return 85 - (ratio * 25);
  } else {
    // Poor performance, scale down to 0
    const excessRatio = Math.min(1, (normalizedGap - thresholds.poor) / thresholds.poor);
    return Math.max(0, 60 - (excessRatio * 60));
  }
};

// Calculate overall geometric score with subscores
export const calculateGeometricScore = (
  points: Point[],
  targetCircle: { x: number; y: number; radius: number },
  difficultyLevel: number = 50,
  isPenaltyMode: boolean = false,
  customThresholds?: Partial<ScoringThresholds>
): GeometricSubscores => {
  const thresholds = { ...DEFAULT_THRESHOLDS, ...customThresholds };
  
  // Apply difficulty scaling to thresholds
  const difficultyMultiplier = 0.5 + (difficultyLevel / 100); // 0.5x to 1.5x
  const penaltyMultiplier = isPenaltyMode ? 1.25 : 1; // 25% harder in penalty mode
  const totalMultiplier = difficultyMultiplier * penaltyMultiplier;
  
  const scaledThresholds: ScoringThresholds = {
    deviation: {
      excellent: thresholds.deviation.excellent / totalMultiplier,
      good: thresholds.deviation.good / totalMultiplier,
      poor: thresholds.deviation.poor / totalMultiplier
    },
    smoothness: {
      excellent: thresholds.smoothness.excellent / totalMultiplier,
      good: thresholds.smoothness.good / totalMultiplier,
      poor: thresholds.smoothness.poor / totalMultiplier
    },
    completion: {
      excellent: thresholds.completion.excellent / totalMultiplier,
      good: thresholds.completion.good / totalMultiplier,
      poor: thresholds.completion.poor / totalMultiplier
    }
  };
  
  // Calculate individual subscores
  const strokeDeviation = calculateStrokeDeviation(points, targetCircle, scaledThresholds.deviation);
  const angularSmoothness = calculateAngularSmoothness(points, scaledThresholds.smoothness);
  const completionOffset = calculateCompletionOffset(points, targetCircle, scaledThresholds.completion);
  
  // Calculate weighted overall score
  const overallScore = (
    strokeDeviation * 0.5 +      // 50% weight - most important
    angularSmoothness * 0.3 +    // 30% weight - smoothness matters
    completionOffset * 0.2       // 20% weight - completion is least critical
  );
  
  return {
    strokeDeviation: Math.round(strokeDeviation * 100) / 100,
    angularSmoothness: Math.round(angularSmoothness * 100) / 100,
    completionOffset: Math.round(completionOffset * 100) / 100,
    overallScore: Math.round(overallScore * 100) / 100
  };
};
