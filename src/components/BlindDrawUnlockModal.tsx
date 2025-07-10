import React from 'react';
import { motion } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye, Brain, Target } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

interface BlindDrawUnlockModalProps {
  open: boolean;
  onClose: () => void;
  onStartBlindDraw: () => void;
}

const BlindDrawUnlockModal: React.FC<BlindDrawUnlockModalProps> = ({
  open,
  onClose,
  onStartBlindDraw
}) => {
  const { settings } = useSettings();

  const getUnlockMessage = () => {
    const tone = settings.feedbackTone || 'playful';
    switch (tone) {
      case 'playful':
        return "You're drawing with your brain now.";
      case 'calm':
        return "Sight fades. Focus sharpens.";
      case 'formal':
        return "Proprioceptive neural pathways activated.";
      case 'sarcastic':
        return "Don't blame us when this goes badly.";
      default:
        return "Your muscle memory is ready for the ultimate test.";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-0 gap-0 bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 text-center space-y-6"
        >
          {/* Header with animated icon */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <div className="relative mx-auto w-16 h-16 mb-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-2 border-purple-400 rounded-full"
              />
              <div className="absolute inset-2 bg-purple-400 rounded-full flex items-center justify-center">
                <Eye className="h-6 w-6 text-slate-900" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-white">
              🎯 Blind Draw Mode Unlocked!
            </h2>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-purple-200 text-lg italic"
            >
              {getUnlockMessage()}
            </motion.p>
          </motion.div>

          {/* Feature explanation */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-slate-800/50 rounded-lg p-4 space-y-3"
          >
            <div className="flex items-center gap-3 text-slate-300">
              <Brain className="h-5 w-5 text-purple-400" />
              <span className="text-sm">Draw without seeing your stroke</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Target className="h-5 w-5 text-purple-400" />
              <span className="text-sm">Trust your spatial awareness</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Eye className="h-5 w-5 text-purple-400" />
              <span className="text-sm">See your creation revealed</span>
            </div>
          </motion.div>

          {/* Educational note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-xs text-slate-400 italic bg-slate-700/30 rounded p-3"
          >
            Blind Draw tests your proprioception and spatial recall—key components of fine motor mastery.
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="flex gap-3"
          >
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Maybe Later
            </Button>
            <Button
              onClick={onStartBlindDraw}
              className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white"
            >
              Try It Now
            </Button>
          </motion.div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default BlindDrawUnlockModal;