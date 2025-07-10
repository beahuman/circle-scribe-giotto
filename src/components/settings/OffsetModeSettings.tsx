import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useOffsetMode } from '@/hooks/useOffsetMode';
import { usePerceptionGauntlet } from '@/hooks/usePerceptionGauntlet';

interface OffsetModeSettingsProps {
  mirrorOffsetEnabled: boolean;
  onMirrorOffsetChange: (enabled: boolean) => void;
}

const OffsetModeSettings: React.FC<OffsetModeSettingsProps> = ({
  mirrorOffsetEnabled,
  onMirrorOffsetChange
}) => {
  const { stats: offsetStats } = useOffsetMode();
  const { stats: gauntletStats } = usePerceptionGauntlet();
  
  // Mirror-Offset unlocked after 1 Perception Gauntlet completion
  const isMirrorUnlocked = gauntletStats.totalAttempts >= 1 || offsetStats.mirrorOffsetUnlocked;

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-800">Challenge Modifiers</CardTitle>
        <CardDescription>
          Advanced perception training options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="mirror-offset" className="text-sm font-medium">
              Mirror-Offset Mode
            </Label>
            <p className="text-xs text-muted-foreground">
              Horizontally flip reference circle position
            </p>
            {!isMirrorUnlocked && (
              <Badge variant="secondary" className="text-xs">
                🔒 Complete 1 Perception Gauntlet to unlock
              </Badge>
            )}
          </div>
          <Switch
            id="mirror-offset"
            checked={mirrorOffsetEnabled && isMirrorUnlocked}
            onCheckedChange={onMirrorOffsetChange}
            disabled={!isMirrorUnlocked}
          />
        </div>
        
        {isMirrorUnlocked && (
          <div className="text-xs text-purple-600 bg-purple-100 p-2 rounded-md">
            <strong>Mirror Mode Active:</strong> Reference positions are horizontally flipped. 
            Challenges spatial reversal and mental rotation skills.
          </div>
        )}
        
        <div className="border-t pt-3 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Educational Note:</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            These challenges mimic spatial reversal training used in neuroplasticity research 
            and visual-motor development studies.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OffsetModeSettings;