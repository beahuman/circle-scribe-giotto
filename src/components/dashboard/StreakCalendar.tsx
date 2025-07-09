import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DailyCompletion } from '@/hooks/useDailyChallenges';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isBefore } from 'date-fns';

interface StreakCalendarProps {
  completions: DailyCompletion[];
  currentStreak: number;
}

const StreakCalendar: React.FC<StreakCalendarProps> = ({ completions, currentStreak }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getCompletionForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return completions.find(c => c.challenge_date === dateStr);
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Activity Calendar
          </CardTitle>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span className="font-bold text-orange-500">{currentStreak} day streak</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map(day => {
            const completion = getCompletionForDate(day);
            const isPast = isBefore(day, new Date()) && !isToday(day);
            const hasCompleted = !!completion;
            
            return (
              <motion.div
                key={day.toISOString()}
                whileHover={{ scale: 1.05 }}
                className={`
                  aspect-square p-2 rounded-lg border text-center text-sm relative
                  ${isToday(day) ? 'border-primary bg-primary/10' : 'border-border'}
                  ${hasCompleted ? 'bg-green-500/20 border-green-500/50' : ''}
                  ${isPast && !hasCompleted ? 'bg-red-500/10 border-red-500/30' : ''}
                `}
              >
                <div className="font-medium">{format(day, 'd')}</div>
                {hasCompleted && (
                  <div className="text-xs text-green-600 mt-1">
                    {completion.score}%
                  </div>
                )}
                {isToday(day) && (
                  <div className="text-xs text-primary font-medium">Today</div>
                )}
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCalendar;