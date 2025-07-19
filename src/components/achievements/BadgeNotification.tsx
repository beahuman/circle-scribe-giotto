import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Share2 } from 'lucide-react';
import { Tables } from '@/integrations/supabase/types';

type BadgeType = Tables<'badges'>;

interface BadgeNotificationProps {
  badge: BadgeType;
  isVisible: boolean;
  onClose: () => void;
  onShare: (badge: BadgeType) => void;
}

const BadgeNotification: React.FC<BadgeNotificationProps> = ({
  badge,
  isVisible,
  onClose,
  onShare
}) => {
  const rarityColors = {
    common: 'from-slate-400 to-slate-600',
    uncommon: 'from-green-400 to-green-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-yellow-600',
    mythic: 'from-pink-400 to-purple-600'
  };

  const rarityEmojis = {
    common: '🔶',
    uncommon: '🟢',
    rare: '🔵',
    epic: '🟣',
    legendary: '🟡',
    mythic: '⭐'
  };

  return (
    <AnimatePresence>
      {isVisible && (
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
          className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md"
        >
          <Card className="relative overflow-hidden border-2 border-primary shadow-2xl">
            {/* Animated background gradient */}
            <div 
              className={`absolute inset-0 bg-gradient-to-r ${rarityColors[badge.rarity as keyof typeof rarityColors]} opacity-10 animate-pulse`} 
            />
            
            {/* Floating particles effect */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-primary/30 rounded-full"
                  initial={{ 
                    x: Math.random() * 100 + '%', 
                    y: '100%',
                    opacity: 0 
                  }}
                  animate={{ 
                    y: '-20%',
                    opacity: [0, 1, 0],
                    scale: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            <CardContent className="p-6 relative">
              {/* Close button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Content */}
              <div className="text-center space-y-4">
                {/* Header */}
                <div className="space-y-2">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="text-4xl mx-auto"
                  >
                    {badge.icon}
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-bold flex items-center justify-center gap-2">
                      {rarityEmojis[badge.rarity as keyof typeof rarityEmojis]} 
                      Badge Unlocked!
                    </h3>
                    <h4 className="text-xl font-bold text-primary">
                      {badge.name}
                    </h4>
                  </motion.div>
                </div>

                {/* Badge info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-muted-foreground">
                    {badge.description}
                  </p>
                  
                  <div className="flex items-center justify-center gap-4">
                    <Badge 
                      variant="secondary" 
                      className={`bg-gradient-to-r ${rarityColors[badge.rarity as keyof typeof rarityColors]} text-white border-0`}
                    >
                      {badge.rarity.toUpperCase()}
                    </Badge>
                    <Badge variant="outline">
                      +{badge.xp_reward} XP
                    </Badge>
                  </div>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-2"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onShare(badge)}
                    className="flex-1"
                  >
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                  <Button
                    size="sm"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Continue
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>

          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 -z-10 blur-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
          >
            <div 
              className={`w-full h-full bg-gradient-to-r ${rarityColors[badge.rarity as keyof typeof rarityColors]} rounded-xl opacity-80`} 
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BadgeNotification;