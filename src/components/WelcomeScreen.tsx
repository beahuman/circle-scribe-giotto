
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Trophy, ArrowLeft } from "lucide-react";
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
            className="absolute top-4 left-4"
            size="icon"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      <motion.div className="space-y-2" variants={fadeVariants}>
        <div className="w-[240px] mx-auto">
          <LogoAnimation size={160} />
        </div>
        <p className="text-muted-foreground">The art of the perfect circle</p>
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
          className="w-full"
          size="lg"
        >
          Begin
        </Button>
        
        {showLeaderboard && (
          <Button 
            onClick={showLeaderboard}
            variant="outline"
            className="w-full"
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
