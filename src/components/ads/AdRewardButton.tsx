import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Target, 
  Brain, 
  Play,
  Gift,
  Sparkles
} from "lucide-react";
import { useRewardedAds } from "@/hooks/useRewardedAds";
import { useSubscription } from "@/hooks/useSubscription";
import RewardedAdModal from "./RewardedAdModal";

interface AdRewardButtonProps {
  type: 'xp' | 'calibration' | 'tips';
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

const AdRewardButton: React.FC<AdRewardButtonProps> = ({ 
  type, 
  className = "",
  size = "default",
  variant = "outline"
}) => {
  const { canWatchAd, remainingAds, loading } = useRewardedAds();
  const { isPremium } = useSubscription();
  const [showModal, setShowModal] = useState(false);

  // Premium users see fewer ads but still get some options
  if (isPremium && type !== 'tips') {
    return null;
  }

  if (remainingAds <= 0) {
    return null;
  }

  const getButtonConfig = () => {
    switch (type) {
      case 'xp':
        return {
          icon: <Zap className="h-4 w-4" />,
          label: "Bonus XP",
          description: "Watch ad for bonus XP",
          rewardValue: "25-50 XP",
          rewardDescription: "Bonus experience points to level up faster",
          bgClass: "border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10",
        };
      case 'calibration':
        return {
          icon: <Target className="h-4 w-4" />,
          label: "Extra Try",
          description: "Get an extra calibration attempt",
          rewardValue: "+1 Attempt",
          rewardDescription: "Additional daily calibration attempt",
          bgClass: "border-blue-500/30 bg-gradient-to-r from-blue-500/5 to-blue-500/10",
        };
      case 'tips':
        return {
          icon: <Brain className="h-4 w-4" />,
          label: "Pro Tip",
          description: "Unlock neuroscience insights",
          rewardValue: "Premium Tip",
          rewardDescription: "Exclusive motor learning and neuroscience insights",
          bgClass: "border-purple-500/30 bg-gradient-to-r from-purple-500/5 to-purple-500/10",
        };
    }
  };

  const config = getButtonConfig();

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowModal(true)}
        disabled={!canWatchAd || loading}
        className={`${config.bgClass} hover:scale-[1.02] transition-all ${className}`}
      >
        <div className="flex items-center gap-2">
          {config.icon}
          <span>{config.label}</span>
          <Gift className="h-3 w-3" />
        </div>
      </Button>

      <RewardedAdModal
        open={showModal}
        onOpenChange={setShowModal}
        rewardType={type}
        rewardDescription={config.rewardDescription}
        rewardValue={config.rewardValue}
      />
    </>
  );
};

export default AdRewardButton;