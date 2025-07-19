import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDailyCalibration } from '@/hooks/useDailyCalibration';

const DailyTimeline: React.FC = () => {
  const { weekHistory } = useDailyCalibration();

  const getMedalIcon = (score: number) => {
    if (score >= 90) return "🥇";
    if (score >= 80) return "🥈";
    if (score >= 70) return "🥉";
    return "⚪";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Daily Calibration History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {weekHistory.map((day, index) => (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 text-center"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-1 ${
                  day.completed ? 'bg-gradient-to-br from-primary to-purple-400' : 'bg-slate-200'
                }`}>
                  <span className={`text-sm font-medium ${
                    day.completed ? 'text-white' : 'text-slate-500'
                  }`}>
                    {day.completed ? Math.round(day.accuracy) : '—'}
                  </span>
                </div>
                <div className="text-xs text-slate-600">{day.dayName}</div>
                {day.completed && (
                  <div className="text-xs">{getMedalIcon(day.accuracy)}</div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DailyTimeline;