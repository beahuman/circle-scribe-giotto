import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LogoAnimation from '../LogoAnimation';

interface OnboardingWelcomeProps {
  onContinue: () => void;
}

const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({
  onContinue
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 shadow-elegant radius-modal">
          <CardHeader className="text-center space-y-grid">
            <div className="w-[120px] mx-auto relative">
              <LogoAnimation size={128} />
              {/* Animated brushstroke circle background */}
              <motion.div
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                transition={{ duration: 2, delay: 0.5 }}
                className="absolute inset-0 -z-10"
              >
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <motion.circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="1 4"
                    style={{ pathLength: 1 }}
                  />
                </svg>
              </motion.div>
            </div>
            
            <CardTitle className="text-header font-bold">
              I'm Giotto. Welcome.
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-grid text-center">
            <div className="space-y-4">
              <p className="text-body-lg text-foreground leading-relaxed">
                They say I once drew the perfect circle.
              </p>
              <p className="text-body-lg text-foreground leading-relaxed">
                You don't have to.
              </p>
              <p className="text-body-lg text-primary font-medium">
                We're here to find <em>your</em> perfect rhythm.
              </p>
            </div>
            
            <div className="pt-6">
              <Button 
                onClick={onContinue}
                className="w-full min-h-[56px] text-button"
                size="lg"
              >
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingWelcome;