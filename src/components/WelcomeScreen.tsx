
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { CircleDot, Trophy, ArrowLeft } from "lucide-react";
import LogoAnimation from './LogoAnimation';

interface WelcomeScreenProps {
  onStart: () => void;
  showLeaderboard?: () => void;
  onBackToHome?: () => void;
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

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart, showLeaderboard, onBackToHome }) => {
  return (
    <motion.div 
      className="flex flex-col items-center justify-center gap-8 p-6 text-center"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {onBackToHome && (
        <motion.div variants={fadeVariants}>
          <Button 
            variant="ghost" 
            onClick={onBackToHome}
            className="absolute top-4 left-4 min-h-[48px] min-w-[48px]"
            size="icon"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      <motion.div className="space-y-2" variants={fadeVariants}>
        <div className="w-[240px] mx-auto">
          <LogoAnimation />
        </div>
        <p className="text-muted-foreground">The art of the perfect circle</p>
      </motion.div>
      
      <motion.div className="relative" variants={fadeVariants}>
        <div className="w-40 h-40 rounded-full border-4 border-primary opacity-50"></div>
        <CircleDot className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-primary" size={48} />
      </motion.div>
      
      <motion.div className="max-w-md space-y-4" variants={fadeVariants}>
        <p>
          Draw a perfect circle with your finger, just like the Renaissance master Giotto.
        </p>
        <ol className="text-left space-y-2 text-sm text-muted-foreground">
          <li>1. You'll be shown a perfect circle for 3 seconds</li>
          <li>2. Then try to recreate it in the same location</li>
          <li>3. Your accuracy will be calculated as a percentage</li>
        </ol>
      </motion.div>
      
      <motion.div className="flex flex-col gap-4 w-full max-w-xs" variants={fadeVariants}>
        <Button 
          onClick={onStart}
          className="px-8 py-6 text-lg rounded-full animate-pulse-slow min-h-[56px]"
        >
          Begin
        </Button>
        
        {showLeaderboard && (
          <Button 
            onClick={showLeaderboard}
            variant="outline"
            className="px-8 py-4 rounded-full min-h-[52px]"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Leaderboard
          </Button>
        )}
      </motion.div>
    </motion.div>
  );
};

export default WelcomeScreen;
