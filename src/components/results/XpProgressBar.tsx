
import React, { useEffect, useState } from 'react';
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
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const targetProgressPercentage = (playerProgress.xpInCurrentLevel / playerProgress.xpForNextLevel) * 100;
  
  // Calculate the previous XP state for smooth animation
  const previousXpInLevel = Math.max(0, playerProgress.xpInCurrentLevel - xpGained);
  const previousProgressPercentage = (previousXpInLevel / playerProgress.xpForNextLevel) * 100;
  
  useEffect(() => {
    // Delay the animation to allow other score animations to complete
    const animationTimer = setTimeout(() => {
      setIsAnimating(true);
      
      // Start from previous XP position
      setAnimatedProgress(previousProgressPercentage);
      
      // Animate to new position after a brief delay
      const progressTimer = setTimeout(() => {
        setAnimatedProgress(targetProgressPercentage);
      }, 100);
      
      // Mark animation as complete
      const completeTimer = setTimeout(() => {
        setIsAnimating(false);
      }, 800);
      
      return () => {
        clearTimeout(progressTimer);
        clearTimeout(completeTimer);
      };
    }, 600); // Wait for score animations to settle
    
    return () => clearTimeout(animationTimer);
  }, [targetProgressPercentage, previousProgressPercentage]);
  
  return (
    <div className={`space-y-1.5 w-full ${className}`}>
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary font-bold mr-2 text-sm ${didLevelUp ? 'animate-glow' : ''}`}>
            {playerProgress.level}
          </div>
          <span className="text-muted-foreground text-sm">Level</span>
        </div>
        
        <div>
          <span className={`text-sm ${xpGained > 0 && isAnimating ? 'text-primary animate-fade-in' : 'text-muted-foreground'}`}>
            +{xpGained} XP
          </span>
        </div>
      </div>
      
      <div className="relative">
        <Progress 
          value={animatedProgress} 
          className={`h-2 transition-all duration-700 ease-out ${didLevelUp ? 'animate-glow' : ''}`}
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
