
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Award, Star, Zap, X } from 'lucide-react';

interface SimpleBadgeNotificationProps {
  badgeId: string;
  onComplete: () => void;
}

const SimpleBadgeNotification: React.FC<SimpleBadgeNotificationProps> = ({
  badgeId,
  onComplete
}) => {
  const badgeConfig = {
    perfect_symmetry: {
      icon: Trophy,
      title: 'Perfect Symmetry',
      description: 'Achieved 90%+ symmetry accuracy!',
      color: 'from-blue-500 to-blue-600',
      emoji: '🎯'
    },
    perfect_alignment: {
      icon: Award,
      title: 'Perfect Alignment',
      description: 'Flawless start-end connection!',
      color: 'from-green-500 to-green-600',
      emoji: '🔗'
    },
    smooth_operator: {
      icon: Star,
      title: 'Smooth Operator',
      description: 'Achieved 95%+ stroke smoothness!',
      color: 'from-purple-500 to-purple-600',
      emoji: '✨'
    },
    giotto_master: {
      icon: Zap,
      title: 'Giotto Master',
      description: 'Achieved 95%+ overall score!',
      color: 'from-yellow-500 to-orange-500',
      emoji: '🎨'
    }
  };

  const config = badgeConfig[badgeId as keyof typeof badgeConfig];
  if (!config) return null;

  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -100, scale: 0.8 }}
        transition={{ 
          type: "spring", 
          stiffness: 300, 
          damping: 25,
          duration: 0.6 
        }}
        className="fixed top-8 left-4 right-4 z-50 mx-auto max-w-sm"
      >
        {/* Subtle background blur overlay - positioned to not fully cover content */}
        <div className="absolute inset-0 bg-black/10 backdrop-blur-sm rounded-lg -z-10" />
        
        <div className="relative overflow-hidden border-2 border-primary shadow-2xl rounded-lg bg-background/95 backdrop-blur-md">
          {/* Animated background gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-10 animate-pulse`} />
          
          {/* Optional dismiss button */}
          <motion.button
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            onClick={onComplete}
            className="absolute top-2 right-2 w-6 h-6 rounded-full bg-muted/70 hover:bg-muted/90 flex items-center justify-center transition-colors z-10"
          >
            <X className="h-3 w-3 text-muted-foreground" />
          </motion.button>
          
          {/* Content */}
          <div className="p-5 relative text-center space-y-3">
            {/* Icon and emoji */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="space-y-2"
            >
              <div className="text-3xl">{config.emoji}</div>
              <div className={`w-12 h-12 mx-auto rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>
            </motion.div>
            
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-1"
            >
              <h3 className="text-base font-bold text-primary">Badge Unlocked!</h3>
              <h4 className="text-lg font-bold">{config.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{config.description}</p>
            </motion.div>

            {/* Continue button */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              onClick={onComplete}
              className="px-5 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
            >
              Continue
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SimpleBadgeNotification;
