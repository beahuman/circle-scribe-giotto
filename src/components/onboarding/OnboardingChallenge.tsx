
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Circle, Eye, RotateCcw } from 'lucide-react';

interface OnboardingChallengeProps {
  onBeginFirstDraw: () => void;
}

const OnboardingChallenge: React.FC<OnboardingChallengeProps> = ({ onBeginFirstDraw }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="border-primary/20 shadow-elegant rounded-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">
              Your First Circle
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-left">
                <Eye className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground">
                  Watch the perfect circle appear for 3 seconds
                </p>
              </div>
              
              <div className="flex items-center gap-3 text-left">
                <Circle className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground">
                  Draw your circle in the same location
                </p>
              </div>
              
              <div className="flex items-center gap-3 text-left">
                <RotateCcw className="h-5 w-5 text-primary flex-shrink-0" />
                <p className="text-sm text-foreground">
                  See your accuracy score and improve with practice
                </p>
              </div>
            </div>
            
            <div className="relative">
              {/* Demo circle animation */}
              <motion.div
                className="w-24 h-24 mx-auto border-2 border-primary rounded-full"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: "easeInOut"
                }}
              />
              
              <motion.div
                className="absolute inset-0 w-24 h-24 mx-auto border-2 border-primary/40 rounded-full"
                initial={{ scale: 1, opacity: 0 }}
                animate={{ scale: 1.2, opacity: [0, 0.5, 0] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeOut"
                }}
              />
            </div>
            
            <Button 
              onClick={onBeginFirstDraw}
              className="w-full min-h-[56px] text-base"
              size="lg"
            >
              Begin First Draw
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingChallenge;
