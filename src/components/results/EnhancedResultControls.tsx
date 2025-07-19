
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RotateCcw, TrendingUp, Shuffle, Home, Calendar } from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface EnhancedResultControlsProps {
  onReplay: () => void;
  onViewStats?: () => void;
  accuracy: number;
  isDailyMode?: boolean;
  dailyCompleted?: boolean;
  isPenaltyMode?: boolean;
  sessionRoundsPlayed?: number;
  className?: string;
}

const EnhancedResultControls: React.FC<EnhancedResultControlsProps> = ({
  onReplay,
  onViewStats,
  accuracy,
  isDailyMode = false,
  dailyCompleted = false,
  isPenaltyMode = false,
  sessionRoundsPlayed = 0,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleSwitchMode = () => {
    navigate('/?view=modes');
  };

  const handleViewProgress = () => {
    navigate('/progress');
  };

  const handleHomeReturn = () => {
    navigate('/');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      className={`w-full max-w-sm space-y-3 ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Primary Actions - Always visible */}
      <motion.div className="space-y-2.5" variants={itemVariants}>
        {/* Try Again / Daily Completion Status */}
        {isDailyMode && dailyCompleted ? (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-3 text-center">
              <Calendar className="h-5 w-5 mx-auto mb-1.5 text-primary" />
              <p className="text-sm font-medium text-primary">Daily Calibration Complete</p>
              <p className="text-xs text-muted-foreground mt-1">
                Return tomorrow for your next session!
              </p>
            </CardContent>
          </Card>
        ) : (
          <Button
            onClick={onReplay}
            size="lg"
            className="w-full btn-game-primary"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            {isDailyMode ? 'Try Again' : 'Play Again'}
          </Button>
        )}

        {/* Secondary Actions Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <Button
            onClick={handleSwitchMode}
            variant="secondary"
            className="transition-smooth hover:scale-105"
          >
            <Shuffle className="mr-2 h-4 w-4" />
            Switch Mode
          </Button>
          
          <Button
            onClick={handleViewProgress}
            variant="outline"
            className="transition-smooth hover:scale-105"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Progress
          </Button>
        </div>
      </motion.div>

      {/* Additional Options */}
      <motion.div className="space-y-1.5" variants={itemVariants}>
        {onViewStats && sessionRoundsPlayed > 0 && (
          <Button
            onClick={onViewStats}
            variant="ghost"
            size="sm"
            className="w-full text-muted-foreground hover:text-foreground"
          >
            View Session Stats
          </Button>
        )}
        
        <Button
          onClick={handleHomeReturn}
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground hover:text-foreground"
        >
          <Home className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </motion.div>

      {/* Penalty Mode Indicator */}
      {isPenaltyMode && (
        <motion.div 
          className="text-center p-2 bg-destructive/10 border border-destructive/20 rounded-lg"
          variants={itemVariants}
        >
          <p className="text-xs text-destructive font-medium">
            ⚡ Penalty Mode Active - Precision Required!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EnhancedResultControls;
