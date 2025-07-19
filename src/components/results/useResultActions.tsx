
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useResultActions = (
  roundedAccuracy: number,
  difficultyLevel: number,
  isPenaltyMode: boolean
) => {
  const { toast } = useToast();
  
  useEffect(() => {
    // Store score history 
    const scoreHistory = JSON.parse(localStorage.getItem('scoreHistory') || '[]');
    scoreHistory.push({
      score: roundedAccuracy,
      timestamp: Date.now(),
      difficulty: difficultyLevel,
      isPenalty: isPenaltyMode
    });
    // Keep last 100 scores
    if (scoreHistory.length > 100) scoreHistory.shift();
    localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
    
    // Add haptic feedback on result screen load based on score
    if ('navigator' in window && 'vibrate' in navigator) {
      const isGoodScore = roundedAccuracy >= 80;
      if (isGoodScore) {
        // Pleasing pulse pattern for good result
        navigator.vibrate([30, 20, 30]);
      }
    }
  }, [roundedAccuracy, difficultyLevel, isPenaltyMode]);
  
  const handleShare = async () => {
    const shareText = `I scored ${roundedAccuracy}% on Giotto! Can you draw a better circle?`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'My Giotto Score',
          text: shareText,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
        toast({
          title: 'Shared!',
          description: 'Score and link copied to clipboard!',
          duration: 3000
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };
  
  return { handleShare };
};
