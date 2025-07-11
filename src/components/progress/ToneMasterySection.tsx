import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ToneType } from '@/utils/toneMessages';
import { useToneSystem } from '@/hooks/useToneSystem';

const ToneMasterySection: React.FC = () => {
  const { 
    selectedTone, 
    toneUsage, 
    getToneMasteryLevelForTone,
    isToneV2UnlockedForTone 
  } = useToneSystem();

  const AVAILABLE_TONES: ToneType[] = ['calm', 'playful', 'formal', 'sarcastic'];

  const getMasteryBadgeVariant = (level: number) => {
    if (level === 0) return "secondary";
    if (level === 1) return "default"; 
    return "destructive";
  };

  const getMasteryDescription = (level: number) => {
    if (level === 0) return "Unlock with 5 uses";
    if (level === 1) return "Basic personality unlocked";
    return "Full personality (Volume 2)";
  };

  const getProgressToNextLevel = (usage: number) => {
    if (usage < 5) return { current: usage, needed: 5, percentage: (usage / 5) * 100 };
    if (usage < 15) return { current: usage, needed: 15, percentage: (usage / 15) * 100 };
    return { current: 15, needed: 15, percentage: 100 };
  };

  const totalMasteryLevel = AVAILABLE_TONES.reduce((sum, tone) => 
    sum + getToneMasteryLevelForTone(tone), 0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Tone Mastery</span>
          <Badge variant="outline" className="text-xs">
            {totalMasteryLevel}/8 Levels
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          {AVAILABLE_TONES.map((tone) => {
            const usage = toneUsage[tone];
            const masteryLevel = getToneMasteryLevelForTone(tone);
            const hasV2 = isToneV2UnlockedForTone(tone);
            const isSelected = selectedTone === tone;
            const progress = getProgressToNextLevel(usage);

            return (
              <div 
                key={tone}
                className={`p-3 rounded-lg border transition-all ${
                  isSelected ? 'bg-primary/5 border-primary/20' : 'bg-muted/20 border-muted'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="capitalize font-medium text-sm">{tone}</span>
                    {isSelected && (
                      <Badge variant="outline" className="text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge 
                      variant={getMasteryBadgeVariant(masteryLevel) as any}
                      className="text-xs"
                    >
                      Level {masteryLevel}
                    </Badge>
                    {hasV2 && (
                      <Badge variant="outline" className="text-xs">
                        Vol 2 ✨
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {getMasteryDescription(masteryLevel)}
                    </span>
                    <span className="text-muted-foreground">
                      {usage} {usage === 1 ? 'use' : 'uses'}
                    </span>
                  </div>
                  
                  {masteryLevel < 2 && (
                    <div className="space-y-1">
                      <Progress value={progress.percentage} className="h-1" />
                      <div className="text-xs text-muted-foreground">
                        {progress.current}/{progress.needed} to {masteryLevel === 0 ? 'unlock' : 'Volume 2'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-muted">
          <div className="text-xs text-muted-foreground text-center">
            Use different tones to unlock their full personality and Volume 2 content.
            <br />
            Each tone evolves as you practice with it more.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ToneMasterySection;