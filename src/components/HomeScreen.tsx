import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from './WelcomeScreen';
import DailyChallengeScreen from './DailyChallengeScreen';
import DailyCalibrationScreen from './calibration/DailyCalibrationScreen';
import OnboardingSequence from './OnboardingSequence';
import ProgressDashboard from './ProgressDashboard';
import HomeHeader from './home/HomeHeader';
import HomeActionButtons from './home/HomeActionButtons';
import HomeNavigationMenu from './home/HomeNavigationMenu';
import HomeFooter from './home/HomeFooter';
import AdRewardCenter from './ads/AdRewardCenter';
import { useSubscription } from '@/hooks/useSubscription';
import { useSettings } from '@/hooks/useSettings';
import { useToneSystem } from '@/hooks/useToneSystem';
import { useDailyCalibration } from '@/hooks/useDailyCalibration';
import { useLocalProgress } from '@/hooks/useLocalProgress';

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
  const { isPremium } = useSubscription();
  const { settings } = useSettings();
  const { streak, todaysCompletion } = useDailyCalibration();
  const { getMotivationalPhraseForTone, getActiveThemeStyles } = useToneSystem();
  const { stats } = useLocalProgress();
  const [showWelcome, setShowWelcome] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showDailyCalibration, setShowDailyCalibration] = useState(false);
  const [showDailyChallenge, setShowDailyChallenge] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const themeStyles = getActiveThemeStyles();

  // Check if user is new (no scores or streaks)
  const isNewUser = stats.totalGames === 0 && streak.current === 0;

  useEffect(() => {
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('onboardingCompleted');
    
    // Check if the user is returning from the game
    const returningFromGame = sessionStorage.getItem('returningFromGame');
    if (returningFromGame === 'true') {
      setShowWelcome(false);
      sessionStorage.removeItem('returningFromGame');
    } else if (!hasCompletedOnboarding) {
      // Show onboarding for new users
      setShowOnboarding(true);
      setShowWelcome(false);
    } else {
      // Show welcome screen briefly for returning users
      setTimeout(() => {
        setShowWelcome(false);
      }, 2000);
    }
  }, []);

  const handleStartDailyCalibration = () => {
    setShowDailyCalibration(true);
  };

  const handleStartDailyChallenge = () => {
    setShowDailyChallenge(true);
  };

  const handleStartChallengeGame = () => {
    setShowDailyChallenge(false);
    // Navigate to game with daily challenge mode
    window.location.href = '/?mode=daily-challenge';
  };

  // Show onboarding sequence for new users
  if (showOnboarding) {
    return (
      <OnboardingSequence 
        onComplete={() => setShowOnboarding(false)}
        onSkip={() => setShowOnboarding(false)}
      />
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
              sessionStorage.setItem('gameMode', 'daily-calibration');
              onStart();
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
          <motion.div 
            className="text-center space-y-4"
            variants={fadeVariants}
            transition={{ delay: 0.1 }}
          >
            <div className="w-[200px] mx-auto">
              <HomeHeader />
            </div>
            <motion.p 
              className={`font-light text-lg italic leading-relaxed ${themeStyles.accent}`}
              key={getMotivationalPhraseForTone()} // Re-animate when phrase changes
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {getMotivationalPhraseForTone()}
            </motion.p>
          </motion.div>

          {/* New User Guidance Banner */}
          {isNewUser && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-primary/10 border border-primary/20 rounded-lg p-4 text-center"
            >
              <p className="text-sm text-primary font-medium">
                Start with Daily Calibration to begin your motor mastery journey.
              </p>
            </motion.div>
          )}

          {/* Primary Mode CTAs */}
          <motion.div 
            className="space-y-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Practice Mode Card */}
            <motion.div variants={fadeVariants}>
              <button
                onClick={onStart}
                className="w-full bg-white border border-slate-200 rounded-xl p-6 text-left shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-800">Free Draw Practice</h3>
                  <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-slate-400 rounded-full"></div>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-2">No pressure. Improve your form.</p>
                {stats.lastAttempt !== null && (
                  <p className="text-xs text-slate-500">Last score: {stats.lastAttempt}%</p>
                )}
              </button>
            </motion.div>

            {/* Daily Calibration Card */}
            <motion.div variants={fadeVariants}>
              <button
                onClick={handleStartDailyCalibration}
                className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-left shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200 transform hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-blue-800">Daily Calibration</h3>
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                </div>
                <p className="text-sm text-blue-700 mb-2">One shot. Once a day.</p>
                {streak.current > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                      Day {streak.current} streak 🔥
                    </div>
                  </div>
                )}
                {todaysCompletion && (
                  <p className="text-xs text-blue-600 mt-1">
                    Today: {Math.round(todaysCompletion.accuracy)}% ✓
                  </p>
                )}
              </button>
            </motion.div>
          </motion.div>

          {/* Progress Preview Widget */}
          <motion.div 
            variants={fadeVariants}
            transition={{ delay: 0.3 }}
          >
            <button
              onClick={() => window.location.href = '/progress'}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-left hover:bg-slate-100 transition-colors duration-200"
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-slate-700">Your Progress</h4>
                <div className="text-slate-400">→</div>
              </div>
              <div className="flex items-center gap-4 text-xs text-slate-600">
                {todaysCompletion && (
                  <div className="flex items-center gap-1">
                    <span>Yesterday:</span>
                    <span className="text-lg">
                      {todaysCompletion.accuracy >= 90 ? '🥇' : 
                       todaysCompletion.accuracy >= 80 ? '🥈' : 
                       todaysCompletion.accuracy >= 70 ? '🥉' : '⚪'}
                    </span>
                  </div>
                )}
                {streak.current >= 3 && (
                  <div className="text-green-600">Next unlock: Blind Draw Mode</div>
                )}
              </div>
            </button>
          </motion.div>

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
          <motion.div 
            className="text-center pt-2"
            variants={fadeVariants}
            transition={{ delay: 0.6 }}
          >
            <p className="text-xs text-slate-400 italic">
              Fact: Your cerebellum gets smarter with every circle
            </p>
          </motion.div>

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default HomeScreen;