
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
  
  // Apply difficulty scaling factor (50% is standard, higher is harder) with 25% increased difficulty
  const difficultyScaling = (difficultyLevel / 50) * 1.25;
  
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
  
  // Calculate center distance between drawn and target circles
  const centerDistance = Math.sqrt(
    Math.pow(centerX - targetCircle.x, 2) + 
    Math.pow(centerY - targetCircle.y, 2)
  );
  
  // Calculate radius difference between drawn and target circles
  const radiusDiff = Math.abs(avgRadius - targetCircle.radius) / targetCircle.radius;
  
  // Apply difficulty scaling to all score components with 25% higher difficulty
  const circularityScore = Math.max(0, 100 - (sumVariance / points.length * 375 * difficultyScaling));
  const positionScore = Math.max(0, 100 - (centerDistance / targetCircle.radius * 250 * difficultyScaling));
  const sizeScore = Math.max(0, 100 - (radiusDiff * 375 * difficultyScaling));
  
  // Final score calculation with difficulty consideration
  const finalScore = (
    (circularityScore * 0.8) + 
    (positionScore * 0.1) + 
    (sizeScore * 0.1)
  ) * (1 + (1 - difficultyScaling) * 0.3); // Bonus for lower difficulty
  
  return Math.min(100, Math.max(0, finalScore * 0.65 * 0.8)); // 0.8 = 20% harder
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
