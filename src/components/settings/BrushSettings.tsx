import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lock, Check, Sparkles } from 'lucide-react';
import { useBrushSystem } from '@/hooks/useBrushSystem';
import { BRUSH_STYLES } from '@/utils/brushStyles';

const BrushSettings: React.FC = () => {
  const {
    selectedBrush,
    selectBrush,
    isBrushUnlocked,
    getUnlockedBrushes,
    getLockedBrushes
  } = useBrushSystem();

  const unlockedBrushes = getUnlockedBrushes();
  const lockedBrushes = getLockedBrushes();

  const handleBrushSelect = (brushId: string) => {
    if (isBrushUnlocked(brushId)) {
      selectBrush(brushId);
    }
  };

  const BrushPreview: React.FC<{ brushId: string }> = ({ brushId }) => {
    const brush = BRUSH_STYLES.find(b => b.id === brushId);
    if (!brush) return null;

    return (
      <div 
        className="w-16 h-16 rounded-lg border border-muted flex items-center justify-center bg-background/50"
        style={{ 
          background: brush.effectColor ? 
            `linear-gradient(45deg, ${brush.effectColor}, transparent)` : 
            'transparent'
        }}
      >
        <div 
          className="w-8 h-1 rounded-full"
          style={{ 
            backgroundColor: brush.effectColor || 'hsl(var(--primary))',
            opacity: 0.8
          }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Brush Collection
          </CardTitle>
          <CardDescription>
            Customize your drawing experience with unlockable brush styles
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Unlocked Brushes */}
          {unlockedBrushes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Available Brushes</h3>
              <div className="grid grid-cols-1 gap-3">
                {unlockedBrushes.map((brush) => (
                  <Button
                    key={brush.id}
                    variant={selectedBrush === brush.id ? "default" : "outline"}
                    className="h-auto p-4 justify-start"
                    onClick={() => handleBrushSelect(brush.id)}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <BrushPreview brushId={brush.id} />
                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{brush.name}</span>
                          {selectedBrush === brush.id && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {brush.description}
                        </p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Locked Brushes */}
          {lockedBrushes.length > 0 && (
            <div>
              <h3 className="text-sm font-medium mb-3">Locked Brushes</h3>
              <div className="grid grid-cols-1 gap-3">
                {lockedBrushes.map((brush) => (
                  <div
                    key={brush.id}
                    className="border border-muted rounded-lg p-4 bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <BrushPreview brushId={brush.id} />
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                          <Lock className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-muted-foreground">
                            {brush.name}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            Locked
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {brush.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Unlock: {brush.unlockCondition}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Educational Note */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Brush styles are purely visual and don't affect your scoring. 
              They're designed to enhance your drawing experience and provide rewards for your progress.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrushSettings;