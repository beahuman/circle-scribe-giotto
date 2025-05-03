
type Point = {
  x: number;
  y: number;
};

type ShapeType = 'line' | 'triangle' | 'square';

// Calculate distance between two points
const distance = (p1: Point, p2: Point): number => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

// Find the closest point in an array to a target point
const findClosestPoint = (point: Point, points: Point[]): Point => {
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
const angleBetween = (p1: Point, p2: Point, p3: Point): number => {
  const a = distance(p2, p3);
  const b = distance(p1, p3);
  const c = distance(p1, p2);
  
  // Law of cosines: cos(C) = (a² + b² - c²) / (2ab)
  return Math.acos((a*a + b*b - c*c) / (2 * a * b));
};

// Calculate the centroid of points
const calculateCentroid = (points: Point[]): Point => {
  const sumX = points.reduce((sum, p) => sum + p.x, 0);
  const sumY = points.reduce((sum, p) => sum + p.y, 0);
  
  return {
    x: sumX / points.length,
    y: sumY / points.length
  };
};

// Normalize points to center around origin with consistent scale
const normalizePoints = (points: Point[]): Point[] => {
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

// Evaluate how well a drawn shape matches a target shape
export const evaluateShape = (
  drawnPoints: Point[],
  targetPoints: Point[],
  shapeType: ShapeType
): number => {
  // Need minimum points for comparison
  if (drawnPoints.length < 2) return 0;
  
  // Special case for line
  if (shapeType === 'line') {
    return evaluateLine(drawnPoints);
  }
  
  // For more complex shapes (triangle, square)
  switch (shapeType) {
    case 'triangle': 
      return evaluateTriangle(drawnPoints);
    case 'square':
      return evaluateSquare(drawnPoints);
    default:
      return 0;
  }
};

// Evaluate straightness of a line
const evaluateLine = (points: Point[]): number => {
  // If too few points, can't evaluate
  if (points.length < 2) return 0;
  
  // Get start and end points
  const start = points[0];
  const end = points[points.length - 1];
  
  // Calculate theoretical straight line distance
  const lineLength = distance(start, end);
  
  // Calculate sum of all segment lengths in the drawn line
  let totalLength = 0;
  for (let i = 1; i < points.length; i++) {
    totalLength += distance(points[i-1], points[i]);
  }
  
  // Calculate straightness score (ratio of direct distance to total drawn distance)
  // A perfectly straight line would have a ratio of 1 (100%)
  const straightness = lineLength / totalLength;
  
  // Calculate deviation from straight line
  let totalDeviation = 0;
  for (let i = 1; i < points.length - 1; i++) {
    // Calculate distance from point to line formed by start and end points
    const lineParam = ((points[i].x - start.x) * (end.x - start.x) + 
                      (points[i].y - start.y) * (end.y - start.y)) / 
                      (Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    
    const closestPoint = {
      x: start.x + lineParam * (end.x - start.x),
      y: start.y + lineParam * (end.y - start.y)
    };
    
    totalDeviation += distance(points[i], closestPoint) / lineLength;
  }
  
  const deviationScore = Math.max(0, 1 - totalDeviation);
  
  // Combine scores 
  const finalScore = (straightness * 60 + deviationScore * 40) * 0.8; // 0.8 factor for higher difficulty
  
  // Return score as percentage (0-100)
  return Math.min(100, Math.max(0, finalScore));
};

// Evaluate triangle shape quality
const evaluateTriangle = (points: Point[]): number => {
  // We need some minimum number of points to evaluate
  if (points.length < 3) return 0;
  
  // Simplify the drawn shape to find vertices
  const simplifiedPoints = simplifyShape(points, 3);
  
  // Calculate angles of the triangle
  const angles = [];
  for (let i = 0; i < 3; i++) {
    const prev = simplifiedPoints[(i + 2) % 3];
    const curr = simplifiedPoints[i];
    const next = simplifiedPoints[(i + 1) % 3];
    
    const angle = angleBetween(prev, curr, next);
    angles.push(angle);
  }
  
  // An equilateral triangle has all angles equal to 60 degrees (π/3 radians)
  const idealAngle = Math.PI / 3;
  let angleDeviationScore = 0;
  
  for (const angle of angles) {
    angleDeviationScore += Math.abs(angle - idealAngle) / idealAngle;
  }
  
  angleDeviationScore = Math.max(0, 1 - (angleDeviationScore / 3));
  
  // Check if shape is closed
  const closureScore = distance(points[0], points[points.length - 1]) < 
                      distance(points[0], points[Math.floor(points.length / 2)]) * 0.3 ? 1 : 0.5;
  
  // Final score combines angle accuracy and closure
  const finalScore = (angleDeviationScore * 70 + closureScore * 30) * 0.8; // 0.8 factor for higher difficulty
  
  return Math.min(100, Math.max(0, finalScore));
};

// Evaluate square shape quality
const evaluateSquare = (points: Point[]): number => {
  // We need some minimum number of points to evaluate
  if (points.length < 4) return 0;
  
  // Simplify the drawn shape to find vertices
  const simplifiedPoints = simplifyShape(points, 4);
  
  // Calculate angles at each corner (should be 90° for a square)
  const angles = [];
  for (let i = 0; i < 4; i++) {
    const prev = simplifiedPoints[(i + 3) % 4];
    const curr = simplifiedPoints[i];
    const next = simplifiedPoints[(i + 1) % 4];
    
    const angle = angleBetween(prev, curr, next);
    angles.push(angle);
  }
  
  // A square has all angles equal to 90 degrees (π/2 radians)
  const idealAngle = Math.PI / 2;
  let angleDeviationScore = 0;
  
  for (const angle of angles) {
    angleDeviationScore += Math.abs(angle - idealAngle) / idealAngle;
  }
  
  angleDeviationScore = Math.max(0, 1 - (angleDeviationScore / 4));
  
  // Check if sides are equal length
  const sides = [];
  for (let i = 0; i < 4; i++) {
    const next = (i + 1) % 4;
    sides.push(distance(simplifiedPoints[i], simplifiedPoints[next]));
  }
  
  const avgSide = sides.reduce((sum, side) => sum + side, 0) / 4;
  let sideDeviationScore = 0;
  
  for (const side of sides) {
    sideDeviationScore += Math.abs(side - avgSide) / avgSide;
  }
  
  sideDeviationScore = Math.max(0, 1 - (sideDeviationScore / 4));
  
  // Check if shape is closed
  const closureScore = distance(points[0], points[points.length - 1]) < 
                      distance(points[0], points[Math.floor(points.length / 2)]) * 0.3 ? 1 : 0.5;
  
  // Final score combines angle accuracy, side equality, and closure
  const finalScore = (angleDeviationScore * 40 + sideDeviationScore * 40 + closureScore * 20) * 0.8; // 0.8 factor for higher difficulty
  
  return Math.min(100, Math.max(0, finalScore));
};

// Simplify a complex drawn shape to a smaller number of vertices
// Uses Ramer-Douglas-Peucker algorithm variation
const simplifyShape = (points: Point[], targetVertices: number): Point[] => {
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
const findCorners = (points: Point[], n: number): Point[] => {
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
