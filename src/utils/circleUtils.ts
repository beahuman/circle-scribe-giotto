
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
export const calculateAccuracy = (points: Point[], targetCircle: Circle): number => {
  if (points.length < 3) return 0;
  
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
  
  // Calculate variance in radius (circularity)
  let sumVariance = 0;
  for (const point of points) {
    const dx = point.x - centerX;
    const dy = point.y - centerY;
    const radius = Math.sqrt(dx * dx + dy * dy);
    sumVariance += Math.abs(radius - avgRadius) / avgRadius;
  }
  const circularityScore = Math.max(0, 100 - (sumVariance / points.length * 100));
  
  // Calculate position accuracy
  const centerDistance = Math.sqrt(
    Math.pow(centerX - targetCircle.x, 2) + 
    Math.pow(centerY - targetCircle.y, 2)
  );
  const positionScore = Math.max(0, 100 - (centerDistance / targetCircle.radius * 50));
  
  // Calculate size accuracy
  const radiusDiff = Math.abs(avgRadius - targetCircle.radius) / targetCircle.radius;
  const sizeScore = Math.max(0, 100 - (radiusDiff * 100));
  
  // Calculate final score - weight circularity more heavily
  const finalScore = (circularityScore * 0.6) + (positionScore * 0.2) + (sizeScore * 0.2);
  
  return Math.min(100, Math.max(0, finalScore));
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
