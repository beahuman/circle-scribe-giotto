import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Medal, TrendingUp, Star, Lock, ChevronRight, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useDailyCalibration } from '@/hooks/useDailyCalibration';
import { useLocalProgress } from '@/hooks/useLocalProgress';
import { useBadgeSystem } from '@/hooks/useBadgeSystem';
import { usePlayerProgress } from '@/hooks/usePlayerProgress';
import { useSettings } from '@/hooks/useSettings';

const Progress: React.FC = () => {
  const { settings } = useSettings();
  const { streak, weekHistory, todaysCompletion } = useDailyCalibration();
  const { stats, gameResults } = useLocalProgress();
  const { getBadgeProgress } = useBadgeSystem();
  const { level, xp, xpInCurrentLevel, xpForNextLevel } = usePlayerProgress();
  const [showAnalytics, setShowAnalytics] = useState(false);

  const badgeProgress = getBadgeProgress();
  const unlockedBadges = badgeProgress.filter(b => b.unlocked);
  const nextBadges = badgeProgress.filter(b => !b.unlocked).slice(0, 3);

  const getWelcomeMessage = () => {
    const tone = settings.feedbackTone || 'meditative';
    switch (tone) {
      case 'playful':
        return "You're getting dangerously round.";
      case 'formal':
        return "Neuro-performance summary";
      case 'sarcastic':
        return "Wow. You again.";
      default:
        return "Precision is earned with patience.";
    }
  };

  const getUnlockableFeatures = () => {
    const currentStreak = streak.current;
    const features = [
      { 
        name: "New Brush Style", 
        requirement: 3, 
        unlocked: currentStreak >= 3,
        description: "Unlock elegant brush textures"
      },
      { 
        name: "Blind Draw Mode", 
        requirement: 7, 
        unlocked: currentStreak >= 7,
        description: "Challenge yourself without visual guides"
      },
      { 
        name: "Alternate Themes", 
        requirement: 14, 
        unlocked: currentStreak >= 14,
        description: "Beautiful new color palettes"
      }
    ];
    return features;
  };

  const generateShareableCard = () => {
    const tone = settings.feedbackTone || 'meditative';
    let caption = "";
    
    switch (tone) {
      case 'playful':
        caption = `Day ${streak.current} – ${stats.lastAttempt}% – Circle power increasing! 🎯`;
        break;
      case 'sarcastic':
        caption = `Day ${streak.current} – ${stats.lastAttempt}% – My hand's smarter than your app. 😏`;
        break;
      case 'formal':
        caption = `Performance Log: Day ${streak.current}, Score ${stats.lastAttempt}%, Neural pathways optimizing.`;
        break;
      default:
        caption = `Day ${streak.current} streak. ${stats.lastAttempt}% precision. Come draw with me. 🧘‍♂️`;
    }
    
    return caption;
  };

  const handleShare = async () => {
    const shareText = generateShareableCard();
    const shareUrl = window.location.origin;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Giotto Progress",
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        // Add toast notification here if needed
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white pb-20">
      <div className="max-w-md mx-auto p-6 space-y-6">
        {/* Overview Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-purple-400 rounded-full flex items-center justify-center mb-4">
            <TrendingUp className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-light text-slate-800">Your Progress</h1>
          <p className="text-slate-600 font-light italic">{getWelcomeMessage()}</p>
          
          {/* Level & XP Display */}
          <Card className="bg-gradient-to-r from-primary/10 to-purple-400/10 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700">Level {level}</span>
                <span className="text-xs text-slate-500">{xpInCurrentLevel}/{xpForNextLevel} XP</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-purple-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(xpInCurrentLevel / xpForNextLevel) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Streak Overview */}
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

        {/* Daily Score Timeline */}
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

        {/* Best Performances */}
        {topPerformances.length > 0 && (
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
        )}

        {/* Badges & Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="h-5 w-5" />
                Achievements ({unlockedBadges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {unlockedBadges.length > 0 ? (
                <div className="grid grid-cols-3 gap-3">
                  {unlockedBadges.slice(0, 6).map((badgeProgress) => (
                    <motion.div
                      key={badgeProgress.badge.id}
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-3 bg-gradient-to-br from-primary/10 to-purple-400/10 rounded-lg"
                    >
                      <div className="text-2xl mb-1">{badgeProgress.badge.icon}</div>
                      <div className="text-xs font-medium text-slate-700">
                        {badgeProgress.badge.name}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-slate-500">
                  <Star className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No badges earned yet</p>
                  <p className="text-xs">Keep practicing to unlock achievements!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Unlockable Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="h-5 w-5" />
                Unlockable Features
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getUnlockableFeatures().map((feature) => (
                <motion.div
                  key={feature.name}
                  whileHover={feature.unlocked ? { scale: 1.02 } : {}}
                  className={`p-4 rounded-lg border transition-all ${
                    feature.unlocked 
                      ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200' 
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className={`font-medium ${feature.unlocked ? 'text-green-700' : 'text-slate-600'}`}>
                        {feature.name}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">{feature.description}</div>
                      {!feature.unlocked && (
                        <div className="text-xs text-orange-600 mt-1">
                          {feature.requirement - streak.current} more streak days to unlock
                        </div>
                      )}
                    </div>
                    {feature.unlocked ? (
                      <div className="text-green-500 text-xl">✓</div>
                    ) : (
                      <Lock className="h-4 w-4 text-slate-400" />
                    )}
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Badge Rewards */}
        {nextBadges.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Star className="h-5 w-5" />
                  Upcoming Badges
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {nextBadges.map((badgeProgress) => (
                  <div key={badgeProgress.badge.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg opacity-60">
                    <div className="flex items-center gap-3">
                      <div className="text-lg opacity-50">{badgeProgress.badge.icon}</div>
                      <div>
                        <div className="font-medium text-slate-700">{badgeProgress.badge.name}</div>
                        <div className="text-xs text-slate-500">{badgeProgress.badge.description}</div>
                      </div>
                    </div>
                    <Lock className="h-4 w-4 text-slate-400" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Share Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-primary/5 to-purple-400/5 border-primary/20">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-slate-800 mb-2">Share Your Progress</h3>
              <p className="text-sm text-slate-600 mb-4">
                Show others your circle mastery journey
              </p>
              <Button 
                onClick={handleShare}
                className="w-full bg-gradient-to-r from-primary to-purple-400 hover:from-primary/90 hover:to-purple-400/90"
              >
                Share Progress Card
              </Button>
              <div className="mt-3 p-3 bg-white/50 rounded-lg text-xs text-slate-500 italic">
                Preview: "{generateShareableCard()}"
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Analytics Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
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
      </div>
    </div>
  );
};

export default Progress;