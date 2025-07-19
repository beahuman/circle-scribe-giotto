import React from 'react';
import { motion } from 'framer-motion';
import { 
  RotateCcw, 
  BarChart3, 
  Trophy, 
  Share, 
  Settings,
  ShieldOff,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GamifiedResultControlsProps {
  onReplay: () => void;
  onViewStats?: () => void;
  showLeaderboard?: () => void;
  onRemoveAds?: () => void;
  onChangeFeedbackTone: () => void;
  isPenaltyMode?: boolean;
  accuracy: number;
  sessionRoundsPlayed?: number;
  isDailyMode?: boolean;
  dailyCompleted?: boolean;
}

const GamifiedResultControls: React.FC<GamifiedResultControlsProps> = ({
  onReplay,
  onViewStats,
  showLeaderboard,
  onRemoveAds,
  onChangeFeedbackTone,
  isPenaltyMode = false,
  accuracy,
  sessionRoundsPlayed = 0,
  isDailyMode = false,
  dailyCompleted = false
}) => {
  const handleShare = async () => {
    const shareText = `I just scored ${accuracy.toFixed(1)}% on Giotto! ${
      isPenaltyMode ? '(Penalty Mode)' : ''
    } Can you draw a better circle? 🎯`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Giotto - Perfect Circle Challenge',
          text: shareText,
          url: window.location.origin
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        // You could show a toast here
      } catch (error) {
        console.error('Failed to copy to clipboard');
      }
    }
  };

  const primaryActions = [
    {
      icon: RotateCcw,
      label: isDailyMode && dailyCompleted ? 'Back to Home' : 'Try Again',
      onClick: onReplay,
      variant: 'default' as const,
      className: 'px-8 py-3 text-base font-medium'
    }
  ];

  const secondaryActions = [
    ...(onViewStats ? [{
      icon: BarChart3,
      label: 'View Stats',
      onClick: onViewStats
    }] : []),
    ...(showLeaderboard ? [{
      icon: Trophy,
      label: 'Leaderboard',
      onClick: showLeaderboard
    }] : []),
    {
      icon: Share,
      label: 'Share Result',
      onClick: handleShare
    },
    {
      icon: Settings,
      label: 'Feedback Style',
      onClick: onChangeFeedbackTone
    },
    ...(onRemoveAds && sessionRoundsPlayed >= 3 ? [{
      icon: ShieldOff,
      label: 'Remove Ads',
      onClick: onRemoveAds
    }] : [])
  ];

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* Primary Action - Full Width Button */}
      <div className="w-full">
        {primaryActions.map((action, index) => {
          const IconComponent = action.icon;
          
          return (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="w-full"
            >
              <Button
                onClick={action.onClick}
                variant={action.variant}
                className={`w-full min-h-[56px] rounded-xl px-8 py-4 ${action.className}`}
              >
                <IconComponent className="h-5 w-5 mr-2" />
                {action.label}
              </Button>
            </motion.div>
          );
        })}
      </div>

      {/* Secondary Actions Grid - Responsive Layout */}
      {secondaryActions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {secondaryActions.map((action, index) => {
            const IconComponent = action.icon;
            
            return (
              <motion.div
                key={action.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="w-full"
              >
                <Button
                  onClick={action.onClick}
                  variant="outline"
                  className="w-full min-h-[48px] rounded-xl py-3 hover:bg-muted/80 transition-colors"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  <span className="text-sm">{action.label}</span>
                </Button>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Performance Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-xs text-muted-foreground space-y-1 pt-2"
      >
        {isPenaltyMode && (
          <p className="text-orange-500 font-medium">⚡ Penalty Mode Active</p>
        )}
        {sessionRoundsPlayed > 0 && (
          <p>Session: {sessionRoundsPlayed} round{sessionRoundsPlayed !== 1 ? 's' : ''}</p>
        )}
      </motion.div>
    </div>
  );
};

export default GamifiedResultControls;