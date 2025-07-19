import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw, Calendar, Zap, Gift } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import AdRewardButton from "@/components/ads/AdRewardButton";
import { useSubscription } from "@/hooks/useSubscription";
import { useRewardedAds } from "@/hooks/useRewardedAds";

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
  const { isPremium } = useSubscription();
  const { canWatchAd, remainingAds } = useRewardedAds();
  const showAdRewards = !isPremium && canWatchAd && remainingAds > 0;

  return (
    <div className={`flex flex-col gap-6 w-full max-w-md mx-auto ${className}`}>
      {isPenaltyMode && (
        <div className="text-sm text-red-500 font-medium animate-pulse-slow text-center">
          Penalty Mode Active: Accuracy is crucial!
        </div>
      )}
      
      {/* Primary Action - Always Full Width */}
      <div className="flex justify-center w-full">
        {isDailyMode && dailyCompleted ? (
          <Button 
            onClick={onReplay}
            variant="outline"
            className="w-full px-8 py-4 text-lg rounded-xl opacity-50 cursor-not-allowed shadow-md min-h-[56px]"
            disabled
          >
            <Calendar className="mr-2 h-5 w-5" />
            Come Back Tomorrow
          </Button>
        ) : (
          <Button 
            onClick={onReplay}
            size="lg"
            className="w-full px-8 py-4 text-lg font-semibold rounded-xl animate-pulse min-h-[56px]"
          >
            <RotateCcw className="mr-3 h-5 w-5" />
            {isDailyMode ? 'Try Again' : 'Play Again'}
          </Button>
        )}
      </div>

      {/* Ad Reward Section */}
      {showAdRewards && !isDailyMode && (
        <Card className="border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-purple-400/5 w-full">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Gift className="h-4 w-4 text-primary" />
                <span className="font-medium">Earn Bonus Rewards</span>
              </div>
              
              <div className="flex gap-2">
                <AdRewardButton 
                  type="xp" 
                  size="sm"
                  className="flex-1 h-auto py-2 text-xs"
                />
              </div>
              
              <p className="text-xs text-muted-foreground text-center">
                Watch a short ad to boost your XP
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Secondary Actions - Grid Layout */}
      <div className="grid sm:grid-cols-2 gap-4">
        {onViewStats && (
          <Button 
            onClick={onViewStats}
            variant="secondary"
            className="w-full px-6 py-3 rounded-xl min-h-[48px]"
          >
            View Stats
          </Button>
        )}
        
        {showLeaderboard && (
          <Button 
            onClick={showLeaderboard}
            variant="outline"
            className="w-full px-6 py-3 rounded-xl min-h-[48px]"
          >
            Show Leaderboard
          </Button>
        )}
        
        <Button 
          onClick={onShare}
          variant="ghost"
          className="w-full px-6 py-3 rounded-xl min-h-[48px] sm:col-span-1"
        >
          Share Result
        </Button>
        
        {onRemoveAds && !isPremium && (
          <Button 
            onClick={onRemoveAds}
            variant="destructive"
            className="w-full px-6 py-3 rounded-xl min-h-[48px]"
          >
            Remove Ads
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResultControls;