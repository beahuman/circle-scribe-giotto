
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Calendar, Trophy } from "lucide-react";

interface HomeActionButtonsProps {
  onStart: () => void;
  onStartDailyCalibration: () => void;
  showLeaderboard?: () => void;
}

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const HomeActionButtons: React.FC<HomeActionButtonsProps> = ({
  onStart,
  onStartDailyCalibration,
  showLeaderboard
}) => {
  return (
    <>
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
          onClick={onStartDailyCalibration}
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
    </>
  );
};

export default HomeActionButtons;
