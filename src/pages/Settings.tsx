
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BottomNav from '@/components/BottomNav';
import DifficultySettings from '@/components/settings/DifficultySettings';
import DrawingSettings from '@/components/settings/DrawingSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import GhostCircleSettings from '@/components/settings/GhostCircleSettings';
import PenaltyModeSettings from '@/components/settings/PenaltyModeSettings';
import SubmetricsSettings from '@/components/settings/SubmetricsSettings';
import ToneSettings from '@/components/settings/ToneSettings';
import BrushSettings from '@/components/settings/BrushSettings';
import OffsetModeSettings from '@/components/settings/OffsetModeSettings';
import InfinitePracticeSettings from '@/components/settings/InfinitePracticeSettings';
import { useSettings } from '@/hooks/useSettings';
import { useModeUnlockSystem } from '@/hooks/useModeUnlockSystem';
import { useToast } from '@/hooks/use-toast';

import { useNavigate } from 'react-router-dom';

const fadeVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

const Settings = () => {
  const navigate = useNavigate();
  const { showAllModes, toggleShowAllModes } = useModeUnlockSystem();
  const { toast } = useToast();
  const {
    notifications,
    darkMode,
    difficultyLevel,
    drawingPrecision,
    displayDuration,
    showGhostCircle,
    penaltyModeEnabled,
    showSubmetrics,
    mirrorOffsetEnabled,
    handleNotificationToggle,
    handleDarkModeToggle,
    handleDifficultyChange,
    handlePrecisionChange,
    handleDurationChange,
    handleGhostCircleToggle,
    handlePenaltyModeToggle,
    handleSubmetricsToggle,
    handleMirrorOffsetToggle,
  } = useSettings();

  return (
    <motion.div 
      className="min-h-screen p-6 bg-gradient-to-b from-background to-background/80 pb-24"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      <motion.div className="flex items-center mb-6" variants={fadeVariants}>
        <Button variant="ghost" onClick={() => navigate('/')} size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6 text-primary" />
        </Button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">
          Game Settings
        </h1>
      </motion.div>

      <div className="max-w-md mx-auto space-y-6">
        <motion.div variants={fadeVariants}>
          <DifficultySettings 
            difficultyLevel={difficultyLevel}
            onDifficultyChange={handleDifficultyChange}
          />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>
        
        <motion.div variants={fadeVariants}>
          <PenaltyModeSettings
            penaltyModeEnabled={penaltyModeEnabled}
            onPenaltyModeChange={handlePenaltyModeToggle}
          />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <DrawingSettings 
            drawingPrecision={drawingPrecision}
            onPrecisionChange={handlePrecisionChange}
          />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <DisplaySettings 
            displayDuration={displayDuration}
            onDurationChange={handleDurationChange}
          />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <GhostCircleSettings
            showGhostCircle={showGhostCircle}
            onGhostCircleChange={handleGhostCircleToggle}
          />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <SubmetricsSettings
            showSubmetrics={showSubmetrics}
            onSubmetricsChange={handleSubmetricsToggle}
          />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <NotificationSettings 
            notifications={notifications}
            onNotificationsChange={handleNotificationToggle}
          />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <AppearanceSettings 
            darkMode={darkMode}
            onDarkModeChange={handleDarkModeToggle}
          />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <ToneSettings />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <BrushSettings />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <OffsetModeSettings
            mirrorOffsetEnabled={mirrorOffsetEnabled}
            onMirrorOffsetChange={handleMirrorOffsetToggle}
          />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <InfinitePracticeSettings />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Mode Discovery</CardTitle>
              <CardDescription>
                Control how new gameplay modes are revealed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Show all locked modes</p>
                  <p className="text-sm text-muted-foreground">
                    Preview future challenges (disabled by default)
                  </p>
                </div>
                <Button
                  variant={showAllModes ? "default" : "outline"}
                  size="sm"
                  onClick={toggleShowAllModes}
                >
                  {showAllModes ? "Hide" : "Show"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>
          
        <motion.div variants={fadeVariants}>
          <Card>
            <CardHeader>
              <CardTitle>Onboarding</CardTitle>
              <CardDescription>
                Replay the first-time user experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.removeItem('giottoOnboardingCompleted');
                  window.location.reload();
                }}
                className="w-full"
              >
                Replay Onboarding
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => {
                  localStorage.removeItem('hasCompletedFirstDraw');
                  toast({
                    title: "First Draw Tutorial Reset",
                    description: "The tutorial will show on your next game",
                    duration: 3000,
                  });
                }}
                className="w-full"
              >
                Reset First Draw Tutorial
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <BottomNav />
    </motion.div>
  );
};

export default Settings;
