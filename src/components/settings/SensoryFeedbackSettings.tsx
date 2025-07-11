import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Vibrate, Volume2, Mic, TestTube, Smartphone, Globe } from 'lucide-react';
import { useSensoryFeedback } from '@/hooks/useSensoryFeedback';

const SensoryFeedbackSettings: React.FC = () => {
  const {
    settings,
    toggleHaptics,
    toggleAudio,
    toggleVoiceover,
    testFeedback,
    isNativePlatform,
  } = useSensoryFeedback();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Vibrate className="h-5 w-5" />
          Sensory Feedback
        </CardTitle>
        <CardDescription>
          Optional haptics and audio cues to enhance your drawing experience. All feedback is designed to be subtle and non-intrusive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Platform Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isNativePlatform ? (
            <>
              <Smartphone className="h-4 w-4" />
              <span>Mobile platform detected - all features available</span>
            </>
          ) : (
            <>
              <Globe className="h-4 w-4" />
              <span>Web platform - audio feedback available, haptics require mobile app</span>
            </>
          )}
        </div>

        <Separator />

        {/* Haptic Feedback */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="haptics" className="text-base font-medium">Light Haptics</Label>
                {!isNativePlatform && (
                  <Badge variant="outline" className="text-xs">Mobile Only</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Gentle vibrations when drawing and scoring
              </p>
            </div>
            <Switch
              id="haptics"
              checked={settings.hapticsEnabled}
              onCheckedChange={toggleHaptics}
              disabled={!isNativePlatform}
            />
          </div>
        </div>

        {/* Audio Feedback */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="audio" className="text-base font-medium flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                Ambient Audio Cues
              </Label>
              <p className="text-sm text-muted-foreground">
                Soft tones that respond to your selected voice personality
              </p>
            </div>
            <Switch
              id="audio"
              checked={settings.audioEnabled}
              onCheckedChange={toggleAudio}
            />
          </div>
        </div>

        {/* Future Feature: Voiceover */}
        <div className="space-y-3 opacity-50">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="voiceover" className="text-base font-medium flex items-center gap-2">
                  <Mic className="h-4 w-4" />
                  Giotto Voiceover
                </Label>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Spoken feedback and encouragement from your guide
              </p>
            </div>
            <Switch
              id="voiceover"
              checked={settings.voiceoverEnabled}
              onCheckedChange={toggleVoiceover}
              disabled={true}
            />
          </div>
        </div>

        <Separator />

        {/* Test Button */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label className="text-base font-medium">Test Feedback</Label>
            <p className="text-sm text-muted-foreground">
              Preview your current settings
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={testFeedback}
            disabled={!settings.hapticsEnabled && !settings.audioEnabled}
            className="flex items-center gap-2"
          >
            <TestTube className="h-4 w-4" />
            Test
          </Button>
        </div>

        {/* Feedback Events List */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Feedback Events</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-primary/60 rounded-full" />
              Draw start/end
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-primary/60 rounded-full" />
              Score reveal
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-primary/60 rounded-full" />
              Mode unlocks
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-2 h-2 bg-primary/60 rounded-full" />
              High scores
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SensoryFeedbackSettings;