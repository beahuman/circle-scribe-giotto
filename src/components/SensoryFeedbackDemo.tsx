import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Vibrate, Volume2, Smartphone, Globe } from 'lucide-react';
import { useSensoryFeedback } from '@/hooks/useSensoryFeedback';
import { useToneSystem } from '@/hooks/useToneSystem';

const SensoryFeedbackDemo: React.FC = () => {
  const { triggerFeedback, settings, isNativePlatform } = useSensoryFeedback();
  const { selectedTone } = useToneSystem();

  const feedbackEvents = [
    { id: 'draw-start', label: 'Draw Start', description: 'When you begin drawing' },
    { id: 'draw-end', label: 'Draw End', description: 'When you finish drawing' },
    { id: 'score-reveal', label: 'Score Reveal', description: 'When your score appears' },
    { id: 'high-score', label: 'High Score', description: 'When you achieve 85%+' },
    { id: 'mode-unlock', label: 'Mode Unlock', description: 'When new mode unlocks' },
    { id: 'streak-break', label: 'Streak Break', description: 'When streak is broken' },
  ];

  if (!settings.audioEnabled && !settings.hapticsEnabled) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-center">
          <Volume2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-muted-foreground">
            Enable feedback in Settings to test sensory responses
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vibrate className="h-5 w-5" />
          Feedback Demo
        </CardTitle>
        <CardDescription>
          Test your sensory feedback settings with Giotto's {selectedTone} personality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Settings */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          {isNativePlatform ? (
            <>
              <Smartphone className="h-4 w-4" />
              <span>Mobile platform</span>
            </>
          ) : (
            <>
              <Globe className="h-4 w-4" />
              <span>Web platform</span>
            </>
          )}
          {settings.hapticsEnabled && (
            <Badge variant="outline" className="text-xs">Haptics ON</Badge>
          )}
          {settings.audioEnabled && (
            <Badge variant="outline" className="text-xs">Audio ON</Badge>
          )}
        </div>

        {/* Demo Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {feedbackEvents.map((event) => (
            <Button
              key={event.id}
              variant="outline"
              onClick={() => triggerFeedback(event.id as any)}
              className="flex flex-col items-start p-4 h-auto text-left hover:bg-primary/5"
            >
              <span className="font-medium">{event.label}</span>
              <span className="text-xs text-muted-foreground mt-1">
                {event.description}
              </span>
            </Button>
          ))}
        </div>
        
        <div className="text-xs text-muted-foreground text-center mt-4">
          Audio tones are adapted to your selected personality: <strong>{selectedTone}</strong>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensoryFeedbackDemo;