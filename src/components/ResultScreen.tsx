
import React from 'react';
import { Star } from "lucide-react";
import AdBanner from './AdBanner';
import CircleVisualization from './results/CircleVisualization';
import FeedbackMessage from './results/FeedbackMessage';
import PenaltyModeInfo from './results/PenaltyModeInfo';
import ResultControls from './results/ResultControls';

interface ResultScreenProps {
  accuracy: number;
  difficultyLevel: number;
  onReplay: () => void;
  showLeaderboard?: () => void;
  targetCircle: { x: number; y: number; radius: number };
  drawnPoints: { x: number; y: number }[];
  onBackToHome?: () => void;
  onRemoveAds?: () => void;
  isPenaltyMode?: boolean;
  penaltyShapesRequired?: number;
  penaltyShapesCompleted?: number;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  accuracy,
  difficultyLevel,
  onReplay,
  showLeaderboard,
  targetCircle,
  drawnPoints,
  onBackToHome,
  onRemoveAds,
  isPenaltyMode = false,
  penaltyShapesRequired = 3,
  penaltyShapesCompleted = 0
}) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  const isGoodScore = roundedAccuracy >= 80;
  
  const handleShare = async () => {
    const shareText = `I drew a circle with ${roundedAccuracy}% accuracy in Giotto! Can you beat my score?`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Giotto Score',
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
        alert('Score and link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  return (
    <div className="flex flex-col items-center justify-start gap-6 animate-fade-in p-6 pb-24 text-center overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="space-y-2 mt-8 mb-4">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Your Result</h2>
        <p className="text-muted-foreground">How close were you to Giotto's perfection?</p>
      </div>
      
      {/* Circle visualization component with more vertical space */}
      <div className="my-8 w-full">
        <CircleVisualization 
          targetCircle={targetCircle}
          drawnPoints={drawnPoints}
          isGoodScore={isGoodScore}
        />
      </div>
      
      <div className="space-y-6 w-full mt-4">
        <div>
          <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
            {roundedAccuracy}%
          </div>
          <div className="flex items-center justify-center gap-2 mt-2 text-sm">
            <Star className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-muted-foreground">
              Difficulty Level: {difficultyLevel}%
            </span>
            <Star className="h-4 w-4 text-primary animate-pulse" />
          </div>
        </div>
        
        {/* Penalty mode information */}
        <PenaltyModeInfo
          isPenaltyMode={isPenaltyMode}
          penaltyShapesRequired={penaltyShapesRequired}
          penaltyShapesCompleted={penaltyShapesCompleted}
        />
        
        {/* Feedback message */}
        <FeedbackMessage
          accuracy={roundedAccuracy}
          isPenaltyMode={isPenaltyMode}
        />
      </div>
      
      {/* Result controls */}
      <ResultControls
        onReplay={onReplay}
        showLeaderboard={showLeaderboard}
        onShare={handleShare}
        onRemoveAds={onRemoveAds}
        isPenaltyMode={isPenaltyMode}
        className="mt-6"
      />

      <AdBanner />
    </div>
  );
};

export default ResultScreen;
