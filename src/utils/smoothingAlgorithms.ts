interface Point {
  x: number;
  y: number;
}

// Optimized smoothing for real-time drawing with minimal lag
export const smoothPoints = (points: Point[], precision: number = 50): Point[] => {
  if (points.length < 3) return points;
  
  // For real-time drawing, use minimal smoothing to reduce lag
  if (precision <= 30) {
    // Ultra-responsive mode - minimal smoothing
    return applySinglePassSmoothing(points, 0.1);
  }
  
  // For higher precision, use moderate smoothing
  const smoothingStrength = Math.max(0.05, (100 - precision) / 200);
  return applySinglePassSmoothing(points, smoothingStrength);
};

// Single-pass smoothing for minimal latency
const applySinglePassSmoothing = (points: Point[], strength: number): Point[] => {
  if (points.length < 2) return points;
  
  const smoothed: Point[] = [points[0]]; // Keep first point unchanged
  
  for (let i = 1; i < points.length - 1; i++) {
    const prev = points[i - 1];
    const current = points[i];
    const next = points[i + 1];
    
    // Simple weighted average for minimal processing time
    const smoothedX = current.x + (prev.x + next.x - 2 * current.x) * strength;
    const smoothedY = current.y + (prev.y + next.y - 2 * current.y) * strength;
    
    smoothed.push({ x: smoothedX, y: smoothedY });
  }
  
  // Keep last point unchanged for real-time accuracy
  smoothed.push(points[points.length - 1]);
  
  return smoothed;
};
