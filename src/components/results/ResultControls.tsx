
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw, Calendar } from "lucide-react";

interface ResultControlsProps {
  onReplay: () => void;
  onViewStats?: () => void;
  showLeaderboard?: () => void;
  onShare: () => void;
  onRemoveAds?: () => void;
  isPenaltyMode?: boolean;
  accuracy: number;
  sessionRoundsPlayed?: number;
  isDailyMode?: boolean;
  dailyCompleted?: boolean;
  className?: string;
}

const ResultControls: React.FC<ResultControlsProps> = ({
  onReplay,
  onViewStats,
  showLeaderboard,
  onShare,
  onRemoveAds,
  isPenaltyMode,
  accuracy,
  sessionRoundsPlayed,
  isDailyMode = false,
  dailyCompleted = false,
  className
}) => {
  return (
    <div className={`flex flex-col gap-4 w-full max-w-xs ${className}`}>
      {isPenaltyMode && (
        <div className="text-sm text-red-500 font-medium animate-pulse-slow">
          Penalty Mode Active: Accuracy is crucial!
        </div>
      )}
      
      <div className="flex flex-col gap-3">
        {isDailyMode && dailyCompleted ? (
          <Button 
            onClick={onReplay}
            variant="outline"
            className="px-8 py-4 text-lg rounded-full opacity-50 cursor-not-allowed shadow-lg"
            disabled
          >
            <Calendar className="mr-2 h-5 w-5" />
            Come Back Tomorrow
          </Button>
        ) : (
          <Button 
            onClick={onReplay}
            className="px-8 py-4 text-lg font-semibold rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 animate-pulse"
            size="lg"
          >
            <RotateCcw className="mr-3 h-5 w-5" />
            {isDailyMode ? 'Try Again' : 'Play Again'}
          </Button>
        )}
        
        {onViewStats && (
          <Button 
            onClick={onViewStats}
            variant="secondary"
            className="px-6 py-3 rounded-full"
          >
            View Stats
          </Button>
        )}
        
        {showLeaderboard && (
          <Button 
            onClick={showLeaderboard}
            variant="outline"
            className="px-6 py-3 rounded-full"
          >
            Show Leaderboard
          </Button>
        )}
        
        <Button 
          onClick={onShare}
          variant="ghost"
          className="px-6 py-3 rounded-full"
        >
          Share Result
        </Button>
        
        {onRemoveAds && (
          <Button 
            onClick={onRemoveAds}
            variant="destructive"
            className="px-6 py-3 rounded-full"
          >
            Remove Ads
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResultControls;
