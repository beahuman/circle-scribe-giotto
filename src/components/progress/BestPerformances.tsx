import React from 'react';
import { motion } from 'framer-motion';
import { Medal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLocalProgress } from '@/hooks/useLocalProgress';

const BestPerformances: React.FC = () => {
  const { gameResults } = useLocalProgress();

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

  const topPerformances = gameResults
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (topPerformances.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Medal className="h-5 w-5" />
            Best Performances
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topPerformances.map((performance, index) => (
            <div key={performance.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`text-lg ${getMedalColor(performance.score)}`}>
                  {getMedalIcon(performance.score)}
                </div>
                <div>
                  <div className="font-medium">{Math.round(performance.score)}%</div>
                  <div className="text-xs text-slate-500">
                    {new Date(performance.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500">
                {index === 0 ? "Personal Best" : 
                 index === 1 ? "2nd Best" : "3rd Best"}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BestPerformances;