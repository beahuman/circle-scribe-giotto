import { useCallback } from 'react';
import { Point } from '@/types/shapes';
import { useDailyCalibration } from './useDailyCalibration';
import { useBlindDrawMode } from './useBlindDrawMode';
import { useSessionStats } from './useSessionStats';

interface UseGameHandlersProps {
  isDailyMode: boolean;
  isDailyChallengeMode: boolean;
  isBlindDrawMode: boolean;
  handleDrawingComplete: (score: number, points: Point[]) => Promise<void>;
}

export const useGameHandlers = ({
  isDailyMode,
  isDailyChallengeMode,
  isBlindDrawMode,
  handleDrawingComplete
}: UseGameHandlersProps) => {
  const { recordDailyAccuracy } = useDailyCalibration();
  const { recordBlindDrawScore } = useBlindDrawMode();
  const { recordRound } = useSessionStats();

  const handleEnhancedDrawingComplete = useCallback(async (score: number, points: Point[]) => {
    // Record the round in session stats
    recordRound(score);
    
    // If in daily mode, record daily accuracy and prevent retries
    if (isDailyMode) {
      const success = recordDailyAccuracy(score);
      if (success) {
        console.log('Daily calibration recorded:', score);
      }
    }
    
    // If in daily challenge mode, handle completion differently
    if (isDailyChallengeMode) {
      console.log('Daily challenge completed:', score);
    }
    
    // If in blind draw mode, record blind draw score
    if (isBlindDrawMode) {
      recordBlindDrawScore(score);
      console.log('Blind draw score recorded:', score);
    }
    
    // Call the original handler
    await handleDrawingComplete(score, points);
  }, [isDailyMode, isDailyChallengeMode, isBlindDrawMode, recordDailyAccuracy, recordBlindDrawScore, recordRound, handleDrawingComplete]);

  return {
    handleEnhancedDrawingComplete
  };
};