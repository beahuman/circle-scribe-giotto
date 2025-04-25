
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@radix-ui/react-label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, VolumeX, Volume2, Clock, Target, Palette, PenTool } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [showTime, setShowTime] = useState(3);
  const [difficultyLevel, setDifficultyLevel] = useState(50);
  const [drawingPrecision, setDrawingPrecision] = useState(50);

  const handleSave = () => {
    // Here we would save settings to local storage or a database
    // For now, just show a toast notification
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <div className="min-h-screen p-6 flex flex-col bg-gradient-to-b from-background to-background/80">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} size="icon" className="mr-2">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Settings</h1>
      </div>

      <div className="flex-1 space-y-6 max-w-md mx-auto w-full">
        <Card className="border-primary/20 shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              <Volume2 size={18} className="text-primary" />
              Sound & Music
            </CardTitle>
            <CardDescription>Configure audio preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-toggle" className="flex items-center gap-2">
                <Volume2 size={16} className="text-muted-foreground" />
                Sound Effects
              </Label>
              <Switch 
                id="sound-toggle" 
                checked={soundEnabled} 
                onCheckedChange={setSoundEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="music-toggle" className="flex items-center gap-2">
                <VolumeX size={16} className="text-muted-foreground" />
                Background Music
              </Label>
              <Switch 
                id="music-toggle" 
                checked={musicEnabled} 
                onCheckedChange={setMusicEnabled}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              <Clock size={18} className="text-primary" />
              Game Difficulty
            </CardTitle>
            <CardDescription>Adjust how the game plays</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="show-time">Circle Display Time: {showTime}s</Label>
              </div>
              <Slider 
                id="show-time"
                min={1}
                max={5}
                step={0.5}
                value={[showTime]} 
                onValueChange={(value) => setShowTime(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Harder</span>
                <span>Easier</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="difficulty">Scoring Strictness: {difficultyLevel}%</Label>
              </div>
              <Slider 
                id="difficulty"
                min={10}
                max={90}
                step={10}
                value={[difficultyLevel]} 
                onValueChange={(value) => setDifficultyLevel(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>More Forgiving</span>
                <span>Stricter</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label htmlFor="precision" className="flex items-center gap-2">
                  <PenTool size={14} className="text-primary" />
                  Drawing Precision: {drawingPrecision}%
                </Label>
              </div>
              <Slider 
                id="precision"
                min={10}
                max={90}
                step={10}
                value={[drawingPrecision]} 
                onValueChange={(value) => setDrawingPrecision(value[0])}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Smoother Lines</span>
                <span>More Detail</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              <Palette size={18} className="text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>Customize how the app looks</CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="theme-toggle" className="flex items-center gap-2">
                Dark Theme
              </Label>
              <Switch id="theme-toggle" />
            </div>
          </CardContent>
        </Card>

        <Button 
          onClick={handleSave} 
          className="w-full bg-gradient-to-r from-primary to-purple-400 hover:from-primary/90 hover:to-purple-500"
        >
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default Settings;
