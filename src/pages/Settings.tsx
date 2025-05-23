import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import BottomNav from '@/components/BottomNav';
import DifficultySettings from '@/components/settings/DifficultySettings';
import DrawingSettings from '@/components/settings/DrawingSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import GhostCircleSettings from '@/components/settings/GhostCircleSettings';
import PenaltyModeSettings from '@/components/settings/PenaltyModeSettings';
import SubmetricsSettings from '@/components/settings/SubmetricsSettings';
import { useSettings } from '@/hooks/useSettings';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const navigate = useNavigate();
  const {
    notifications,
    darkMode,
    difficultyLevel,
    drawingPrecision,
    displayDuration,
    showGhostCircle,
    penaltyModeEnabled,
    showSubmetrics,
    handleNotificationToggle,
    handleDarkModeToggle,
    handleDifficultyChange,
    handlePrecisionChange,
    handleDurationChange,
    handleGhostCircleToggle,
    handlePenaltyModeToggle,
    handleSubmetricsToggle,
  } = useSettings();

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-background to-background/80 pb-24">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/')} size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6 text-primary" />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Game Settings
        </h1>
      </div>

      <div className="max-w-md mx-auto space-y-6">
        <DifficultySettings 
          difficultyLevel={difficultyLevel}
          onDifficultyChange={handleDifficultyChange}
        />

        <Separator className="bg-purple-300/20" />
        
        <PenaltyModeSettings
          penaltyModeEnabled={penaltyModeEnabled}
          onPenaltyModeChange={handlePenaltyModeToggle}
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

        <GhostCircleSettings
          showGhostCircle={showGhostCircle}
          onGhostCircleChange={handleGhostCircleToggle}
        />

        <Separator className="bg-purple-300/20" />

        <SubmetricsSettings
          showSubmetrics={showSubmetrics}
          onSubmetricsChange={handleSubmetricsToggle}
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
