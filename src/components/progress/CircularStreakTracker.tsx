
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Trophy, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDailyCalibration } from '@/hooks/useDailyCalibration';

interface DayDetail {
  dayIndex: number;
  scorePercent: number;
  mode: string;
  tone: string;
  date: string;
}

const CircularStreakTracker: React.FC = () => {
  const { streak, weekHistory } = useDailyCalibration();
  const [selectedDay, setSelectedDay] = useState<DayDetail | null>(null);

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (streak.current / 7) * circumference;

  const getArcPosition = (dayIndex: number) => {
    const angle = (dayIndex / 7) * 2 * Math.PI - Math.PI / 2;
    const x = Math.cos(angle) * (radius + 20) + 100;
    const y = Math.sin(angle) * (radius + 20) + 100;
    return { x, y };
  };

  const getMedalIcon = (score: number) => {
    if (score >= 90) return "🥇";
    if (score >= 80) return "🥈";
    if (score >= 70) return "🥉";
    return "⚪";
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Flame className="h-5 w-5 text-orange-500" />
            7-Day Streak Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {/* Circular Progress */}
          <div className="relative">
            <svg width="200" height="200" className="transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r={radius}
                stroke="hsl(var(--muted))"
                strokeWidth="8"
                fill="none"
                className="opacity-30"
              />
              
              {/* Progress arc */}
              <motion.circle
                cx="100"
                cy="100"
                r={radius}
                stroke="hsl(var(--primary))"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>

            {/* Center streak display */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="text-3xl font-bold text-primary">{streak.current}</div>
              <div className="text-sm text-muted-foreground">day streak</div>
            </div>

            {/* Day markers */}
            {weekHistory.map((day, index) => {
              const position = getArcPosition(index);
              return (
                <motion.button
                  key={day.date}
                  className={`absolute w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-medium transition-all ${
                    day.completed 
                      ? 'bg-primary text-primary-foreground border-primary shadow-lg' 
                      : 'bg-background border-muted-foreground/30 text-muted-foreground'
                  }`}
                  style={{
                    left: position.x - 16,
                    top: position.y - 16,
                  }}
                  onClick={() => day.completed && setSelectedDay({
                    dayIndex: index,
                    scorePercent: day.accuracy,
                    mode: 'Standard', // TODO: Get from actual data
                    tone: 'Playful', // TODO: Get from actual data
                    date: day.date
                  })}
                  whileHover={{ scale: day.completed ? 1.1 : 1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {day.completed ? Math.round(day.accuracy) : index + 1}
                </motion.button>
              );
            })}
          </div>

          {/* Streak stats */}
          <div className="flex gap-8 text-center">
            <div>
              <div className="text-lg font-bold text-orange-500">{streak.longest}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-500">
                {weekHistory.filter(d => d.completed).length}/7
              </div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Day Detail Modal */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedDay(null)}
          >
            <motion.div
              className="bg-background rounded-xl p-6 max-w-sm w-full"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Day {selectedDay.dayIndex + 1}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSelectedDay(null)}>
                  ×
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Score</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{selectedDay.scorePercent}%</span>
                    <span className="text-lg">{getMedalIcon(selectedDay.scorePercent)}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Mode</span>
                  <span className="font-medium">{selectedDay.mode}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Tone</span>
                  <span className="font-medium">{selectedDay.tone}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">{selectedDay.date}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CircularStreakTracker;
