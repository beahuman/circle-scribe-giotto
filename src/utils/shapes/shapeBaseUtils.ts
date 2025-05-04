
import { Point } from '@/types/shapes';

// Calculate distance between two points
export const distance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// Find the closest point in an array to a target point
export const findClosestPoint = (point: Point, points: Point[]): Point => {
  let minDistance = Infinity;
  let closestPoint = points[0];
  
  for (const p of points) {
    const d = distance(point, p);
    if (d < minDistance) {
      minDistance = d;
      closestPoint = p;
    }
  }
  
  return closestPoint;
};

// Calculate angle between three points (in radians)
export const angleBetween = (p1: Point, p2: Point, p3: Point): number => {
  const a = distance(p2, p3);
  const b = distance(p1, p3);
  const c = distance(p1, p2);
  
  // Law of cosines: cos(C) = (a² + b² - c²) / (2ab)
  return Math.acos((a*a + b*b - c*c) / (2 * a * b));
};

// Calculate the centroid of points
export const calculateCentroid = (points: Point[]): Point => {
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  
  return {
    x: sumX / points.length,
    y: sumY / points.length
  };
};

// Normalize points to center around origin with consistent scale
export const normalizePoints = (points: Point[]): Point[] => {
  const centroid = calculateCentroid(points);
  
  // Find max distance from centroid for scaling
  let maxDist = 0;
  for (const p of points) {
    const dist = distance(p, centroid);
    if (dist > maxDist) maxDist = dist;
  }
  
  // Normalize all points
  return points.map(p => ({
    x: (p.x - centroid.x) / (maxDist || 1),
    y: (p.y - centroid.y) / (maxDist || 1)
  }));
};
