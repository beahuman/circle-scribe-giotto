import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useFirstDrawTutorial = () => {
  const [isFirstDraw, setIsFirstDraw] = useState(() => {
    return !localStorage.getItem('hasCompletedFirstDraw');
  });
  
  const [tutorialStep, setTutorialStep] = useState<'anchor' | 'drawing' | 'score' | 'complete'>('anchor');
  const [hasRestarted, setHasRestarted] = useState(false);
  const { toast } = useToast();

  const completeFirstDraw = () => {
    localStorage.setItem('hasCompletedFirstDraw', 'true');
    setIsFirstDraw(false);
    setTutorialStep('complete');
    
    // Award first-time achievements
    toast({
      title: "🎨 Starter Stroke Unlocked!",
      description: "Your first brush has been added to your collection",
      duration: 4000,
    });
    
    // Mark brush as unlocked
    const unlockedBrushes = JSON.parse(localStorage.getItem('unlockedBrushes') || '["default"]');
    if (!unlockedBrushes.includes('starter')) {
      unlockedBrushes.push('starter');
      localStorage.setItem('unlockedBrushes', JSON.stringify(unlockedBrushes));
    }
  };

  const resetFirstDrawTutorial = () => {
    localStorage.removeItem('hasCompletedFirstDraw');
    setIsFirstDraw(true);
    setTutorialStep('anchor');
    setHasRestarted(false);
  };

  const allowRestart = () => {
    setHasRestarted(true);
  };

  const nextStep = () => {
    if (tutorialStep === 'anchor') {
      setTutorialStep('drawing');
    } else if (tutorialStep === 'drawing') {
      setTutorialStep('score');
    } else if (tutorialStep === 'score') {
      completeFirstDraw();
    }
  };

  return {
    isFirstDraw,
    tutorialStep,
    hasRestarted,
    completeFirstDraw,
    resetFirstDrawTutorial,
    allowRestart,
    nextStep,
    setTutorialStep
  };
};