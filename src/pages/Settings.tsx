
import React, { useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import BottomNav from '@/components/BottomNav';
import DifficultySettings from '@/components/settings/DifficultySettings';
import DrawingSettings from '@/components/settings/DrawingSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';

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

      <div className="max-w-md mx-auto space-y-8">
        <DifficultySettings 
          difficultyLevel={difficultyLevel}
          onDifficultyChange={handleDifficultyChange}
        />

        <Separator className="bg-purple-300/20" />

        <DrawingSettings 
          drawingPrecision={drawingPrecision}
          onPrecisionChange={handlePrecisionChange}
        />

        <Separator className="bg-purple-300/20" />

        <DisplaySettings 
          displayDuration={displayDuration}
          onDurationChange={handleDurationChange}
        />

        <Separator className="bg-purple-300/20" />

        <NotificationSettings 
          notifications={notifications}
          onNotificationsChange={handleNotificationToggle}
        />

        <Separator className="bg-purple-300/20" />

        <AppearanceSettings 
          darkMode={darkMode}
          onDarkModeChange={handleDarkModeToggle}
        />
      </div>
      
      <BottomNav />
    </div>
  );
};

export default Settings;
