import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import LogoAnimation from '../LogoAnimation';

interface OnboardingWelcomeProps {
  onContinue: () => void;
  onSkip: () => void;
  tone: 'playful' | 'calm' | 'formal' | 'sarcastic';
}

const toneMessages = {
  playful: "Draw circles. Get better. Repeat. You got this.",
  calm: "Precision is presence. Let's begin.",
  formal: "This app measures your spatial control. Begin when ready.",
  sarcastic: "So you think you can circle?"
};

const toneCTAs = {
  playful: "Start Onboarding",
  calm: "Continue in Silence",
  formal: "Begin Assessment",
  sarcastic: "Prove It"
};

const OnboardingWelcome: React.FC<OnboardingWelcomeProps> = ({
  onContinue,
  onSkip,
  tone
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="w-[160px] mx-auto">
              <LogoAnimation />
            </div>
            
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome to Giotto
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <p className="text-lg text-muted-foreground leading-relaxed">
              {toneMessages[tone]}
            </p>
            
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Sparkles className="w-4 h-4" />
              <span>Named after the master who drew the perfect circle</span>
              <Sparkles className="w-4 h-4" />
            </div>
            
            <div className="space-y-3 pt-4">
              <Button 
                onClick={onContinue}
                className="w-full"
                size="lg"
              >
                {toneCTAs[tone]}
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={onSkip}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Skip Introduction
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingWelcome;