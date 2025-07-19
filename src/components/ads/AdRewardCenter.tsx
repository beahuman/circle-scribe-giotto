
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Gift, 
  Sparkles, 
  Eye,
} from "lucide-react";
import { useRewardedAds } from "@/hooks/useRewardedAds";
import { useSubscription } from "@/hooks/useSubscription";
import NeuroscienceTipsModal from "./NeuroscienceTipsModal";
import AdRewardButton from "./AdRewardButton";
import UnifiedCard from "../home/UnifiedCard";

const AdRewardCenter: React.FC = () => {
  const { canWatchAd, remainingAds, dailyAdsWatched, maxDailyAds } = useRewardedAds();
  const { isPremium } = useSubscription();
  const [showTipsModal, setShowTipsModal] = useState(false);

  // Don't show for premium users with no ads left
  if (isPremium && remainingAds <= 0) {
    return null;
  }

  // Don't show if no ads available
  if (remainingAds <= 0) {
    return null;
  }

  return (
    <>
      <UnifiedCard variant="accent" className="border-dashed border-primary/30">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Earn Rewards</h3>
              {!isPremium && (
                <Badge variant="secondary" className="text-xs">
                  {remainingAds} left today
                </Badge>
              )}
            </div>
            
            <div className="text-xs text-muted-foreground">
              {dailyAdsWatched}/{maxDailyAds} watched
            </div>
          </div>

          {/* Available Rewards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <AdRewardButton 
              type="xp" 
              size="sm"
              className="h-auto py-3 flex flex-col gap-1"
            />
            
            <AdRewardButton 
              type="calibration" 
              size="sm"
              className="h-auto py-3 flex flex-col gap-1"
            />
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowTipsModal(true)}
              disabled={!canWatchAd}
              className="h-auto py-3 flex flex-col gap-1 border-purple-500/30 bg-gradient-to-r from-purple-500/5 to-purple-500/10 hover:scale-[1.02] transition-all"
            >
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>Pro Tips</span>
                <Sparkles className="h-3 w-3" />
              </div>
            </Button>
          </div>

          {/* Info Text */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Eye className="h-3 w-3" />
            <span>Watch short ads to earn bonus rewards</span>
          </div>
        </div>
      </UnifiedCard>

      <NeuroscienceTipsModal 
        open={showTipsModal}
        onOpenChange={setShowTipsModal}
      />
    </>
  );
};

export default AdRewardCenter;
