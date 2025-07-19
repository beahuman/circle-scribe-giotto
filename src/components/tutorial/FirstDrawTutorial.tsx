
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { useToneSystem } from '@/hooks/useToneSystem';
import DrawingCanvas from '@/components/DrawingCanvas';
import { generateRandomCirclePosition } from '@/utils/circleUtils';
import { Point } from '@/types/shapes';

interface FirstDrawTutorialProps {
  onComplete: () => void;
  onStartPractice: () => void;
  onStartDaily: () => void;
}

const FirstDrawTutorial: React.FC<FirstDrawTutorialProps> = ({
  onComplete,
  onStartPractice,
  onStartDaily
}) => {
  const [step, setStep] = useState<'anchor' | 'drawing' | 'score' | 'next'>('anchor');
  const [showInfoTooltip, setShowInfoTooltip] = useState(false);
  const [firstScore, setFirstScore] = useState<number | null>(null);
  const [targetCircle] = useState(generateRandomCirclePosition());
  const [allowRestart, setAllowRestart] = useState(false);
  
  const { selectedTone } = useToneSystem();

  const getToneMessage = (step: string) => {
    const messages = {
      anchor: {
        meditative: "Draw with intention.",
        playful: "Let's see what that thumb can do.",
        formal: "Begin the spatial accuracy task.",
        sarcastic: "Try to draw a circle. Or something vaguely round.",
        poetic: "The circle awaits your touch.",
        existential: "Round and round we go...",
        romantic: "Let your heart guide your hand."
      },
      score: {
        meditative: "This is the start of precision.",
        playful: "First try? Not bad at all.",
        formal: "Baseline motor control recorded.",
        sarcastic: "Could've been worse. Barely.",
        poetic: "Your first verse in the circle symphony.",
        existential: "A number. Does it matter?",
        romantic: "Every circle tells a story."
      }
    };
    
    return messages[step as keyof typeof messages]?.[selectedTone] || messages[step as keyof typeof messages]?.playful || '';
  };

  const handleDrawingComplete = (accuracy: number, points: Point[]) => {
    setFirstScore(Math.round(accuracy));
    setStep('score');
    setAllowRestart(true);
  };

  const handleTryAgain = () => {
    if (allowRestart) {
      setStep('anchor');
      setFirstScore(null);
      setAllowRestart(false);
    }
  };

  useEffect(() => {
    if (step === 'anchor') {
      const timer = setTimeout(() => {
        setStep('drawing');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (step === 'drawing') {
    return (
      <div className="relative h-screen w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-10"
        >
          <Card className="px-4 py-2 bg-background/90 backdrop-blur-sm">
            <p className="text-sm text-muted-foreground text-center">
              Your First Circle
            </p>
          </Card>
        </motion.div>

        <DrawingCanvas
          onComplete={handleDrawingComplete}
          onReturnToHome={() => {}}
          mode="tutorial"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <AnimatePresence mode="wait">
          {step === 'anchor' && (
            <motion.div
              key="anchor"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="text-center space-y-6"
            >
              <div className="relative">
                {/* Pulsing circle */}
                <motion.div
                  className="w-32 h-32 mx-auto border-2 border-primary rounded-full"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.6, 1, 0.6]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute inset-0 w-32 h-32 mx-auto border border-primary/30 rounded-full"
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.3, 0.8, 0.3]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                />
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-foreground">
                  {getToneMessage('anchor')}
                </h2>
                <p className="text-sm text-muted-foreground">
                  You'll see a circle, then try to draw it from memory
                </p>
              </div>
            </motion.div>
          )}

          {step === 'score' && firstScore !== null && (
            <motion.div
              key="score"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">
                  {firstScore}%
                </div>
                <p className="text-lg text-foreground mb-4">
                  {getToneMessage('score')}
                </p>
              </motion.div>

              <div className="space-y-2">
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Info className="w-4 h-4" />
                  <button
                    onClick={() => setShowInfoTooltip(!showInfoTooltip)}
                    className="underline hover:text-foreground transition-colors"
                  >
                    What does this mean?
                  </button>
                </div>

                <AnimatePresence>
                  {showInfoTooltip && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs text-muted-foreground bg-muted p-3 rounded-lg"
                    >
                      This number reflects how closely your circle matches the reference. 
                      It's based on shape, smoothness, and symmetry — all tied to your fine motor control.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3">
                {allowRestart && (
                  <Button
                    onClick={handleTryAgain}
                    variant="outline"
                    className="w-full"
                  >
                    Try Again
                  </Button>
                )}
                
                <div className="space-y-2">
                  <Button
                    onClick={() => setStep('next')}
                    className="w-full"
                  >
                    Continue
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {step === 'next' && (
            <motion.div
              key="next"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-foreground">
                  What's Next?
                </h3>
                <p className="text-sm text-muted-foreground">
                  Choose how you'd like to continue your circle journey
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={onStartPractice}
                  className="w-full"
                >
                  Practice Mode
                </Button>
                <Button
                  onClick={onStartDaily}
                  variant="outline"
                  className="w-full"
                >
                  Start Daily Calibration
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-1">
                <p>Practice improves both your control and your calm.</p>
                <p>One circle a day trains your brain in subtle ways.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FirstDrawTutorial;
