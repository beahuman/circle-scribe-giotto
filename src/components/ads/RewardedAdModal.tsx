import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Gift, 
  Star, 
  Clock, 
  Zap,
  Brain,
  Target,
  Loader
} from "lucide-react";
import { useRewardedAds } from "@/hooks/useRewardedAds";

interface RewardedAdModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rewardType: 'xp' | 'calibration' | 'tips';
  rewardDescription: string;
  rewardValue: string;
}

const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  open,
  onOpenChange,
  rewardType,
  rewardDescription,
  rewardValue
}) => {
  const { showRewardedAd, loading, canWatchAd, nextAdAvailable, remainingAds } = useRewardedAds();

  const handleWatchAd = async () => {
    const success = await showRewardedAd(rewardType);
    if (success) {
      onOpenChange(false);
    }
  };

  const getRewardIcon = () => {
    switch (rewardType) {
      case 'xp': return <Zap className="h-6 w-6 text-primary" />;
      case 'calibration': return <Target className="h-6 w-6 text-blue-500" />;
      case 'tips': return <Brain className="h-6 w-6 text-purple-500" />;
    }
  };

  const getRewardColor = () => {
    switch (rewardType) {
      case 'xp': return 'from-primary/10 to-primary/5';
      case 'calibration': return 'from-blue-500/10 to-blue-500/5';
      case 'tips': return 'from-purple-500/10 to-purple-500/5';
    }
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            {getRewardIcon()}
          </div>
          <DialogTitle className="text-xl">
            Earn Reward
          </DialogTitle>
          <DialogDescription>
            Watch a short ad to unlock your reward
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Reward Preview */}
          <Card className={`border-2 bg-gradient-to-r ${getRewardColor()}`}>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Gift className="h-5 w-5" />
                <span className="font-semibold">Your Reward</span>
              </div>
              <div className="text-2xl font-bold mb-1">{rewardValue}</div>
              <p className="text-sm text-muted-foreground">{rewardDescription}</p>
            </CardContent>
          </Card>

          {/* Ad Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>~30 second video</span>
            </div>
            
            <div className="flex items-center justify-center gap-4 text-xs">
              <Badge variant="secondary">
                {remainingAds} ads left today
              </Badge>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-4">
            {canWatchAd ? (
              <Button 
                onClick={handleWatchAd}
                disabled={loading}
                className="w-full h-12 text-base"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 mr-2 animate-spin" />
                    Loading Ad...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Watch Ad & Claim Reward
                  </>
                )}
              </Button>
            ) : (
              <div className="text-center space-y-2">
                <Button disabled className="w-full h-12">
                  <Clock className="h-4 w-4 mr-2" />
                  Next ad in {formatTime(nextAdAvailable)}
                </Button>
                <p className="text-xs text-muted-foreground">
                  Ads are limited to prevent interruption to your practice
                </p>
              </div>
            )}

            <Button 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RewardedAdModal;