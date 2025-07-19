
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
    <div className="space-y-4 w-full">
      <motion.div variants={fadeVariants}>
        <Button 
          onClick={onStart}
          className="w-full"
          size="lg"
        >
          Practice Mode
        </Button>
      </motion.div>
      
      <motion.div variants={fadeVariants}>
        <Button 
          onClick={onStartDailyCalibration}
          variant="outline"
          className="w-full"
          size="lg"
        >
          <Calendar className="mr-3 h-5 w-5" strokeWidth={1.5} />
          Daily Calibration
        </Button>
      </motion.div>
      
      <motion.div variants={fadeVariants}>
        <Button 
          onClick={onStartDailyChallenge}
          variant="outline"
          className="w-full"
          size="lg"
        >
          <Target className="mr-3 h-5 w-5" strokeWidth={1.5} />
          Daily Challenge
        </Button>
      </motion.div>
      
      {showLeaderboard && (
        <motion.div variants={fadeVariants}>
          <Button 
            onClick={showLeaderboard}
            variant="secondary"
            className="w-full"
          >
            <Trophy className="mr-3 h-5 w-5" strokeWidth={1.5} />
            Leaderboard
          </Button>
        </motion.div>
      )}
      
      {!isPremium && (
        <motion.div variants={fadeVariants}>
          <Button 
            onClick={() => setShowPremiumModal(true)}
            variant="premium"
            className="w-full"
          >
            <Crown className="mr-3 h-5 w-5" strokeWidth={1.5} />
            Get Premium
          </Button>
        </motion.div>
      )}
      
      <motion.div variants={fadeVariants}>
        <WhyCirclesModal onStartCalibration={onStartDailyCalibration}>
          <Button 
            variant="ghost"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            <Info className="mr-3 h-4 w-4" strokeWidth={1.5} />
            Why Circles?
          </Button>
        </WhyCirclesModal>
      </motion.div>
      
      <PremiumModal 
        open={showPremiumModal} 
        onOpenChange={setShowPremiumModal} 
      />
    </div>
  );
};

export default HomeActionButtons;
