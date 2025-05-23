
interface Point {
  x: number;
  y: number;
}

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
