import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Eye, Circle, Target, Shuffle, Sparkles } from 'lucide-react';
import { useModeUnlockSystem } from '@/hooks/useModeUnlockSystem';
import ModeUnlockModal from '@/components/modal/ModeUnlockModal';

const getModeIcon = (modeId: string) => {
  switch (modeId) {
    case 'blind-draw':
      return Eye;
    case 'spiral-mode':
      return Circle;
    case 'offset-mode':
      return Target;
    case 'perception-gauntlet':
      return Shuffle;
    default:
      return Sparkles;
  }
};

const getModeDescription = (modeId: string) => {
  switch (modeId) {
    case 'blind-draw':
      return 'Draw without seeing your stroke - pure memory training';
    case 'spiral-mode':
      return 'Follow the winding path of the spiral';
    case 'offset-mode':
      return 'Reference circle placed off-center - tests perception alignment';
    case 'perception-gauntlet':
      return 'Ultimate challenge: off-center AND hidden reference circle';
    default:
      return 'Advanced gameplay mode';
  }
};

const UnlockedModesGallery: React.FC = () => {
  const { unlockedModes, unlockTriggers } = useModeUnlockSystem();
  const [replayTrigger, setReplayTrigger] = useState<any>(null);

  const handleReplayUnlock = (modeId: string) => {
    const trigger = unlockTriggers.find(t => t.id === modeId);
    if (trigger) {
      setReplayTrigger(trigger);
    }
  };

  const handleModalClose = () => {
    setReplayTrigger(null);
  };

  if (unlockedModes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Unlocked Modes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No modes unlocked yet</p>
            <p className="text-sm mt-2">Complete challenges to unlock new drawing modes!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Unlocked Modes ({unlockedModes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedModes.map((mode, index) => {
              const IconComponent = getModeIcon(mode.id);
              const description = getModeDescription(mode.id);
              const unlockedDate = new Date(mode.unlockedAt).toLocaleDateString();
              
              return (
                <motion.div
                  key={mode.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="relative overflow-hidden border border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Mode Icon */}
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/40 rounded-full flex items-center justify-center">
                            <IconComponent className="w-6 h-6 text-primary" />
                          </div>
                          {mode.isNew && (
                            <Badge 
                              variant="secondary" 
                              className="absolute -top-2 -right-2 px-1 py-0 text-xs bg-primary/10 text-primary border-primary/30"
                            >
                              New!
                            </Badge>
                          )}
                        </div>
                        
                        {/* Mode Info */}
                        <div className="flex-1 space-y-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{mode.name}</h3>
                            <p className="text-sm text-muted-foreground">{description}</p>
                          </div>
                          
                          <div className="text-xs text-muted-foreground">
                            Unlocked on {unlockedDate}
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReplayUnlock(mode.id)}
                            className="mt-3 flex items-center gap-2 text-primary hover:bg-primary/10"
                          >
                            <Play className="h-3 w-3" />
                            Replay Unlock
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Replay Modal */}
      <ModeUnlockModal
        isOpen={!!replayTrigger}
        trigger={replayTrigger}
        onTryNow={() => {
          // Navigate to the mode
          if (replayTrigger) {
            window.location.href = `/?mode=${replayTrigger.id}`;
          }
          handleModalClose();
        }}
        onMaybeLater={handleModalClose}
      />
    </>
  );
};

export default UnlockedModesGallery;