
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import LogoAnimation from '../LogoAnimation';

interface OnboardingCompleteProps {
  onStartFirstDraw: () => void;
}

const OnboardingComplete: React.FC<OnboardingCompleteProps> = ({
  onStartFirstDraw
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
              <LogoAnimation size={128} />
            </div>
            
            <CardTitle className="text-xl font-bold">
              Try to match the perfect circle.
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6 text-center">
            <div className="space-y-4">
              <p className="text-lg text-foreground">
                One smooth stroke. No pressure.
              </p>
              <p className="text-lg text-primary font-medium">
                Your journey begins now.
              </p>
            </div>
            
            <div className="pt-6">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={onStartFirstDraw}
                  className="w-full"
                  size="lg"
                >
                  Begin Drawing
                </Button>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingComplete;
