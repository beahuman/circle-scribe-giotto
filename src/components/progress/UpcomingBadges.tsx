import React from 'react';
import { motion } from 'framer-motion';
import { Star, Lock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBadgeSystem } from '@/hooks/useBadgeSystem';

const UpcomingBadges: React.FC = () => {
  const { getBadgeProgress } = useBadgeSystem();
  const badgeProgress = getBadgeProgress();
  const nextBadges = badgeProgress.filter(b => !b.unlocked).slice(0, 3);

  if (nextBadges.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.55 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Star className="h-5 w-5" />
            Upcoming Badges
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {nextBadges.map((badgeProgress) => (
            <div key={badgeProgress.badge.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg opacity-60">
              <div className="flex items-center gap-3">
                <div className="text-lg opacity-50">{badgeProgress.badge.icon}</div>
                <div>
                  <div className="font-medium text-slate-700">{badgeProgress.badge.name}</div>
                  <div className="text-xs text-slate-500">{badgeProgress.badge.description}</div>
                </div>
              </div>
              <Lock className="h-4 w-4 text-slate-400" />
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default UpcomingBadges;