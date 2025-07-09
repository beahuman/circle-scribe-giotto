import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ChevronLeft, Brain, Target, Zap, TrendingUp, Play, SkipForward } from 'lucide-react';
import OnboardingWelcome from './onboarding/OnboardingWelcome';
import OnboardingTutorial from './onboarding/OnboardingTutorial';
import OnboardingMetrics from './onboarding/OnboardingMetrics';
import OnboardingComplete from './onboarding/OnboardingComplete';

interface OnboardingSequenceProps {
  onComplete: () => void;
  onSkip: () => void;
}

export type OnboardingStep = 'welcome' | 'tutorial' | 'metrics' | 'complete';

const OnboardingSequence: React.FC<OnboardingSequenceProps> = ({ onComplete, onSkip }) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('welcome');
  const [completedSteps, setCompletedSteps] = useState<Set<OnboardingStep>>(new Set());

  const steps: OnboardingStep[] = ['welcome', 'tutorial', 'metrics', 'complete'];
  const currentIndex = steps.indexOf(currentStep);

  const markStepComplete = (step: OnboardingStep) => {
    setCompletedSteps(prev => new Set([...prev, step]));
  };

  const goToNext = () => {
    markStepComplete(currentStep);
    const nextIndex = currentIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    } else {
      handleComplete();
    }
  };

  const goToPrevious = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onComplete();
  };

  const handleSkip = () => {
    localStorage.setItem('onboardingCompleted', 'true');
    onSkip();
  };

  const getStepIcon = (step: OnboardingStep) => {
    switch (step) {
      case 'welcome': return Brain;
      case 'tutorial': return Play;
      case 'metrics': return Target;
      case 'complete': return TrendingUp;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <OnboardingWelcome onNext={goToNext} onSkip={handleSkip} />;
      case 'tutorial':
        return <OnboardingTutorial onNext={goToNext} onPrevious={goToPrevious} />;
      case 'metrics':
        return <OnboardingMetrics onNext={goToNext} onPrevious={goToPrevious} />;
      case 'complete':
        return <OnboardingComplete onComplete={handleComplete} onPrevious={goToPrevious} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background overflow-hidden">
      {/* Progress Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-lg font-semibold">Getting Started</h1>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <SkipForward className="h-4 w-4 mr-2" />
              Skip Tutorial
            </Button>
          </div>

          {/* Step Progress */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const StepIcon = getStepIcon(step);
              const isActive = step === currentStep;
              const isCompleted = completedSteps.has(step);
              const isAccessible = index <= currentIndex;

              return (
                <div key={step} className="flex items-center">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor: isCompleted 
                        ? 'hsl(var(--primary))' 
                        : isActive 
                          ? 'hsl(var(--primary))' 
                          : 'hsl(var(--muted))'
                    }}
                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      ${isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}
                    `}
                    onClick={() => isAccessible && setCurrentStep(step)}
                  >
                    <StepIcon className={`h-5 w-5 ${isActive || isCompleted ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  </motion.div>
                  
                  {index < steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-2 ${isCompleted ? 'bg-primary' : 'bg-muted'}`} />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-2 text-center">
            <Badge variant="outline">
              Step {currentIndex + 1} of {steps.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderCurrentStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            {currentStep === 'complete' ? 'Ready to start!' : `${currentIndex + 1} / ${steps.length}`}
          </div>

          <Button 
            onClick={currentStep === 'complete' ? handleComplete : goToNext}
          >
            {currentStep === 'complete' ? 'Start Drawing!' : 'Next'}
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingSequence;