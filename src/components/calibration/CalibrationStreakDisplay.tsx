import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar } from 'lucide-react';

interface CalibrationStreakDisplayProps {
  streak: { current: number; longest: number };
  isCompleted: boolean;
}

const CalibrationStreakDisplay: React.FC<CalibrationStreakDisplayProps> = ({
  streak,
  isCompleted
}) => {
  const getStreakMessage = (count: number) => {
    if (count === 0) return "Begin your calibration journey";
    if (count === 1) return "Day 1 – A mindful beginning";
    if (count < 7) return `Day ${count} of 7 – Building momentum`;
    if (count === 7) return "Week complete! Neural pathways strengthening";
    if (count < 14) return `Day ${count} – Excellence in progress`;
    if (count >= 14) return `Day ${count} – Master of precision`;
    return `Day ${count} – Keep going!`;
  };

  const getStreakColor = (count: number) => {
    if (count >= 14) return "from-purple-500 to-pink-500";
    if (count >= 7) return "from-blue-500 to-cyan-500";
    if (count >= 3) return "from-green-500 to-blue-500";
    return "from-slate-400 to-slate-500";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-card border border-border rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Flame className={`h-5 w-5 ${streak.current > 0 ? 'text-orange-500' : 'text-slate-400'}`} />
          <span className="font-medium text-slate-700">Calibration Streak</span>
        </div>
        <div className={`text-2xl font-bold bg-gradient-to-r ${getStreakColor(streak.current)} bg-clip-text text-transparent`}>
          {streak.current}
        </div>
      </div>
      
      <p className="text-sm text-slate-600 mb-3">
        {getStreakMessage(streak.current)}
      </p>
      
      {streak.current > 0 && (
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Longest streak: {streak.longest}</span>
          {isCompleted && (
            <div className="flex items-center gap-1 text-green-600">
              <Calendar className="h-3 w-3" />
              <span>Today complete</span>
            </div>
          )}
        </div>
      )}
      
      {/* Progress indicators for upcoming milestones */}
      {streak.current < 14 && (
        <div className="mt-4 space-y-2">
          <div className="text-xs text-slate-500 mb-1">Upcoming milestones:</div>
          <div className="space-y-1">
            {streak.current < 3 && (
              <div className="text-xs text-slate-600">• Day 3: Unlock new brush styles</div>
            )}
            {streak.current < 7 && (
              <div className="text-xs text-slate-600">• Day 7: Unlock Blind Draw mode</div>
            )}
            {streak.current < 14 && (
              <div className="text-xs text-slate-600">• Day 14: Unlock Cognitive Flow theme</div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default CalibrationStreakDisplay;