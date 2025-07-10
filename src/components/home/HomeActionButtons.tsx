
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, Target, Crown, Info } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import PremiumModal from "@/components/subscription/PremiumModal";
import WhyCirclesModal from "@/components/WhyCirclesModal";

interface HomeActionButtonsProps {
  onStart: () => void;
  onStartDailyCalibration: () => void;
  onStartDailyChallenge: () => void;
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
  onStartDailyChallenge,
  showLeaderboard
}) => {
  const { isPremium } = useSubscription();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  return (
    <>
      <motion.div variants={fadeVariants}>
        <Button 
          onClick={onStart}
          className="px-8 py-6 text-lg rounded-full w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200 min-h-[56px]"
        >
          Practice Mode
        </Button>
      </motion.div>
      
      <motion.div variants={fadeVariants}>
        <Button 
          onClick={onStartDailyCalibration}
          variant="outline"
          className="px-8 py-6 text-lg rounded-full border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200 min-h-[56px]"
        >
          <Calendar className="mr-2 h-5 w-5" />
          Daily Calibration
        </Button>
      </motion.div>
      
      <motion.div variants={fadeVariants}>
        <Button 
          onClick={onStartDailyChallenge}
          variant="outline"
          className="px-8 py-6 text-lg rounded-full border-2 border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/5 w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200 min-h-[56px]"
        >
          <Target className="mr-2 h-5 w-5" />
          Daily Challenge
        </Button>
      </motion.div>
      
      {showLeaderboard && (
        <motion.div variants={fadeVariants}>
          <Button 
            onClick={showLeaderboard}
            variant="secondary"
            className="px-8 py-4 rounded-full w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200 min-h-[52px]"
          >
            <Trophy className="mr-2 h-5 w-5" />
            Leaderboard
          </Button>
        </motion.div>
      )}
      
      {!isPremium && (
        <motion.div variants={fadeVariants}>
          <Button 
            onClick={() => setShowPremiumModal(true)}
            variant="outline"
            className="px-8 py-4 rounded-full w-full transform hover:scale-[1.02] active:scale-[0.98] active:brightness-90 transition-all duration-200 min-h-[52px] border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-purple-400/5"
          >
            <Crown className="mr-2 h-5 w-5 text-primary" />
            Get Premium
          </Button>
        </motion.div>
      )}
      
      {/* Why Circles? Button */}
      <motion.div variants={fadeVariants}>
        <WhyCirclesModal onStartCalibration={onStartDailyCalibration}>
          <Button 
            variant="ghost"
            className="px-6 py-3 rounded-full w-full text-slate-600 hover:text-slate-800 hover:bg-slate-100/50 transition-all duration-200 border border-slate-200/50 hover:border-slate-300/50"
          >
            <Info className="mr-2 h-4 w-4" />
            Why Circles?
          </Button>
        </WhyCirclesModal>
      </motion.div>
      
      <PremiumModal 
        open={showPremiumModal} 
        onOpenChange={setShowPremiumModal} 
      />
    </>
  );
};

export default HomeActionButtons;
