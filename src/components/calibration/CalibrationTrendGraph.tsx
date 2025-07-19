import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WeekHistoryData {
  date: string;
  accuracy?: number;
  completed: boolean;
  dayName: string;
}

interface CalibrationTrendGraphProps {
  weekHistory: WeekHistoryData[];
}

const CalibrationTrendGraph: React.FC<CalibrationTrendGraphProps> = ({
  weekHistory
}) => {
  const maxHeight = 60;
  const maxScore = 100;

  const getTrendDirection = () => {
    const completedDays = weekHistory.filter(day => day.completed);
    if (completedDays.length < 2) return 'neutral';
    
    const firstHalf = completedDays.slice(0, Math.floor(completedDays.length / 2));
    const secondHalf = completedDays.slice(Math.floor(completedDays.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, day) => sum + (day.accuracy || 0), 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, day) => sum + (day.accuracy || 0), 0) / secondHalf.length;
    
    if (secondAvg > firstAvg + 5) return 'up';
    if (secondAvg < firstAvg - 5) return 'down';
    return 'neutral';
  };

  const getTrendIcon = () => {
    const direction = getTrendDirection();
    switch (direction) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-orange-500" />;
      default: return <Minus className="h-4 w-4 text-slate-400" />;
    }
  };

  const getTrendMessage = () => {
    const direction = getTrendDirection();
    switch (direction) {
      case 'up': return "Precision improving";
      case 'down': return "Focus on consistency";
      default: return "Maintaining steady progress";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-slate-700">7-Day Progress</h3>
        <div className="flex items-center gap-1 text-sm text-slate-600">
          {getTrendIcon()}
          <span>{getTrendMessage()}</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 mb-4" style={{ height: maxHeight + 20 }}>
        {weekHistory.map((day, index) => {
          const height = day.completed ? ((day.accuracy || 0) / maxScore) * maxHeight : 0;
          const isToday = index === weekHistory.length - 1;
          
          return (
            <div key={day.date} className="flex flex-col items-center flex-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${height}px` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`w-full rounded-t-lg ${
                  day.completed 
                    ? isToday 
                      ? 'bg-gradient-to-t from-primary to-purple-400'
                      : 'bg-gradient-to-t from-slate-300 to-slate-400'
                    : 'bg-slate-100'
                } min-h-[4px]`}
              />
              <div className="mt-2 text-xs text-slate-500 text-center">
                <div>{day.dayName}</div>
                {day.completed && (
                  <div className="text-[10px] font-medium text-slate-600 mt-1">
                    {(day.accuracy || 0).toFixed(0)}%
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-xs text-slate-500 text-center">
        <span>Daily precision scores</span>
      </div>
    </motion.div>
  );
};

export default CalibrationTrendGraph;