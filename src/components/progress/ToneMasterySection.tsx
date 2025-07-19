import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Palette, Volume2, Heart, Feather, BookOpen, Skull } from 'lucide-react';
import { ToneType } from '@/utils/toneMessages';
import { useToneSystem } from '@/hooks/useToneSystem';
import ToneLoyaltyCard from './ToneLoyaltyCard';
import ToneMasteryProgressCard from './ToneMasteryProgressCard';

const ToneMasterySection: React.FC = () => {
  const { 
    selectedTone, 
    toneUsage, 
    getToneMasteryLevelForTone,
    isToneV2UnlockedForTone,
    toneLoyalty,
    toneMastery,
    tonePackExpansion
  } = useToneSystem();

  const AVAILABLE_TONES: ToneType[] = ['calm', 'playful', 'formal', 'sarcastic'];
  const advancedTones: ToneType[] = ['romantic', 'poetic', 'philosophical', 'darkHumor'];
  const unlockedAdvancedTones = advancedTones.filter(tone => toneLoyalty.isAdvancedToneUnlocked(tone));

  const getToneIcon = (tone: ToneType) => {
    switch (tone) {
      case 'romantic': return <Heart size={14} className="text-rose-500" />;
      case 'poetic': return <Feather size={14} className="text-indigo-500" />;
      case 'philosophical': return <BookOpen size={14} className="text-amber-600" />;
      case 'darkHumor': return <Skull size={14} className="text-gray-600" />;
      default: return <Palette size={14} className="text-primary" />;
    }
  };

  const getAdvancedToneName = (tone: ToneType): string => {
    const names: Record<ToneType, string> = {
      romantic: 'Romantic',
      poetic: 'Poetic', 
      philosophical: 'Philosophical',
      darkHumor: 'Dark Humor',
      playful: 'Playful',
      calm: 'Meditative',
      formal: 'Formal',
      sarcastic: 'Sarcastic',
      existential: 'Existential'
    };
    return names[tone] || tone;
  };

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
    <div className="space-y-4">
      <ToneMasteryProgressCard />
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              <span>Tone Mastery</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {totalMasteryLevel}/8 Levels
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            {AVAILABLE_TONES.map((tone) => {
              const usage = toneUsage[tone];
              const masteryLevel = Math.max(getToneMasteryLevelForTone(tone), toneMastery.getToneMasteryLevel(tone));
              const hasV2 = isToneV2UnlockedForTone(tone) || toneMastery.isVolumeTwoUnlocked(tone);
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
                      {getToneIcon(tone)}
                      <span className="capitalize font-medium text-sm">{getAdvancedToneName(tone)}</span>
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
                          Vol {tonePackExpansion.getTonePackLevel(tone)} ✨
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

          {unlockedAdvancedTones.length > 0 && (
            <div className="pt-3 border-t border-border">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                ✨ Advanced Tones Unlocked
                <Badge variant="outline" className="text-xs">Loyalty Rewards</Badge>
              </h4>
              <div className="flex flex-wrap gap-2">
                {unlockedAdvancedTones.map((tone) => (
                  <Badge key={tone} variant="outline" className="text-xs flex items-center gap-1">
                    {getToneIcon(tone)}
                    {getAdvancedToneName(tone)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-muted">
            <div className="text-xs text-muted-foreground text-center space-y-1">
              <div>Use different tones to unlock their full personality and Volume 2 content.</div>
              <div>Volume 2 unlocks after 10 draws with max 2 tone switches!</div>
              <div>Stay loyal to one tone for 20+ draws to unlock advanced variants!</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <ToneLoyaltyCard />
    </div>
  );
};

export default ToneMasterySection;