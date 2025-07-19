import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToneSystem } from '@/hooks/useToneSystem';

interface ProgressPageTourProps {
  show: boolean;
  onComplete: () => void;
}

interface TourStep {
  id: string;
  target: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'left' | 'right';
}

const ProgressPageTour: React.FC<ProgressPageTourProps> = ({
  show,
  onComplete
}) => {
  const { selectedTone } = useToneSystem();
  const [currentStep, setCurrentStep] = useState(0);

  const getTourStepsForTone = (): TourStep[] => {
    const steps = {
      playful: [
        {
          id: 'streak',
          target: '[data-tour="streak-tracker"]',
          title: 'Your Daily Adventure! 🔥',
          description: 'This tracks how many days you\'ve been on your circle-drawing quest!',
          position: 'bottom' as const
        },
        {
          id: 'scores',
          target: '[data-tour="best-scores"]',
          title: 'Hall of Fame! 🏆',
          description: 'Your highest circle scores will show up here like trophies on a shelf.',
          position: 'top' as const
        },
        {
          id: 'identity',
          target: '[data-tour="visual-identity"]',
          title: 'Style Central! 🎨',
          description: 'Unlock cool themes and brushes as you keep practicing. Make it yours!',
          position: 'top' as const
        }
      ],
      calm: [
        {
          id: 'streak',
          target: '[data-tour="streak-tracker"]',
          title: 'Daily Consistency',
          description: 'This tracks your commitment to developing motor control through regular practice.',
          position: 'bottom' as const
        },
        {
          id: 'scores',
          target: '[data-tour="best-scores"]',
          title: 'Achievement Record',
          description: 'Your highest precision scores reflect your developing neuromuscular coordination.',
          position: 'top' as const
        },
        {
          id: 'identity',
          target: '[data-tour="visual-identity"]',
          title: 'Personal Expression',
          description: 'Themes and drawing styles unlock as you build skill and consistency.',
          position: 'top' as const
        }
      ],
      formal: [
        {
          id: 'streak',
          target: '[data-tour="streak-tracker"]',
          title: 'Consistency Metrics',
          description: 'Daily practice frequency indicator for motor skill development tracking.',
          position: 'bottom' as const
        },
        {
          id: 'scores',
          target: '[data-tour="best-scores"]',
          title: 'Performance Records',
          description: 'Maximum spatial accuracy scores demonstrating peak visuomotor performance.',
          position: 'top' as const
        },
        {
          id: 'identity',
          target: '[data-tour="visual-identity"]',
          title: 'Customization Module',
          description: 'Visual themes and interaction modalities unlocked through skill progression.',
          position: 'top' as const
        }
      ],
      sarcastic: [
        {
          id: 'streak',
          target: '[data-tour="streak-tracker"]',
          title: 'Your "Commitment" Counter',
          description: 'This tracks how many days you\'ve actually remembered to draw circles. Revolutionary.',
          position: 'bottom' as const
        },
        {
          id: 'scores',
          target: '[data-tour="best-scores"]',
          title: 'The Bragging Section',
          description: 'Your best scores will live here. You\'ve earned the right to show off... barely.',
          position: 'top' as const
        },
        {
          id: 'identity',
          target: '[data-tour="visual-identity"]',
          title: 'Pretty Colors & Brushes',
          description: 'Because apparently drawing circles wasn\'t exciting enough without decorations.',
          position: 'top' as const
        }
      ]
    };

    return steps[selectedTone] || steps.playful;
  };

  const tourSteps = getTourStepsForTone();

  useEffect(() => {
    if (show) {
      // Highlight the first step when tour starts
      highlightElement(tourSteps[0].target);
    }
  }, [show]);

  const highlightElement = (selector: string) => {
    // Remove previous highlights
    document.querySelectorAll('[data-tour-highlight]').forEach(el => {
      el.removeAttribute('data-tour-highlight');
    });

    // Add highlight to current element
    const element = document.querySelector(selector);
    if (element) {
      element.setAttribute('data-tour-highlight', 'true');
    }
  };

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      const nextStepIndex = currentStep + 1;
      setCurrentStep(nextStepIndex);
      highlightElement(tourSteps[nextStepIndex].target);
    } else {
      completeTour();
    }
  };

  const completeTour = () => {
    // Remove all highlights
    document.querySelectorAll('[data-tour-highlight]').forEach(el => {
      el.removeAttribute('data-tour-highlight');
    });
    onComplete();
  };

  const skipTour = () => {
    completeTour();
  };

  if (!show) return null;

  const currentTourStep = tourSteps[currentStep];

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={skipTour}
          />

          {/* Centered modal container */}
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-white rounded-lg shadow-xl border p-6 w-full max-w-sm max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-lg text-gray-900">
                  {currentTourStep.title}
                </h3>
                <button
                  onClick={skipTour}
                  className="p-1 rounded-full hover:bg-gray-100 transition-colors flex-shrink-0 ml-2"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {currentTourStep.description}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex space-x-1">
                  {tourSteps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentStep ? 'bg-primary' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={skipTour}
                  >
                    Skip
                  </Button>
                  <Button
                    size="sm"
                    onClick={nextStep}
                    className="flex items-center gap-1"
                  >
                    {currentStep === tourSteps.length - 1 ? 'Got it!' : 'Next'}
                    {currentStep < tourSteps.length - 1 && (
                      <ArrowRight className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}

      {/* Tour highlight styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          [data-tour-highlight="true"] {
            position: relative;
            z-index: 51;
            border-radius: 8px;
            border: 2px solid hsl(var(--primary));
            box-shadow: 0 0 0 2px hsl(var(--primary) / 0.3), 0 4px 12px -2px hsl(var(--primary) / 0.2);
            animation: tour-pulse 2s infinite;
          }
          
          @keyframes tour-pulse {
            0%, 100% {
              box-shadow: 0 0 0 2px hsl(var(--primary) / 0.3), 0 4px 12px -2px hsl(var(--primary) / 0.2);
            }
            50% {
              box-shadow: 0 0 0 4px hsl(var(--primary) / 0.2), 0 8px 20px -4px hsl(var(--primary) / 0.3);
            }
          }
        `
      }} />
    </AnimatePresence>
  );
};

export default ProgressPageTour;
