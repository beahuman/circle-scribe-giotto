
import React from 'react';
import { Button } from "@/components/ui/button";
import { SessionStats } from '@/types/game';
import { ArrowLeft, BarChart3, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

interface SessionStatsViewProps {
  stats: SessionStats;
  onBack: () => void;
  onResetSession: () => void;
  onDrawAgain: () => void;
}

const SessionStatsView: React.FC<SessionStatsViewProps> = ({ 
  stats, 
  onBack,
  onResetSession,
  onDrawAgain
}) => {
  const formatDuration = (startTime: number) => {
    const durationMs = Date.now() - startTime;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col items-center justify-start gap-8 p-6 pb-24"
    >
      <div className="space-y-2 mt-8">
        <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400 flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Session Stats
        </h2>
        <p className="text-muted-foreground">Your performance this session</p>
      </div>
      
      <div className="w-full max-w-md space-y-4 bg-background/50 p-6 rounded-xl shadow-sm border border-border/50">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Rounds Played</span>
          <span className="font-medium">{stats.roundsPlayed}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Average Accuracy</span>
          <span className="font-medium">{stats.averageAccuracy.toFixed(2)}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Highest Score</span>
          <span className="font-medium text-green-500">{stats.highestAccuracy.toFixed(2)}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Lowest Score</span>
          <span className="font-medium text-orange-500">{stats.lowestAccuracy.toFixed(2)}%</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-muted-foreground">Session Duration</span>
          <span className="font-medium">{formatDuration(stats.startTime)}</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button
          onClick={onDrawAgain}
          variant="premium"
          size="lg"
          className="px-8 py-6 text-lg"
        >
          Draw Another Circle
        </Button>
        
        <Button
          onClick={onBack}
          variant="outline"
          className="px-8 py-2 rounded-md flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Results
        </Button>
        
        <Button
          onClick={onResetSession}
          variant="ghost"
          className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <RefreshCcw className="h-3 w-3" />
          Reset Session
        </Button>
      </div>
    </motion.div>
  );
};

export default SessionStatsView;
