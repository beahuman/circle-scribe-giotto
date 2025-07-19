export interface BrushStyle {
  id: string;
  name: string;
  description: string;
  unlockCondition: string;
  isUnlocked: (progress: any) => boolean;
  renderStroke: (
    ctx: CanvasRenderingContext2D,
    points: { x: number; y: number }[],
    strokeQuality: number,
    isComplete?: boolean
  ) => void;
  effectColor?: string;
  animationDuration?: number;
}

export interface BrushProgress {
  unlockedBrushes: string[];
  selectedBrush: string;
  brushUnlockNotifications: string[];
}