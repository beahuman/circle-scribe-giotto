
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
}

const ResultControls: React.FC<ResultControlsProps> = ({
  onReplay,
  showLeaderboard,
  onShare,
  onRemoveAds,
  isPenaltyMode,
  className
}) => {
  return (
    <div className={cn("flex flex-col gap-3 w-full max-w-xs", className)}>
      <Button
        onClick={onReplay}
        className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-purple-400 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
      >
        {isPenaltyMode ? "Go to Shape Challenge" : "Draw Another Circle"}
      </Button>

      {showLeaderboard && (
        <Button
          onClick={showLeaderboard}
          variant="outline"
          className="px-8 py-6 text-lg rounded-full border border-primary/20"
        >
          Show Leaderboard
        </Button>
      )}

      {onShare && (
        <Button
          onClick={onShare}
          variant="ghost"
          className="px-8 py-2 rounded-full"
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
