import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Circle, Calendar, Lock, Target, Eye, Shuffle } from 'lucide-react';

interface OnboardingModesProps {
  onSelectMode: (mode: 'practice' | 'daily') => void;
  onSkip: () => void;
}

const modes = [
  {
    id: 'practice' as const,
    icon: Circle,
    title: 'Practice Mode',
    description: 'Freeform training, unlimited retries.',
    available: true,
    gradient: 'from-blue-500/20 to-blue-600/20'
  },
  {
    id: 'daily' as const,
    icon: Calendar,
    title: 'Daily Calibration',
    description: 'One draw a day. Track your neural progress.',
    available: true,
    gradient: 'from-green-500/20 to-green-600/20'
  },
  {
    id: 'blind-draw' as const,
    icon: Eye,
    title: 'Blind Draw',
    description: 'Draw without seeing your stroke.',
    available: false,
    gradient: 'from-purple-500/20 to-purple-600/20'
  },
  {
    id: 'offset' as const,
    icon: Target,
    title: 'Offset Mode',
    description: 'Reference circle placed off-center.',
    available: false,
    gradient: 'from-orange-500/20 to-orange-600/20'
  },
  {
    id: 'spiral' as const,
    icon: Shuffle,
    title: 'Spiral Mode',
    description: 'Advanced pattern recognition.',
    available: false,
    gradient: 'from-pink-500/20 to-pink-600/20'
  }
];

const OnboardingModes: React.FC<OnboardingModesProps> = ({
  onSelectMode,
  onSkip
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-lg"
      >
        <Card className="border-primary/20 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-xl font-bold">
              Modes of Mastery
            </CardTitle>
            <p className="text-muted-foreground">
              Choose your path to precision
            </p>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {modes.map((mode, index) => (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative overflow-hidden rounded-lg border p-4 ${
                    mode.available 
                      ? 'border-border hover:border-primary/50 cursor-pointer' 
                      : 'border-muted bg-muted/50'
                  }`}
                  onClick={() => mode.available && mode.id !== 'blind-draw' && mode.id !== 'offset' && mode.id !== 'spiral' && onSelectMode(mode.id)}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${mode.gradient} opacity-50`} />
                  
                  <div className="relative flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${mode.available ? 'bg-background' : 'bg-muted'}`}>
                      <mode.icon className={`w-5 h-5 ${mode.available ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <h3 className={`font-medium ${mode.available ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {mode.title}
                        </h3>
                        {!mode.available && (
                          <Badge variant="secondary" className="text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            Unlockable
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${mode.available ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                        {mode.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="space-y-3 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => onSelectMode('practice')}
                  variant="outline"
                  className="w-full"
                >
                  Start with Practice
                </Button>
                <Button 
                  onClick={() => onSelectMode('daily')}
                  className="w-full"
                >
                  Try Daily Calibration
                </Button>
              </div>
              
              <Button 
                variant="ghost" 
                onClick={onSkip}
                className="w-full text-muted-foreground hover:text-foreground"
              >
                Choose Later
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default OnboardingModes;