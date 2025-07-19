import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, Sparkles } from 'lucide-react';
import { useDailyReturnSystem } from '@/hooks/useDailyReturnSystem';
import { useToneSystem } from '@/hooks/useToneSystem';
import { getStreakMessage } from '@/utils/toneMessages';

interface DailyCompletionAnimationProps {
  score: number;
  onComplete?: () => void;
}

const DailyCompletionAnimation: React.FC<DailyCompletionAnimationProps> = ({ 
  score, 
  onComplete 
}) => {
  const { streak, streakReward, showCompletionAnimation } = useDailyReturnSystem();
  const { selectedTone } = useToneSystem();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (showCompletionAnimation) {
      setIsVisible(true);
      
      // Auto-hide after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [showCompletionAnimation, onComplete]);

  const getToneMessage = () => {
    return getStreakMessage(selectedTone, streak.current);
  };

  const getAnimationIcon = () => {
    if (streakReward) return <Trophy className="h-8 w-8 text-amber-500" />;
    if (streak.current >= 7) return <Flame className="h-8 w-8 text-orange-500" />;
    return <Sparkles className="h-8 w-8 text-blue-500" />;
  };

  const getBackgroundColor = () => {
    if (streakReward) return "from-amber-500/20 to-yellow-500/20";
    if (streak.current >= 7) return "from-orange-500/20 to-red-500/20";
    return "from-blue-500/20 to-cyan-500/20";
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className={`bg-gradient-to-br ${getBackgroundColor()} backdrop-blur-sm border border-border/20 rounded-lg p-8 mx-6 text-center max-w-sm`}
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            <motion.div
              className="mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", damping: 15 }}
            >
              {getAnimationIcon()}
            </motion.div>
            
            <motion.h2
              className="text-xl font-bold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Day {streak.current} Complete!
            </motion.h2>
            
            <motion.p
              className="text-sm text-muted-foreground mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {getToneMessage()}
            </motion.p>
            
            {streakReward && (
              <motion.div
                className="bg-amber-100 border border-amber-300 rounded-lg p-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-xs text-amber-800 font-medium">
                  🎉 {streakReward}
                </p>
              </motion.div>
            )}
            
            {/* Celebration particles */}
            {streak.current >= 3 && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                    initial={{ 
                      x: "50%", 
                      y: "50%",
                      opacity: 1,
                      scale: 0
                    }}
                    animate={{ 
                      x: `${50 + (Math.random() - 0.5) * 200}%`,
                      y: `${50 + (Math.random() - 0.5) * 200}%`,
                      opacity: 0,
                      scale: 1
                    }}
                    transition={{ 
                      duration: 1.5,
                      delay: 0.6 + i * 0.1,
                      ease: "easeOut"
                    }}
                  />
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DailyCompletionAnimation;