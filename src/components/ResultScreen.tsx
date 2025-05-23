
import React, { useEffect, useState } from 'react';
import { Star } from "lucide-react";
import AdBanner from './AdBanner';
import CircleVisualization from './results/CircleVisualization';
import FeedbackMessage from './results/FeedbackMessage';
import ResultControls from './results/ResultControls';
import XpProgressBar from './results/XpProgressBar';
import { usePlayerProgress } from '@/hooks/usePlayerProgress';

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
  isPenaltyMode = false
}) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  const isGoodScore = roundedAccuracy >= 80;
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
  
  // Add haptic feedback on result screen load based on score
  useEffect(() => {
    if ('navigator' in window && 'vibrate' in navigator) {
      if (isGoodScore) {
        // Pleasing pulse pattern for good result
        navigator.vibrate([30, 20, 30]);
      }
    }
    
    // Track score history in local storage for progress visualization
    const scoreHistory = JSON.parse(localStorage.getItem('scoreHistory') || '[]');
    scoreHistory.push({
      score: roundedAccuracy,
      timestamp: Date.now(),
      difficulty: difficultyLevel,
      isPenalty: isPenaltyMode
    });
    // Keep last 100 scores
    if (scoreHistory.length > 100) scoreHistory.shift();
    localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
    
  }, [roundedAccuracy, isGoodScore, difficultyLevel, isPenaltyMode]);
  
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
  
  // Calculate improvement compared to average of last 5 scores
  const calculateImprovement = (): number | null => {
    try {
      const scoreHistory = JSON.parse(localStorage.getItem('scoreHistory') || '[]');
      if (scoreHistory.length <= 1) return null;
      
      const recentScores = scoreHistory.slice(-6, -1); // Last 5 excluding current
      if (recentScores.length === 0) return null;
      
      const avgRecentScore = recentScores.reduce((sum: number, item: any) => sum + item.score, 0) / recentScores.length;
      return roundedAccuracy - avgRecentScore;
    } catch (e) {
      return null;
    }
  };
  
  const improvement = calculateImprovement();
  
  return (
    <div className="flex flex-col items-center justify-start gap-6 animate-fade-in p-6 pb-24 text-center overflow-y-auto max-h-[calc(100vh-4rem)]">
      <div className="space-y-2 mt-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Your Result</h2>
        <p className="text-muted-foreground">How close were you to Giotto's perfection?</p>
      </div>
      
      {/* Circle visualization component with proper vertical space */}
      <div className="w-full my-8">
        <CircleVisualization 
          targetCircle={targetCircle}
          drawnPoints={drawnPoints}
          isGoodScore={isGoodScore}
        />
      </div>
      
      <div className="space-y-6 w-full mt-2">
        <div>
          <div className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 ${isGoodScore ? 'animate-pulse-slow' : ''}`}>
            {roundedAccuracy}%
          </div>
          
          {/* Neural reward: Show improvement compared to average */}
          {improvement !== null && Math.abs(improvement) > 1 && (
            <div className={`text-sm mt-1 ${improvement > 0 ? 'text-green-500' : 'text-orange-400'}`}>
              <span className="flex items-center justify-center gap-1">
                {improvement > 0 ? (
                  <>
                    <i className="ri-arrow-up-line"></i>
                    {improvement.toFixed(1)}% improvement
                  </>
                ) : (
                  <>
                    <i className="ri-arrow-down-line"></i>
                    {Math.abs(improvement).toFixed(1)}% below your average
                  </>
                )}
              </span>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-2 mt-2 text-sm">
            <Star className="h-4 w-4 text-primary animate-pulse" />
            <span className="text-muted-foreground">
              Difficulty Level: {difficultyLevel}%
            </span>
            <Star className="h-4 w-4 text-primary animate-pulse" />
          </div>
          
          {/* Penalty mode indicator */}
          {isPenaltyMode && (
            <div className="mt-2 px-3 py-1 bg-red-100 text-red-500 rounded-full text-sm font-medium inline-block animate-pulse-slow">
              Penalty Mode Active
            </div>
          )}
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
        
        {/* Feedback message */}
        <FeedbackMessage
          accuracy={roundedAccuracy}
          isPenaltyMode={isPenaltyMode}
          hasImproved={improvement !== null && improvement > 0}
        />
      </div>
      
      {/* Result controls */}
      <ResultControls
        onReplay={onReplay}
        showLeaderboard={showLeaderboard}
        onShare={handleShare}
        onRemoveAds={onRemoveAds}
        isPenaltyMode={isPenaltyMode}
        accuracy={roundedAccuracy}
        className="mt-6"
      />

      <AdBanner />
    </div>
  );
};

export default ResultScreen;
