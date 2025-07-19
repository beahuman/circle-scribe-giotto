
import React from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Clock, BarChart3, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useLocalProgress } from '@/hooks/useLocalProgress';
import { formatDistanceToNow } from 'date-fns';

interface ProgressDashboardProps {
  isOpen: boolean;
  onToggle: () => void;
}

const fadeVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ isOpen, onToggle }) => {
  const { gameResults, stats, clearResults } = useLocalProgress();

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-500';
  };

  return (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
      <CollapsibleTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full mb-4 border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5"
        >
          <BarChart3 className="mr-2 h-4 w-4" />
          Progress Dashboard
          <span className="ml-auto text-xs text-muted-foreground">
            {stats.totalGames} games
          </span>
        </Button>
      </CollapsibleTrigger>
      
      <CollapsibleContent>
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4 mb-6"
        >
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-2">
            <motion.div variants={fadeVariants}>
              <Card className="text-center">
                <CardContent className="p-4">
                  <Trophy className="h-4 w-4 mx-auto mb-1 text-yellow-500" />
                  <div className="text-lg font-bold">{stats.bestScore}%</div>
                  <div className="text-xs text-muted-foreground">Best</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeVariants}>
              <Card className="text-center">
                <CardContent className="p-4">
                  <TrendingUp className="h-4 w-4 mx-auto mb-1 text-blue-500" />
                  <div className="text-lg font-bold">{stats.threeDayAverage}%</div>
                  <div className="text-xs text-muted-foreground">3-Day Avg</div>
                </CardContent>
              </Card>
            </motion.div>
            
            <motion.div variants={fadeVariants}>
              <Card className="text-center">
                <CardContent className="p-4">
                  <Clock className="h-4 w-4 mx-auto mb-1 text-green-500" />
                  <div className="text-lg font-bold">
                    {stats.lastAttempt ? `${stats.lastAttempt}%` : '—'}
                  </div>
                  <div className="text-xs text-muted-foreground">Last</div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Recent Results */}
          {gameResults.length > 0 && (
            <motion.div variants={fadeVariants}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm flex items-center justify-between">
                    Recent Results
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearResults}
                      className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {gameResults.map((result, index) => (
                      <div 
                        key={result.id}
                        className="flex items-center justify-between text-sm py-1 border-b border-border/50 last:border-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground w-6">
                            #{gameResults.length - index}
                          </span>
                          <span className={`font-medium ${getScoreColor(result.score)}`}>
                            {result.score}%
                          </span>
                          {result.isPenalty && (
                            <span className="text-xs text-orange-500 font-medium">P</span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(result.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {gameResults.length === 0 && (
            <motion.div variants={fadeVariants}>
              <Card>
                <CardContent className="p-6 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-sm text-muted-foreground">
                    No games played yet. Start practicing to see your progress!
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ProgressDashboard;
