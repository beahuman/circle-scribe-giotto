import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart3, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocalProgress } from '@/hooks/useLocalProgress';
import { usePlayerProgress } from '@/hooks/usePlayerProgress';

const AnalyticsSection: React.FC = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { stats } = useLocalProgress();
  const { xp } = usePlayerProgress();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <Button
        variant="outline"
        onClick={() => setShowAnalytics(!showAnalytics)}
        className="w-full justify-between"
      >
        <span className="flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Analytics
        </span>
        <ChevronRight className={`h-4 w-4 transition-transform ${showAnalytics ? 'rotate-90' : ''}`} />
      </Button>

      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-xl font-bold text-primary">{stats.threeDayAverage.toFixed(1)}%</div>
                    <div className="text-xs text-slate-600">7-Day Average</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-green-500">{stats.bestScore}%</div>
                    <div className="text-xs text-slate-600">Personal Best</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-blue-500">{stats.totalGames}</div>
                    <div className="text-xs text-slate-600">Total Attempts</div>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-purple-500">{xp}</div>
                    <div className="text-xs text-slate-600">Total XP</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AnalyticsSection;