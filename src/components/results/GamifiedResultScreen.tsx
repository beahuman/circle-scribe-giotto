import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Info } from 'lucide-react';
import { GeometricSubscores } from '@/utils/scoring/geometricScoring';
import { usePlayerProgress } from '@/hooks/usePlayerProgress';
import { useLocalProgress } from '@/hooks/useLocalProgress';
import { useDailyChallenges } from '@/hooks/useDailyChallenges';
import { useSettings } from '@/hooks/useSettings';
import { useEvolvingScoreScreen } from '@/hooks/useEvolvingScoreScreen';
import CircleComparison from './CircleComparison';
import ScoreBreakdown from './ScoreBreakdown';
import MedalDisplay from './MedalDisplay';
import SimpleBadgeNotification from './SimpleBadgeNotification';
import FeedbackToneSelector from './FeedbackToneSelector';
import NeuroscienceModal from './NeuroscienceModal';
import EnhancedResultControls from './EnhancedResultControls';
import XpProgressBar from './XpProgressBar';
import EvolvingScoreDisplay from './EvolvingScoreDisplay';
import PostScoreProgressCTA from '../onboarding/PostScoreProgressCTA';
import { useProgressNudge } from '@/hooks/useProgressNudge';
import { useToast } from '@/hooks/use-toast';
import DailyChallengeResult from '../DailyChallengeResult';
import LogoHeader from '../common/LogoHeader';

interface GamifiedResultScreenProps {
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
  subscores?: GeometricSubscores | null;
}

type MedalType = 'none' | 'bronze' | 'silver' | 'gold';
type FeedbackTone = 'playful' | 'calm' | 'formal' | 'sarcastic';

const GamifiedResultScreen: React.FC<GamifiedResultScreenProps> = ({
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
  isDailyChallengeMode = false,
  subscores
}) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  const playerProgress = usePlayerProgress();
  const { stats } = useLocalProgress();
  const { todaysChallenge } = useDailyChallenges();
  const { settings, updateSettings } = useSettings();
  const { toast } = useToast();
  
  // Get evolving score screen data
  const evolution = useEvolvingScoreScreen(
    roundedAccuracy,
    difficultyLevel,
    isPenaltyMode,
    sessionRoundsPlayed
  );
  
  // Progress nudge system
  const { nudgeState, shouldShowProgressNudges, dismissPostScoreCTA } = useProgressNudge();
  
  const [progressResult, setProgressResult] = useState({ xpGained: 0, didLevelUp: false, newLevel: 1 });
  const [showAdvancedOverlay, setShowAdvancedOverlay] = useState(false);
  const [showNeuroscienceModal, setShowNeuroscienceModal] = useState(false);
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);

  // Get feedback tone from settings
  const feedbackTone: FeedbackTone = (settings.feedbackTone as FeedbackTone) || 'playful';

  // Determine medal based on score
  const getMedal = (score: number): MedalType => {
    if (score >= 90) return 'gold';
    if (score >= 75) return 'silver';
    if (score >= 60) return 'bronze';
    return 'none';
  };

  const medal = getMedal(roundedAccuracy);

  // Check for badge achievements
  useEffect(() => {
    if (!subscores) return; // Guard against null subscores
    
    const badges: string[] = [];
    
    // First perfect symmetry
    if (subscores.strokeDeviation >= 90) {
      badges.push('perfect_symmetry');
    }
    
    // Perfect alignment
    if (subscores.completionOffset >= 95) {
      badges.push('perfect_alignment');
    }
    
    // Smooth operator
    if (subscores.angularSmoothness >= 95) {
      badges.push('smooth_operator');
    }
    
    // Giotto master (overall 95%+)
    if (roundedAccuracy >= 95) {
      badges.push('giotto_master');
    }

    if (badges.length > 0) {
      setEarnedBadges(badges);
    }
  }, [subscores, roundedAccuracy, stats.achievements]);

  // Add XP and level up logic
  useEffect(() => {
    const result = playerProgress.addXp(roundedAccuracy);
    setProgressResult(result);
    
    if (result.didLevelUp && 'navigator' in window && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }, [roundedAccuracy, playerProgress]);

  // Handle badge notifications
  const handleBadgeComplete = () => {
    if (currentBadgeIndex < earnedBadges.length - 1) {
      setCurrentBadgeIndex(prev => prev + 1);
    } else {
      setEarnedBadges([]);
      setCurrentBadgeIndex(0);
    }
  };

  // Handle feedback tone change
  const handleToneChange = (tone: FeedbackTone) => {
    updateSettings({ feedbackTone: tone });
    setShowToneSelector(false);
    toast({
      title: "Feedback Style Updated",
      description: `Switched to ${tone} feedback style`,
      duration: 2000
    });
  };

  // Check if we should show daily challenge results
  const showDailyChallengeResult = isDailyChallengeMode && todaysChallenge;

  if (showDailyChallengeResult) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-start gap-6 p-6 pb-24 text-center overflow-y-auto max-h-[calc(100vh-4rem)]"
      >
        <DailyChallengeResult
          score={roundedAccuracy}
          targetScore={todaysChallenge.target_score}
          difficultyLevel={todaysChallenge.difficulty_level}
          onContinue={() => window.location.href = '/'}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-start gap-6 p-6 pb-24 text-center overflow-y-auto max-h-[calc(100vh-4rem)]"
    >
      {/* Logo Header */}
      <div className="w-full flex justify-center mt-4 mb-2">
        <LogoHeader size="small" />
      </div>
      {/* Badge Notifications */}
      {earnedBadges.length > 0 && (
        <SimpleBadgeNotification
          badgeId={earnedBadges[currentBadgeIndex]}
          onComplete={handleBadgeComplete}
        />
      )}

      {/* Feedback Tone Selector */}
      <FeedbackToneSelector
        isOpen={showToneSelector}
        onClose={() => setShowToneSelector(false)}
        currentTone={feedbackTone}
        onToneChange={handleToneChange}
      />

      {/* Neuroscience Educational Modal */}
      <NeuroscienceModal
        isOpen={showNeuroscienceModal}
        onClose={() => setShowNeuroscienceModal(false)}
        subscores={subscores}
      />

      {/* Animated Score Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-2 mt-4"
      >
        <h2 className="text-header bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Your Giotto Result
        </h2>
        <p className="text-caption">Precision. Practice. Perfection.</p>
      </motion.div>

      {/* Daily mode indicator */}
      {isDailyMode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-primary/10 border border-primary/20 rounded-xl p-3 max-w-sm"
        >
          <div className="flex items-center gap-2 justify-center text-primary">
            <Calendar className="h-4 w-4" />
            <span className="font-medium text-sm">Daily Calibration Complete</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Neural pathways strengthened. Return tomorrow!
          </p>
        </motion.div>
      )}

      {/* Evolving Score Display or Traditional Layout */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        {settings.adaptiveScoreScreen !== false ? (
          <EvolvingScoreDisplay
            accuracy={accuracy}
            difficultyLevel={difficultyLevel}
            isPenaltyMode={isPenaltyMode}
            sessionRoundsPlayed={sessionRoundsPlayed}
            subscores={subscores}
            feedbackTone={feedbackTone}
          />
        ) : (
          <>
            {/* Traditional Medal Display */}
            <MedalDisplay medal={medal} score={roundedAccuracy} />
            
            {/* Score Breakdown */}
            <ScoreBreakdown
              subscores={subscores}
              overallScore={roundedAccuracy}
              feedbackTone={feedbackTone}
            />
          </>
        )}
      </motion.div>

      {/* Circle Comparison with conditional advanced overlay */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <CircleComparison
          drawnPoints={drawnPoints}
          targetCircle={targetCircle}
          showAdvancedOverlay={evolution.effects.ghostTrailOverlay && showAdvancedOverlay}
          onToggleOverlay={() => setShowAdvancedOverlay(!showAdvancedOverlay)}
          subscores={subscores}
        />
      </motion.div>

      {/* XP Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.5 }}
      >
        <XpProgressBar 
          playerProgress={playerProgress}
          xpGained={progressResult.xpGained}
          didLevelUp={progressResult.didLevelUp}
          className="max-w-xs mx-auto"
        />
      </motion.div>

      {/* Educational Button */}
      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowNeuroscienceModal(true)}
        className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted/70 rounded-xl border transition-smooth"
      >
        <Info className="h-4 w-4" />
        <span className="text-sm">Learn Why This Matters</span>
      </motion.button>

      {/* Enhanced Result Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="w-full"
      >
        <EnhancedResultControls
          onReplay={onReplay}
          onViewStats={onViewStats}
          accuracy={roundedAccuracy}
          isDailyMode={isDailyMode}
          dailyCompleted={dailyCompleted}
          isPenaltyMode={isPenaltyMode}
          sessionRoundsPlayed={sessionRoundsPlayed}
        />
      </motion.div>

      {/* Progress Nudge CTA */}
      <PostScoreProgressCTA
        show={nudgeState.showPostScoreCTA && shouldShowProgressNudges()}
        onDismiss={dismissPostScoreCTA}
        gameCount={stats.totalGames}
      />
    </motion.div>
  );
};

export default GamifiedResultScreen;