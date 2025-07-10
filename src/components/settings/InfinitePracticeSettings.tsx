import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useInfinitePracticeMode } from '@/hooks/useInfinitePracticeMode';

const InfinitePracticeSettings: React.FC = () => {
  const {
    practiceSessionCount,
    autoRhythmEnabled,
    visualFeedbackEnabled,
    loggingEnabled,
    toggleAutoRhythm,
    toggleVisualFeedback,
    toggleLogging,
  } = useInfinitePracticeMode();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Infinite Practice Mode
          <Badge variant="secondary" className="text-xs">
            Meditative
          </Badge>
        </CardTitle>
        <CardDescription>
          Customize your freeform drawing experience. Draw without pressure or scoring.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Auto Rhythm Mode */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="auto-rhythm">Auto Rhythm Mode</Label>
            <p className="text-sm text-muted-foreground">
              New circle appears automatically every 10 seconds
            </p>
          </div>
          <Switch
            id="auto-rhythm"
            checked={autoRhythmEnabled}
            onCheckedChange={toggleAutoRhythm}
          />
        </div>

        {/* Visual Feedback */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="visual-feedback">Visual Feedback</Label>
            <p className="text-sm text-muted-foreground">
              Show ghost circle and gentle pulse animations
            </p>
          </div>
          <Switch
            id="visual-feedback"
            checked={visualFeedbackEnabled}
            onCheckedChange={toggleVisualFeedback}
          />
        </div>

        {/* Practice Logging */}
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="practice-logging">Log Practice Rounds</Label>
            <p className="text-sm text-muted-foreground">
              Track your infinite practice sessions in progress stats
            </p>
          </div>
          <Switch
            id="practice-logging"
            checked={loggingEnabled}
            onCheckedChange={toggleLogging}
          />
        </div>

        {/* Practice Statistics */}
        {loggingEnabled && (
          <div className="pt-4 border-t border-border">
            <div className="space-y-2">
              <Label>Practice Statistics</Label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total practice rounds:</span>
                <Badge variant="outline">{practiceSessionCount}</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Educational Note */}
        <div className="pt-4 border-t border-border">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              💡 <strong>Neuroplasticity Tip:</strong> Unscored repetition encourages cognitive flow, 
              reduces anxiety, and strengthens motor pathways. Sometimes practice without pressure 
              leads to the most improvement.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfinitePracticeSettings;