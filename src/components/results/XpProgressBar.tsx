
import React from 'react';
import { Progress } from "@/components/ui/progress";
import { PlayerProgress } from '@/hooks/usePlayerProgress';

interface XpProgressBarProps {
  playerProgress: PlayerProgress;
  xpGained: number;
  didLevelUp: boolean;
  className?: string;
}

const XpProgressBar: React.FC<XpProgressBarProps> = ({
  playerProgress,
  xpGained,
  didLevelUp,
  className = ''
}) => {
  const progressPercentage = (playerProgress.xpInCurrentLevel / playerProgress.xpForNextLevel) * 100;
  
  return (
    <div className={`space-y-2 w-full ${className}`}>
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold mr-2 ${didLevelUp ? 'animate-glow' : ''}`}>
            {playerProgress.level}
          </div>
          <span className="text-muted-foreground">Level</span>
        </div>
        
        <div>
          <span className={`${xpGained > 0 ? 'text-primary animate-fade-in' : 'text-muted-foreground'}`}>
            +{xpGained} XP
          </span>
        </div>
      </div>
      
      <div className="relative">
        <Progress 
          value={progressPercentage} 
          className={`h-2 ${didLevelUp ? 'animate-glow' : ''}`}
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{playerProgress.xpInCurrentLevel} XP</span>
          <span>{playerProgress.xpForNextLevel} XP</span>
        </div>
      </div>
    </div>
  );
};

export default XpProgressBar;
