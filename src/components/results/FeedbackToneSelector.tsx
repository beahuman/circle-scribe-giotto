import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Leaf, GraduationCap, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FeedbackToneSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  currentTone: 'playful' | 'calm' | 'formal' | 'sarcastic';
  onToneChange: (tone: 'playful' | 'calm' | 'formal' | 'sarcastic') => void;
}

const FeedbackToneSelector: React.FC<FeedbackToneSelectorProps> = ({
  isOpen,
  onClose,
  currentTone,
  onToneChange
}) => {
  const tones = [
    {
      id: 'playful' as const,
      icon: Heart,
      title: 'Playful & Encouraging',
      description: 'Fun, upbeat feedback with emojis and positive energy',
      example: "🎯 Your circle is so round, even compasses are jealous!",
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      id: 'calm' as const,
      icon: Leaf,
      title: 'Calm & Meditative',
      description: 'Peaceful, mindful feedback focused on growth and practice',
      example: "Excellent symmetry. Your spatial awareness is well-developed.",
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'formal' as const,
      icon: GraduationCap,
      title: 'Formal & Clinical',
      description: 'Scientific, analytical feedback with technical terminology',
      example: "Symmetry score: Exceptional. Demonstrates superior spatial-motor integration.",
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'sarcastic' as const,
      icon: Zap,
      title: 'Sarcastic & Brutal',
      description: 'Witty, challenging feedback with a humorous edge',
      example: "Wow, did you use a secret circle-drawing cheat code?",
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Choose Your Feedback Style</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          {tones.map((tone, index) => {
            const IconComponent = tone.icon;
            const isSelected = currentTone === tone.id;
            
            return (
              <motion.button
                key={tone.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onToneChange(tone.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected 
                    ? `${tone.borderColor} ${tone.bgColor} shadow-md` 
                    : 'border-border bg-background hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${tone.color} text-white flex-shrink-0`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm">{tone.title}</h3>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-primary rounded-full"
                        />
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {tone.description}
                    </p>
                    
                    <div className="mt-2 p-2 bg-muted/30 rounded text-caption">
                      "{tone.example}"
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground">
            You can change this anytime in the results screen
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackToneSelector;