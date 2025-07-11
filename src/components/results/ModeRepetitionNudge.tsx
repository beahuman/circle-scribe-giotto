import React from 'react';
import { motion } from 'framer-motion';
import { Shuffle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToneSystem } from '@/hooks/useToneSystem';
import { GameModeType } from '@/hooks/useModeRepetitionNudge';

interface ModeRepetitionNudgeProps {
  show: boolean;
  onDismiss: () => void;
  currentMode: GameModeType;
  suggestedMode: GameModeType;
  suggestedModeDisplayName: string;
  onSwitchMode: (mode: GameModeType) => void;
  repetitionCount: number;
}

const ModeRepetitionNudge: React.FC<ModeRepetitionNudgeProps> = ({
  show,
  onDismiss,
  currentMode,
  suggestedMode,
  suggestedModeDisplayName,
  onSwitchMode,
  repetitionCount
}) => {
  const { selectedTone } = useToneSystem();

  if (!show) return null;

  const getMessageForTone = () => {
    const messages = {
      playful: {
        title: "Feeling confident? Let's mix it up! ✨",
        description: `You've mastered this ${repetitionCount} times. How about something twisty?`,
        buttonText: `Try ${suggestedModeDisplayName}!`
      },
      calm: {
        title: "Stillness is good. So is change.",
        description: `${suggestedModeDisplayName} reveals what's hidden beneath familiar patterns.`,
        buttonText: `Explore ${suggestedModeDisplayName}`
      },
      formal: {
        title: "Repetition detected. Consider a new challenge.",
        description: `You've completed this mode ${repetitionCount} consecutive times. Diversification recommended.`,
        buttonText: `Switch to ${suggestedModeDisplayName}`
      },
      sarcastic: {
        title: "You and this mode need a break.",
        description: `You're looping harder than the circle. Time for something different, maybe?`,
        buttonText: `Fine, try ${suggestedModeDisplayName}`
      }
    };
    
    return messages[selectedTone] || messages.playful;
  };

  const handleSwitchMode = () => {
    onSwitchMode(suggestedMode);
    onDismiss();
  };

  const message = getMessageForTone();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4 mt-4 relative"
    >
      {/* Dismiss button */}
      <button
        onClick={onDismiss}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/50 transition-colors"
      >
        <X className="h-4 w-4 text-muted-foreground" />
      </button>

      <div className="flex items-start gap-3 pr-8">
        {/* Icon with gentle animation */}
        <motion.div
          animate={{
            rotate: [0, -10, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mt-1"
        >
          <Shuffle className="h-5 w-5 text-amber-600" />
        </motion.div>

        <div className="flex-1 space-y-3">
          <div>
            <h4 className="font-medium text-amber-900">{message.title}</h4>
            <p className="text-sm text-amber-700 mt-1">{message.description}</p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSwitchMode}
              size="sm"
              className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white"
            >
              {message.buttonText}
            </Button>
            <Button
              onClick={onDismiss}
              variant="outline"
              size="sm"
              className="text-amber-600 border-amber-300 hover:bg-amber-50"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-amber-100 via-transparent to-orange-100 rounded-lg" />
      </div>
    </motion.div>
  );
};

export default ModeRepetitionNudge;