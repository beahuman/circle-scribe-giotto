
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
import ModeRepetitionNudge from './ModeRepetitionNudge';
import { useModeRepetitionNudge, GameModeType } from '@/hooks/useModeRepetitionNudge';
import { useSensoryFeedback } from '@/hooks/useSensoryFeedback';
import { useModeProgress } from '@/hooks/useModeProgress';

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
  const { triggerFeedback } = useSensoryFeedback();
  const { updateModeProgress } = useModeProgress();
  
  // Get evolving score screen data
  const evolution = useEvolvingScoreScreen(
    roundedAccuracy,
    difficultyLevel,
    isPenaltyMode,
    sessionRoundsPlayed
  );
  
  // Progress nudge system
  const { nudgeState, shouldShowProgressNudges, dismissPostScoreCTA, checkMilestoneForScore, triggerMilestoneCTA } = useProgressNudge();
  
  // Mode repetition nudge system
  const { 
    repetitionState, 
    trackModePlay, 
    shouldShowNudge, 
    markNudgeShown, 
    getSuggestedMode, 
    getModeDisplayName 
  } = useModeRepetitionNudge();
  
  const [progressResult, setProgressResult] = useState({ xpGained: 0, didLevelUp: false, newLevel: 1 });
  const [showAdvancedOverlay, setShowAdvancedOverlay] = useState(false);
  const [showNeuroscienceModal, setShowNeuroscienceModal] = useState(false);
  const [showToneSelector, setShowToneSelector] = useState(false);
  const [earnedBadges, setEarnedBadges] = useState<string[]>([]);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);

  // Get feedback tone from settings
  const feedbackTone: FeedbackTone = (settings.feedbackTone as FeedbackTone) || 'playful';

  // Determine current game mode
  const getCurrentMode = (): GameModeType => {
    if (isDailyMode) return 'daily';
    if (isDailyChallengeMode) return 'daily-challenge';
    if (isPenaltyMode) return 'penalty';
    // Check URL params for other modes
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    if (mode === 'blind-draw') return 'blind-draw';
    if (mode === 'shapes') return 'shapes';
    if (mode === 'infinite-practice') return 'infinite-practice';
    if (mode === 'offset') return 'offset';
    return 'practice'; // Default
  };

  const currentMode = getCurrentMode();

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
    
    // Update mode-specific progress
    updateModeProgress(currentMode, roundedAccuracy);
    
    // Trigger score reveal feedback after a brief delay for animation
    setTimeout(() => {
      triggerFeedback('score-reveal');
      
      // Additional feedback for high scores
      if (roundedAccuracy >= 85) {
        setTimeout(() => triggerFeedback('high-score'), 200);
      }
    }, 600); // Delay to match score animation
    
    if (result.didLevelUp && 'navigator' in window && 'vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }, [roundedAccuracy, playerProgress, triggerFeedback, updateModeProgress, currentMode]);

  // Check for milestone-based progress CTA triggers
  useEffect(() => {
    if (!shouldShowProgressNudges() || nudgeState.hasViewedProgress) return;
    
    const milestoneType = checkMilestoneForScore(roundedAccuracy);
    if (milestoneType) {
      triggerMilestoneCTA(milestoneType);
    }
  }, [roundedAccuracy, checkMilestoneForScore, triggerMilestoneCTA, shouldShowProgressNudges, nudgeState.hasViewedProgress]);

  // Track mode play for repetition detection
  useEffect(() => {
    trackModePlay(currentMode);
  }, [currentMode, trackModePlay]);

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

  // Handle mode switching from repetition nudge
  const handleSwitchMode = (newMode: GameModeType) => {
    const modeUrls = {
      'practice': '/',
      'daily': '/?mode=daily',
      'blind-draw': '/?mode=blind-draw',
      'shapes': '/?mode=shapes',
      'infinite-practice': '/?mode=infinite-practice',
      'offset': '/?mode=offset',
      'penalty': '/?mode=penalty',
      'daily-challenge': '/?mode=daily-challenge'
    };

    window.location.href = modeUrls[newMode] || '/';
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
      className="flex flex-col items-center justify-start min-h-screen px-4 py-6 pb-24 text-center overflow-y-auto max-w-sm mx-auto"
    >
      {/* Badge Notifications - Positioned absolutely to avoid layout shifts */}
      {earnedBadges.length > 0 && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <SimpleBadgeNotification
            badgeId={earnedBadges[currentBadgeIndex]}
            onComplete={handleBadgeComplete}
          />
        </div>
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

      {/* Logo Header */}
      <div className="w-full flex justify-center mb-3">
        <LogoHeader size="small" />
      </div>

      {/* Animated Score Section Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="space-y-2 w-full text-center mb-4"
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
          className="bg-primary/10 border border-primary/20 rounded-lg p-4 w-full mb-4"
        >
          <div className="flex items-center gap-2 justify-center text-primary">
            <Calendar className="h-4 w-4" />
            <span className="font-medium text-sm">Daily Calibration Complete</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Neural pathways strengthened. Return tomorrow!
          </p>
        </motion.div>
      )}

      {/* Main Content Container - Centered vertically in available space */}
      <div className="flex-1 flex flex-col justify-center w-full space-y-4 min-h-0">
        {/* Score Display Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-full flex flex-col items-center justify-center"
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
            <div className="space-y-4 w-full flex flex-col items-center">
              <MedalDisplay medal={medal} score={roundedAccuracy} />
              <ScoreBreakdown
                subscores={subscores}
                overallScore={roundedAccuracy}
                feedbackTone={feedbackTone}
              />
            </div>
          )}
        </motion.div>

        {/* Circle Comparison */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="w-full flex justify-center"
        >
          <CircleComparison
            drawnPoints={drawnPoints}
            targetCircle={targetCircle}
            showAdvancedOverlay={evolution.effects.ghostTrailOverlay && showAdvancedOverlay}
            onToggleOverlay={() => setShowAdvancedOverlay(!showAdvancedOverlay)}
            subscores={subscores}
          />
        </motion.div>

        {/* XP Progress Bar - Reduced gap from score */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="w-full flex justify-center"
        >
          <XpProgressBar 
            playerProgress={playerProgress}
            xpGained={progressResult.xpGained}
            didLevelUp={progressResult.didLevelUp}
            className="max-w-xs"
          />
        </motion.div>

        {/* Educational Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="w-full flex justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowNeuroscienceModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-muted/50 hover:bg-muted/70 rounded-lg border transition-smooth"
          >
            <Info className="h-4 w-4" />
            <span className="text-sm">Learn Why This Matters</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Bottom CTA Section - Fixed at bottom with proper spacing */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="w-full mt-8 px-4"
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

      {/* Progress Nudge CTA - Positioned independently */}
      <PostScoreProgressCTA
        show={nudgeState.showPostScoreCTA && shouldShowProgressNudges()}
        onDismiss={dismissPostScoreCTA}
        gameCount={stats.totalGames}
        milestoneType={nudgeState.milestoneType}
      />

      {/* Mode Repetition Nudge - Positioned independently */}
      {shouldShowNudge() && getSuggestedMode() && (
        <ModeRepetitionNudge
          show={shouldShowNudge()}
          onDismiss={markNudgeShown}
          currentMode={currentMode}
          suggestedMode={getSuggestedMode()!}
          suggestedModeDisplayName={getModeDisplayName(getSuggestedMode()!)}
          onSwitchMode={handleSwitchMode}
          repetitionCount={repetitionState.repetitionCount}
        />
      )}
    </motion.div>
  );
};

export default GamifiedResultScreen;
