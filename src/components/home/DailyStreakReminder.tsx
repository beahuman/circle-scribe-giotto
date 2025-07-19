import React from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy, Target } from 'lucide-react';
import { useDailyReturnSystem } from '@/hooks/useDailyReturnSystem';

interface DailyStreakReminderProps {
  className?: string;
}

const DailyStreakReminder: React.FC<DailyStreakReminderProps> = ({ className = '' }) => {
  const { 
    streak, 
    hasDrawnToday, 
    streakReminderText, 
    nextMilestone, 
    showCompletionAnimation 
  } = useDailyReturnSystem();

  const getStreakIcon = () => {
    if (hasDrawnToday) return <Trophy className="h-4 w-4 text-amber-500" />;
    if (streak.current >= 7) return <Flame className="h-4 w-4 text-orange-500" />;
    return <Target className="h-4 w-4 text-blue-500" />;
  };

  const getStreakColor = () => {
    if (hasDrawnToday) return "from-amber-500/10 to-yellow-500/10 border-amber-500/30 hover:from-amber-500/15 hover:to-yellow-500/15 hover:border-amber-500/40";
    if (streak.current >= 7) return "from-orange-500/10 to-red-500/10 border-orange-500/30 hover:from-orange-500/15 hover:to-red-500/15 hover:border-orange-500/40";
    if (streak.current >= 3) return "from-blue-500/10 to-cyan-500/10 border-blue-500/30 hover:from-blue-500/15 hover:to-cyan-500/15 hover:border-blue-500/40";
    return "from-slate-500/5 to-gray-500/5 border-slate-500/20 hover:from-slate-500/10 hover:to-gray-500/10 hover:border-slate-500/30";
  };

  const progressToNext = streak.current > 0 ? ((streak.current % nextMilestone) / nextMilestone) * 100 : 0;

  return (
    <motion.div
      className={`bg-gradient-to-r ${getStreakColor()} border rounded-xl p-6 ${className} cursor-pointer transition-all duration-300`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        scale: showCompletionAnimation ? 1.02 : 1,
      }}
      transition={{ 
        duration: 0.3,
        scale: { duration: showCompletionAnimation ? 0.6 : 0.3 }
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStreakIcon()}
          <span className="font-medium text-sm">
            {streak.current > 0 ? `Day ${streak.current}` : 'Start Today'}
          </span>
        </div>
        
        {streak.current > 0 && (
          <div className="text-xs text-muted-foreground">
            {nextMilestone - streak.current} to next milestone
          </div>
        )}
      </div>
      
      <p className="text-xs text-muted-foreground mb-3">
        {streakReminderText}
      </p>
      
      {streak.current > 0 && (
        <div className="w-full bg-muted/30 rounded-full h-1.5">
          <motion.div
            className="bg-primary h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressToNext}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      )}
      
      {hasDrawnToday && (
        <motion.div
          className="flex items-center gap-1 mt-2 text-green-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="w-2 h-2 bg-green-500 rounded-full" />
          <span className="text-xs font-medium">Completed today</span>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DailyStreakReminder;