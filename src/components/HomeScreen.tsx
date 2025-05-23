
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CircleDot, Trophy, Calendar, Settings, Info, Store, History, UserCircle } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import LogoAnimation from './LogoAnimation';
import WelcomeScreen from './WelcomeScreen';
import DailyCalibrationScreen from './DailyCalibrationScreen';
import ProgressDashboard from './ProgressDashboard';

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
        <motion.div 
          className="space-y-2"
          variants={fadeVariants}
          transition={{ delay: 0.1 }}
        >
          <div className="w-[240px] mx-auto">
            <LogoAnimation />
          </div>
          <p className="text-muted-foreground">The art of the perfect circle</p>
        </motion.div>

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

          <motion.div variants={fadeVariants}>
            <Button 
              onClick={onStart}
              className="px-8 py-6 text-lg rounded-full w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200"
            >
              Practice Mode
            </Button>
          </motion.div>
          
          <motion.div variants={fadeVariants}>
            <Button 
              onClick={handleStartDailyCalibration}
              variant="outline"
              className="px-8 py-6 text-lg rounded-full border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200"
            >
              <Calendar className="mr-2 h-5 w-5" />
              Daily Calibration
            </Button>
          </motion.div>
          
          {showLeaderboard && (
            <motion.div variants={fadeVariants}>
              <Button 
                onClick={showLeaderboard}
                variant="secondary"
                className="px-8 py-4 rounded-full w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200"
              >
                <Trophy className="mr-2 h-5 w-5" />
                Leaderboard
              </Button>
            </motion.div>
          )}

          {!isGuestMode && (
            <motion.div variants={fadeVariants}>
              <Button variant="ghost" className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200">
                <UserCircle className="mr-2 h-4 w-4" />
                Account
              </Button>
            </motion.div>
          )}

          <motion.div variants={fadeVariants}>
            <Button variant="ghost" className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </motion.div>

          <motion.div variants={fadeVariants}>
            <Button variant="ghost" className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200">
              <History className="mr-2 h-4 w-4" />
              History
            </Button>
          </motion.div>

          <motion.div variants={fadeVariants}>
            <Button variant="ghost" className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200">
              <Store className="mr-2 h-4 w-4" />
              Store
            </Button>
          </motion.div>

          <motion.div variants={fadeVariants}>
            <Button variant="ghost" className="justify-start w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200">
              <Info className="mr-2 h-4 w-4" />
              About
            </Button>
          </motion.div>
        </motion.div>

        <motion.p 
          className="text-xs text-muted-foreground"
          variants={fadeVariants}
          transition={{ delay: 0.3 }}
        >
          Crafted with passion by <a href="https://twitter.com/Nutlope" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">@Nutlope</a>
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default HomeScreen;
