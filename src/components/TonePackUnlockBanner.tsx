import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { X, Sparkles } from 'lucide-react';
import { useToneSystem } from '@/hooks/useToneSystem';

const TonePackUnlockBanner: React.FC = () => {
  const { tonePackExpansion } = useToneSystem();
  
  if (!tonePackExpansion.showUnlockBanner) return null;

  const tone = tonePackExpansion.showUnlockBanner;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md"
      >
        <div className="bg-gradient-to-r from-primary/90 to-primary-glow/90 backdrop-blur-sm border border-primary/20 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="flex-shrink-0"
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              
              <div className="text-white min-w-0">
                <p className="font-medium text-sm">
                  Giotto is learning your rhythm.
                </p>
                <p className="text-xs text-white/80 capitalize">
                  {tone} tone Volume 2 unlocked.
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                size="sm"
                variant="ghost"
                onClick={tonePackExpansion.dismissUnlockBanner}
                className="text-white hover:bg-white/20 text-xs h-auto py-1 px-2"
              >
                Got it
              </Button>
              
              <Button
                size="sm"
                variant="ghost"
                onClick={tonePackExpansion.dismissUnlockBanner}
                className="text-white hover:bg-white/20 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TonePackUnlockBanner;