
import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Star, Target } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ToneAwareText from '@/components/common/ToneAwareText';

interface EnhancedModeCardProps {
  mode: {
    id: string;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    description: string;
    difficulty: number;
    color: string;
    bgGradient: string;
  };
  isLocked: boolean;
  bestScore?: number;
  onSelect: () => void;
}

const EnhancedModeCard: React.FC<EnhancedModeCardProps> = ({
  mode,
  isLocked,
  bestScore,
  onSelect
}) => {
  const IconComponent = mode.icon;

  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.02 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`relative overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
          isLocked 
            ? 'card-passive border-muted-foreground/20 grayscale opacity-60' 
            : `border-transparent hover:border-primary/40 ${mode.bgGradient} interactive-feedback`
        }`}
        onClick={!isLocked ? onSelect : undefined}
      >
        {isLocked && (
          <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px] z-10" />
        )}
        
        <CardContent className="p-6 relative">
          {/* Lock overlay for locked modes */}
          {isLocked && (
            <div className="absolute top-4 right-4 z-20">
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
          )}

          {/* Best score badge for unlocked modes */}
          {!isLocked && bestScore && (
            <div className="absolute top-4 right-4">
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1" />
                {bestScore}%
              </Badge>
            </div>
          )}

          <div className="space-y-4">
            {/* Mode icon and title */}
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${isLocked ? 'bg-muted' : 'bg-background/80'}`}>
                <IconComponent className={`h-6 w-6 ${isLocked ? 'text-muted-foreground' : mode.color}`} />
              </div>
              <div>
                <h3 className={`font-semibold ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {mode.name}
                </h3>
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: mode.difficulty }).map((_, i) => (
                    <Target key={i} className={`h-3 w-3 ${isLocked ? 'text-muted-foreground/50' : mode.color}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className={`text-sm ${isLocked ? 'text-muted-foreground' : 'text-foreground/80'}`}>
              {mode.description}
            </p>

            {/* Locked state message with tone awareness */}
            {isLocked && (
              <div className="pt-2 border-t border-muted-foreground/20">
                <ToneAwareText 
                  variant="locked" 
                  fallback="Complete more practice rounds to unlock this mode."
                  className="text-xs text-muted-foreground italic"
                />
              </div>
            )}

            {/* Unlock status indicator */}
            {!isLocked && (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                Unlocked
              </div>
            )}
          </div>
        </CardContent>

        {/* Mode-specific accent gradient */}
        {!isLocked && (
          <div className={`absolute bottom-0 left-0 right-0 h-1 ${mode.bgGradient} opacity-60`} />
        )}
      </Card>
    </motion.div>
  );
};

export default EnhancedModeCard;
