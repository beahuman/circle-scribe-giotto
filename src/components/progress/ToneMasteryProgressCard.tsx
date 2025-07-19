import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, Volume2, Sparkles } from 'lucide-react';
import { useToneSystem } from '@/hooks/useToneSystem';
import { ToneType } from '@/utils/toneMessages';

const ToneMasteryProgressCard: React.FC = () => {
  const { selectedTone, toneMastery } = useToneSystem();
  
  const masteryProgress = toneMastery.getToneLoyaltyProgress(selectedTone);
  const masteryLevel = toneMastery.getToneMasteryLevel(selectedTone);
  const totalPoints = toneMastery.getTotalMasteryPoints();
  const mostMastered = toneMastery.getMostMasteredTone();
  
  const getMasteryIcon = (level: number) => {
    switch (level) {
      case 3: return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2: return <Volume2 className="h-4 w-4 text-blue-500" />;
      case 1: return <Sparkles className="h-4 w-4 text-green-500" />;
      default: return <Star className="h-4 w-4 text-gray-400" />;
    }
  };

  const getMasteryBadgeVariant = (level: number) => {
    switch (level) {
      case 3: return "default";
      case 2: return "secondary";
      case 1: return "outline";
      default: return "secondary";
    }
  };

  const getMasteryDescription = (level: number) => {
    switch (level) {
      case 3: return "Advanced Variant Unlocked";
      case 2: return "Volume 2 Unlocked";
      case 1: return "Bonus Feedback Unlocked";
      default: return "Start building mastery";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            <span>Tone Mastery Progress</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {totalPoints} Total Points
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Tone Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getMasteryIcon(masteryLevel)}
              <span className="font-medium capitalize">{selectedTone} Tone</span>
            </div>
            <Badge variant={getMasteryBadgeVariant(masteryLevel) as any} className="text-xs">
              Level {masteryLevel}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {getMasteryDescription(masteryLevel)}
              </span>
              <span className="font-medium">
                {masteryProgress.current}/{masteryProgress.target} points
              </span>
            </div>
            
            <Progress value={masteryProgress.percentage} className="h-2" />
            
            <div className="text-xs text-muted-foreground">
              Next: {masteryProgress.nextReward}
            </div>
          </div>
        </div>

        {/* Most Mastered Tone */}
        {mostMastered && mostMastered.tone !== selectedTone && (
          <div className="pt-3 border-t border-border">
            <div className="text-sm font-medium mb-2">🏆 Most Mastered</div>
            <div className="flex items-center justify-between text-sm">
              <span className="capitalize text-muted-foreground">{mostMastered.tone} tone</span>
              <span className="font-medium">{mostMastered.points} points</span>
            </div>
          </div>
        )}

        {/* Mastery System Explanation */}
        <div className="pt-3 border-t border-muted">
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <div>Earn +1 point per draw with your selected tone</div>
            <div>Switching tones costs -3 points from previous tone</div>
            <div>Build loyalty to unlock Giotto's deeper personality</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToneMasteryProgressCard;