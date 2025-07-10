import { useState, useEffect } from 'react';

export const useOnboarding = () => {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(() => {
    return localStorage.getItem('giottoOnboardingCompleted') === 'true';
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedMode, setSelectedMode] = useState<'practice' | 'daily' | null>(null);
  
  const completeOnboarding = () => {
    localStorage.setItem('giottoOnboardingCompleted', 'true');
    setHasCompletedOnboarding(true);
  };
  
  const restartOnboarding = () => {
    localStorage.removeItem('giottoOnboardingCompleted');
    setHasCompletedOnboarding(false);
    setCurrentStep(0);
    setSelectedMode(null);
  };
  
  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };
  
  const skipOnboarding = () => {
    completeOnboarding();
  };
  
  return {
    hasCompletedOnboarding,
    currentStep,
    selectedMode,
    setSelectedMode,
    completeOnboarding,
    restartOnboarding,
    nextStep,
    skipOnboarding,
    setCurrentStep
  };
};