import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Crown, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserBadge } from '@/hooks/useDailyChallenges';

interface BadgeShowcaseProps {
  badges: UserBadge[];
  className?: string;
}

const BadgeShowcase: React.FC<BadgeShowcaseProps> = ({ badges, className = "" }) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return { bg: 'bg-gray-500', text: 'text-gray-100', glow: 'shadow-gray-500/30' };
      case 'rare': return { bg: 'bg-blue-500', text: 'text-blue-100', glow: 'shadow-blue-500/30' };
      case 'epic': return { bg: 'bg-purple-500', text: 'text-purple-100', glow: 'shadow-purple-500/30' };
      case 'legendary': return { bg: 'bg-yellow-500', text: 'text-yellow-900', glow: 'shadow-yellow-500/30' };
      default: return { bg: 'bg-gray-500', text: 'text-gray-100', glow: 'shadow-gray-500/30' };
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return Star;
      case 'rare': return Zap;
      case 'epic': return Trophy;
      case 'legendary': return Crown;
      default: return Star;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'streaks': return '🔥';
      case 'performance': return '🎯';
      case 'milestones': return '📈';
      default: return '🏆';
    }
  };

  if (badges.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <Trophy className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No badges earned yet</p>
        <p className="text-sm text-muted-foreground mt-1">Complete daily challenges to earn your first badge!</p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge, index) => {
          const rarityStyle = getRarityColor(badge.rarity);
          const RarityIcon = getRarityIcon(badge.rarity);
          
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
            >
              <Card className={`relative overflow-hidden border-2 ${rarityStyle.glow} shadow-lg hover:shadow-xl transition-all duration-300 group hover:scale-105`}>
                <CardContent className="p-4">
                  {/* Rarity indicator */}
                  <div className="absolute top-2 right-2">
                    <Badge className={`${rarityStyle.bg} ${rarityStyle.text} text-xs px-2 py-1`}>
                      <RarityIcon className="h-3 w-3 mr-1" />
                      {badge.rarity}
                    </Badge>
                  </div>

                  {/* Badge icon and category */}
                  <div className="text-center mb-3">
                    <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                      {badge.icon}
                    </div>
                    <div className="text-lg mb-1">{getCategoryIcon(badge.category)}</div>
                  </div>

                  {/* Badge details */}
                  <div className="text-center space-y-2">
                    <h3 className="font-bold text-lg leading-tight">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {badge.description}
                    </p>
                    
                    {/* XP reward */}
                    {badge.xp_reward > 0 && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                        <Star className="h-3 w-3" />
                        +{badge.xp_reward} XP
                      </div>
                    )}

                    {/* Earned date */}
                    <p className="text-xs text-muted-foreground">
                      Earned {new Date(badge.earned_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Animated background effect for legendary badges */}
                  {badge.rarity === 'legendary' && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-yellow-500/10 animate-pulse pointer-events-none" />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Badge categories summary */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-2xl mb-1">🔥</div>
          <div className="text-sm font-medium">Streaks</div>
          <div className="text-xs text-muted-foreground">
            {badges.filter(b => b.category === 'streaks').length}
          </div>
        </div>
        
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-2xl mb-1">🎯</div>
          <div className="text-sm font-medium">Performance</div>
          <div className="text-xs text-muted-foreground">
            {badges.filter(b => b.category === 'performance').length}
          </div>
        </div>
        
        <div className="text-center p-3 bg-muted/50 rounded-lg">
          <div className="text-2xl mb-1">📈</div>
          <div className="text-sm font-medium">Milestones</div>
          <div className="text-xs text-muted-foreground">
            {badges.filter(b => b.category === 'milestones').length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeShowcase;