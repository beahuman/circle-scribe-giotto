
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Palette, TrendingUp } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import BottomNav from '@/components/BottomNav';
import DifficultySettings from '@/components/settings/DifficultySettings';
import DrawingSettings from '@/components/settings/DrawingSettings';
import DisplaySettings from '@/components/settings/DisplaySettings';
import NotificationSettings from '@/components/settings/NotificationSettings';
import DailyReturnSettings from '@/components/settings/DailyReturnSettings';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import GhostCircleSettings from '@/components/settings/GhostCircleSettings';
import PenaltyModeSettings from '@/components/settings/PenaltyModeSettings';
import SubmetricsSettings from '@/components/settings/SubmetricsSettings';
import ToneSettings from '@/components/settings/ToneSettings';
import ToneBasedNotifications from '@/components/settings/ToneBasedNotifications';
import BrushSettings from '@/components/settings/BrushSettings';
import OffsetModeSettings from '@/components/settings/OffsetModeSettings';
import InfinitePracticeSettings from '@/components/settings/InfinitePracticeSettings';
import SensoryFeedbackSettings from '@/components/settings/SensoryFeedbackSettings';
import { useSettings } from '@/hooks/useSettings';
import { useModeUnlockSystem } from '@/hooks/useModeUnlockSystem';
import { useToast } from '@/hooks/use-toast';
import { useAdaptiveFeedback } from '@/hooks/useAdaptiveFeedback';
import LogoHeader from '@/components/common/LogoHeader';

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
  const { adaptiveSettings, setAdaptiveSettings, resetAdaptiveFeedback } = useAdaptiveFeedback();
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
    adaptiveScoreScreen,
    ghostTrailOverlay,
    handleNotificationToggle,
    handleDarkModeToggle,
    handleDifficultyChange,
    handlePrecisionChange,
    handleDurationChange,
    handleGhostCircleToggle,
    handlePenaltyModeToggle,
    handleSubmetricsToggle,
    handleMirrorOffsetToggle,
    handleAdaptiveScoreScreenToggle,
    handleGhostTrailOverlayToggle,
  } = useSettings();

  return (
    <motion.div 
      className="min-h-screen px-4 py-6 xs:px-6 md:px-8 md:py-8 bg-gradient-to-b from-background to-background/80 pb-24 max-w-sm mx-auto xs:max-w-md md:max-w-4xl lg:max-w-6xl"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
       {/* Unified Header Navigation with consistent logo positioning */}
      <motion.div className="flex items-center justify-between mb-6 md:mb-8" variants={fadeVariants} style={{ marginTop: 'var(--logo-margin-top)' }}>
        <Button variant="ghost" onClick={() => navigate('/account')} size="icon">
          <ArrowLeft className="h-6 w-6 text-primary" strokeWidth={2} />
        </Button>
        <LogoHeader size="small" clickable={false} />
        <div className="w-10" />
      </motion.div>
      
      {/* Unified Settings Title with consistent typography */}
      <motion.div className="text-center mb-6 md:mb-8" variants={fadeVariants}>
        <h1 className="text-header font-semibold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
          Game Settings
        </h1>
        <p className="text-small text-muted-foreground mt-2">Customize your experience</p>
      </motion.div>

      {/* Settings Content - Responsive Grid Aligned with Consistent Spacing */}
      <div className="space-y-6 md:space-y-8 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
        <motion.div variants={fadeVariants}>
          <DifficultySettings 
            difficultyLevel={difficultyLevel}
            onDifficultyChange={handleDifficultyChange}
          />
        </motion.div>

        <motion.div variants={fadeVariants} className="lg:col-span-2">
          <Separator className="bg-border" />
        </motion.div>
        
        <motion.div variants={fadeVariants}>
          <PenaltyModeSettings
            penaltyModeEnabled={penaltyModeEnabled}
            onPenaltyModeChange={handlePenaltyModeToggle}
          />
        </motion.div>

        <motion.div variants={fadeVariants} className="landscape:col-span-2">
          <Separator className="bg-border" />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <DrawingSettings 
            drawingPrecision={drawingPrecision}
            onPrecisionChange={handlePrecisionChange}
          />
        </motion.div>

        <motion.div variants={fadeVariants} className="landscape:col-span-2">
          <Separator className="bg-border" />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <DisplaySettings 
            displayDuration={displayDuration}
            onDurationChange={handleDurationChange}
          />
        </motion.div>

        <motion.div variants={fadeVariants} className="landscape:col-span-2">
          <Separator className="bg-border" />
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
          <DailyReturnSettings />
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
          <ToneBasedNotifications />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <SensoryFeedbackSettings />
        </motion.div>

        <motion.div variants={fadeVariants}>
          <Separator className="bg-purple-300/20" />
        </motion.div>

        {/* Adaptive Feedback Settings */}
        <motion.div variants={fadeVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Adaptive Feedback
              </CardTitle>
              <CardDescription>
                Personalize feedback based on your playing patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Enable Adaptive Feedback</label>
                  <p className="text-xs text-muted-foreground">
                    Adjust messages based on your progress and behavior
                  </p>
                </div>
                <Switch
                  checked={adaptiveSettings.enabled}
                  onCheckedChange={(checked) => 
                    setAdaptiveSettings(prev => ({ ...prev, enabled: checked }))
                  }
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Deep Tone Variants</label>
                  <p className="text-xs text-muted-foreground">
                    Unlock richer phrases after using a tone consistently
                  </p>
                </div>
                <Switch
                  checked={adaptiveSettings.deepVariantsEnabled}
                  onCheckedChange={(checked) => 
                    setAdaptiveSettings(prev => ({ ...prev, deepVariantsEnabled: checked }))
                  }
                  disabled={!adaptiveSettings.enabled}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Behavior Insights</label>
                  <p className="text-xs text-muted-foreground">
                    Show personalized insights on your progress page
                  </p>
                </div>
                <Switch
                  checked={adaptiveSettings.behaviorInsightsEnabled}
                  onCheckedChange={(checked) => 
                    setAdaptiveSettings(prev => ({ ...prev, behaviorInsightsEnabled: checked }))
                  }
                  disabled={!adaptiveSettings.enabled}
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={resetAdaptiveFeedback}
                className="w-full"
              >
                Reset Adaptive Feedback Memory
              </Button>
            </CardContent>
          </Card>

          {/* Evolving Score Screen Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Evolving Score Screen
              </CardTitle>
              <CardDescription>
                Customize how your score screen adapts and evolves with your progress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Adaptive Score Screen</label>
                  <p className="text-xs text-muted-foreground">
                    Score screen evolves visually based on your improvement and achievements
                  </p>
                </div>
                <Switch
                  checked={adaptiveScoreScreen}
                  onCheckedChange={handleAdaptiveScoreScreenToggle}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Ghost Trail Comparison</label>
                  <p className="text-xs text-muted-foreground">
                    Show overlay comparing your drawing to target (advanced users)
                  </p>
                </div>
                <Switch
                  checked={ghostTrailOverlay}
                  onCheckedChange={handleGhostTrailOverlayToggle}
                  disabled={!adaptiveScoreScreen}
                />
              </div>
            </CardContent>
          </Card>

          {/* Progress Nudges Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress Discovery
              </CardTitle>
              <CardDescription>
                Control how the app guides you to discover your progress tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Show Progress Nudges</label>
                  <p className="text-xs text-muted-foreground">
                    Get gentle hints to check your progress after achieving milestones
                  </p>
                </div>
                <Switch
                  checked={localStorage.getItem('showProgressNudges') !== 'false'}
                  onCheckedChange={(checked) => {
                    localStorage.setItem('showProgressNudges', String(checked));
                    toast({
                      title: "Progress Nudges",
                      description: checked ? "Progress nudges enabled" : "Progress nudges disabled",
                      duration: 2000
                    });
                  }}
                />
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const { resetNudges } = require('@/hooks/useProgressNudge');
                  resetNudges();
                  toast({
                    title: "Progress Nudges Reset",
                    description: "Progress intro will show again for new users",
                    duration: 2000
                  });
                }}
                className="w-full"
              >
                Reset Progress Introduction
              </Button>
            </CardContent>
          </Card>
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
