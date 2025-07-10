import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useDailyCalibration } from '@/hooks/useDailyCalibration';
import { useDailyChallenges } from '@/hooks/useDailyChallenges';
import { useSessionStats } from '@/hooks/useSessionStats';
import { useSubscription } from '@/hooks/useSubscription';
import HomeHeader from './home/HomeHeader';
import HomeActionButtons from './home/HomeActionButtons';
import HomeNavigationMenu from './home/HomeNavigationMenu';
import OnboardingOverlay from './OnboardingOverlay';
import ProgressDashboard from './ProgressDashboard';
import DailyCalibrationScreen from './DailyCalibrationScreen';
import DailyChallengeScreen from './DailyChallengeScreen';
import SessionStatsView from './SessionStatsView';
import AdRewardCenter from './ads/AdRewardCenter';
import AdBanner from './AdBanner';

interface HomeScreenProps {
  onStart: () => void;
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
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const { 
    todayCompleted: hasCompletedCalibrationToday,
    recordDailyAccuracy
  } = useDailyCalibration();
  
  const { 
    todaysChallenge,
    completeChallenge,
    hasCompletedToday: hasCompletedChallengeToday 
  } = useDailyChallenges();
  
  const { sessionStats } = useSessionStats();
  
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showCalibration, setShowCalibration] = useState(false);
  const [showChallenge, setShowChallenge] = useState(false);
  const [showSessionStats, setShowSessionStats] = useState(false);

  useEffect(() => {
    // Check if user needs onboarding
    const needsOnboarding = !localStorage.getItem('hasSeenOnboarding') && !isGuestMode;
    if (needsOnboarding) {
      setShowOnboarding(true);
    }
  }, [isGuestMode]);

  const handleStartCalibration = () => {
    if (!hasCompletedCalibrationToday) {
      const calibration = startCalibration();
      if (calibration) {
        setShowCalibration(true);
      }
    }
  };

  const handleFinishCalibration = (averageScore: number) => {
    finishCalibration(averageScore);
    setShowCalibration(false);
    setShowSessionStats(true);
  };

  const handleStartDailyChallenge = () => {
    if (!hasCompletedChallengeToday) {
      const challenge = startChallenge();
      if (challenge) {
        setShowChallenge(true);
      }
    }
  };

  const handleFinishChallenge = (score: number) => {
    finishChallenge(score);
    setShowChallenge(false);
    setShowSessionStats(true);
  };

  if (showOnboarding) {
    return (
      <OnboardingOverlay 
        onComplete={() => {
          localStorage.setItem('hasSeenOnboarding', 'true');
          setShowOnboarding(false);
        }}
      />
    );
  }

  if (showCalibration && currentCalibration) {
    return (
      <DailyCalibrationScreen
        calibration={currentCalibration}
        onComplete={handleFinishCalibration}
        onExit={() => setShowCalibration(false)}
      />
    );
  }

  if (showChallenge && currentChallenge) {
    return (
      <DailyChallengeScreen
        challenge={currentChallenge}
        onComplete={handleFinishChallenge}
        onExit={() => setShowChallenge(false)}
      />
    );
  }

  if (showSessionStats) {
    const stats = getSessionStats();
    return (
      <SessionStatsView
        stats={stats}
        onContinue={() => setShowSessionStats(false)}
      />
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="home"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        exit="exit"
        className="container max-w-md mx-auto p-4 min-h-screen flex flex-col"
      >
        <div className="space-y-6">
          <HomeHeader />
          
          {!isPremium && (
            <motion.div
              variants={fadeVariants}
              initial="initial"
              animate="animate"
              transition={{ delay: 0.2 }}
            >
              <AdRewardCenter />
            </motion.div>
          )}
          
          <motion.div 
            className="space-y-4"
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.3 }}
          >
            <HomeActionButtons 
              onStart={onStart}
              onStartDailyCalibration={handleStartCalibration}
              onStartDailyChallenge={handleStartDailyChallenge}
              showLeaderboard={showLeaderboard}
            />
          </motion.div>

          <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4 }}
          >
            <ProgressDashboard 
              isOpen={false}
              onToggle={() => {}}
            />
          </motion.div>

          <motion.div
            variants={fadeVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.5 }}
          >
            <HomeNavigationMenu isGuestMode={isGuestMode} />
          </motion.div>
        </div>

        <div className="mt-auto pt-8">
          <AdBanner />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HomeScreen;