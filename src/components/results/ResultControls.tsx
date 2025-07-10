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
    <div className={`flex flex-col gap-4 w-full max-w-xs ${className}`}>
      {isPenaltyMode && (
        <div className="text-sm text-red-500 font-medium animate-pulse-slow">
          Penalty Mode Active: Accuracy is crucial!
        </div>
      )}
      
      <div className="flex flex-col gap-4">
        {isDailyMode && dailyCompleted ? (
          <Button 
            onClick={onReplay}
            variant="outline"
            className="px-8 py-4 text-lg rounded-full opacity-50 cursor-not-allowed shadow-lg min-h-[56px]"
            disabled
          >
            <Calendar className="mr-2 h-5 w-5" />
            Come Back Tomorrow
          </Button>
        ) : (
          <Button 
            onClick={onReplay}
            className="px-8 py-4 text-lg font-semibold rounded-full bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 animate-pulse min-h-[56px]"
            size="lg"
          >
            <RotateCcw className="mr-3 h-5 w-5" />
            {isDailyMode ? 'Try Again' : 'Play Again'}
          </Button>
        )}

        {/* Ad Reward Section */}
        {showAdRewards && !isDailyMode && (
          <Card className="border-dashed border-primary/30 bg-gradient-to-r from-primary/5 to-purple-400/5">
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
        
        {onViewStats && (
          <Button 
            onClick={onViewStats}
            variant="secondary"
            className="px-6 py-3 rounded-full min-h-[48px]"
          >
            View Stats
          </Button>
        )}
        
        {showLeaderboard && (
          <Button 
            onClick={showLeaderboard}
            variant="outline"
            className="px-6 py-3 rounded-full min-h-[48px]"
          >
            Show Leaderboard
          </Button>
        )}
        
        <Button 
          onClick={onShare}
          variant="ghost"
          className="px-6 py-3 rounded-full min-h-[48px]"
        >
          Share Result
        </Button>
        
        {onRemoveAds && !isPremium && (
          <Button 
            onClick={onRemoveAds}
            variant="destructive"
            className="px-6 py-3 rounded-full min-h-[48px]"
          >
            Remove Ads
          </Button>
        )}
      </div>
    </div>
  );
};

export default ResultControls;