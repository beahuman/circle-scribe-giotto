import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AdBanner from './AdBanner';
import CircleVisualization from './results/CircleVisualization';
import FeedbackMessage from './results/FeedbackMessage';
import ResultControls from './results/ResultControls';
import XpProgressBar from './results/XpProgressBar';
import ScoreDisplay from './results/ScoreDisplay';
import ScientificFactCard from './results/ScientificFactCard';
import { usePlayerProgress } from '@/hooks/usePlayerProgress';
import { useCosmetics } from '@/hooks/useCosmetics';
import { useImprovementCalculator } from './results/ImprovementCalculator';
import { useResultActions } from './results/useResultActions';

interface ResultScreenProps {
  accuracy: number;
  difficultyLevel: number;
  onReplay: () => void;
  onViewStats?: () => void;
  showLeaderboard?: () => void;
  targetCircle: { x: number; y: number; radius: number };
  drawnPoints: { x: number; y: number }[];
  onBackToHome?: () => void;
  onRemoveAds?: () => void;
  isPenaltyMode?: boolean;
  sessionRoundsPlayed?: number;
  isDailyMode?: boolean;
  dailyCompleted?: boolean;
}

const ResultScreen: React.FC<ResultScreenProps> = ({
  accuracy,
  difficultyLevel,
  onReplay,
  onViewStats,
  showLeaderboard,
  targetCircle,
  drawnPoints,
  onBackToHome,
  onRemoveAds,
  isPenaltyMode = false,
  sessionRoundsPlayed = 0,
  isDailyMode = false,
  dailyCompleted = false
}) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  const isGoodScore = roundedAccuracy >= 80;
  const playerProgress = usePlayerProgress();
  const { getEquippedValue } = useCosmetics();
  const [progressResult, setProgressResult] = useState({ xpGained: 0, didLevelUp: false, newLevel: 1 });
  const [showFactCard, setShowFactCard] = useState(false);
  
  // Get equipped cosmetics
  const backgroundStyle = getEquippedValue('background');
  const animationStyle = getEquippedValue('animation');
  
  // Calculate improvement using our custom hook
  const improvement = useImprovementCalculator(roundedAccuracy);
  
  // Handle actions like sharing and vibration feedback
  const { handleShare } = useResultActions(roundedAccuracy, difficultyLevel, isPenaltyMode);
  
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

  // Show scientific fact card after a brief delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowFactCard(true);
    }, 1500); // Show after 1.5 seconds to let user see their result first

    return () => clearTimeout(timer);
  }, []);

  const handleFactCardComplete = () => {
    setShowFactCard(false);
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className={`flex flex-col items-center justify-start gap-6 p-6 pb-24 text-center overflow-y-auto max-h-[calc(100vh-4rem)] ${backgroundStyle}`}
    >
      {/* Scientific Fact Card */}
      <ScientificFactCard 
        isVisible={showFactCard}
        onComplete={handleFactCardComplete}
      />

      <div className="space-y-2 mt-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Your Result</h2>
        <p className="text-muted-foreground">How close were you to Giotto's perfection?</p>
      </div>
      
      {/* Daily mode indicator */}
      {isDailyMode && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 max-w-sm">
          <div className="flex items-center gap-2 justify-center text-primary">
            <Calendar className="h-4 w-4" />
            <span className="font-medium text-sm">Daily Calibration Complete</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Neural pathways strengthened. Return tomorrow!
          </p>
        </div>
      )}
      
      {/* Circle visualization component with proper vertical space */}
      <div className="w-full my-8">
        <CircleVisualization 
          targetCircle={targetCircle}
          drawnPoints={drawnPoints}
          isGoodScore={isGoodScore}
          trailStyle={getEquippedValue('trail')}
        />
      </div>
      
      {/* Score display component */}
      <ScoreDisplay 
        roundedAccuracy={roundedAccuracy}
        difficultyLevel={difficultyLevel}
        improvement={improvement}
        isPenaltyMode={isPenaltyMode}
        sessionRoundsPlayed={sessionRoundsPlayed}
        animationStyle={animationStyle}
        progressResult={progressResult}
      />
      
      {/* XP Progress Bar */}
      <XpProgressBar 
        playerProgress={playerProgress}
        xpGained={progressResult.xpGained}
        didLevelUp={progressResult.didLevelUp}
        className="max-w-xs mx-auto mt-4"
      />
      
      {/* Feedback message */}
      <FeedbackMessage
        accuracy={roundedAccuracy}
        isPenaltyMode={isPenaltyMode}
        hasImproved={improvement !== null && improvement > 0}
      />
      
      {/* Result controls */}
      <ResultControls
        onReplay={onReplay}
        onViewStats={onViewStats}
        showLeaderboard={showLeaderboard}
        onShare={handleShare}
        onRemoveAds={onRemoveAds}
        isPenaltyMode={isPenaltyMode}
        accuracy={roundedAccuracy}
        sessionRoundsPlayed={sessionRoundsPlayed}
        isDailyMode={isDailyMode}
        dailyCompleted={dailyCompleted}
        className="mt-6"
      />

      <AdBanner />
    </motion.div>
  );
};

export default ResultScreen;
