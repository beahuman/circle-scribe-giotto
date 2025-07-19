
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
  ChevronRight,
  Trophy
} from 'lucide-react';
import { useGameModes } from '@/hooks/useGameModes';
import { useModeUnlockSystem } from '@/hooks/useModeUnlockSystem';
import { useLocalProgress } from '@/hooks/useLocalProgress';
import LogoHeader from '../common/LogoHeader';
import EnhancedModeCard from './EnhancedModeCard';

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
  const { gameResults } = useLocalProgress();

  const modes = [
    {
      id: 'practice',
      name: 'Free Practice',
      description: 'Perfect your circles at your own pace',
      icon: CircleDot,
      difficulty: 1,
      color: 'text-primary',
      bgGradient: 'bg-gradient-to-br from-primary/20 to-primary/5'
    },
    {
      id: 'daily',
      name: 'Daily Calibration',
      description: 'Build consistency with daily neural training',
      icon: Calendar,
      difficulty: 2,
      color: 'text-blue-500',
      bgGradient: 'bg-gradient-to-br from-blue-500/20 to-blue-500/5'
    },
    {
      id: 'blind-draw',
      name: 'Blind Draw',
      description: 'Draw without visual feedback - pure memory',
      icon: EyeOff,
      difficulty: 3,
      color: 'text-purple-500',
      bgGradient: 'bg-gradient-to-br from-purple-500/20 to-purple-500/5'
    },
    {
      id: 'offset',
      name: 'Offset Challenge',
      description: 'Adapt to unexpected target positions',
      icon: Target,
      difficulty: 4,
      color: 'text-orange-500',
      bgGradient: 'bg-gradient-to-br from-orange-500/20 to-orange-500/5'
    },
    {
      id: 'perception-gauntlet',
      name: 'Perception Gauntlet',
      description: 'Visual processing under time pressure',
      icon: Shuffle,
      difficulty: 5,
      color: 'text-red-500',
      bgGradient: 'bg-gradient-to-br from-red-500/20 to-red-500/5'
    },
    {
      id: 'infinite',
      name: 'Infinite Mode',
      description: 'Endless practice with progressive difficulty',
      icon: Infinity,
      difficulty: 6,
      color: 'text-green-500',
      bgGradient: 'bg-gradient-to-br from-green-500/20 to-green-500/5'
    }
  ];

  const currentMode = modes[currentIndex];
  
  // Get best score for current mode (simplified - in real app would filter by mode)
  const getBestScore = (modeId: string) => {
    if (gameResults.length === 0) return null;
    // In real implementation, filter by mode
    return Math.max(...gameResults.map(r => r.score));
  };

  const nextMode = () => {
    setCurrentIndex((prev) => (prev + 1) % modes.length);
  };

  const prevMode = () => {
    setCurrentIndex((prev) => (prev - 1 + modes.length) % modes.length);
  };

  const handleModeSelect = () => {
    if (isUnlocked(currentMode.id)) {
      onModeSelect(currentMode.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="w-full max-w-md mx-auto space-y-6 p-4"
    >
      {/* Logo Header */}
      <div className="flex justify-center mb-4">
        <LogoHeader size="small" />
      </div>
      
      {/* Header */}
      <div className="text-center space-y-6">
        <h2 className="text-header bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Choose Your Challenge
        </h2>
        <p className="text-description">Select a drawing mode to begin</p>
      </div>

      {/* Enhanced Mode Carousel */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <EnhancedModeCard
              mode={currentMode}
              onSelect={handleModeSelect}
              isLocked={!isUnlocked(currentMode.id)}
              bestScore={getBestScore(currentMode.id)}
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        <div className="flex justify-between items-center space-y-grid">
          <Button
            variant="ghost"
            size="icon"
            onClick={prevMode}
            className="transition-smooth hover:scale-110 min-h-[44px] min-w-[44px]"
          >
            <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
          </Button>
          
          <div className="flex gap-3">
            {modes.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 radius-icon transition-smooth ${
                  index === currentIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={nextMode}
            className="transition-smooth hover:scale-110 min-h-[44px] min-w-[44px]"
          >
            <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
          </Button>
        </div>
      </div>

      {/* Close Button */}
      {onClose && (
        <Button
          onClick={onClose}
          variant="ghost"
          className="w-full text-muted-foreground min-h-[44px]"
        >
          Back to Home
        </Button>
      )}
    </motion.div>
  );
};

export default ModeSelectionCarousel;
