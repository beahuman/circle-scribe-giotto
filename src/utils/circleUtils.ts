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
export const calculateAccuracy = (points: Point[], targetCircle: Circle, difficultyLevel: number = 50): number => {
  if (points.length < 3) return 0;
  
  // Apply difficulty scaling factor (50% is standard, higher is harder)
  const difficultyScaling = difficultyLevel / 50;
  
  // Calculate center of drawn points
  let sumX = 0, sumY = 0;
  for (const point of points) {
    sumX += point.x;
    sumY += point.y;
  }
  const centerX = sumX / points.length;
  const centerY = sumY / points.length;
  
  // Calculate average radius of drawn points
  let sumRadius = 0;
  for (const point of points) {
    const dx = point.x - centerX;
    const dy = point.y - centerY;
    sumRadius += Math.sqrt(dx * dx + dy * dy);
  }
  const avgRadius = sumRadius / points.length;
  
  // Calculate variance in radius (circularity) - Adjusted for difficulty
  let sumVariance = 0;
  for (const point of points) {
    const dx = point.x - centerX;
    const dy = point.y - centerY;
    const radius = Math.sqrt(dx * dx + dy * dy);
    sumVariance += Math.abs(radius - avgRadius) / avgRadius;
  }
  
  // Apply difficulty scaling to all score components
  const circularityScore = Math.max(0, 100 - (sumVariance / points.length * 300 * difficultyScaling));
  const positionScore = Math.max(0, 100 - (centerDistance / targetCircle.radius * 200 * difficultyScaling));
  const sizeScore = Math.max(0, 100 - (radiusDiff * 300 * difficultyScaling));
  
  // Final score calculation with difficulty consideration
  const finalScore = (
    (circularityScore * 0.8) + 
    (positionScore * 0.1) + 
    (sizeScore * 0.1)
  ) * (1 + (1 - difficultyScaling) * 0.3); // Bonus for lower difficulty
  
  return Math.min(100, Math.max(0, finalScore * 0.65));
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
  
  // Convert precision to smoothing factor (5% = max smoothing, 100% = no smoothing)
  // Enhanced smoothing for lower precision values
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
  
  // Additional smoothing passes for very low precision
  if (precision <= 25) {
    const passes = Math.floor((25 - precision) / 5) + 1;
    for (let pass = 0; pass < passes; pass++) {
      smoothedPoints = smoothPoints(smoothedPoints, precision + 25);
    }
  }
  
  return smoothedPoints;
};
