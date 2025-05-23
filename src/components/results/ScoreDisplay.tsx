
import React from 'react';
import { Star } from "lucide-react";
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
  
  return (
    <div className="space-y-6 w-full mt-2">
      <div>
        <div className={`text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 ${isGoodScore ? animationStyle : ''}`}>
          {roundedAccuracy}%
        </div>
        
        {/* Neural reward: Show improvement compared to average */}
        {improvement !== null && Math.abs(improvement) > 1 && (
          <div className={`text-sm mt-1 ${improvement > 0 ? 'text-green-500' : 'text-orange-400'}`}>
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
        
        <div className="flex items-center justify-center gap-2 mt-2 text-sm">
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
