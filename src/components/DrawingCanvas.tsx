
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useGameState } from '@/hooks/useGameState';
import { useGameHandlers } from '@/hooks/useGameHandlers';
import { useSettings } from '@/hooks/useSettings';
import { useFirstDrawTutorial } from '@/hooks/useFirstDrawTutorial';
import { useSensoryFeedback } from '@/hooks/useSensoryFeedback';
import { useSessionTracking } from '@/hooks/useSessionTracking';
import CanvasDrawing from './drawing/CanvasDrawing';
import CircleDisplay from './CircleDisplay';
import FirstDrawTutorial from './tutorial/FirstDrawTutorial';
import ActiveBrushThemeDisplay from './drawing/ActiveBrushThemeDisplay';
import ModeHeaderDisplay from './drawing/ModeHeaderDisplay';
import GhostTrailReplay from './drawing/GhostTrailReplay';
import AmbientBackground from './common/AmbientBackground';
import ToneAwareButton from './common/ToneAwareButton';
import LogoAnimation from './LogoAnimation';
import { Point } from '@/types/shapes';

interface DrawingCanvasProps {
  onComplete: (score: number, drawnPoints: Array<{x: number, y: number}>) => void;
  onReturnToHome: () => void;
  mode?: string;
  targetScore?: number;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  onComplete, 
  onReturnToHome,
  mode = 'normal',
  targetScore 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();
  const [idleTime, setIdleTime] = useState(0);
  const [showAmbientAnimation, setShowAmbientAnimation] = useState(false);
  const [gamePhase, setGamePhase] = useState<'waiting' | 'showing' | 'drawing' | 'complete'>('waiting');
  const [isDrawing, setIsDrawing] = useState(false);

  // Game state and handlers
  const gameState = useGameState();
  const gameHandlers = useGameHandlers({
    isDailyMode: mode === 'daily',
    isDailyChallengeMode: mode === 'daily-challenge',
    isBlindDrawMode: mode === 'blind-draw',
    handleDrawingComplete: async (score: number, points: Point[]) => {
      setGamePhase('complete');
      handleScoreComplete(score, points);
    }
  });
  
  // Settings and tutorial
  const { settings } = useSettings();
  const { 
    isFirstDraw, 
    tutorialStep, 
    nextStep, 
    setTutorialStep,
    completeFirstDraw 
  } = useFirstDrawTutorial();
  
  // Feedback and tracking
  const { triggerFeedback } = useSensoryFeedback();
  useSessionTracking(); // This hook doesn't return anything, just call it for side effects

  // Track idle time for ambient animations
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;
    
    const resetIdleTimer = () => {
      setIdleTime(0);
      setShowAmbientAnimation(false);
      clearTimeout(idleTimer);
      
      idleTimer = setTimeout(() => {
        setIdleTime(10);
        setShowAmbientAnimation(true);
      }, 10000); // Show ambient animation after 10 seconds of inactivity
    };

    const handleActivity = () => {
      resetIdleTimer();
    };

    // Listen for user activity
    document.addEventListener('mousedown', handleActivity);
    document.addEventListener('touchstart', handleActivity);
    document.addEventListener('keydown', handleActivity);
    
    // Start the timer
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      document.removeEventListener('mousedown', handleActivity);
      document.removeEventListener('touchstart', handleActivity);
      document.removeEventListener('keydown', handleActivity);
    };
  }, []);

  const handleRestart = useCallback(() => {
    setGamePhase('waiting');
    setIsDrawing(false);
    if (isFirstDraw && tutorialStep === 'score') {
      setTutorialStep('drawing');
    }
  }, [isFirstDraw, tutorialStep, setTutorialStep]);

  const handleStart = useCallback(() => {
    setGamePhase('showing');
    setTimeout(() => {
      setGamePhase('drawing');
    }, 3000);
  }, []);

  const handleDrawingComplete = useCallback(async (score: number, points: Point[]) => {
    setIsDrawing(false);
    await gameHandlers.handleEnhancedDrawingComplete(score, points);
  }, [gameHandlers]);

  const handleScoreComplete = useCallback((score: number, drawnPoints: Array<{x: number, y: number}>) => {
    if (score >= 85) {
      triggerFeedback('high-score');
    } else if (score < 50) {
      triggerFeedback('score-reveal');
    }
    
    if (isFirstDraw) {
      completeFirstDraw();
    }
    
    onComplete(score, drawnPoints);
  }, [triggerFeedback, mode, isFirstDraw, completeFirstDraw, onComplete]);

  const getModeDisplayName = () => {
    switch (mode) {
      case 'blind-draw': return 'Blind Draw';
      case 'offset': return 'Offset Challenge';
      case 'perception-gauntlet': return 'Perception Gauntlet';
      case 'infinite-practice': return 'Infinite Practice';
      case 'daily': return 'Daily Calibration';
      case 'daily-challenge': return 'Daily Challenge';
      default: return 'Practice Mode';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background to-muted relative overflow-hidden">
      {/* Ambient background animation when idle */}
      <AnimatePresence>
        {showAmbientAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
          >
            <AmbientBackground variant="draw" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header 
        className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border/50 relative z-20"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={onReturnToHome}
          className="hover:bg-muted/50 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
        </Button>

        {/* Animated Logo */}
        <div className="w-10 h-10">
          <LogoAnimation size={40} />
        </div>

        <div className="w-10" /> {/* Spacer for balance */}
      </motion.header>

      {/* Mode Header */}
      <ModeHeaderDisplay mode={getModeDisplayName()} />

      {/* Active Brush and Theme Display */}
      <ActiveBrushThemeDisplay />

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
        <AnimatePresence mode="wait">
          {gamePhase === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-6"
            >
              <h2 className="text-xl font-semibold text-foreground">Get Ready</h2>
              <p className="text-muted-foreground">
                {mode === 'blind-draw' 
                  ? "You won't see the circle while drawing. Trust your instincts!"
                  : "Watch the circle, then recreate it in the same position"
                }
              </p>
              <Button 
                onClick={handleStart}
                size="lg"
                className="px-8 py-3 text-base animate-pulse"
              >
                Start Drawing
              </Button>
            </motion.div>
          )}

          {gamePhase === 'showing' && (
            <motion.div
              key="showing"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              <CircleDisplay 
                duration={3}
                onComplete={() => setGamePhase('drawing')}
                circleProps={gameState.targetCircle}
                isPenaltyMode={false}
              />
            </motion.div>
          )}

          {gamePhase === 'drawing' && (
            <motion.div
              key="drawing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full flex flex-col items-center justify-center"
            >
              <CanvasDrawing
                drawingPoints={gameState.drawnPoints}
                targetCircle={gameState.targetCircle}
                strokeQuality={0.8}
                showGhostCircle={mode !== 'blind-draw'}
                showCompletedDrawing={false}
                fadeOpacity={1}
              />
              
              <div className="mt-4 flex gap-2">
                <ToneAwareButton
                  baseText="Try Again"
                  toneVariant="retry"
                  variant="outline"
                  onClick={handleRestart}
                  disabled={isDrawing}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                </ToneAwareButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ghost Trail Replay */}
        {gameState.drawnPoints.length > 0 && gamePhase === 'complete' && (
          <GhostTrailReplay 
            points={gameState.drawnPoints}
            targetCircle={gameState.targetCircle}
            showReplay={true}
          />
        )}
      </div>

      {/* First Draw Tutorial Overlay */}
      {isFirstDraw && (
        <FirstDrawTutorial
          onComplete={() => completeFirstDraw()}
          onStartPractice={() => onReturnToHome()}
          onStartDaily={() => onReturnToHome()}
        />
      )}
    </div>
  );
};

export default DrawingCanvas;
