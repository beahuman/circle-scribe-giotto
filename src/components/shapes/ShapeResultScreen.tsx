
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ShapeType, Point, TargetShape } from '@/types/shapes';
import { getShapeName } from './ShapeIcon';
import XpProgressBar from '../results/XpProgressBar';
import { usePlayerProgress } from '@/hooks/usePlayerProgress';
import ShapeVisualization from './ShapeVisualization';
import ShapeFeedback from './ShapeFeedback';
import NextStepMessage from './NextStepMessage';

interface ShapeResultScreenProps {
  accuracy: number;
  shapeType: ShapeType;
  onContinue: () => void;
  isLastShape: boolean;
  points: Point[];
  targetShape: TargetShape;
  goingToNextShape: boolean;
}

const ShapeResultScreen: React.FC<ShapeResultScreenProps> = ({
  accuracy,
  shapeType,
  onContinue,
  isLastShape,
  points,
  targetShape,
  goingToNextShape
}) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  const isPassing = roundedAccuracy >= 50;
  const playerProgress = usePlayerProgress();
  const [progressResult, setProgressResult] = useState({ xpGained: 0, didLevelUp: false, newLevel: 1 });
  
  // Add XP based on accuracy
  useEffect(() => {
    const result = playerProgress.addXp(roundedAccuracy);
    setProgressResult(result);
    
    // Show level-up toast if leveled up
    if (result.didLevelUp && 'navigator' in window && 'vibrate' in navigator) {
      // Celebratory vibration pattern for level up
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }, [roundedAccuracy]);
  
  return (
    <div className="flex flex-col items-center justify-center gap-6 animate-fade-in p-6 pb-24 text-center">
      <div className="space-y-2 mt-10">
        <h2 className="text-2xl font-bold">{getShapeName(shapeType)} Result</h2>
        <p className="text-muted-foreground">How well did you draw?</p>
      </div>
      
      {/* Visualization of the shape results */}
      <ShapeVisualization 
        points={points}
        isPassing={isPassing}
      />
      
      <div className="space-y-3">
        <div className="text-4xl font-bold text-primary">
          {roundedAccuracy}%
        </div>
        
        {/* XP Progress Bar */}
        <XpProgressBar 
          playerProgress={playerProgress}
          xpGained={progressResult.xpGained}
          didLevelUp={progressResult.didLevelUp}
          className="max-w-xs mx-auto mt-4"
        />
        
        {/* Level up message */}
        {progressResult.didLevelUp && (
          <div className="text-green-500 font-medium animate-fade-in mt-2">
            Leveled up to {progressResult.newLevel}!
          </div>
        )}
        
        <ShapeFeedback score={roundedAccuracy} shapeType={shapeType} />
        
        <NextStepMessage 
          isPassing={isPassing}
          isLastShape={isLastShape}
          shapeType={shapeType}
          goingToNextShape={goingToNextShape}
        />
      </div>
      
      <Button 
        onClick={onContinue}
        variant="premium"
        size="lg"
        className="px-8 py-6 text-lg rounded-full mt-4"
      >
        {isPassing ? (isLastShape ? "Back to Circle Drawing" : "Next Shape") : "Try Again"}
      </Button>
    </div>
  );
};

export default ShapeResultScreen;
