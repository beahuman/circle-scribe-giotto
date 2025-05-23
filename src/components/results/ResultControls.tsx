
import React from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ResultControlsProps {
  onReplay: () => void;
  showLeaderboard?: () => void;
  onShare?: () => void;
  onRemoveAds?: () => void;
  isPenaltyMode?: boolean;
  className?: string;
  accuracy?: number;
}

const ResultControls: React.FC<ResultControlsProps> = ({
  onReplay,
  showLeaderboard,
  onShare,
  onRemoveAds,
  isPenaltyMode,
  className,
  accuracy = 0
}) => {
  // Neural-inspired transitions - more satisfying animations for higher scores
  const getButtonStyles = () => {
    if (accuracy >= 90) {
      // Highly rewarding visual for excellent performance
      return "from-primary to-purple-500 hover:from-primary hover:to-purple-400 shadow-lg shadow-primary/30 transition-all duration-500 hover:shadow-xl hover:shadow-primary/40 hover:scale-105";
    } else if (accuracy >= 70) {
      // Good performance
      return "from-primary to-purple-400 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20";
    } else {
      // Standard style for lower scores
      return "from-primary to-purple-400 hover:opacity-90 transition-opacity shadow-md shadow-primary/10";
    }
  };
  
  const buttonAnimation = accuracy >= 85 ? "animate-subtle-pulse" : "";
  const buttonStyles = getButtonStyles();

  return (
    <div className={cn("flex flex-col gap-3 w-full max-w-xs", className)}>
      <Button
        onClick={onReplay}
        className={cn(
          "px-8 py-6 text-lg rounded-full bg-gradient-to-r", 
          buttonStyles,
          buttonAnimation
        )}
      >
        {isPenaltyMode ? "Go to Shape Challenge" : "Draw Another Circle"}
      </Button>

      {showLeaderboard && (
        <Button
          onClick={showLeaderboard}
          variant="outline"
          className={cn(
            "px-8 py-6 text-lg rounded-full border border-primary/20",
            accuracy >= 85 ? "hover:border-primary/50 transition-colors duration-300" : ""
          )}
        >
          Show Leaderboard
        </Button>
      )}

      {onShare && (
        <Button
          onClick={onShare}
          variant="ghost"
          className={cn(
            "px-8 py-2 rounded-full",
            accuracy >= 90 ? "text-primary hover:text-primary/80" : ""
          )}
        >
          Share Result
        </Button>
      )}
      
      {onRemoveAds && (
        <Button
          onClick={onRemoveAds}
          variant="ghost"
          className="text-sm text-muted-foreground hover:text-primary"
        >
          Remove Ads
        </Button>
      )}
    </div>
  );
};

export default ResultControls;
