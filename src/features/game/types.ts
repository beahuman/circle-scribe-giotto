
import { useToast } from "@/hooks/use-toast";
import { Point } from '@/types/shapes';
import { PenaltyShape } from "@/types/game";

export interface GameStateProps {
  setGameState: (state: 'showing' | 'drawing' | 'result' | 'penalty') => void;
  setAccuracy: (accuracy: number) => void;
  setDrawnPoints: (points: Point[]) => void;
  setSessionDrawings: (callback: (prev: number) => number) => void;
  setStreakCount: (callback: (prev: number) => number) => void;
  setConsecutiveLowScores: (callback: (prev: number) => number) => void;
  setTargetCircle: (circle: { x: number, y: number, radius: number }) => void;
  setDifficultyLevel: (difficulty: number) => void;
  setCurrentPenaltyShape: (shape: PenaltyShape) => void;
  setCompletedPenaltyShapes: (callback: (prev: number) => number) => void;
  submitScore: (score: number) => Promise<void>;
  toast: ReturnType<typeof useToast>['toast'];
  difficultyLevel: number;
  streakCount: number;
  sessionDrawings: number;
  consecutiveLowScores: number;
  completedPenaltyShapes: number;
  gameState: string;
  currentPenaltyShape: PenaltyShape;
}

export interface GameHandlers {
  handleCircleMemorized: () => void;
  handleDrawingComplete: (score: number, points: Point[]) => Promise<void>;
  handlePenaltyComplete: (score: number) => void;
  handleReplay: () => void;
  handleBypassMobile: () => void;
}
