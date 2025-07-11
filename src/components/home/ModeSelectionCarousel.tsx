import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CircleDot, 
  Calendar, 
  EyeOff, 
  Target, 
  Infinity, 
  Shuffle,
  Lock,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useGameModes } from '@/hooks/useGameModes';
import { useModeUnlockSystem } from '@/hooks/useModeUnlockSystem';

interface ModeSelectionCarouselProps {
  onModeSelect: (mode: string) => void;
  onClose?: () => void;
}

const ModeSelectionCarousel: React.FC<ModeSelectionCarouselProps> = ({
  onModeSelect,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isUnlocked } = useModeUnlockSystem();

  const modes = [
    {
      id: 'practice',
      title: 'Free Practice',
      description: 'Perfect your circles at your own pace',
      icon: CircleDot,
      unlocked: true,
      color: 'primary',
      difficulty: 'Beginner'
    },
    {
      id: 'daily',
      title: 'Daily Calibration',
      description: 'Build consistency with daily neural training',
      icon: Calendar,
      unlocked: true,
      color: 'blue',
      difficulty: 'Standard'
    },
    {
      id: 'blind-draw',
      title: 'Blind Draw',
      description: 'Draw without visual feedback - pure memory',
      icon: EyeOff,
      unlocked: isUnlocked('blind-draw'),
      color: 'purple',
      difficulty: 'Advanced'
    },
    {
      id: 'offset',
      title: 'Offset Challenge',
      description: 'Adapt to unexpected target positions',
      icon: Target,
      unlocked: isUnlocked('offset'),
      color: 'orange',
      difficulty: 'Expert'
    },
    {
      id: 'perception-gauntlet',
      title: 'Perception Gauntlet',
      description: 'Visual processing under time pressure',
      icon: Shuffle,
      unlocked: isUnlocked('perception-gauntlet'),
      color: 'red',
      difficulty: 'Master'
    },
    {
      id: 'infinite',
      title: 'Infinite Mode',
      description: 'Endless practice with progressive difficulty',
      icon: Infinity,
      unlocked: isUnlocked('infinite-practice'),
      color: 'green',
      difficulty: 'Flow State'
    }
  ];

  const currentMode = modes[currentIndex];

  const nextMode = () => {
    setCurrentIndex((prev) => (prev + 1) % modes.length);
  };

  const prevMode = () => {
    setCurrentIndex((prev) => (prev - 1 + modes.length) % modes.length);
  };

  const handleModeSelect = () => {
    if (currentMode.unlocked) {
      onModeSelect(currentMode.id);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Standard': return 'bg-blue-100 text-blue-800';
      case 'Advanced': return 'bg-purple-100 text-purple-800';
      case 'Expert': return 'bg-orange-100 text-orange-800';
      case 'Master': return 'bg-red-100 text-red-800';
      case 'Flow State': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto space-y-6 p-4"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-header bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Choose Your Challenge
        </h2>
        <p className="text-caption">Select a drawing mode to begin</p>
      </div>

      {/* Mode Carousel */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className={`card-elevated ${!currentMode.unlocked ? 'opacity-75' : ''}`}>
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className={`p-3 rounded-full bg-${currentMode.color}-100`}>
                    {currentMode.unlocked ? (
                      <currentMode.icon className={`h-6 w-6 text-${currentMode.color}-600`} />
                    ) : (
                      <Lock className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <Badge className={getDifficultyColor(currentMode.difficulty)}>
                    {currentMode.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{currentMode.title}</CardTitle>
                <CardDescription className="text-sm">
                  {currentMode.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <Button
                  onClick={handleModeSelect}
                  disabled={!currentMode.unlocked}
                  className="w-full btn-game-primary"
                  size="lg"
                >
                  {currentMode.unlocked ? 'Start Drawing' : 'Locked'}
                </Button>
                
                {!currentMode.unlocked && (
                  <p className="text-xs text-muted-foreground text-center">
                    Complete more practice rounds to unlock
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevMode}
            className="transition-smooth hover:scale-110"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex gap-2">
            {modes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-smooth ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMode}
            className="transition-smooth hover:scale-110"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Close Button */}
      {onClose && (
        <Button
          onClick={onClose}
          variant="ghost"
          className="w-full text-muted-foreground"
        >
          Back to Home
        </Button>
      )}
    </motion.div>
  );
};

export default ModeSelectionCarousel;