import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Award } from 'lucide-react';
import LogoAnimation from '../LogoAnimation';

interface OnboardingCompleteProps {
  onStartFirstDraw: () => void;
  selectedMode: 'practice' | 'daily' | null;
  tone: 'playful' | 'calm' | 'formal' | 'sarcastic';
}

const toneMessages = {
  playful: "Let's loop the loop!",
  calm: "Begin with a breath.",
  formal: "Commence motor assessment protocol.",
  sarcastic: "Time to see what all that thumb training was for."
};

const toneCTAs = {
  playful: "Start My First Draw!",
  calm: "Begin Practice",
  formal: "Initialize Assessment",
  sarcastic: "Prove My Worth"
};

const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  onStartFirstDraw,
  selectedMode,
  tone
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center space-y-4">
            <div className="w-[120px] mx-auto">
              <LogoAnimation />
            </div>
            
            <CardTitle className="text-xl font-bold">
              Let's Draw
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <p className="text-lg text-foreground">
              {toneMessages[tone]}
            </p>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You'll see a circle. Try to draw it freehand. You'll get feedback after.
              </p>
              
              {selectedMode && (
                <Badge variant="secondary" className="text-sm">
                  Starting with {selectedMode === 'practice' ? 'Practice Mode' : 'Daily Calibration'}
                </Badge>
              )}
            </div>
            
            <div className="space-y-4 pt-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={onStartFirstDraw}
                  className="w-full"
                  size="lg"
                >
                  {toneCTAs[tone]}
                </Button>
              </motion.div>
              
              <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                <Award className="w-4 h-4" />
                <span>First draw unlocks "Giotto Initiate" badge</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingComplete;