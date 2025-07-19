
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Trophy, Flame, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBadgeSystem } from '@/hooks/useBadgeSystem';

const EnhancedBadgesSection: React.FC = () => {
  const { getBadgeProgress } = useBadgeSystem();
  const badgeProgress = getBadgeProgress();
  const unlockedBadges = badgeProgress.filter(b => b.unlocked);

  const getModeIcon = (badgeName: string) => {
    if (badgeName.includes('Spiral')) return <Target className="h-3 w-3" />;
    if (badgeName.includes('Offset')) return <Zap className="h-3 w-3" />;
    if (badgeName.includes('Blind')) return <Flame className="h-3 w-3" />;
    return <Trophy className="h-3 w-3" />;
  };

  const getBadgeRarity = (badge: any) => {
    if (badge.badge.name.includes('Master')) return 'legendary';
    if (badge.badge.name.includes('Expert')) return 'epic';
    if (badge.badge.name.includes('7')) return 'rare';
    return 'common';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400/20 to-orange-500/20 border-yellow-400/50';
      case 'epic': return 'from-purple-400/20 to-pink-500/20 border-purple-400/50';
      case 'rare': return 'from-blue-400/20 to-cyan-500/20 border-blue-400/50';
      default: return 'from-gray-400/20 to-gray-500/20 border-gray-400/50';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Achievements & Badges
            <Badge variant="secondary" className="ml-auto">
              {unlockedBadges.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unlockedBadges.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedBadges.map((badgeProgress, index) => {
                const rarity = getBadgeRarity(badgeProgress);
                const rarityColor = getRarityColor(rarity);
                
                return (
                  <motion.div
                    key={badgeProgress.badge.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className={`relative p-4 rounded-xl border-2 bg-gradient-to-br ${rarityColor} hover:shadow-lg transition-all`}
                  >
                    {/* Badge icon and mode indicator */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-3xl">{badgeProgress.badge.icon}</div>
                      <div className="flex flex-col items-end gap-1">
                        {getModeIcon(badgeProgress.badge.name)}
                        <Badge variant="outline" className="text-xs px-1 py-0">
                          {rarity}
                        </Badge>
                      </div>
                    </div>
                    
                    {/* Badge details */}
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm leading-tight">
                        {badgeProgress.badge.name}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {badgeProgress.badge.description}
                      </p>
                    </div>

                    {/* Unlock glow effect for recently earned */}
                    {index < 2 && (
                      <motion.div
                        className="absolute inset-0 rounded-xl bg-primary/10 pointer-events-none"
                        animate={{ opacity: [0, 0.3, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm mb-1">No badges earned yet</p>
              <p className="text-xs">Keep practicing to unlock achievements!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EnhancedBadgesSection;
