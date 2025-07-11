import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import WelcomeScreen from './WelcomeScreen';
import DailyChallengeScreen from './DailyChallengeScreen';
import DailyCalibrationScreen from './calibration/DailyCalibrationScreen';
import OnboardingSequence from './OnboardingSequence';
import HomeHeaderSection from './home/HomeHeaderSection';
import NewUserGuidance from './home/NewUserGuidance';
import DailyCalibrationCard from './home/DailyCalibrationCard';
import ProgressPreviewWidget from './home/ProgressPreviewWidget';
import NeuroscienceFactsFooter from './home/NeuroscienceFactsFooter';
import PracticeModesMenu from './home/PracticeModesMenu';
import HomeNavigationMenu from './home/HomeNavigationMenu';
import ModeSelectionCarousel from './home/ModeSelectionCarousel';
import AdRewardCenter from './ads/AdRewardCenter';
import DailyStreakReminder from './home/DailyStreakReminder';
import { useSubscription } from '@/hooks/useSubscription';
import { useDailyCalibration } from '@/hooks/useDailyCalibration';
import { useLocalProgress } from '@/hooks/useLocalProgress';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useToneSystem } from '@/hooks/useToneSystem';

interface HomeScreenProps {
  onStart: (mode?: string) => void;
  showLeaderboard?: () => void;
  isGuestMode?: boolean;
  onRemoveAds?: () => void;
}

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const HomeScreen: React.FC<HomeScreenProps> = ({ onStart, showLeaderboard, isGuestMode, onRemoveAds }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isPremium } = useSubscription();
  const { streak, todaysCompletion } = useDailyCalibration();
  const { getActiveThemeStyles } = useToneSystem();
  const { stats } = useLocalProgress();
  const { hasCompletedOnboarding } = useOnboarding();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showDailyCalibration, setShowDailyCalibration] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);

  // Get current view and mode from URL params
  const view = searchParams.get('view');
  const mode = searchParams.get('mode');

  const themeStyles = getActiveThemeStyles();

  // Check if user is new (no scores or streaks)
  const isNewUser = stats.totalGames === 0 && streak.current === 0;

  // Handle direct mode launch from URL params
  useEffect(() => {
    if (mode && mode !== 'modes') {
      onStart(mode);
      // Clear the mode param after launching
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('mode');
      setSearchParams(newParams, { replace: true });
    }
  }, [mode, onStart, searchParams, setSearchParams]);

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
    
    // Check if the user is returning from the game
    const returningFromGame = sessionStorage.getItem('returningFromGame');
    if (returningFromGame === 'true') {
      setShowWelcome(false);
      sessionStorage.removeItem('returningFromGame');
    } else if (!hasCompletedOnboarding) {
      // Onboarding will be handled by the hook
      setShowWelcome(false);
    } else {
      // Show welcome screen briefly for returning users
      setTimeout(() => {
        setShowWelcome(false);
      }, 2000);
    }
  }, []);

  const handleModeSelect = (selectedMode: string) => {
    onStart(selectedMode);
    // Clear view params
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('view');
    setSearchParams(newParams, { replace: true });
  };

  const handleCloseModal = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('view');
    setSearchParams(newParams, { replace: true });
  };

  const handleStartDailyCalibration = () => {
    setShowDailyCalibration(true);
  };

  const handleStartDailyChallenge = () => {
    setShowDailyChallenge(true);
  };

  const handleStartChallengeGame = () => {
    setShowDailyChallenge(false);
    // Navigate to game with daily challenge mode
    onStart('daily-challenge');
  };

  // Show onboarding sequence for new users
  if (!hasCompletedOnboarding) {
    return (
      <OnboardingSequence 
        onComplete={(selectedMode) => {
          // Navigate to the selected mode if one was chosen
          if (selectedMode === 'daily') {
            window.location.href = '/?daily=true';
          }
          // Otherwise stay on home screen for practice mode
        }}
      />
    );
  }

  // Show mode selection if view=modes
  if (view === 'modes') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="mode-selection"
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4 }}
          className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background"
        >
          <ModeSelectionCarousel
            onModeSelect={handleModeSelect}
            onClose={handleCloseModal}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (showDailyChallenge) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="daily-challenge"
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4 }}
        >
          <DailyChallengeScreen 
            onStartChallenge={handleStartChallengeGame}
            onBack={() => setShowDailyChallenge(false)}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (showDailyCalibration) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="daily-calibration"
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4 }}
        >
          <DailyCalibrationScreen 
            onStartCalibration={() => {
              setShowDailyCalibration(false);
              // Start game in calibration mode
              onStart('daily');
            }}
            onBack={() => setShowDailyCalibration(false)}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (showWelcome) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="welcome"
          variants={fadeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.4 }}
        >
          <WelcomeScreen 
            onStart={onStart} 
            showLeaderboard={showLeaderboard}
          />
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home"
        className={`min-h-screen ${themeStyles.background}`}
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-md mx-auto px-6 py-8 space-y-8">
          {/* Header Area with Logo and Dynamic Phrase */}
          <HomeHeaderSection />

          {/* Daily Streak Reminder */}
          <motion.div 
            variants={fadeVariants}
            transition={{ delay: 0.2 }}
          >
            <DailyStreakReminder />
          </motion.div>

          {/* New User Guidance Banner */}
          <NewUserGuidance isNewUser={isNewUser} />

          {/* Primary Mode CTAs */}
          <motion.div 
            className="space-y-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Practice Modes Menu */}
            <motion.div variants={fadeVariants}>
              <PracticeModesMenu
                onStartNormal={onStart}
                onStartBlindDraw={() => window.location.href = '/?mode=blind-draw'}
                onStartOffset={() => window.location.href = '/?mode=offset'}
                onStartGauntlet={() => window.location.href = '/?mode=perception-gauntlet'}
                onStartInfinitePractice={() => window.location.href = '/?mode=infinite-practice'}
              />
            </motion.div>

            {/* Daily Calibration Card */}
            <DailyCalibrationCard
              onStartCalibration={handleStartDailyCalibration}
              streak={streak}
              todaysCompletion={todaysCompletion}
            />
          </motion.div>

          {/* Progress Preview Widget */}
          <ProgressPreviewWidget todaysCompletion={todaysCompletion} />

          {/* Ad Reward Center for non-premium users */}
          {!isPremium && (
            <motion.div variants={fadeVariants} transition={{ delay: 0.4 }}>
              <AdRewardCenter />
            </motion.div>
          )}

          {/* Floating Bottom Actions */}
          <motion.div 
            className="flex items-center justify-center gap-6 pt-4"
            variants={fadeVariants}
            transition={{ delay: 0.5 }}
          >
            <HomeNavigationMenu isGuestMode={isGuestMode} />
          </motion.div>

          {/* Rotating Neuroscience Facts */}
          <NeuroscienceFactsFooter />

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HomeScreen;