
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WelcomeScreen from './WelcomeScreen';
import DailyCalibrationScreen from './DailyCalibrationScreen';
import ProgressDashboard from './ProgressDashboard';
import HomeHeader from './home/HomeHeader';
import HomeActionButtons from './home/HomeActionButtons';
import HomeNavigationMenu from './home/HomeNavigationMenu';
import HomeFooter from './home/HomeFooter';

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
  const [showWelcome, setShowWelcome] = useState(true);
  const [showDailyCalibration, setShowDailyCalibration] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  useEffect(() => {
    // Check if the user is returning from the game
    const returningFromGame = sessionStorage.getItem('returningFromGame');
    if (returningFromGame === 'true') {
      setShowWelcome(false);
      sessionStorage.removeItem('returningFromGame');
    } else {
      // Show welcome screen on first visit or refresh
      setTimeout(() => {
        setShowWelcome(false);
      }, 2000);
    }
  }, []);

  const handleStartDailyCalibration = () => {
    setShowDailyCalibration(true);
  };

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
        variants={fadeVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center gap-8 p-6 text-center min-h-screen bg-gradient-to-b from-primary/5 to-background"
      >
        <HomeHeader />

        <motion.div 
          className="flex flex-col gap-4 w-full max-w-xs"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div variants={fadeVariants}>
            <ProgressDashboard 
              isOpen={isDashboardOpen}
              onToggle={() => setIsDashboardOpen(!isDashboardOpen)}
            />
          </motion.div>

          <HomeActionButtons
            onStart={onStart}
            onStartDailyCalibration={handleStartDailyCalibration}
            showLeaderboard={showLeaderboard}
          />

          <HomeNavigationMenu isGuestMode={isGuestMode} />
        </motion.div>

        <HomeFooter />
      </motion.div>
    </AnimatePresence>
  );
};

export default HomeScreen;
