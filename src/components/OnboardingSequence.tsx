
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingIntro from './onboarding/OnboardingIntro';
import OnboardingWelcome from './onboarding/OnboardingWelcome';
import OnboardingToneSelector from './onboarding/OnboardingToneSelector';
import OnboardingChallenge from './onboarding/OnboardingChallenge';

interface OnboardingSequenceProps {
  onComplete: (selectedMode?: 'practice' | 'daily') => void;
}

const OnboardingSequence: React.FC<OnboardingSequenceProps> = ({ onComplete }) => {
  const { settings, updateSettings } = useSettings();
  const { 
    currentStep, 
    selectedMode, 
    setSelectedMode, 
    nextStep, 
    skipOnboarding, 
    completeOnboarding 
  } = useOnboarding();

  const handleSelectTone = (tone: 'playful' | 'calm' | 'formal' | 'sarcastic') => {
    updateSettings({ feedbackTone: tone });
    nextStep();
  };

  const handleRandomizeTone = () => {
    const tones: ('playful' | 'calm' | 'formal' | 'sarcastic')[] = ['playful', 'calm', 'formal', 'sarcastic'];
    const randomTone = tones[Math.floor(Math.random() * tones.length)];
    updateSettings({ feedbackTone: randomTone });
    nextStep();
  };

  const handleBeginFirstDraw = () => {
    completeOnboarding();
    // Start with daily calibration for new users
    onComplete('daily');
  };

  const handleSkip = () => {
    skipOnboarding();
    onComplete();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <OnboardingIntro
            onContinue={nextStep}
          />
        );
      case 1:
        return (
          <OnboardingWelcome
            onContinue={nextStep}
          />
        );
      case 2:
        return (
          <OnboardingToneSelector
            onSelectTone={handleSelectTone}
            onRandomize={handleRandomizeTone}
            onSkip={handleSkip}
          />
        );
      case 3:
        return (
          <OnboardingChallenge
            onBeginFirstDraw={handleBeginFirstDraw}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full h-full"
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingSequence;
