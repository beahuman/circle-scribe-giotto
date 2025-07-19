
import { Point } from '@/types/shapes';
import { distance, calculateCentroid } from './shapeBaseUtils';

// Simplify a complex drawn shape to a smaller number of vertices
// Uses Ramer-Douglas-Peucker algorithm variation
export const simplifyShape = (points: Point[], targetVertices: number): Point[] => {
  // If we have very few points, just return them
  if (points.length <= targetVertices) return points;
  
  // If the shape appears closed, we'll prefer to use a closing approach
  const isClosedShape = distance(points[0], points[points.length - 1]) < 
                        distance(points[0], points[Math.floor(points.length / 2)]) * 0.3;
  
  // For a closed shape like triangle or square, try to find corners
  if (isClosedShape && (targetVertices === 3 || targetVertices === 4)) {
    // Calculate centroid of all points
    const centroid = calculateCentroid(points);
    
    // Calculate distances from centroid to all points
    const distancesFromCenter = points.map(p => ({
      point: p,
      distance: distance(p, centroid)
    }));
    
    // Sort points by distance from centroid
    distancesFromCenter.sort((a, b) => b.distance - a.distance);
    
    // Take the top N furthest points as potential corners
    const potentialCorners = distancesFromCenter.slice(0, Math.min(points.length, targetVertices * 2))
                                              .map(d => d.point);
    
    // Now cluster these points to find the actual corners
    return findCorners(potentialCorners, targetVertices);
  }
  
  // For lines or other shapes, use a different approach
  // Find the two points furthest from each other as endpoints
  let maxDist = 0;
  let endpoints = [0, 0];
  
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const dist = distance(points[i], points[j]);
      if (dist > maxDist) {
        maxDist = dist;
        endpoints = [i, j];
      }
    }
  }
  
  // For a line, return the endpoints
  if (targetVertices === 2) {
    return [points[endpoints[0]], points[endpoints[1]]];
  }
  
  // For other shapes, recursively find points furthest from the line
  const result = [points[endpoints[0]], points[endpoints[1]]];
  
  // Simple implementation of finding significant points
  while (result.length < targetVertices) {
    // Find point furthest from any existing line segment
    let maxDist = 0;
    let bestPoint = points[0];
    let bestIdx = -1;
    
    for (let i = 0; i < points.length; i++) {
      let minDistToLine = Infinity;
      
      // Check distance to each line segment in result
      for (let j = 0; j < result.length - 1; j++) {
        const lineStart = result[j];
        const lineEnd = result[j + 1];
        
        // Calculate perpendicular distance to line segment
        const lineLength = distance(lineStart, lineEnd);
        if (lineLength === 0) continue;
        
        const t = ((points[i].x - lineStart.x) * (lineEnd.x - lineStart.x) + 
                 (points[i].y - lineStart.y) * (lineEnd.y - lineStart.y)) / (lineLength * lineLength);
        
        let dist;
        if (t < 0) {
          // Point is beyond the lineStart end of the line segment
          dist = distance(points[i], lineStart);
        } else if (t > 1) {
          // Point is beyond the lineEnd end of the line segment
          dist = distance(points[i], lineEnd);
        } else {
          // Point is within the line segment
          const projection = {
            x: lineStart.x + t * (lineEnd.x - lineStart.x),
            y: lineStart.y + t * (lineEnd.y - lineStart.y)
          };
          dist = distance(points[i], projection);
        }
        
        minDistToLine = Math.min(minDistToLine, dist);
      }
      
      // Check if this is the furthest point found so far
      if (minDistToLine > maxDist) {
        maxDist = minDistToLine;
        bestPoint = points[i];
        bestIdx = i;
      }
    }
    
    // Add the furthest point to our result
    result.push(bestPoint);
    
    // Sort result points based on their position in the original array
    // This helps maintain the drawing order
    result.sort((a, b) => {
      const aIdx = points.findIndex(p => p.x === a.x && p.y === a.y);
      const bIdx = points.findIndex(p => p.x === b.x && p.y === b.y);
      return aIdx - bIdx;
    });
  }
  
  return result;
};

// Find N corners in a set of points
export const findCorners = (points: Point[], n: number): Point[] => {
  if (points.length <= n) return points;
  
  // Use a simple clustering approach to find corners
  const cornerPoints: Point[] = [];
  
  // Sort points by angle from the center
  const centroid = calculateCentroid(points);
  const pointsByAngle = [...points].sort((a, b) => {
    const angleA = Math.atan2(a.y - centroid.y, a.x - centroid.x);
    const angleB = Math.atan2(b.y - centroid.y, b.x - centroid.x);
    return angleA - angleB;
  });
  
  // Divide the circle into n equal parts and take the best point from each section
  const angleStep = 2 * Math.PI / n;
  
  for (let i = 0; i < n; i++) {
    const startAngle = i * angleStep;
    const endAngle = (i + 1) * angleStep;
    
    let bestPoint: Point | null = null;
    let maxDist = 0;
    
    for (const point of pointsByAngle) {
      const angle = Math.atan2(point.y - centroid.y, point.x - centroid.x);
      const normalizedAngle = angle < 0 ? angle + 2 * Math.PI : angle;
      
      if (normalizedAngle >= startAngle && normalizedAngle < endAngle) {
        const dist = distance(point, centroid);
        if (dist > maxDist) {
          maxDist = dist;
          bestPoint = point;
        }
      }
    }
    
    if (bestPoint) {
      cornerPoints.push(bestPoint);
    }
  }
  
  // If we couldn't find enough corners with our approach, just take the furthest points
  if (cornerPoints.length < n) {
    return points.sort((a, b) => {
      return distance(b, centroid) - distance(a, centroid);
    }).slice(0, n);
  }
  
  return cornerPoints;
};
