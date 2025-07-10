import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Award, Brush } from 'lucide-react';
import { UnlockTrigger } from '@/hooks/useModeUnlockSystem';

interface ModeUnlockModalProps {
  isOpen: boolean;
  trigger: UnlockTrigger | null;
  message: string;
  onTryNow: () => void;
  onMaybeLater: () => void;
}

const ModeUnlockModal: React.FC<ModeUnlockModalProps> = ({
  isOpen,
  trigger,
  message,
  onTryNow,
  onMaybeLater
}) => {
  if (!trigger) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onMaybeLater}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-6"
            >
              {/* Celebration Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center"
              >
                <Sparkles className="w-8 h-8 text-primary" />
              </motion.div>

              {/* Mode Name */}
              <div className="space-y-2">
                <motion.h2
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-foreground"
                >
                  {trigger.name}
                </motion.h2>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-muted-foreground"
                >
                  {trigger.description}
                </motion.p>
              </div>

              {/* Unlock Message */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-primary/10 border border-primary/20 rounded-lg p-4"
              >
                <p className="text-primary font-medium">{message}</p>
              </motion.div>

              {/* Rewards */}
              {(trigger.rewardBadge || trigger.rewardBrush) && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-muted-foreground">Rewards unlocked:</p>
                  <div className="flex items-center justify-center gap-3">
                    {trigger.rewardBadge && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Award className="w-3 h-3" />
                        {trigger.rewardBadge}
                      </Badge>
                    )}
                    {trigger.rewardBrush && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Brush className="w-3 h-3" />
                        {trigger.rewardBrush}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex gap-3 pt-4"
              >
                <Button 
                  variant="outline" 
                  onClick={onMaybeLater}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button 
                  onClick={onTryNow}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                >
                  Try It Now
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