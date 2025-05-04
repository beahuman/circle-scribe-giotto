
import React from 'react';
import { Button } from "@/components/ui/button";
import { Trophy, Share2, BadgeDollarSign } from "lucide-react";

interface ResultControlsProps {
  onReplay: () => void;
  showLeaderboard?: () => void;
  onShare: () => void;
  onRemoveAds?: () => void;
  isPenaltyMode: boolean;
}

const ResultControls: React.FC<ResultControlsProps> = ({
  onReplay,
  showLeaderboard,
  onShare,
  onRemoveAds,
  isPenaltyMode
}) => {
  return (
    <div className="flex flex-col gap-4 w-full max-w-xs mb-20">
      <Button 
        onClick={onReplay}
        className="px-8 py-6 text-lg rounded-full bg-gradient-to-r from-primary to-purple-400 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
      >
        {isPenaltyMode ? "Start Shape Challenge" : "Try Again"}
      </Button>
      
      {showLeaderboard && !isPenaltyMode && (
        <Button 
          onClick={showLeaderboard}
          variant="secondary"
          className="px-8 py-6 text-lg rounded-full border border-[#765ED8] text-[#765ED8] bg-white hover:bg-[#765ED8]/10"
        >
          <Trophy className="mr-2 h-5 w-5" />
          View Leaderboard
        </Button>
      )}

      <Button 
        onClick={onShare}
        variant="secondary"
        className="px-8 py-6 text-lg rounded-full bg-white border-[#765ED8] border text-[#765ED8] hover:bg-[#765ED8]/5"
      >
        <Share2 className="mr-2 h-5 w-5" />
        Share Score
      </Button>

      {onRemoveAds && (
        <Button
          onClick={onRemoveAds}
          variant="ghost"
          className="text-yellow-500 hover:text-yellow-600 hover:bg-transparent"
        >
          <BadgeDollarSign className="h-5 w-5" />
          Remove Ads
        </Button>
      )}
    </div>
  );
};

export default ResultControls;
