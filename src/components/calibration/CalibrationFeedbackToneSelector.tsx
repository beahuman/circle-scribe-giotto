import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Leaf, GraduationCap, Zap } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSettings } from '@/hooks/useSettings';

interface CalibrationFeedbackToneSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

const CalibrationFeedbackToneSelector: React.FC<CalibrationFeedbackToneSelectorProps> = ({
  isOpen,
  onClose
}) => {
  const { settings, updateSettings } = useSettings();
  const currentTone = settings.feedbackTone || 'playful';

  const tones = [
    {
      id: 'playful' as const,
      icon: Heart,
      title: 'Fun & Encouraging',
      description: 'Playful, upbeat feedback with positive energy',
      example: "Your motor control is awakening beautifully!",
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      id: 'calm' as const,
      icon: Leaf,
      title: 'Calm & Meditative',
      description: 'Peaceful, mindful feedback focused on inner growth',
      example: "You moved with intention and awareness.",
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'formal' as const,
      icon: GraduationCap,
      title: 'Formal & Scientific',
      description: 'Clinical, analytical feedback with neuroscience terms',
      example: "Motor cortex optimization demonstrates measurable improvement.",
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'sarcastic' as const,
      icon: Zap,
      title: 'Sarcastic & Brutal',
      description: 'Witty, challenging feedback with humorous edge',
      example: "That circle just filed for a restraining order.",
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  const handleToneChange = (toneId: string) => {
    updateSettings({ feedbackTone: toneId });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-slate-800">Choose Your Feedback Style</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
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
                onClick={() => handleToneChange(tone.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected 
                    ? `${tone.borderColor} ${tone.bgColor} shadow-md` 
                    : 'border-border bg-card hover:bg-muted'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${tone.color} text-white flex-shrink-0`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-sm text-slate-800">{tone.title}</h3>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-2 h-2 bg-primary rounded-full"
                        />
                      )}
                    </div>
                    
                    <p className="text-xs text-slate-600">
                      {tone.description}
                    </p>
                    
                    <div className="mt-2 p-2 bg-slate-100/50 rounded text-caption text-slate-700">
                      "{tone.example}"
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Your feedback style enhances the calibration experience
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalibrationFeedbackToneSelector;