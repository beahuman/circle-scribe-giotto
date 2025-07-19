
import React from 'react';
import { motion } from 'framer-motion';
import DrawingCanvas from '../DrawingCanvas';
import BlindDrawCanvas from '../BlindDrawCanvas';
import OffsetCanvas from '../canvas/OffsetCanvas';
import PerceptionGauntletCanvas from '../canvas/PerceptionGauntletCanvas';
import InfinitePracticeCanvas from '../canvas/InfinitePracticeCanvas';
import { Point } from '@/types/shapes';
import { useSettings } from '@/hooks/useSettings';

interface GameCanvasProps {
  isBlindDrawMode: boolean;
  isOffsetMode: boolean;
  isPerceptionGauntletMode: boolean;
  isInfinitePracticeMode: boolean;
  onComplete: (score: number, points: Point[]) => Promise<void>;
  targetCircle: { x: number; y: number; radius: number };
  difficultyLevel: number;
  inPenaltyMode: boolean;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  isBlindDrawMode,
  isOffsetMode,
  isPerceptionGauntletMode,
  isInfinitePracticeMode,
  onComplete,
  targetCircle,
  difficultyLevel,
  inPenaltyMode
}) => {
  const { settings } = useSettings();

  const adjustedDifficulty = inPenaltyMode ? Math.min(difficultyLevel + 20, 100) : difficultyLevel;

  if (isBlindDrawMode) {
    return (
      <BlindDrawCanvas 
        onComplete={onComplete}
        targetCircle={targetCircle}
      />
    );
  }

  if (isOffsetMode) {
    return (
      <OffsetCanvas 
        onComplete={onComplete}
        targetCircle={targetCircle}
        difficultyLevel={adjustedDifficulty}
        mirrorMode={settings.mirrorOffsetEnabled}
      />
    );
  }

  if (isPerceptionGauntletMode) {
    return (
      <PerceptionGauntletCanvas 
        onComplete={onComplete}
        targetCircle={targetCircle}
        difficultyLevel={adjustedDifficulty}
      />
    );
  }

  if (isInfinitePracticeMode) {
    return (
      <InfinitePracticeCanvas 
        targetCircle={targetCircle}
      />
    );
  }

  return (
    <DrawingCanvas 
      onComplete={(score, points) => onComplete(score, points)}
      onReturnToHome={() => {}}
      mode="normal"
    />
  );
};

export default GameCanvas;
