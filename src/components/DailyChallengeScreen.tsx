import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Trophy, Flame, Target, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useDailyChallenges } from '@/hooks/useDailyChallenges';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, isBefore } from 'date-fns';

interface DailyChallengeScreenProps {
  onStartChallenge: () => void;
  onBack: () => void;
}

const DailyChallengeScreen: React.FC<DailyChallengeScreenProps> = ({ onStartChallenge, onBack }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const {
    todaysChallenge,
    todaysCompletion,
    weekChallenges,
    weekCompletions,
    currentStreak,
    longestStreak,
    userBadges,
    isLoading
  } = useDailyChallenges();

  const getDifficultyColor = (level: number) => {
    const colors = {
      1: 'bg-success text-white',
      2: 'bg-info text-white', 
      3: 'bg-warning text-foreground',
      4: 'bg-warning text-white',
      5: 'bg-destructive text-destructive-foreground'
    };
    return colors[level as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const getDifficultyLabel = (level: number) => {
    const labels = {
      1: 'Novice',
      2: 'Apprentice',
      3: 'Skilled', 
      4: 'Expert',
      5: 'Master'
    };
    return labels[level as keyof typeof labels] || 'Unknown';
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  // Calendar logic
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getCompletionForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return weekCompletions.find(c => c.challenge_date === dateStr);
  };

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 p-4 pb-20">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Daily Challenges
          </h1>
          <div className="w-20" />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Flame className="h-6 w-6 mx-auto mb-2 text-orange-500" />
              <div className="text-2xl font-bold text-orange-500">{currentStreak}</div>
              <div className="text-xs text-muted-foreground">Current Streak</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Star className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold text-yellow-500">{longestStreak}</div>
              <div className="text-xs text-muted-foreground">Best Streak</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="text-2xl font-bold text-primary">{userBadges.length}</div>
              <div className="text-xs text-muted-foreground">Badges</div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Challenge */}
        {todaysChallenge && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Today's Challenge
                <Badge className={getDifficultyColor(todaysChallenge.difficulty_level)}>
                  Level {todaysChallenge.difficulty_level} - {getDifficultyLabel(todaysChallenge.difficulty_level)}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Target Score</p>
                  <p className="text-2xl font-bold">{todaysChallenge.target_score}%</p>
                </div>
                {todaysCompletion && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Your Score</p>
                    <p className="text-2xl font-bold text-green-500">{todaysCompletion.score}%</p>
                    <p className="text-xs text-muted-foreground">
                      {todaysCompletion.attempts} attempt{todaysCompletion.attempts !== 1 ? 's' : ''}
                    </p>
                  </div>
                )}
              </div>
              
              {!todaysCompletion ? (
                <Button 
                  onClick={onStartChallenge}
                  className="w-full"
                  size="lg"
                >
                  Start Today's Challenge
                </Button>
              ) : (
                <div className="text-center p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="text-green-600 font-medium mb-1">✓ Challenge Completed!</div>
                  <p className="text-sm text-muted-foreground">Come back tomorrow for a new challenge</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Calendar View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Progress Calendar
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={prevMonth}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-32 text-center">
                  {format(currentMonth, 'MMMM yyyy')}
                </span>
                <Button variant="outline" size="sm" onClick={nextMonth}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
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
                      aspect-square p-2 rounded-lg border text-center text-sm
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
            
            {/* Legend */}
            <div className="flex items-center justify-center gap-6 mt-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded border-green-500/50 bg-green-500/20"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded border-primary bg-primary/10"></div>
                <span>Today</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded border-red-500/30 bg-red-500/10"></div>
                <span>Missed</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Badges */}
        {userBadges.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Recent Badges
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userBadges.slice(0, 4).map(badge => (
                  <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border"
                  >
                    <div className="text-2xl">{badge.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{badge.name}</span>
                        <Badge className={`text-xs ${getRarityColor(badge.rarity)}`}>
                          {badge.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{badge.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DailyChallengeScreen;