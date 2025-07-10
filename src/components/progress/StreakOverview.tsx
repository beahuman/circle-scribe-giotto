import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { useDailyCalibration } from '@/hooks/useDailyCalibration';

const StreakOverview: React.FC = () => {
  const { streak, todaysCompletion } = useDailyCalibration();

  const getMedalIcon = (score: number) => {
    if (score >= 90) return "🥇";
    if (score >= 80) return "🥈";
    if (score >= 70) return "🥉";
    return "⚪";
  };

  const getMedalColor = (score: number) => {
    if (score >= 90) return "text-yellow-600";
    if (score >= 80) return "text-gray-500";
    if (score >= 70) return "text-amber-600";
    return "text-slate-400";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-orange-500">{streak.current}</div>
              <div className="text-xs text-slate-600">Current Streak</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-500">{streak.longest}</div>
              <div className="text-xs text-slate-600">Longest Streak</div>
            </div>
            <div>
              <div className={`text-2xl ${getMedalColor(todaysCompletion?.accuracy || 0)}`}>
                {todaysCompletion ? getMedalIcon(todaysCompletion.accuracy) : "—"}
              </div>
              <div className="text-xs text-slate-600">Today's Medal</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StreakOverview;