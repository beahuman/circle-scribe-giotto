import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBadgeSystem } from '@/hooks/useBadgeSystem';

const BadgesSection: React.FC = () => {
  const { getBadgeProgress } = useBadgeSystem();
  const badgeProgress = getBadgeProgress();
  const unlockedBadges = badgeProgress.filter(b => b.unlocked);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5" />
            Achievements ({unlockedBadges.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unlockedBadges.length > 0 ? (
            <div className="grid grid-cols-3 gap-3">
              {unlockedBadges.slice(0, 6).map((badgeProgress) => (
                <motion.div
                  key={badgeProgress.badge.id}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-3 bg-gradient-to-br from-primary/10 to-purple-400/10 rounded-lg"
                >
                  <div className="text-2xl mb-1">{badgeProgress.badge.icon}</div>
                  <div className="text-xs font-medium text-slate-700">
                    {badgeProgress.badge.name}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-slate-500">
              <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No badges earned yet</p>
              <p className="text-xs">Keep practicing to unlock achievements!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BadgesSection;