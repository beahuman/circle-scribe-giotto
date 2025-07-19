import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBadgeSystem } from '@/hooks/useBadgeSystem';

interface BadgeShowcaseProps {
  className?: string;
}

const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ className = '' }) => {
  const { getBadgeProgress, loading } = useBadgeSystem();
  
  if (loading) {
    return (
      <div className={`${className}`}>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="w-16 h-16 bg-muted rounded-lg animate-pulse flex-shrink-0" />
          ))}
        </div>
      </div>
    );
  }

  const badgeProgress = getBadgeProgress();
  const recentBadges = badgeProgress
    .filter(bp => bp.unlocked)
    .sort((a, b) => {
      if (!a.unlockedAt || !b.unlockedAt) return 0;
      return new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime();
    })
    .slice(0, 6);

  const totalUnlocked = badgeProgress.filter(bp => bp.unlocked).length;
  const totalBadges = badgeProgress.length;

  const rarityColors = {
    common: 'bg-muted text-muted-foreground',
    uncommon: 'bg-success/10 text-success',
    rare: 'bg-info/10 text-info',
    epic: 'bg-primary/10 text-primary',
    legendary: 'bg-warning/10 text-warning',
    mythic: 'bg-gradient-to-r from-primary/10 to-primary-glow/10 text-primary'
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Progress summary */}
      <div className="text-center">
        <h3 className="font-semibold mb-1">Achievement Progress</h3>
        <p className="text-sm text-muted-foreground">
          {totalUnlocked} of {totalBadges} badges unlocked
        </p>
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(totalUnlocked / totalBadges) * 100}%` }}
          />
        </div>
      </div>

      {/* Recent badges */}
      {recentBadges.length > 0 && (
        <div>
          <h4 className="font-medium text-sm mb-2">Recent Achievements</h4>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {recentBadges.map((badgeProgress, index) => (
              <motion.div
                key={badgeProgress.badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0"
              >
                <Card className="w-16 h-16 relative overflow-hidden">
                  <CardContent className="p-2 flex flex-col items-center justify-center h-full">
                    <div className="text-lg mb-1">
                      {badgeProgress.badge.icon}
                    </div>
                    <Badge 
                      className={`text-xs px-1 absolute bottom-0 left-0 right-0 rounded-none ${
                        rarityColors[badgeProgress.badge.rarity as keyof typeof rarityColors]
                      }`}
                    >
                      {badgeProgress.badge.rarity.charAt(0).toUpperCase()}
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BadgeShowcase;