import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, TrendingUp, Award, Zap, Trophy, Target, Calendar } from 'lucide-react';
import { useEvolvingScoreScreen } from '@/hooks/useEvolvingScoreScreen';
import { GeometricSubscores } from '@/utils/scoring/geometricScoring';

interface EvolvingScoreDisplayProps {
  accuracy: number;
  difficultyLevel: number;
  isPenaltyMode?: boolean;
  sessionRoundsPlayed?: number;
  subscores?: GeometricSubscores | null;
  feedbackTone: 'playful' | 'calm' | 'formal' | 'sarcastic';
}

const EvolvingScoreDisplay: React.FC<EvolvingScoreDisplayProps> = ({
  accuracy,
  difficultyLevel,
  isPenaltyMode = false,
  sessionRoundsPlayed = 0,
  subscores,
  feedbackTone
}) => {
  const roundedAccuracy = Math.round(accuracy * 100) / 100;
  const evolution = useEvolvingScoreScreen(
    roundedAccuracy,
    difficultyLevel,
    isPenaltyMode,
    sessionRoundsPlayed
  );
  
  const [showCelebration, setShowCelebration] = useState(false);
  const [showUnlockNotification, setShowUnlockNotification] = useState(false);

  useEffect(() => {
    if (evolution.effects.celebrationBurst) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [evolution.effects.celebrationBurst]);

  useEffect(() => {
    if (evolution.achievements.recentUnlocks.length > 0) {
      setShowUnlockNotification(true);
      const timer = setTimeout(() => setShowUnlockNotification(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [evolution.achievements.recentUnlocks]);

  // Get contextual score styling
  const getScoreContext = (score: number) => {
    if (score >= 90) {
      return {
        label: "Neuro-Mastery Zone",
        icon: Trophy,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        ringColor: "stroke-yellow-500",
        gradient: "from-yellow-400 to-yellow-600"
      };
    } else if (score >= 80) {
      return {
        label: "Strong Coordination",
        icon: Zap,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        ringColor: "stroke-green-500",
        gradient: "from-green-400 to-green-600"
      };
    } else if (score >= 60) {
      return {
        label: "Growing Control",
        icon: Target,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        ringColor: "stroke-blue-500",
        gradient: "from-blue-400 to-blue-600"
      };
    } else {
      return {
        label: "Keep Practicing",
        icon: Star,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        ringColor: "stroke-orange-500",
        gradient: "from-orange-400 to-orange-600"
      };
    }
  };

  const scoreContext = getScoreContext(roundedAccuracy);
  const IconComponent = scoreContext.icon;

  return (
    <div className={`w-full space-y-6 ${evolution.effects.dimmedBackground ? 'opacity-75' : ''}`}>
      {/* Celebration Effects */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute inset-0 pointer-events-none"
          >
            {/* Burst particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: [0, 1, 0.5],
                  x: Math.cos(i * 30 * Math.PI / 180) * 100,
                  y: Math.sin(i * 30 * Math.PI / 180) * 100
                }}
                transition={{
                  duration: 2,
                  ease: "easeOut"
                }}
                className={`absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-gradient-to-r ${scoreContext.gradient}`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Score Display */}
      <div className="text-center space-y-4">
        {/* Personal Best Badge */}
        {evolution.achievements.isPersonalBest && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-full"
          >
            <Award className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium text-purple-600">Personal Best!</span>
          </motion.div>
        )}

        {/* Main Score with Effects */}
        <motion.div
          initial={evolution.effects.slideUpReveal ? { opacity: 0, y: 20 } : { opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative"
        >
          {/* Score Halo Effect */}
          {evolution.effects.scoreHalo && (
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${scoreContext.gradient} blur-xl opacity-30`}
            />
          )}
          
          <div className={`text-6xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent ${evolution.effects.scoreHalo ? 'animate-pulse' : ''}`}>
            {roundedAccuracy}%
          </div>
        </motion.div>

        {/* Contextual Score Label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full ${scoreContext.bgColor} ${scoreContext.color} font-medium text-sm`}
        >
          <IconComponent className="h-4 w-4" />
          <span>{scoreContext.label}</span>
          
          {/* Progress ring */}
          <div className="relative w-6 h-6 ml-1">
            <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
              <circle
                cx="12" cy="12" r="8"
                stroke="currentColor" strokeWidth="2" fill="none"
                className="opacity-20"
              />
              <motion.circle
                cx="12" cy="12" r="8"
                stroke="currentColor" strokeWidth="2" fill="none"
                strokeDasharray={`${(roundedAccuracy / 100) * 50.27} 50.27`}
                className={`transition-all duration-1000 ${scoreContext.ringColor}`}
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 50.27" }}
                animate={{ strokeDasharray: `${(roundedAccuracy / 100) * 50.27} 50.27` }}
                transition={{ delay: 0.5, duration: 1.5 }}
              />
            </svg>
          </div>
        </motion.div>

        {/* Streak Glow Effect */}
        {evolution.effects.streakGlow && evolution.achievements.streakDays > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full"
          >
            <Calendar className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-medium text-blue-600">
              {evolution.achievements.streakDays} day streak
            </span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-2 h-2 bg-blue-400 rounded-full"
            />
          </motion.div>
        )}

        {/* Performance Tracker (Advanced Users) */}
        {evolution.effects.performanceTracker && evolution.achievements.averageImprovement && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-2 text-sm text-green-600"
          >
            <TrendingUp className="h-4 w-4" />
            <span>{evolution.achievements.averageImprovement}</span>
          </motion.div>
        )}

        {/* Score Improvement Indicator */}
        {evolution.achievements.scoreImprovement !== null && Math.abs(evolution.achievements.scoreImprovement) > 5 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className={`text-sm font-medium ${evolution.achievements.scoreImprovement > 0 ? 'text-green-500' : 'text-orange-400'}`}
          >
            {evolution.achievements.scoreImprovement > 0 ? (
              <>↗ +{evolution.achievements.scoreImprovement.toFixed(1)}% from last attempt</>
            ) : (
              <>↘ {evolution.achievements.scoreImprovement.toFixed(1)}% from last attempt</>
            )}
          </motion.div>
        )}

        {/* Difficulty Level Indicator */}
        <div className="flex items-center justify-center gap-2 mt-3 text-sm">
          <Star className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-muted-foreground">
            Difficulty Level: {difficultyLevel}%
          </span>
          <Star className="h-4 w-4 text-primary animate-pulse" />
        </div>
      </div>

      {/* Unlock Notifications */}
      <AnimatePresence>
        {showUnlockNotification && evolution.achievements.recentUnlocks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                <Trophy className="h-6 w-6 text-purple-500" />
              </motion.div>
              <div>
                <h4 className="font-medium text-purple-700">Unlocked!</h4>
                <p className="text-sm text-purple-600">
                  {evolution.achievements.recentUnlocks.join(', ')}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EvolvingScoreDisplay;