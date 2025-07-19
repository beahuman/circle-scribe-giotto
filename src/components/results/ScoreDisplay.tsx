
import React from 'react';
import { Star, Brain, Target, Zap, Trophy } from "lucide-react";
import { motion } from 'framer-motion';

interface ScoreDisplayProps {
  roundedAccuracy: number;
  difficultyLevel: number;
  improvement: number | null;
  isPenaltyMode: boolean;
  sessionRoundsPlayed: number;
  animationStyle: string;
  progressResult: {
    xpGained: number;
    didLevelUp: boolean;
    newLevel: number;
  };
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  roundedAccuracy,
  difficultyLevel,
  improvement,
  isPenaltyMode,
  sessionRoundsPlayed,
  animationStyle,
  progressResult
}) => {
  const isGoodScore = roundedAccuracy >= 80;
  
  // Get contextual score label and styling
  const getScoreContext = (score: number) => {
    if (score >= 90) {
      return {
        label: "Neuro-Mastery Zone",
        icon: Trophy,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        ringColor: "stroke-yellow-500"
      };
    } else if (score >= 80) {
      return {
        label: "Strong Coordination",
        icon: Zap,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        ringColor: "stroke-green-500"
      };
    } else if (score >= 60) {
      return {
        label: "Growing Control",
        icon: Target,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        ringColor: "stroke-blue-500"
      };
    } else {
      return {
        label: "Keep Practicing",
        icon: Brain,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        ringColor: "stroke-orange-500"
      };
    }
  };

  const scoreContext = getScoreContext(roundedAccuracy);
  const IconComponent = scoreContext.icon;
  
  return (
    <div className="space-y-6 w-full mt-2">
      <div>
        <div className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 ${isGoodScore ? animationStyle : ''}`}>
          {roundedAccuracy}%
        </div>
        
        {/* Contextual Score Label */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`flex items-center justify-center gap-2 mt-3 px-4 py-2 rounded-full ${scoreContext.bgColor} ${scoreContext.color} font-medium text-sm`}
        >
          <IconComponent className="h-4 w-4" />
          <span>{scoreContext.label}</span>
          
          {/* Subtle progress ring for visual reinforcement */}
          <div className="relative w-6 h-6 ml-1">
            <svg className="w-6 h-6 transform -rotate-90" viewBox="0 0 24 24">
              {/* Background circle */}
              <circle
                cx="12"
                cy="12"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="opacity-20"
              />
              {/* Progress circle */}
              <circle
                cx="12"
                cy="12"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeDasharray={`${(roundedAccuracy / 100) * 50.27} 50.27`}
                className={`transition-all duration-1000 ${scoreContext.ringColor}`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </motion.div>
        
        {/* Neural reward: Show improvement compared to average */}
        {improvement !== null && Math.abs(improvement) > 1 && (
          <div className={`text-sm mt-3 ${improvement > 0 ? 'text-green-500' : 'text-orange-400'}`}>
            <span className="flex items-center justify-center gap-1">
              {improvement > 0 ? (
                <>
                  <i className="ri-arrow-up-line"></i>
                  {improvement.toFixed(1)}% improvement
                </>
              ) : (
                <>
                  <i className="ri-arrow-down-line"></i>
                  {Math.abs(improvement).toFixed(1)}% below your average
                </>
              )}
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-center gap-2 mt-3 text-sm">
          <Star className="h-4 w-4 text-primary animate-pulse" />
          <span className="text-muted-foreground">
            Difficulty Level: {difficultyLevel}%
          </span>
          <Star className="h-4 w-4 text-primary animate-pulse" />
        </div>
        
        {/* Penalty mode indicator */}
        {isPenaltyMode && (
          <div className="mt-2 px-3 py-1 bg-red-100 text-red-500 rounded-full text-sm font-medium inline-block animate-pulse-slow">
            Penalty Mode Active
          </div>
        )}
        
        {/* Session rounds counter */}
        {sessionRoundsPlayed > 0 && (
          <div className="mt-2 text-sm text-muted-foreground">
            Rounds this session: <span className="font-medium">{sessionRoundsPlayed}</span>
          </div>
        )}
      </div>
      
      {/* Level up message */}
      {progressResult.didLevelUp && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-green-500 font-medium mt-2"
        >
          Leveled up to {progressResult.newLevel}!
        </motion.div>
      )}
    </div>
  );
};

export default ScoreDisplay;
