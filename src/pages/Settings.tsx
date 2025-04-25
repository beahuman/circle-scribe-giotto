
import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import BottomNav from '@/components/BottomNav';
import DifficultySettings from '@/components/settings/DifficultySettings';
import DrawingSettings from '@/components/settings/DrawingSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import { useSettings } from '@/hooks/useSettings';

const Settings = () => {
  const {
    notifications,
    darkMode,
    difficultyLevel,
    drawingPrecision,
    displayDuration,
    handleNotificationToggle,
    handleDarkModeToggle,
    handleDifficultyChange,
    handlePrecisionChange,
    handleDurationChange,
  } = useSettings();

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
