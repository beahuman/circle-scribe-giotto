interface Point {
  x: number;
  y: number;
}

interface Circle {
  x: number;
  y: number;
  radius: number;
}

// Calculate the distance between a point and the center of a circle
export const calculatePointToCircleDistance = (point: Point, circle: Circle): number => {
  return Math.sqrt(
    Math.pow(point.x - circle.x, 2) + 
    Math.pow(point.y - circle.y, 2)
  );
};

// Calculate angle between three points (in radians)
const angleBetween = (p1: Point, p2: Point, p3: Point): number => {
  const a = {x: p1.x - p2.x, y: p1.y - p2.y};
  const b = {x: p3.x - p2.x, y: p3.y - p2.y};
  
  const dotProduct = a.x * b.x + a.y * b.y;
  const magA = Math.sqrt(a.x * a.x + a.y * a.y);
  const magB = Math.sqrt(b.x * b.x + b.y * b.y);
  
  // Avoid division by zero and floating point errors
  const cosAngle = Math.max(-1, Math.min(1, dotProduct / (magA * magB || 1)));
  return Math.acos(cosAngle);
};

// Measure jitter/smoothness - lower values are better (less jittery)
const measureJitter = (points: Point[]): number => {
  if (points.length < 3) return 0;
  
  let totalAngleChange = 0;
  let angleChanges = 0;
  
  for (let i = 1; i < points.length - 1; i++) {
    const angle = angleBetween(points[i-1], points[i], points[i+1]);
    totalAngleChange += angle;
    angleChanges++;
  }
  
  return angleChanges > 0 ? totalAngleChange / angleChanges : 0;
};

// Evaluate radial symmetry from circle's center
const evaluateRadialSymmetry = (points: Point[], center: Point): number => {
  if (points.length < 4) return 0;
  
  // Calculate mean radius
  const radii = points.map(point => 
    Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2))
  );
  
  const meanRadius = radii.reduce((sum, r) => sum + r, 0) / radii.length;
  
  // Calculate standard deviation of radii (lower is better symmetry)
  const radiusSquaredDifferences = radii.map(r => Math.pow(r - meanRadius, 2));
  const radiusVariance = radiusSquaredDifferences.reduce((sum, diff) => sum + diff, 0) / radii.length;
  const radiusStdDev = Math.sqrt(radiusVariance);
  
  // Normalize by mean radius to get a relative measure
  return radiusStdDev / (meanRadius || 1);
};

// Calculate the accuracy of a drawn circle compared to a target circle
export const calculateAccuracy = (points: Point[], targetCircle: Circle, difficultyLevel: number = 50): number => {
  if (points.length < 3) return 0;
  
  // Apply difficulty scaling factor (50% is standard, higher is harder)
  // Range: 0.75 (easiest) to 1.75 (hardest)
  const difficultyScaling = 0.75 + (difficultyLevel / 50);
  
  // 1. Find the center of drawn points
  let sumX = 0, sumY = 0;
  for (const point of points) {
    sumX += point.x;
    sumY += point.y;
  }
  const centerX = sumX / points.length;
  const centerY = sumY / points.length;
  const drawnCenter = { x: centerX, y: centerY };
  
  // 2. Calculate average radius of drawn points
  let sumRadius = 0;
  for (const point of points) {
    const dx = point.x - centerX;
    const dy = point.y - centerY;
    sumRadius += Math.sqrt(dx * dx + dy * dy);
  }
  const avgRadius = sumRadius / points.length;
  
  // 3. Distance score: Calculate mean distance error from ideal path
  let sumDistanceError = 0;
  for (const point of points) {
    // Distance from point to target circle center
    const pointToCenter = calculatePointToCircleDistance(point, targetCircle);
    // Error is the absolute difference between this distance and the target radius
    const distanceError = Math.abs(pointToCenter - targetCircle.radius) / targetCircle.radius;
    sumDistanceError += distanceError;
  }
  const meanDistanceError = sumDistanceError / points.length;
  const distanceScore = Math.max(0, 100 - (meanDistanceError * 250 * difficultyScaling));
  
  // 4. Smoothness score: Penalize jitter/abrupt changes
  const jitterMeasure = measureJitter(points);
  // Convert jitter to score (lower jitter = higher score)
  // Normal jitter range is roughly 0 to π/2 (90 degrees)
  const smoothnessScore = Math.max(0, 100 - (jitterMeasure * (100 * difficultyScaling) / Math.PI));
  
  // 5. Symmetry score: Evaluate radial symmetry
  const symmetryMeasure = evaluateRadialSymmetry(points, drawnCenter);
  // Convert symmetry measure to score (lower measure = higher score)
  const symmetryScore = Math.max(0, 100 - (symmetryMeasure * 500 * difficultyScaling));
  
  // 6. Center position accuracy
  const centerDistance = Math.sqrt(
    Math.pow(centerX - targetCircle.x, 2) + 
    Math.pow(centerY - targetCircle.y, 2)
  );
  const centerError = centerDistance / targetCircle.radius;
  const centerScore = Math.max(0, 100 - (centerError * 200 * difficultyScaling));
  
  // 7. Radius accuracy
  const radiusError = Math.abs(avgRadius - targetCircle.radius) / targetCircle.radius;
  const radiusScore = Math.max(0, 100 - (radiusError * 200 * difficultyScaling));
  
  // Combine distance and positioning into a single distance score (50%)
  const combinedDistanceScore = (distanceScore * 0.6) + (centerScore * 0.2) + (radiusScore * 0.2);
  
  // Final weighted score
  const finalScore = (
    (combinedDistanceScore * 0.5) +   // Distance: 50% weight
    (smoothnessScore * 0.25) +        // Smoothness: 25% weight
    (symmetryScore * 0.25)            // Symmetry: 25% weight
  );
  
  // Apply a small bonus for lower difficulty
  const difficultyBonus = Math.max(0, (1 - (difficultyLevel / 100)) * 10);
  
  // Ensure the score is between 0 and 100
  return Math.min(100, Math.max(0, finalScore + difficultyBonus));
};

// Generate a random position for a circle within the screen bounds
export const generateRandomCirclePosition = (padding: number = 100): Circle => {
  const minRadius = Math.min(window.innerWidth, window.innerHeight) * 0.15;
  const maxRadius = Math.min(window.innerWidth, window.innerHeight) * 0.25;
  
  const radius = minRadius + Math.random() * (maxRadius - minRadius);
  
  const x = padding + radius + Math.random() * (window.innerWidth - 2 * (radius + padding));
  const y = padding + radius + Math.random() * (window.innerHeight - 2 * (radius + padding));
  
  return { x, y, radius };
};

// Enhanced smoothPoints function with more aggressive smoothing for lower precision
export const smoothPoints = (points: Point[], precision: number = 50): Point[] => {
  if (points.length < 3) return points;
  
  // For very low precision values, use a different approach that doesn't introduce lag
  if (precision <= 20) {
    // Use fewer passes but maintain responsiveness
    let smoothedPoints = [...points];
    const windowSize = 2; // Very small window size
    
    // Single pass with small window for responsiveness
    let result: Point[] = [];
    for (let i = 0; i < smoothedPoints.length; i++) {
      let sumX = 0, sumY = 0;
      let count = 0;
      
      for (let j = Math.max(0, i - windowSize); j < Math.min(smoothedPoints.length, i + windowSize + 1); j++) {
        sumX += smoothedPoints[j].x;
        sumY += smoothedPoints[j].y;
        count++;
      }
      
      result.push({
        x: sumX / count,
        y: sumY / count
      });
    }
    
    return result;
  }
  
  // Original smoothing for higher precision values
  // Convert precision to smoothing factor (5% = max smoothing, 100% = no smoothing)
  const smoothingFactor = Math.max(0.1, Math.pow(precision / 100, 1.5));
  
  let smoothedPoints: Point[] = [];
  // Increase window size for lower precision values
  const windowSize = Math.floor((1 - smoothingFactor) * 20) + 1;
  
  for (let i = 0; i < points.length; i++) {
    let sumX = 0, sumY = 0;
    let weightSum = 0;
    
    for (let j = Math.max(0, i - windowSize); j < Math.min(points.length, i + windowSize + 1); j++) {
      // Apply gaussian-like weighting for smoother results
      const distance = Math.abs(i - j);
      const weight = Math.exp(-distance * distance / (windowSize * windowSize));
      
      sumX += points[j].x * weight;
      sumY += points[j].y * weight;
      weightSum += weight;
    }
    
    smoothedPoints.push({
      x: sumX / weightSum,
      y: sumY / weightSum
    });
  }
  
  // For medium-low precision, do fewer passes
  if (precision <= 25) {
    const passes = Math.floor((25 - precision) / 10) + 1;
    for (let pass = 0; pass < passes; pass++) {
      smoothedPoints = smoothPoints(smoothedPoints, precision + 25);
    }
  }
  
  return smoothedPoints;
};
