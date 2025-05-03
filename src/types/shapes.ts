
export type ShapeType = 'line' | 'triangle' | 'square';

export interface ShapeChallengeProps {
  shapeType: ShapeType;
  onComplete: (accuracy: number) => void;
  difficultyLevel: number;
  completedShapes: number;
  totalShapesRequired: number;
}

export interface TargetShape {
  points: Array<{ x: number; y: number }>;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}
