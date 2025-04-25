
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon, Bell, Palette, Moon, Sun, Timer, Circle, SlidersHorizontal } from 'lucide-react';
import { Slider } from "@/components/ui/slider";
import BottomNav from '@/components/BottomNav';
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [difficultyLevel, setDifficultyLevel] = useState(() => {
    return Number(localStorage.getItem('difficultyLevel')) || 50;
  });
  const [drawingPrecision, setDrawingPrecision] = useState(() => {
    return Number(localStorage.getItem('drawingPrecision')) || 50;
  });
  const [displayDuration, setDisplayDuration] = useState(() => {
    return Number(localStorage.getItem('displayDuration')) || 3;
  });
  const { toast } = useToast();

  const handleNotificationToggle = (checked: boolean) => {
    setNotifications(checked);
    toast({
      title: "Notification Settings",
      description: checked ? "Notifications enabled" : "Notifications disabled"
    });
  };

  const handleDarkModeToggle = (checked: boolean) => {
    setDarkMode(checked);
    toast({
      title: "Appearance",
      description: checked ? "Dark mode enabled" : "Light mode enabled"
    });
  };

  const handleDifficultyChange = (value: number[]) => {
    const newValue = value[0];
    setDifficultyLevel(newValue);
    localStorage.setItem('difficultyLevel', String(newValue));
    toast({
      title: "Difficulty Updated",
      description: `Difficulty level set to ${newValue}%`
    });
  };

  const handlePrecisionChange = (value: number[]) => {
    const newValue = value[0];
    setDrawingPrecision(newValue);
    localStorage.setItem('drawingPrecision', String(newValue));
    toast({
      title: "Drawing Precision Updated",
      description: `Drawing precision set to ${newValue}%`
    });
  };

  const handleDurationChange = (value: number[]) => {
    const newValue = value[0];
    setDisplayDuration(newValue);
    localStorage.setItem('displayDuration', String(newValue));
    toast({
      title: "Display Duration Updated",
      description: `Circle will display for ${newValue} seconds`
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-background/80 pb-24">
      <div className="flex items-center mb-6">
        <SettingsIcon size={24} className="mr-2 text-primary" />
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          App Settings
        </h1>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-primary" />
              Game Difficulty
            </CardTitle>
            <CardDescription>Adjust how challenging the game is</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Difficulty Level</span>
                <span className="font-medium">{difficultyLevel}%</span>
              </div>
              <Slider
                value={[difficultyLevel]}
                min={10}
                max={100}
                step={5}
                onValueChange={handleDifficultyChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Easy</span>
                <span>Hard</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              <Circle size={18} className="text-primary" />
              Drawing Precision
            </CardTitle>
            <CardDescription>Adjust the smoothness of circle drawing</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Precision Level</span>
                <span className="font-medium">{drawingPrecision}%</span>
              </div>
              <Slider
                value={[drawingPrecision]}
                min={10}
                max={100}
                step={5}
                onValueChange={handlePrecisionChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>More Detail</span>
                <span>Smoother</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              <Timer size={18} className="text-primary" />
              Display Duration
            </CardTitle>
            <CardDescription>Seconds to display the target circle</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Duration (seconds)</span>
                <span className="font-medium">{displayDuration}s</span>
              </div>
              <Slider
                value={[displayDuration]}
                min={1}
                max={10}
                step={1}
                onValueChange={handleDurationChange}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Shorter</span>
                <span>Longer</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              <Bell size={18} className="text-primary" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex items-center justify-between">
            <span>Enable Notifications</span>
            <Switch 
              checked={notifications}
              onCheckedChange={handleNotificationToggle}
            />
          </CardContent>
        </Card>

        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-purple-400/10">
            <CardTitle className="flex items-center gap-2">
              {darkMode ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 flex items-center justify-between">
            <span>Dark Mode</span>
            <Switch 
              checked={darkMode}
              onCheckedChange={handleDarkModeToggle}
            />
          </CardContent>
        </Card>

        <Button variant="outline" className="w-full">
          <Palette size={18} className="mr-2" />
          Customize Theme
        </Button>
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Settings;
