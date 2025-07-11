import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingWelcome from './onboarding/OnboardingWelcome';
import WhyCirclesContent from './onboarding/WhyCirclesContent';
import OnboardingModes from './onboarding/OnboardingModes';
import OnboardingToneSelector from './onboarding/OnboardingToneSelector';
import OnboardingComplete from './onboarding/OnboardingComplete';

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

  const handleSelectMode = (mode: 'practice' | 'daily') => {
    setSelectedMode(mode);
    nextStep();
  };

  const handleStartFirstDraw = () => {
    completeOnboarding();
    // Send user directly to Daily Calibration as specified in prompt
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
          <OnboardingWelcome
            onContinue={nextStep}
          />
        );
      case 1:
        return (
          <OnboardingToneSelector
            onSelectTone={handleSelectTone}
            onRandomize={handleRandomizeTone}
            onSkip={handleSkip}
          />
        );
      case 2:
        return (
          <OnboardingComplete
            onStartFirstDraw={handleStartFirstDraw}
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
        transition={{ duration: 0.4 }}
        className="w-full h-full"
      >
        {renderStep()}
      </motion.div>
    </AnimatePresence>
  );
};

export default OnboardingSequence;