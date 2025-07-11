import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useSettings } from '@/hooks/useSettings';
import { usePlayerProgress } from '@/hooks/usePlayerProgress';
import { useAdaptiveFeedback } from '@/hooks/useAdaptiveFeedback';

const ProgressHeader: React.FC = () => {
  const { settings } = useSettings();
  const { level, xpInCurrentLevel, xpForNextLevel } = usePlayerProgress();
  const { getAdaptiveMessage, adaptiveSettings } = useAdaptiveFeedback();

  const getWelcomeMessage = () => {
    const tone = settings.feedbackTone || 'meditative';
    const baseMessage = (() => {
      switch (tone) {
        case 'playful':
          return "You're getting dangerously round.";
        case 'formal':
          return "Neuro-performance summary";
        case 'sarcastic':
          return "Wow. You again.";
        default:
          return "Precision is earned with patience.";
      }
    })();
    
    return adaptiveSettings.enabled ? getAdaptiveMessage(baseMessage, 'motivation') : baseMessage;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-4"
    >
      <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-purple-400 rounded-full flex items-center justify-center mb-4">
        <TrendingUp className="h-8 w-8 text-white" />
      </div>
      
      <h1 className="text-header text-foreground">Your Progress</h1>
      <p className="text-description">{getWelcomeMessage()}</p>
      
      {/* Level & XP Display */}
      <Card className="bg-gradient-to-r from-primary/10 to-purple-400/10 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-label text-foreground">Level {level}</span>
            <span className="text-caption">{xpInCurrentLevel}/{xpForNextLevel} XP</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-primary to-purple-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(xpInCurrentLevel / xpForNextLevel) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProgressHeader;