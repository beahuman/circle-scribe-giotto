
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
export const angleBetween = (p1: Point, p2: Point, p3: Point): number => {
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
export const measureJitter = (points: Point[]): number => {
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
export const evaluateRadialSymmetry = (points: Point[], center: Point): number => {
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
