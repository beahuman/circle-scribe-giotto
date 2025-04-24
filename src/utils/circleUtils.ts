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
  
  // Calculate variance in radius (circularity) - Now more strict
  let sumVariance = 0;
  for (const point of points) {
    const dx = point.x - centerX;
    const dy = point.y - centerY;
    const radius = Math.sqrt(dx * dx + dy * dy);
    sumVariance += Math.abs(radius - avgRadius) / avgRadius;
  }
  // Increased penalty for variance (multiplied by 200 instead of 100)
  const circularityScore = Math.max(0, 100 - (sumVariance / points.length * 200));
  
  // Calculate position accuracy - Now more strict
  const centerDistance = Math.sqrt(
    Math.pow(centerX - targetCircle.x, 2) + 
    Math.pow(centerY - targetCircle.y, 2)
  );
  // Increased penalty for position (multiplied by 100 instead of 50)
  const positionScore = Math.max(0, 100 - (centerDistance / targetCircle.radius * 100));
  
  // Calculate size accuracy - Now more strict
  const radiusDiff = Math.abs(avgRadius - targetCircle.radius) / targetCircle.radius;
  // Increased penalty for size difference (multiplied by 200 instead of 100)
  const sizeScore = Math.max(0, 100 - (radiusDiff * 200));
  
  // Adjusted weights to make perfect scores harder to achieve
  // Increased weight on circularity (0.7) and reduced tolerance for position and size
  const finalScore = (circularityScore * 0.7) + (positionScore * 0.15) + (sizeScore * 0.15);
  
  // Apply an additional overall penalty to make high scores harder to achieve
  return Math.min(100, Math.max(0, finalScore * 0.85));
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
