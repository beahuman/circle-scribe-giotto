
import { ShapeType, TargetShape, Point } from '@/types/shapes';

export const generateTargetShape = (shapeType: ShapeType): TargetShape => {
  const canvasWidth = window.innerWidth;
  const canvasHeight = window.innerHeight - 70;
  
  // Calculate center of screen
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  
  // Size based on screen dimensions (smaller of width/height)
  const size = Math.min(canvasWidth, canvasHeight) * 0.3;
  
  let shapePoints: Array<Point> = [];
  
  switch (shapeType) {
    case 'line':
      // Horizontal line
      shapePoints = [
        { x: centerX - size/2, y: centerY },
        { x: centerX + size/2, y: centerY }
      ];
      break;
    case 'triangle':
      // Equilateral triangle
      const height = size * 0.866; // height of equilateral triangle: h = a * √3/2
      shapePoints = [
        { x: centerX, y: centerY - height/2 },
        { x: centerX - size/2, y: centerY + height/2 },
        { x: centerX + size/2, y: centerY + height/2 },
        { x: centerX, y: centerY - height/2 } // Close the path
      ];
      break;
    case 'square':
      // Square
      shapePoints = [
        { x: centerX - size/2, y: centerY - size/2 },
        { x: centerX + size/2, y: centerY - size/2 },
        { x: centerX + size/2, y: centerY + size/2 },
        { x: centerX - size/2, y: centerY + size/2 },
        { x: centerX - size/2, y: centerY - size/2 } // Close the path
      ];
      break;
  }
  
  return {
    points: shapePoints,
    width: size,
    height: size
  };
};
