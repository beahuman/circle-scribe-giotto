import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ToneType } from '@/utils/toneMessages';
import { useToneSystem } from '@/hooks/useToneSystem';

interface TonePreviewProps {
  tone: ToneType;
  isSelected: boolean;
  onSelect: () => void;
  isVariant?: boolean;
}

const TonePreview: React.FC<TonePreviewProps> = ({
  tone,
  isSelected,
  onSelect,
  isVariant = false
}) => {
  const { 
    toneUsage, 
    getToneMasteryLevelForTone, 
    isToneV2UnlockedForTone, 
    getPreviewMessage 
  } = useToneSystem();

  const usage = toneUsage[tone];
  const masteryLevel = getToneMasteryLevelForTone(tone);
  const hasV2 = isToneV2UnlockedForTone(tone);
  const previewMessage = getPreviewMessage(tone);

  const getMasteryLabel = () => {
    if (masteryLevel === 0) return "Locked";
    if (masteryLevel === 1) return "Level 1";
    return "Level 2";
  };

  const getMasteryColor = () => {
    if (masteryLevel === 0) return "secondary";
    if (masteryLevel === 1) return "default";
    return "destructive";
  };

  return (
    <Card className={`relative transition-all duration-200 hover:shadow-md ${
      isSelected ? 'ring-2 ring-primary shadow-md' : ''
    }`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-medium capitalize text-sm">{tone}</h4>
            <p className="text-xs text-muted-foreground">
              {usage} {usage === 1 ? 'use' : 'uses'}
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            {isVariant ? (
              <Badge variant="secondary" className="text-xs">
                Variant ✨
              </Badge>
            ) : (
              <Badge variant={getMasteryColor() as any} className="text-xs">
                {getMasteryLabel()}
              </Badge>
            )}
            {hasV2 && !isVariant && (
              <Badge variant="outline" className="text-xs">
                Volume 2 ✨
              </Badge>
            )}
          </div>
        </div>

        <div className="mb-3">
          <p className="text-caption line-clamp-2">
            "{previewMessage}"
          </p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {masteryLevel === 0 && "Complete 5 draws to unlock"}
            {masteryLevel === 1 && !hasV2 && `${15 - usage} more for Volume 2`}
            {hasV2 && "Full personality unlocked"}
          </div>
          <Button
            size="sm"
            variant={isSelected ? "default" : "outline"}
            onClick={onSelect}
            disabled={!isVariant && masteryLevel === 0}
          >
            {isSelected ? "Selected" : "Select"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TonePreview;