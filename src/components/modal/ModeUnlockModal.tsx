import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Award, Brush, Circle, Eye, Shuffle, Target } from 'lucide-react';
import { UnlockTrigger } from '@/hooks/useModeUnlockSystem';
import { useToneSystem } from '@/hooks/useToneSystem';
import { useSensoryFeedback } from '@/hooks/useSensoryFeedback';
import ModeIconAnimation from './ModeIconAnimation';

interface ModeUnlockModalProps {
  isOpen: boolean;
  trigger: UnlockTrigger | null;
  onTryNow: () => void;
  onMaybeLater: () => void;
}

const getModeIcon = (modeId: string) => {
  switch (modeId) {
    case 'blind-draw':
      return Eye;
    case 'spiral-mode':
      return Circle;
    case 'offset-mode':
      return Target;
    case 'perception-gauntlet':
      return Shuffle;
    default:
      return Sparkles;
  }
};

const getToneAwareMessage = (trigger: UnlockTrigger, tone: string): { header: string; description: string } => {
  const modeId = trigger.id;
  
  switch (tone) {
    case 'playful':
      switch (modeId) {
        case 'blind-draw':
          return {
            header: "Whoa! Blind Draw Mode unlocked.",
            description: "Got a circle in ya... without looking? This should be interesting!"
          };
        case 'spiral-mode':
          return {
            header: "Sweet! Spiral Mode unlocked.",
            description: "Things just got loopy. Ready to spin your way to perfection?"
          };
        case 'offset-mode':
          return {
            header: "Offset Mode is yours now!",
            description: "The circle's playing hide and seek – think you can find it?"
          };
        case 'perception-gauntlet':
          return {
            header: "No way! Perception Gauntlet unlocked!",
            description: "This is the big leagues – all the challenges rolled into one!"
          };
        default:
          return {
            header: `Awesome! ${trigger.name} unlocked!`,
            description: "Let's see what you can do with this new challenge!"
          };
      }
      
    case 'calm':
      switch (modeId) {
        case 'blind-draw':
          return {
            header: "Blind Draw Mode reflects pure intention.",
            description: "Draw without sight. Trust your inner compass."
          };
        case 'spiral-mode':
          return {
            header: "A new challenge unfolds inward.",
            description: "The spiral path teaches patience. Follow slowly."
          };
        case 'offset-mode':
          return {
            header: "Offset Mode opens to you. Balance seeks balance.",
            description: "The circle waits elsewhere. Find your center first."
          };
        case 'perception-gauntlet':
          return {
            header: "The Gauntlet awaits. This is mastery's edge.",
            description: "All techniques converge here. Be present."
          };
        default:
          return {
            header: `${trigger.name} flows to you naturally.`,
            description: "Each step forward deepens understanding."
          };
      }
      
    case 'formal':
      switch (modeId) {
        case 'blind-draw':
          return {
            header: "Blind Draw Mode unlocked. Memory training protocol activated.",
            description: "Visual feedback eliminated to strengthen spatial memory."
          };
        case 'spiral-mode':
          return {
            header: "Spiral Mode unlocked. Circular consistency under pressure.",
            description: "Precision testing increased. Proceed when ready."
          };
        case 'offset-mode':
          return {
            header: "Offset Mode unlocked. Perceptual alignment challenge enabled.",
            description: "Reference circle positioned off-center to test spatial calibration."
          };
        case 'perception-gauntlet':
          return {
            header: "Perception Gauntlet unlocked. Advanced training protocol.",
            description: "Combined blind and offset mechanics for comprehensive assessment."
          };
        default:
          return {
            header: `${trigger.name} module unlocked.`,
            description: "New training parameters are now available."
          };
      }
      
    case 'sarcastic':
      switch (modeId) {
        case 'blind-draw':
          return {
            header: "Great. Now you can mess up... twice as much.",
            description: "What could possibly go wrong with no visual feedback?"
          };
        case 'spiral-mode':
          return {
            header: "Spiral Mode? Can't draw a circle if you ghost the app.",
            description: "Hope you like going in circles. Literally."
          };
        case 'offset-mode':
          return {
            header: "Offset Mode unlocked. Still not perfect, huh?",
            description: "Now the target's playing hard to get. Let's keep at it."
          };
        case 'perception-gauntlet':
          return {
            header: "Perception Gauntlet? Someone's feeling confident.",
            description: "Blind AND offset. What's next, drawing upside down?"
          };
        default:
          return {
            header: `${trigger.name}? Well, this should be interesting.`,
            description: "Hope you're ready for things to get complicated."
          };
      }
      
    default:
      return {
        header: `${trigger.name} unlocked!`,
        description: trigger.description
      };
  }
};

const ModeUnlockModal: React.FC<ModeUnlockModalProps> = ({
  isOpen,
  trigger,
  onTryNow,
  onMaybeLater
}) => {
  const { selectedTone } = useToneSystem();
  const { triggerFeedback } = useSensoryFeedback();
  
  // Trigger feedback when modal opens
  React.useEffect(() => {
    if (isOpen && trigger) {
      // Small delay to let the modal render first
      setTimeout(() => triggerFeedback('mode-unlock'), 100);
    }
  }, [isOpen, trigger, triggerFeedback]);
  
  if (!trigger) return null;

  const IconComponent = getModeIcon(trigger.id);
  const { header, description } = getToneAwareMessage(trigger, selectedTone);

  return (
    <Dialog open={isOpen} onOpenChange={onMaybeLater}>
      <DialogContent className="max-w-sm mx-auto radius-modal bg-gradient-to-br from-background via-background to-muted/20 xs:max-w-md md:max-w-lg lg:max-w-xl">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center space-y-grid py-6"
            >
              {/* Animated Mode Icon with Custom Brushstroke */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.2, 
                  duration: 0.5,
                  ease: "easeOut"
                }}
                className="relative mx-auto w-24 h-24"
              >
                {/* Glowing background */}
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                  className="absolute inset-0 bg-gradient-radial from-primary/20 to-transparent rounded-full blur-sm"
                />
                
                {/* Mode-specific brushstroke animation */}
                <ModeIconAnimation 
                  modeId={trigger.id} 
                  isVisible={isOpen}
                />
              </motion.div>

              {/* Giotto's Tone-Aware Message - Grid Centered */}
              <div className="space-y-grid">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className="space-y-4"
                >
                  <p className="text-caption font-medium tracking-wide">GIOTTO SAYS</p>
                  <h2 className="text-subheader font-bold text-foreground leading-tight">
                    {header}
                  </h2>
                </motion.div>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.4 }}
                  className="text-description leading-relaxed px-4"
                >
                  {description}
                </motion.p>
              </div>

              {/* Rewards Showcase - Grid Centered */}
              {(trigger.rewardBadge || trigger.rewardBrush) && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.6 }}
                  className="space-y-4 p-6 bg-primary/5 border border-primary/20 radius-card mx-4"
                >
                  <p className="text-label text-primary">Unlocked Rewards</p>
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                    {trigger.rewardBadge && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 1.8, type: "spring" }}
                      >
                        <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 radius-badge">
                          <Award className="w-4 h-4" strokeWidth={2} />
                          {trigger.rewardBadge}
                        </Badge>
                      </motion.div>
                    )}
                    {trigger.rewardBrush && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 2.0, type: "spring" }}
                      >
                        <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 radius-badge">
                          <Brush className="w-4 h-4" strokeWidth={2} />
                          {trigger.rewardBrush}
                        </Badge>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons - Grid Aligned */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 2.2 }}
                className="flex flex-col xs:flex-row gap-4 pt-6 px-4"
              >
                <Button 
                  variant="ghost" 
                  onClick={onMaybeLater}
                  className="flex-1 text-muted-foreground hover:text-foreground min-h-[56px] text-button"
                >
                  Save for Later
                </Button>
                <Button 
                  onClick={onTryNow}
                  className="flex-1 gradient-primary hover:opacity-90 shadow-elegant min-h-[56px] text-button"
                >
                  Try {trigger.name.split(' ')[0]} Now
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default ModeUnlockModal;