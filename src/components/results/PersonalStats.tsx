import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Target, Zap } from 'lucide-react';
import { ProgressStats } from '@/hooks/useLocalProgress';

interface PersonalStatsProps {
  stats: ProgressStats;
  currentScore: number;
  streakCount: number;
  className?: string;
}

const PersonalStats: React.FC<PersonalStatsProps> = ({
  stats,
  currentScore,
  streakCount,
  className = ""
}) => {
  // Calculate percentile (mock data for now - could be enhanced with real data)
  const calculatePercentile = (score: number) => {
    // Simple percentile calculation based on score
    if (score >= 95) return 99;
    if (score >= 90) return 95;
    if (score >= 85) return 90;
    if (score >= 80) return 85;
    if (score >= 75) return 75;
    if (score >= 70) return 65;
    if (score >= 60) return 50;
    if (score >= 50) return 35;
    if (score >= 40) return 25;
    return 15;
  };

  const percentile = calculatePercentile(currentScore);
  const isPersonalBest = currentScore > stats.bestScore;
  const improvement = stats.lastAttempt ? currentScore - stats.lastAttempt : 0;

  const statItems = [
    {
      icon: Trophy,
      label: "Personal Best",
      value: `${Math.max(stats.bestScore, currentScore).toFixed(1)}%`,
      isHighlight: isPersonalBest,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10"
    },
    {
      icon: TrendingUp,
      label: "3-Day Average", 
      value: `${stats.threeDayAverage.toFixed(1)}%`,
      isHighlight: false,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Target,
      label: "Percentile Rank",
      value: `${percentile}th`,
      isHighlight: percentile >= 90,
      color: "text-green-500", 
      bgColor: "bg-green-500/10"
    },
    {
      icon: Zap,
      label: "Current Streak",
      value: `${streakCount}`,
      isHighlight: streakCount >= 5,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10"
    }
  ];

  return (
    <div className={`space-y-4 ${className}`}>
      {/* New Personal Best Banner */}
      {isPersonalBest && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg p-4 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-yellow-600 dark:text-yellow-400">
            <Trophy className="h-5 w-5" />
            <span className="font-bold">New Personal Best!</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            You beat your previous best by {(currentScore - stats.bestScore).toFixed(1)} points
          </p>
        </motion.div>
      )}

      {/* Improvement Indicator */}
      {improvement !== 0 && !isPersonalBest && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`rounded-lg p-3 text-center border ${
            improvement > 0 
              ? 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400'
          }`}
        >
          <span className="text-sm font-medium">
            {improvement > 0 ? '+' : ''}{improvement.toFixed(1)} from last attempt
          </span>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
            className={`rounded-lg p-4 ${item.bgColor} border border-border/50 ${
              item.isHighlight ? 'ring-2 ring-primary/20' : ''
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <item.icon className={`h-4 w-4 ${item.color}`} />
              <span className="text-xs text-muted-foreground">{item.label}</span>
            </div>
            <div className={`text-lg font-bold ${item.color}`}>
              {item.value}
            </div>
            {item.isHighlight && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                className="inline-block w-2 h-2 bg-primary rounded-full mt-1"
              />
            )}
          </motion.div>
        ))}
      </div>

      {/* Games Played */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="text-center pt-2"
      >
        <p className="text-xs text-muted-foreground">
          {stats.totalGames} circles drawn • Keep practicing!
        </p>
      </motion.div>
    </div>
  );
};

export default PersonalStats;