
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, Target } from 'lucide-react';
import LogoAnimation from '../LogoAnimation';

interface OnboardingIntroProps {
  onContinue: () => void;
}

const OnboardingIntro: React.FC<OnboardingIntroProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 shadow-elegant rounded-xl">
          <CardHeader className="text-center space-y-6">
            <div className="w-[96px] mx-auto relative">
              <LogoAnimation size={96} />
              
              {/* Animated circle background */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.3 }}
                transition={{ duration: 1.5, delay: 0.3 }}
                className="absolute inset-0 -z-10"
              >
                <svg viewBox="0 0 96 96" className="w-full h-full">
                  <motion.circle
                    cx="48"
                    cy="48"
                    r="40"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                    strokeDasharray="3 6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 0.8 }}
                  />
                </svg>
              </motion.div>
            </div>
            
            <CardTitle className="text-xl font-bold">
              The Perfect Circle Challenge
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-left">
                <Brain className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground">
                  Drawing circles activates your motor cortex and strengthens hand-eye coordination
                </p>
              </div>
              
              <div className="flex items-center gap-3 text-left">
                <Target className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground">
                  Each attempt improves your precision and builds neural pathways
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-muted/20 rounded-lg">
              <p className="text-sm text-primary font-medium">
                "I once drew a perfect circle to prove my skill. You don't need perfection—just practice."
              </p>
              <p className="text-xs text-muted-foreground mt-1">— Giotto di Bondone</p>
            </div>
            
            <Button 
              onClick={onContinue}
              className="w-full min-h-[56px] text-base"
              size="lg"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingIntro;
