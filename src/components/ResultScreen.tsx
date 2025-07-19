
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import AdBanner from './AdBanner';
import CircleVisualization from './results/CircleVisualization';
import FeedbackMessage from './results/FeedbackMessage';
import ResultControls from './results/ResultControls';
import XpProgressBar from './results/XpProgressBar';
import ScoreDisplay from './results/ScoreDisplay';
import ScientificFactCard from './results/ScientificFactCard';
import DetailedScoreDisplay from './results/DetailedScoreDisplay';
import CircleOverlay from './results/CircleOverlay';
import PersonalStats from './results/PersonalStats';
import { usePlayerProgress } from '@/hooks/usePlayerProgress';
import { useCosmetics } from '@/hooks/useCosmetics';
import { useImprovementCalculator } from './results/ImprovementCalculator';
import { useResultActions } from './results/useResultActions';
import { calculateGeometricScore, type GeometricSubscores } from '@/utils/circleUtils';
import { useLocalProgress } from '@/hooks/useLocalProgress';
import DailyChallengeResult from './DailyChallengeResult';
import { useDailyChallenges } from '@/hooks/useDailyChallenges';
import GamifiedResultScreen from './results/GamifiedResultScreen';
import LogoHeader from './common/LogoHeader';

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
  isDailyChallengeMode?: boolean;
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
  dailyCompleted = false,
  isDailyChallengeMode = false
}) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  const isGoodScore = roundedAccuracy >= 80;
  const playerProgress = usePlayerProgress();
  const { getEquippedValue } = useCosmetics();
  const { stats } = useLocalProgress();
  const { todaysChallenge } = useDailyChallenges();
  const [progressResult, setProgressResult] = useState({ xpGained: 0, didLevelUp: false, newLevel: 1 });
  const [showFactCard, setShowFactCard] = useState(false);
  const [subscores, setSubscores] = useState<GeometricSubscores | null>(null);
  
  // Get equipped cosmetics
  const backgroundStyle = getEquippedValue('background');
  const animationStyle = getEquippedValue('animation');
  
  // Calculate improvement using our custom hook
  const improvement = useImprovementCalculator(roundedAccuracy);
  
  // Handle actions like sharing and vibration feedback
  const { handleShare } = useResultActions(roundedAccuracy, difficultyLevel, isPenaltyMode);
  
  // Calculate detailed subscores
  useEffect(() => {
    if (drawnPoints.length > 0) {
      const geometricResult = calculateGeometricScore(
        drawnPoints,
        targetCircle,
        difficultyLevel,
        isPenaltyMode
      );
      setSubscores(geometricResult);
    }
  }, [drawnPoints, targetCircle, difficultyLevel, isPenaltyMode]);

  // Always use the gamified result screen
  if (drawnPoints && drawnPoints.length > 0) {
    return (
      <GamifiedResultScreen
        accuracy={accuracy}
        difficultyLevel={difficultyLevel}
        onReplay={onReplay}
        onViewStats={onViewStats}
        showLeaderboard={showLeaderboard}
        targetCircle={targetCircle}
        drawnPoints={drawnPoints}
        onBackToHome={onBackToHome}
        onRemoveAds={onRemoveAds}
        isPenaltyMode={isPenaltyMode}
        sessionRoundsPlayed={sessionRoundsPlayed}
        isDailyMode={isDailyMode}
        dailyCompleted={dailyCompleted}
        isDailyChallengeMode={isDailyChallengeMode}
        subscores={subscores}
      />
    );
  }

  // Show loading if no drawn points yet
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="text-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading results...</p>
      </div>
    </div>
  );
};

export default ResultScreen;
